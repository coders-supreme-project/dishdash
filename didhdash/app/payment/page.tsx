'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '../components/PaymentForm';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams?.get('clientSecret');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  if (!clientSecret) {
    return <div>Invalid payment session</div>;
  }

  return (
    <div className="max-w-[600px] mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm 
          clientSecret={clientSecret} 
          onSuccess={() => console.log('Payment successful')} 
          onError={(error) => console.error('Payment error', error)} 
        />
      </Elements>
    </div>
  );
} 