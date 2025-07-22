import { MenuItem, CartItem } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star } from 'lucide-react';
import { useState } from 'react';

interface MenuCardProps {
  item: MenuItem;
  cartItem?: CartItem;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const MenuCard = ({ item, cartItem, onAddToCart, onUpdateQuantity }: MenuCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    onAddToCart(item);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className="group hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-gradient-warm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.name}
            {item.isSpecial && (
              <Star className="inline ml-2 h-4 w-4 text-hotel-warning fill-current" />
            )}
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
              {item.available ? "Available" : "Out of Stock"}
            </Badge>
            {item.isSpecial && (
              <Badge variant="outline" className="text-xs border-hotel-warning text-hotel-warning">
                Special
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="text-2xl font-bold text-primary">
          ${item.price.toFixed(2)}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        {quantity === 0 ? (
          <Button 
            onClick={handleAddToCart}
            disabled={!item.available || isAdding}
            variant="gold"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">{quantity}</span>
              <span className="text-sm text-muted-foreground">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuCard;