
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar, Home } from 'lucide-react';
import { getCurrentUser, logout, isAdmin } from '@/utils/auth';

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  
  useEffect(() => {
    // Update user state when auth changes
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-parkingPrimary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
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
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-parkingLight flex items-center gap-2">
            <Home size={18} />
            <span>Home</span>
          </Link>
          {user ? (
            <>
              <Link to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} className="hover:text-parkingLight flex items-center gap-2">
                <User size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/booking-history" className="hover:text-parkingLight flex items-center gap-2">
                <Calendar size={18} />
                <span>Booking History</span>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="bg-white text-parkingPrimary">Register</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          {user ? (
            <Button variant="outline" size="sm" className="bg-white text-parkingPrimary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="secondary" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
