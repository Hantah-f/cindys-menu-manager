import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Order } from '@/types/hotel';
import { useToast } from '@/hooks/use-toast';

interface KitchenDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const KitchenDashboard = ({ orders, onUpdateOrderStatus }: KitchenDashboardProps) => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    onUpdateOrderStatus(orderId, newStatus);
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'hotel-warning';
      case 'preparing':
        return 'hotel-info';
      case 'ready':
        return 'hotel-success';
      case 'delivered':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'pending') return order.status === 'pending';
    if (selectedTab === 'preparing') return order.status === 'preparing';
    if (selectedTab === 'ready') return order.status === 'ready';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="min-h-screen bg-gradient-warm p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Kitchen Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming orders and track preparation status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hotel-warning">{pendingCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preparing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hotel-info">{preparingCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ready for Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hotel-success">{readyCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="preparing">Preparing ({preparingCount})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({readyCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="bg-background border-border shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {order.guestName}
                          {order.roomNumber && ` - Room ${order.roomNumber}`}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.timestamp.toLocaleTimeString()}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <div className="p-2 bg-muted rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Special Instructions:</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                          className="flex-1"
                          variant="gold"
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          className="flex-1"
                          variant="luxury"
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          className="flex-1"
                          variant="outline"
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredOrders.length === 0 && (
              <Card className="bg-background border-border shadow-card">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    No {selectedTab} orders at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KitchenDashboard;