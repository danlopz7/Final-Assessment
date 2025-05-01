import React from 'react';
import OrderActions from '../components/OrderActions';
import OrderInfo from '../components/OrderInfo';
import OrderDetailsList from '../components/OrderDetailsList';
import OrderMap from '../components/OrderMap';
import useOrderData from '../hooks/useOrderDataFake'; //HOOK QUE ESTOY USANDO

const OrdersPage = () => {
  const {
    orderData,
    orderDetails,
    shippingAddressString,
    mapCoords,
    isEditing,
    handleNewOrder,
    handleEditOrder,
    handleCancelEdit,
    handleSaveOrder,
    handleDeleteOrder,
    handleGenerateReport,
    handleOrderInfoChange,
    handleAddressChange,
    handleAddDetail,
    handleEditDetail,
    handleDeleteDetail,
    handlePlaceSelected,
    handleSelectAddress,
    isAddressValid,
    validateAddressWithGeocoding,
  } = useOrderData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <OrderActions
        onNew={handleNewOrder}
        onEdit={handleEditOrder}
        onSave={handleSaveOrder}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteOrder}
        onGenerate={handleGenerateReport}
        onPrevious={() => {}} // Implementaremos después
        onNext={() => {}}     // Implementaremos después
        isEditing={isEditing}
      />
      <OrderInfo 
        orderData={orderData}
        shippingAddressString={shippingAddressString}
        onChangeOrder={handleOrderInfoChange}
        onSelectAddress={handleSelectAddress}
        onValidateAddress={validateAddressWithGeocoding}
        isAddressValid={isAddressValid}
        isEditing={isEditing}
        //onChangeAddress={handleAddressChange}
        //onPlaceSelected={handlePlaceSelected}
      />
      <OrderDetailsList
        details={orderDetails}
        onAddDetail={handleAddDetail}
        onEditDetail={handleEditDetail}
        onDeleteDetail={handleDeleteDetail}
        isEditing={isEditing}
      />
      <OrderMap
        lat={mapCoords.lat}
        lng={mapCoords.lng}
      />
    </div>
  );
};

export default OrdersPage;



// const OrdersPage = () => {
//   const {
//     orderData,
//     orderDetails,
//     mapCoords,
//     addressData,
//     isNewOrder,
//     handleNewOrder,
//     handleSaveOrder,
//     handleDeleteOrder,
//     handleGenerateReport,
//     handlePreviousOrder,
//     handleNextOrder,
//     handleOrderInfoChange,
//     handleAddressChange,
//     handleAddDetail,
//     handleEditDetail,
//     handleDeleteDetail,
//   } = useOrderData();

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <OrderActions
//         onNew={handleNewOrder}
//         onSave={handleSaveOrder}
//         onDelete={handleDeleteOrder}
//         onGenerate={handleGenerateReport}
//         onPrevious={handlePreviousOrder}
//         onNext={handleNextOrder}
//       />
//       <OrderInfo orderData={orderData} onChange={handleOrderInfoChange} />
//       <OrderDetailsList
//         details={orderDetails}
//         onAddDetail={handleAddDetail}
//         onEditDetail={handleEditDetail}
//         onDeleteDetail={handleDeleteDetail}
//       />
//       <OrderMap
//         lat={mapCoords.lat}
//         lng={mapCoords.lng}
//         addressData={addressData}
//         isNewOrder={isNewOrder}
//         onChangeAddress={handleAddressChange}
//       />
//     </div>
//   );
// };

// export default OrdersPage;
