import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

export interface Participant {
  userId: string;
  username: string;
  progress: number;
  wpm: number;
  isFinished: boolean;
  finishRank?: number;
}

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

export interface RoomInfo {
  id: string;
  code: string;
  hostId: string;
  text: string;
  status: string;
}

export type MultiplayerStatus = 'idle' | 'lobby' | 'countdown' | 'playing' | 'finished';

export function useMultiplayer() {
  const user = useSelector((state: RootState) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<MultiplayerStatus>('idle');
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/rooms', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('room:joined', ({ room, participants }) => {
      setRoom(room);
      setParticipants(participants);
      setStatus('lobby');
    });

    socket.on('room:participants', (parts: Participant[]) => {
      setParticipants(parts);
    });

    socket.on('room:player_joined', ({ username }) => {
      setMessages((prev) => [...prev, { username: 'System', message: `${username} joined the room`, timestamp: new Date().toISOString() }]);
    });

    socket.on('room:player_left', ({ username }) => {
      setMessages((prev) => [...prev, { username: 'System', message: `${username} left the room`, timestamp: new Date().toISOString() }]);
    });

    socket.on('room:countdown', ({ seconds }) => {
      setStatus('countdown');
      setCountdown(seconds);
    });

    socket.on('room:started', ({ text: roomText }) => {
      setText(roomText);
      setStatus('playing');
    });

    socket.on('room:player_progress', (data: Participant) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === data.userId ? { ...p, ...data } : p))
      );
    });

    socket.on('room:finished', ({ participants: final }) => {
      setParticipants(final);
      setStatus('finished');
    });

    socket.on('room:chat_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('room:rematch', ({ room: newRoom, participants: newParts }) => {
      setRoom(newRoom);
      setParticipants(newParts);
      setText('');
      setStatus('lobby');
    });

    socket.on('room:error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((roomCode: string) => {
    if (!user || !socketRef.current) return;
    setError(null);
    socketRef.current.emit('room:join', {
      roomCode,
      userId: user.id,
      username: user.username,
    });
  }, [user]);

  const startGame = useCallback(() => {
    if (!room || !user || !socketRef.current) return;
    socketRef.current.emit('room:start', { roomId: room.id, userId: user.id });
  }, [room, user]);

  const sendProgress = useCallback((progress: number, wpm: number) => {
    if (!room || !user || !socketRef.current) return;
    socketRef.current.emit('room:progress', { roomId: room.id, userId: user.id, progress, wpm });
  }, [room, user]);

  const sendChat = useCallback((message: string) => {
    if (!room || !user || !socketRef.current) return;
    socketRef.current.emit('room:chat', { roomId: room.id, username: user.username, message });
  }, [room, user]);

  const requestRematch = useCallback(() => {
    if (!room || !user || !socketRef.current) return;
    socketRef.current.emit('room:rematch', { roomId: room.id, userId: user.id });
  }, [room, user]);

  return {
    status, room, participants, countdown, text, messages, error,
    joinRoom, startGame, sendProgress, sendChat, requestRematch,
    isHost: room?.hostId === user?.id,
    currentUser: user,
  };
}
