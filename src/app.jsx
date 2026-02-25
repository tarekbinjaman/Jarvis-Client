import react, { useState } from "react";

const app = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const input = document.getElementById("message");
//   input.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//       sendMessage();
//     }
//   });
  const sendMessage = async() => {
    const message = document.getElementById("message").value;
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    document.getElementById("response").innerText = data.reply;
  }

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
        sendMessage();
        setMessage("")
    }
  }

  return (
    <div>
      <h2>Jarvis Chat</h2>
      <p id="response"></p>
      <div className="absolute bottom-6 -translate-x-1/2 left-1/2">
      <input
      className="border"
      placeholder="Type message..."
       id="message"
       value={message}
       onChange={(e) => setMessage(e.target.value)}
       onKeyDown={handleKeyDown}
       />
      <button
      className=""
      onclick="sendMessage()">Send</button>
      </div>
    </div>
  );
}

export default app;
