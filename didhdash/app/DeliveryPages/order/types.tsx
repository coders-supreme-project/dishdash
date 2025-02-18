export interface MenuItem {
    name: string;
    price: string;
  }
  
  export interface OrderItem {
    id: number;
    quantity: number;
    priceAtTimeOfOrder: number;
    menuItem: MenuItem;
  }
  
  export interface Order {
    id: number;
    customerId: number;
    restaurantId: number;
    driverId: number;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    paymentStatus: string;
    customer: {
      user: {
        email: string;
        phoneNumber: string;
      };
    };
    restaurant: {
      name: string;
      address: string;
    };
    orderItems: OrderItem[];
  }
  
 export  interface OrderResponse {
    success: boolean;
    data: {
      totalOrders: number;
      groupedOrders: {
        pending: Order[];
        prepared: Order[];
        confirmed: Order[];
        delivered: Order[];
        cancelled: Order[];
      };
    };
  }
  
  export interface AuthContextType {
    user?: {
      id: number;
    };
    token?: string;
  }