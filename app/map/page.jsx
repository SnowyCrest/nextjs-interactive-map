import InteractiveMap from '../../components/InteractiveMap.jsx'
import '../../app/globals.css'

export default function MapPage() {
  return (
    <div className="container mx-auto p-4 min-h-screen relative">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500/30 via-blue-300/30 to-purple-500/30 backdrop-blur-sm p-[2px]">
        <div className="h-full w-full bg-black/75 backdrop-blur-md rounded-lg">
          <div className="max-w-5xl mx-auto space-y-4 p-4">
            <h1 className="text-center text-6xl font-bold mt-8 mb-10 text-sky-100">Interactive Map</h1>
            <p className="text-lg text-white">
              Toggle marker interactions using the switch in the top-left corner. When enabled,
              click anywhere on the map to add a marker and click a marker to remove it.
              Mouse coordinates are shown in the bottom-left corner.
            </p>
            <InteractiveMap />
            <p className="text-lg text-white text-center mt-4">
              Made by <a href="https://github.com/SnowyCrest" className="text-sky-400 hover:underline font-bold">SnowyCrest</a> on <a href="https://github.com/SnowyCrest/nextjs-interactive-map" className="text-sky-400 hover:underline font-bold">Github</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
