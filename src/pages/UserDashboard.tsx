
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { BookingCard } from '@/components/BookingCard';
import { MallCard } from '@/components/MallCard';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import { malls, bookings, Booking } from '@/utils/mockData';
import { CalendarDays, QrCode } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Filter bookings by current user
    if (user) {
      const userBookings = bookings.filter(booking => booking.userId === user.id);
      setActiveBookings(userBookings.filter(booking => booking.status === 'active'));
      setPastBookings(userBookings.filter(booking => booking.status !== 'active'));
    }
  }, [navigate, user]);

  const recommendedMalls = malls.slice(0, 2);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-parkingDark">Welcome back, {user?.name}</h1>
          <p className="text-parkingNeutral mt-2">Manage your parking bookings and find new spots</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <QrCode className="mr-2 text-parkingPrimary" size={20} />
                  <span>Your Current Bookings</span>
                </h2>
                
                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-parkingDark mb-2">No active bookings</h3>
                    <p className="text-parkingNeutral mb-4">You don't have any active parking bookings right now.</p>
                    <Button 
                      onClick={() => navigate('/mall-listing')}
                      className="bg-parkingPrimary hover:bg-parkingSecondary"
                    >
                      Find Parking Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/mall-listing')} 
                    className="w-full bg-parkingPrimary hover:bg-parkingSecondary justify-start"
                  >
                    Book New Parking
                  </Button>
                  <Button 
                    onClick={() => navigate('/booking-history')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    View Booking History
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Recommended Malls</h3>
                  <div className="space-y-4">
                    {recommendedMalls.map(mall => (
                      <div key={mall.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/book/${mall.id}`)}>
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img src={mall.imageUrl} alt={mall.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-parkingDark">{mall.name}</h4>
                          <p className="text-xs text-parkingNeutral">{mall.availableSlots} slots available</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {pastBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Booking History</h2>
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <Button variant="link" onClick={() => navigate('/booking-history')} className="text-parkingPrimary">
                  View All
                </Button>
              </div>
              
              <TabsContent value="all" className="space-y-4">
                {pastBookings.slice(0, 2).map(booking => (
                  <BookingCard key={booking.id} booking={booking} showViewButton={false} />
                ))}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {pastBookings
                  .filter(b => b.status === 'completed')
                  .slice(0, 2)
                  .map(booking => (
                    <BookingCard key={booking.id} booking={booking} showViewButton={false} />
                  ))
                }
              </TabsContent>
              
              <TabsContent value="cancelled" className="space-y-4">
                {pastBookings
                  .filter(b => b.status === 'cancelled')
                  .slice(0, 2)
                  .map(booking => (
                    <BookingCard key={booking.id} booking={booking} showViewButton={false} />
                  ))
                }
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
