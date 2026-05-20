'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';

export default function StudentHistoryPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ✅ Completed = delivered or rejected
  const historyOrders = orders.filter(
    (o: any) => o.status === 'delivered' || o.status === 'rejected'
  );

  const getId = (o: any) => o?._id?.toString() || o?.id?.toString() || '';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected':  return 'bg-red-100 text-red-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav title="Order History" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Order History" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600 mt-2">
                All your completed and rejected orders
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {orders.filter((o: any) => o.status === 'delivered').length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Completed Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{orders
                      .filter((o: any) => o.status === 'delivered')
                      .reduce((sum: number, o: any) => sum + (o.price || 0), 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Total Spent</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            {historyOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-16">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-gray-600 font-medium">No completed orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Your delivered and rejected orders will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {historyOrders.map((order: any) => {
                  const id = getId(order);
                  return (
                    <Link
                      key={id}
                      href={`/dashboard/student/orders/${id}`}
                      className="block"
                    >
                      <Card className="hover:border-gray-400 transition-colors cursor-pointer">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 capitalize">
                                  {order.serviceType}
                                </p>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                Vendor: {order.vendorName || 'WashMate Laundry'}
                              </p>
                              <p className="text-sm text-gray-400 mt-0.5">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="text-right ml-4 shrink-0">
                              <p className="font-bold text-gray-900">
                                ₹{order.price?.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {order.quantity} items
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}