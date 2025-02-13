'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react'
import Map, { Marker, NavigationControl, ScaleControl } from 'react-map-gl'
import { MapPin, X } from 'lucide-react'
import Image from 'next/image'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function InteractiveMap() {
  const [markers, setMarkers] = useState([])
  const [currentCoords, setCurrentCoords] = useState(null)
  const [interactionsEnabled, setInteractionsEnabled] = useState(true)
  const [newMarkerModal, setNewMarkerModal] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('/api/markers')
        const data = await response.json()
        setMarkers(data)
      } catch (error) {
        console.error('Error fetching markers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMarkers()
  }, [])

  const handleClick = useCallback((event) => {
    if (!interactionsEnabled) return
    const { lngLat } = event

    const newMarker = {
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      id: `marker-${Date.now()}`,
    }
    
    setNewMarkerModal(newMarker)
  }, [interactionsEnabled])

  const handleMouseMove = useCallback((event) => {
    const map = mapRef.current?.getMap()
    if (map) {
      const { lng, lat } = map.unproject(event.point)
      setCurrentCoords({ lng, lat })
    }
  }, [])

  const removeMarker = useCallback(async (markerId) => {
    if (!interactionsEnabled) return
    try {
      const response = await fetch('/api/markers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: markerId })
      })
      if (response.ok) {
        setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId))
      }
    } catch (error) {
      console.error('Error removing marker:', error)
    }
  }, [interactionsEnabled])

  const handleMarkerClick = useCallback((e, marker) => {
    e.originalEvent.stopPropagation()
    setSelectedMarker(selectedMarker?.id === marker.id ? null : marker)
  }, [selectedMarker])

  const handleNewMarkerSubmit = async (markerData, title, description, imageUrl, links) => {
    const newMarker = { ...markerData, title, description, imageUrl, links }
    try {
      const response = await fetch('/api/markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarker)
      })
      if (response.ok) {
        setMarkers(prev => [...prev, newMarker])
      }
    } catch (error) {
      console.error('Error saving marker:', error)
    }
    setNewMarkerModal(null)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden flex items-center justify-center bg-black/75">
        <div className="text-white text-xl">Loading map data...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-black/75 rounded-md text-white backdrop-blur-md p-2"> 
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={interactionsEnabled}
            onChange={(e) => setInteractionsEnabled(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm font-medium">Add/Remove Markers</span>
        </label>
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 1.5,
          pitch: 0
        }}
        projection="globe"
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/snowycrest/cm5wfosrq00ff01sb6wzwcx54"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(e, marker)}
          >
            <MapPin 
              className={`w-6 h-6 text-blue-500 ${interactionsEnabled ? 'hover:text-blue-700 cursor-pointer' : ''} transition-colors`}
              aria-label="Map marker"
            />
          </Marker>
        ))}
      </Map>
      
      {newMarkerModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black/85 border-white/50 backdrop-blur-md rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-white font-semibold">New Marker</h3>
              <button onClick={() => setNewMarkerModal(null)}>
                <X className="w-5 h-5" />  
              </button>
            </div>
            <NewMarkerForm marker={newMarkerModal} onSubmit={handleNewMarkerSubmit} />
          </div>
        </div>
      )}

      {selectedMarker && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/85 backdrop-blur-md rounded-lg shadow-xl max-w-md w-96 transform transition-all duration-300 ease-in-out max-h-[80vh] flex flex-col">
          {selectedMarker.imageUrl && (
            <div className="w-full h-48 flex-shrink-0 relative">
              <Image
                src={selectedMarker.imageUrl}
                alt={selectedMarker.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          )}
          
          <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-xl text-white break-words mr-2">{selectedMarker.title}</h3>
              <button 
                onClick={() => setSelectedMarker(null)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-base leading-relaxed break-words">{selectedMarker.description}</p>
            </div>

            {selectedMarker.links && selectedMarker.links.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2 text-white">Links:</h4>
                <ul className="space-y-1">
                  {selectedMarker.links.map((link, index) => (
                    <li key={index} className="break-words">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 hover:underline text-sm inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {interactionsEnabled && (
              <button 
                onClick={() => {
                  removeMarker(selectedMarker.id)
                  setSelectedMarker(null)
                }}
                className="w-full mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                Delete Marker
              </button>
            )}
          </div>
        </div>
      )}

      {currentCoords && (
        <div className="absolute bottom-4 left-4 bg-black/75 text-white px-4 py-2 rounded-md backdrop-blur-sm">
          Coordinates: {currentCoords.lng.toFixed(4)}, {currentCoords.lat.toFixed(4)}
        </div>
      )}
    </div>
  )
}

function NewMarkerForm({ marker, onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [links, setLinks] = useState([''])

  const addLinkField = () => {
    setLinks([...links, ''])
  }

  const updateLink = (index, value) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(marker, title, description, imageUrl, links.filter(link => link.trim() !== ''))
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-24"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Thumbnail URL
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Links
        </label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLinkField}
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          + Add another link
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Marker
      </button>
    </form>
  )
}
