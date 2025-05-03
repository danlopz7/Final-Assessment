import React from 'react';

const OrderActions = ({
  onNew,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onGenerate,
  onPrevious,
  onNext,
  isEditing,
  hasNextOrder,
  hasPreviousOrder,
  currentOrderId,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {isEditing ? (
        <>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={onSave}>Save</button>
          <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={onCancel}>Cancel</button>
        </>
      ) : (
        <>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={onNew}>New</button>
          <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm" onClick={onEdit}>Edit</button>
          
          <button className="bg-red-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
              if (window.confirm("Are you sure you want to delete this order?")) {
                onDelete();
              }
            }}>Delete</button>
          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm" onClick={onGenerate}>Generate Report</button>
          <button className={`px-3 py-1 rounded text-sm ${hasPreviousOrder ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            onClick={onPrevious}
            disabled={!hasPreviousOrder}
          >
            ◀
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${hasNextOrder ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={!hasNextOrder}
          >
            ▶
          </button>
        </>
      )}
      {!isEditing && currentOrderId && (
        <span className="ml-4 text-sm text-gray-600">
          Viewing order ID: <strong>{currentOrderId}</strong>
        </span>
      )}
    </div>
  );
};

export default OrderActions;
