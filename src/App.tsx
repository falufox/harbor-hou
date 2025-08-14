import { LocationProvider } from './contexts/LocationContext';
import { AppleStyleHomePage } from './pages/AppleStyleHomePage';

function App() {
  return (
    <LocationProvider>
      <div className="App">
        <AppleStyleHomePage />
      </div>
    </LocationProvider>
  );
}

export default App;
