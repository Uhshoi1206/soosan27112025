
import React from 'react';
import { AddressRegion, AddressInfo } from '@/lib/constants/addressData';
import { MapPin } from 'lucide-react';

interface AddressRegionsProps {
  regions: AddressRegion[];
}

const AddressRegions: React.FC<AddressRegionsProps> = ({ regions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {regions.map((region, index) => (
        <div key={index} className="space-y-3">
          <h3 className="font-heading text-lg font-bold text-primary-100 mb-3">{region.name}</h3>
          <div className="space-y-4">
            {region.addresses.map((address, addressIndex) => (
              <div key={addressIndex} className="pb-3 border-b border-gray-800">
                <h4 className="font-medium text-white mb-1">{address.province}</h4>
                <div className="flex items-start space-x-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{address.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressRegions;
