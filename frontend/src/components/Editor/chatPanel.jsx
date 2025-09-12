import { useEffect, useRef, useState } from 'react';
import socketService from '../../services/socket';

const ChatPanel = ({ roomId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const handleIncoming = (msg) => {
      // Filter by room to avoid cross-room noise
      if (msg?.roomId !== roomId) return;
      setMessages((prev) => [...prev, msg]);
    };

    socketService.onChatMessage(handleIncoming);
    return () => socketService.offChatMessage(handleIncoming);
  }, [roomId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const msg = {
      roomId,
      userId: currentUserId,
      text: trimmed,
      ts: Date.now()
    };
    socketService.emitChatMessage(msg);
    setMessages((prev) => [...prev, { ...msg, self: true }]);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">Chat</div>
      <div className="chat-messages" ref={listRef}>
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-msg ${m.self ? 'self' : ''}`}>
            <div className="chat-meta">
              <span className="chat-user">{m.self ? 'You' : m.userId?.slice(-4)}</span>
              <span className="chat-time">{new Date(m.ts).toLocaleTimeString()}</span>
            </div>
            <div className="chat-text">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
        />
        <button className="chat-send" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPanel;


