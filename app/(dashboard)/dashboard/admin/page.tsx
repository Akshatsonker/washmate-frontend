
'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/lib/hooks/useOrders';
import { storage } from '@/lib/utils/storage';
import { mockVendors, mockUsers } from '@/lib/utils/mockData';
import Link from 'next/link';

export default function AdminDashboard() {
  const { orders, loading, error } = useOrders();;
  
  const users = storage.getUsers();
  const vendors = mockVendors;

  const studentCount = users.filter(u => u.role === 'student').length;
  const vendorCount = users.filter(u => u.role === 'vendor').length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="flex h-screen bg-gray-50 pt-14 md:pt-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Admin Dashboard" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Platform Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor platform health, users, and transactions
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{studentCount} students, {vendorCount} vendors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{totalOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">{completedOrders} completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">{vendors.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Verified partners</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">
                    {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0'}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Platform health</p>
                </CardContent>
              </Card>
            </div>

            {/* User Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Users ({users.length})</CardTitle>
                <Link href="/dashboard/admin/users">
                  <Button size="sm" variant="outline">
                    Manage Users
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant="outline">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {users.length > 5 && (
                  <p className="text-sm text-gray-500 mt-4">
                    +{users.length - 5} more users
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Vendor Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Vendors ({vendors.length})</CardTitle>
                <Link href="/dashboard/admin/vendors">
                  <Button size="sm" variant="outline">
                    Manage Vendors
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-500">{vendor.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">⭐ {vendor.rating}</p>
                        <p className="text-xs text-gray-500">{vendor.totalOrders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/dashboard/admin/reports">
                  <Button size="sm" variant="outline">
                    View Reports
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.studentName}</p>
                        <p className="text-sm text-gray-500">
                          {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)} • {order.vendorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.price.toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
