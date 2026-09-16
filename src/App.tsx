import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Karagirs from './pages/Karagirs';
import ImportExport from './pages/ImportExport';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';

export default function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  if (!user?.isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Login />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'karagirs': return <Karagirs />;
      case 'import-export': return <ImportExport />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Toaster position="top-right" />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={cn(
        "p-4 lg:p-8 transition-all duration-300",
        isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
