
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { BookingCard } from '@/components/BookingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import { bookings, Booking } from '@/utils/mockData';
import { Search, CalendarDays } from 'lucide-react';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Filter bookings by current user
    if (user) {
      const filtered = bookings.filter(booking => booking.userId === user.id);
      setUserBookings(filtered);
      setFilteredBookings(filtered);
    }
  }, [navigate, user]);

  // Apply filters
  useEffect(() => {
    let filtered = [...userBookings];
    
    // Apply date filter
    if (dateFilter === 'past') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(booking => new Date(booking.date) < today);
    } else if (dateFilter === 'future') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(booking => new Date(booking.date) >= today);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(booking.slotNumber).includes(searchTerm)
      );
    }
    
    setFilteredBookings(filtered);
  }, [userBookings, dateFilter, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-parkingDark flex items-center">
            <CalendarDays className="mr-2 text-parkingPrimary" />
            Booking History
          </h1>
          <p className="text-parkingNeutral mt-2">View all your past and upcoming bookings</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by booking ID or slot number"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-40">
            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="future">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-parkingDark mb-2">No bookings found</h3>
                <p className="text-parkingNeutral">Try adjusting your filters or make a new booking.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {filteredBookings
              .filter(b => b.status === 'active')
              .map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            }
            {filteredBookings.filter(b => b.status === 'active').length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-parkingDark mb-2">No active bookings</h3>
                <p className="text-parkingNeutral">You don't have any active parking bookings.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {filteredBookings
              .filter(b => b.status === 'completed')
              .map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            }
            {filteredBookings.filter(b => b.status === 'completed').length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-parkingDark mb-2">No completed bookings</h3>
                <p className="text-parkingNeutral">You haven't completed any parking bookings yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {filteredBookings
              .filter(b => b.status === 'cancelled')
              .map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            }
            {filteredBookings.filter(b => b.status === 'cancelled').length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-parkingDark mb-2">No cancelled bookings</h3>
                <p className="text-parkingNeutral">You haven't cancelled any parking bookings.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingHistory;
