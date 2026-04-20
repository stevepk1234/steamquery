import { useState, useRef, useCallback, useEffect } from "react";
import GameBackground from "./GameBackground";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message))
      .catch(() => setBackendStatus("Failed to connect to backend."));
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    if (text.startsWith("/games ")) {
      const names = text
        .slice("/games ".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      try {
        const results = await Promise.all(
          names.map((name) =>
            fetch(`/api/apps?name=${encodeURIComponent(name)}&limit=1`).then(
              (res) => {
                if (!res.ok) throw new Error(`No results for "${name}"`);
                return res.json();
              },
            ),
          ),
        );
        const games = results.flat().map((app) => ({
          appId: app._id,
          name: app.name,
          blurb: app.tags ? app.tags.join(", ") : "",
        }));
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "recommendation",
            intro: `Found ${games.length} game${games.length !== 1 ? "s" : ""}:`,
            games,
            note: "",
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Error: ${err.message}` },
        ]);
      }
      setLoading(false);
    } else {
      try {
        const res = await fetch("/llm/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-oss-120b",
            messages: [{ role: "user", content: text }],
          }),
        });
        if (!res.ok) throw new Error(`LLM request failed (${res.status})`);
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "No response.";
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Error: ${err.message}` },
        ]);
      }
      setLoading(false);
    }
  }

  const textareaRef = useRef(null);

  const autoResize = useCallback((el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  function handleInput(e) {
    setInput(e.target.value);
    autoResize(e.target);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }

  return (
    <>
      <GameBackground visible={messages.length === 0} slow={input.length > 0} />
      <div className="topbar">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="#1a9fff"
            strokeWidth="1.5"
            fill="rgba(26,159,255,0.12)"
          />
          <circle cx="14" cy="14" r="6" fill="rgba(26,159,255,0.3)" />
          <circle cx="14" cy="14" r="2.5" fill="#66c0f4" />
        </svg>
        <span className="logo-text">
          Steam<span>Rec</span>
        </span>
        {backendStatus && (
          <span className="backend-status">{backendStatus}</span>
        )}
      </div>

      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="hero">
            <h1 className="hero-title">
              What kind of game are you looking for today?
            </h1>
            <p className="hero-subtitle">
              Describe a vibe, genre, or game you loved and we'll find the
              perfect fit for you.
            </p>
            <div className="input-bar hero-input">
              <div className="input-inner">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Describe a game you'd like to play..."
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-column">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div
                  className={`avatar ${msg.role === "bot" ? "bot-avatar" : "user-avatar"}`}
                >
                  {msg.role === "bot" ? "SR" : "You"}
                </div>
                <div
                  className={`bubble ${msg.role === "bot" ? "bot-bubble" : "user-bubble"}`}
                >
                  {msg.type === "recommendation" ? (
                    <>
                      <p className="rec-intro">{msg.intro}</p>
                      <div className="game-chips">
                        {msg.games.map((g) => (
                          <a
                            key={g.appId}
                            className="game-chip"
                            href={`https://store.steampowered.com/app/${g.appId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              className="chip-art"
                              src={`https://cdn.akamai.steamstatic.com/steam/apps/${g.appId}/header.jpg`}
                              alt={g.name}
                              loading="lazy"
                            />
                            <span className="chip-name">{g.name}</span>
                            <span className="chip-blurb">{g.blurb}</span>
                          </a>
                        ))}
                      </div>
                      <p className="rec-note">{msg.note}</p>
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="avatar bot-avatar">SR</div>
                <div className="bubble bot-bubble">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="input-bar">
          <div className="input-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Describe a game you'd like to play..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
