import React, { useState } from "react";
import { useParams } from 'react-router-dom'; 
import { useEffect } from 'react'; 

const conversations = [
  { id: 1, name: "Priya K.", avatar: "PK", lastMsg: "Is the room available?", time: "2m", unread: 0, online: true },
  { id: 2, name: "Ravi M.", avatar: "RM", lastMsg: "I'll check the balcony.", time: "1h", unread: 0, online: false },
  { id: 3, name: "Sneha T.", avatar: "ST", lastMsg: "Metro is very close!", time: "3h", unread: 1, online: true },
  { id: 4, name: "Aarav P.", avatar: "AP", lastMsg: "Bike parking is free.", time: "1d", unread: 0, online: false },
  { id: 5, name: "Nisha R.", avatar: "NR", lastMsg: "The gym is great here.", time: "5m", unread: 0, online: true },
  { id: 6, name: "Karan V.", avatar: "KV", lastMsg: "Cook charges are extra.", time: "10m", unread: 0, online: false },
];
const getMessagesFor = (name) => [
  { from: "them", text: `Hi! I saw your listing for ${name} and I'm really interested.`, time: "10:00 AM" },
  { from: "me", text: `Hey ${name}! Thanks for reaching out. What would you like to know?`, time: "10:05 AM" },
  { from: "them", text: "Is the room still available from next month?", time: "10:07 AM" },
  { from: "me", text: "Yes, it's available from the 1st!", time: "10:09 AM" },
];

export function MessagesPage() {
   const { id } = useParams();
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [input, setInput] = useState("");
 
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      // Find the conversation that matches the ID from the URL
      const selected = conversations.find(c => c.id == id);
      if (selected) {
        setActiveConv(selected);
        setMessages(getMessagesFor(selected.name.split(' ')[0]));
      }
    } else {
        const defaultConv = conversations[0];
        setActiveConv(defaultConv);
        setMessages(getMessagesFor(defaultConv.name.split(' ')[0]));
    }
  }, [id]);
  

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        from: "me",
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen pt-16 flex bg-black text-white" style={{ height: "100vh" }}>
      
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-purple-500/20 flex flex-col bg-gray-900">
        
        <div className="p-4 border-b border-purple-500/20">
          <h2 className="font-black font-display text-lg text-white">
            Messages
          </h2>

          <input
            placeholder="Search conversations..."
            className="mt-3 w-full bg-black border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConv(c)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-purple-500/10 ${
                activeConv.id === c.id
                  ? "bg-purple-500/10"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold">
                  {c.avatar}
                </div>

                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-white">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {c.time}
                  </span>
                </div>

                <div className="text-xs text-gray-400 truncate">
                  {c.lastMsg}
                </div>
              </div>

              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center">
                  {c.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-gray-900">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold">
                {activeConv.avatar}
              </div>

              {activeConv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900" />
              )}
            </div>

            <div>
              <div className="font-semibold text-sm text-white">
                {activeConv.name}
              </div>
              <div className="text-xs text-gray-400">
                {activeConv.online ? "Online now" : "Offline"}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all text-sm">
              📞
            </button>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all text-sm">
              📋
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center text-xs text-gray-600 mb-2">
            Today
          </div>

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  m.from === "me"
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-gray-800 text-white rounded-bl-sm border border-purple-500/20"
                }`}
              >
                <p>{m.text}</p>

                <p
                  className={`text-[10px] mt-1 text-right ${
                    m.from === "me"
                      ? "text-white/60"
                      : "text-gray-500"
                  }`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={send}
          className="p-4 border-t border-purple-500/20 flex gap-3 bg-gray-900"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-40 text-sm"
          >
            Send →
          </button>
        </form>

      </div>
    </div>
  );
}