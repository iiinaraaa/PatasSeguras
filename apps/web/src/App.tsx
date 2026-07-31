import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PetsList from "./pages/PetsList";
import CreatePet from "./pages/CreatePet";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/confirmar-email" element={<ConfirmEmail />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pets" element={<PetsList />} />
            <Route path="pets/novo" element={<CreatePet />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
