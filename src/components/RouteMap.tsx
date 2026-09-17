import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useState } from "react";


function RouteMap () {

  const mapOptions = {
        center: [ 17.385044, 78.486671],
        zoom: 10
    }


  return (
    <>
        <MapContainer {...mapOptions} style = {{width: "100%", height: "500px"}}>
          <TileLayer url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'/>
          </MapContainer>
    </>
  )
}

export default RouteMap