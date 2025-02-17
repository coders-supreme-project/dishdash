'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';

interface PaymentFormProps {
  clientSecret: string;
  orderId: string | null;
  onPaymentSuccess: () => void;
}

export function PaymentForm({ clientSecret, orderId, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!elements) return;

    const element = elements.getElement(PaymentElement);
    if (!element) return;

    const handleReady = () => setIsReady(true);
    const handleError = (error: any) => {
      console.error('Payment Element load error:', error);
      setMessage('Failed to load payment form. Please refresh the page.');
    };

    element.on('ready', handleReady);
    element.on('loaderror', handleError);

    return () => {
      element.off('ready', handleReady);
      element.off('loaderror', handleError);
    };
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-success',
          payment_method_data: {
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
              email: 'customer@example.com', // Replace with actual customer email
              phone: '+1234567890', // Replace with actual customer phone
              address: {
                country: 'US' // Replace with actual country code
              }
            }
          }
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'Payment failed');
        throw error;
      }

      await onPaymentSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      setMessage('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md bg-white">
        <PaymentElement options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
          fields: {
            billingDetails: 'auto'
          }
        }} />
      </div>
      {message && <div className="text-red-500">{message}</div>}
      <button 
        type="submit" 
        disabled={isProcessing || !stripe || !isReady}
        className="w-full bg-yellow text-white py-2 rounded-xl mt-4 hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 