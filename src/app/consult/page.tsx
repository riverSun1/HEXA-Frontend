'use client';

import { useState } from 'react';

export default function ConsultPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setMessages([
      { role: 'assistant', content: '안녕! INTJ인 너와 대화하게 되어 반가워. 오늘 어떤 관계 고민이 있어?' }
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // TODO: API 연동
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: '네 이야기를 듣고 있어. 더 자세히 말해줄 수 있어?' }]);
    }, 1000);
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
          <div className="text-6xl mb-6">💭</div>
          <h1 className="text-2xl font-bold text-pink-500 mb-4">MBTI 상담 시작하기</h1>
          <p className="text-gray-500 mb-8">
            5턴의 대화를 통해 당신의 관계 고민을 분석해드릴게요.
            <br />
            상담이 끝나면 맞춤형 솔루션을 제공해드려요!
          </p>
          <button
            onClick={handleStart}
            className="cursor-pointer px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            상담 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4">
          <h1 className="font-bold">MBTI 상담</h1>
          <p className="text-sm text-white/80">남은 턴: 4/5</p>
        </div>

        {/* 메시지 영역 */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-pink-400 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="고민을 말해주세요..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-pink-400 text-white rounded-full font-medium hover:bg-pink-500 transition"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}