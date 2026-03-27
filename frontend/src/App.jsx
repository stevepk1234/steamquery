import { useState } from "react";
import "./App.css";

const DEAD_SPACE_REPLY = {
  role: "bot",
  type: "recommendation",
  intro: "Here are my top picks based on your request:",
  games: [
    {
      appId: 1693980,
      name: "Dead Space",
      blurb:
        "A survival horror classic. You're engineer Isaac Clarke, stranded on a mining ship overrun by grotesque necromorphs. Strategic dismemberment, zero-gravity combat, and relentless atmosphere make this a must-play.",
    },
    {
      appId: 2101960,
      name: "Cronos: The New Dawn",
      blurb:
        "A whole new breed of survival horror emerges with Cronos: The New Dawn. Survive the brutal wastelands of the future, fight nightmarish merging creatures and jump back in time to harvest souls as you seek to uncover the origins of the apocalypse that wiped out humanity.",
    },
  ],
  note: "Each result includes rating, price, tags, related games, and a direct Steam store link.",
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }, DEAD_SPACE_REPLY]);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <>
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
      </div>

      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="hero">
            <h1 className="hero-title">
              What kind of game are you looking for today?
            </h1>
            <p className="hero-subtitle">
              Describe a vibe, a genre, or a game you loved — I'll find
              something for you.
            </p>
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
          </div>
        )}
      </div>

      <div className="input-bar">
        <div className="input-inner">
          <input
            type="text"
            placeholder="Describe a game you'd like to play..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
