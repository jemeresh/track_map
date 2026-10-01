import { MapContainer, TileLayer, useMapEvents, Marker, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react";
import { map } from "leaflet";
const mapToken = import.meta.env.VITE_MAPBOX_TOKEN

function BboxTracker({onBboxChange}) { //
    const map = useMapEvents(
    {
      moveend: () => { onBboxChange(map.getBounds().toBBoxString()) },
      zoomend: () => { onBboxChange(map.getBounds().toBBoxString()) }
    })
    return null
}

function PinPoint({ PointOnTheMap}) {          //получение кординатов точки на карте принажатии мышью
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
  const [route, setRoute] = useState('')

  const mapOptions = {
        center: [ 45.385044, 45.486671],
        zoom: 15
  }

  function addPoint(newPoint) {
    const arrPoints = [...points, newPoint]
    setPoints(arrPoints)
  }


  function arrGeoJson(points) {
    let arr = []
    let str = ''
       for (let i = 0; i < points.length; i++) {
          str = `${points[i].lng},${points[i].lat}`
          arr = [...arr, str]
        }
    return arr.join(';')
   }

  async function getDirections() {

    const queryRoute = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${arrGeoJson(points)}?geometries=geojson&access_token=${mapToken}`,
      {method: 'GET'}
    )

    setRoute(await queryRoute.json())

    }

  function arrForPolyline() {
    if (route.routes && route.routes.length > 0) {
      return route.routes[0].geometry.coordinates.map(it => [it[1], it[0]])
    } return []
  }


  return (
    <>
        <MapContainer {...mapOptions} style = {{width: "100%", height: "500px"}}>
          <BboxTracker onBboxChange={setBbox} />
          <PinPoint PointOnTheMap={addPoint}/>
          {points.map((item, index) => (
            <Marker key = {index} position = {item}/>
          ))}
          <Polyline positions={arrForPolyline()}/>
          <TileLayer url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=${mapToken}`/>
        </MapContainer>
        <button onClick={getDirections}>Построить маршрут</button>
    </>
  )
}

export default RouteMap