import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Olá, {user?.fullName || "tutor"}</h1>
      <p className="text-gray-500">Bem-vindo de volta à sua área de proteção animal.</p>
    </div>
  );
}
