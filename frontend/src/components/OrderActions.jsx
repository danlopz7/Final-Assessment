import React from 'react';

const OrderActions = ({ onNew, onSave, onDelete, onGenerate, onNext, onPrevious }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
  <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm" onClick={onNew}>New</button>
  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={onSave}>Save</button>
  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm" onClick={onDelete}>Delete</button>
  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm" onClick={onGenerate}>Generate PDF</button>
  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={onPrevious}>◀</button>
  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={onNext}>▶</button>
</div>
  );
};

export default OrderActions;