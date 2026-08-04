import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, PawPrint, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
  { to: "/dashboard/pets", label: "Meus Pets", icon: PawPrint, end: false },
  { to: "/dashboard/pets/novo", label: "Cadastrar Pet", icon: Plus, end: false },
  { to: "/dashboard/conta", label: "Minha Conta", icon: User, end: false },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="grid grid-cols-[220px_1fr] min-h-screen">
      <aside className="border-r border-gray-200 p-4">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-8 h-8 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
            <PawPrint size={16} className="text-white" />
          </div>
          <span className="font-medium text-sm">Patas Seguras</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm ${
                  isActive
                    ? "bg-brand-50 text-brand-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 mt-4 pt-4 border-t border-gray-200 cursor-pointer text-left"
          >
            <LogOut size={17} />
            Sair
          </button>
        </nav>
      </aside>

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
