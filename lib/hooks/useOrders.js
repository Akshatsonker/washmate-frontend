'use client';

import { useCallback, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

const API = "https://washmate-backend-ehm5.vercel.app";

const getToken = () => storage.getAuth()?.token || null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ← must be here

  const fetchOrders = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/orders`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response format");

      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setOrders(prev =>
        prev.map(o =>
          (o._id === orderId || o.id === orderId)
            ? { ...o, status: newStatus }
            : o
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
      fetchOrders();
    }
  }, [fetchOrders]);

  const createOrder = useCallback(async (order) => {
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      fetchOrders();
      return { success: true, order: data };
    } catch (err) {
      console.error("Error creating order:", err);
      return { success: false, message: err.message };
    }
  }, [fetchOrders]);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setOrders(prev =>
        prev.filter(o => o._id !== orderId && o.id !== orderId)
      );
    } catch (err) {
      console.error("Error deleting order:", err);
      fetchOrders();
    }
  }, [fetchOrders]);

  const rejectOrder = useCallback((orderId) => {
    return updateOrderStatus(orderId, 'rejected');
  }, [updateOrderStatus]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    createOrder,
    deleteOrder,
    rejectOrder,
    refetch: fetchOrders,
  };
}