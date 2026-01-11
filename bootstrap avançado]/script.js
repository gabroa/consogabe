document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initializeComponents();
    
    // Configurar animações
    setupAnimations();
    
    // Configurar navegação suave
    setupSmoothScrolling();
    
    // Configurar navbar dinâmica
    setupDynamicNavbar();
    
    // Mostrar toast de boas-vindas após 2 segundos
    setTimeout(function() {
        showWelcomeToast();
    }, 2000);
});

//INICIALIZAÇÃO DE COMPONENTES 
function initializeComponents() {
    // Inicializar tooltips do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar popovers do Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// ===== FUNCIONALIDADE DO TOAST =====
function showToast() {
    const toastElement = document.getElementById('notificationToast');
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    // Adicionar efeito sonoro (opcional)
    playNotificationSound();
    
    toast.show();
}

function showWelcomeToast() {
    const toastElement = document.getElementById('notificationToast');
    const toastBody = toastElement.querySelector('.toast-body');
    
    // Personalizar mensagem de boas-vindas
    toastBody.innerHTML = `
        <i class="bi bi-heart-fill text-danger me-2"></i>
        Obrigado por visitar nosso site! Explore nossos serviços e descubra como podemos ajudar você.
    `;
    
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 6000
    });
    
    toast.show();
}

function playNotificationSound() {
    // Criar um som de notificação simples usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Audio não suportado neste navegador');
    }
}

// NAVEGAÇÃO SUAVE
function setupSmoothScrolling() {
    // Adicionar comportamento de scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80; // Altura da navbar fixa
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// NAVBAR DINÂMICA
function setupDynamicNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar/remover classe baseada no scroll
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Esconder/mostrar navbar no scroll (opcional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Atualizar link ativo baseado na seção visível
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

//ANIMAÇÕES 
function setupAnimations() {
    // Configurar Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.card, .carousel, .hero-section .col-lg-6').forEach(el => {
        observer.observe(el);
    });
}

//FUNCIONALIDADES DO CAROUSEL
function setupCarouselEnhancements() {
    const carousel = document.querySelector('#mainCarousel');
    
    if (carousel) {
        // Pausar carousel no hover
        carousel.addEventListener('mouseenter', function() {
            bootstrap.Carousel.getInstance(carousel).pause();
        });
        
        carousel.addEventListener('mouseleave', function() {
            bootstrap.Carousel.getInstance(carousel).cycle();
        });
        
        // Adicionar indicadores de progresso
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
        
        // Event listeners para transições
        carousel.addEventListener('slide.bs.carousel', function(e) {
            console.log('Mudando para slide:', e.to);
        });
    }
}

// FUNCIONALIDADES DOS CARDS 
function setupCardInteractions() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        // Efeito de tilt no hover
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
        
        // Efeito de clique
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

// UTILITÁRIOS
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//FUNCIONALIDADES EXTRAS
function setupExtraFeatures() {
    // Botão "Voltar ao topo"
    createBackToTopButton();
    
    // Contador de visitantes (simulado)
    updateVisitorCounter();
    
    // Configurar lazy loading para imagens
    setupLazyLoading();
}

function createBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopButton.className = 'btn btn-primary position-fixed';
    backToTopButton.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Mostrar/esconder botão baseado no scroll
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    }, 100));
    
    // Funcionalidade do botão
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function updateVisitorCounter() {
    // Simular contador de visitantes
    let visitors = localStorage.getItem('visitors') || 0;
    visitors = parseInt(visitors) + 1;
    localStorage.setItem('visitors', visitors);
    
    console.log(`Visitante número: ${visitors}`);
}

function setupLazyLoading() {
    // Implementar lazy loading básico para imagens
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// INICIALIZAÇÃO FINAL
window.addEventListener('load', function() {
    // Configurar funcionalidades extras após carregamento completo
    setupCarouselEnhancements();
    setupCardInteractions();
    setupExtraFeatures();
    
    // Remover loading screen se existir
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
    
    console.log('Site carregado completamente!');
});

// TRATAMENTO DE ERROS
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
});

// FUNCIONALIDADES DE ACESSIBILIDADE
function setupAccessibility() {
    // Adicionar suporte para navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para fechar modais/dropdowns
        if (e.key === 'Escape') {
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // Melhorar foco para usuários de teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Inicializar acessibilidade
setupAccessibility();