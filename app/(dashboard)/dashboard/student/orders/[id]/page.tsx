'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderTracker } from '@/components/features/OrderTracker';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const getId = (o) => o?._id || o?.id || '';
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();
  
  // ✅ FIX HYDRATION: Add mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const order = orders.find(o => (o._id === orderId || o.id === orderId));

  // ✅ SAFE DATE PARSING
  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  const formatDeliveryDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'ready':
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ Show loading shell on server and client until mounted
  if (!mounted || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav title="Order Details" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav title="Order Details" />
          <div className="flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">Order not found</p>
                <Link href="/dashboard/student/orders">
                  <Button className="mt-4">Back to Orders</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Order Details" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{getId(order).slice(-8)}
                </h1>
                <p className="text-gray-600 mt-2">
                  {order.serviceType}
                </p>
              </div>

              <Badge className={`${getStatusColor(order.status)} text-base px-4 py-2`}>
                {order.status}
              </Badge>
            </div>

            {/* Order Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTracker order={order} />
              </CardContent>
            </Card>

            {/* Helpline */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-gray-700">
                📞 Need help? Contact Keshav at:
              </p>
              <p className="font-semibold text-blue-600">
                +91 62074 83176
              </p>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-semibold text-gray-900">
                      {order.serviceType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold text-gray-900">
                      {order.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Price per Unit</p>
                    <p className="font-semibold text-gray-900">
                      ₹{order.quantity
                        ? (order.price / order.quantity).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-xl text-blue-600">
                      ₹{order.price.toFixed(2)}
                    </p>
                  </div>

                </CardContent>
              </Card>

              {/* Right */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-600">Vendor</p>
                    <p className="font-semibold text-gray-900">
                      {order.vendorName || 'WashMate Laundry'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      Shop near Mega Mess
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(order.pickupDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Expected Delivery</p>
                    <p className="font-semibold text-gray-900">
                      {formatDeliveryDate(order.pickupDate)}
                    </p>
                  </div>

                  {order.studentPhone && (
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-semibold text-gray-900">
                        {order.studentPhone}
                      </p>
                    </div>
                  )}

                </CardContent>
              </Card>

            </div>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Actions - ✅ FIX: Use _id instead of id */}
            <div className="flex gap-4">
              <Link href="/dashboard/student/orders" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back
                </Button>
              </Link>

              <Link href={`/dashboard/student/messages?order=${getId(order)}`} className="flex-1">
                <Button className="w-full">
                  💬 Message Vendor
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}