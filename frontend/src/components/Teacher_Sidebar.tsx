import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  FileText,
  ClipboardList,
  BarChart2,
  User,
  Home,
  MessageSquare // Added the MessageSquare icon for feedback
} from 'lucide-react';
import Image from '../assets/image.png'; // Import the image from the assets folder

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
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} />, path: '/feedback' }, // New Feedback item
  ];
  const profileItem = { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' };

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
      {/* Profile at bottom */}
      <div className="mt-auto pt-4 border-t border-white/20">
        <button
          onClick={() => {
            setActivePage(profileItem.id);
            navigate(profileItem.path);
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            activePage === profileItem.id ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
          }`}
        >
          {profileItem.icon}
          <span>{profileItem.label}</span>
        </button>
      </div>

      </div>
  );
};

export default TeacherSidebar;
