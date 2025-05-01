import { useCallback } from 'react';
import { fetchFirstOrder, fetchOrderById, fetchNextOrder, fetchPreviousOrder } from '../api/ordersApi';

/**
 * Hook para manejar operaciones CRUD relacionadas con las órdenes.
 * Puede conectarse con una API real o usar datos simulados.
 */

const useOrderCrud = ({
  setOrderData,
  setOrderDetails,
  setShippingAddressString,
  updateMapCoordinates,
  setOriginalOrderData,
  setOriginalOrderDetails,
  setOriginalShippingAddressString,
  setHasNextOrder,
  setHasPreviousOrder,
}) => {

  // Convierte los datos recibidos del backend al formato del frontend.
  const mapBackendData = useCallback((data) => {
    const { customer, employee, shippingAddress, orderDetails } = data;
    const fullAddress = `${shippingAddress.shipAddress}, ${shippingAddress.shipCity}, ${shippingAddress.shipRegion || ''} ${shippingAddress.shipPostalCode}, ${shippingAddress.shipCountry}`.replace(/\s+,/g, '').trim();
    
    const formatDateForInput = (isoString) => {
      const date = new Date(isoString);
      return date.toISOString().split('T')[0];
    };

    setOrderData({
      orderId: data.orderId,
      customerName: customer.contactName,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      orderDate: formatDateForInput(data.orderDate),
    });

    const details = orderDetails.map(detail => ({
      productName: detail.product.productName,
      unitPrice: detail.product.unitPrice,
      quantity: detail.quantity,
    }));

    setOrderDetails(details);                                       // Actualiza el estado visual actual de la tabla de productos (OrderDetailsList)
    setShippingAddressString(fullAddress);                          // Muestra el texto completo de la dirección en el campo "Shipping Address"
    setOriginalOrderData({ ...data, orderDate: data.orderDate });   // para cancel edit. Guarda una copia original de la orden actual.
    setOriginalOrderDetails(details);                               // para cancel edit. Guarda una copia original de los detalles de productos
    setOriginalShippingAddressString(fullAddress);                  // para cancel edit. Guarda el texto de la dirección original. Sin esto, si escribes una dirección nueva y cancelas, no podrías restaurar la original
    updateMapCoordinates(fullAddress);                              // Convierte la dirección a coordenadas (via Geocoding) y actualiza el centro del mapa.
  }, []);

  const loadInitialOrder = async () => {
    try {
      //const data = await fetchFirstOrder(); // axios ya devuelve `response.data`
      const { order, hasNext, hasPrevious } = await fetchFirstOrder();
      //console.log('data:', data);
      if (order) {
        mapBackendData(order);
        setHasNextOrder(hasNext);
        setHasPreviousOrder(hasPrevious);
      }
      //mapBackendData(data);
    } catch (error) {
      console.error('Error al cargar la primera orden:', error);
    }
  };

  const loadOrder = async (orderId) => {
    const data = await fetchOrderById(orderId);
    mapBackendData(data);
  };

  // Guarda una orden (crear o actualizar). Simulado por ahora.
  const handleSaveOrder = async (orderData, orderDetails, shippingAddressString, onDone) => {
    const payload = {
      customer: { contactName: orderData.customerName },
      employee: { name: orderData.employeeName },
      shippingAddress: shippingAddressString,
      orderDate: orderData.orderDate,
      orderDetails,
      // orderDetails: orderDetails.map(detail => ({
      //   productName: detail.productName,
      //   quantity: detail.quantity,
      //   unitPrice: detail.unitPrice,
      // })),
    };

    // if (orderData.orderId) {
    //   await updateOrder(orderData.orderId, payload);
    // } else {
    //   await createOrder(payload);
    // }

    console.log("Simulando guardar:", payload);
    onDone?.();
    //setIsEditing(false); (pendiente)
    loadInitialOrder(); // Cargar la orden que guardamos (pendiente)
  };

  // Elimina una orden. Simulado.
  const handleDeleteOrder = async () => {
    // if (orderData?.orderId) {
    //   await deleteOrder(orderData.orderId);
    //   loadInitialOrder();
    // }
    console.log("Orden eliminada (simulada)");
    loadInitialOrder();
  };

  // Genera reporte PDF (simulado).
  const handleGenerateReport = async () => {
    // if (orderData?.orderId) {
    //   const file = await generateOrderReport(orderData.orderId);
    //   const blob = new Blob([file], { type: 'application/pdf' });
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = `order_${orderData.orderId}_report.pdf`;
    //   link.click();
    // }
    console.log("Reporte generado (simulado)");
  };

  // Go to next order in list
  const loadNextOrder = async (orderId) => {
    const { order, hasNext, hasPrevious } = await fetchNextOrder(orderId);
    if (order) {
      mapBackendData(order);
      setHasNextOrder(hasNext);
      setHasPreviousOrder(hasPrevious);
    }
  };
  
  // Go to previous order in list
  const loadPreviousOrder = async (orderId) => {
    const { order, hasNext, hasPrevious } = await fetchPreviousOrder(orderId);
    if (order) {
      mapBackendData(order);
      setHasNextOrder(hasNext);
      setHasPreviousOrder(hasPrevious);
    }
  };

  return {
    loadInitialOrder,
    loadOrder,
    loadNextOrder,
    loadPreviousOrder,
    mapBackendData,
    handleSaveOrder,
    handleDeleteOrder,
    handleGenerateReport,
  };
};

export default useOrderCrud;



// Carga una orden de prueba simulada (cuando no hay backend).
/* const loadInitialOrder = async () => {
  const fakeData = {
    orderId: 10249,
    orderDate: "1996-07-05T00:00:00",
    customer: { contactName: "Karin Josephs" },
    shippingAddress: {
      shipAddress: "Luisenstr. 48",
      shipCity: "Münster",
      shipRegion: null,
      shipPostalCode: "44087",
      shipCountry: "Germany"
    },
    employee: { firstName: "Michael", lastName: "Suyama" },
    orderDetails: [
      { product: { productName: "Tofu", unitPrice: 23.25 }, quantity: 9 },
      { product: { productName: "Manjimup Dried Apples", unitPrice: 53.00 }, quantity: 40 }
    ]
  };
  mapBackendData(fakeData);
}; */