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

    const [originalOrderData, setOriginalOrderData] = useState(null);       // Copias originales para poder cancelar cambios
    const [originalOrderDetails, setOriginalOrderDetails] = useState([]);   // Copias originales para poder cancelar cambios
    const [originalShippingAddressString, setOriginalShippingAddressString] = useState(''); // Copias originales para poder cancelar cambios

    // Inicia una nueva orden vacía. Limpia los campos
    const handleNewOrder = (resetAddressState) => {
        setOrderData({                      // Limpia info general
            customerName: '',
            employeeName: '',
            orderDate: ''
        });
        setOrderDetails([]);                // Limpia tabla de productos
        resetAddressState?.();              // limpia dirección, coords, y campos parsed
        //setShippingAddressString('');     CHECK WHY THIS WASNT INCLUDED
        //setMapCoords({ lat: 0, lng: 0 }); CHECK WHY THIS WASNT INCLUDED 
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
    const handleOrderInfoChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Agrega una nueva línea vacía al detalle de la orden.
    const handleAddDetail = () => {
        setOrderDetails(prev => [
            ...prev,
            { productName: '', quantity: 0, unitPrice: 0 }]);
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
        handleOrderInfoChange,
        handleAddDetail,
        handleEditDetail,
        handleDeleteDetail,
        hasNextOrder,
        setHasNextOrder,
        hasPreviousOrder,
        setHasPreviousOrder,
    };
};

export default useOrderState;




    // const handlePreviousOrder = (loadOrder) => {
    //     if (orders.length > 0 && currentOrderIndex > 0) {
    //         const newIndex = currentOrderIndex - 1;
    //         setCurrentOrderIndex(newIndex);
    //         loadOrder(orders[newIndex].id);
    //     }
    // };

    // /**
    //  * Navega a la siguiente orden si no estamos al final.
    //  */
    // const handleNextOrder = (loadOrder) => {
    //     if (orders.length > 0 && currentOrderIndex < orders.length - 1) {
    //         const newIndex = currentOrderIndex + 1;
    //         setCurrentOrderIndex(newIndex);
    //         loadOrder(orders[newIndex].id);
    //     }
    // };
