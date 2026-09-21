import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react";

function BboxTracker({onBboxChange}) {
    const map = useMapEvents(
    {
      moveend: () => { onBboxChange(map.getBounds().toBBoxString()) },
      zoomend: () => { onBboxChange(map.getBounds().toBBoxString()) }
    })
    return null
}

function PinPoint({ PointOnTheMap}) {
  const point = useMapEvents(
    {
      click: (e) => { PointOnTheMap({lat: e.latlng.lat, lng: e.latlng.lng})}
    }
  )
  return null
}


function RouteMap () {

  const [bbox,setBbox] = useState('')
  const [points, setPoints] = useState([])

  const mapOptions = {
        center: [ 45.385044, 45.486671],
        zoom: 15
    }

  function addPoint(newPoint) {
    const arrPoints = [...points, newPoint]
    setPoints(arrPoints)
  }

  console.log(points)

  return (
    <>
        <MapContainer {...mapOptions} style = {{width: "100%", height: "500px"}}>
          <BboxTracker onBboxChange={setBbox} />
          <PinPoint PointOnTheMap={addPoint}/>
          <TileLayer url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'/>
        </MapContainer>
    </>
  )
}

export default RouteMap