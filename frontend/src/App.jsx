import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! Describe a game you're in the mood for and I'll find some recommendations.",
    },
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
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
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="input-bar">
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
    </>
  );
}

export default App;
