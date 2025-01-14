# 🌎 Interactive Globe Map

An interactive web application built with Next.js that allows users to create and manage markers on a 3D globe map.

## ✨ Features

- 🌐 Interactive 3D Globe visualization using Mapbox GL
- 📍 Add custom markers with titles, descriptions, and images
- 🔗 Include multiple links for each marker
- 🎯 Click-to-add marker functionality
- 🗑️ Remove markers with a single click
- 📱 Responsive design with a clean, modern interface
- 🌟 Beautiful gradient borders and glass-morphism effects
- 🎨 Dark mode optimized UI
- 📍 Real-time coordinate display
- 🔄 Toggle marker interaction mode

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nextjs-interactive-map.git
cd nextjs-interactive-map
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Mapbox token:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Dependencies

- `next`: ^14.0.0
- `react`: ^18.0.0
- `react-map-gl`: ^7.1.0
- `mapbox-gl`: ^2.15.0
- `lucide-react`: For icons
- `tailwindcss`: For styling

## 🛠️ Configuration

The map is configured to use the Globe projection by default. You can customize the initial view in the `InteractiveMap.jsx` component:

```javascript
initialViewState={{
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  pitch: 0
}}
```

## 🎨 Styling

The project uses Tailwind CSS for styling.

## 👨‍💻 Author

**SnowyCrest**
- GitHub: [@SnowyCrest](https://github.com/SnowyCrest)

