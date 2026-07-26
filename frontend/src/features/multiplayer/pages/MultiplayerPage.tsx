import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/axios';
import { useMultiplayer, type Participant, type ChatMessage } from '../hooks/useMultiplayer';
import { useTypingEngine } from '../../typing/hooks/useTypingEngine';

// ── Progress Bar ──────────────────────────────────────────────────────────────
function PlayerProgress({ p, isMe }: { p: Participant; isMe: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${isMe ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium text-sm ${isMe ? 'text-primary' : 'text-foreground'}`}>
          {p.username} {isMe && '(you)'}
          {p.isFinished && p.finishRank && (
            <span className="ml-2 text-xs text-muted-foreground">#{p.finishRank}</span>
          )}
        </span>
        <span className="text-xs text-muted-foreground">{p.wpm ? `${Math.round(p.wpm)} wpm` : '—'}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          animate={{ width: `${p.progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}

// ── Chat Panel ────────────────────────────────────────────────────────────────
function ChatPanel({ messages, onSend }: { messages: ChatMessage[]; onSend: (m: string) => void }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-64 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-border text-sm font-medium text-muted-foreground">Chat</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((m, i) => (
          <div key={i}>
            <span className={`font-semibold ${m.username === 'System' ? 'text-muted-foreground' : 'text-primary'}`}>
              {m.username}:&nbsp;
            </span>
            <span className="text-foreground">{m.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-border flex">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-2 bg-transparent text-sm outline-none"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-3 text-primary hover:text-primary/80 transition-colors text-sm font-medium">Send</button>
      </form>
    </div>
  );
}

// ── Main MultiplayerPage ──────────────────────────────────────────────────────
export default function MultiplayerPage() {
  const navigate = useNavigate();
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const {
    status, room, participants, countdown, text, messages, error,
    joinRoom, startGame, sendProgress, sendChat, requestRematch, isHost, currentUser,
  } = useMultiplayer();

  // Typing engine (only active when playing)
  const { typedChars, wpm, reset } = useTypingEngine({
    mode: 'words',
    timeLimit: 120, // 2 minutes max
    words: text || 'placeholder',
    isEnabled: status === 'playing',
  });

  // Reset engine when new text arrives
  useEffect(() => {
    reset();
  }, [text, reset]);

  // Send live progress to server
  useEffect(() => {
    if (status !== 'playing' || !text) return;
    const progress = Math.min(100, Math.round((typedChars.length / text.length) * 100));
    sendProgress(progress, wpm);
  }, [typedChars, wpm, status, text, sendProgress]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await api.post('/rooms', { maxPlayers: 5 });
      joinRoom(res.data.code);
    } catch {
      alert('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCodeInput.trim().length === 6) joinRoom(roomCodeInput.toUpperCase());
  };

  // ── IDLE: room selector ───────────────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 gap-8">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-4xl font-bold tracking-tighter text-primary">Multiplayer</h1>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 p-8 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </motion.button>
          <form onSubmit={handleJoin} className="flex-1 p-8 bg-card border border-border rounded-2xl flex flex-col gap-4">
            <label className="font-bold text-lg">Join Room</label>
            <input
              value={roomCodeInput}
              onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="ENTER CODE"
              className="text-center text-2xl font-mono tracking-widest px-4 py-3 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors uppercase"
            />
            <button type="submit" className="py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── LOBBY ─────────────────────────────────────────────────────────────────
  if (status === 'lobby') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Room Lobby</h2>
            <div className="px-4 py-2 bg-card border border-border rounded-lg font-mono text-xl font-bold tracking-widest">
              {room?.code}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Share the code with friends to invite them!</p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{participants.length} player(s)</p>
            {participants.map(p => (
              <div key={p.userId} className={`px-4 py-3 rounded-lg border flex items-center gap-3 ${p.userId === currentUser?.id ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {p.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{p.username}</span>
                {room?.hostId === p.userId && <span className="ml-auto text-xs text-primary font-medium">HOST</span>}
              </div>
            ))}
          </div>

          <ChatPanel messages={messages} onSend={sendChat} />

          {isHost ? (
            <button
              onClick={startGame}
              disabled={participants.length < 2}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {participants.length < 2 ? 'Waiting for players...' : 'Start Game'}
            </button>
          ) : (
            <p className="text-center text-muted-foreground text-sm">Waiting for the host to start...</p>
          )}
        </div>
      </div>
    );
  }

  // ── COUNTDOWN ────────────────────────────────────────────────────────────
  if (status === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-9xl font-bold text-primary"
          >
            {countdown}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────
  if (status === 'playing') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8">
        <div className="w-full max-w-4xl space-y-4 mb-6">
          {participants.map(p => (
            <PlayerProgress key={p.userId} p={p} isMe={p.userId === currentUser?.id} />
          ))}
        </div>
        <div className="w-full max-w-4xl p-6 bg-card border border-border rounded-2xl font-mono text-xl leading-loose">
          {text.split('').map((char, i) => {
            const typed = typedChars[i];
            let cls = 'text-muted-foreground/40';
            if (typed !== undefined) cls = typed === char ? 'text-primary' : 'text-destructive bg-destructive/20 rounded-sm';
            const isCurrent = i === typedChars.length;
            return (
              <span key={i} className="relative">
                {isCurrent && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary animate-pulse" />}
                <span className={cls}>{char}</span>
              </span>
            );
          })}
        </div>
        <div className="mt-4 w-full max-w-4xl">
          <ChatPanel messages={messages} onSend={sendChat} />
        </div>
      </div>
    );
  }

  // ── FINISHED ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl font-bold text-primary mb-8">Race Over!</h2>
      <div className="w-full max-w-xl space-y-3 mb-8">
        {[...participants]
          .sort((a, b) => (a.finishRank || 99) - (b.finishRank || 99))
          .map((p, i) => (
            <motion.div
              key={p.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-border bg-card'}`}
            >
              <span className="text-2xl font-bold text-muted-foreground w-8">#{i + 1}</span>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {p.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold">{p.username}</p>
                <p className="text-sm text-muted-foreground">{Math.round(p.wpm || 0)} WPM</p>
              </div>
              {i === 0 && <span className="text-2xl">🏆</span>}
            </motion.div>
          ))}
      </div>
      <div className="flex gap-4">
        {isHost && (
          <button onClick={requestRematch} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">
            Rematch
          </button>
        )}
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors">
          Back to Solo
        </button>
      </div>
    </div>
  );
}
