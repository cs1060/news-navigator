import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Navigation state
  currentSection: 'home',
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Sidebar state
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Layout state
  layoutType: 'grid', // 'grid' or 'list'
  setLayoutType: (type) => set({ layoutType: type }),
  
  // Map visibility state
  isMapVisible: false,
  toggleMapVisibility: () => set((state) => ({ isMapVisible: !state.isMapVisible })),
}));

export default useUIStore;
