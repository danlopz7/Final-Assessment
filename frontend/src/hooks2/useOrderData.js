import { useEffect } from 'react';
import useOrderCrud from './useOrderCrud';
import useOrderState from './useOrderState';
import useAddress from './useAddress';
import { fetchOrderById, fetchNextOrder, fetchPreviousOrder } from '../api/ordersApi';

const useOrderData = () => {

  // Secciones por responsabilidad
  const orderState = useOrderState();
  const address = useAddress();
  const crud = useOrderCrud({
    ...orderState,
    setShippingAddressString: address.setShippingAddressString,
    updateMapCoordinates: address.updateMapCoordinates,
    setHasNextOrder: orderState.setHasNextOrder,
    setHasPreviousOrder: orderState.setHasPreviousOrder,
  });

  // Carga inicial al montar el componente
  useEffect(() => {
    crud.loadInitialOrder();
  }, []);

  const handleNextOrder = () => {
    if (orderState.orderData?.orderId) {
      crud.loadNextOrder(orderState.orderData.orderId);
    }
  };

  const handlePreviousOrder = () => {
    if (orderState.orderData?.orderId) {
      crud.loadPreviousOrder(orderState.orderData.orderId);
    }
  };

  return {
    // Datos de la orden
    orderData: orderState.orderData,
    orderDetails: orderState.orderDetails,
    isEditing: orderState.isEditing,

    // Dirección y mapa
    shippingAddressString: address.shippingAddressString,
    mapCoords: address.mapCoords,
    isAddressValid: address.isAddressValid,
    parsedAddressFields: address.parsedAddressFields,

    handleOrderInfoChange: orderState.handleOrderInfoChange,            /** Cambia el valor de un campo del formulario (customer, date, etc.) */
    handleNewOrder: orderState.handleNewOrder,                          /** Crea una nueva orden en blanco */
    handleEditOrder: orderState.handleEditOrder,                        /** Activa el modo edición */dit: () =>
      orderState.handleCancelEdit(address.setShippingAddressString),    /** Cancela la edición y restaura los valores originales */

    handleSaveOrder: () =>
      crud.handleSaveOrder(
        orderState.orderData,
        orderState.orderDetails,
        address.shippingAddressString,
        () => orderState.setIsEditing(false)
      ),                                                                /** Guarda la orden actual (crear o actualizar) */

    handleDeleteOrder: crud.handleDeleteOrder,                          /** Elimina la orden actual (simulado) */
    handleGenerateReport: crud.handleGenerateReport,                    /** Genera un PDF de la orden actual (simulado) */

    handleAddDetail: orderState.handleAddDetail,                        /** Agrega un nuevo detalle de producto vacío */
    handleEditDetail: orderState.handleEditDetail,                      /** Edita un valor de un detalle (producto, cantidad, precio) */
    handleDeleteDetail: orderState.handleDeleteDetail,                  /** Elimina una línea del detalle de orden */

    handleSelectAddress: address.handleSelectAddress,                   /** Actualiza dirección manualmente (al escribir) o selecciona desde Autocomplete */
    validateAddressWithGeocoding: address.validateAddressWithGeocoding, /** Valida una dirección escrita presionando ENTER, usando la Geocoding API */

    /** Navegación por orden previa o siguiente (vía backend) */
    handlePreviousOrder,
    handleNextOrder,
    hasNextOrder: orderState.hasNextOrder,
    hasPreviousOrder: orderState.hasPreviousOrder,

  };
};

export default useOrderData;
