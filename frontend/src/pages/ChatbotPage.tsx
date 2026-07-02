import { useState } from 'react';

const suggestedQuestions = [
  "How many products are in stock?",
  "Which products are low on stock?",
  "How many users are in the system?",
  "What is the total inventory value?",
  "Which category has the most products?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question?: string) => {
    const msg = question || input;
    if (!msg.trim()) return;
    const userMessage = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8000/api/chatbot/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🤖 Inventory Assistant</h1>
      <p className="text-gray-500 mb-4">Ask anything about your inventory!</p>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-lg shadow p-4 h-80 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-28"> Select a question above or type below!</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-500">Thinking... ⏳ </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Ask..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
}