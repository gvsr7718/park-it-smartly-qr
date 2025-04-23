
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ParkingSlot } from '@/components/ParkingSlot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';
import { malls, Mall, timeSlots, getAvailableSlots } from '@/utils/mockData';
import { createBooking } from '@/utils/qrGenerator';
import { bookings } from '@/utils/mockData';
import { Clock, CalendarDays, MapPin, CreditCard } from 'lucide-react';

const BookSlot = () => {
  const navigate = useNavigate();
  const { mallId } = useParams<{ mallId: string }>();
  const [mall, setMall] = useState<Mall | null>(null);
  const [date, setDate] = useState('2025-04-23'); // Default to current date
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();

  // Generated dates for the next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Find mall by ID
    const foundMall = malls.find(m => m.id === mallId);
    
    if (foundMall) {
      setMall(foundMall);
    } else {
      // Mall not found, redirect to mall listing
      navigate('/mall-listing');
    }
  }, [mallId, navigate]);

  // Update available slots when date or time changes
  useEffect(() => {
    if (mallId && date && startTime) {
      const slots = getAvailableSlots(mallId, date, startTime);
      setAvailableSlots(slots);
      setSelectedSlot(null);
    }
  }, [mallId, date, startTime]);

  // Update end time when start time changes
  useEffect(() => {
    if (startTime) {
      const startIndex = timeSlots.indexOf(startTime);
      if (startIndex > -1 && startIndex < timeSlots.length - 1) {
        setEndTime(timeSlots[startIndex + 1]);
      }
    }
  }, [startTime]);

  const handleBooking = () => {
    if (!user || !mall || !selectedSlot || !date || !startTime || !endTime) {
      return;
    }

    setIsLoading(true);

    // Create new booking
    const newBooking = createBooking(
      user.id,
      mall.id,
      selectedSlot,
      date,
      startTime,
      endTime
    );

    // Add booking to the list (in a real app, this would be an API call)
    bookings.push(newBooking);

    // Update mall available slots
    const mallIndex = malls.findIndex(m => m.id === mall.id);
    if (mallIndex > -1) {
      malls[mallIndex].availableSlots -= 1;
    }

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/booking/${newBooking.id}`);
    }, 1500);
  };

  if (!mall) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-parkingPrimary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/mall-listing')}
            className="mr-2"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-parkingDark">Book a Parking Slot</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Parking Details</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <img src={mall.imageUrl} alt={mall.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-parkingDark">{mall.name}</h2>
                    <div className="flex items-center text-parkingNeutral">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{mall.location}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div 
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          mall.availableSlots > 20 
                            ? 'bg-green-100 text-green-800' 
                            : mall.availableSlots > 5 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mall.availableSlots} slots available
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CalendarDays size={16} className="mr-2 text-parkingPrimary" />
                        <Label>Select Date</Label>
                      </div>
                      
                      <Select 
                        value={date}
                        onValueChange={setDate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Date" />
                        </SelectTrigger>
                        <SelectContent>
                          {dateOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-parkingPrimary" />
                        <Label>Select Time</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select 
                          value={startTime}
                          onValueChange={setStartTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Start Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.slice(0, -1).map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={endTime}
                          onValueChange={setEndTime}
                          disabled={!startTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="End Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {startTime && timeSlots.slice(timeSlots.indexOf(startTime) + 1).map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard size={16} className="mr-2 text-parkingPrimary" />
                        <Label>Select Slot</Label>
                      </div>
                      
                      <div className="flex items-center text-xs">
                        <div className="flex items-center mr-3">
                          <div className="h-3 w-3 bg-parkingSoftPurple border border-parkingSecondary rounded-sm mr-1"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-parkingNeutral opacity-50 rounded-sm mr-1"></div>
                          <span>Unavailable</span>
                        </div>
                      </div>
                    </div>
                    
                    {startTime ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {Array.from({ length: 24 }, (_, i) => i + 1).map(slotNumber => (
                          <ParkingSlot
                            key={slotNumber}
                            number={slotNumber}
                            isAvailable={availableSlots.includes(slotNumber)}
                            isSelected={selectedSlot === slotNumber}
                            onClick={() => setSelectedSlot(slotNumber)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-parkingNeutral">Please select a date and time first</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-parkingPrimary hover:bg-parkingSecondary"
                  disabled={!selectedSlot || !date || !startTime || !endTime || isLoading}
                  onClick={handleBooking}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-parkingNeutral">Mall</div>
                  <div className="font-medium">{mall.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-parkingNeutral">Date</div>
                    <div className="font-medium">
                      {date ? new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Not selected'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-parkingNeutral">Time</div>
                    <div className="font-medium">
                      {startTime && endTime ? `${startTime} - ${endTime}` : 'Not selected'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-parkingNeutral">Slot Number</div>
                  <div className="font-medium">
                    {selectedSlot ? `#${selectedSlot}` : 'Not selected'}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="flex justify-between mb-2">
                    <div>Parking Fee</div>
                    <div className="font-medium">
                      ${mall.pricePerHour.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <div>Duration</div>
                    <div className="font-medium">
                      {startTime && endTime ? `${timeSlots.indexOf(endTime) - timeSlots.indexOf(startTime)} hour` : '0 hour'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                    <div>Total</div>
                    <div>
                      ${startTime && endTime 
                        ? (mall.pricePerHour * (timeSlots.indexOf(endTime) - timeSlots.indexOf(startTime))).toFixed(2) 
                        : '0.00'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="card">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile Pay</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="pt-4">
                    <div className="text-center text-sm text-parkingNeutral">
                      Payment will be processed after booking confirmation.
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex gap-2">
                        <div className="bg-blue-100 text-blue-800 p-1 rounded">
                          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="24" rx="3" fill="#EEF2FF" />
                            <path d="M12 16L16 8L20 16" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 14H19" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="bg-red-100 text-red-800 p-1 rounded">
                          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="24" rx="3" fill="#FEF2F2" />
                            <circle cx="12" cy="12" r="4" fill="#EF4444" />
                            <circle cx="20" cy="12" r="4" fill="#FECACA" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mobile" className="pt-4">
                    <div className="text-center text-sm text-parkingNeutral">
                      Scan QR code with your mobile payment app.
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="p-1 border border-gray-200 rounded">
                        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="white" />
                          <path d="M30 30H40V40H30V30Z" fill="black" />
                          <path d="M50 30H60V40H50V30Z" fill="black" />
                          <path d="M70 30H40V50H30V70H40V50H50V70H60V60H50V50H70V30Z" fill="black" />
                          <path d="M60 60H70V70H60V60Z" fill="black" />
                        </svg>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
