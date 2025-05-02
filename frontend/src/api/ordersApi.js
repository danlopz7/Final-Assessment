import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api'
const API_URL = `${BASE_URL}/orders`;
const CUSTOMERS_URL = `${BASE_URL}/customers`;
const EMPLOYEES_URL = `${BASE_URL}/employees`;
const PRODUCTS_URL = `${BASE_URL}/products`;


export const fetchOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`);
  return response.data;
};

export const fetchFirstOrder = async () => {
  const response = await axios.get(`${API_URL}/first`);
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

export const fetchNextOrder = async (currentId) => {
  const response = await axios.get(`${API_URL}/${currentId}/next`);
  return response.data; // si no hay next, manejar 204 en el hook
};

export const fetchPreviousOrder = async (currentId) => {
  const response = await axios.get(`${API_URL}/${currentId}/previous`);
  return response.data;
};

export const fetchCustomers = async () => {
  const response = await axios.get(CUSTOMERS_URL);
  return response.data;
};

export const fetchEmployees = async () => {
  const response = await axios.get(EMPLOYEES_URL);
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axios.get(PRODUCTS_URL);
  return response.data;
};


/* export async function fetchOrder() {
  const res = await axios.get('/api/orders/latest');
  return res.data;
}

export async function saveOrder(order, details) {
  await axios.post('/api/orders/save', { order, details });
} */
