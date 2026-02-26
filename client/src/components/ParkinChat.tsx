import { useState, useEffect, useRef } from "react";
import { socket, visitor } from "@/lib/store";

interface Message {
  id: string;
  text: string;
  sender: "visitor" | "admin";
  timestamp: Date;
}

export default function ParkinChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasNewAdminMessage, setHasNewAdminMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync with state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleAkAHIveli8QABmT6NmTQgAAE5Hv4pVGAAAOjvDknEsAAAmK8OWgUAAABYbw5qRUAAABgvDnp1gAAP198OsA");
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear notification when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewAdminMessage(false);
    }
  }, [isOpen]);

  // Listen for messages from admin
  useEffect(() => {
    const handleAdminMessage = (data: { message: string; timestamp: string }) => {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: "admin",
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, newMsg]);

      // Show notification and play sound only if chat is NOT open
      if (!isOpenRef.current) {
        setHasNewAdminMessage(true);
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    socket.value.on("chat:fromAdmin", handleAdminMessage);

    return () => {
      socket.value.off("chat:fromAdmin", handleAdminMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "visitor",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, msg]);

    // Send to server via socket
    socket.value.emit("chat:fromVisitor", {
      visitorSocketId: visitor.value.socketId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Fixed bottom left */}
      <div
        className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* New Message Notification Bubble */}
        {hasNewAdminMessage && (
          <div className="absolute -top-10 left-0 bg-[#00565B] text-white text-sm px-3 py-1 rounded-lg shadow-lg animate-bounce whitespace-nowrap">
            New message from support
            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-[#00565B]"></div>
          </div>
        )}

        <div className={`transition-all duration-300 hover:scale-110 ${hasNewAdminMessage ? "ring-2 ring-[#29B6F6] ring-offset-2 rounded-full" : ""}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center" style={{background:'#29B6F6'}}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="10" stroke="white" strokeWidth="1.8" fill="none"/>
              <circle cx="11.5" cy="13" r="1" fill="white"/>
              <circle cx="18.5" cy="13" r="1" fill="white"/>
              <path d="M11 18c1 2 7 2 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#00565B] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/images/parkin-logo.png"
                  alt="Parkin"
                  className="w-10 h-10 object-contain bg-white rounded-full p-1"
                />
                <div>
                  <h3 className="font-bold text-sm">Parkin Support</h3>
                  <p className="text-xs text-[#3ECDC6]">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <img
                    src="/images/parkin-logo.png"
                    alt="Parkin"
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                  />
                  <p className="font-semibold text-[#00565B]">Welcome to Parkin</p>
                  <p className="text-sm">How can we help you today?</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === "visitor"
                          ? "bg-[#00565B] text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "visitor" ? "text-white/70" : "text-gray-400"}`}>
                        {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00565B]"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#00565B] text-white p-2 rounded-full transition hover:bg-[#004a4f] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
