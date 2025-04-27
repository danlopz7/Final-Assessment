import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const OrderMap = ({ lat, lng, addressData, isNewOrder, onChangeAddress }) => {
  // Evitar renderizar el mapa si las coordenadas no existen aún
  if (lat === undefined || lng === undefined) {
    return <div className="text-center text-gray-500">Loading map...</div>;
  }

  const center = { lat, lng };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Validated Address</h2>

      {/* Campos de la dirección */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Cada campo individual */}
        {['street', 'city', 'state', 'postalCode', 'country', 'coordinates'].map((field, idx) => (
          <div key={idx}>
            <label className="block text-gray-700 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={addressData[field] || ''}
              onChange={onChangeAddress}
              className="border rounded p-2 w-full"
              readOnly={!isNewOrder && field !== 'coordinates'} 
              // Solo es editable si es un nuevo pedido (excepto coordenadas que siempre son readonly)
            />
          </div>
        ))}
      </div>

      {/* Mapa de Google */}
      <LoadScript googleMapsApiKey="AIzaSyBPK15nwpPCQEndo378nriZyZA9ALqIMOY">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default OrderMap;