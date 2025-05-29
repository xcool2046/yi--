/**
 * 单页应用路由系统
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = '';
        this.init();
    }

    init() {
        // 监听hash变化
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        
        // 初始化导航链接
        this.initNavigation();
    }

    // 注册路由
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // 处理路由变化
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        const route = this.routes[hash];
        
        if (route) {
            this.currentPage = hash;
            this.updateActiveNav(hash);
            route();
        } else {
            // 默认跳转到首页
            window.location.hash = '#dashboard';
        }
    }

    // 更新导航栏活跃状态
    updateActiveNav(currentPath) {
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentPath)) {
                link.classList.add('active');
            }
        });
    }

    // 初始化导航链接
    initNavigation() {
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html')) {
                // 转换为hash路由
                const page = href.replace('.html', '').replace('index', 'dashboard');
                link.setAttribute('href', `#${page}`);
            }
        });
    }

    // 导航到指定页面
    navigate(path) {
        window.location.hash = `#${path}`;
    }
}

// 创建全局路由实例
window.router = new Router(); 