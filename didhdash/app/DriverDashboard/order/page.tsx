import { useEffect, useState } from 'react';

interface Order {
  id: number;
  status: string;
  createdAt: string;
}

interface OrderListProps {
  driverId: number;
}

const OrderList: React.FC<OrderListProps> = ({ driverId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/driver/${driverId}/orders`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [driverId]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Orders</h3>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
