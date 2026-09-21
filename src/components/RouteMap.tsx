import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useState } from "react";

function BboxTracker({onBboxChange}) {
    const map = useMapEvents(
    {
      moveend: () => { onBboxChange(map.getBounds().toBBoxString()) },
      zoomend: () => { onBboxChange(map.getBounds().toBBoxString()) }
    })
    return null
}

function RouteMap () {

  const [bbox,setBbox] = useState('')

  console.log(bbox)

  const mapOptions = {
        center: [ 45.385044, 45.486671],
        zoom: 15
    }

  return (
    <>
        <MapContainer {...mapOptions} style = {{width: "100%", height: "500px"}}>
          <BboxTracker onBboxChange={setBbox} />
          <TileLayer url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'/>
        </MapContainer>
    </>
  )
}

export default RouteMap