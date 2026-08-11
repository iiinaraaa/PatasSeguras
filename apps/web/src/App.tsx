import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PetsList from "./pages/PetsList";
import CreatePet from "./pages/CreatePet";
import PetDetail from "./pages/PetDetail";
import Account from './pages/Account';
import PublicPet from "./pages/PublicPet";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/p/:slug" element={<PublicPet />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pets" element={<PetsList />} />
              <Route path="pets/novo" element={<CreatePet />} />
              <Route path="pets/:id" element={<PetDetail />} />
              <Route path="conta" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
