import React from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  BarChart2, 
  User,
  Home
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'onlineClasses', label: 'Online Classes', icon: <Video size={20} /> },
    { id: 'materials', label: 'Materials', icon: <FileText size={20} /> },
    { id: 'chatbot', label: 'Chatbot', icon: <MessageSquare size={20} /> },
    { id: 'tests', label: 'Tests', icon: <ClipboardList size={20} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart2 size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="h-full bg-primary text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 mt-2">
        <BookOpen size={28} />
        <h1 className="text-2xl font-bold">VidyaSetu</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
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
            <p className="font-medium">Student Name</p>
            <p className="text-sm text-white/70">Class 10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;