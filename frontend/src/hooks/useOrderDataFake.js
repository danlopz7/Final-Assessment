import { useState, useEffect } from 'react';
// import { fetchOrderById, createOrder, updateOrder, deleteOrder, generateOrderReport } from '../api/ordersApi';
// De momento no vamos a usar fetch real para poder simular fake data.

const useOrderData = () => {
  // Datos de la orden actual cargada
  const [orderData, setOrderData] = useState(null);

  // Detalles de productos de la orden
  const [orderDetails, setOrderDetails] = useState([]);

  // Dirección de envío en formato string (completo)
  const [shippingAddressString, setShippingAddressString] = useState('');

  // Coordenadas (latitud, longitud) que usa el mapa
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });

  // Bandera para saber si estamos editando
  const [isEditing, setIsEditing] = useState(false);

  // Copias originales para poder cancelar cambios
  const [originalOrderData, setOriginalOrderData] = useState(null);
  const [originalOrderDetails, setOriginalOrderDetails] = useState([]);
  const [originalShippingAddressString, setOriginalShippingAddressString] = useState('');

  // Para saber si la dirección es válida
  const [isAddressValid, setIsAddressValid] = useState(null);

  //========================================================  






  // Hook que se ejecuta una vez al cargar la página. COPIED ON MAIN HOOK
  useEffect(() => {
    loadInitialOrder();
  }, []);

  // Función que carga la primera orden simulada. COPIED useOrderCrud
  const loadInitialOrder = async () => {
    try {
      const data = {}; // Fake, pero no haremos fetch real ahora
      mapBackendData(data);
    } catch (error) {
      console.error('Error loading initial order:', error);
    }
  };

  // Mapea la respuesta del backend al formato que necesita el frontend. COPIED
  const mapBackendData = (data) => {
    // FAKE DATA simulada
    const fakeData = {
      orderId: 10249,
      orderDate: "1996-07-05T00:00:00",
      customer: {
        contactName: "Karin Josephs"
      },
      shippingAddress: {
        shipAddress: "Luisenstr. 48",
        shipCity: "Münster",
        shipRegion: null,
        shipPostalCode: "44087",
        shipCountry: "Germany"
      },
      employee: {
        firstName: "Michael",
        lastName: "Suyama"
      },
      orderDetails: [
        {
          product: {
            productName: "Tofu",
            unitPrice: 23.25
          },
          quantity: 9
        },
        {
          product: {
            productName: "Manjimup Dried Apples",
            unitPrice: 53.00
          },
          quantity: 40
        }
      ]
    };

    const { customer, employee, shippingAddress, orderDetails } = fakeData;

    // Formatea la dirección completa como un solo string
    const shippingFullAddress = `${shippingAddress.shipAddress}, ${shippingAddress.shipCity}, ${shippingAddress.shipRegion || ''} ${shippingAddress.shipPostalCode}, ${shippingAddress.shipCountry}`.replace(/\s+,/g, '').trim();

    // Carga los datos principales de la orden
    setOrderData({
      orderId: fakeData.orderId,
      customerName: customer.contactName,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      orderDate: fakeData.orderDate,
    });

    // Carga el listado de productos
    setOrderDetails(
      orderDetails.map(detail => ({
        productName: detail.product.productName,
        unitPrice: detail.product.unitPrice,
        quantity: detail.quantity,
      }))
    );

    // Guarda la dirección de envío completa
    setShippingAddressString(shippingFullAddress);

    // Guarda una copia original para cancelar si es necesario
    setOriginalOrderData({
      orderId: fakeData.orderId,
      customerName: customer.contactName,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      orderDate: fakeData.orderDate,
    });

    setOriginalOrderDetails(
      orderDetails.map(detail => ({
        productName: detail.product.productName,
        unitPrice: detail.product.unitPrice,
        quantity: detail.quantity,
      }))
    );

    setOriginalShippingAddressString(shippingFullAddress);

    // Actualiza el mapa (en el futuro con geocoding real)
    updateMapCoordinates(shippingFullAddress);
  };

  //========================================================  






  // Actualiza las coordenadas (de momento estático para San Francisco). COPIED
  const updateMapCoordinates = (address) => {
    if (address) {
      setMapCoords({ lat: 37.7749, lng: -122.4194 });
    }
  };

  // Limpia los campos para crear una nueva orden. COPIED
  const handleNewOrder = () => {
    setOrderData({
      customerName: '',
      employeeName: '',
      orderDate: '',
    });
    setOrderDetails([]);
    setShippingAddressString('');
    setMapCoords({ lat: 0, lng: 0 });
    setIsEditing(true);
  };

  // Cambia al modo de edición. COPIED
  const handleEditOrder = () => {
    setIsEditing(true);
  };

  // Cancela la edición y regresa a los valores originales. COPIED
  const handleCancelEdit = () => {
    setOrderData(originalOrderData);
    setOrderDetails(originalOrderDetails);
    setShippingAddressString(originalShippingAddressString);
    setIsEditing(false);
  };

  // Guarda la orden (crear o actualizar) COPIED
  const handleSaveOrder = async () => {
    const payload = {
      customer: { contactName: orderData.customerName },
      employee: { name: orderData.employeeName },
      shippingAddress: shippingAddressString,
      orderDate: orderData.orderDate,
      orderDetails: orderDetails.map(detail => ({
        productName: detail.productName,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      })),
    };

    // if (orderData.orderId) {
    //   await updateOrder(orderData.orderId, payload);
    // } else {
    //   await createOrder(payload);
    // }

    setIsEditing(false);
    loadInitialOrder(); // Simulamos refrescar la orden
  };

  // Elimina la orden actual COPIED
  const handleDeleteOrder = async () => {
    // if (orderData?.orderId) {
    //   await deleteOrder(orderData.orderId);
    //   loadInitialOrder();
    // }
    console.log('Orden eliminada (simulada)');
  };

  // Genera un reporte PDF (simulado) COPIED
  const handleGenerateReport = async () => {
    // if (orderData?.orderId) {
    //   const file = await generateOrderReport(orderData.orderId);
    //   const blob = new Blob([file], { type: 'application/pdf' });
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = `order_${orderData.orderId}_report.pdf`;
    //   link.click();
    // }
    console.log('Reporte generado (simulado)');
  };

  // Actualiza los campos de información general (Customer, Employee, Date) COPIED
  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Actualiza el campo de dirección manualmente REVISAR SI SE VA USAR
  const handleAddressChange = (e) => {
    setShippingAddressString(e.target.value);
    updateMapCoordinates(e.target.value);
  };

  // Agrega una nueva línea en los detalles de la orden COPIED
  const handleAddDetail = () => {
    setOrderDetails(prev => [
      ...prev,
      { productName: '', quantity: 0, unitPrice: 0 },
    ]);
  };

  // Edita un campo de un detalle de producto COPIED
  const handleEditDetail = (index, field, value) => {
    setOrderDetails(prev =>
      prev.map((detail, idx) =>
        idx === index ? { ...detail, [field]: value } : detail
      )
    );
  };

  // Elimina una línea de detalles COPIED
  const handleDeleteDetail = (index) => {
    setOrderDetails(prev => prev.filter((_, idx) => idx !== index));
  };


  // no se que hace. NO SE USA
  const handlePlaceSelected = (place) => {
    if (!place || !place.geometry) return;

    const formatted = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setShippingAddressString(formatted);
    setMapCoords({ lat, lng });
  };

  // Cuando seleccionamos del autocomplete. COPIED
  const handleSelectAddress = (formattedAddress, lat, lng) => {
    console.log("Seleccionado:", formattedAddress, lat, lng);
    setShippingAddressString(formattedAddress);
    setMapCoords({ lat, lng });
  };


  // Cuando digitamos direccion manualmente al presionar enter. COPIED
  const validateAddressWithGeocoding = async (address) => {
    console.log(address)
    if (!address) return;

    const encoded = encodeURIComponent(address);
    const apiKey = "AIzaSyBPK15nwpPCQEndo378nriZyZA9ALqIMOY";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setMapCoords({ lat: location.lat, lng: location.lng });
        setIsAddressValid(true);
      } else {
        setIsAddressValid(false);
      }
    } catch (error) {
      console.error("Error al validar dirección:", error);
      setIsAddressValid(false);
    }
  };

  // Exportamos todo el control que necesita el OrdersPage.jsx
  return {
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
  };
};

export default useOrderData;
