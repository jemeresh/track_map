import { TileLayer, useMapEvents, Marker, Polyline} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import mapboxgl from 'mapbox-gl'
import { useEffect, useState, useRef } from "react";
import { map } from "leaflet";
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
const mapToken = import.meta.env.VITE_MAPBOX_TOKEN


function RouteMap () {

  const mapRef = useRef()
  const mapContainerRef = useRef()

  const [markers, setMarkers] = useState([])
  const [marker, setMarker] = useState('')
  const [center, setCenter] = useState(centerTracker)
  const [zoom, setZoom] = useState(zoomTracker)

  useEffect(() => {

    mapRef.current = new mapboxgl.Map({
      accessToken: mapToken,
      container: mapContainerRef.current,
      language: 'ru',
      worldview: 'RU',
      center: center,
      zoom: zoom
    });

    mapRef.current.on('move', () => {
      sessionStorage.setItem('mapCenter', JSON.stringify(mapRef.current.getCenter()))
      sessionStorage.setItem('mapZoom', JSON.stringify(mapRef.current.getZoom()))
    })

    mapRef.current.on('click', (e) => {
      setMarkers(prevMarkers => [...prevMarkers, [e.lngLat.lng, e.lngLat.lat]])
      setMarker([e.lngLat.lng, e.lngLat.lat])
    })

    return () => {
      mapRef.current.remove()
    }
  }, [])

  if (marker) {
  new mapboxgl.Marker({ color: 'pink' })
    .setLngLat(marker)
    .addTo(mapRef.current)
  } else {
    console.log('нет точек')
  }

  function centerTracker() {
    if(sessionStorage.getItem('mapCenter')) {
      return [JSON.parse(sessionStorage.getItem('mapCenter')).lng, JSON.parse(sessionStorage.getItem('mapCenter')).lat ]
    } else {
      return [ 45.385044, 45.486671]
    }
  }
  function zoomTracker() {
    if(sessionStorage.getItem('mapZoom')) {
      return JSON.parse(sessionStorage.getItem('mapZoom'))
    } else {
      return 15
    }
  }

  return (
    <>
    <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
    </div>
      <div id='map-container' ref={mapContainerRef}></div>
    </>
  )
}

 export default RouteMap





// import { MapContainer, TileLayer, useMapEvents, Marker, Polyline} from "react-leaflet";
// import 'leaflet/dist/leaflet.css'
// import mapboxgl from 'mapbox-gl'
// import { useEffect, useState, useRef } from "react";
// import { map } from "leaflet";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import './App.css'
// const mapToken = import.meta.env.VITE_MAPBOX_TOKEN

// function BboxTracker({onBboxChange}) { //
//     const map = useMapEvents(
//     {
//       moveend: () => { onBboxChange(map.getBounds().toBBoxString()) },
//       zoomend: () => { onBboxChange(map.getBounds().toBBoxString()) }
//     })
//     return null
// }

// function BboxCenter({onCenterChange, savedCenter}) {
//   const map = useMapEvents(
//     {
//       moveend: () => {
//         let centerLatLng = {center: [map.getBounds().getCenter().lat, map.getBounds().getCenter().lng], zoom: map.getZoom()}
//         onCenterChange(centerLatLng)
//         sessionStorage.setItem('center', JSON.stringify(centerLatLng))
//       },
//     })
//     useEffect(() => {
//       if (sessionStorage.getItem('center')) {
//         map.setView(JSON.parse(sessionStorage.getItem('center')).center, JSON.parse(sessionStorage.getItem('center')).zoom)
//       } else {
//        map.setView([ 45.385044, 45.486671], 15)
//       }
//     }, [])
//     return null
// }

// function PinPoint({ PointOnTheMap, savedPoints }) {  //получение кординатов точки на карте принажатии мышью
//   const point = useMapEvents(
//     {
//       click: (e) => {
//         let mapDot = {lat: e.latlng.lat, lng: e.latlng.lng}
//         PointOnTheMap(mapDot)
//       }
//     }
//   )
//   return null
// }


//function RouteMap () {


  // const [bbox, setBbox] = useState('')
  // const [points, setPoints] = useState(readSavedPoints)
  // const [route, setRoute] = useState('')
  // const [bcenter, setCenter] = useState({
  //       center: [ 45.385044, 45.486671],
  //       zoom: 15
  // })

  // const mapOptions = {
  //       center: [ 45.385044, 45.486671],
  //       zoom: 15
  // }

//   function readSavedPoints() {
//   if(JSON.parse(sessionStorage.getItem('mapPoints'))) {
//     return JSON.parse(sessionStorage.getItem('mapPoints'))
//   } else {
//     return []
//   }
// }

// function clearLocalStorage () {
//   sessionStorage.removeItem('mapPoints')
// }

//   function addPoint(newPoint) {
//     const arrPoints = [...points, newPoint]
//     setPoints(arrPoints)
//     sessionStorage.setItem('mapPoints', JSON.stringify(arrPoints))
//   }


//   function arrGeoJson(points) {
//     let arr = []
//     let str = ''
//        for (let i = 0; i < points.length; i++) {
//           str = `${points[i].lng},${points[i].lat}`
//           arr = [...arr, str]
//         }
//     return arr.join(';')
//    }

//   async function getDirections() {

//     const queryRoute = await fetch(
//       `https://api.mapbox.com/directions/v5/mapbox/walking/${arrGeoJson(points)}?geometries=geojson&access_token=${mapToken}`,
//       {method: 'GET'}
//     )

//     setRoute(await queryRoute.json())

//     }

//   function arrForPolyline() {
//     if (route.routes && route.routes.length > 0) {
//       return route.routes[0].geometry.coordinates.map(it => [it[1], it[0]])
//     } return []
//   }


//   return (
//     <>
//         <MapContainer {...mapOptions} style = {{width: "100%", height: "500px"}}>
//           <BboxTracker onBboxChange={setBbox} />
//           <BboxCenter onCenterChange={setCenter} savedCenter={bcenter}/>
//           <PinPoint PointOnTheMap={addPoint} />
//           {points.map((item, index) => (
//             <Marker key = {index} position = {item}/>
//           ))}
//           <Polyline positions={arrForPolyline()}/>
//           <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=${mapToken}`} zoomOffset = {-1} tileSize = {512} />
//         </MapContainer>
//         <button onClick={getDirections}>Построить маршрут</button>
//         <button onClick={clearLocalStorage}>Удалить точки</button>
//         <button onClick={getDirections}>Сохранить маршрут</button>
//     </>
//   )
//}



//export default RouteMap










