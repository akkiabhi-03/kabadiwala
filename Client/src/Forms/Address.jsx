import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../Contexts/UserContext.jsx';

const SearchAddress = () => {
  const { location, setLocation } = useUser();
  const searchInputRef = useRef(null);
  const [eLoc, setEloc] = useState('');
  const [placeData, setPlaceData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // console.log(location);

  useEffect(() => {
    const scriptPlugin = document.createElement('script');
    scriptPlugin.src = `https://apis.mappls.com/advancedmaps/api/${import.meta.env.VITE_MAPPLS_TOKEN}/map_sdk_plugins?v=3.0`;
    scriptPlugin.async = true;
    document.body.appendChild(scriptPlugin);

    scriptPlugin.onload = () => {
      const optionalConfig = {
        region: 'IND',
        height: 300,
      };

      new window.mappls.search(searchInputRef.current, optionalConfig, callback);
    };
    function callback(data) {
        // Prevent auto-result when input is empty
        const inputValue = searchInputRef.current.value?.trim() || '';
        if (!inputValue || !data?.length) return;

        // Set data only when something is selected
        setPlaceData(data[0]);
        setEloc(data[0].eLoc);
        // console.log('📍 Search Result:', data[0]);
      }

    return () => {
      document.body.removeChild(scriptPlugin);
    };
  }, []);

  useEffect(() => {
    if (!placeData || !coordinates) return;

    const address = placeData.placeName + " " + placeData.placeAddress;
    const pincodeMatch = address?.match(/\b\d{6}\b/);
    const pincode = pincodeMatch ? parseInt(pincodeMatch[0]) : null;

    setLocation({
      address,
      eLoc,
      pincode,
      coordinates,
    });
  }, [placeData, coordinates, eLoc, setLocation]);

  return (
    <div className="mb-1">
      <input
        type="text"
        id="auto"
        ref={searchInputRef}
        className={`search-outer form-control as-input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
        placeholder="Search places or eLoc's..."
        spellCheck="false"
      />
      <HiddenMapElocToLatLng eLoc={eLoc} setCoordinates={setCoordinates} />
    </div>
  );
};

export default SearchAddress;


export const HiddenMapElocToLatLng = ({ eLoc, setCoordinates }) => {
  const accessToken = import.meta.env.VITE_MAPPLS_TOKEN;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load SDK
  useEffect(() => {
    const scriptId1 = 'mappls-map-sdk';
    const scriptId2 = 'mappls-plugin-sdk';

    const loadSDK = () => {
      if (!document.getElementById(scriptId1)) {
        const mapScript = document.createElement('script');
        mapScript.src = `https://apis.mappls.com/advancedmaps/api/${accessToken}/map_sdk?layer=vector&v=3.0&callback=initMap`;
        mapScript.id = scriptId1;
        mapScript.async = true;
        document.body.appendChild(mapScript);
      }

      if (!document.getElementById(scriptId2)) {
        const pluginScript = document.createElement('script');
        pluginScript.src = `https://apis.mappls.com/advancedmaps/api/${accessToken}/map_sdk_plugins?v=3.0&libraries=getPinDetails`;
        pluginScript.id = scriptId2;
        pluginScript.async = true;
        document.body.appendChild(pluginScript);
      }

      window.initMap = () => {
        mapInstance.current = new window.mappls.Map(mapRef.current, {
          center: [28.61, 77.23],
          zoom: 5,
        });

        mapInstance.current.addListener('load', () => {
          // console.log('✅ Hidden map fully loaded');
          setSdkReady(true);
        });
      };
    };

    loadSDK();
  }, []);

  // Convert eLoc to coordinates
  useEffect(() => {
    if (!sdkReady || !eLoc || !eLoc.length || isLoaded) return;

    setIsLoaded(true);

    window.mappls.getPinDetails(
      {
        map: mapInstance.current,
        pin: eLoc,
      },
      (data) => {
        try {
          const coords = data?.marker?.obj?._lngLat;
          if (coords) {
            // console.log('✅ Coords found:', coords);
            setCoordinates([coords.lng, coords.lat]);
          } else {
            // console.warn('❌ Could not extract coordinates');
          }
        } catch (err) {
          // console.error('❌ Error parsing pin details:', err);
        }
      }
    );
  }, [sdkReady, eLoc, isLoaded, setCoordinates]);

  return (
    <div
      ref={mapRef}
      id="hidden-map"
      style={{
        width: '0px',
        height: '0px',
        visibility: 'hidden',
        position: 'absolute',
      }}
    />
  );
};

