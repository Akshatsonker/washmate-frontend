'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCenter } from '@/components/features/MessageCenter';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentMessagesPage() {
  const searchParams = useSearchParams();
  const selectedOrderId = searchParams.get('order');
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const getId = (o) => o?._id || o?.id || '';
  
  // ✅ FIX: Add mounted state for hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const selectedOrder = selectedOrderId && selectedOrderId !== 'undefined'
    ? orders.find(o => getId(o) === selectedOrderId)
    : orders.length > 0
    ? orders[0]
    : null;

  // ✅ FIX: Show loading state
  if (!mounted || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav title="Messages" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Messages" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Communicate with vendors about your orders
              </p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don&apos;t have any orders yet</p>
                    <Link href="/dashboard/student/orders">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Create an Order
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Orders List */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {orders.map((order) => (
                        <Link
                          key={getId(order)}
                          // ✅ FIX: Use order, not selectedOrder
                          href={`/dashboard/student/messages?order=${getId(order)}`}
                          className={`block p-3 rounded cursor-pointer transition-colors ${
                            selectedOrder && getId(selectedOrder) === getId(order)
                              ? 'bg-blue-100 border-l-4 border-blue-600'
                              : 'border-l-4 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <p className="font-medium text-sm text-gray-900">
                            {order.serviceType}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {order.vendorName || 'Not assigned'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            #{getId(order).slice(-6)}
                          </p>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Message Center */}
                <div className="md:col-span-3">
                  {selectedOrder ? (
                    <div className="space-y-4">
                      {/* Order Context */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {selectedOrder.serviceType?.charAt(0).toUpperCase() + selectedOrder.serviceType?.slice(1) || 'Order'}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Vendor: {selectedOrder.vendorName || 'Not assigned'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {selectedOrder.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ₹{selectedOrder.price?.toFixed(2) || '0.00'}
                              </p>
                              <Link href={`/dashboard/student/orders/${getId(selectedOrder)}`}>
                                <button className="text-xs text-blue-600 hover:underline mt-2">
                                  View Order →
                                </button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Chat */}
                      {user && selectedOrder && (
                        <MessageCenter
                          orderId={getId(selectedOrder)}
                          userId={user.id}
                          userName={user.name}
                          userRole={user.role as 'student' | 'vendor' | 'admin'}
                        />
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500 py-8">
                          Select an order to start messaging
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}