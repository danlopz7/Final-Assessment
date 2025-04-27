import React from 'react';
import OrderActions from '../components/OrderActions';
import OrderInfo from '../components/OrderInfo';
import OrderDetailsList from '../components/OrderDetailsList';
import OrderMap from '../components/OrderMap';
import useOrderData from '../hooks/useOrderData';

const OrdersPage = () => {
  const {
    orderData,
    orderDetails,
    mapCoords,
    addressData,
    isNewOrder,
    handleNewOrder,
    handleSaveOrder,
    handleDeleteOrder,
    handleGenerateReport,
    handlePreviousOrder,
    handleNextOrder,
    handleOrderInfoChange,
    handleAddressChange,
    handleAddDetail,
    handleEditDetail,
    handleDeleteDetail,
  } = useOrderData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <OrderActions
        onNew={handleNewOrder}
        onSave={handleSaveOrder}
        onDelete={handleDeleteOrder}
        onGenerate={handleGenerateReport}
        onPrevious={handlePreviousOrder}
        onNext={handleNextOrder}
      />
      <OrderInfo orderData={orderData} onChange={handleOrderInfoChange} />
      <OrderDetailsList
        details={orderDetails}
        onAddDetail={handleAddDetail}
        onEditDetail={handleEditDetail}
        onDeleteDetail={handleDeleteDetail}
      />
      <OrderMap
        lat={mapCoords.lat}
        lng={mapCoords.lng}
        addressData={addressData}
        isNewOrder={isNewOrder}
        onChangeAddress={handleAddressChange}
      />
    </div>
  );
};

export default OrdersPage;