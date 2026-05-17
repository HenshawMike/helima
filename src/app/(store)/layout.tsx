import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
