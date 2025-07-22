import { Button } from '@/components/ui/button';
import { Bell, User, Menu } from 'lucide-react';

interface HotelHeaderProps {
  onMenuToggle: () => void;
  userName?: string;
  userRole?: string;
}

const HotelHeader = ({ onMenuToggle, userName = "Admin", userRole = "Administrator" }: HotelHeaderProps) => {
  return (
    <header className="bg-background border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu toggle and logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Cindy's Hotel</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Management System</p>
              </div>
            </div>
          </div>

          {/* Right side - User info and notifications */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HotelHeader;