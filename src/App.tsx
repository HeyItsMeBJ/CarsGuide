import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Catalog from './pages/Catalog';
import CarDetails from './pages/CarDetails';
import Chatbot from './components/Chatbot'; // <-- Import the new component

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
          
          <Chatbot />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}