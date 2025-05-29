/**
 * 主应用程序
 */
class App {
    constructor() {
        this.currentPage = null;
        this.mainContent = null;
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.mainContent = document.querySelector('.col-md-10');
        if (!this.mainContent) {
            console.error('主内容区域未找到');
            return;
        }

        // 注册所有路由
        this.registerRoutes();
        
        // 初始化导航
        this.initNavigation();
        
        // 处理初始路由
        this.handleInitialRoute();
    }

    registerRoutes() {
        // 注册所有页面路由
        router.addRoute('dashboard', () => this.loadDashboard());
        router.addRoute('upload', () => this.loadPage(UploadPage));
        router.addRoute('analysis', () => this.loadPage(AnalysisPage));
        router.addRoute('cases', () => this.loadPage(CasesPage));
        router.addRoute('patients', () => this.loadPage(PatientsPage));
        router.addRoute('statistics', () => this.loadPage(StatisticsPage));
        router.addRoute('help', () => this.loadPage(HelpPage));
    }

    initNavigation() {
        // 更新侧边栏导航链接
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html')) {
                let page = href.replace('.html', '');
                if (page === 'index') page = 'dashboard';
                link.setAttribute('href', `#${page}`);
                
                // 移除原有的点击事件
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.navigate(page);
                });
            }
        });
    }

    handleInitialRoute() {
        // 如果没有hash，默认显示dashboard
        const hash = window.location.hash.slice(1);
        if (!hash) {
            router.navigate('dashboard');
        }
    }

    loadDashboard() {
        // 加载仪表板内容（保持原有的index.html主内容）
        const dashboardContent = `
            <div class="py-3">
                <div class="main-content">
                    <!-- 仪表板快速概览 -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-3">
                            <div class="dashboard-card card text-white bg-primary">
                                <div class="card-body">
                                    <h5><i class="bi bi-file-medical me-2"></i>今日新增病例</h5>
                                    <h1 class="display-4">24</h1>
                                    <p class="mb-0">较昨日 +15%</p>
                                </div>
                                <div class="card-overlay">
                                    <button class="btn btn-outline-light">查看详情</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="dashboard-card card text-white bg-success">
                                <div class="card-body">
                                    <h5><i class="bi bi-check-circle me-2"></i>完成分析</h5>
                                    <h1 class="display-4">18</h1>
                                    <p class="mb-0">待处理 6 例</p>
                                </div>
                                <div class="card-overlay">
                                    <button class="btn btn-outline-light">立即处理</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="dashboard-card card text-white bg-warning">
                                <div class="card-body">
                                    <h5><i class="bi bi-exclamation-triangle me-2"></i>异常病例</h5>
                                    <h1 class="display-4">9</h1>
                                    <p class="mb-0">高风险 3 例</p>
                                </div>
                                <div class="card-overlay">
                                    <button class="btn btn-outline-light">查看警报</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="dashboard-card card text-white bg-danger">
                                <div class="card-body">
                                    <h5><i class="bi bi-clock-history me-2"></i>超时病例</h5>
                                    <h1 class="display-4">2</h1>
                                    <p class="mb-0">需立即处理</p>
                                </div>
                                <div class="card-overlay">
                                    <button class="btn btn-outline-light">立即处理</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 主要功能区域 -->
                    <div class="row g-4">
                        <!-- 左侧列 -->
                        <div class="col-md-8">
                            <!-- 快速操作 -->
                            <div class="row g-3 mb-4">
                                <div class="col-md-4">
                                    <a href="#upload" class="quick-action-btn text-decoration-none">
                                        <i class="bi bi-upload fs-1 text-primary"></i>
                                        <span class="mt-2 text-dark">上传影像</span>
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <a href="#statistics" class="quick-action-btn text-decoration-none">
                                        <i class="bi bi-file-earmark-medical fs-1 text-success"></i>
                                        <span class="mt-2 text-dark">查看报告</span>
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <a href="#patients" class="quick-action-btn text-decoration-none">
                                        <i class="bi bi-person-plus fs-1 text-warning"></i>
                                        <span class="mt-2 text-dark">新建患者</span>
                                    </a>
                                </div>
                            </div>

                            <!-- 最新上传 -->
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">最近上传记录</h5>
                                </div>
                                <div class="card-body recent-uploads">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>患者姓名</th>
                                                    <th>检查类型</th>
                                                    <th>上传时间</th>
                                                    <th>状态</th>
                                                    <th>操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>王某某</td>
                                                    <td>胸部CT</td>
                                                    <td>2023-07-20 14:30</td>
                                                    <td><span class="badge bg-success">已完成</span></td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-primary">查看</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>李某某</td>
                                                    <td>头部MRI</td>
                                                    <td>2023-07-20 13:15</td>
                                                    <td><span class="badge bg-warning">分析中</span></td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-secondary" disabled>等待中</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 右侧列 -->
                        <div class="col-md-4">
                            <!-- 系统状态 -->
                            <div class="system-status">
                                <h5><i class="bi bi-server me-2"></i>系统状态</h5>
                                <div class="mb-3">
                                    <small class="text-muted">AI模型版本</small>
                                    <div>3.2.1 (最新)</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">存储空间</small>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style="width: 65%">65%</div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">系统负载</small>
                                    <div class="progress">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 42%">42%</div>
                                    </div>
                                </div>
                            </div>

                            <!-- 通知中心 -->
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="bi bi-bell me-2"></i>最新通知</h5>
                                </div>
                                <div class="card-body">
                                    <ul class="notification-list">
                                        <li class="notification-item">
                                            <i class="bi bi-exclamation-triangle text-danger notification-icon"></i>
                                            <div>
                                                <div class="fw-bold">系统维护通知</div>
                                                <small class="text-muted">2023-07-20 03:00-05:00</small>
                                            </div>
                                        </li>
                                        <li class="notification-item">
                                            <i class="bi bi-info-circle text-info notification-icon"></i>
                                            <div>
                                                <div class="fw-bold">新功能上线</div>
                                                <small class="text-muted">AI模型已更新至3.2.1版本</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.mainContent.innerHTML = dashboardContent;
        this.currentPage = 'dashboard';
    }

    loadPage(pageModule) {
        if (!pageModule || !pageModule.template) {
            console.error('页面模块无效');
            return;
        }

        // 清除当前页面的样式
        this.clearPageStyles();
        
        // 加载新页面内容
        this.mainContent.innerHTML = `<div class="py-3">${pageModule.template}</div>`;
        
        // 初始化页面
        if (pageModule.init) {
            pageModule.init();
        }
        
        this.currentPage = pageModule;
    }

    clearPageStyles() {
        // 清除页面特定的样式
        const pageStyles = document.querySelectorAll('style[id$="-page-styles"]');
        pageStyles.forEach(style => style.remove());
    }
}

// 创建应用实例
window.app = new App(); 