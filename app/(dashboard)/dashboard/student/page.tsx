'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOrders } from '@/lib/hooks/useOrders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  const getId = (o: any) => o._id || o.id;

  const activeOrders = orders.filter((o: any) =>
    ['placed', 'accepted', 'processing'].includes(o.status)
  );
  const completedOrders = orders.filter((o: any) =>
    ['delivered', 'rejected'].includes(o.status)
  );
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.price || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return '📋';
      case 'accepted': return '✅';
      case 'processing': return '⚙️';
      case 'ready': return '🎉';
      case 'delivered': return '🏠';
      case 'rejected': return '❌';
      default: return '📦';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Student Dashboard" />

        <div className="flex-1 overflow-auto">
          {/* Hero Header */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-8 pb-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-12" />

            <div className="relative">
              <p className="text-blue-200 text-sm font-medium mb-1">Good day 👋</p>
              <h1 className="text-white text-2xl font-bold mb-1">
                Welcome, {user?.name || 'Student'}!
              </h1>
              <p className="text-blue-200 text-sm">
                Track your laundry, stress-free 🧺
              </p>
            </div>
          </div>

          {/* Stats Cards — overlap the hero */}
          <div className="px-4 -mt-10 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              {/* Active Orders */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-sm">
                    📦
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Active</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{activeOrders.length}</p>
                <p className="text-xs text-gray-400 mt-1">orders in progress</p>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-sm">
                    ✅
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Done</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
                <p className="text-xs text-gray-400 mt-1">orders completed</p>
              </div>

              {/* Total Spent */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-sm">
                    💰
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Spent</p>
                </div>
                <p className="text-3xl font-bold text-purple-600">₹{totalSpent.toFixed(0)}</p>
                <p className="text-xs text-gray-400 mt-1">total amount</p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-sm">
                    📊
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Total</p>
                </div>
                <p className="text-3xl font-bold text-orange-600">{orders.length}</p>
                <p className="text-xs text-gray-400 mt-1">all time orders</p>
              </div>
            </div>
          </div>

          <div className="px-4 mt-6 space-y-5 pb-8">

            {/* Quick Actions */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <Link href="/dashboard/student/orders">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-center text-white shadow-md shadow-blue-200 active:scale-95 transition-transform">
                    <div className="text-2xl mb-1">📦</div>
                    <p className="text-xs font-semibold">New Order</p>
                  </div>
                </Link>

                <Link href="/dashboard/student/messages">
                  <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-4 text-center text-white shadow-md shadow-violet-200 active:scale-95 transition-transform">
                    <div className="text-2xl mb-1">💬</div>
                    <p className="text-xs font-semibold">Messages</p>
                  </div>
                </Link>

                <Link href="/dashboard/student/history">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-center text-white shadow-md shadow-emerald-200 active:scale-95 transition-transform">
                    <div className="text-2xl mb-1">📜</div>
                    <p className="text-xs font-semibold">History</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Active Orders List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Active Orders
                </h2>
                <Link href="/dashboard/student/orders">
                  <span className="text-xs text-blue-600 font-medium">View all →</span>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <div className="text-4xl mb-3">🧺</div>
                  <p className="text-gray-500 text-sm mb-4">No active orders yet</p>
                  <Link href="/dashboard/student/orders">
                    <button className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium">
                      Create Order
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrders.map((order: any) => (
                    <Link
                      key={getId(order)}
                      href={`/dashboard/student/orders/${getId(order)}`}
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-98 transition-all hover:shadow-md hover:border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm capitalize">
                                {order.serviceType}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {order.vendorName || 'Keshav Laundry'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">
                              ₹{order.price?.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mt-1 inline-block ${getStatusColor(order.status)}`}>
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            📅 Pickup: {order.pickupDate
                              ? new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                              : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.quantity} items
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

           
              
             

          </div>
        </div>
      </div>
    </div>
  );
}