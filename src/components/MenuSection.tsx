import { MenuItem, CartItem } from '@/types/hotel';
import { categoryIcons, categoryNames } from '@/data/menuData';
import MenuCard from './MenuCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const MenuSection = ({ category, items, cart, onAddToCart, onUpdateQuantity }: MenuSectionProps) => {
  const categoryIcon = categoryIcons[category as keyof typeof categoryIcons];
  const categoryName = categoryNames[category as keyof typeof categoryNames];
  
  const getCartItem = (itemId: string) => cart.find(item => item.id === itemId);

  return (
    <Card className="mb-8 bg-background border-border shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="text-3xl">{categoryIcon}</span>
          {categoryName}
          <span className="text-sm font-normal text-muted-foreground">
            ({items.length} items)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              cartItem={getCartItem(item.id)}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSection;