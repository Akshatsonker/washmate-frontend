'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageCenter } from '@/components/features/MessageCenter';

export default function VendorOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { user } = useAuth();
  const { orders, updateOrderStatus, loading } = useOrders();
  const [btnLoading, setBtnLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  const getId = (o: any) => o?._id?.toString() || o?.id?.toString();
  const order = orders.find((o: any) => getId(o) === orderId);

  const handleUpdateStatus = async (newStatus: string) => {
    setBtnLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setBtnLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':     return 'bg-yellow-100 text-yellow-800';
      case 'accepted':   return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'ready':      return 'bg-green-100 text-green-800';
      case 'delivered':  return 'bg-green-100 text-green-800';
      case 'rejected':   return 'bg-red-100 text-red-800';
      default:           return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ CRITICAL FIX: Return SAME structure on server and initial client render
  // Both server and client see this exact same HTML until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After mounted, show loading state or content
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">Loading order...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600 mb-4">Order not found</p>
                <Link href="/dashboard/vendor/orders">
                  <Button>Back to Orders</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const id = getId(order);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{id?.slice(-6)}
              </h1>
              <p className="text-gray-600 mt-1">
                From: {order.studentName || 'Student'}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </Badge>
          </div>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2">Customer Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="font-medium">{order.mobileNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{order.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room Number</p>
                      <p className="font-medium">{order.roomNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2 mt-2">Order Details</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium capitalize">{order.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{order.quantity} items</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-blue-600">&#8377;{order.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup Date</p>
                  <p className="font-medium">
                    {(() => {
                      if (!order.pickupDate) return 'N/A';
                      const d = new Date(order.pickupDate);
                      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
                    })()}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="bg-gray-50 p-2 rounded text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {order.status === 'placed' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleUpdateStatus('accepted')}
                    disabled={btnLoading}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    Accept Order
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={btnLoading}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Reject Order
                  </Button>
                </div>
              )}
              {order.status === 'accepted' && (
                <Button onClick={() => handleUpdateStatus('processing')} disabled={btnLoading}>
                  Start Processing
                </Button>
              )}
              {order.status === 'processing' && (
                <Button onClick={() => handleUpdateStatus('ready')} disabled={btnLoading}>
                  Mark as Ready
                </Button>
              )}
              {order.status === 'ready' && (
                <Button onClick={() => handleUpdateStatus('delivered')} disabled={btnLoading}>
                  Mark as Delivered
                </Button>
              )}
              {(order.status === 'delivered' || order.status === 'rejected') && (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  This order is {order.status}.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Chat Section */}
          {user && id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Customer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MessageCenter
                  orderId={id}
                  userId={user.id}
                  userName={user.name}
                  userRole="vendor"
                />
              </CardContent>
            </Card>
          )}

          <Link href="/dashboard/vendor/orders">
            <Button variant="outline" className="w-full">Back to Orders</Button>
          </Link>

        </div>
      </div>
    </div>
  );
}