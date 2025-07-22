import { useState, useEffect } from 'react';
import KitchenDashboard from '@/components/KitchenDashboard';
import { Order } from '@/types/hotel';

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Listen for new orders from localStorage or other state management
  useEffect(() => {
    const savedOrders = localStorage.getItem('hotelOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      }));
      setOrders(parsedOrders);
    }

    // Listen for storage changes to sync orders in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hotelOrders' && e.newValue) {
        const parsedOrders = JSON.parse(e.newValue).map((order: any) => ({
          ...order,
          timestamp: new Date(order.timestamp)
        }));
        setOrders(parsedOrders);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('hotelOrders', JSON.stringify(updatedOrders));
  };

  return (
    <KitchenDashboard 
      orders={orders} 
      onUpdateOrderStatus={handleUpdateOrderStatus} 
    />
  );
};

export default Kitchen;