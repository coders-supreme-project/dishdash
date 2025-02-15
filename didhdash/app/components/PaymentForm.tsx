'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { confirmOrderPayment } from '../services/api';

interface PaymentFormProps {
  clientSecret: string;
  cartItems: Array<{ id: number; name: string; price: number; quantity: number }>;
}

export const PaymentForm = ({ clientSecret, cartItems }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      alert('Stripe not initialized');
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await confirmOrderPayment(paymentIntent.id);
        alert('Payment successful!');
        router.push('/food-order');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
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
        disabled={!stripe}
        className="w-full bg-yellow text-white py-2 rounded-xl font-medium disabled:opacity-50"
      >
        Pay Now
      </button>
    </form>
  );
}; 