# Harbor HOU

> Houston Resilience Hub Finder - Find nearby emergency assistance during disasters

Harbor HOU is a mobile-first Progressive Web App (PWA) designed to help Houston residents quickly find nearby resilience hubs during emergencies like heat waves, freezes, floods, and power outages.

## 🚀 Features

- **≤15 Second Discovery**: Fast, mobile-optimized interface to find the nearest open hub
- **Real-time Status**: Live hub status with recent verification timestamps
- **Smart Filtering**: Filter by services (cooling, charging, WiFi, water), accessibility, and pet-friendliness
- **Location Services**: Automatic distance calculation and sorting by proximity
- **Native Directions**: One-tap integration with Apple Maps and Google Maps
- **PWA Ready**: Works offline with cached hub data for resilience during outages
- **Accessibility First**: WCAG 2.2 AA compliant with screen reader support
- **Bilingual Ready**: Prepared for English/Spanish localization

## 🏢 Hub Services Tracked

- ❄️ **Cooling Centers** (with temperature monitoring)
- 🔥 **Heating Centers** 
- 🔌 **Device Charging Stations**
- 📶 **Free WiFi**
- 💧 **Potable Water**
- 🚻 **Restrooms**
- ♿ **Accessibility Features**
- 🐾 **Pet-Friendly Facilities**
- 🏥 **Medical Assistance**
- 🍽️ **Food Distribution**

## 📱 Status Types

- 🟢 **Open** - Fully operational with all services
- 🟡 **At Capacity** - Open but serving at maximum capacity
- 🟡 **Limited Services** - Open with reduced services available
- 🔴 **Closed** - Currently closed
- 🟠 **Planned Open** - Scheduled to open soon

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Houston design system
- **PWA**: Workbox for offline functionality
- **Maps**: MapLibre GL (coming soon)
- **State**: React Context API + custom hooks
- **Icons**: Lucide React + emoji for universal compatibility

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/harbor-hou.git
   cd harbor-hou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app builds to static files and can be deployed on:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 📊 Data Sources

Currently uses mock data for development. In production, the app will connect to:

- **Houston OEM API** - Real-time hub status and services
- **Harris County API** - Emergency alerts and notifications
- **METRO API** - Transit information for hub access

## 🏛️ Government Integration

Harbor HOU is designed to integrate with existing Houston emergency management systems:

- **AlertHouston** - Emergency notification integration
- **Houston OEM** - Official emergency management data feeds
- **Harris County** - Regional coordination and alerts
- **METRO Houston** - Transit accessibility information

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://api.houstonhubs.gov
VITE_USE_MOCK_DATA=false

# Alert System
VITE_ALERTS_API_URL=https://alerts.houstonhubs.gov
```

### PWA Configuration

The app includes a complete PWA setup with:
- Service worker for offline functionality
- Web app manifest for installation
- Caching strategies for resilience during outages

## 🎯 Performance Goals

- **Load Time**: <2s on 4G, <5s on 3G
- **Interactivity**: <15s from open to directions
- **Offline**: Cached hubs available within 2s
- **Uptime**: 99.9% during emergency activations

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run typecheck

# Build test
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Emergency Contacts

- **Houston Emergency Management**: 311
- **Harris County Emergency**: 911
- **Non-Emergency Info**: 311
- **AlertHouston Signup**: [alert.houstontx.gov](https://alert.houstontx.gov)

## 🏙️ About Houston Resilience

Houston's resilience hub network provides critical services during emergencies:
- Cooling and heating centers during extreme weather
- Charging stations during power outages  
- WiFi access for emergency communications
- Water distribution during service disruptions
- Accessible facilities for all residents
- Pet relief areas for evacuees with animals

---

**Harbor HOU** - *Your lifeline to safety during Houston emergencies*
