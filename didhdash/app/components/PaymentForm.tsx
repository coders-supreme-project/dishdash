'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { confirmOrderPayment } from '../services/api';
import { useState } from 'react';

interface PaymentFormProps {
  clientSecret: string;
  cartItems: any[];
  orderId: string | null;
  onPaymentSuccess: () => void;
}

export function PaymentForm({ clientSecret, cartItems, orderId, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-success',
        },
        redirect: 'if_required',
      });

      if (error) {
        throw error;
      }

      if (paymentIntent?.status === 'succeeded') {
        await onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md">
        <CardElement />
      </div>
      <div>
        <h3>Your Cart Items:</h3>
        {cartItems.map(item => (
          <div key={item.id}>
            <span>{item.name} - ${item.price} x {item.quantity}</span>
          </div>
        ))}
      </div>
      <button 
        type="submit" 
        disabled={isProcessing || !stripe}
        className="w-full bg-yellow text-white py-2 rounded-xl mt-4"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 