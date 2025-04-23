
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { BookingCard } from '@/components/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { isAuthenticated, isAdmin, getCurrentUser } from '@/utils/auth';
import { malls, bookings, Booking } from '@/utils/mockData';
import { LayoutDashboard, Search, QrCode, Calendar, CircleX, CheckCircle, ArrowUpDown } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mallFilter, setMallFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/login');
      return;
    }

    // Set all bookings
    setAllBookings([...bookings]);
    setFilteredBookings([...bookings]);
  }, [navigate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allBookings];
    
    // Apply mall filter
    if (mallFilter !== 'all') {
      filtered = filtered.filter(booking => booking.mallId === mallFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.includes(searchTerm) || 
        String(booking.slotNumber).includes(searchTerm)
      );
    }
    
    setFilteredBookings(filtered);
  }, [allBookings, mallFilter, statusFilter, searchTerm]);

  // Stats calculation
  const stats = {
    total: allBookings.length,
    active: allBookings.filter(b => b.status === 'active').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
  };

  // Slot management
  const markSlotAvailable = (slotNumber: number) => {
    alert(`Slot #${slotNumber} has been marked as available!`);
    setSelectedSlot(null);
  };

  const markSlotOccupied = (slotNumber: number) => {
    alert(`Slot #${slotNumber} has been marked as occupied!`);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-parkingDark">Admin Dashboard</h1>
          <p className="text-parkingNeutral mt-2">Manage parking slots and bookings</p>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Total Bookings</div>
                <LayoutDashboard className="h-4 w-4 text-parkingNeutral" />
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Active Bookings</div>
                <QrCode className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Completed</div>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Cancelled</div>
                <CircleX className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage all parking bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by booking ID or slot number"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="md:w-48">
                    <Select
                      value={mallFilter}
                      onValueChange={setMallFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Mall" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Malls</SelectItem>
                        {malls.map(mall => (
                          <SelectItem key={mall.id} value={mall.id}>{mall.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:w-48">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Bookings</TabsTrigger>
                    <TabsTrigger value="today">Today's Bookings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} showViewButton={false} />
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-parkingDark mb-2">No bookings found</h3>
                        <p className="text-parkingNeutral">Try adjusting your filters.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="today" className="space-y-4">
                    {filteredBookings
                      .filter(b => b.date === '2025-04-23')
                      .map(booking => (
                        <BookingCard key={booking.id} booking={booking} showViewButton={false} />
                      ))
                    }
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Slot Management */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Slot Management</CardTitle>
                <CardDescription>Update parking slot status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Mall</label>
                  <Select defaultValue="mall-1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mall" />
                    </SelectTrigger>
                    <SelectContent>
                      {malls.map(mall => (
                        <SelectItem key={mall.id} value={mall.id}>{mall.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(slot => (
                      <div 
                        key={slot}
                        className={`h-12 flex items-center justify-center rounded-md cursor-pointer border ${
                          selectedSlot === slot 
                            ? 'border-parkingPrimary bg-parkingSoftPurple' 
                            : slot % 3 === 0 
                              ? 'bg-red-100 border-red-200' 
                              : 'bg-green-100 border-green-200'
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedSlot && (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => markSlotAvailable(selectedSlot)}
                    >
                      Mark as Available
                    </Button>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => markSlotOccupied(selectedSlot)}
                    >
                      Mark as Occupied
                    </Button>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Legend</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-green-100 border border-green-200 rounded-sm mr-2"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-red-100 border border-red-200 rounded-sm mr-2"></div>
                      <span className="text-sm">Occupied</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Mall Availability</CardTitle>
                <CardDescription>Current parking status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {malls.map(mall => (
                    <div key={mall.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <div className="font-medium">{mall.name}</div>
                        <div className="text-xs text-parkingNeutral">{mall.location}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          mall.availableSlots > 20 ? 'text-green-600' : 
                          mall.availableSlots > 5 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {mall.availableSlots}/{mall.totalSlots}
                        </div>
                        <div className="text-xs text-parkingNeutral">slots available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
