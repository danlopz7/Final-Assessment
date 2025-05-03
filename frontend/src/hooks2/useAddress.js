import { useState } from 'react';

/**
 * Hook para manejar dirección y coordenadas, sea escrita o seleccionada.
 */

/**
 * Hook para manejar dirección de envío:
 * - Texto completo (shippingAddressString)
 * - Coordenadas (mapCoords)
 * - Validación de estructura (street, city, state, postalCode, country)
 * - Desglose de componentes para mostrar en campos readonly
 */
const useAddress = () => {
  const [shippingAddressString, setShippingAddressString] = useState('');
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
  const [isAddressValid, setIsAddressValid] = useState(null);
  const [parsedAddressFields, setParsedAddressFields] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const apiKey = "AIzaSyBPK15nwpPCQEndo378nriZyZA9ALqIMOY";

  /**
   * Consulta la API de geocoding y actualiza coordenadas.
   */
  /**
   * Usa Geocoding API para validar y extraer componentes desde un texto libre
   */
  const validateAddressWithGeocoding = async (address) => {
    if (!address) return;

    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "OK") {
        const components = data.results[0].address_components;
        const location = data.results[0].geometry.location;
        const fields = extractAddressParts(components);

        const isValid = fields.street && fields.city && fields.state && fields.postalCode && fields.country;

        setMapCoords({ lat: location.lat, lng: location.lng });
        setIsAddressValid(isValid);
        setParsedAddressFields(fields);
      } else {
        setIsAddressValid(false);
      }
    } catch (err) {
      console.error("Error al geocodificar:", err);
      setIsAddressValid(false);
    }
  };



  /**
   * Selección desde el Autocomplete
   * - Usa directamente lat/lng y address_components si vienen
   * - Si no hay coordenadas, intenta usar Geocoding
   */
  const handleSelectAddress = async (formattedAddress, lat = null, lng = null, components = null) => {
    setShippingAddressString(formattedAddress);

    if (components) {
      const fields = extractAddressParts(components);
      const isValid = fields.street && fields.city && fields.state && fields.postalCode && fields.country;
      setParsedAddressFields(fields);
      setIsAddressValid(isValid);
    }

    if (lat && lng) {
      setMapCoords({ lat, lng });
    } else {
      await validateAddressWithGeocoding(formattedAddress);
    }
  };

  /**
   * Extrae partes importantes desde address_components
   */
  /*const extractAddressParts = (components) => {
    const get = (type, useShort = false) =>
      components.find((c) => c.types.includes(type))?.[useShort ? 'short_name' : 'long_name'] || '';

    return {
      street: `${get('street_number')} ${get('route')}`.trim(),
      city: get('locality'),
      state: get('administrative_area_level_1', true),
      postalCode: get('postal_code'),
      country: get('country'),
    };
  };*/

  const extractAddressParts = (components) => {
    return {
      street: `${getNameWithinLimit(components, 'street_number', 60)} ${getNameWithinLimit(components, 'route', 60)}`.trim(),
      city: getNameWithinLimit(components, 'locality', 15),
      state: getNameWithinLimit(components, 'administrative_area_level_1', 15),
      postalCode: getNameWithinLimit(components, 'postal_code', 10),
      country: getNameWithinLimit(components, 'country', 15),
    };
  };

  const getNameWithinLimit = (components, type, limit) => {
    const match = components.find((c) => c.types.includes(type));
    if (!match) return '';
    const { long_name, short_name } = match;

    if (long_name && long_name.length <= limit) return long_name;
    if (short_name && short_name.length <= limit) return short_name;
    return ''; // ambos inválidos
  };

  const resetAddressState = () => {
    setShippingAddressString('');
    setMapCoords({ lat: 0, lng: 0 });
    setIsAddressValid(null);
    setParsedAddressFields({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
  };


  // Alias por compatibilidad
  const updateMapCoordinates = validateAddressWithGeocoding;

  return {
    shippingAddressString,
    setShippingAddressString,
    mapCoords,
    setMapCoords,
    isAddressValid,
    setIsAddressValid,
    parsedAddressFields,
    handleSelectAddress,
    validateAddressWithGeocoding,
    updateMapCoordinates,         //: validateAddressWithGeocoding, // para compatibilidad con el código actual
    resetAddressState
  };
};

export default useAddress;



// import { useState } from 'react';

// /**
//  * Hook para manejar el estado y validación de la dirección de envío,
//  * así como su conversión a coordenadas.
//  */

// const useAddress = () => {
//   const [shippingAddressString, setShippingAddressString] = useState('');
//   const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
//   const [isAddressValid, setIsAddressValid] = useState(null);

//   // Simula la obtención de coordenadas a partir de una dirección (por ahora hardcoded).
//   const updateMapCoordinates = (address) => {
//     if (address) {
//       setMapCoords({ lat: 37.7749, lng: -122.4194 });
//     }
//   };

//   // Cuando el usuario selecciona una dirección desde el Autocomplete.
//   const handleSelectAddress = (formattedAddress, lat, lng) => {
//     console.log("Seleccionado:", formattedAddress, lat, lng);
//     setShippingAddressString(formattedAddress);
//     if (lat && lng) {
//       setMapCoords({ lat, lng });
//       setIsAddressValid(true);
//     }
//   };

//   // Valida una dirección digitada (no seleccionada) usando Google Geocoding API.
//   const validateAddressWithGeocoding = async (address) => {
//     if (!address) return;

//     const encoded = encodeURIComponent(address);
//     const apiKey = "AIzaSyBPK15nwpPCQEndo378nriZyZA9ALqIMOY";
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.status === "OK") {
//         const loc = data.results[0].geometry.location;
//         setMapCoords({ lat: loc.lat, lng: loc.lng });
//         setIsAddressValid(true);
//       } else {
//         setIsAddressValid(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setIsAddressValid(false);
//     }
//   };

//   return {
//     shippingAddressString,
//     setShippingAddressString,
//     mapCoords,
//     setMapCoords,
//     isAddressValid,
//     setIsAddressValid,
//     handleSelectAddress,
//     validateAddressWithGeocoding,
//     updateMapCoordinates,
//   };
// };

// export default useAddress;



// const resolveCoordinatesFromAddress = async (address) => {
//   if (!address) return;

//   const encoded = encodeURIComponent(address);
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

//   try {
//     const res = await fetch(url);
//     const data = await res.json();

//     if (data.status === "OK") {
//       const loc = data.results[0].geometry.location;
//       setMapCoords({ lat: loc.lat, lng: loc.lng });
//       setIsAddressValid(true);
//     } else {
//       console.warn("Geocoding falló con estado:", data.status);
//       setIsAddressValid(false);
//     }
//   } catch (err) {
//     console.error("Error al obtener coordenadas:", err);
//     setIsAddressValid(false);
//   }
// };

/**
  * Cuando seleccionamos una dirección desde el autocomplete.
  * Si trae lat/lng, los usamos. Si no, usamos geocoding.
  */
// const handleSelectAddress = async (formattedAddress, lat = null, lng = null) => {
//   setShippingAddressString(formattedAddress);

//   if (lat && lng) {
//     setMapCoords({ lat, lng });
//     setIsAddressValid(true);
//   } else {
//     await resolveCoordinatesFromAddress(formattedAddress);
//   }
// };