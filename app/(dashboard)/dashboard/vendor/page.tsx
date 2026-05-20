/*
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import { mockVendors } from '@/lib/utils/mockData';
import Link from 'next/link';

export default function VendorDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders(user?.id, 'vendor');
  
  // Get vendor info
  const vendor = mockVendors.find(v => v.id === user?.id) || {
    id: user?.id,
    name: user?.name,
    rating: 4.5,
    totalOrders: 0,
    acceptanceRate: 0.95,
  };

  const pendingOrders = orders.filter(o => o.status === 'placed');
  const activeOrders = orders.filter(o => 
    o.status === 'accepted' || o.status === 'processing'
  );
  const completedOrders = orders.filter(o => 
    o.status === 'delivered'
  );

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
        <TopNav title="Vendor Dashboard" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */
            
           /*
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vendor.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage orders, track analytics, and grow your business
              </p>
            </div>

            {/* Stats */
            
           /*
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{activeOrders.length}</p>
                  <p className="text-xs text-gray-500 mt-1">In progress</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">⭐ {vendor.rating}</p>
                  <p className="text-xs text-gray-500 mt-1">{vendor.totalOrders} reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Orders */
            
           /*
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>New Order Requests ({pendingOrders.length})</CardTitle>
                <Link href="/dashboard/vendor/orders">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {pendingOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending orders</p>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/dashboard/vendor/orders/${order.id}`}
                        className="block p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{order.studentName}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Service: {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{order.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{order.quantity} items</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */
            /*
            <Card>
              <CardHeader>
                <CardTitle>Store Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/dashboard/vendor/orders">
                    <Button className="w-full" size="lg">
                      📥 Orders
                    </Button>
                  </Link>
                  <Link href="/dashboard/vendor/analytics">
                    <Button variant="outline" className="w-full" size="lg">
                      📈 Analytics
                    </Button>
                  </Link>
                  <Link href="/dashboard/vendor/settings">
                    <Button variant="outline" className="w-full" size="lg">
                      ⚙️ Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
  */
'use client';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import { mockVendors } from '@/lib/utils/mockData';
import Link from 'next/link';

export default function VendorDashboard() {
  const { user } = useAuth();

  // ✅ FIX: fallback vendor id (for single vendor app)
  const vendorId =  "vendor-1";
  const getId = (o) => o?._id || o?.id;
  const { orders, loading, error } = useOrders();

  // Get vendor info
  const vendor = mockVendors.find(v => v.id === vendorId) || {
    id: vendorId,
    name: user?.name || "Laundry Store",
    rating: 4.5,
    totalOrders: 0,
    acceptanceRate: 0.95,
  };

  // ✅ Order filters
  const pendingOrders = orders.filter(o => o.status === 'placed');
  const activeOrders = orders.filter(
    o => o.status === 'accepted' || o.status === 'processing'
  );
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Vendor Dashboard" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vendor.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage orders and track your business
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{pendingOrders.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders */}
            <Card>
              <CardHeader>
                <CardTitle>New Orders ({pendingOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingOrders.length === 0 ? (
                  <p className="text-center text-gray-500">No orders yet</p>
                ) : (
                  pendingOrders.map(order => (
                    <div key={getId(order)} className="border p-4 rounded mb-3">
                      <p><b>{order.studentName}</b></p>
                      <div className="text-sm text-gray-600 my-2 space-y-1">
                        <p>📞 {order.mobileNumber || 'N/A'}</p>
                        <p>📍 {order.address || 'N/A'}</p>
                        <p>🚪 Room: {order.roomNumber || 'N/A'}</p>
                      </div>
                      <p className="mt-2 text-gray-800">{order.serviceType}</p>
                      <p className="text-gray-800">{order.quantity} items</p>
                      <p className="font-medium">₹{order.price}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/dashboard/vendor/orders">
                <Button>📥 Orders</Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
