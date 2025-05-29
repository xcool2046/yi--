/**
 * 侧边栏导航管理
 */
class SidebarNavigation {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.isCollapsed = false;
        this.isMobile = false;
        this.init();
    }

    init() {
        this.sidebar = document.querySelector('nav');
        this.checkMobile();
        this.initEventListeners();
        this.initMobileToggle();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.checkMobile();
            this.handleResize();
        });
    }

    checkMobile() {
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            this.sidebar?.classList.add('mobile');
        } else {
            this.sidebar?.classList.remove('mobile');
            this.closeMobileSidebar();
        }
    }

    initEventListeners() {
        // 导航链接点击事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });

        // 用户菜单
        this.initUserMenu();
    }

    initMobileToggle() {
        // 创建移动端菜单按钮
        if (this.isMobile && !document.querySelector('.mobile-menu-btn')) {
            this.createMobileMenuButton();
        }
    }

    createMobileMenuButton() {
        const header = document.querySelector('header');
        if (!header) return;

        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.addEventListener('click', () => this.toggleMobileSidebar());

        // 插入到header的开始位置
        header.insertBefore(menuBtn, header.firstChild);
    }

    toggleMobileSidebar() {
        if (!this.isMobile) return;

        const isOpen = this.sidebar?.classList.contains('open');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    openMobileSidebar() {
        if (!this.isMobile) return;

        this.sidebar?.classList.add('open');
        this.createOverlay();
        document.body.style.overflow = 'hidden';
    }

    closeMobileSidebar() {
        this.sidebar?.classList.remove('open');
        this.removeOverlay();
        document.body.style.overflow = '';
    }

    createOverlay() {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        this.overlay.addEventListener('click', () => this.closeMobileSidebar());
        document.body.appendChild(this.overlay);

        // 触发动画
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 10);
    }

    removeOverlay() {
        if (!this.overlay) return;

        this.overlay.classList.remove('active');
        setTimeout(() => {
            this.overlay?.remove();
            this.overlay = null;
        }, 300);
    }

    handleNavClick(e, link) {
        // 更新活跃状态
        this.updateActiveNav(link);
        
        // 移动端自动关闭侧边栏
        if (this.isMobile) {
            setTimeout(() => {
                this.closeMobileSidebar();
            }, 150);
        }

        // 添加点击动画
        this.addClickAnimation(link);
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    addClickAnimation(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    initUserMenu() {
        const userInfo = document.querySelector('.user-info');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userInfo) {
            userInfo.addEventListener('click', () => {
                this.showUserMenu();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLogout();
            });
        }
    }

    showUserMenu() {
        // 可以在这里实现用户菜单的显示逻辑
        console.log('显示用户菜单');
    }

    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            // 添加退出动画
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 300);
        }
    }

    handleResize() {
        // 处理窗口大小变化
        if (!this.isMobile && this.sidebar?.classList.contains('open')) {
            this.closeMobileSidebar();
        }

        // 移除或添加移动端菜单按钮
        const existingBtn = document.querySelector('.mobile-menu-btn');
        if (this.isMobile && !existingBtn) {
            this.createMobileMenuButton();
        } else if (!this.isMobile && existingBtn) {
            existingBtn.remove();
        }
    }

    // 折叠/展开侧边栏（桌面端）
    toggleCollapse() {
        if (this.isMobile) return;

        this.isCollapsed = !this.isCollapsed;
        this.sidebar?.classList.toggle('collapsed', this.isCollapsed);
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    // 高亮指定的导航项
    highlightNav(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(path)) {
                link.classList.add('active');
            }
        });
    }

    // 添加导航项徽章
    addBadge(navSelector, count, type = 'primary') {
        const navItem = document.querySelector(navSelector);
        if (!navItem) return;

        // 移除现有徽章
        const existingBadge = navItem.querySelector('.nav-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = `nav-badge nav-badge-${type}`;
            badge.textContent = count > 99 ? '99+' : count;
            navItem.appendChild(badge);
        }
    }

    // 显示导航提示
    showNavTip(message, type = 'info') {
        const tip = document.createElement('div');
        tip.className = `nav-tip nav-tip-${type}`;
        tip.textContent = message;
        
        this.sidebar?.appendChild(tip);
        
        // 自动隐藏
        setTimeout(() => {
            tip.classList.add('fade-out');
            setTimeout(() => tip.remove(), 300);
        }, 3000);
    }
}

// 添加侧边栏导航样式
const sidebarNavStyles = document.createElement('style');
sidebarNavStyles.textContent = `
    .mobile-menu-btn {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        width: 44px;
        height: 44px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #ffffff;
        font-size: 1.25rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: none;
    }

    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .mobile-menu-btn:hover {
        background: rgba(38, 87, 253, 0.8);
        border-color: rgba(38, 87, 253, 0.5);
    }

    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    @media (max-width: 768px) {
        nav {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        nav.open {
            transform: translateX(0);
        }

        .main-content {
            margin-left: 0 !important;
        }
    }

    .nav-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        line-height: 1;
    }

    .nav-badge-primary {
        background: #2657FD;
    }

    .nav-badge-danger {
        background: #EF4444;
    }

    .nav-badge-warning {
        background: #F59E0B;
    }

    .nav-badge-success {
        background: #10B981;
    }

    .nav-tip {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        padding: 12px;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
        animation: slideInUp 0.3s ease;
    }

    .nav-tip-info {
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93C5FD;
    }

    .nav-tip-success {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #6EE7B7;
    }

    .nav-tip-warning {
        background: rgba(245, 158, 11, 0.2);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #FCD34D;
    }

    .nav-tip.fade-out {
        animation: slideOutDown 0.3s ease;
    }

    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    /* 侧边栏折叠状态 */
    nav.collapsed {
        width: 80px;
    }

    nav.collapsed .logo-text,
    nav.collapsed .nav-link span,
    nav.collapsed .user-details {
        opacity: 0;
        visibility: hidden;
    }

    nav.collapsed .logo-container,
    nav.collapsed .nav-link,
    nav.collapsed .user-info {
        justify-content: center;
    }

    nav.collapsed .nav-link {
        padding: 12px;
    }

    /* 导航项悬浮提示 */
    nav.collapsed .nav-link {
        position: relative;
    }

    nav.collapsed .nav-link:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 12px;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
    }
`;
document.head.appendChild(sidebarNavStyles);

// 初始化侧边栏导航
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarNavigation = new SidebarNavigation();
});

// 导出到全局
window.SidebarNavigation = SidebarNavigation; 