import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const OrderMap = ({ lat, lng, parsedAddressFields }) => {
  if (lat === undefined || lng === undefined) {
    return <div className="text-center text-gray-500">Loading map...</div>;
  }

  const center = { lat, lng };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Validated Address</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {Object.entries(parsedAddressFields).map(([key, value]) => (
          <div key={key}>
            <label className="block text-gray-700 capitalize">{key}</label>
            <input
              type="text"
              value={value}
              readOnly
              className="border rounded p-2 w-full bg-gray-100"
            />
          </div>
        ))}
        {/* Coordenadas geocodificadas en un solo textbox */}
        <div>
          <label className="block text-gray-700">Geocoded Coordinates</label>
          <input
            type="text"
            value={`Lat: ${lat}, Lng: ${lng}`}
            readOnly
            className="border rounded p-2 w-full bg-gray-100"
          />
        </div>
      </div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default OrderMap;
