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

    return () => {
      mapRef.current.remove()
    }
  }, [])

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

