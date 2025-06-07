"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function VocabAssistPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [avatarUrl, setAvatarUrl] = useState("https://randomuser.me/api/portraits/men/32.jpg");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("");
  const [chat, setChat] = useState([
    { type: "bot", text: "Hi! Click Start Recording and speak to begin." },
  ]);
  const [micDisabled, setMicDisabled] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session]);

  const startListening = async () => {
    setIsListening(true);
    setStatus("Recording...");
    setMicDisabled(true);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        setStatus("AI is responding...");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recorded_audio.webm");
        setChat((prev) => [
          ...prev,
          { type: "user", text: "[User audio input]" },
        ]);
        try {
          const res = await fetch("http://127.0.0.1:5000/converse", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          setChat((prev) => [
            ...prev,
            { type: "bot", text: data.ai_response || JSON.stringify(data) },
          ]);
        } catch (err) {
          setChat((prev) => [
            ...prev,
            { type: "bot", text: "Connection error. Is the server running?" },
          ]);
        }
        setIsListening(false);
        setMicDisabled(false);
        setStatus("");
      };
      mediaRecorder.start();
    } catch (err) {
      setStatus("Microphone access denied or not supported.");
      setIsListening(false);
      setMicDisabled(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setStatus("");
    setMicDisabled(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ece9e6] to-[#fff] font-['Inter','Segoe_UI',Arial,sans-serif]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">🎙️ AI Voice Chat</h2>
        {/* Avatar Section */}
        <section className={`avatar-section mb-6 relative flex flex-col items-center justify-center ${isListening ? 'recording' : ''}`}
          style={{ width: 160, height: 160 }}>
          <div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              background: isListening
                ? "radial-gradient(circle at 50% 50%, #a5d6a7 0%, transparent 70%)"
                : "transparent",
              opacity: isListening ? 1 : 0,
              transition: "opacity 0.4s"
            }}
          ></div>
          <div
            className="flex items-center justify-center rounded-full shadow"
            style={{ width: 140, height: 140, background: "#f3f3f3", overflow: "hidden" }}
          >
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={140}
              height={140}
              className="object-cover rounded-full"
              onError={() => setAvatarUrl("https://randomuser.me/api/portraits/men/32.jpg")}
            />
          </div>
        </section>
        {/* Controls */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-7 py-3 rounded-full font-semibold text-white text-base flex items-center gap-2 shadow transition-all duration-200 ${isListening ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'}`}
            onClick={startListening}
            disabled={isListening || micDisabled}
          >
            <span className="text-xl">🎤</span> Start Recording
          </button>
          <button
            className={`px-7 py-3 rounded-full font-semibold text-white text-base flex items-center gap-2 shadow transition-all duration-200 ${!isListening ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={stopListening}
            disabled={!isListening}
          >
            <span className="text-xl">⏹️</span> Stop Recording
          </button>
        </div>
        {/* Recording Indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-green-800 font-semibold mb-2 animate-pulse">
            <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span> Recording...
          </div>
        )}
        {/* Chat Box */}
        <div className="chat-box w-full max-h-80 overflow-y-auto flex flex-col gap-4 bg-[#fafbfc] rounded-xl p-4 shadow-inner mt-2" style={{ minHeight: 120 }}>
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`message rounded-xl px-4 py-3 shadow text-base max-w-[75%] ${msg.type === 'user' ? 'self-end bg-blue-100 text-blue-900' : 'self-start bg-purple-50 text-purple-900'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}