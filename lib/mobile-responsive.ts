// Mobile-responsive utility styles and helpers for BD Library
import { useState, useEffect } from 'react';

export const mobileResponsiveClasses = {
  // Container classes
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-4 sm:py-6 lg:py-8",
  card: "bg-white rounded-lg shadow-md p-4 sm:p-6",
  
  // Grid layouts
  gridCols1: "grid grid-cols-1",
  gridCols2: "grid grid-cols-1 sm:grid-cols-2",
  gridCols3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  gridCols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  
  // Flexbox layouts
  flexCol: "flex flex-col",
  flexRow: "flex flex-col sm:flex-row",
  flexBetween: "flex flex-col sm:flex-row sm:justify-between sm:items-center",
  
  // Spacing
  gap2: "gap-2 sm:gap-4",
  gap4: "gap-4 sm:gap-6",
  gap6: "gap-6 sm:gap-8",
  spaceY2: "space-y-2 sm:space-y-0 sm:space-x-4",
  spaceY4: "space-y-4 sm:space-y-0 sm:space-x-6",
  
  // Text sizes
  textXs: "text-xs sm:text-sm",
  textSm: "text-sm sm:text-base",
  textBase: "text-base sm:text-lg",
  textLg: "text-lg sm:text-xl",
  textXl: "text-xl sm:text-2xl",
  text2xl: "text-2xl sm:text-3xl",
  
  // Buttons
  btnPrimary: "w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium",
  btnSecondary: "w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium",
  btnDanger: "w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium",
  
  // Tables
  tableContainer: "overflow-x-auto shadow-md rounded-lg",
  table: "min-w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50",
  tableHeaderCell: "px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableBodyCell: "px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900",
  
  // Forms
  formGroup: "space-y-4",
  label: "block text-sm font-medium text-gray-700",
  input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm",
  select: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm",
  
  // Navigation
  navTabs: "flex overflow-x-auto space-x-1 sm:space-x-0 sm:grid sm:grid-cols-4 gap-1 sm:gap-4 border-b border-gray-200",
  navTab: "flex items-center justify-center px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap min-w-0",
  navTabActive: "border-blue-500 text-blue-600",
  navTabInactive: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
  
  // Modals
  modalOverlay: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50",
  modalContainer: "relative top-4 sm:top-20 mx-auto p-5 border w-full max-w-md sm:max-w-lg shadow-lg rounded-md bg-white",
  
  // Cards and panels
  statsCard: "bg-white p-4 sm:p-6 rounded-lg shadow-md",
  panelHeader: "px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200",
  panelBody: "px-4 sm:px-6 py-4 sm:py-6",
  
  // Responsive visibility
  hiddenMobile: "hidden sm:inline",
  hiddenDesktop: "sm:hidden",
  showMobile: "block sm:hidden",
  showDesktop: "hidden sm:block"
};

// Breakpoint helpers
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Mobile-first media queries
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`
};

// Helper function to detect mobile devices
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Helper function to get screen size
export const getScreenSize = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Hook for responsive design
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return { screenSize: 'desktop' as const, isMobile: false, isTablet: false, isDesktop: true };
  }

  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(getScreenSize());
      setIsMobile(getScreenSize() === 'mobile');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return { screenSize, isMobile, isTablet: screenSize === 'tablet', isDesktop: screenSize === 'desktop' };
};

// Utility functions for responsive behavior
export const getResponsiveValue = <T,>(
  mobile: T,
  tablet?: T,
  desktop?: T
): T => {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet || mobile;
    case 'desktop':
      return desktop || tablet || mobile;
    default:
      return mobile;
  }
};

export const clsx = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
