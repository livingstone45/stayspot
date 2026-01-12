import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

const initialState = {
  // Layout state
  sidebarOpen: true,
  sidebarCollapsed: false,
  sidebarWidth: 256,
  headerHeight: 64,
  
  // Mobile responsiveness
  isMobile: false,
  isTablet: false,
  screenSize: 'desktop', // mobile, tablet, desktop, wide
  
  // Theme and appearance
  theme: 'system', // light, dark, system
  colorScheme: 'blue', // blue, green, purple, orange, red
  fontSize: 'medium', // small, medium, large
  density: 'comfortable', // compact, comfortable, spacious
  
  // Navigation
  activeRoute: '/',
  breadcrumbs: [],
  navigationHistory: [],
  
  // Modals and overlays
  modals: {},
  activeModal: null,
  modalStack: [],
  
  // Drawers and panels
  drawers: {},
  activeDrawer: null,
  
  // Loading states
  globalLoading: false,
  pageLoading: false,
  componentLoading: {},
  
  // Notifications and alerts
  alerts: [],
  alertCounter: 0,
  
  // Form states
  forms: {},
  
  // Search
  globalSearch: {
    query: '',
    results: [],
    isOpen: false,
    loading: false,
    recentSearches: []
  },
  
  // Filters and sorting
  globalFilters: {},
  
  // View preferences
  viewPreferences: {
    listView: 'grid', // grid, list, table
    itemsPerPage: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  },
  
  // Keyboard shortcuts
  keyboardShortcuts: {
    enabled: true,
    customShortcuts: {}
  },
  
  // Accessibility
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false
  },
  
  // Performance
  performance: {
    enableAnimations: true,
    lazyLoading: true,
    virtualScrolling: false
  },
  
  // User preferences
  userPreferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'US'
  },
  
  // Layout customization
  layout: {
    showBreadcrumbs: true,
    showPageTitle: true,
    showQuickActions: true,
    compactHeader: false,
    stickyHeader: true,
    showFooter: true
  },
  
  // Dashboard customization
  dashboard: {
    widgets: [],
    layout: 'grid',
    columns: 3,
    customizable: true
  },
  
  // Tour and onboarding
  tour: {
    active: false,
    currentStep: 0,
    completed: false,
    skipped: false
  },
  
  // Command palette
  commandPalette: {
    isOpen: false,
    query: '',
    results: [],
    recentCommands: []
  },
  
  // Context menu
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    items: []
  },
  
  // Drag and drop
  dragDrop: {
    isDragging: false,
    dragData: null,
    dropZones: []
  },
  
  // Scroll position tracking
  scrollPositions: {},
  
  // Window focus state
  windowFocused: true,
  
  // Network status
  isOnline: true,
  
  // Feature flags
  featureFlags: {},
  
  // Error boundaries
  errors: [],
  
  // Debug mode
  debugMode: false
};

