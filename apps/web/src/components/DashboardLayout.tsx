import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, PawPrint, Plus, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";
import InstallMenuItem from "./InstallMenuItem";
import Footer from "./Footer";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
  { to: "/dashboard/pets", label: "Meus Pets", icon: PawPrint, end: false },
  { to: "/dashboard/pets/novo", label: "Cadastrar Pet", icon: Plus, end: false },
  { to: "/dashboard/conta", label: "Minha Conta", icon: User, end: false },
];

export default function DashboardLayout() {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    setMobileOpen(false);
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:z-auto md:w-auto md:translate-x-0 md:transition-none`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
              <PawPrint size={16} className="text-white" />
            </div>
            <span className="font-medium text-sm">Patas Seguras</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-xl text-sm ${
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

          <InstallMenuItem onNavigate={() => setMobileOpen(false)} />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 mt-4 pt-4 border-t border-gray-200 cursor-pointer text-left"
          >
            <LogOut size={17} />
            Sair
          </button>
        </nav>
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-gray-200">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
            <PawPrint size={14} className="text-white" />
          </div>
          <span className="font-medium text-sm">Patas Seguras</span>
        </div>
        <div className="w-11" aria-hidden="true" />
      </header>

      <main className="p-4 sm:p-6 md:p-8 flex flex-col min-h-screen md:min-h-0">
        <div className="flex-1">
          {loading ? <LoadingState label="Carregando sua conta..." /> : <Outlet />}
        </div>
        <Footer />
      </main>
    </div>
  );
}
