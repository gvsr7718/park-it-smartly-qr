
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { MallCard } from '@/components/MallCard';
import { malls } from '@/utils/mockData';

const Index = () => {
  // Take the first 3 malls for the showcase
  const featuredMalls = malls.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-parkingPrimary to-parkingSecondary text-white py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Smart Parking Made Easy
              </h1>
              <p className="text-lg mb-6 text-parkingLight">
                Book your parking slot in advance at your favorite malls. 
                Skip the hassle, save time, and enjoy a seamless parking experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/mall-listing">
                  <Button size="lg" className="bg-white text-parkingPrimary hover:bg-parkingLight">
                    Find Parking
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <svg 
                  viewBox="0 0 200 200" 
                  className="w-full max-w-md"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fill="#D6BCFA" 
                    d="M45.7,-77.5C58.9,-69.2,69.2,-55.4,76.9,-40.5C84.6,-25.5,90,-9.5,89.2,6.4C88.4,22.4,81.6,38.2,70.9,49.7C60.1,61.1,45.7,68.2,30.6,74.8C15.6,81.5,-0.1,87.7,-17.1,87C-34.1,86.4,-52.5,79,-67.1,66.4C-81.7,53.7,-92.5,35.7,-93.4,17.5C-94.4,-0.8,-85.4,-19.2,-75.9,-36C-66.4,-52.8,-56.4,-67.9,-42.7,-75.8C-28.9,-83.6,-11.5,-84.2,3.1,-89.4C17.8,-94.7,32.6,-85.8,45.7,-77.5Z" 
                    transform="translate(100 100)" 
                  />
                </svg>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/9841/9841579.png" 
                  alt="Parking Illustration" 
                  className="absolute inset-0 w-3/4 h-3/4 object-contain m-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-parkingDark mb-4">How It Works</h2>
            <p className="text-parkingNeutral max-w-2xl mx-auto">
              ParkItSmart makes finding and booking parking spots as easy as booking movie tickets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-parkingSoftPurple rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-parkingPrimary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-parkingDark mb-2">Select a Mall</h3>
              <p className="text-parkingNeutral">
                Browse through our list of partnered malls and select your destination.
              </p>
            </div>
            
            <div className="bg-parkingSoftBlue rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-parkingBlue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-parkingDark mb-2">Book Your Slot</h3>
              <p className="text-parkingNeutral">
                Choose your preferred date, time, and available parking slot.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-parkingDark mb-2">Show QR Code</h3>
              <p className="text-parkingNeutral">
                Scan the QR code at the parking entrance to validate your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Malls Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-parkingDark mb-4">Featured Malls</h2>
            <p className="text-parkingNeutral max-w-2xl mx-auto">
              Discover popular shopping destinations with our smart parking solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMalls.map(mall => (
              <MallCard key={mall.id} mall={mall} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/mall-listing">
              <Button size="lg" className="bg-parkingPrimary hover:bg-parkingSecondary">
                View All Malls
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-parkingDark text-white py-10 px-6 mt-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded-md">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#9b87f5" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 17h14v4H5z"/>
                    <path d="M12 4H7c-1 0-2 .6-2 1.5V17h14V8.8c0-1.2-1-2.8-3-2.8h-4Z"/>
                    <path d="m5 11 4.5-2L14 11"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">ParkItSmart</span>
              </div>
              <p className="text-gray-400 mt-2 text-sm">
                © 2025 ParkItSmart. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
