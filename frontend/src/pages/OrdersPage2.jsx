import React from 'react';
import OrderActions from '../components/OrderActions';
import OrderInfo from '../components/OrderInfo';
import OrderDetailsList from '../components/OrderDetailsList';
import OrderMap from '../components/OrderMap';
import useOrderData from '../hooks2/useOrderData';
import useOrderOptions from '../hooks2/useOrderOptions';

const OrdersPage = () => {
  // Custom hook con separación por responsabilidad
  const {
    // Estado general
    orderData,
    orderDetails,
    isEditing,

    // Dirección y coordenadas
    shippingAddressString,
    mapCoords,
    isAddressValid,
    parsedAddressFields,

    // Acciones de orden
    handleNewOrder,
    handleEditOrder,
    handleCancelEdit,
    handleSaveOrder,
    handleDeleteOrder,
    handleGenerateReport,
    handlePreviousOrder,
    handleNextOrder,
    hasNextOrder,
    hasPreviousOrder,

    // Formulario y detalles
    handleOrderInfoChange,
    handleAddDetail,
    handleEditDetail,
    handleDeleteDetail,
    handleSelectCustomer,
    handleSelectEmployee,
    handleSelectProduct,

    // Dirección (Autocomplete / Geocoding)
    handleSelectAddress,
    validateAddressWithGeocoding,
  } = useOrderData();

  const {
    products,
    loadProducts
  } = useOrderOptions();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Acciones superiores */}
      <OrderActions
        onNew={handleNewOrder}
        onEdit={handleEditOrder}
        onSave={handleSaveOrder}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteOrder}
        onGenerate={handleGenerateReport}
        onPrevious={handlePreviousOrder}
        hasNextOrder={hasNextOrder}
        hasPreviousOrder={hasPreviousOrder}
        onNext={handleNextOrder}
        isEditing={isEditing}
        currentOrderId={orderData?.orderId}
      />

      {/* Info principal de la orden */}
      <OrderInfo
        orderData={orderData}
        shippingAddressString={shippingAddressString}
        isEditing={isEditing}
        isAddressValid={isAddressValid}
        onChangeOrder={handleOrderInfoChange}
        onSelectAddress={handleSelectAddress}   //HANDLE SELECT ADDRESS
        onValidateAddress={validateAddressWithGeocoding}
        onSelectCustomer={handleSelectCustomer}  // ✅ Agrega este
        onSelectEmployee={handleSelectEmployee}
      />

      {/* Lista de productos */}
      <OrderDetailsList
        details={orderDetails}
        onAddDetail={handleAddDetail}
        onEditDetail={handleEditDetail}
        onDeleteDetail={handleDeleteDetail}
        onSelectProduct={handleSelectProduct}
        isEditing={isEditing}
        products={products}
        loadProducts={loadProducts}
      />

      {/* Mapa de dirección validada */}
      <OrderMap lat={mapCoords.lat} lng={mapCoords.lng} parsedAddressFields={parsedAddressFields || {}} />
    </div>
  );
};

export default OrdersPage;
