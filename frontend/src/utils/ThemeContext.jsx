import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('colive_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('colive_dark_mode', JSON.stringify(isDarkMode));
    // Dispatch event so components can update
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode } }));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      bg: '#0f0f0f',
      bgSecondary: '#1e1e1e',      // cards sit on #0f0f0f — enough contrast now
      text: '#f0f0f0',             // near-white, clearly readable
      textSecondary: '#a0a0a0',
      border: '#2e2e2e',
      borderLight: '#252525',
      sidebar: '#111111',
      card: '#1e1e1e',
      input: '#2a2a2a',
      inputText: '#f0f0f0',
      buttonHover: '#ff6b6b',
      brand: '#ff4d4d',
      accent: '#ffcccc',
    } : {
      bg: '#f4f5f7',
      bgSecondary: '#ffffff',
      text: '#111111',
      textSecondary: '#555555',
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      sidebar: '#ffffff',
      card: '#ffffff',
      input: '#f0f0f0',
      inputText: '#111111',
      buttonHover: '#ff6b6b',
      brand: '#ff4d4d',
      accent: '#ffcccc',
    },
  };

  return (
    <ThemeContext.Provider value={{ ...theme, ...theme.colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
