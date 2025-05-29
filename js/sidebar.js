/**
 * 增强版侧边栏管理器
 * 包含收缩功能、工具提示、移动端支持、键盘快捷键等
 */
class SidebarManager {
    constructor() {
        this.isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this.isMobileOpen = false;
        this.elements = this.getElements();
        this.init();
    }

    getElements() {
        return {
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            mobileSidebarToggle: document.getElementById('mobileSidebarToggle'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            mainContainer: document.getElementById('mainContainer'),
            navLinks: document.querySelectorAll('.nav-link'),
            logoText: document.querySelector('.sidebar-logo-text'),
            navTexts: document.querySelectorAll('.nav-text'),
            userInfo: document.querySelector('.sidebar-user-info')
        };
    }

    init() {
        if (!this.elements.sidebar) {
            console.warn('Sidebar element not found');
            return;
        }

        this.setupEventListeners();
        this.restoreState();
        this.initTooltips();
        this.initKeyboardShortcuts();
        this.initResponsiveHandling();
        
        console.log('🎛️ 侧边栏管理器已初始化');
    }

    setupEventListeners() {
        // 桌面端收缩按钮
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 侧边栏收缩按钮被点击');
                this.toggle();
            });
            console.log('✅ 收缩按钮事件监听器已绑定');
        } else {
            console.warn('⚠️ 未找到收缩按钮元素');
        }

        // 移动端菜单按钮
        if (this.elements.mobileSidebarToggle) {
            this.elements.mobileSidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobile();
            });
        }

        // 遮罩层点击
        if (this.elements.sidebarOverlay) {
            this.elements.sidebarOverlay.addEventListener('click', () => {
                this.closeMobile();
            });
        }

        // 导航链接点击
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavigation(e, link);
            });
        });

        // 窗口调整大小
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 窗口失去焦点时关闭移动端菜单
        window.addEventListener('blur', () => {
            if (this.isMobileOpen) {
                this.closeMobile();
            }
        });
    }

    toggle() {
        console.log('🔄 开始切换侧边栏状态，当前收缩状态:', this.isCollapsed);
        
        if (window.innerWidth <= 1024) {
            console.log('📱 移动端模式，使用移动端切换');
            this.toggleMobile();
            return;
        }

        this.isCollapsed = !this.isCollapsed;
        console.log('🔄 新的收缩状态:', this.isCollapsed);
        
        this.updateCollapsedState();
        this.saveState();
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));

        // 添加触觉反馈
        this.addHapticFeedback();
        
        console.log('✅ 侧边栏状态切换完成');
    }

    updateCollapsedState() {
        const { sidebar, sidebarToggle } = this.elements;
        
        if (this.isCollapsed) {
            sidebar.classList.add('collapsed');
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        } else {
            sidebar.classList.remove('collapsed');
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        }

        // 更新工具提示显示状态
        this.updateTooltips();
    }

    toggleMobile() {
        this.isMobileOpen = !this.isMobileOpen;
        this.updateMobileState();
    }

    openMobile() {
        this.isMobileOpen = true;
        this.updateMobileState();
    }

    closeMobile() {
        this.isMobileOpen = false;
        this.updateMobileState();
    }

    updateMobileState() {
        const { sidebar, sidebarOverlay } = this.elements;
        
        if (this.isMobileOpen) {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleNavigation(e, link) {
        e.preventDefault();
        
        // 更新活动状态
        this.updateActiveState(link);
        
        // 更新页面标题
        this.updatePageTitle(link);
        
        // 自动关闭移动端菜单
        if (window.innerWidth <= 1024 && this.isMobileOpen) {
            this.closeMobile();
        }
        
        // 路由导航
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && window.router) {
            window.router.navigate(href.substring(1));
        }

        // 添加点击反馈
        this.addClickFeedback(link);
    }

    updateActiveState(activeLink) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updatePageTitle(link) {
        const pageTitle = document.getElementById('pageTitle');
        const navText = link.querySelector('.nav-text');
        
        if (pageTitle && navText) {
            pageTitle.textContent = navText.textContent;
        }
    }

    addClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }

    addHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    initTooltips() {
        this.elements.navLinks.forEach(link => {
            const navText = link.querySelector('.nav-text');
            if (!navText) return;

            // 创建工具提示元素
            let tooltip = link.querySelector('.nav-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'nav-tooltip';
                tooltip.textContent = navText.textContent;
                link.appendChild(tooltip);
            }

            // 添加悬停事件
            link.addEventListener('mouseenter', () => {
                this.showTooltip(link, tooltip);
            });

            link.addEventListener('mouseleave', () => {
                this.hideTooltip(tooltip);
            });
        });
    }

    showTooltip(link, tooltip) {
        if (!this.isCollapsed || window.innerWidth <= 1024) return;

        const rect = link.getBoundingClientRect();
        tooltip.style.top = rect.top + 'px';
        tooltip.style.left = '88px';
        tooltip.classList.add('visible');
    }

    hideTooltip(tooltip) {
        tooltip.classList.remove('visible');
    }

    updateTooltips() {
        const tooltips = document.querySelectorAll('.nav-tooltip');
        tooltips.forEach(tooltip => {
            if (this.isCollapsed && window.innerWidth > 1024) {
                tooltip.style.display = 'block';
            } else {
                tooltip.style.display = 'none';
                tooltip.classList.remove('visible');
            }
        });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + B: 切换侧边栏
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggle();
            }

            // ESC: 关闭移动端菜单
            if (e.key === 'Escape' && this.isMobileOpen) {
                e.preventDefault();
                this.closeMobile();
            }

            // 数字键 1-8: 快速导航
            if (e.altKey && /^[1-8]$/.test(e.key)) {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                const navLink = this.elements.navLinks[index];
                if (navLink) {
                    navLink.click();
                }
            }
        });
    }

    initResponsiveHandling() {
        // 监听媒体查询变化
        const mediaQuery = window.matchMedia('(max-width: 1024px)');
        mediaQuery.addListener(() => {
            this.handleResize();
        });
    }

    handleResize() {
        const isDesktop = window.innerWidth > 1024;
        
        if (isDesktop) {
            // 桌面端：关闭移动端状态，恢复收缩状态
            this.closeMobile();
            this.updateCollapsedState();
        } else {
            // 移动端：重置收缩状态
            this.elements.sidebar.classList.remove('collapsed');
            if (this.elements.sidebarToggle) {
                const icon = this.elements.sidebarToggle.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        }

        this.updateTooltips();
    }

    restoreState() {
        if (this.isCollapsed && window.innerWidth > 1024) {
            this.updateCollapsedState();
        }
    }

    saveState() {
        localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
    }

    // 公共API方法
    collapse() {
        if (!this.isCollapsed) {
            this.toggle();
        }
    }

    expand() {
        if (this.isCollapsed) {
            this.toggle();
        }
    }

    isCurrentlyCollapsed() {
        return this.isCollapsed && window.innerWidth > 1024;
    }

    getCurrentState() {
        return {
            isCollapsed: this.isCollapsed,
            isMobileOpen: this.isMobileOpen,
            isDesktop: window.innerWidth > 1024
        };
    }

    // 清理方法
    destroy() {
        // 移除事件监听器
        const events = ['click', 'resize', 'keydown'];
        events.forEach(event => {
            document.removeEventListener(event, this.handleEvents);
        });

        // 清理状态
        this.closeMobile();
        this.elements.sidebar.classList.remove('collapsed');
        
        console.log('🎛️ 侧边栏管理器已销毁');
    }
}

