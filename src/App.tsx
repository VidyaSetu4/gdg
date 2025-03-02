import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  BarChart2, 
  User,
  Menu,
  X
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OnlineClasses from './pages/OnlineClasses';
import Materials from './pages/Materials';
import Chatbot from './pages/Chatbot';
import Tests from './pages/Tests';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'onlineClasses':
        return <OnlineClasses />;
      case 'materials':
        return <Materials />;
      case 'chatbot':
        return <Chatbot />;
      case 'tests':
        return <Tests />;
      case 'progress':
        return <Progress />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-primary text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:w-64 fixed inset-y-0 z-10`}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 p-4 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;