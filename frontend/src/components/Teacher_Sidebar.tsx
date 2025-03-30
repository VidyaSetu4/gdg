import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  TestTube2, 
  BarChart3, 
  UserCircle 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/' },
    { icon: Video, text: 'Online Classes', path: '/online-classes' },
    { icon: FileText, text: 'Materials', path: '/materials' },
    { icon: TestTube2, text: 'Tests', path: '/tests' },
    { icon: BarChart3, text: 'Analytics', path: '/analytics' },
    { icon: UserCircle, text: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 bg-indigo-700 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">VidyaSetu</h1>
        <p className="text-indigo-200 text-sm">Teacher Dashboard</p>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;