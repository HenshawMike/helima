import { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: "Track Your Order ",
  description: "Check the real-time status of your premium purchases and imported designer goods order delivery using our tracking tool.",
  robots: {
    index: false,
    follow: false,
  },
  keywords: [
    "track order",
    "order tracking",
    "track shipment",
    "delivery status",
    "helima order tracing",
    "package tracker"
  ]
};

export default function Page() {
  return <TrackOrderClient />;
}