// 粒子系统管理器
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.createParticles();
        this.startAnimation();
        this.setupEventListeners();
        
        console.log('✨ 粒子系统已启动');
    }

    setupCanvas() {
        const updateCanvasSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
    }

    createParticles() {
        const particleCount = Math.min(60, Math.floor(window.innerWidth * window.innerHeight / 15000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // 绘制连接线
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(38, 87, 253, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    setupEventListeners() {
        // 页面可见性变化时暂停/恢复动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });

        // 窗口大小变化时重新创建粒子
        window.addEventListener('resize', () => {
            this.createParticles();
        });
    }

    destroy() {
        this.stopAnimation();
        console.log('✨ 粒子系统已停止');
    }
}

// 粒子类
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.life = Math.random() * 300 + 100;
        this.maxLife = this.life;
        this.hue = Math.random() * 60 + 200; // 蓝色系
        this.size = Math.random() * 3 + 1;
        this.brightness = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界检查和反弹
        if (this.x <= 0 || this.x >= this.canvasWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
        
        if (this.y <= 0 || this.y >= this.canvasHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        }

        // 生命周期
        this.life--;
        if (this.life <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        const opacity = (this.life / this.maxLife) * this.brightness;
        
        // 主粒子
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${opacity})`;
        ctx.fill();

        // 光晕效果
        if (this.size > 2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${opacity * 0.15})`;
            ctx.fill();
        }
    }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化侧边栏管理器
    window.sidebarManager = new SidebarManager();
    
    // 初始化粒子系统
    window.particleSystem = new ParticleSystem();
    
    // 添加全局样式增强
    const enhancementStyles = document.createElement('style');
    enhancementStyles.textContent = `
        /* 收缩状态样式补充 */
        .sidebar.collapsed {
            width: 80px;
        }
        
        .sidebar.collapsed .sidebar-logo-text,
        .sidebar.collapsed .nav-text,
        .sidebar.collapsed .sidebar-user-info {
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }
        
        .sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 12px;
        }
        
        /* 工具提示增强 */
        .nav-tooltip {
            position: fixed;
            left: 90px;
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-50%) translateX(-5px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(38, 87, 253, 0.3);
            backdrop-filter: blur(10px);
            z-index: 1001;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            pointer-events: none;
        }
        
        .nav-tooltip.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(0);
        }
        
        .nav-tooltip::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 50%;
            transform: translateY(-50%);
            border: 6px solid transparent;
            border-right-color: rgba(17, 24, 39, 0.95);
        }
        
        /* 主内容区域调整 */
        #mainContainer {
            margin-left: 256px;
            transition: margin-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .sidebar.collapsed ~ #mainContainer {
            margin-left: 80px;
        }
        
        @media (max-width: 1024px) {
            #mainContainer {
                margin-left: 0 !important;
            }
            
            .nav-tooltip {
                display: none !important;
            }
        }
        
        /* 移动端遮罩层 */
        #sidebarOverlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
        }
        
        #sidebarOverlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        /* 性能优化 */
        .sidebar, #mainContainer {
            will-change: transform, width, margin-left;
        }
        
        /* 减少动画偏好支持 */
        @media (prefers-reduced-motion: reduce) {
            .sidebar,
            #mainContainer,
            .nav-tooltip,
            .sidebar-logo-text,
            .nav-text,
            .sidebar-user-info {
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(enhancementStyles);
    
    console.log('🎨 侧边栏增强功能已加载');
});

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.SidebarManager = SidebarManager;
    window.ParticleSystem = ParticleSystem;
} 