import { useState } from 'react';

/**
 * Hook para manejar el estado de una orden y sus detalles.
 */

const useOrderState = () => {
    const [orderData, setOrderData] = useState(null);       // Datos de la orden actual cargada
    const [orderDetails, setOrderDetails] = useState([]);   // Detalles de productos de la orden
    const [isEditing, setIsEditing] = useState(false);      // Bandera para saber si estamos editando

    const [hasNextOrder, setHasNextOrder] = useState(false);
    const [hasPreviousOrder, setHasPreviousOrder] = useState(false);

    const [originalOrderData, setOriginalOrderData] = useState(null);                       // Copias originales para poder cancelar cambios
    const [originalOrderDetails, setOriginalOrderDetails] = useState([]);                   // Copias originales para poder cancelar cambios
    const [originalShippingAddressString, setOriginalShippingAddressString] = useState(''); // Copias originales para poder cancelar cambios

    // Inicia una nueva orden vacía. Limpia los campos
    const handleNewOrder = (resetAddressState) => {
        setOrderData({                      // Limpia info general
            customerId: '',
            customerName: '',
            employeeId: '',
            employeeName: '',
            orderDate: ''
        });
        setOrderDetails([]);                // Limpia tabla de productos
        resetAddressState?.();              // limpia dirección, coords, y campos parsed
        setIsEditing(true);
    };

    // Activa el modo edición.
    const handleEditOrder = () => setIsEditing(true);

    // Restaura los valores originales de la orden (cancelar edición).
    const handleCancelEdit = (setShippingAddressString) => {
        setOrderData(originalOrderData);
        setOrderDetails(originalOrderDetails);
        setShippingAddressString(originalShippingAddressString);
        setIsEditing(false);
    };

    // Actualiza un campo general del formulario (customerName, orderDate...). 
    // No es suficiente para capturar el ID desde e.target.value porque <option> no emite un click
    // que podamos interceptar directamente. Asi que no extraemos el id de la opcion con esta funcion.
    const handleOrderInfoChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
    * Cuando seleccionamos un cliente del dropdown.
    */
    const handleSelectCustomer = (id, name) => {
        setOrderData(prev => ({
            ...prev,
            customerId: id,
            customerName: name
        }));
    };

    /**
    * Cuando seleccionamos un empleado del dropdown.
    */
    const handleSelectEmployee = (id, name) => {
        setOrderData((prev) => ({
            ...prev,
            employeeId: id,
            employeeName: name
        }));
    };

    /**
    * Cuando seleccionamos un producto desde un detalle.
    */
    const handleSelectProduct = (index, productId, name, unitPrice) => {
        setOrderDetails((prev) =>
            prev.map((detail, idx) =>
                idx === index
                    ? { ...detail, productId, productName: name, unitPrice }
                    : detail
            )
        );
    };

    // Agrega una nueva línea vacía al detalle de la orden.
    const handleAddDetail = () => {
        setOrderDetails(prev => [
            ...prev,
            { productId: '', productName: '', quantity: 0, unitPrice: 0 }]);
    };

    // Edita un campo dentro de una línea del detalle.
    const handleEditDetail = (index, field, value) => {
        setOrderDetails(prev =>
            prev.map((detail, idx) =>
                idx === index ? { ...detail, [field]: value } : detail
            )
        );
    };

    // Elimina una línea del detalle.
    const handleDeleteDetail = (index) => {
        setOrderDetails(prev => prev.filter((_, i) => i !== index));
    };

    const applyLoadedOrder = (formattedOrderData, formattedDetails, formattedAddress) => {
        setOrderData(formattedOrderData);
        setOrderDetails(formattedDetails);
        setOriginalOrderData(formattedOrderData);
        setOriginalOrderDetails(formattedDetails);
        setOriginalShippingAddressString(formattedAddress);
    };

    return {
        orderData,
        setOrderData,
        orderDetails,
        setOrderDetails,
        isEditing,
        setIsEditing,
        originalOrderData,
        setOriginalOrderData,
        originalOrderDetails,
        setOriginalOrderDetails,
        originalShippingAddressString,
        setOriginalShippingAddressString,
        handleNewOrder,
        handleEditOrder,
        handleCancelEdit,
        handleOrderInfoChange,  //remover este
        handleAddDetail,
        handleEditDetail,
        handleDeleteDetail,
        applyLoadedOrder,
        hasNextOrder,
        setHasNextOrder,
        hasPreviousOrder,
        setHasPreviousOrder,
        handleSelectCustomer,
        handleSelectEmployee,
        handleSelectProduct,
    };
};

export default useOrderState;
