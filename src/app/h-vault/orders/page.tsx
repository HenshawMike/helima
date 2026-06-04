'use client';

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/firebase/firestore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  return (
    <div>
      <div className="mb-8 sm:mb-12 border-b-4 border-[var(--navy)] pb-6">
        <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
          Orders
        </h1>
      </div>

      {loading ? (
        <div className="text-[var(--navy)] font-bold animate-pulse text-xl uppercase tracking-widest">Scanning Logbooks...</div>
      ) : orders.length === 0 ? (
        <div className="border-4 border-[var(--navy)] border-dashed p-12 text-center">
          <p className="text-[var(--navy)] font-black uppercase tracking-widest text-xs opacity-40">No transactions recorded</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => (
            <div key={order.id} className="border-4 border-[var(--navy)] p-4 sm:p-6 md:p-8 group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b-2 border-[var(--navy)] pb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] opacity-50 mb-1">Order Identifier</div>
                  <div className="text-xl font-black text-[var(--navy)] uppercase tracking-tighter mb-4">#{order.id.slice(-8)}</div>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-[var(--navy)] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      {order.status || 'Pending'}
                    </div>
                    <div className="border-2 border-[var(--navy)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--navy)]">
                      {order.items?.length || 0} Items
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] opacity-50 mb-1">Total Value</div>
                  <div className="text-3xl font-black text-[var(--navy)] tracking-tighter">${order.totalPrice?.toFixed(2) || '0.00'}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] mb-4">Acquisition List</h4>
                  <ul className="space-y-3">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-sm font-bold text-[var(--navy)] uppercase">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="opacity-50">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[var(--navy)] border-dashed flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--navy)]">
                    Update Order State →
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          order.status === status 
                          ? 'bg-[var(--navy)] text-white border-[var(--navy)]' 
                          : 'border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--gold)] hover:border-[var(--gold)]'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
