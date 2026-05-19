'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { storage } from '../utils/storage';

const API = 'https://washmate-backend-ehm5.vercel.app';
const getToken = () => storage.getAuth()?.token || null;
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export function useMessages(orderId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Always use a plain string — vendor and student must join the SAME room
  const normalizedOrderId = orderId?.toString() || null;

  const fetchMessages = useCallback(async () => {
    if (!normalizedOrderId || !getToken()) {
      setMessages([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/messages?orderId=${normalizedOrderId}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response');
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('fetchMessages error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [normalizedOrderId]);

  useEffect(() => {
    if (!normalizedOrderId) return;

    fetchMessages();

    // ✅ FIX: Add error handling and reconnection logic
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    
    const connectSocket = () => {
      const socket = io(API, {
        transports: ['websocket'],
        auth: { token: getToken() },
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
      });
      
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socket.emit('join_order', normalizedOrderId);
        console.log('Joined room:', normalizedOrderId);
        setError(null); // Clear any previous socket errors
        reconnectAttempts = 0;
      });

      socket.on('new_message', (message) => {
        console.log('Socket received message:', message);
        setMessages(prev => {
          const exists = prev.some(
            m => m._id?.toString() === message._id?.toString()
          );
          if (exists) return prev;
          return [...prev, message];
        });
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setError('Connection error. Retrying...');
        reconnectAttempts++;
        
        if (reconnectAttempts >= maxReconnectAttempts) {
          setError('Unable to connect to chat. Please refresh the page.');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          socket.connect();
        }
      });

      return socket;
    };

    const socket = connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_order', normalizedOrderId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [normalizedOrderId, fetchMessages]);

  const sendMessage = useCallback(async (senderId, senderRole, senderName, content) => {
    if (!normalizedOrderId || !content?.trim()) return { success: false };
    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderId: normalizedOrderId, content: content.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true };
    } catch (err) {
      console.error('sendMessage error:', err);
      return { success: false, message: err.message };
    }
  }, [normalizedOrderId]);

  const markAsRead = useCallback(async () => {
    if (!normalizedOrderId) return;
    try {
      await fetch(`${API}/messages/read`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ orderId: normalizedOrderId }),
      });
    } catch (err) {
      console.error('markAsRead error:', err);
    }
  }, [normalizedOrderId]);

  return { messages, loading, error, sendMessage, markAsRead, refetch: fetchMessages };
}