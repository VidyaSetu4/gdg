import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  FileText,
  ClipboardList,
  BarChart2,
  User,
  Home
} from 'lucide-react';

interface TeacherSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { id: 'onlineClasses', label: 'Online Classes', icon: <Video size={20} />, path: '/onlineClasses' },
    { id: 'materials', label: 'Materials', icon: <FileText size={20} />, path: '/materials' },
    { id: 'tests', label: 'Tests', icon: <ClipboardList size={20} />, path: '/tests' },
    { id: 'progress', label: 'Analytics', icon: <BarChart2 size={20} />, path: '/progress' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <div className="h-full bg-indigo-700 text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 mt-2">
        <LayoutDashboard size={28} />
        <h1 className="text-2xl font-bold">VidyaSetu</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActivePage(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'bg-white/20 font-medium'
                    : 'hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">Teacher Name</p>
            <p className="text-sm text-white/70">Subject Expert</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;