import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition =
      new window.SpeechRecognition() ||
      new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const voiceText = event.results[event.results.length - 1][0].transcript;
      setMessage(voiceText);
      sendMessage(voiceText);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [listening]);

  // 🎙 Toggle Mic
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // 🔊 Text to Speech
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.4;
      utterance.pitch = 6;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🚀 Send Message
  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;
    if (!finalMessage.trim()) return;

    try {
      const res = await fetch("https://jarvis-20-ebon.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage }),
      });

      const data = await res.json();
      setResponse(data.reply);
      speak(data.reply);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mt-5">
        Jarvis Chat
      </h2>

      <div className="w-11/12 mx-auto mt-5">
        <p className="text-gray-700">{response}</p>
      </div>

      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <input
            className="bg-gray-200 focus:outline-none w-96 px-4 py-3 rounded-full"
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-3 transition ${
              listening ? "bg-red-500" : "bg-blue-600"
            }`}
            onClick={toggleListening}
          >
            <FaMicrophone className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;