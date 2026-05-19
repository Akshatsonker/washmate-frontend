'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const getId = (o: any) => o?._id || o?.id;

  const { orders, updateOrderStatus } = useOrders();

  const pendingOrders = orders.filter(o => o.status === 'placed');
  const activeOrders = orders.filter(o =>
    o.status === 'accepted' || o.status === 'processing' || o.status === 'ready'
  );
  const completedOrders = orders.filter(o =>
    o.status === 'delivered' || o.status === 'rejected'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderButtons = (order: any) => {
    const id = getId(order);

    return (
      <div
        className="flex gap-2 mt-4 flex-wrap"
        onClick={(e) => e.preventDefault()} // 🚨 prevent navigation
      >
        {order.status === 'placed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(id, 'accepted');
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Accept
          </button>
        )}

        {order.status === 'accepted' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(id, 'processing');
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            Start Processing
          </button>
        )}

        {order.status === 'processing' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(id, 'ready');
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Mark Ready
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(id, 'delivered');
            }}
            className="px-3 py-1 bg-black text-white rounded"
          >
            Delivered
          </button>
        )}

        {(order.status === 'placed' || order.status === 'accepted') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(id, 'rejected');
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Reject
          </button>
        )}
      </div>
    );
  };

  const renderCard = (order: any, faded = false) => (
    <Link
      key={getId(order)}
      href={`/dashboard/vendor/orders/${getId(order)}`} // ✅ NAVIGATION
      className="block"
    >
      <Card
        className={`p-4 mb-4 transition hover:bg-gray-50 cursor-pointer ${
          faded ? 'opacity-70' : ''
        }`}
      >
        <CardContent>
          <p className="font-semibold">
            {order.studentName || "Unknown user"}
          </p>

          <div className="text-sm text-gray-600 my-2 space-y-1">
            <p>📞 {order.mobileNumber || 'N/A'}</p>
            <p>📍 {order.address || 'N/A'}</p>
            <p>🚪 Room: {order.roomNumber || 'N/A'}</p>
          </div>

          <p className="mt-2">{order.serviceType}</p>
          <p>${order.price}</p>

          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>

          {!faded && renderButtons(order)}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Manage Orders" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            <h1 className="text-3xl font-bold">Order Management</h1>

            <Tabs defaultValue="pending">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {pendingOrders.map(order => renderCard(order))}
              </TabsContent>

              <TabsContent value="active">
                {activeOrders.map(order => renderCard(order))}
              </TabsContent>

              <TabsContent value="completed">
                {completedOrders.map(order => renderCard(order, true))}
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}