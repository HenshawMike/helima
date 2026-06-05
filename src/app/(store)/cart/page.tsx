import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: "Cart | Helima",
  description: "Review the premium garments, luxury jackets, designer streetwear, and lifestyle accessories in your cart before proceeding to our secure checkout.",
  robots: {
    index: false,
    follow: false,
  },
  keywords: [
    "shopping cart",
    "review items",
    "premium goods checkout",
    "buy fashion accessories",
    "cart checkout",
    "secure transaction cart"
  ]
};

export default function Page() {
  return <CartClient />;
}
