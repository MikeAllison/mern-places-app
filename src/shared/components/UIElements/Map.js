import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  // Creates a pointer to the map div that survives re-renders
  const mapRef = useRef();

  // Extract only the props that are needed
  const { center, zoom } = props;

  // This is required to wait for this component to render the map until the DOM is rendered
  // Pass extracted props as second arguement
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
