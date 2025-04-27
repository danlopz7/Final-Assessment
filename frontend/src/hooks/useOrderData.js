import { useState, useEffect } from 'react';
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  generateOrderReport,
} from '../api/ordersApi';

const useOrderData = () => {
  // State to hold all orders fetched
  const [orders, setOrders] = useState([]);
  // Index to track which order we're currently viewing
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  // State for the currently selected order data (OrderInfo)
  const [orderData, setOrderData] = useState(null);
  // State for current order's details (OrderDetailsList)
  const [orderDetails, setOrderDetails] = useState([]);
  // Coordinates for Google Map (Shipping Address visualization)
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
  // State to track the address entered
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    coordinates: '',
  });

  // Load all orders on first page load
  /* useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      if (data.length > 0) {
        loadOrder(data[0].id);
      }
    };
    loadOrders();
  }, []); */

  useEffect(() => {
    // 1. Load fake orders initially
    const loadFakeOrders = () => {
      const fakeOrders = [
        {
          id: 1,
          customerName: 'John Doe',
          shipAddress: '1 Market St',
          shipCity: 'San Francisco',
          shipRegion: 'CA',
          shipPostalCode: '94105',
          shipCountry: 'USA',
          orderDate: '2025-04-27',
          employeeId: 'E123',
          orderDetails: [
            { product: 'Laptop', quantity: 1, unitPrice: 1200 },
            { product: 'Mouse', quantity: 2, unitPrice: 25 },
          ],
        },
      ];
      setOrders(fakeOrders); // only set orders here
    };

    loadFakeOrders();
  }, []);


  useEffect(() => {
    // 2. Once orders are loaded, load the first order
    if (orders.length > 0) {
      loadOrder(orders[0].id);
    }
  }, [orders]); // <-- important: this depends on `orders` if this value changes then useEffect runs again


  const loadOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderData({
        id: order.id,
        customerName: order.customerName,
        //shippingAddress: order.shippingAddress,
        orderDate: order.orderDate,
        employeeId: order.employeeId,
      });
      setOrderDetails(order.orderDetails || []);
      setAddressData({
        street: order.shipAddress || '',
        city: order.shipCity || '',
        state: order.shipRegion || '',
        postalCode: order.shipPostalCode || '',
        country: order.shipCountry || '',
        coordinates: `${mapCoords.lat}, ${mapCoords.lng}`,
      });
      updateMapCoordinates(order.shippingAddress);
      updateMapCoordinates(order.shipAddress, order.shipCity, order.shipRegion, order.shipPostalCode, order.shipCountry);
    }
  };

  // Load a specific order and set its data
  /* const loadOrder = async (orderId) => {
    const data = await fetchOrderById(orderId);
    setOrderData({
      id: data.id,
      customerName: data.customerName,
      shippingAddress: data.shippingAddress,
      orderDate: data.orderDate,
      employeeId: data.employeeId,
    });
    setOrderDetails(data.orderDetails || []);
    updateMapCoordinates(data.shippingAddress);
  }; */

  // Update map based on shipping address (mocked coords for now)
  /* const updateMapCoordinates = (address) => {
    // Very basic mock for now: you would integrate a real Geocoding API later
    if (address) {
      // (Later you can call a real Google Geocoding API here)
      setMapCoords({ lat: 37.7749, lng: -122.4194 }); // dummy coords (San Francisco)
    }
  }; */

  const updateMapCoordinates = (street, city, state, postalCode, country) => {
    if (street || city) {
      setMapCoords({ lat: 37.7749, lng: -122.4194 }); // Fake coords for now
    }
  };

  // Clears all fields to create a brand new order
  const handleNewOrder = () => {
    setOrderData({
      customerName: '',
      //shippingAddress: '',
      orderDate: '',
      employeeId: '',
    });
    setOrderDetails([]);
    setAddressData({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      coordinates: '',
    });
    //setMapCoords({ lat: 0, lng: 0 });
    setMapCoords({ lat: 37.7749, lng: -122.4194 }); // Reset coords
  };

  // Save the current order (either create new or update existing)
  const handleSaveOrder = async () => {
    const payload = {
      ...orderData,
      shipAddress: addressData.street,
      shipCity: addressData.city,
      shipRegion: addressData.state,
      shipPostalCode: addressData.postalCode,
      shipCountry: addressData.country,
      orderDetails,
    };

    if (orderData.id) {
      await updateOrder(orderData.id, payload); // Update if ID exists
    } else {
      await createOrder(payload); // Else, create new order
    }

    // After saving, refresh the list of orders
    const updatedOrders = await fetchOrders();
    setOrders(updatedOrders);
    const idx = updatedOrders.findIndex((o) => o.id === orderData.id);
    setCurrentOrderIndex(idx !== -1 ? idx : 0);
  };


  // Delete the currently selected order
  const handleDeleteOrder = async () => {
    if (orderData?.id) {
      await deleteOrder(orderData.id);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      if (updatedOrders.length > 0) {
        loadOrder(updatedOrders[0].id); // Load first order if any OR load a previous index
        setCurrentOrderIndex(0);
      } else {
        handleNewOrder(); // No orders left, clear fields
      }
    }
  };

  // Request backend to generate PDF report for current order
  const handleGenerateReport = async () => {
    if (orderData?.id) {
      const file = await generateOrderReport(orderData.id);
      const blob = new Blob([file], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `order_${orderData.id}_report.pdf`;
      link.click();
    }
  };

  // Go to previous order in list
  const handlePreviousOrder = () => {
    if (orders.length > 0 && currentOrderIndex > 0) {
      const newIndex = currentOrderIndex - 1;
      setCurrentOrderIndex(newIndex);
      loadOrder(orders[newIndex].id);
    }
  };

  // Go to next order in list
  const handleNextOrder = () => {
    if (orders.length > 0 && currentOrderIndex < orders.length - 1) {
      const newIndex = currentOrderIndex + 1;
      setCurrentOrderIndex(newIndex);
      loadOrder(orders[newIndex].id);
    }
  };


  // Update the order's general fields (OrderInfo)
  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* if (name === 'shippingAddress') {
      updateMapCoordinates(value); // Update map if address changes
    } */
  };


  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name !== 'coordinates') {
      updateMapCoordinates(
        name === 'street' ? value : addressData.street,
        name === 'city' ? value : addressData.city,
        name === 'state' ? value : addressData.state,
        name === 'postalCode' ? value : addressData.postalCode,
        name === 'country' ? value : addressData.country
      );
    }
  };

  /* const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Si el usuario cambia dirección manualmente, podrías actualizar coordenadas aquí más adelante
  }; */


  // Add a new empty row to OrderDetails
  const handleAddDetail = () => {
    setOrderDetails((prev) => [
      ...prev,
      { product: '', quantity: 0, unitPrice: 0 },
    ]);
  };

  // Edit a specific field (product, quantity, price) in an OrderDetail row
  const handleEditDetail = (index, field, value) => {
    setOrderDetails((prev) =>
      prev.map((detail, idx) =>
        idx === index ? { ...detail, [field]: value } : detail
      )
    );
  };

  // Remove an OrderDetail row
  const handleDeleteDetail = (index) => {
    setOrderDetails((prev) => prev.filter((_, idx) => idx !== index));
  };

  const isNewOrder = !orderData?.id;

  return {
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
  };
};

export default useOrderData;
  




  // Return all state and handlers so the page can use them
  /* return {
    orderData,
    orderDetails,
    mapCoords,
    handleNewOrder,
    handleSaveOrder,
    handleDeleteOrder,
    handleGenerateReport,
    handlePreviousOrder,
    handleNextOrder,
    handleOrderInfoChange,
    handleAddDetail,
    handleEditDetail,
    handleDeleteDetail,
  }; */



/* fetching orders
moving between them
editing order info
managing OrderDetails
API calls for Save / Delete / Generate PDF */

/* 
Concept	Purpose
orders, currentOrderIndex	Manage list of orders and which one is selected
orderData, orderDetails	Hold info for currently active order
mapCoords	Coordinates to center the Google Map
Handlers like handleNewOrder, handleSaveOrder	Connect UI actions (buttons) with backend API
handleOrderInfoChange, handleAddDetail, etc.	Keep form fields and details list updated live
 */