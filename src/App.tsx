import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { InventoryProvider } from './hooks/InventoryContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { Products } from './pages/Products';
import { Movements } from './pages/Movements';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <InventoryProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="search" element={<Search />} />
              <Route path="products" element={<Products />} />
              <Route path="movements" element={<Movements />} />
              <Route path="docs" element={<Documents />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </InventoryProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
