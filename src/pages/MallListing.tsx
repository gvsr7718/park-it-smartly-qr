
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MallCard } from '@/components/MallCard';
import { malls, Mall } from '@/utils/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';

const MallListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('availability');
  
  // Filter and sort malls
  const filteredMalls = malls.filter(mall => 
    mall.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mall.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedMalls = [...filteredMalls].sort((a, b) => {
    if (sortOrder === 'availability') {
      return b.availableSlots - a.availableSlots;
    } else if (sortOrder === 'price_low') {
      return a.pricePerHour - b.pricePerHour;
    } else if (sortOrder === 'price_high') {
      return b.pricePerHour - a.pricePerHour;
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="bg-parkingPrimary text-white py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">Find Your Ideal Parking Spot</h1>
          <p className="text-parkingLight mb-8">Browse available malls and secure your parking in advance</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by mall name or location"
                className="pl-10 bg-white text-parkingDark"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-56">
              <Select
                value={sortOrder}
                onValueChange={setSortOrder}
              >
                <SelectTrigger className="w-full bg-white text-parkingDark">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="availability">Highest Availability</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Location filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All Locations', 'Downtown', 'Eastside', 'Westside', 'Northside'].map((location, index) => (
            <div 
              key={location} 
              className={`px-4 py-2 rounded-full text-sm cursor-pointer flex items-center 
                ${index === 0 ? 'bg-parkingPrimary text-white' : 'bg-white border border-gray-200 text-parkingDark hover:bg-gray-50'}`}
            >
              {index !== 0 && <MapPin size={14} className="mr-1" />}
              {location}
            </div>
          ))}
        </div>
        
        {/* Mall listing */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-parkingDark">Available Malls ({sortedMalls.length})</h2>
        </div>
        
        {sortedMalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMalls.map(mall => (
              <MallCard key={mall.id} mall={mall} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-parkingDark mb-2">No malls found</h3>
            <p className="text-parkingNeutral">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MallListing;
