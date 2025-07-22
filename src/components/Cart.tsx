import { CartItem } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (guestInfo: { name: string; roomNumber?: string; notes?: string }) => void;
}

const Cart = ({ cart, onUpdateQuantity, onClearCart, onPlaceOrder }: CartProps) => {
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Guest name required",
        description: "Please enter the guest name to place the order.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      await onPlaceOrder({
        name: guestName.trim(),
        roomNumber: roomNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setGuestName('');
      setRoomNumber('');
      setNotes('');
      
      toast({
        title: "Order placed successfully!",
        description: `Order for ${guestName} has been submitted to the kitchen.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Card className="sticky top-4 bg-gradient-warm border-border shadow-card">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground">Add some delicious items from our menu!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 bg-gradient-warm border-border shadow-luxury">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ShoppingCart className="h-5 w-5" />
          Order Cart
          <Badge variant="gold" className="ml-auto">
            {totalItems} items
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="h-6 w-6"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="font-semibold text-sm w-8 text-center">{item.quantity}</span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-6 w-6"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, 0)}
                  className="h-6 w-6 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-right ml-2">
                <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Information */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="guestName" className="text-sm font-medium">Guest Name *</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="roomNumber" className="text-sm font-medium">Room Number (Optional)</Label>
            <Input
              id="roomNumber"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g., 101, 205"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Special Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests"
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service charge (10%):</span>
            <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-foreground">Total:</span>
            <span className="text-primary">${(totalPrice * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="space-y-2 flex-col">
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          variant="gold"
          className="w-full"
          size="lg"
        >
          <Receipt className="h-4 w-4 mr-2" />
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
        
        <Button
          onClick={onClearCart}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;