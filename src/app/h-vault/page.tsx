'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          adminFetch('/api/admin/orders'),
          adminFetch('/api/admin/products'),
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          console.error('Failed to load dashboard data');
          setLoading(false);
          return;
        }

        const orders = await ordersRes.json();
        const products = await productsRes.json();
        
        // Calculate dynamic stats
        const paidOrders = orders.filter((o: any) => {
          const status = o.status?.toLowerCase();
          return status === 'not_shipped' || status === 'shipped' || status === 'delivered';
        });
        const revenue = paidOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
        const pending = orders.filter((o: any) => o.status?.toLowerCase() === 'pending').length;
        const activeProds = products.filter((p: any) => p.isActive !== false).length;

        setStats({
          totalRevenue: revenue,
          pendingOrders: pending,
          activeProducts: activeProds,
        });

        // Set recent orders (take top 5)
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-[var(--navy)] font-bold animate-pulse text-sm uppercase tracking-widest py-8">
        Retrieving Dashboard Insights...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-8 border-b-4 border-[var(--navy)] pb-4">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
        <div className="border-4 border-[var(--navy)] p-6 bg-[var(--navy)] text-[var(--white)] relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--gold)]"></div>
          <h2 className="uppercase tracking-widest text-xs font-bold mb-2 opacity-80">Total Revenue</h2>
          <div className="text-4xl font-black">₦{stats.totalRevenue.toFixed(2)}</div>
        </div>
        
        <div className="border-4 border-[var(--navy)] p-6 bg-white">
          <h2 className="text-[var(--navy)] uppercase tracking-widest text-xs font-bold mb-2 opacity-60">Pending Orders</h2>
          <div className="text-4xl font-black text-[var(--navy)]">{stats.pendingOrders}</div>
        </div>

        <div className="border-4 border-[var(--navy)] p-6 bg-white">
          <h2 className="text-[var(--navy)] uppercase tracking-widest text-xs font-bold mb-2 opacity-60">Active Products</h2>
          <div className="text-4xl font-black text-[var(--navy)]">{stats.activeProducts}</div>
        </div>
      </div>

      <div className="border-4 border-[var(--navy)] p-4 sm:p-6 md:p-8 bg-white">
        <h2 className="text-2xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6 border-b-2 border-[var(--navy)] pb-2">
          Recent Activity
        </h2>
        
        {recentOrders.length === 0 ? (
          <p className="text-[var(--navy)] font-bold uppercase tracking-wider text-xs opacity-50 py-4">
            No recent activity. Once orders start coming in, they will appear here.
          </p>
        ) : (
          <div className="divide-y-2 divide-[var(--navy)]">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--navy)] opacity-60">#{order.id.slice(0, 8)}</span>
                    <span className="font-bold text-[var(--navy)] uppercase text-sm">{order.customerName}</span>
                  </div>
                  <div className="text-[10px] text-[var(--navy)] opacity-50 uppercase tracking-widest mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} &bull; {order.items?.length || 0} items
                  </div>
                </div>
                <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 mt-2 md:mt-0">
                  <span className="font-black text-[var(--navy)] text-md">₦{order.totalPrice?.toFixed(2)}</span>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                    order.status?.toLowerCase() === 'pending'
                      ? 'border-[var(--gold)] text-[var(--gold)] bg-yellow-50'
                      : order.status?.toLowerCase() === 'cancelled'
                      ? 'border-red-600 text-red-600 bg-red-50'
                      : 'border-green-600 text-green-600 bg-green-50' // not_shipped, shipped, delivered
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
