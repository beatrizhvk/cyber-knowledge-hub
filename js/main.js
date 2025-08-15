// Main Application Controller
class CyberKnowledgeApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.modules = {};
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.registerModules();
        this.bindGlobalEvents();
        this.initializeApp();
    }
    
    showLoadingScreen() {
        // Simple loading indication
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
    }
    
    hideLoadingScreen() {
        document.body.style.opacity = '1';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    registerModules() {
        // Register all application modules
        this.modules = {
            navigation: navigationManager,
            components: componentManager
        };
    }
    
    bindGlobalEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Global error handling
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });
        
        // Performance monitoring
        window.addEventListener('load', () => {
            this.trackPerformance();
        });
        
        // Online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search (future implementation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSearch();
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showHelp();
        }
        
        // Number keys for navigation
        if (e.key >= '1' && e.key <= '8' && !e.ctrlKey && !e.metaKey && !this.isInputFocused()) {
            e.preventDefault();
            this.navigateByNumber(parseInt(e.key));
        }
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }
    
    navigateByNumber(number) {
        const sections = ['home', 'fundamentals', 'network-security', 'penetration-testing', 
                         'incident-response', 'tools', 'resources', 'contributors'];
        
        if (number <= sections.length) {
            showSection(sections[number - 1]);
        }
    }
    
    openSearch() {
        // Future implementation
        showNotification('Busca será implementada em breve', 'info');
    }
    
    showHelp() {
        showNotification('Atalhos disponíveis - veja o console para detalhes', 'info');
        console.log('Cyber Knowledge Hub - Atalhos do Teclado:\n' +
                   '1-8 - Navegar entre seções\n' +
                   'Ctrl/Cmd + K - Buscar (em breve)\n' +
                   'Ctrl/Cmd + / - Mostrar ajuda');
    }
    
    handleGlobalError(error) {
        console.error('Global error:', error);
        
        // Don't show error notifications for minor issues
        if (error.error && error.error.name !== 'ChunkLoadError') {
            showNotification('Ocorreu um erro inesperado', 'error');
        }
    }
    
    trackPerformance() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Cyber Knowledge Hub loaded in ${loadTime}ms`);
            
            // Track Core Web Vitals (simplified)
            this.trackCoreWebVitals();
        }
    }
    
    trackCoreWebVitals() {
        // Simplified Core Web Vitals tracking
        if ('PerformanceObserver' in window) {
            try {
                // Largest Contentful Paint
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                }).observe({ entryTypes: ['largest-contentful-paint'] });
                
                // First Input Delay
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                }).observe({ entryTypes: ['first-input'] });
                
            } catch (e) {
                // Silently fail if performance observation is not supported
            }
        }
    }
    
    handleOnlineStatus(isOnline) {
        const message = isOnline ? 
            'Conexão restaurada' : 
            'Você está offline. Algumas funcionalidades podem não estar disponíveis.';
        
        const type = isOnline ? 'success' : 'warning';
        showNotification(message, type);
    }
    
    initializeApp() {
        // Wait for all modules to be ready
        const checkModules = () => {
            const allModulesReady = Object.values(this.modules).every(module => module !== undefined);
            
            if (allModulesReady) {
                this.onAppReady();
            } else {
                setTimeout(checkModules, 100);
            }
        };
        
        checkModules();
    }
    
    onAppReady() {
        this.isInitialized = true;
        this.hideLoadingScreen();
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Bem-vindo ao Cyber Knowledge Hub!', 'success');
        }, 500);
        
        // Initialize analytics (future implementation)
        this.initAnalytics();
        
        // Check for updates (future implementation)
        this.checkForUpdates();
        
        console.log(`Cyber Knowledge Hub v${this.version} initialized successfully`);
    }
    
    initAnalytics() {
        // Future implementation for privacy-focused analytics
        console.log('Analytics initialized (privacy-focused)');
    }
    
    checkForUpdates() {
        // Future implementation for update checking
        console.log('Checking for updates...');
    }
    
    // Utility methods
    getAppInfo() {
        return {
            version: this.version,
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            section: this.modules.navigation?.getCurrentSection()
        };
    }
    
    // Debug methods
    debug() {
        console.table(this.getAppInfo());
    }
    
    // Public API methods
    navigateTo(section) {
        if (this.modules.navigation) {
            this.modules.navigation.showSection(section);
        }
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new CyberKnowledgeApp();
});

// Expose app to global scope for debugging
window.CyberKnowledgeApp = app;

// Service Worker registration (future implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export for module systems (future implementation)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberKnowledgeApp;
}
