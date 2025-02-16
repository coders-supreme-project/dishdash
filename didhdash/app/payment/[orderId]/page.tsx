'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '../../components/PaymentForm';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Stripe publishable key is missing');
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const clientSecret = searchParams?.get('clientSecret');
  const router = useRouter();

  if (!clientSecret) {
    return <div className="text-center p-8">Invalid payment session</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#ffd700',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
      },
    },
  };

  return (
    <div className="max-w-[600px] mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm 
          clientSecret={clientSecret} 
          orderId={params.orderId as string}
          onPaymentSuccess={() => {
            localStorage.removeItem('cartItems');
            router.push('/');
          }}
        />
      </Elements>
    </div>
  );
} 