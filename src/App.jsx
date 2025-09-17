import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import AppRoutes from './AppRoutes'; // <-- Import the new component

function App() {
  return (
    <DataProvider>
      <div className="app">
        <BrowserRouter basename="/attendance">
          {/*
            All routing logic, including the redirect-on-reload feature,
            is now handled inside the AppRoutes component.
          */}
          <AppRoutes />
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;