/**
 * 主应用管理 - 现代化重构版本
 */
class MainApp {
    constructor() {
        this.currentTime = null;
        this.timeInterval = null;
        this.realTimeCharts = new Map();
        this.animationFrames = new Map();
        this.init();
    }

    init() {
        this.updateTime();
        this.startTimeUpdate();
        this.initNavigation();
        this.initNotificationSystem();
        this.loadBentoGridDashboard();
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    startTimeUpdate() {
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const page = href.substring(1);
                    this.navigateToPage(page);
                }
            });
        });
    }

    navigateToPage(page) {
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // 更新页面标题
        const pageTitles = {
            'dashboard': '首页',
            'upload': '上传影像',
            'analysis': '分析结果',
            'cases': '病例库',
            'patients': '患者管理',
            'statistics': '统计分析',
            'settings': '系统设置',
            'help': '帮助中心'
        };
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = pageTitles[page] || '首页';
        }

        // 加载页面内容
        this.loadPageContent(page);
    }

    loadPageContent(page) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // 添加页面退出动画
        if (window.animationManager) {
            mainContent.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(-10px) scale(0.98)';
            mainContent.style.filter = 'blur(3px)';
        }

        // 延迟加载新内容
        setTimeout(() => {
            // 清理现有图表
            this.cleanupCharts();

            let pageContent = '';
            let pageInitFunction = null;

            switch (page) {
                case 'dashboard':
                    this.loadBentoGridDashboard();
                    return; // Dashboard有自己的动画处理
                case 'upload':
                    if (window.UploadPage) {
                        pageContent = window.UploadPage.render();
                        pageInitFunction = () => window.UploadPage.init();
                    }
                    break;
                case 'analysis':
                    if (window.AnalysisPage) {
                        pageContent = window.AnalysisPage.render();
                        pageInitFunction = () => window.AnalysisPage.init();
                    }
                    break;
                case 'cases':
                    if (window.CasesPage) {
                        pageContent = window.CasesPage.render();
                        pageInitFunction = () => window.CasesPage.init();
                    }
                    break;
                case 'patients':
                    if (window.PatientsPage) {
                        pageContent = window.PatientsPage.render();
                        pageInitFunction = () => window.PatientsPage.init();
                    }
                    break;
                case 'statistics':
                    if (window.StatisticsPage) {
                        pageContent = window.StatisticsPage.render();
                        pageInitFunction = () => window.StatisticsPage.init();
                    }
                    break;
                case 'settings':
                    if (window.SettingsPage) {
                        pageContent = window.SettingsPage.render();
                        pageInitFunction = () => window.SettingsPage.init();
                    }
                    break;
                case 'help':
                    if (window.HelpPage) {
                        pageContent = window.HelpPage.render();
                        pageInitFunction = () => window.HelpPage.init();
                    }
                    break;
                default:
                    this.loadBentoGridDashboard();
                    return;
            }

            // 设置新内容
            if (pageContent) {
                mainContent.innerHTML = pageContent;
                
                // 添加页面入场动画
                if (window.animationManager) {
                    mainContent.style.opacity = '0';
                    mainContent.style.transform = 'translateY(10px) scale(0.98)';
                    mainContent.style.filter = 'blur(3px)';
                    
                    requestAnimationFrame(() => {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'translateY(0) scale(1)';
                        mainContent.style.filter = 'blur(0px)';
                    });

                    // 初始化页面内容和动画
                    setTimeout(() => {
                        if (pageInitFunction) pageInitFunction();
                        window.animationManager.initializePageContent(mainContent);
                    }, 150);
                } else {
                    // 没有动画管理器时直接初始化
                    if (pageInitFunction) pageInitFunction();
                }
            }
        }, window.animationManager ? 150 : 0);
    }

    loadBentoGridDashboard() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="bento-dashboard">
                <!-- 主要数据流区域 -->
                <div class="bento-item bento-large data-stream-container">
                    <div class="bento-header">
                        <div class="pulse-indicator"></div>
                        <span class="bento-title">实时数据流</span>
                    </div>
                    <div class="data-stream-wrapper">
                        <canvas id="realTimeChart" class="data-stream-chart"></canvas>
                        <div class="data-overlay">
                            <div class="metric-card">
                                <div class="metric-value" id="currentThroughput">0</div>
                                <div class="metric-label">处理速度/秒</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value" id="activeConnections">0</div>
                                <div class="metric-label">活跃连接</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI分析状态 -->
                <div class="bento-item bento-medium ai-status-container">
                    <div class="bento-header">
                        <i class="fas fa-brain pulse-icon"></i>
                        <span class="bento-title">AI引擎状态</span>
                    </div>
                    <div class="ai-status-content">
                        <div class="ai-core">
                            <div class="ai-core-ring"></div>
                            <div class="ai-core-center">
                                <span class="ai-status-text">运行中</span>
                                <span class="ai-efficiency" id="aiEfficiency">98.7%</span>
                            </div>
                        </div>
                        <div class="ai-metrics">
                            <div class="ai-metric">
                                <span class="ai-metric-value" id="processedToday">1,247</span>
                                <span class="ai-metric-label">今日处理</span>
                            </div>
                            <div class="ai-metric">
                                <span class="ai-metric-value" id="avgProcessTime">2.3s</span>
                                <span class="ai-metric-label">平均耗时</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3D统计球 -->
                <div class="bento-item bento-medium stats-sphere-container">
                    <div class="bento-header">
                        <i class="fas fa-chart-pie"></i>
                        <span class="bento-title">疾病分布</span>
                    </div>
                    <div class="stats-sphere-wrapper">
                        <canvas id="diseaseDistribution" class="stats-sphere"></canvas>
                        <div class="sphere-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #2657FD;"></div>
                                <span>肺结节</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #10B981;"></div>
                                <span>肺炎</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #F59E0B;"></div>
                                <span>其他</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 快捷操作面板 -->
                <div class="bento-item bento-small quick-actions-container">
                    <div class="quick-actions-grid">
                        <button class="quick-action-btn" onclick="window.mainApp.navigateToPage('upload')">
                            <div class="action-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <span>上传</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.mainApp.navigateToPage('analysis')">
                            <div class="action-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <span>分析</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.mainApp.navigateToPage('patients')">
                            <div class="action-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <span>患者</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.mainApp.navigateToPage('cases')">
                            <div class="action-icon">
                                <i class="fas fa-archive"></i>
                            </div>
                            <span>病例</span>
                        </button>
                    </div>
                </div>

                <!-- 系统监控 -->
                <div class="bento-item bento-small system-monitor-container">
                    <div class="bento-header">
                        <i class="fas fa-server"></i>
                        <span class="bento-title">系统监控</span>
                    </div>
                    <div class="system-metrics">
                        <div class="metric-ring-container">
                            <canvas id="cpuUsage" class="metric-ring"></canvas>
                            <div class="metric-ring-label">CPU</div>
                        </div>
                        <div class="metric-ring-container">
                            <canvas id="memoryUsage" class="metric-ring"></canvas>
                            <div class="metric-ring-label">内存</div>
                        </div>
                        <div class="metric-ring-container">
                            <canvas id="diskUsage" class="metric-ring"></canvas>
                            <div class="metric-ring-label">存储</div>
                        </div>
                    </div>
                </div>

                <!-- 热力图 -->
                <div class="bento-item bento-medium heatmap-container">
                    <div class="bento-header">
                        <i class="fas fa-fire"></i>
                        <span class="bento-title">活跃度热力图</span>
                    </div>
                    <div class="heatmap-wrapper">
                        <canvas id="activityHeatmap" class="heatmap-canvas"></canvas>
                        <div class="heatmap-scale">
                            <span>低</span>
                            <div class="scale-gradient"></div>
                            <span>高</span>
                        </div>
                    </div>
                </div>

                <!-- 趋势预测 -->
                <div class="bento-item bento-large trend-prediction-container">
                    <div class="bento-header">
                        <i class="fas fa-chart-line"></i>
                        <span class="bento-title">趋势预测</span>
                        <div class="trend-controls">
                            <button class="trend-btn active" data-period="7d">7天</button>
                            <button class="trend-btn" data-period="30d">30天</button>
                            <button class="trend-btn" data-period="90d">90天</button>
                        </div>
                    </div>
                    <div class="trend-chart-wrapper">
                        <canvas id="trendChart" class="trend-chart"></canvas>
                        <div class="trend-insights">
                            <div class="insight-card">
                                <div class="insight-icon up">↗</div>
                                <div class="insight-text">
                                    <span class="insight-value">+12.5%</span>
                                    <span class="insight-label">检测量增长</span>
                                </div>
                            </div>
                            <div class="insight-card">
                                <div class="insight-icon stable">→</div>
                                <div class="insight-text">
                                    <span class="insight-value">96.8%</span>
                                    <span class="insight-label">准确率稳定</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 实时通知流 -->
                <div class="bento-item bento-small notification-stream-container">
                    <div class="bento-header">
                        <i class="fas fa-bell"></i>
                        <span class="bento-title">实时通知</span>
                    </div>
                    <div class="notification-stream" id="notificationStream">
                        <!-- 通知将动态生成 -->
                    </div>
                </div>
            </div>
        `;

        // 添加页面入场动画
        if (window.animationManager) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(10px) scale(0.98)';
            mainContent.style.filter = 'blur(3px)';
            
            requestAnimationFrame(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0) scale(1)';
                mainContent.style.filter = 'blur(0px)';
            });

            // 延迟初始化以配合动画
            setTimeout(() => {
                this.initDashboardCharts();
                this.startRealTimeUpdates();
                window.animationManager.initializePageContent(mainContent);
            }, 150);
        } else {
            // 没有动画管理器时直接初始化
            this.initDashboardCharts();
            this.startRealTimeUpdates();
        }
    }

    initDashboardCharts() {
        // 实时数据流图表
        this.initRealTimeChart();
        
        // 疾病分布饼图
        this.initDiseaseDistribution();
        
        // 系统监控环形图
        this.initSystemMonitor();
        
        // 活跃度热力图
        this.initActivityHeatmap();
        
        // 趋势预测图表
        this.initTrendChart();
        
        // 初始化交互事件
        this.initDashboardInteractions();
    }

    initRealTimeChart() {
        const canvas = document.getElementById('realTimeChart');
        if (!canvas) return;

        const config = ChartUtils.createLineChart({
            labels: Array.from({length: 20}, (_, i) => ''),
            datasets: [{
                label: '处理速度',
                data: Array.from({length: 20}, () => Math.random() * 100 + 50),
                borderColor: '#2657FD',
                backgroundColor: 'rgba(38, 87, 253, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        }, {
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: { 
                    display: false,
                    min: 0,
                    max: 200
                }
            },
            animation: false
        });

        const chart = window.chartManager.createChart('realTimeChart', config);
        this.realTimeCharts.set('realTimeChart', chart);
    }

    initDiseaseDistribution() {
        const canvas = document.getElementById('diseaseDistribution');
        if (!canvas) return;

        const config = ChartUtils.createDoughnutChart({
            labels: ['肺结节', '肺炎', '肺气肿', '其他'],
            data: [45, 25, 15, 15],
            backgroundColor: ['#2657FD', '#10B981', '#F59E0B', '#6B7280'],
            centerText: {
                value: '1,247',
                label: '总病例'
            }
        }, {
            plugins: {
                legend: { display: false }
            },
            cutout: '70%'
        });

        window.chartManager.createChart('diseaseDistribution', config);
    }

    initSystemMonitor() {
        const metrics = [
            { id: 'cpuUsage', value: 65, color: '#2657FD' },
            { id: 'memoryUsage', value: 78, color: '#10B981' },
            { id: 'diskUsage', value: 45, color: '#F59E0B' }
        ];

        metrics.forEach(metric => {
            const canvas = document.getElementById(metric.id);
            if (!canvas) return;

            const config = ChartUtils.createDoughnutChart({
                labels: ['已使用', '可用'],
                data: [metric.value, 100 - metric.value],
                backgroundColor: [metric.color, 'rgba(255, 255, 255, 0.1)'],
                centerText: {
                    value: `${metric.value}%`,
                    label: ''
                }
            }, {
                plugins: {
                    legend: { display: false }
                },
                cutout: '80%'
            });

            window.chartManager.createChart(metric.id, config);
        });
    }

    initActivityHeatmap() {
        const canvas = document.getElementById('activityHeatmap');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        this.drawHeatmap(ctx, width / 2, height / 2);
    }

    drawHeatmap(ctx, width, height) {
        const cellSize = 8;
        const cols = Math.floor(width / cellSize);
        const rows = Math.floor(height / cellSize);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const intensity = Math.random();
                const alpha = intensity * 0.8;
                
                if (intensity > 0.3) {
                    ctx.fillStyle = `rgba(38, 87, 253, ${alpha})`;
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }
    }

    initTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.getDate();
        });

        const config = ChartUtils.createLineChart({
            labels,
            datasets: [
                {
                    label: '检测量',
                    data: Array.from({length: 30}, () => Math.random() * 50 + 80),
                    borderColor: '#2657FD',
                    backgroundColor: 'rgba(38, 87, 253, 0.1)',
                    fill: true
                },
                {
                    label: '预测',
                    data: Array.from({length: 30}, (_, i) => i > 22 ? Math.random() * 60 + 90 : null),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        }, {
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    align: 'end'
                }
            }
        });

        window.chartManager.createChart('trendChart', config);
    }

    initDashboardInteractions() {
        // 趋势预测时间段切换
        document.querySelectorAll('.trend-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.trend-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                this.updateTrendChart(period);
            });
        });
    }

    updateTrendChart(period) {
        const chart = window.chartManager.getChart('trendChart');
        if (!chart) return;

        const dataPoints = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const labels = Array.from({length: dataPoints}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (dataPoints - 1 - i));
            return date.getDate();
        });

        chart.data.labels = labels;
        chart.data.datasets[0].data = Array.from({length: dataPoints}, () => Math.random() * 50 + 80);
        chart.data.datasets[1].data = Array.from({length: dataPoints}, (_, i) => 
            i > dataPoints - 8 ? Math.random() * 60 + 90 : null
        );
        
        chart.update();
    }

    startRealTimeUpdates() {
        // 更新实时数据
        this.updateRealTimeData();
        
        // 启动通知流
        this.startNotificationStream();
        
        // 启动数据更新循环
        this.startDataUpdateLoop();
    }

    updateRealTimeData() {
        // 更新吞吐量
        const throughput = Math.floor(Math.random() * 50) + 150;
        const connections = Math.floor(Math.random() * 20) + 80;
        
        document.getElementById('currentThroughput').textContent = throughput;
        document.getElementById('activeConnections').textContent = connections;
        
        // 更新AI效率
        const efficiency = (Math.random() * 2 + 97).toFixed(1);
        document.getElementById('aiEfficiency').textContent = efficiency + '%';
        
        // 更新今日处理量
        const processed = Math.floor(Math.random() * 100) + 1200;
        document.getElementById('processedToday').textContent = processed.toLocaleString();
        
        // 更新平均处理时间
        const avgTime = (Math.random() * 1 + 2).toFixed(1);
        document.getElementById('avgProcessTime').textContent = avgTime + 's';
    }

    startNotificationStream() {
        const notifications = [
            { type: 'success', message: '患者 张某某 分析完成', icon: 'check-circle' },
            { type: 'warning', message: '发现高风险病例', icon: 'exclamation-triangle' },
            { type: 'info', message: '系统性能优化完成', icon: 'info-circle' },
            { type: 'success', message: '新增病例已入库', icon: 'plus-circle' },
            { type: 'warning', message: '存储空间不足', icon: 'hdd' }
        ];

        const container = document.getElementById('notificationStream');
        if (!container) return;

        // 先清理现有的定时器
        if (this.animationFrames.has('notificationStream')) {
            clearInterval(this.animationFrames.get('notificationStream'));
            this.animationFrames.delete('notificationStream');
        }

        const notificationInterval = setInterval(() => {
            // 只在首页时更新通知
            if (window.location.hash !== '#dashboard' && window.location.hash !== '') {
                return;
            }

            if (container && container.parentNode) {
                const notification = notifications[Math.floor(Math.random() * notifications.length)];
                this.addNotification(container, notification);
            }
        }, 8000); // 降低通知频率到8秒

        // 存储interval ID以便清理
        this.animationFrames.set('notificationStream', notificationInterval);
    }

    addNotification(container, notification) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification-item ${notification.type}`;
        notificationEl.innerHTML = `
            <i class="fas fa-${notification.icon}"></i>
            <span>${notification.message}</span>
        `;

        container.insertBefore(notificationEl, container.firstChild);

        // 限制通知数量
        while (container.children.length > 5) {
            container.removeChild(container.lastChild);
        }

        // 自动移除动画
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.style.opacity = '0';
                notificationEl.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notificationEl.parentNode) {
                        notificationEl.remove();
                    }
                }, 300);
            }
        }, 8000);
    }

    startDataUpdateLoop() {
        // 先清理现有的定时器
        if (this.animationFrames.has('dataUpdate')) {
            clearInterval(this.animationFrames.get('dataUpdate'));
            this.animationFrames.delete('dataUpdate');
        }

        const updateInterval = setInterval(() => {
            // 只在首页时更新
            if (window.location.hash !== '#dashboard' && window.location.hash !== '') {
                return;
            }

            // 更新实时图表
            const chart = this.realTimeCharts.get('realTimeChart');
            if (chart) {
                const newData = Math.random() * 100 + 50;
                chart.data.datasets[0].data.shift();
                chart.data.datasets[0].data.push(newData);
                chart.update('none');
            }

            // 更新实时数据
            this.updateRealTimeData();

            // 更新热力图（降低频率）
            if (Date.now() % 5000 < 1000) {
                const heatmapCanvas = document.getElementById('activityHeatmap');
                if (heatmapCanvas) {
                    const ctx = heatmapCanvas.getContext('2d');
                    ctx.clearRect(0, 0, heatmapCanvas.width, heatmapCanvas.height);
                    this.drawHeatmap(ctx, heatmapCanvas.width / 2, heatmapCanvas.height / 2);
                }
            }
        }, 5000); // 进一步降低更新频率到5秒

        // 存储interval ID以便清理
        this.animationFrames.set('dataUpdate', updateInterval);
    }

    cleanupCharts() {
        // 清理图表
        this.realTimeCharts.forEach((chart, id) => {
            chart.destroy();
        });
        this.realTimeCharts.clear();

        // 清理动画循环
        this.animationFrames.forEach((id, name) => {
            clearInterval(id);
        });
        this.animationFrames.clear();
    }

    destroy() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        this.cleanupCharts();
    }

    // 初始化通知功能
    initNotificationSystem() {
        const notificationBtn = document.querySelector('header button[class*="relative"]');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotificationPanel();
            });
        }
    }

    showNotificationPanel() {
        // 创建通知面板
        const existingPanel = document.getElementById('notificationPanel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'notificationPanel';
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-panel-header">
                <h3>系统通知</h3>
                <button class="close-panel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-panel-body">
                <div class="notification-list">
                    <div class="notification-item-panel success">
                        <i class="fas fa-check-circle"></i>
                        <div class="notification-content">
                            <div class="notification-title">分析完成</div>
                            <div class="notification-desc">患者 李某某 的CT分析已完成</div>
                            <div class="notification-time">2分钟前</div>
                        </div>
                    </div>
                    <div class="notification-item-panel warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div class="notification-content">
                            <div class="notification-title">高风险病例</div>
                            <div class="notification-desc">发现疑似恶性结节，建议立即关注</div>
                            <div class="notification-time">5分钟前</div>
                        </div>
                    </div>
                    <div class="notification-item-panel info">
                        <i class="fas fa-info-circle"></i>
                        <div class="notification-content">
                            <div class="notification-title">系统更新</div>
                            <div class="notification-desc">AI模型已更新至最新版本</div>
                            <div class="notification-time">1小时前</div>
                        </div>
                    </div>
                    <div class="notification-item-panel success">
                        <i class="fas fa-user-plus"></i>
                        <div class="notification-content">
                            <div class="notification-title">新增患者</div>
                            <div class="notification-desc">患者 张某某 已成功添加到系统</div>
                            <div class="notification-time">2小时前</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notification-panel-footer">
                <button class="btn-outline text-sm">查看全部</button>
                <button class="btn-outline text-sm">标记已读</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加关闭事件
        panel.querySelector('.close-panel').addEventListener('click', () => {
            panel.remove();
        });

        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target) && !e.target.closest('header button')) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }
}

// 初始化主应用
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.mainApp) {
        window.mainApp.destroy();
    }
}); 