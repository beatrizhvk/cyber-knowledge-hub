// Navigation Management
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contentSections = document.querySelectorAll('.content-section');
        this.sidebar = document.getElementById('sidebar');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleInitialHash();
    }
    
    bindEvents() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.closeMobileMenu();
            });
        });
        
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleInitialHash();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }
    
    showSection(sectionId) {
        // Update URL hash
        history.pushState(null, null, `#${sectionId}`);
        
        // Hide all sections
        this.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load markdown content for content sections
            const contentSections = ['fundamentals', 'network-security', 'penetration-testing', 'incident-response', 'tools', 'resources'];
            if (contentSections.includes(sectionId)) {
                // Wait for markdownLoader to be ready
                const loadContent = () => {
                    if (window.markdownLoader) {
                        window.markdownLoader.renderSection(sectionId);
                    } else {
                        setTimeout(loadContent, 100);
                    }
                };
                
                loadContent();
            }
        }
        
        // Update navigation
        this.updateNavigation(sectionId);
        
        // Update current section
        this.currentSection = sectionId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update page title
        this.updatePageTitle(sectionId);
    }
    
    updateNavigation(activeSection) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
    }
    
    updatePageTitle(section) {
        const titles = {
            'home': 'Cyber Knowledge Hub - Centro de Conhecimento em Segurança Cibernética',
            'fundamentals': 'Fundamentos - Cyber Knowledge Hub',
            'network-security': 'Segurança de Rede - Cyber Knowledge Hub',
            'penetration-testing': 'Penetration Testing - Cyber Knowledge Hub',
            'incident-response': 'Resposta a Incidentes - Cyber Knowledge Hub',
            'tools': 'Ferramentas - Cyber Knowledge Hub',
            'resources': 'Recursos - Cyber Knowledge Hub',
            'contributors': 'Colaboradores - Cyber Knowledge Hub'
        };
        
        document.title = titles[section] || titles['home'];
    }
    
    handleInitialHash() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'home';
        this.showSection(section);
    }
    
    toggleMobileMenu() {
        this.sidebar.classList.toggle('mobile-open');
        
        // Update mobile menu icon
        const icon = this.mobileMenuToggle.querySelector('i');
        if (this.sidebar.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }
    
    closeMobileMenu() {
        this.sidebar.classList.remove('mobile-open');
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
}

// Initialize navigation manager
let navigationManager;

document.addEventListener('DOMContentLoaded', () => {
    navigationManager = new NavigationManager();
});

// Global functions
function showSection(sectionId) {
    if (navigationManager) {
        navigationManager.showSection(sectionId);
    }
}

function toggleMobileMenu() {
    if (navigationManager) {
        navigationManager.toggleMobileMenu();
    }
}

// Smooth scrolling for anchor links within sections
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement && targetElement.closest('.content-section')) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
