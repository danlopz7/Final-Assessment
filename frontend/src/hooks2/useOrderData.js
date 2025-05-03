import { useEffect } from 'react';
import useOrderCrud from './useOrderCrud';
import useOrderState from './useOrderState';
import useAddress from './useAddress';
import { fetchOrderById, fetchNextOrder, fetchPreviousOrder } from '../api/ordersApi';

/**
 * Hook principal que integra estado, lógica de dirección y operaciones CRUD.
 */
const useOrderData = () => {

  // Secciones por responsabilidad
  const orderState = useOrderState();       //Estado local de la orden (actual, original, edición)
  const address = useAddress();             //Dirección de envío + mapa + validación
  const crud = useOrderCrud({               //CRUD remoto: carga, mapea, y retorna la orden (no maneja estado)
    setHasNextOrder: orderState.setHasNextOrder,
    setHasPreviousOrder: orderState.setHasPreviousOrder,
  });

  // Carga inicial al montar el componente
  useEffect(() => {
    loadInitialOrder();
  }, []);

  const loadInitialOrder = async () => {
    const {
      formattedOrderData,
      formattedDetails,
      formattedAddress,
    } = await crud.loadInitialOrder();

    orderState.applyLoadedOrder(formattedOrderData, formattedDetails, formattedAddress);
    address.setShippingAddressString(formattedAddress);
    address.updateMapCoordinates(formattedAddress);
  };

  

  const handleNextOrder = async () => {
    if (!orderState.orderData?.orderId) return;
    const {
      formattedOrderData,
      formattedDetails,
      formattedAddress,
    } = await crud.loadNextOrder(orderState.orderData.orderId);

    orderState.applyLoadedOrder(formattedOrderData, formattedDetails, formattedAddress);
    address.setShippingAddressString(formattedAddress);
    address.updateMapCoordinates(formattedAddress);
  };

  

  const handlePreviousOrder = async () => {
    if (!orderState.orderData?.orderId) return;
    const {
      formattedOrderData,
      formattedDetails,
      formattedAddress,
    } = await crud.loadPreviousOrder(orderState.orderData.orderId);

    orderState.applyLoadedOrder(formattedOrderData, formattedDetails, formattedAddress);
    address.setShippingAddressString(formattedAddress);
    address.updateMapCoordinates(formattedAddress);
  };

  return {
    // Estado actual
    orderData: orderState.orderData,
    orderDetails: orderState.orderDetails,
    isEditing: orderState.isEditing,

    // Dirección y mapa
    shippingAddressString: address.shippingAddressString,
    mapCoords: address.mapCoords,
    isAddressValid: address.isAddressValid,
    parsedAddressFields: address.parsedAddressFields,

    // Acciones
    handleOrderInfoChange: orderState.handleOrderInfoChange,                                /** Cambia el valor de un campo del formulario (customer, date, etc.) */
    handleNewOrder: () => orderState.handleNewOrder(address.resetAddressState),             /** Crea una nueva orden en blanco */
    handleEditOrder: orderState.handleEditOrder,                                            /** Activa el modo edición */
    handleCancelEdit: () => orderState.handleCancelEdit(address.setShippingAddressString),  /** Cancela la edición y restaura los valores originales */

                                                             /** Guarda la orden actual (crear o actualizar) */

    handleSaveOrder: () => crud.handleSaveOrder(
      orderState.orderData,
      orderState.orderDetails,
      address.parsedAddressFields,   // Usa campos desglosados (no un string)
      () => orderState.setIsEditing(false)
    ),

    handleDeleteOrder: crud.handleDeleteOrder,                          /** Elimina la orden actual (simulado) */
    /* handleDeleteOrder: () => {
      console.log('Simulando eliminar orden'); // Puedes luego conectar deleteOrder aquí
      loadInitialOrder();
    }, */


    handleGenerateReport: crud.handleGenerateReport,                    /** Genera un PDF de la orden actual (simulado) */
    handleGenerateReport: () => {
      console.log('Simulando generación de PDF');
    },

    // Detalles de productos
    handleAddDetail: orderState.handleAddDetail,                        /** Agrega un nuevo detalle de producto vacío */
    handleEditDetail: orderState.handleEditDetail,                      /** Edita un valor de un detalle (producto, cantidad, precio) */
    handleDeleteDetail: orderState.handleDeleteDetail,                  /** Elimina una línea del detalle de orden */
    handleSelectProduct: orderState.handleSelectProduct,

    // Dirección
    handleSelectAddress: address.handleSelectAddress,                   /** Actualiza dirección manualmente (al escribir) o selecciona desde Autocomplete */
    validateAddressWithGeocoding: address.validateAddressWithGeocoding, /** Valida una dirección escrita presionando ENTER, usando la Geocoding API */

    // Navegación por orden previa o siguiente (vía backend)
    handlePreviousOrder,
    handleNextOrder,
    hasNextOrder: orderState.hasNextOrder,
    hasPreviousOrder: orderState.hasPreviousOrder,
    handleSelectCustomer: orderState.handleSelectCustomer,
    handleSelectEmployee: orderState.handleSelectEmployee,

  };
};

export default useOrderData;


/* const handleNextOrder = () => {
    if (orderState.orderData?.orderId) {
      crud.loadNextOrder(orderState.orderData.orderId);
    }
  }; */


  /* const handlePreviousOrder = () => {
    if (orderState.orderData?.orderId) {
      crud.loadPreviousOrder(orderState.orderData.orderId);
    }
  }; */

  /*handleSaveOrder: () =>
      crud.handleSaveOrder(
        orderState.orderData,
        orderState.orderDetails,
        address.shippingAddressString,
        () => orderState.setIsEditing(false)
      ),    */   