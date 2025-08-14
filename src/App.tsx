import { LocationProvider } from './contexts/LocationContext';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <LocationProvider>
      <div className="App">
        <HomePage />
      </div>
    </LocationProvider>
  );
}

export default App;
