import { useState, useEffect } from 'react';

/**
 * Hook para manejar dirección y coordenadas, sea escrita o seleccionada.:
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
   * Selección desde el Autocomplete
   * - Usa directamente lat/lng y address_components si vienen
   * - Si no hay coordenadas, intenta usar Geocoding
   */
  const handleSelectAddress = async (formattedAddress, lat = null, lng = null, components = null) => {

    setShippingAddressString(formattedAddress);

    if (components) {
      const fields = extractAddressParts(components);
      const isValid = isCompleteAddress(fields);
      setParsedAddressFields(fields);
      setIsAddressValid(isCompleteAddress(fields));
    }

    if (lat && lng) {
      setMapCoords({ lat, lng });
    } else {
      console.log("validating address with geocoding")
      await validateAddressWithGeocoding(formattedAddress);
    }
  };

  const isCompleteAddress = (fields) => {
    return fields.street && fields.city && fields.state && fields.postalCode && fields.country;
  };

  /**
   * Consulta la API de geocoding y actualiza coordenadas.
   * Usa Geocoding API para validar y extraer componentes desde un texto libre
   */
  const validateAddressWithGeocoding = async (address) => {

    if (!address) return;

    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log("Geocoding data:", data); // respuesta de Google

      if (data.status === "OK") {
        const components = data.results[0].address_components;
        const location = data.results[0].geometry.location;
        const fields = extractAddressParts(components);

        console.log("Parsed fields:", fields);

        const isValid = isCompleteAddress(fields);
        setParsedAddressFields(fields);
        setIsAddressValid(isCompleteAddress(fields));
        setMapCoords({ lat: location.lat, lng: location.lng });
      } else {
        console.warn("⚠️ Geocoding failed:", data.status);
        setIsAddressValid(false);
      }
    } catch (err) {
      console.error("Error al geocodificar:", err);
      setIsAddressValid(false);
    }
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { street, city, state, postalCode, country } = parsedAddressFields;
      const isComplete = [street, city, state, postalCode, country].every(
        (v) => typeof v === 'string' && v.trim() !== ''
      );
      setIsAddressValid(isComplete);
    }, 300); // espera 300ms antes de evaluar
  
    return () => clearTimeout(timeout); // limpia timeout si el efecto se dispara otra vez antes de 300ms
  }, [parsedAddressFields]);

  /**
   * Extrae partes importantes desde address_components
   */
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


  return {
    shippingAddressString,
    setShippingAddressString,
    mapCoords,
    isAddressValid,
    parsedAddressFields,
    handleSelectAddress,
    validateAddressWithGeocoding,
    resetAddressState
  };
};

export default useAddress;
