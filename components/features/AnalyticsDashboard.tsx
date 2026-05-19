'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsDashboard({ orders }) {
  const [timeRange, setTimeRange] = useState('daily');

  const analytics = useMemo(() => {
    const completed = orders.filter(o => o.status === 'delivered');
    const totalRevenue = completed.reduce((sum, o) => sum + o.price, 0);
    const totalOrders = orders.length;
    const completedCount = completed.length;
    const rejectedCount = orders.filter(o => o.status === 'rejected').length;

    // Service breakdown
    const serviceMap = {};
    orders.forEach(o => {
      serviceMap[o.serviceType] = (serviceMap[o.serviceType] || 0) + 1;
    });
    const serviceBreakdown = Object.entries(serviceMap).map(([service, count]) => ({
      name: service.charAt(0).toUpperCase() + service.slice(1),
      value: count,
    }));

    // Revenue by date (mock)
    const revenueByDate = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOrders = orders.filter(
        o => new Date(o.createdAt).toDateString() === date.toDateString() && o.status === 'delivered'
      );
      const revenue = dayOrders.reduce((sum, o) => sum + o.price, 0);
      revenueByDate.push({
        name: dateStr,
        revenue: revenue,
      });
    }

    return {
      totalRevenue,
      totalOrders,
      completedCount,
      rejectedCount,
      completionRate: totalOrders > 0 ? ((completedCount / totalOrders) * 100).toFixed(1) : '0',
      serviceBreakdown,
      revenueByDate,
    };
  }, [orders]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              ₹{analytics.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">From completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{analytics.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.completedCount} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{analytics.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.rejectedCount} rejected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              ₹{analytics.totalOrders > 0 
                ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2)
                : '0.00'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="services">Service Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue by Date</CardTitle>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map(range => (
                    <Badge
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    formatter={(value) => `₹${value.toFixed(2)}`}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Service Type</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {analytics.serviceBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.serviceBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No order data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Completed Orders</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-green-600">{analytics.completedCount}</p>
                <p className="text-xs text-gray-500">
                  {analytics.totalOrders > 0 
                    ? `(${((analytics.completedCount / analytics.totalOrders) * 100).toFixed(0)}%)`
                    : ''
                  }
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Rejected Orders</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-red-600">{analytics.rejectedCount}</p>
                <p className="text-xs text-gray-500">
                  {analytics.totalOrders > 0 
                    ? `(${((analytics.rejectedCount / analytics.totalOrders) * 100).toFixed(0)}%)`
                    : ''
                  }
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics.totalOrders - analytics.completedCount - analytics.rejectedCount}
                </p>
                <p className="text-xs text-gray-500">
                  {analytics.totalOrders > 0 
                    ? `(${(((analytics.totalOrders - analytics.completedCount - analytics.rejectedCount) / analytics.totalOrders) * 100).toFixed(0)}%)`
                    : ''
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
