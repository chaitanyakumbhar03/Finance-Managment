import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  FileUp, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'karagirs', label: 'Karagirs', icon: UserCog },
    { id: 'import-export', label: 'Import/Export', icon: FileUp },
  ];

  return (
    <>
      {/* Mobile drawer button toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface text-text rounded-md shadow-md border border-border"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar background overlay for mobile drawer */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 bg-surface border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between h-full",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo / Header (Collapse compliant) */}
          <div className={cn(
            "p-5 border-b border-border/50 flex items-center justify-between transition-all duration-300",
            isCollapsed && !isOpen ? "px-2 justify-center" : "px-6"
          )}>
            {(isCollapsed && !isOpen) ? (
              <span className="font-black text-primary font-sans leading-none text-center block text-sm tracking-tighter bg-primary/10 px-2 py-1 border border-primary/20 rounded">
                <img src="https://diemakes.com/wp-content/uploads/2025/11/cropped-Favicon-192x192.png" alt="Box logo"/>
              </span>
            ) : (
              // <h1 className="text-sm font-black uppercase text-primary tracking-widest truncate">
              //   Die Makes MS
              // </h1>
              <img src="https://diemakes.com/wp-content/uploads/2025/09/logo-done.svg" alt="Main logo" />
            )}

            {/* Desktop Collapse Toggle chevron */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1 hover:bg-background border border-border rounded text-text-muted hover:text-text transition-all scale-90"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center w-full rounded-lg transition-all duration-150 py-2.5",
                  isCollapsed && !isOpen ? "px-0 justify-center" : "px-3.5",
                  activeTab === item.id
                    ? "bg-primary text-background font-black shadow-sm"
                    : "text-text-muted hover:bg-background hover:text-text"
                )}
              >
                <item.icon className={cn("transition-all", isCollapsed && !isOpen ? "mr-0" : "mr-3")} size={16} />
                {(!isCollapsed || isOpen) && (
                  <span className="text-xs font-semibold tracking-wide truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom user card / logout actions container */}
          <div className={cn(
            "p-3 border-t border-border/60 space-y-2 background-surface transition-all",
            isCollapsed && !isOpen ? "p-1 flex justify-center" : "p-4"
          )}>
            <button
              onClick={() => dispatch(logout())}
              title={isCollapsed ? "Logout" : undefined}
              className={cn(
                "flex items-center text-red-500 hover:bg-red-500/10 rounded-lg transition-colors py-2 w-full",
                isCollapsed && !isOpen ? "px-0 justify-center" : "px-3"
              )}
            >
              <LogOut className={cn(isCollapsed && !isOpen ? "mr-0" : "mr-2.5")} size={16} />
              {(!isCollapsed || isOpen) && (
                <span className="text-xs font-bold font-sans">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
