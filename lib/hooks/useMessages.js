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

    // 🔄 Vercel does not support WebSockets, so we use HTTP polling every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
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
      
      const newMessage = await res.json();
      
      // ✅ Instantly show the message on the sender's screen
      setMessages(prev => [...prev, newMessage]);
      
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