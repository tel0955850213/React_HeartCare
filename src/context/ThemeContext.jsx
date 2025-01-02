import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = {
        isDarkMode,
        colors: {
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            text: isDarkMode ? '#ffffff' : '#333333',
            primary: '#4CAF50',
            secondary: '#2196F3'
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    document.documentElement.style.setProperty('--background-color', isDarkMode ? '#1a1a1a' : '#ffffff');
    document.documentElement.style.setProperty('--text-color', isDarkMode ? '#ffffff' : '#000000');
    document.documentElement.style.setProperty('--card-background', isDarkMode ? '#2d2d2d' : '#ffffff');
    document.documentElement.style.setProperty('--border-color', isDarkMode ? '#404040' : '#eee');

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
}; 