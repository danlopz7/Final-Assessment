import { useCallback } from 'react';
import { fetchFirstOrder, fetchOrderById, fetchNextOrder, fetchPreviousOrder } from '../api/ordersApi';

/**
 * Hook para manejar operaciones CRUD relacionadas con las órdenes.
 * Puede conectarse con una API real o usar datos simulados.
 */

const useOrderCrud = ({
  setHasNextOrder,
  setHasPreviousOrder,
}) => {

  /**
   * Convierte la estructura del backend a un formato plano para el frontend.
   */
  const mapBackendData = useCallback((data) => {
    const { customer, employee, shippingAddress, orderDetails } = data;

    const formattedOrderData = {
      orderId: data.orderId,
      customerName: customer.contactName,
      employeeName: employee.fullName,
      orderDate: new Date(data.orderDate).toISOString().split('T')[0],
    };

    const formattedAddress = `${shippingAddress.shipAddress}, ${shippingAddress.shipCity}, ${shippingAddress.shipRegion || ''} ${shippingAddress.shipPostalCode}, ${shippingAddress.shipCountry}`
      .replace(/\s+,/g, '')
      .trim();

    const formattedDetails = orderDetails.map((detail) => ({
      productName: detail.product.productName,
      unitPrice: detail.product.unitPrice,
      quantity: detail.quantity,
    }));

    return {
      formattedOrderData,
      formattedDetails,
      formattedAddress,
    };
  }, []);

  /**
   * Carga la primera orden desde el backend.
   */
  const loadInitialOrder = async () => {
    try {
      const { order, hasNext, hasPrevious } = await fetchFirstOrder();
      if (order) {
        setHasNextOrder(hasNext);
        setHasPreviousOrder(hasPrevious);
        return mapBackendData(order);
      }
    } catch (error) {
      console.error('Error al cargar la primera orden:', error);
    }
  };

  /**
   * Carga una orden por ID.
   */
  const loadOrder = async (orderId) => {
    const data = await fetchOrderById(orderId);
    return mapBackendData(data);
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

  /**
   * Carga la siguiente orden respecto a una ID actual.
   */
  const loadNextOrder = async (orderId) => {
    const { order, hasNext, hasPrevious } = await fetchNextOrder(orderId);
    if (order) {
      setHasNextOrder(hasNext);
      setHasPreviousOrder(hasPrevious);
      return mapBackendData(order);
    }
  };

  /**
   * Carga la orden anterior respecto a una ID actual.
   */
  const loadPreviousOrder = async (orderId) => {
    const { order, hasNext, hasPrevious } = await fetchPreviousOrder(orderId);
    if (order) {
      setHasNextOrder(hasNext);
      setHasPreviousOrder(hasPrevious);
      return mapBackendData(order);
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
