
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { Booking, malls } from '@/utils/mockData';
import { useNavigate } from 'react-router-dom';

interface BookingCardProps {
  booking: Booking;
  showViewButton?: boolean;
}

export const BookingCard = ({ booking, showViewButton = true }: BookingCardProps) => {
  const navigate = useNavigate();
  const mall = malls.find(m => m.id === booking.mallId);
  
  // Status badge styling
  const statusStyles = {
    active: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden border-t-4 border-parkingPrimary hover:shadow-md transition-shadow duration-300">
      <CardHeader className="py-4 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg font-bold text-parkingDark">Parking at {mall?.name}</CardTitle>
          <div className="flex items-center text-parkingNeutral mt-1">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{mall?.location}</span>
          </div>
        </div>
        <Badge className={statusStyles[booking.status]}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="text-xs text-parkingNeutral mb-1">Slot Number</div>
            <div className="text-lg font-semibold">#{booking.slotNumber}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-parkingNeutral mb-1">Date</div>
            <div className="flex items-center">
              <CalendarDays size={16} className="mr-1 text-parkingSecondary" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-parkingNeutral mb-1">Time</div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-parkingSecondary" />
              <span>{booking.startTime} - {booking.endTime}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-parkingNeutral mb-1">Booking ID</div>
            <div className="text-sm font-mono">{booking.id}</div>
          </div>
        </div>
      </CardContent>
      
      {showViewButton && booking.status === 'active' && (
        <CardFooter className="pt-2 pb-4">
          <Button 
            className="w-full bg-parkingPrimary hover:bg-parkingSecondary"
            onClick={() => navigate(`/booking/${booking.id}`)}
          >
            View QR Code
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
