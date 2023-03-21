import React, { useEffect, useRef } from "react";
import "./Map.css"

const Map = (props) => {
  const mapRef = useRef();


    const center = props.center
    const zoom = props.zoom

    console.log(center)

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      zoom,
      center,
    });

    new window.google.maps.Marker({
      position: center,
      map: map,
    });
  }, [center,zoom]);

  return <div ref={mapRef} className="map"></div>;
};

export default Map;
