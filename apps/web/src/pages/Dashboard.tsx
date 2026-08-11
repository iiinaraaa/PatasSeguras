import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import InstallButton from "../components/InstallButton";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { user } = useAuth();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
        <h1 className="text-2xl font-medium">Olá, {user?.fullName || "tutor"}</h1>
        <InstallButton className="w-full sm:w-auto" />
      </div>
      <p className="text-gray-500">Bem-vindo de volta à sua área de proteção animal.</p>
    </div>
  );
}
