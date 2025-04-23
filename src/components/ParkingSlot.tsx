
import { cn } from "@/lib/utils";

interface ParkingSlotProps {
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const ParkingSlot = ({ 
  number, 
  isAvailable, 
  isSelected,
  onClick 
}: ParkingSlotProps) => {
  return (
    <div 
      className={cn(
        "w-16 h-16 rounded-lg flex items-center justify-center font-medium transition-all",
        isAvailable 
          ? isSelected 
            ? "bg-parkingPrimary text-white border-2 border-parkingBlue cursor-pointer transform scale-110"
            : "bg-parkingSoftPurple text-parkingSecondary border border-parkingSecondary cursor-pointer hover:bg-parkingPrimary hover:text-white" 
          : "bg-parkingNeutral text-white opacity-50 cursor-not-allowed"
      )}
      onClick={isAvailable ? onClick : undefined}
    >
      {number}
    </div>
  );
};
