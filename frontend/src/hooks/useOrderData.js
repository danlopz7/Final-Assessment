import { useState, useEffect } from 'react';
import { fetchOrderById, createOrder, updateOrder, deleteOrder, generateOrderReport } from '../api/ordersApi';

const useOrderData = () => {
    const [orderData, setOrderData] = useState(null);                             // Datos de la orden actual cargada
    const [orderDetails, setOrderDetails] = useState([]);                         // Detalles de productos de la orden
    const [shippingAddressString, setShippingAddressString] = useState('');       // Dirección de envío en formato string (completo)
    const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });               // Coordenadas (latitud, longitud) que usa el mapa

    const [isEditing, setIsEditing] = useState(false);                            // Bandera para saber si estamos editando
    const [originalOrderData, setOriginalOrderData] = useState(null);             // Copias originales para poder cancelar cambios
    const [originalOrderDetails, setOriginalOrderDetails] = useState([]);         // Copias originales para poder cancelar cambios
    const [originalShippingAddressString, setOriginalShippingAddressString] = useState('');   // Copias originales para poder cancelar cambios

    // Hook que se ejecuta una vez al cargar la página
    useEffect(() => {
        loadInitialOrder();
    }, []);

    // Función que carga la primera orden simulada
    const loadInitialOrder = async () => {
        try {
            const data = {}; // Fake, pero no haremos fetch real ahora
            //const data = await fetchOrderById(); // Asume que fetchOrderById trae la primera orden
            mapBackendData(data);
        } catch (error) {
            console.error('Error loading initial order:', error);
        }
    };

    // Mapea la respuesta del backend al formato que necesita el frontend
    const mapBackendData = (data) => {
        const { customer, employee, shippingAddress, orderDetails } = data;

         // Formatea la dirección completa como un solo string
        const shippingFullAddress = `${shippingAddress.shipAddress}, ${shippingAddress.shipCity}, ${shippingAddress.shipRegion || ''} ${shippingAddress.shipPostalCode}, ${shippingAddress.shipCountry}`.replace(/\s+,/g, '').trim();

        // Carga los datos principales de la orden
        setOrderData({
            orderId: data.orderId,
            customerName: customer.contactName,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            orderDate: data.orderDate,
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
            orderId: data.orderId,
            customerName: customer.contactName,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            orderDate: data.orderDate,
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

    // Actualiza las coordenadas (de momento estático para San Francisco)
    const updateMapCoordinates = (address) => {
        if (address) {
            setMapCoords({ lat: 37.7749, lng: -122.4194 }); // Después se reemplaza con Geocoding real
        }
    };

    // Limpia los campos para crear una nueva orden
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

    // Cambia al modo de edición
    const handleEditOrder = () => {
        setIsEditing(true);
    };

    // Cancela la edición y regresa a los valores originales
    const handleCancelEdit = () => {
        setOrderData(originalOrderData);
        setOrderDetails(originalOrderDetails);
        setShippingAddressString(originalShippingAddressString);
        setIsEditing(false);
    };

    // Guarda la orden (crear o actualizar)
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

        if (orderData.orderId) {
            await updateOrder(orderData.orderId, payload);
        } else {
            await createOrder(payload);
        }

        setIsEditing(false);
        loadInitialOrder(); // Refrescamos
    };

    // Elimina la orden actual
    const handleDeleteOrder = async () => {
        if (orderData?.orderId) {
            await deleteOrder(orderData.orderId);
            loadInitialOrder();
        }
    };

    // Genera un reporte PDF (simulado)
    const handleGenerateReport = async () => {
        if (orderData?.orderId) {
            const file = await generateOrderReport(orderData.orderId);
            const blob = new Blob([file], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `order_${orderData.orderId}_report.pdf`;
            link.click();
        }
    };

    // Actualiza los campos de información general (Customer, Employee, Date)
    const handleOrderInfoChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Actualiza el campo de dirección manualmente
    const handleAddressChange = (e) => {
        setShippingAddressString(e.target.value);
        updateMapCoordinates(e.target.value);
    };

    // Agrega una nueva línea en los detalles de la orden
    const handleAddDetail = () => {
        setOrderDetails(prev => [
            ...prev,
            { productName: '', quantity: 0, unitPrice: 0 },
        ]);
    };

    // Edita un campo de un detalle de producto
    const handleEditDetail = (index, field, value) => {
        setOrderDetails(prev =>
            prev.map((detail, idx) =>
                idx === index ? { ...detail, [field]: value } : detail
            )
        );
    };

    // Elimina una línea de detalles
    const handleDeleteDetail = (index) => {
        setOrderDetails(prev => prev.filter((_, idx) => idx !== index));
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
    };
};

export default useOrderData;
