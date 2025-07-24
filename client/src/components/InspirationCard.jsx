import React, { useEffect, useState } from "react";
import "./InspirationCard.css";

const quotes = [
  "✨ Write what disturbs you, what you fear, what you have not been willing to speak about. Be willing to be split open.",
  "💡 The scariest moment is always just before you start.",
  "🌱 Don’t bend; don’t water it down; don’t try to make it logical; don’t edit your own soul.",
  "🕊️ Fill your paper with the breathings of your heart.",
  "📖 Start writing, no matter what. The water does not flow until the faucet is turned on.",
];

const InspirationCard = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }, []);

  return (
    <div className="inspiration-card">
      <h3>💌 Daily Inspiration</h3>
      <p>{quote}</p>
    </div>
  );
};

export default InspirationCard;
