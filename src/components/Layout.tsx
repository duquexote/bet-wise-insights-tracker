
import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Calendar,
  FileText,
  Home,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
    { path: "/bets", label: "Minhas Apostas", icon: <FileText className="mr-2 h-5 w-5" /> },
    { path: "/analysis", label: "Análise", icon: <BarChart className="mr-2 h-5 w-5" /> },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      <div className="h-full flex flex-col w-64">
        <div className="px-4 py-5 flex items-center justify-between border-b">
          <Link to="/dashboard" className="flex items-center">
            <div className="h-8 w-8 bg-betBlue rounded-md mr-2 flex items-center justify-center">
              <span className="text-white font-bold">BT</span>
            </div>
            <h1 className="text-xl font-bold text-betBlue">BetTracker</h1>
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  location.pathname === item.path 
                    ? 'bg-betBlue text-white' 
                    : 'text-gray-700 hover:bg-betLightGray'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="border-t p-4">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="bg-white shadow-sm z-10 fixed top-0 left-0 right-0 h-16 md:ml-64">
      <div className="flex items-center justify-between h-full px-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-500 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="md:hidden flex items-center ml-4">
          <div className="h-8 w-8 bg-betBlue rounded-md mr-2 flex items-center justify-center">
            <span className="text-white font-bold">BT</span>
          </div>
          <h1 className="text-lg font-bold text-betBlue">BetTracker</h1>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            <Calendar className="inline h-4 w-4 mr-1" /> 
            {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto pt-16 pb-6 px-4 md:px-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
