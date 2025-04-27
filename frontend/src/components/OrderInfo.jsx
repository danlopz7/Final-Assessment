import React from 'react';

const OrderInfo = ({ orderData, onChange, isNewOrder }) => {
  if (!orderData) return null;

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Left column */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={orderData.customerName || ''}
            onChange={onChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Order Date</label>
          <input
            type="date"
            name="orderDate"
            value={orderData.orderDate || ''}
            onChange={onChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Shipping Address</label>
          <input
            type="text"
            name="shipAddress"
            value={orderData.shipAddress || ''}
            onChange={onChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Employee</label>
          <input
            type="text"
            name="employeeId"
            value={orderData.employeeId || ''}
            onChange={onChange}
            className="border rounded p-2 w-full"
          />
        </div>

      </div>
    </div>
  );
};

export default OrderInfo;