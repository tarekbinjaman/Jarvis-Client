import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { GoArrowUp } from "react-icons/go";

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
      new window.SpeechRecognition() || new window.webkitSpeechRecognition();

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
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🚀 Send Message
  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;
    if (!finalMessage.trim()) return;

    try {
      const res = await fetch("https://jarvis-server-1vw5.onrender.com/chat", {
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

  useEffect(() => {
    fetch('https://jarvis-20-ebon.vercel.app/ping')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      
      {/* Header */}
      <h2 className="text-center text-3xl font-bold py-6 tracking-wide">
        Jarvis Chat
      </h2>

      {/* Response Area */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <p className="text-center text-lg md:text-xl leading-relaxed transition-all duration-200">
            {response}
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20">

          <input
            className="w-full bg-transparent h-16 md:h-20 focus:outline-none px-6 pr-28 text-base md:text-lg placeholder-gray-300"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Microphone Button */}
          <button
            onClick={toggleListening}
            className={`absolute right-16 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 shadow-md ${
              listening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <FaMicrophone className="text-white text-xl md:text-2xl" />
          </button>

          {/* Send Button */}
          <button
            onClick={() => sendMessage(message)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-md"
          >
            <GoArrowUp className="text-white text-xl md:text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
