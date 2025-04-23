
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { BookingCard } from '@/components/BookingCard';
import { bookings, Booking, malls } from '@/utils/mockData';
import { isAuthenticated } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Share2, Download } from 'lucide-react';

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Find booking by ID
    const foundBooking = bookings.find(b => b.id === bookingId);
    
    setIsLoading(false);
    
    if (foundBooking) {
      setBooking(foundBooking);
    } else {
      // Booking not found, redirect to dashboard
      navigate('/user-dashboard');
    }
  }, [bookingId, navigate]);

  const handleDownload = () => {
    // In a real app, this would generate a downloadable QR code
    alert('QR Code downloaded successfully!');
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: 'Parking Booking QR Code',
        text: 'Here is my parking booking QR code',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Copied booking link to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-parkingPrimary"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-parkingDark mb-2">Booking Not Found</h2>
            <p className="text-parkingNeutral mb-6">We couldn't find the booking you're looking for.</p>
            <Button 
              onClick={() => navigate('/user-dashboard')}
              className="bg-parkingPrimary hover:bg-parkingSecondary"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const mall = malls.find(m => m.id === booking.mallId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/user-dashboard')}
            className="mr-2"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-parkingDark">Booking Confirmation</h1>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center">
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-green-800">Booking Confirmed!</h2>
            <p className="text-green-700 text-sm">Your parking slot has been reserved successfully</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Your QR Code</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <QRCodeDisplay booking={booking} />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <BookingCard booking={booking} showViewButton={false} />
            
            <div className="mt-6 space-y-3">
              <Button 
                className="w-full flex items-center justify-center"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
              
              <Button 
                className="w-full flex items-center justify-center"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Booking
              </Button>
            </div>
            
            <div className="mt-6 bg-parkingSoftPurple rounded-lg p-4">
              <h3 className="font-medium text-parkingDark mb-2">Important Information</h3>
              <ul className="text-sm space-y-2 text-parkingDark">
                <li>• Arrive 15 minutes before your booking time</li>
                <li>• Show this QR code at the parking entrance</li>
                <li>• Your spot will be held for 30 minutes after booking time</li>
                <li>• Cancellations allowed up to 2 hours before booking</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Parking Information</h2>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-parkingDark mb-4">How to Access</h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-parkingPrimary flex items-center justify-center text-white text-xs mr-2 shrink-0 mt-0.5">1</span>
                    <span>Enter through the main entrance of {mall?.name}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-parkingPrimary flex items-center justify-center text-white text-xs mr-2 shrink-0 mt-0.5">2</span>
                    <span>Scan your QR code at the entrance barrier</span>
                  </p>
                  <p className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-parkingPrimary flex items-center justify-center text-white text-xs mr-2 shrink-0 mt-0.5">3</span>
                    <span>Park at your designated slot #{booking.slotNumber}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-parkingPrimary flex items-center justify-center text-white text-xs mr-2 shrink-0 mt-0.5">4</span>
                    <span>Scan again when leaving to complete your session</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-parkingDark mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-parkingNeutral mb-1">Mall Phone</div>
                    <div>+1 (555) 123-4567</div>
                  </div>
                  <div>
                    <div className="text-xs text-parkingNeutral mb-1">Mall Address</div>
                    <div>{mall?.location}, City, State ZIP</div>
                  </div>
                  <div>
                    <div className="text-xs text-parkingNeutral mb-1">Support Email</div>
                    <div>support@parkitsmart.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
