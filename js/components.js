// Component Management and Dynamic Content
class ComponentManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeComponents();
    }
    
    initializeComponents() {
        this.createSearchComponent();
        this.createProgressIndicator();
        this.createNotificationSystem();
    }
    
    createSearchComponent() {
        const searchHTML = `
            <div class="search-component" style="display: none;">
                <div class="search-input-container">
                    <input type="text" id="searchInput" placeholder="Buscar conteúdo...">
                    <button id="searchButton">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div id="searchResults" class="search-results"></div>
            </div>
        `;
        
        // Add search to sidebar (will be implemented later)
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent) {
            const searchContainer = document.createElement('div');
            searchContainer.innerHTML = searchHTML;
            sidebarContent.insertBefore(searchContainer, sidebarContent.children[1]);
        }
    }
    
    createProgressIndicator() {
        const progressHTML = `
            <div class="progress-indicator">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 5%"></div>
                </div>
                <span class="progress-text">5% Completo</span>
            </div>
        `;
        
        // Add to hero section (will be implemented later)
    }
    
    createNotificationSystem() {
        const notificationHTML = `
            <div id="notificationContainer" class="notification-container"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }
    
    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        return icons[type] || icons.info;
    }
    
    // Utility function to create loading spinner
    createLoadingSpinner() {
        return `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Carregando...</span>
            </div>
        `;
    }
    
    // Utility function to create empty state
    createEmptyState(message, icon = 'fas fa-inbox') {
        return `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>Nenhum conteúdo encontrado</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize component manager
let componentManager;

document.addEventListener('DOMContentLoaded', () => {
    componentManager = new ComponentManager();
});

// Global functions
function showNotification(message, type, duration) {
    if (componentManager) {
        componentManager.showNotification(message, type, duration);
    }
}
