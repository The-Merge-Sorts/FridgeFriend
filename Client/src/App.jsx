import axios from 'axios';
import { useCallback, useEffect, useState, useMemo } from 'react';
import Map, { GeolocateControl, Marker, useMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import FridgeMarker from './assets/FridgeMarker.svg';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/solid';

import useInput from './hooks/useInput';

// onSubmit fly to the address location
const onSubmit = (e) => {
  const { current: map } = useMap();
  e.preventDefault();
  map.flyTo({
    center: [address.lon, address.lat],
    zoom: 14,
  });

  // set the address to empty string
  address.setValue('');
};

const App = () => {
  const [fridges, setFridges] = useState([]);
  const address = useInput('');

  const geoLocateControlRef = useCallback((ref) => {
    if (ref) {
      ref.trigger();
    }
  }, []);

  useEffect(() => {
    const getFridges = async () => {
      const { data } = await axios.get('http://localhost:3000/api/fridges/');
      setFridges(data);
    };
    getFridges();
  }, []);

  const fridgeMarkers = useMemo(() => {
    return fridges.map((fridge) => (
      <Marker
        key={fridge._id}
        longitude={fridge.location.lon}
        latitude={fridge.location.lat}
      >
        <a href={`/details/${fridge._id}`}>
          <img src={FridgeMarker} alt="Fridge Marker" className="w-20 h-20" />
        </a>
      </Marker>
    ));
  }, [fridges]);
  return (
    <>
      <Map
        initialViewState={{
          longitude: -90.071533,
          latitude: 29.951065,
          zoom: 14,
        }}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: -1,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        <GeolocateControl
          ref={geoLocateControlRef}
          trackUserLocation={true}
          showAccuracyCircle={false}
          showUserHeading={true}
          position="bottom-right"
        />

        {fridgeMarkers}
      </Map>

      <div
        className="bg-white rounded-3xl shadow-lg z-30 absolute top-16
       left-1/2 transform -translate-x-1/2 w-3/4 md:top-20 md:w-1/2
       "
      >
        {/* filter here */}
        {/* <div className="border-b-[1px] border-[#051A2D4D] w-full">
          <h2>Fridge</h2>
        </div> */}
        <div className="flex justify-between items-center px-3 py-2">
          <MapPinIcon className="w-6 h-6 text-[#051A2D]" />
          <input
            type="text"
            className="w-4/5 h-full bg-white focus:outline-none placeholder:text-[#051A2D]"
            placeholder="Search Location"
            {...address}
          />
          <div className="bg-[#FB7712] rounded-full w-6 h-6 flex justify-center items-center">
            <MagnifyingGlassIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {address.suggestions?.length > 0 && (
          <div
            className="bg-white rounded-3xl shadow-lg z-30 absolute top-16
          left-1/2 transform -translate-x-1/2 w-3/4 md:top-20 md:w-1/2"
          >
            {address.suggestions.map((suggestion, indx) => (
              <p
                key={indx}
                className="px-3 py-2 border-b-[1px] border-[#051A2D4D] cursor-pointer rounded-tb-3xl  hover:bg-[#FB7712] hover:text-white"
                onClick={() => {
                  address.setValue(suggestion.place_name);
                  address.setSuggestions([]);
                  address.setLat(suggestion.center[1]);
                  address.setLon(suggestion.center[0]);
                }}
              >
                {suggestion.place_name}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
