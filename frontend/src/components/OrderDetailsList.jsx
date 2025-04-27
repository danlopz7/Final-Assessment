import React from 'react';
import calculateTotal from '../utils/calculateTotal';

const OrderDetailsList = ({ details, onAddDetail, onEditDetail, onDeleteDetail }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-semibold">Order Details</h2>
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={onAddDetail}>
          Add Detail
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Unit Price</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="border rounded p-1 w-full"
                  value={detail.product || ''}
                  onChange={(e) => onEditDetail(index, 'product', e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="border rounded p-1 w-full"
                  value={detail.quantity || 0}
                  onChange={(e) => onEditDetail(index, 'quantity', e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  step="0.01"
                  className="border rounded p-1 w-full"
                  value={detail.unitPrice || 0}
                  onChange={(e) => onEditDetail(index, 'unitPrice', e.target.value)}
                />
              </td>
              <td className="border px-4 py-2 text-center">
                {calculateTotal(detail.quantity, detail.unitPrice)}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => onDeleteDetail(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {details.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No order details added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsList;