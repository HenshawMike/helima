export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-8 border-b-4 border-[var(--navy)] pb-4">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="border-4 border-[var(--navy)] p-6 bg-[var(--navy)] text-[var(--white)]">
          <h2 className="uppercase tracking-widest text-xs font-bold mb-2">Total Revenue</h2>
          <div className="text-4xl font-black">$0.00</div>
        </div>
        <div className="border-4 border-[var(--navy)] p-6">
          <h2 className="text-[var(--navy)] uppercase tracking-widest text-xs font-bold mb-2">Pending Orders</h2>
          <div className="text-4xl font-black text-[var(--navy)]">0</div>
        </div>
        <div className="border-4 border-[var(--navy)] p-6">
          <h2 className="text-[var(--navy)] uppercase tracking-widest text-xs font-bold mb-2">Active Products</h2>
          <div className="text-4xl font-black text-[var(--navy)]">0</div>
        </div>
      </div>

      <div className="border-4 border-[var(--navy)] p-8">
        <h2 className="text-2xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6">Recent Activity</h2>
        <p className="text-[var(--navy)] font-medium">No recent activity. Once orders start coming in, they will appear here.</p>
      </div>
    </div>
  );
}
