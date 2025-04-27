import axios from 'axios';

/* export async function fetchOrder() {
  const res = await axios.get('/api/orders/latest');
  return res.data;
}

export async function saveOrder(order, details) {
  await axios.post('/api/orders/save', { order, details });
} */

const API_URL = '/api/orders';

export const fetchOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

export const updateOrder = async (orderId, orderData) => {
  const response = await axios.put(`${API_URL}/${orderId}`, orderData);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}/${orderId}`);
  return response.data;
};

export const generateOrderReport = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}/report`, {
    responseType: 'blob', // assuming it's a PDF file
  });
  return response.data;
};