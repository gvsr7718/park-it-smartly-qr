
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Booking, malls } from '@/utils/mockData';
import { generateQRData } from '@/utils/qrGenerator';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

interface QRCodeDisplayProps {
  booking: Booking;
  onDownload?: () => void;
}

export const QRCodeDisplay = ({ booking, onDownload }: QRCodeDisplayProps) => {
  const mall = malls.find(m => m.id === booking.mallId);
  const qrData = generateQRData(booking);
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="w-full max-w-md mx-auto border-t-4 border-parkingPrimary">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-parkingDark">Your Parking Pass</CardTitle>
        <CardDescription>Show this QR code at the parking entrance</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-inner mb-6">
          <QRCodeSVG
            value={qrData}
            size={220}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/placeholder.svg",
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        
        <div className="w-full bg-parkingSoftPurple rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-lg text-parkingDark">{mall?.name}</div>
            <div className="text-sm bg-parkingPrimary text-white px-3 py-1 rounded-full">
              Slot #{booking.slotNumber}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-parkingNeutral mb-2">
            <MapPin size={16} className="mr-1" />
            <span>{mall?.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-parkingNeutral mb-2">
            <CalendarDays size={16} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-parkingNeutral">
            <Clock size={16} className="mr-1" />
            <span>{booking.startTime} - {booking.endTime}</span>
          </div>
        </div>
      </CardContent>
      
      {onDownload && (
        <CardFooter>
          <Button 
            className="w-full bg-parkingPrimary hover:bg-parkingSecondary"
            onClick={onDownload}
          >
            Download QR Code
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
