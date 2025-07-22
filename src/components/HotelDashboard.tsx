import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { menuItems, categoryNames } from '@/data/menuData';
import { MenuItem, CartItem, Order } from '@/types/hotel';
import MenuSection from './MenuSection';
import Cart from './Cart';
import { useToast } from '@/hooks/use-toast';
import hotelHeroImage from '@/assets/hotel-hero.jpg';

const HotelDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => item.available);
    
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    return items;
  }, [searchTerm, selectedCategory]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (guestInfo: { name: string; roomNumber?: string; notes?: string }) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      guestName: guestInfo.name,
      roomNumber: guestInfo.roomNumber,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1, // Including 10% service charge
      status: 'pending',
      timestamp: new Date(),
      notes: guestInfo.notes,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    
    // Save to localStorage for kitchen system sync
    localStorage.setItem('hotelOrders', JSON.stringify(updatedOrders));
    
    setCart([]);
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <div className="relative bg-gradient-navy text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${hotelHeroImage}')`,
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                Welcome to Cindy's Hotel
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Experience luxury dining with our comprehensive menu management system. 
                Fresh ingredients, exceptional service, and memorable flavors.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="gold" size="lg" className="shadow-glow">
                  View Menu
                </Button>
                <Button variant="luxury" size="lg" onClick={() => window.open('/kitchen', '_blank')}>
                  Kitchen Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-warm border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-warm border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-warm border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hotel-warning">{pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-warm border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Menu Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{menuItems.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <Card className="mb-6 bg-background border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'gold' : 'outline'}
                      onClick={() => setSelectedCategory('all')}
                      size="sm"
                    >
                      All Items
                    </Button>
                    {Object.entries(categoryNames).map(([key, name]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? 'gold' : 'outline'}
                        onClick={() => setSelectedCategory(key)}
                        size="sm"
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Items */}
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, items]) => (
                <MenuSection
                  key={category}
                  category={category}
                  items={items}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
              
              {Object.keys(groupedItems).length === 0 && (
                <Card className="bg-background border-border shadow-card">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground text-lg">
                      No items found matching your search criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;