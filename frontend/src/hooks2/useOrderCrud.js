import { useCallback } from 'react';
import {
  fetchFirstOrder,
  fetchOrderById,
  fetchNextOrder,
  fetchPreviousOrder,
  createOrUpdateOrder,
  updateOrder,
  deleteOrder
} from '../api/ordersApi';

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
      customerId: customer.id,
      customerName: customer.contactName,
      employeeId: employee.id, 
      employeeName: employee.fullName,
      orderDate: new Date(data.orderDate).toISOString().split('T')[0],
    };

    const formattedAddress = `${shippingAddress.shipAddress}, ${shippingAddress.shipCity}, ${shippingAddress.shipRegion || ''} ${shippingAddress.shipPostalCode}, ${shippingAddress.shipCountry}`
      .replace(/\s+,/g, '')
      .trim();

    const formattedDetails = orderDetails.map((detail) => ({
      productId: detail.product.id,
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
    //const data = await fetchOrderById(orderId);
    /* const { order, hasNext, hasPrevious } = await fetchOrderById(orderId);
    return mapBackendData(order); */
    try {
      const { order, hasNext, hasPrevious } = await fetchOrderById(orderId);
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
   * Guarda una orden (crear o actualizar).
   */
  const saveOrder = async (payload) => {
    if (!payload) return;
    const isNew = !payload.orderId;

    if (isNew) {
      await createOrUpdateOrder(payload);
      console.log('Orden creada');
    } else {
      await updateOrder(payload.orderId, payload);
      console.log('Orden actualizada');
    }
  };

  const handleSaveOrder = async (orderData, orderDetails, parsedAddressFields, onDone) => {
    if (!orderData || !parsedAddressFields) {
      console.warn("Faltan datos requeridos para guardar");
      return;
    }

    const payload = {
      orderId: orderData.orderId || null,
      orderDate: orderData.orderDate,
      customer: { id: orderData.customerId },
      employee: { id: orderData.employeeId },
      shippingAddress: {
        shipAddress: parsedAddressFields.street,
        shipCity: parsedAddressFields.city,
        shipRegion: parsedAddressFields.state || null,
        shipPostalCode: parsedAddressFields.postalCode,
        shipCountry: parsedAddressFields.country
      },
      orderDetails: orderDetails.map(d => ({
        product: { id: d.productId },
        quantity: Number(d.quantity)
      }))
    };

    console.log(payload);

    try {
      const createdOrUpdatedOrder = await createOrUpdateOrder(payload); // backend maneja crear/actualizar
      const orderId = createdOrUpdatedOrder.orderId;
      console.log("Orden guardada con éxito");

      // Recarga con navegación incluida
      const { order, hasNext, hasPrevious } = await fetchOrderById(orderId);

      setHasNextOrder(hasNext);
      setHasPreviousOrder(hasPrevious);

      // Mapea los datos para el frontend
      const {
        formattedOrderData,
        formattedDetails,
        formattedAddress
      } = mapBackendData(order);


      // Devuelve todo al hook principal (useOrderData)
      onDone?.({
        formattedOrderData,
        formattedDetails,
        formattedAddress,
      });

    } catch (error) {
      console.error("Error al guardar orden:", error);
    }
  };

  // Elimina una orden.
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      console.log("Orden eliminada con éxito.");
  
      // Primero intenta cargar la siguiente
      const next = await loadNextOrder(orderId);
      if (next) return next;
  
      // Si no hay siguiente, intenta la anterior
      const previous = await loadPreviousOrder(orderId);
      if (previous) return previous;
  
      // Si no hay ninguna, retorna estado vacío
      return {
        formattedOrderData: null,
        formattedDetails: [],
        formattedAddress: '',
      };
    } catch (err) {
      console.error("Error al eliminar orden:", err);
    }
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
    saveOrder,
    handleDeleteOrder,
    handleGenerateReport,
  };
};

export default useOrderCrud;
