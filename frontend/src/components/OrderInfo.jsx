import React, { useEffect, useRef, useState } from 'react';
import useOrderOptions from '../hooks2/useOrderOptions';
import { Autocomplete } from '@react-google-maps/api';

const OrderInfo = ({
  orderData,
  shippingAddressString,
  onSelectAddress,
  onChangeOrder,
  isEditing,
  isAddressValid,
  onSelectCustomer,
  onSelectEmployee,
}) => {
  const autocompleteRef = useRef(null);
  const [localAddress, setLocalAddress] = useState(shippingAddressString);
  const {
    customers,
    employees,
    loadCustomers,
    loadEmployees,
  } = useOrderOptions();

  // sincroniza el estado local con el prop (cuando cambia desde afuera)
  useEffect(() => {
    setLocalAddress(shippingAddressString);
  }, [shippingAddressString]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.formatted_address && place.geometry &&
      place.geometry.location) {

      const formattedAddress = place.formatted_address;         // Evita errores por nombres inconsistentes
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const components = place.address_components;              // desglosar la dirección

      onSelectAddress(formattedAddress, lat, lng, components);  // sincronizar con hook principal
    } else {
      console.warn("Place no válido:", place);
    }
  };

  if (!orderData) return null;

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Columna izquierda */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Customer Name</label>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="customerName"
                placeholder="Search customer"
                value={orderData.customerName || ''}  // pone el valor que extrae de la data
                //onChange={onChangeOrder}  // guarda el estado por cada cambio en textbox
                onChange={(e) => {
                  const value = e.target.value;
                  onChangeOrder(e);
                  const match = customers.find(c => c.contactName === value);
                  if (match) {
                    onSelectCustomer(match.id, match.contactName);
                  }
                }}
                onFocus={loadCustomers}   //carga customers cuando se da click al textbox
                list="customer-options"
                className="border rounded p-2 w-full"
              />
              <datalist id="customer-options">
                {customers.map(c => (
                  <option key={c.id} value={c.contactName} />
                ))}
              </datalist>
            </div>
          ) : (
            <input
              type="text"
              name="customerName"
              value={orderData.customerName || ''}
              readOnly
              className="border rounded p-2 w-full"
            />
          )}

        </div>
        <div>
          <label className="block text-gray-700">Order Date</label>
          <input
            type="date"
            name="orderDate"
            value={orderData.orderDate || ''}
            onChange={onChangeOrder}
            className="border rounded p-2 w-full"
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* Columna derecha */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Shipping Address</label>
          {isEditing ? (
            <div className="relative">
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  value={localAddress}
                  //value={shippingAddressString}
                  //onChange={(e) => onSelectAddress(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalAddress(value);
                    onSelectAddress(value); // valida con Geocoding al escribir
                  }}
                  className="border rounded p-2 w-full pr-10"
                />
              </Autocomplete>
              {isAddressValid === false || (isAddressValid === null && localAddress.trim() !== '') ? (
                <span className="absolute right-2 top-2 text-red-500">❌</span>
              ) : null}

              {isAddressValid === true && (
                <span className="absolute right-2 top-2 text-green-600">✔️</span>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={shippingAddressString}
              readOnly
              className="border rounded p-2 w-full"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700">Employee Name</label>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="employeeName"
                placeholder="Search employee"
                value={orderData.employeeName || ''}
                //onChange={onChangeOrder}
                onChange={(e) => {
                  const value = e.target.value;
                  onChangeOrder(e);

                  const match = employees.find(emp => emp.fullName === value);
                  if (match) {
                    onSelectEmployee(match.id, match.fullName);
                  }
                }}
                onFocus={loadEmployees}
                list="employee-options"
                className="border rounded p-2 w-full"
              />
              <datalist id="employee-options">
                {employees.map(e => (
                  <option key={e.id} value={e.fullName} />
                ))}
              </datalist>
            </div>
          ) : (
            <input
              type="text"
              name="employeeName"
              value={orderData.employeeName || ''}
              readOnly
              className="border rounded p-2 w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
