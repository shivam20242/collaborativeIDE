import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../../contexts/AuthContext';
import { roomsAPI } from '../../services/api';
import socketService from '../../services/socket';
import { runCodeRemotely } from '../../services/runner';
import './codeEditor.css';
import ChatPanel from './chatPanel';

const CodeEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const editorRef = useRef(null);
  const lastEmittedContent = useRef('');
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!roomId || !user) return;

    const initializeRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch room details
        const roomResponse = await roomsAPI.getRoom(roomId);
        setRoom(roomResponse.data);

        // Connect to socket
        socketService.connect();
        socketService.joinRoom(roomId, user._id);

        // Set up socket event listeners
        setupSocketListeners();

        setLoading(false);
      } catch (error) {
        setError('Failed to load room');
        console.error('Error initializing room:', error);
        setLoading(false);
      }
    };

    initializeRoom();

    // Cleanup on unmount
    return () => {
      socketService.leaveRoom();
      socketService.removeAllListeners();
    };
  }, [roomId, user]);

  const setupSocketListeners = () => {
    // Listen for document load
    socketService.onDocumentLoad((content) => {
      setCode(content || '');
      lastEmittedContent.current = content || '';
    });

    // Listen for text changes from other users
    socketService.onTextChange((data) => {
      if (data.userId !== user._id) {
        setCode(data.content);
        lastEmittedContent.current = data.content;
      }
    });

    // Listen for cursor position changes
    socketService.onCursorPosition((data) => {
      if (data.userId !== user._id && editorRef.current) {
        // Handle cursor position updates from other users
        // This would require more complex implementation for real-time cursors
        console.log('Cursor position from user:', data.userId, data.position);
      }
    });

    // Listen for user joined
    socketService.onUserJoined((userId) => {
      console.log('User joined:', userId);
      // You could add user to connected users list here
    });
  };

  const handleEditorChange = (value) => {
    setCode(value);
    
    // Debounce the socket emission to avoid too many updates
    if (value !== lastEmittedContent.current) {
      lastEmittedContent.current = value;
      socketService.emitTextChange(value);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLeaveRoom = () => {
    socketService.leaveRoom();
    navigate('/');
  };

  // Multi-language runner using Piston API; JS runs locally for speed
  const runCode = async () => {
    if (!editorRef.current) return;
    const currentCode = editorRef.current.getValue();
    const lang = (room?.language || '').toLowerCase();

    setShowTerminal(true);

    if (lang === 'javascript') {
      const logs = [];
      const captureConsole = {
        log: (...args) => logs.push(args.map(a => formatValue(a)).join(' ')),
        error: (...args) => logs.push('[error] ' + args.map(a => formatValue(a)).join(' ')),
        warn: (...args) => logs.push('[warn] ' + args.map(a => formatValue(a)).join(' '))
      };
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('console', currentCode);
        fn(captureConsole);
        setTerminalOutput(prev => prev + (prev ? '\n' : '') + (logs.join('\n') || '(no output)'));
      } catch (err) {
        setTerminalOutput(prev => prev + (prev ? '\n' : '') + `[exception] ${err?.message || String(err)}`);
      }
      return;
    }

    setTerminalOutput(prev => prev + (prev ? '\n' : '') + `[runner] Executing ${lang} code...`);
    const result = await runCodeRemotely(lang, currentCode);
    setTerminalOutput(prev => prev + (prev ? '\n' : '') + result.output);
  };

  const clearTerminal = () => setTerminalOutput('');

  const formatValue = (v) => {
    try {
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    } catch {
      return String(v);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Rooms
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="error-container">
        <h3>Room not found</h3>
        <p>The room you're looking for doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <div className="room-info">
          <h3>{room.name}</h3>
          <p className="room-description">{room.description}</p>
          <div className="room-meta">
            <span className="language">{room.language}</span>
            <span className="members">{room.members?.length || 0} members</span>
            <span className="visibility">{room.isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
        <div className="editor-actions">
          <button onClick={runCode} className="run-btn">▶ Run</button>
          <button onClick={() => setShowChat(v => !v)} className="toggle-terminal-btn">
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
          <button onClick={() => setShowTerminal(v => !v)} className="toggle-terminal-btn">
            {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
          </button>
          <button onClick={handleLeaveRoom} className="leave-room-btn">
            ← Leave Room
          </button>
        </div>
      </div>
      
      <div className={`content-row`}>
        <div className="editor-wrapper">
          <Editor
          height="100%"
          language={room.language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
            lineNumbers: 'on',
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto'
            }
          }}
          />
        </div>

        {showChat && (
          <ChatPanel roomId={roomId} currentUserId={user._id} />
        )}
      </div>

      {showTerminal && (
        <div className="terminal-panel">
          <div className="terminal-header">
            <span>Terminal</span>
            <div className="terminal-actions">
              <button className="terminal-btn" onClick={clearTerminal}>Clear</button>
            </div>
          </div>
          <pre className="terminal-output">{terminalOutput || 'Ready.'}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor