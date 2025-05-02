import { useState } from 'react';
import { fetchCustomers, fetchEmployees, fetchProducts } from '../api/ordersApi';

/**
 * Hook que carga listas de selección para clientes, empleados y productos.
 * Carga solo una vez por tipo, cuando se solicita.
 */
const useOrderOptions = () => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  const [loaded, setLoaded] = useState({
    customers: false,
    employees: false,
    products: false,
  });

  const loadCustomers = async () => {
    if (!loaded.customers) {
      const data = await fetchCustomers();
      setCustomers(data);
      setLoaded((prev) => ({ ...prev, customers: true }));
    }
  };

  const loadEmployees = async () => {
    if (!loaded.employees) {
      const data = await fetchEmployees();
      setEmployees(data);
      setLoaded((prev) => ({ ...prev, employees: true }));
    }
  };

  const loadProducts = async () => {
    if (!loaded.products) {
      const data = await fetchProducts();
      setProducts(data);
      setLoaded((prev) => ({ ...prev, products: true }));
    }
  };

  return {
    customers,
    employees,
    products,
    loadCustomers,
    loadEmployees,
    loadProducts,
  };
};

export default useOrderOptions;
