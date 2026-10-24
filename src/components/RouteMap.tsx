import mapboxgl from 'mapbox-gl'
import { useEffect, useState, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import type {RouteMarker} from '..types/track'
const mapToken = import.meta.env.VITE_MAPBOX_TOKEN


function RouteMap () {

  const mapRef = useRef()
  const mapContainerRef = useRef()
  const markerRef = useRef([])
  const marker= useRef(null)
  const [center, setCenter] = useState(centerTracker)
  const [markers, setMarkers] = useState<RouteMarker[]>([])
  const [zoom, setZoom] = useState(zoomTracker)
  const [route, setRoute] = useState('')
  const [eventMessage, setEventMessage] = useState('Hover or click the marker');
  const resetTimeout = useRef(null);

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
      let markerID = {
          id: Date.now(),
          track_id: 0,
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          order: 1,
          description: '',
          photo: [],
          recall: '',
          archived: false
       }
      const coord = [e.lngLat.lng, e.lngLat.lat]
      setMarkers(prevMarkers => [...prevMarkers, markerID])
      marker.current = new mapboxgl.Marker({ color: 'pink' })
      .setLngLat(coord)
      .addTo(mapRef.current)
      markerRef.current = [...markerRef.current, [coord]]

      const markerElement = marker.current.getElement();

      const handleMouseEnter = () => {
        markerElement.style.cursor = 'pointer'
      }
      const handleMouseLeave = () => {
        markerElement.style.cursor = ""
      }

      markerElement.addEventListener('mouseenter', handleMouseEnter);
      markerElement.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        markerElement.removeEventListener('mouseenter', handleMouseEnter )
        markerElement.removeEventListener('mouseleave', handleMouseLeave )
        marker.current.remove()
        mapRef.current.remove()
      }
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

  async function getDirection() {

    if (markerRef.current.length > 1) {
    const direction = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${markerRef.current.map(it => it[0]).join(';')}?geometries=geojson&access_token=${mapToken}`,
      {method: 'GET'}
    )
    const json = await direction.json()
    setRoute(json)
    const data = json.routes[0]
      const geojson = {
      'type' : 'Feature',
      'properties' : {},
      'geometry' : data.geometry
    }
    if (mapRef.current.getSource('route')) {
    mapRef.current.getSource('route').setData(geojson);
    } else {
      mapRef.current.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
      });
    }
  } else {
    console.log('всего одна точка')
    }
  }

  return (
    <>
    {/* <div className="sidebar">
        Distance: {getData().distance.toFixed(3)} km | Duration: {getData().duration.toFixed(3)} min
    </div> */}
      <div id='map-container' ref={mapContainerRef}></div>
       <div
        style={{
          font: "bold 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif",
          backgroundColor: '#3386c0',
          color: '#fff',
          position: 'absolute',
          top: '20px',
          left: '50%',
          zIndex: 1,
          width: '200px',
          marginLeft: '-100px',
          display: 'block',
          padding: '10px 20px',
          borderRadius: '3px',
          textAlign: 'center'
        }}
      >
        {eventMessage}
      </div>
      <button onClick={getDirection}>Построить маршрут</button>
      <button onClick={getDirection}>Удалить точку</button>
    </>
  )
}

 export default RouteMap
