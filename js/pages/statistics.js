/**
 * 统计分析页面模块 - 智能医疗监测系统
 */
const StatisticsPage = {
    charts: {},
    
    render() {
        return `
            <div class="statistics-container">
                <!-- 页面标题和工具栏 -->
                <div class="page-header mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-2">
                                <i class="fas fa-chart-bar text-primary mr-3"></i>智能医疗监测系统
                            </h2>
                            <p class="text-gray-400">实时数据分析与健康监测平台</p>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="realtime-indicator">
                                <div class="realtime-dot"></div>
                                <span>实时数据</span>
                            </div>
                            <button class="chart-export-btn">
                                <i class="fas fa-download mr-2"></i>导出报告
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 核心指标概览 -->
                <div class="stats-grid mb-8">
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">总患者数</div>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>+12.5%
                        </div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-user-md"></i>
                        </div>
                        <div class="stat-value">89</div>
                        <div class="stat-label">今日诊断</div>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>+8.3%
                        </div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="stat-value">96.8%</div>
                        <div class="stat-label">AI准确率</div>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>+0.2%
                        </div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-value">2.3s</div>
                        <div class="stat-label">平均处理时间</div>
                        <div class="stat-trend down">
                            <i class="fas fa-arrow-down"></i>-0.5s
                        </div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="stat-value">99.9%</div>
                        <div class="stat-label">系统可用性</div>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>+0.1%
                        </div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-value">156</div>
                        <div class="stat-label">异常病例</div>
                        <div class="stat-trend down">
                            <i class="fas fa-arrow-down"></i>-3.2%
                        </div>
                    </div>
                </div>

                <!-- 主要图表区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- 实时监控面板 -->
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-activity"></i>
                                <span>实时监控面板</span>
                            </div>
                            <div class="chart-period-selector">
                                <button class="period-btn active" data-period="1h">1小时</button>
                                <button class="period-btn" data-period="6h">6小时</button>
                                <button class="period-btn" data-period="24h">24小时</button>
                            </div>
                        </div>
                        <div class="chart-container large">
                            <canvas id="realtimeChart"></canvas>
                        </div>
                    </div>

                    <!-- 疾病分布分析 -->
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-chart-pie"></i>
                                <span>疾病分布分析</span>
                            </div>
                            <div class="chart-options">
                                <button class="chart-option-btn active">饼图</button>
                                <button class="chart-option-btn">环形图</button>
                            </div>
                        </div>
                        <div class="chart-container large">
                            <canvas id="diseaseChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 趋势分析和预测 -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    <!-- 月度趋势分析 -->
                    <div class="xl:col-span-2 card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-chart-line"></i>
                                <span>月度趋势分析</span>
                            </div>
                            <div class="chart-period-selector">
                                <button class="period-btn" data-period="3m">3个月</button>
                                <button class="period-btn active" data-period="6m">6个月</button>
                                <button class="period-btn" data-period="1y">1年</button>
                            </div>
                        </div>
                        <div class="chart-container large">
                            <canvas id="trendChart"></canvas>
                        </div>
                    </div>

                    <!-- 风险等级分布 -->
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-circle"></i>
                                <span>风险等级分布</span>
                            </div>
                        </div>
                        <div class="chart-container large">
                            <canvas id="riskChart"></canvas>
                        </div>
                        <div class="mt-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span class="text-sm text-gray-300">低风险</span>
                                </div>
                                <span class="text-sm font-medium text-white">78%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <span class="text-sm text-gray-300">中风险</span>
                                </div>
                                <span class="text-sm font-medium text-white">18%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <span class="text-sm text-gray-300">高风险</span>
                                </div>
                                <span class="text-sm font-medium text-white">4%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 详细分析面板 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- 年龄分布分析 -->
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-users"></i>
                                <span>年龄分布分析</span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="ageChart"></canvas>
                        </div>
                    </div>

                    <!-- 性别比例分析 -->
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <div class="flex items-center">
                                <i class="fas fa-venus-mars"></i>
                                <span>性别比例分析</span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="genderChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 地区分布热力图 -->
                <div class="col-span-12">
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-map-marked-alt text-primary mr-2"></i>地区分布热力图
                            </h3>
                        </div>
                        <div class="chart-container">
                            <div id="heatmapChart" class="w-full h-80">
                                <!-- 热力图内容将动态生成 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 详细统计表格 -->
                <div class="col-span-12">
                    <div class="card hover-lift">
                        <div class="chart-title">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-table text-primary mr-2"></i>详细统计数据
                            </h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-gray-800">
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">疾病类型</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">病例数量</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">占比</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">平均年龄</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">性别比例</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">风险等级</th>
                                    </tr>
                                </thead>
                                <tbody id="statisticsTable">
                                    <!-- 表格数据将动态生成 -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('智能医疗监测系统已加载');
        this.initCharts();
        this.initEventListeners();
        this.loadTableData();
        this.startRealTimeUpdates();
    },

    initCharts() {
        this.initRealtimeChart();
        this.initDiseaseChart();
        this.initTrendChart();
        this.initRiskChart();
        this.initAgeChart();
        this.initGenderChart();
        this.initHeatmapChart();
    },

    initRealtimeChart() {
        const ctx = document.getElementById('realtimeChart');
        if (!ctx) return;

        this.charts.realtime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(24),
                datasets: [{
                    label: '实时诊断数量',
                    data: this.generateRandomData(24, 0, 20),
                    borderColor: '#2657FD',
                    backgroundColor: 'rgba(38, 87, 253, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '异常检出',
                    data: this.generateRandomData(24, 0, 5),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: this.getChartOptions('实时监控数据')
        });
    },

    initDiseaseChart() {
        const ctx = document.getElementById('diseaseChart');
        if (!ctx) return;

        this.charts.disease = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['肺结节', '肺炎', '肺气肿', '肺癌', '其他'],
                datasets: [{
                    data: [35, 25, 15, 10, 15],
                    backgroundColor: [
                        '#2657FD',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9CA3AF',
                            padding: 20
                        }
                    }
                }
            }
        });
    },

    initTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    label: '总诊断数',
                    data: [120, 190, 300, 500, 200, 300],
                    borderColor: '#2657FD',
                    backgroundColor: 'rgba(38, 87, 253, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '异常病例',
                    data: [20, 30, 45, 75, 35, 50],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: this.getChartOptions('月度趋势')
        });
    },

    initRiskChart() {
        const ctx = document.getElementById('riskChart');
        if (!ctx) return;

        this.charts.risk = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['低风险', '中风险', '高风险'],
                datasets: [{
                    data: [78, 18, 4],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    },

    initAgeChart() {
        const ctx = document.getElementById('ageChart');
        if (!ctx) return;

        this.charts.age = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-20', '21-40', '41-60', '61-80', '80+'],
                datasets: [{
                    label: '患者数量',
                    data: [45, 189, 356, 298, 89],
                    backgroundColor: '#2657FD',
                    borderWidth: 0
                }]
            },
            options: this.getChartOptions('年龄分布')
        });
    },

    initGenderChart() {
        const ctx = document.getElementById('genderChart');
        if (!ctx) return;

        this.charts.gender = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['男性', '女性'],
                datasets: [{
                    data: [52, 48],
                    backgroundColor: ['#2657FD', '#EC4899'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9CA3AF',
                            padding: 20
                        }
                    }
                }
            }
        });
    },

    initHeatmapChart() {
        const container = document.getElementById('heatmapChart');
        if (!container) return;

        // 创建增强版热力图界面
        container.innerHTML = `
            <div class="heatmap-wrapper">
                <!-- 控制面板 -->
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-6">
                        <div class="text-sm text-gray-300 font-medium">全国病例分布热力图</div>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-40"></div>
                                <span class="text-xs text-gray-400">低密度</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 opacity-70"></div>
                                <span class="text-xs text-gray-400">中密度</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-blue-400"></div>
                                <span class="text-xs text-gray-400">高密度</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-400"></div>
                                <span class="text-xs text-gray-400">极高密度</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <select id="regionSelect" class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none">
                            <option value="china">全国视图</option>
                            <option value="north">华北地区</option>
                            <option value="south">华南地区</option>
                            <option value="east">华东地区</option>
                            <option value="west">华西地区</option>
                        </select>
                        <button id="refreshHeatmap" class="px-3 py-2 bg-primary bg-opacity-20 border border-primary rounded-lg text-primary text-sm hover:bg-opacity-30 transition-colors">
                            <i class="fas fa-sync-alt mr-1"></i>刷新
                        </button>
                    </div>
                </div>

                <!-- 热力图主体 -->
                <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <!-- 背景网格 -->
                    <div class="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                            <defs>
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2657FD" stroke-width="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>
                    
                    <!-- 热力图画布 -->
                    <canvas id="heatmapCanvas" class="w-full h-80 relative z-10"></canvas>
                    
                    <!-- 悬浮信息卡片 -->
                    <div id="heatmapTooltip" class="absolute hidden bg-gray-900 bg-opacity-95 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-sm text-white pointer-events-none z-20 shadow-xl">
                        <div class="tooltip-content"></div>
                    </div>
                    
                    <!-- 实时数据指示器 -->
                    <div class="absolute top-4 right-4 flex items-center space-x-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span class="text-xs text-gray-300">实时数据</span>
                    </div>
                </div>

                <!-- 详细统计信息 -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-primary" id="totalRegions">34</div>
                                <div class="text-sm text-gray-400">覆盖地区</div>
                            </div>
                            <div class="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-map text-primary"></i>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400">
                            <i class="fas fa-arrow-up mr-1"></i>+2 本月
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-green-400" id="activeRegions">28</div>
                                <div class="text-sm text-gray-400">活跃地区</div>
                            </div>
                            <div class="w-10 h-10 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-line text-green-400"></i>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400">
                            <i class="fas fa-arrow-up mr-1"></i>+5 本周
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-yellow-400" id="highRiskRegions">6</div>
                                <div class="text-sm text-gray-400">高风险地区</div>
                            </div>
                            <div class="w-10 h-10 bg-yellow-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-yellow-400">
                            <i class="fas fa-minus mr-1"></i>-1 本周
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-red-400" id="criticalRegions">2</div>
                                <div class="text-sm text-gray-400">重点关注</div>
                            </div>
                            <div class="w-10 h-10 bg-red-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-shield-alt text-red-400"></i>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-red-400">
                            <i class="fas fa-arrow-down mr-1"></i>-1 本月
                        </div>
                    </div>
                </div>

                <!-- 地区排行榜 -->
                <div class="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                    <h4 class="text-white font-medium mb-4 flex items-center">
                        <i class="fas fa-trophy text-primary mr-2"></i>
                        病例数量排行榜
                    </h4>
                    <div class="space-y-3" id="regionRanking">
                        <!-- 排行榜内容将动态生成 -->
                    </div>
                </div>
            </div>
        `;

        // 初始化画布和交互
        this.setupHeatmapCanvas();
        this.drawEnhancedHeatmap();
        this.initHeatmapEvents();
        this.updateRegionRanking();
    },

    setupHeatmapCanvas() {
        const canvas = document.getElementById('heatmapCanvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        
        this.heatmapCanvas = canvas;
        this.heatmapCtx = ctx;
    },

    drawEnhancedHeatmap() {
        if (!this.heatmapCtx) return;

        const ctx = this.heatmapCtx;
        const width = this.heatmapCanvas.width / 2;
        const height = this.heatmapCanvas.height / 2;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景渐变
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, 'rgba(38, 87, 253, 0.02)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // 绘制地图轮廓
        this.drawMapOutline(ctx, width, height);

        // 绘制增强热力点
        this.drawEnhancedHeatPoints(ctx, width, height);

        // 绘制连接线
        this.drawConnectionLines(ctx, width, height);
    },

    drawMapOutline(ctx, width, height) {
        // 绘制更精细的地图边界
        ctx.strokeStyle = 'rgba(38, 87, 253, 0.3)';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(38, 87, 253, 0.03)';

        // 主要轮廓
        ctx.beginPath();
        ctx.roundRect(width * 0.15, height * 0.15, width * 0.7, height * 0.7, 12);
        ctx.fill();
        ctx.stroke();

        // 省份分界线
        ctx.strokeStyle = 'rgba(38, 87, 253, 0.15)';
        ctx.lineWidth = 1;
        
        // 垂直分界线
        for (let i = 1; i <= 3; i++) {
            const x = width * (0.15 + (0.7 / 4) * i);
            ctx.beginPath();
            ctx.moveTo(x, height * 0.15);
            ctx.lineTo(x, height * 0.85);
            ctx.stroke();
        }

        // 水平分界线
        for (let i = 1; i <= 2; i++) {
            const y = height * (0.15 + (0.7 / 3) * i);
            ctx.beginPath();
            ctx.moveTo(width * 0.15, y);
            ctx.lineTo(width * 0.85, y);
            ctx.stroke();
        }
    },

    drawEnhancedHeatPoints(ctx, width, height) {
        // 增强的热力点数据
        const heatPoints = [
            { x: 0.35, y: 0.3, intensity: 0.9, region: '北京', cases: 456, trend: 'up', type: 'critical' },
            { x: 0.7, y: 0.4, intensity: 0.85, region: '上海', cases: 398, trend: 'up', type: 'high' },
            { x: 0.45, y: 0.7, intensity: 0.95, region: '广州', cases: 512, trend: 'up', type: 'critical' },
            { x: 0.55, y: 0.25, intensity: 0.6, region: '天津', cases: 234, trend: 'stable', type: 'medium' },
            { x: 0.25, y: 0.6, intensity: 0.75, region: '成都', cases: 345, trend: 'up', type: 'high' },
            { x: 0.75, y: 0.75, intensity: 0.7, region: '深圳', cases: 289, trend: 'down', type: 'high' },
            { x: 0.4, y: 0.8, intensity: 0.5, region: '武汉', cases: 198, trend: 'stable', type: 'medium' },
            { x: 0.65, y: 0.2, intensity: 0.65, region: '青岛', cases: 267, trend: 'up', type: 'medium' },
            { x: 0.3, y: 0.45, intensity: 0.55, region: '西安', cases: 223, trend: 'stable', type: 'medium' },
            { x: 0.6, y: 0.55, intensity: 0.8, region: '杭州', cases: 356, trend: 'up', type: 'high' }
        ];

        heatPoints.forEach((point, index) => {
            const x = point.x * width;
            const y = point.y * height;
            
            // 根据类型确定颜色
            let colors;
            switch (point.type) {
                case 'critical':
                    colors = {
                        primary: `rgba(239, 68, 68, ${point.intensity})`,
                        secondary: `rgba(239, 68, 68, ${point.intensity * 0.3})`,
                        glow: `rgba(239, 68, 68, ${point.intensity * 0.1})`
                    };
                    break;
                case 'high':
                    colors = {
                        primary: `rgba(38, 87, 253, ${point.intensity})`,
                        secondary: `rgba(38, 87, 253, ${point.intensity * 0.3})`,
                        glow: `rgba(38, 87, 253, ${point.intensity * 0.1})`
                    };
                    break;
                default:
                    colors = {
                        primary: `rgba(16, 185, 129, ${point.intensity * 0.8})`,
                        secondary: `rgba(16, 185, 129, ${point.intensity * 0.3})`,
                        glow: `rgba(16, 185, 129, ${point.intensity * 0.1})`
                    };
            }

            // 绘制外层光晕
            const glowRadius = 25 + point.intensity * 15;
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
            glowGradient.addColorStop(0, colors.glow);
            glowGradient.addColorStop(0.7, colors.glow);
            glowGradient.addColorStop(1, 'transparent');

            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            // 绘制主热力圈
            const radius = 12 + point.intensity * 8;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, colors.primary);
            gradient.addColorStop(0.6, colors.secondary);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            // 绘制中心点
            ctx.fillStyle = colors.primary.replace(/[\d\.]+\)$/, '1)');
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            // 绘制脉冲环（对于高强度点）
            if (point.intensity > 0.8) {
                const time = Date.now() * 0.003;
                const pulseRadius = 8 + Math.sin(time + index) * 3;
                ctx.strokeStyle = colors.primary.replace(/[\d\.]+\)$/, '0.6)');
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 绘制地区标签
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Inter';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(point.region, x, y - 20);
            ctx.shadowBlur = 0;

            // 绘制趋势指示器
            if (point.trend === 'up') {
                ctx.fillStyle = '#10B981';
                ctx.font = '10px FontAwesome';
                ctx.fillText('↗', x + 15, y - 10);
            } else if (point.trend === 'down') {
                ctx.fillStyle = '#EF4444';
                ctx.font = '10px FontAwesome';
                ctx.fillText('↘', x + 15, y - 10);
            }
        });

        // 保存数据用于交互
        this.heatmapData = heatPoints.map(point => ({
            ...point,
            x: point.x * width,
            y: point.y * height
        }));
    },

    drawConnectionLines(ctx, width, height) {
        if (!this.heatmapData || this.heatmapData.length < 2) return;

        // 绘制主要城市间的连接线
        const connections = [
            [0, 1], // 北京-上海
            [1, 2], // 上海-广州
            [0, 4], // 北京-成都
            [2, 5], // 广州-深圳
            [1, 9]  // 上海-杭州
        ];

        ctx.strokeStyle = 'rgba(38, 87, 253, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        connections.forEach(([from, to]) => {
            if (this.heatmapData[from] && this.heatmapData[to]) {
                const fromPoint = this.heatmapData[from];
                const toPoint = this.heatmapData[to];
                
                ctx.beginPath();
                ctx.moveTo(fromPoint.x, fromPoint.y);
                ctx.lineTo(toPoint.x, toPoint.y);
                ctx.stroke();
            }
        });

        ctx.setLineDash([]);
    },

    initHeatmapEvents() {
        const canvas = document.getElementById('heatmapCanvas');
        const tooltip = document.getElementById('heatmapTooltip');
        const regionSelect = document.getElementById('regionSelect');
        const refreshBtn = document.getElementById('refreshHeatmap');

        if (!canvas || !tooltip) return;

        // 鼠标悬停事件
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const hoveredPoint = this.findNearestPoint(x, y);
            
            if (hoveredPoint) {
                const trendIcon = hoveredPoint.trend === 'up' ? '↗' : hoveredPoint.trend === 'down' ? '↘' : '→';
                const trendColor = hoveredPoint.trend === 'up' ? 'text-green-400' : hoveredPoint.trend === 'down' ? 'text-red-400' : 'text-gray-400';
                
                tooltip.querySelector('.tooltip-content').innerHTML = `
                    <div class="font-semibold text-white mb-2">${hoveredPoint.region}</div>
                    <div class="space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-300">病例数:</span>
                            <span class="text-white font-medium">${hoveredPoint.cases}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-300">密度:</span>
                            <span class="text-white font-medium">${(hoveredPoint.intensity * 100).toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-300">趋势:</span>
                            <span class="${trendColor} font-medium">${trendIcon}</span>
                        </div>
                    </div>
                `;
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY - 10) + 'px';
                tooltip.classList.remove('hidden');
                canvas.style.cursor = 'pointer';
            } else {
                tooltip.classList.add('hidden');
                canvas.style.cursor = 'default';
            }
        });

        canvas.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
            canvas.style.cursor = 'default';
        });

        // 点击事件
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedPoint = this.findNearestPoint(x, y);
            if (clickedPoint) {
                this.showRegionDetails(clickedPoint);
            }
        });

        // 地区选择事件
        if (regionSelect) {
            regionSelect.addEventListener('change', () => {
                this.drawEnhancedHeatmap();
                this.updateRegionRanking();
            });
        }

        // 刷新按钮
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshHeatmapData();
            });
        }

        // 启动动画循环
        this.startHeatmapAnimation();
    },

    updateRegionRanking() {
        const rankingContainer = document.getElementById('regionRanking');
        if (!rankingContainer || !this.heatmapData) return;

        const sortedData = [...this.heatmapData].sort((a, b) => b.cases - a.cases);
        
        rankingContainer.innerHTML = sortedData.slice(0, 5).map((region, index) => {
            const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400', 'text-gray-400', 'text-gray-500'];
            const rankIcons = ['👑', '🥈', '🥉', '4️⃣', '5️⃣'];
            
            return `
                <div class="flex items-center justify-between p-3 bg-gray-800 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors">
                    <div class="flex items-center space-x-3">
                        <span class="text-lg">${rankIcons[index]}</span>
                        <div>
                            <div class="font-medium text-white">${region.region}</div>
                            <div class="text-xs text-gray-400">密度: ${(region.intensity * 100).toFixed(1)}%</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold ${rankColors[index]}">${region.cases}</div>
                        <div class="text-xs text-gray-400">病例</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    showRegionDetails(region) {
        this.showToast(`查看${region.region}详细信息`, 'info');
        // 这里可以扩展显示详细的地区信息模态框
    },

    refreshHeatmapData() {
        // 模拟数据刷新
        if (this.heatmapData) {
            this.heatmapData.forEach(point => {
                point.cases += Math.floor(Math.random() * 20) - 10;
                point.intensity = Math.min(1, Math.max(0.3, point.intensity + (Math.random() - 0.5) * 0.2));
            });
        }
        
        this.drawEnhancedHeatmap();
        this.updateRegionRanking();
        this.showToast('热力图数据已刷新', 'success');
    },

    startHeatmapAnimation() {
        const animate = () => {
            if (document.getElementById('heatmapCanvas')) {
                this.drawEnhancedHeatmap();
                setTimeout(() => requestAnimationFrame(animate), 2000); // 每2秒更新一次
            }
        };
        animate();
    },

    findNearestPoint(x, y) {
        if (!this.heatmapData) return null;

        return this.heatmapData.find(point => {
            const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
            return distance < 25; // 增加点击/悬停范围
        });
    },

    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#9CA3AF'
                    }
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                }
            }
        };
    },

    generateTimeLabels(hours) {
        const labels = [];
        const now = new Date();
        for (let i = hours - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.getHours() + ':00');
        }
        return labels;
    },

    generateRandomData(length, min, max) {
        return Array.from({ length }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    },

    initEventListeners() {
        // 时间段选择器
        document.addEventListener('click', (e) => {
            if (e.target.matches('.period-btn')) {
                const container = e.target.closest('.chart-title');
                container.querySelectorAll('.period-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateChartData(e.target.dataset.period);
            }
        });

        // 图表选项切换
        document.addEventListener('click', (e) => {
            if (e.target.matches('.chart-option-btn')) {
                const container = e.target.closest('.chart-title');
                container.querySelectorAll('.chart-option-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                e.target.classList.add('active');
            }
        });
    },

    updateChartData(period) {
        // 根据选择的时间段更新图表数据
        console.log('更新图表数据:', period);
    },

    loadTableData() {
        const tableData = [
            { disease: '肺结节', count: 89, rate: '7.2%', age: '52岁', ratio: '3:2', risk: '中风险' },
            { disease: '肺炎', count: 45, rate: '3.6%', age: '38岁', ratio: '1:1', risk: '低风险' },
            { disease: '肺气肿', count: 22, rate: '1.8%', age: '65岁', ratio: '4:1', risk: '高风险' },
            { disease: '肺癌', count: 12, rate: '1.0%', age: '58岁', ratio: '2:1', risk: '高风险' },
            { disease: '胸腔积液', count: 18, rate: '1.5%', age: '45岁', ratio: '1:2', risk: '中风险' }
        ];

        const tbody = document.getElementById('statisticsTable');
        if (!tbody) return;

        tbody.innerHTML = tableData.map(row => `
            <tr class="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td class="py-3 px-4 text-white">${row.disease}</td>
                <td class="py-3 px-4 text-white">${row.count}</td>
                <td class="py-3 px-4 text-white">${row.rate}</td>
                <td class="py-3 px-4 text-white">${row.age}</td>
                <td class="py-3 px-4 text-white">${row.ratio}</td>
                <td class="py-3 px-4">
                    <span class="badge ${this.getRiskBadgeClass(row.risk)}">${row.risk}</span>
                </td>
            </tr>
        `).join('');
    },

    getRiskBadgeClass(risk) {
        const classes = {
            '低风险': 'badge-success',
            '中风险': 'badge-warning',
            '高风险': 'badge-error'
        };
        return classes[risk] || 'badge-info';
    },

    startRealTimeUpdates() {
        // 模拟实时数据更新
        setInterval(() => {
            if (this.charts.realtime) {
                const chart = this.charts.realtime;
                const newData = Math.floor(Math.random() * 20);
                chart.data.datasets[0].data.shift();
                chart.data.datasets[0].data.push(newData);
                chart.update('none');
            }
        }, 5000);
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

window.StatisticsPage = StatisticsPage; 