import { TractorData } from '@/data/mockData';
import { MapPin, User, IndianRupee, Tractor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tractor {
  _id?: string;
  image?: string;
  model: string;
  ownerName: string;
  location: string;
  horsepower: number;
  fuelType: string;
  rentPerHour: number;
  rentPerDay: number;
  isAvailable: boolean;
}

interface TractorCardProps {
  tractor: Tractor;
}

const TractorCard = ({ tractor }: TractorCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="tractor-card">
      {/* Image Section */}
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        {tractor.image ? (
          <img
            src={tractor.image}
            alt={`${tractor.model} - ${tractor.ownerName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Tractor className="h-20 w-20 text-primary/40" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`status-badge ${
              tractor.isAvailable ? 'status-badge-available' : 'status-badge-rented'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                tractor.isAvailable ? 'bg-success' : 'bg-danger'
              }`}
            />
            {tractor.isAvailable ? 'Available' : 'Rented'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Model Name */}
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          {tractor.model}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{tractor.ownerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{tractor.location}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/50">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Per Hour</p>
            <div className="flex items-center text-foreground font-semibold">
              <IndianRupee className="h-4 w-4" />
              <span>{tractor.rentPerHour}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Per Day</p>
            <div className="flex items-center text-foreground font-semibold">
              <IndianRupee className="h-4 w-4" />
              <span>{tractor.rentPerDay}</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
            {tractor.horsepower} HP
          </span>
          <span className="text-xs px-2 py-1 rounded-md bg-secondary/10 text-secondary">
            {tractor.fuelType}
          </span>
        </div>

        {/* Action Button */}
        <button
        onClick={() => navigate(`/rent/${tractor._id}`)}

          disabled={!tractor.isAvailable}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            tractor.isAvailable
              ? 'btn-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {tractor.isAvailable ? 'Rent Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default TractorCard;
