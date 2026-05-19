'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCenter } from '@/components/features/MessageCenter';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';

export default function VendorMessagesPage() {
  const searchParams = useSearchParams();
  const selectedOrderId = searchParams.get('order');

  const { user } = useAuth();
  const { orders } = useOrders(user?.id, 'vendor'); // ✅ vendor role
  const getId = (o)=> o?._id || o?.id;
  const selectedOrder = selectedOrderId
    ? orders.find(o => (o._id || o.id) === selectedOrderId)
    : orders.length > 0
    ? orders[0]
    : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Vendor Messages" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Communicate with students about orders
              </p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-8">
                    No orders yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Orders List */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Orders</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {orders.map((order) => (
                        <Link
                          key={getId(order)}
                          href={`/dashboard/vendor/messages?order=${getId(order)}`}
                          className={`block p-3 rounded transition-colors ${
                            (selectedOrder?._id || selectedOrder?.id) === (order._id || order.id)
                              ? 'bg-blue-100 border-l-4 border-blue-600'
                              : 'border-l-4 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <p className="font-medium text-sm text-gray-900">
                            {order.serviceType}
                          </p>

                          <p className="text-xs text-gray-600 mt-1">
                            {order.studentName || 'Student'}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            #{getId(order)?.slice(-6)}
                          </p>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Section */}
                <div className="md:col-span-3">
                  {selectedOrder ? (
                    <div className="space-y-4">

                      {/* Order Info */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex justify-between">

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {selectedOrder.serviceType}
                              </h3>

                              <p className="text-sm text-gray-600 mt-1">
                                Student: {selectedOrder.studentName || 'Unknown'}
                              </p>

                              <p className="text-sm text-gray-500">
                                Status: {selectedOrder.status}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="font-medium text-gray-900">
                                ₹{selectedOrder.price}
                              </span>

                              <Link href={`/dashboard/vendor/orders`}>
                                <button className="text-xs text-blue-600 mt-2 hover:underline">
                                  View Orders →
                                </button>
                              </Link>
                            </div>

                          </div>
                        </CardContent>
                      </Card>

                      {/* Chat */}
                      {user && (
                        <MessageCenter
                          orderId={selectedOrder._id || selectedOrder.id}
                          userId={user.id}
                          userName={user.name}
                          userRole="vendor"
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