import HotelDashboard from '@/components/HotelDashboard';
import HotelHeader from '@/components/HotelHeader';
import { useState } from 'react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <HotelHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        userName="Cindy"
        userRole="Hotel Manager"
      />
      <HotelDashboard />
    </div>
  );
};

export default Index;
