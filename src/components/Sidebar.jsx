import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Icons
const SummaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const VideosIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

const ThemeIcon = ({ isDark }) => (
  isDark ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
);

const Sidebar = ({ activeTab, setActiveTab, isDarkMode, toggleDarkMode }) => {
  const { user, userProfile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Get user display name (full name from profile or email)
  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    return user?.email;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: <SummaryIcon /> },
    { id: 'videos', label: 'Videos Analyzed', icon: <VideosIcon /> },
    { id: 'email', label: 'Email Schedule', icon: <EmailIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-30 bg-white dark:bg-primary-900 shadow-xl transition-all duration-300 border-r border-primary-100 dark:border-primary-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-primary-100 dark:border-primary-800">
          {!collapsed ? (
            <div className="text-xl font-bold gradient-text">
              LazyTrend
            </div>
          ) : (
            <div className="text-xl font-bold gradient-text mx-auto">
              LT
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-all duration-300 text-primary-500"
            >
              <CollapseIcon />
            </button>
          )}
        </div>

        {/* User profile */}
        <div className="p-5 border-b border-primary-100 dark:border-primary-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center text-white font-medium shadow-md">
                {getUserInitials()}
              </div>
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate text-primary-800 dark:text-primary-100">{getUserDisplayName()}</p>
                <p className="text-xs text-primary-500 dark:text-primary-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-3">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 shadow-sm'
                      : 'hover:bg-primary-50 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <span className={`flex-shrink-0 transition-transform duration-300 ${activeTab === tab.id ? 'text-accent-600 dark:text-accent-400' : ''}`}>
                    {tab.icon}
                  </span>
                  {!collapsed && (
                    <span className={`ml-3 font-medium transition-all duration-300 ${activeTab === tab.id ? 'font-semibold' : ''}`}>
                      {tab.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="p-5 border-t border-primary-100 dark:border-primary-800">
          <div className="space-y-2">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-full p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-all duration-300 text-primary-700 dark:text-primary-300 ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="flex-shrink-0">
                <ThemeIcon isDark={isDarkMode} />
              </span>
              {!collapsed && (
                <span className="ml-3 font-medium">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400 ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              {!collapsed && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="p-5 flex justify-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-all duration-300 text-primary-500"
            >
              <ExpandIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
