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

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mt-5">Jarvis Chat</h2>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-11/12 mx-auto mt-5 ">
          <p className="text-white text-center transition-all duration-75 ease-in">
            {response}
          </p>
        </div>
      </div>

<div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full md:max-w-md max-w-2xl px-4">
  <div className="relative">
    <input
      className="w-full bg-gray-200 md:h-24 focus:outline-none px-4 py-3 rounded-full pl-12 pr-16 md:text-2xl"
      placeholder="Type message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
    />

    {/* Arrow Button */}
    <button
    onClick={()=>sendMessage(message)}
    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-green-500 cursor-pointer hover:bg-green-700">
      <GoArrowUp className="text-white text-4xl" />
    </button>
    {/* Microphone Button */}
    <button
      onClick={toggleListening}
      className={`absolute right-22 top-1/2 -translate-y-1/2 rounded-full p-3 transition cursor-pointer hover:bg-blue-800 ${
        listening ? "bg-red-500" : "bg-blue-600"
      }`}
    >
      <FaMicrophone className="text-white text-4xl" />
    </button>

  </div>
</div>
    </div>
  );
};

export default App;
