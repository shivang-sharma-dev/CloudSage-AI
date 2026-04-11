import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { UserMessage, AssistantMessage, TypingIndicator } from './ChatMessage';

const SUGGESTED_QUESTIONS = [
  'What are my top 3 quick wins?',
  'What if I switch to Savings Plans?',
  'Explain the RDS recommendation',
  'Show high-priority items only',
];

export default function ChatPanel({ isOpen, onClose }) {
  const { chatMessages, sendChatMessage, isChatLoading, currentAnalysis } = useAnalysis();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, chatMessages]);

  const handleSend = async () => {
    const msg = inputValue.trim();
    if (!msg || isChatLoading) return;
    setInputValue('');
    await sendChatMessage(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay on mobile */}
      <div
        className="fixed inset-0 z-30 md:hidden"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full z-40 flex flex-col animate-slide-in-right"
        style={{
          width: '400px',
          background: '#111211',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'none',
        }}
        id="chat-panel"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(58,140,92,0.12)' }}
            >
              <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Ask CloudSage
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Follow-up on your analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            id="chat-panel-close-btn"
          >
            <X size={16} className="text-[#7e857e]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(58,140,92,0.1)' }}
              >
                <MessageSquare size={28} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Ask me anything about your analysis
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  I have full context of your infrastructure config and recommendations.
                </p>
              </div>
              {/* Suggested questions */}
              <div className="w-full space-y-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputValue(q);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:shadow-sm"
                    style={{
                      background: '#161816',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    id={`suggested-q-${i}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) =>
                msg.role === 'user' ? (
                  <UserMessage key={msg.id} message={msg} />
                ) : (
                  <AssistantMessage key={msg.id} message={msg} />
                )
              )}
              {isChatLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div
            className="flex items-end gap-2 rounded-xl p-1"
            style={{ border: '1.5px solid var(--border-color)', background: '#141614' }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              rows={1}
              className="flex-1 resize-none outline-none px-3 py-2 text-sm bg-transparent"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              id="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isChatLoading}
              className="w-9 h-9 rounded-lg flex items-center justify-center m-1 transition-all"
              style={{
                background: inputValue.trim() && !isChatLoading ? 'var(--accent-primary)' : '#202420',
                color: inputValue.trim() && !isChatLoading ? 'white' : '#7e857e',
              }}
              id="chat-send-btn"
            >
              {isChatLoading ? (
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'transparent', borderTopColor: 'currentColor' }}
                />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
