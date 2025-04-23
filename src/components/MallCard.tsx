
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { Mall } from '@/utils/mockData';
import { useNavigate } from 'react-router-dom';

interface MallCardProps {
  mall: Mall;
}

export const MallCard = ({ mall }: MallCardProps) => {
  const navigate = useNavigate();
  
  const availabilityColor = mall.availableSlots > 20 
    ? 'bg-green-100 text-green-800' 
    : mall.availableSlots > 5 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-red-100 text-red-800';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={mall.imageUrl} 
          alt={mall.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="py-4">
        <CardTitle className="text-xl font-bold text-parkingDark">{mall.name}</CardTitle>
        <div className="flex items-center text-parkingNeutral mt-1">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{mall.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={16} className="text-parkingNeutral mr-1" />
            <span className="text-sm text-parkingNeutral">${mall.pricePerHour}/hour</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${availabilityColor}`}>
            {mall.availableSlots} slots available
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Button 
          className="w-full bg-parkingPrimary hover:bg-parkingSecondary"
          onClick={() => navigate(`/book/${mall.id}`)}
        >
          Reserve a Slot
        </Button>
      </CardFooter>
    </Card>
  );
};
