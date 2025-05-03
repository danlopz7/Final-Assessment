import { useCallback } from 'react';
import {
  fetchFirstOrder,
  fetchOrderById,
  fetchNextOrder,
  fetchPreviousOrder,
  createOrder,
  updateOrder
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

  /**
   * Guarda una orden (crear o actualizar).
   */
  const saveOrder = async (payload) => {
    if (!payload) return;
    const isNew = !payload.orderId;

    if (isNew) {
      await createOrder(payload);
      console.log('Orden creada');
    } else {
      await updateOrder(payload.orderId, payload);
      console.log('Orden actualizada');
    }
  };

  const handleSaveOrder = async (orderData, orderDetails, parsedAddressFields, onDone) => {
    if (!orderData || !parsedAddressFields) {
      console.warn("Faltan datos requeridos para guardar");
      //return;
    }

    /*const errors = [];

    if (!orderData.orderDate) errors.push("Order date is required");
    if (!orderData.customerId) errors.push("Customer must be selected");
    if (!orderData.employeeId) errors.push("Employee must be selected");

    const addr = parsedAddressFields;
    if (!addr.street || !addr.city || !addr.postalCode || !addr.country) {
      errors.push("Complete shipping address is required");
    }

    if (!orderDetails.length) {
      errors.push("At least one order detail is required");
    }

    const invalidDetail = orderDetails.find(d => !d.productId || d.quantity <= 0);
    if (invalidDetail) {
      errors.push("Each order detail must have a valid product and quantity");
    }

    if (errors.length) {
      console.warn("❌ Validation failed:", errors);
      alert("Cannot save order:\n" + errors.join("\n"));
      return;
    }*/

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

    console.log("Payload listo para guardar:", payload);

    try {
      if (orderData.orderId) {
        await updateOrder(orderData.orderId, payload);
        console.log("Orden actualizada con éxito.");
      } else {
        await createOrder(payload);
        console.log("Nueva orden creada con éxito.");
      }

      onDone?.();
    } catch (error) {
      console.error("Error al guardar orden:", error);
    }
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
    saveOrder,
    handleDeleteOrder,
    handleGenerateReport,
  };
};

export default useOrderCrud;



// Guarda una orden (crear o actualizar). Simulado por ahora.
/*const handleSaveOrder = async (orderData, orderDetails, shippingAddressString, onDone) => {
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
};*/