export const useUIStore = create(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Layout actions
        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),

        setSidebarOpen: (open) => set((state) => {
          state.sidebarOpen = open;
        }),

        toggleSidebarCollapsed: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

        setSidebarCollapsed: (collapsed) => set((state) => {
          state.sidebarCollapsed = collapsed;
        }),

        setSidebarWidth: (width) => set((state) => {
          state.sidebarWidth = Math.max(200, Math.min(400, width));
        }),

        setHeaderHeight: (height) => set((state) => {
          state.headerHeight = Math.max(48, Math.min(80, height));
        }),

        // Responsive actions
        setScreenSize: (size) => set((state) => {
          state.screenSize = size;
          state.isMobile = size === 'mobile';
          state.isTablet = size === 'tablet';
          
          // Auto-collapse sidebar on mobile
          if (size === 'mobile') {
            state.sidebarOpen = false;
          }
        }),

        updateScreenSize: () => {
          const width = window.innerWidth;
          let size = 'desktop';
          
          if (width < 640) {
            size = 'mobile';
          } else if (width < 1024) {
            size = 'tablet';
          } else if (width >= 1920) {
            size = 'wide';
          }
          
          get().setScreenSize(size);
        },

        // Theme actions
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),

        setColorScheme: (scheme) => set((state) => {
          state.colorScheme = scheme;
        }),

        setFontSize: (size) => set((state) => {
          state.fontSize = size;
        }),

        setDensity: (density) => set((state) => {
          state.density = density;
        }),

        // Navigation actions
        setActiveRoute: (route) => set((state) => {
          state.activeRoute = route;
          
          // Add to navigation history
          if (state.navigationHistory[state.navigationHistory.length - 1] !== route) {
            state.navigationHistory.push(route);
            
            // Keep only last 50 routes
            if (state.navigationHistory.length > 50) {
              state.navigationHistory = state.navigationHistory.slice(-50);
            }
          }
        }),

        setBreadcrumbs: (breadcrumbs) => set((state) => {
          state.breadcrumbs = breadcrumbs;
        }),

        goBack: () => {
          const { navigationHistory } = get();
          if (navigationHistory.length > 1) {
            const previousRoute = navigationHistory[navigationHistory.length - 2];
            window.history.back();
            return previousRoute;
          }
          return null;
        },

        // Modal actions
        openModal: (modalId, props = {}) => set((state) => {
          state.modals[modalId] = { isOpen: true, props };
          state.activeModal = modalId;
          state.modalStack.push(modalId);
        }),

        closeModal: (modalId) => set((state) => {
          if (state.modals[modalId]) {
            state.modals[modalId].isOpen = false;
          }
          
          // Remove from stack
          state.modalStack = state.modalStack.filter(id => id !== modalId);
          
          // Set active modal to the last one in stack
          state.activeModal = state.modalStack.length > 0 
            ? state.modalStack[state.modalStack.length - 1] 
            : null;
        }),

        closeAllModals: () => set((state) => {
          Object.keys(state.modals).forEach(modalId => {
            state.modals[modalId].isOpen = false;
          });
          state.activeModal = null;
          state.modalStack = [];
        }),

        updateModalProps: (modalId, props) => set((state) => {
          if (state.modals[modalId]) {
            state.modals[modalId].props = { ...state.modals[modalId].props, ...props };
          }
        }),

        // Drawer actions
        openDrawer: (drawerId, props = {}) => set((state) => {
          state.drawers[drawerId] = { isOpen: true, props };
          state.activeDrawer = drawerId;
        }),

        closeDrawer: (drawerId) => set((state) => {
          if (state.drawers[drawerId]) {
            state.drawers[drawerId].isOpen = false;
          }
          
          if (state.activeDrawer === drawerId) {
            state.activeDrawer = null;
          }
        }),

        toggleDrawer: (drawerId, props = {}) => {
          const { drawers } = get();
          const isOpen = drawers[drawerId]?.isOpen;
          
          if (isOpen) {
            get().closeDrawer(drawerId);
          } else {
            get().openDrawer(drawerId, props);
          }
        },

        // Loading actions
        setGlobalLoading: (loading) => set((state) => {
          state.globalLoading = loading;
        }),

        setPageLoading: (loading) => set((state) => {
          state.pageLoading = loading;
        }),

        setComponentLoading: (componentId, loading) => set((state) => {
          if (loading) {
            state.componentLoading[componentId] = true;
          } else {
            delete state.componentLoading[componentId];
          }
        }),

        // Alert actions
        addAlert: (alert) => set((state) => {
          const id = state.alertCounter + 1;
          const newAlert = {
            id,
            timestamp: Date.now(),
            ...alert
          };
          
          state.alerts.unshift(newAlert);
          state.alertCounter = id;
          
          // Auto-remove after duration
          if (alert.duration && alert.duration > 0) {
            setTimeout(() => {
              get().removeAlert(id);
            }, alert.duration);
          }
        }),

        removeAlert: (alertId) => set((state) => {
          state.alerts = state.alerts.filter(alert => alert.id !== alertId);
        }),

        clearAllAlerts: () => set((state) => {
          state.alerts = [];
        }),

        // Form actions
        setFormData: (formId, data) => set((state) => {
          if (!state.forms[formId]) {
            state.forms[formId] = {};
          }
          state.forms[formId].data = { ...state.forms[formId].data, ...data };
        }),

        setFormErrors: (formId, errors) => set((state) => {
          if (!state.forms[formId]) {
            state.forms[formId] = {};
          }
          state.forms[formId].errors = errors;
        }),

        setFormTouched: (formId, touched) => set((state) => {
          if (!state.forms[formId]) {
            state.forms[formId] = {};
          }
          state.forms[formId].touched = { ...state.forms[formId].touched, ...touched };
        }),

        resetForm: (formId) => set((state) => {
          delete state.forms[formId];
        }),

        // Search actions
        setGlobalSearchQuery: (query) => set((state) => {
          state.globalSearch.query = query;
        }),

        setGlobalSearchResults: (results) => set((state) => {
          state.globalSearch.results = results;
        }),

        setGlobalSearchOpen: (isOpen) => set((state) => {
          state.globalSearch.isOpen = isOpen;
        }),

        setGlobalSearchLoading: (loading) => set((state) => {
          state.globalSearch.loading = loading;
        }),

        addRecentSearch: (query) => set((state) => {
          if (query && !state.globalSearch.recentSearches.includes(query)) {
            state.globalSearch.recentSearches.unshift(query);
            
            // Keep only last 10 searches
            if (state.globalSearch.recentSearches.length > 10) {
              state.globalSearch.recentSearches = state.globalSearch.recentSearches.slice(0, 10);
            }
          }
        }),

        clearRecentSearches: () => set((state) => {
          state.globalSearch.recentSearches = [];
        }),

        // Filter actions
        setGlobalFilter: (key, value) => set((state) => {
          state.globalFilters[key] = value;
        }),

        removeGlobalFilter: (key) => set((state) => {
          delete state.globalFilters[key];
        }),

        clearGlobalFilters: () => set((state) => {
          state.globalFilters = {};
        }),

        // View preference actions
        setViewPreference: (key, value) => set((state) => {
          state.viewPreferences[key] = value;
        }),

        updateViewPreferences: (preferences) => set((state) => {
          state.viewPreferences = { ...state.viewPreferences, ...preferences };
        }),

        // Keyboard shortcut actions
        setKeyboardShortcutsEnabled: (enabled) => set((state) => {
          state.keyboardShortcuts.enabled = enabled;
        }),

        setCustomShortcut: (key, action) => set((state) => {
          state.keyboardShortcuts.customShortcuts[key] = action;
        }),

        removeCustomShortcut: (key) => set((state) => {
          delete state.keyboardShortcuts.customShortcuts[key];
        }),

        // Accessibility actions
        setAccessibilityOption: (option, value) => set((state) => {
          state.accessibility[option] = value;
        }),

        updateAccessibilityOptions: (options) => set((state) => {
          state.accessibility = { ...state.accessibility, ...options };
        }),

        // Performance actions
        setPerformanceOption: (option, value) => set((state) => {
          state.performance[option] = value;
        }),

        updatePerformanceOptions: (options) => set((state) => {
          state.performance = { ...state.performance, ...options };
        }),

        // User preference actions
        setUserPreference: (key, value) => set((state) => {
          state.userPreferences[key] = value;
        }),

        updateUserPreferences: (preferences) => set((state) => {
          state.userPreferences = { ...state.userPreferences, ...preferences };
        }),

        // Layout customization actions
        setLayoutOption: (option, value) => set((state) => {
          state.layout[option] = value;
        }),

        updateLayoutOptions: (options) => set((state) => {
          state.layout = { ...state.layout, ...options };
        }),

        // Dashboard actions
        setDashboardWidgets: (widgets) => set((state) => {
          state.dashboard.widgets = widgets;
        }),

        addDashboardWidget: (widget) => set((state) => {
          state.dashboard.widgets.push(widget);
        }),

        removeDashboardWidget: (widgetId) => set((state) => {
          state.dashboard.widgets = state.dashboard.widgets.filter(w => w.id !== widgetId);
        }),

        updateDashboardWidget: (widgetId, updates) => set((state) => {
          const index = state.dashboard.widgets.findIndex(w => w.id === widgetId);
          if (index !== -1) {
            state.dashboard.widgets[index] = { ...state.dashboard.widgets[index], ...updates };
          }
        }),

        setDashboardLayout: (layout) => set((state) => {
          state.dashboard.layout = layout;
        }),

        setDashboardColumns: (columns) => set((state) => {
          state.dashboard.columns = Math.max(1, Math.min(6, columns));
        }),

        // Tour actions
        startTour: () => set((state) => {
          state.tour.active = true;
          state.tour.currentStep = 0;
        }),

        nextTourStep: () => set((state) => {
          state.tour.currentStep += 1;
        }),

        previousTourStep: () => set((state) => {
          state.tour.currentStep = Math.max(0, state.tour.currentStep - 1);
        }),

        setTourStep: (step) => set((state) => {
          state.tour.currentStep = step;
        }),

        completeTour: () => set((state) => {
          state.tour.active = false;
          state.tour.completed = true;
        }),

        skipTour: () => set((state) => {
          state.tour.active = false;
          state.tour.skipped = true;
        }),

        resetTour: () => set((state) => {
          state.tour = {
            active: false,
            currentStep: 0,
            completed: false,
            skipped: false
          };
        }),

        // Command palette actions
        openCommandPalette: () => set((state) => {
          state.commandPalette.isOpen = true;
        }),

        closeCommandPalette: () => set((state) => {
          state.commandPalette.isOpen = false;
          state.commandPalette.query = '';
          state.commandPalette.results = [];
        }),

        setCommandPaletteQuery: (query) => set((state) => {
          state.commandPalette.query = query;
        }),

        setCommandPaletteResults: (results) => set((state) => {
          state.commandPalette.results = results;
        }),

        addRecentCommand: (command) => set((state) => {
          if (!state.commandPalette.recentCommands.find(c => c.id === command.id)) {
            state.commandPalette.recentCommands.unshift(command);
            
            // Keep only last 10 commands
            if (state.commandPalette.recentCommands.length > 10) {
              state.commandPalette.recentCommands = state.commandPalette.recentCommands.slice(0, 10);
            }
          }
        }),

        // Context menu actions
        openContextMenu: (position, items) => set((state) => {
          state.contextMenu.isOpen = true;
          state.contextMenu.position = position;
          state.contextMenu.items = items;
        }),

        closeContextMenu: () => set((state) => {
          state.contextMenu.isOpen = false;
          state.contextMenu.items = [];
        }),

        // Drag and drop actions
        setDragData: (data) => set((state) => {
          state.dragDrop.isDragging = true;
          state.dragDrop.dragData = data;
        }),

        clearDragData: () => set((state) => {
          state.dragDrop.isDragging = false;
          state.dragDrop.dragData = null;
        }),

        setDropZones: (zones) => set((state) => {
          state.dragDrop.dropZones = zones;
        }),

        // Scroll position actions
        saveScrollPosition: (key, position) => set((state) => {
          state.scrollPositions[key] = position;
        }),

        getScrollPosition: (key) => {
          return get().scrollPositions[key] || 0;
        },

        clearScrollPosition: (key) => set((state) => {
          delete state.scrollPositions[key];
        }),

        // Window focus actions
        setWindowFocused: (focused) => set((state) => {
          state.windowFocused = focused;
        }),

        // Network status actions
        setOnlineStatus: (isOnline) => set((state) => {
          state.isOnline = isOnline;
        }),

        // Feature flag actions
        setFeatureFlag: (flag, enabled) => set((state) => {
          state.featureFlags[flag] = enabled;
        }),

        updateFeatureFlags: (flags) => set((state) => {
          state.featureFlags = { ...state.featureFlags, ...flags };
        }),

        // Error actions
        addError: (error) => set((state) => {
          state.errors.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...error
          });
          
          // Keep only last 50 errors
          if (state.errors.length > 50) {
            state.errors = state.errors.slice(-50);
          }
        }),

        removeError: (errorId) => set((state) => {
          state.errors = state.errors.filter(error => error.id !== errorId);
        }),

        clearErrors: () => set((state) => {
          state.errors = [];
        }),

        // Debug actions
        toggleDebugMode: () => set((state) => {
          state.debugMode = !state.debugMode;
        }),

        setDebugMode: (enabled) => set((state) => {
          state.debugMode = enabled;
        }),

        // Utility actions
        resetUI: () => set(() => ({
          ...initialState,
          // Preserve some user preferences
          theme: get().theme,
          colorScheme: get().colorScheme,
          userPreferences: get().userPreferences,
          accessibility: get().accessibility,
          keyboardShortcuts: get().keyboardShortcuts
        })),

        // Computed getters
        isModalOpen: (modalId) => {
          return get().modals[modalId]?.isOpen || false;
        },

        isDrawerOpen: (drawerId) => {
          return get().drawers[drawerId]?.isOpen || false;
        },

        getModalProps: (modalId) => {
          return get().modals[modalId]?.props || {};
        },

        getDrawerProps: (drawerId) => {
          return get().drawers[drawerId]?.props || {};
        },

        isComponentLoading: (componentId) => {
          return get().componentLoading[componentId] || false;
        },

        getFormData: (formId) => {
          return get().forms[formId]?.data || {};
        },

        getFormErrors: (formId) => {
          return get().forms[formId]?.errors || {};
        },

        getFormTouched: (formId) => {
          return get().forms[formId]?.touched || {};
        },

        isFeatureEnabled: (flag) => {
          return get().featureFlags[flag] || false;
        },

        // Initialize UI store
        initializeUI: () => {
          get().updateScreenSize();
          get().setOnlineStatus(navigator.onLine);
        },

        trackPageView: (pathname) => {
          get().setActiveRoute(pathname);
        }
      })),
      {
        name: 'ui-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          theme: state.theme,
          colorScheme: state.colorScheme,
          fontSize: state.fontSize,
          density: state.density,
          viewPreferences: state.viewPreferences,
          keyboardShortcuts: state.keyboardShortcuts,
          accessibility: state.accessibility,
          performance: state.performance,
          userPreferences: state.userPreferences,
          layout: state.layout,
          dashboard: state.dashboard,
          tour: state.tour,
          globalSearch: {
            recentSearches: state.globalSearch.recentSearches
          },
          commandPalette: {
            recentCommands: state.commandPalette.recentCommands
          }
        })
      }
    )
  )
);

// Initialize screen size detection
if (typeof window !== 'undefined') {
  useUIStore.getState().updateScreenSize();
  
  // Listen for window resize
  window.addEventListener('resize', () => {
    useUIStore.getState().updateScreenSize();
  });
  
  // Listen for window focus/blur
  window.addEventListener('focus', () => {
    useUIStore.getState().setWindowFocused(true);
  });
  
  window.addEventListener('blur', () => {
    useUIStore.getState().setWindowFocused(false);
  });
  
  // Listen for online/offline status
  window.addEventListener('online', () => {
    useUIStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useUIStore.getState().setOnlineStatus(false);
  });
  
  // Initialize online status
  useUIStore.getState().setOnlineStatus(navigator.onLine);
}

export default useUIStore;