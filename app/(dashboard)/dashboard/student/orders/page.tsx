'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/features/OrderForm';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';

export default function StudentOrdersPage() {
  const { user } = useAuth();
  const { orders, loading, error, refetch } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const getId= (o)=> o?._id || o?.id;
  const activeOrders = orders.filter(o => 
    o.status === 'placed' || o.status === 'accepted' || o.status === 'processing'
  );
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'rejected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="My Orders" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 mt-2">
                  Track and manage all your laundry orders
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showForm ? '✕ Cancel' : '+ New Order'}
              </button>
            </div>

            {/* New Order Form */}
            {showForm && user && (
              <OrderForm
                userId={user.id}
                userName={user.name}
                userMobile={user.mobileNumber}
                userAddress={user.address}
                userRoom={user.roomNumber}
                onOrderCreated={() => {
                  setShowForm(false);
                  refetch();
                }}
              />
            )}

            {/* Orders Tabs */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  Active ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger value="ready">
                  Ready ({readyOrders.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedOrders.length})
                </TabsTrigger>
              </TabsList>

              {/* Active Orders */}
              <TabsContent value="active" className="space-y-4">
                {activeOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No active orders</p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Create Order
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  activeOrders.map((order) => (
                    <Link
                      key={getId(order)}
                      href={`/dashboard/student/orders/${getId(order)}`}
                    >
                      <Card className="hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)}
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Vendor: {order.vendorName || 'Not assigned'}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${order.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">{order.quantity} kg/items</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>

              {/* Ready Orders */}
              <TabsContent value="ready" className="space-y-4">
                {readyOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500 py-8">No orders ready for pickup</p>
                    </CardContent>
                  </Card>
                ) : (
                  readyOrders.map((order) => (
                    <Link
                      key={getId(order)}
                      href={`/dashboard/student/orders/${getId(order)}`}
                    >
                      <Card className="border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)}
                                </h3>
                                <Badge className="bg-green-100 text-green-800">
                                  Ready for Pickup
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.vendorName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${order.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>

              {/* Completed Orders */}
              <TabsContent value="completed" className="space-y-4">
                {completedOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500 py-8">No completed orders yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedOrders.map((order) => (
                    <Link
                      key={getId(order)}
                      href={`/dashboard/student/orders/${getId(order)}`}
                    >
                      <Card className="hover:border-gray-400 transition-all cursor-pointer opacity-75">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)}
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status === 'delivered' ? 'Delivered' : 'Rejected'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(order.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${order.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
