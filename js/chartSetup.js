/**
 * Chart.js 全局配置和图表设置
 */

// Chart.js 全局默认配置
Chart.defaults.font.family = "'Inter', 'Segoe UI', 'Roboto', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#9CA3AF';
Chart.defaults.backgroundColor = 'rgba(38, 87, 253, 0.1)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// 全局配置
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.9)';
Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor = '#D1D5DB';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = true;

// 响应式配置
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

/**
 * 图表主题配置
 */
const ChartThemes = {
    // 主色调配置
    colors: {
        primary: '#2657FD',
        secondary: '#64B5F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        gray: '#6B7280'
    },

    // 渐变色配置
    gradients: {
        primary: ['rgba(38, 87, 253, 0.8)', 'rgba(38, 87, 253, 0.1)'],
        secondary: ['rgba(100, 181, 246, 0.8)', 'rgba(100, 181, 246, 0.1)'],
        success: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.1)'],
        warning: ['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.1)'],
        error: ['rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.1)']
    },

    // 多色调色板
    palette: [
        '#2657FD', '#64B5F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
    ]
};

/**
 * 图表工具类
 */
class ChartUtils {
    /**
     * 创建渐变背景
     */
    static createGradient(ctx, colors, direction = 'vertical') {
        const gradient = direction === 'vertical' 
            ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
            : ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        return gradient;
    }

    /**
     * 获取响应式字体大小
     */
    static getResponsiveFontSize(baseSize = 12) {
        const width = window.innerWidth;
        if (width < 768) return Math.max(baseSize - 2, 10);
        if (width < 1024) return baseSize;
        return baseSize + 1;
    }

    /**
     * 格式化数值
     */
    static formatValue(value, type = 'number') {
        switch (type) {
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'currency':
                return `¥${value.toLocaleString()}`;
            case 'decimal':
                return value.toFixed(2);
            default:
                return value.toLocaleString();
        }
    }

    /**
     * 生成图表通用配置
     */
    static getBaseConfig(type = 'line') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        usePointStyle: true,
                        padding: 20,
                        color: '#D1D5DB',
                        font: {
                            size: this.getResponsiveFontSize(11)
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#D1D5DB',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label || '';
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = ChartUtils.formatValue(context.parsed.y);
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: this.getScalesConfig(type)
        };
    }

    /**
     * 获取坐标轴配置
     */
    static getScalesConfig(type) {
        const baseScale = {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
            },
            ticks: {
                color: '#9CA3AF',
                font: {
                    size: this.getResponsiveFontSize(10)
                }
            }
        };

        if (type === 'pie' || type === 'doughnut') {
            return {};
        }

        return {
            x: {
                ...baseScale,
                border: {
                    display: false
                }
            },
            y: {
                ...baseScale,
                border: {
                    display: false
                },
                beginAtZero: true
            }
        };
    }

    /**
     * 创建线性图表配置
     */
    static createLineChart(data, options = {}) {
        const config = this.getBaseConfig('line');
        
        return {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map((dataset, index) => ({
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: dataset.borderColor || ChartThemes.palette[index % ChartThemes.palette.length],
                    backgroundColor: dataset.backgroundColor || ChartThemes.gradients.primary[1],
                    borderWidth: 2,
                    fill: dataset.fill !== undefined ? dataset.fill : false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: dataset.borderColor || ChartThemes.palette[index % ChartThemes.palette.length],
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    ...dataset
                }))
            },
            options: {
                ...config,
                ...options
            }
        };
    }

    /**
     * 创建柱状图配置
     */
    static createBarChart(data, options = {}) {
        const config = this.getBaseConfig('bar');
        
        return {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: data.datasets.map((dataset, index) => ({
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: dataset.backgroundColor || ChartThemes.palette[index % ChartThemes.palette.length],
                    borderColor: dataset.borderColor || ChartThemes.palette[index % ChartThemes.palette.length],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    ...dataset
                }))
            },
            options: {
                ...config,
                ...options
            }
        };
    }

    /**
     * 创建饼图配置
     */
    static createPieChart(data, options = {}) {
        const config = this.getBaseConfig('pie');
        
        return {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.backgroundColor || ChartThemes.palette,
                    borderColor: '#000000',
                    borderWidth: 2,
                    hoverBorderWidth: 3,
                    ...data.dataset
                }]
            },
            options: {
                ...config,
                plugins: {
                    ...config.plugins,
                    legend: {
                        ...config.plugins.legend,
                        position: 'bottom'
                    }
                },
                ...options
            }
        };
    }

    /**
     * 创建环形图配置
     */
    static createDoughnutChart(data, options = {}) {
        const pieConfig = this.createPieChart(data, options);
        pieConfig.type = 'doughnut';
        
        // 添加中心文本插件
        if (data.centerText) {
            pieConfig.plugins = [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                    
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 24px Inter';
                    ctx.fillText(data.centerText.value, centerX, centerY - 10);
                    
                    ctx.fillStyle = '#9CA3AF';
                    ctx.font = '12px Inter';
                    ctx.fillText(data.centerText.label, centerX, centerY + 15);
                    ctx.restore();
                }
            }];
        }
        
        return pieConfig;
    }

    /**
     * 创建雷达图配置
     */
    static createRadarChart(data, options = {}) {
        return {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: data.datasets.map((dataset, index) => ({
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: dataset.borderColor || ChartThemes.palette[index % ChartThemes.palette.length],
                    backgroundColor: dataset.backgroundColor || ChartThemes.gradients.primary[1],
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    ...dataset
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#D1D5DB',
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#9CA3AF',
                            font: {
                                size: this.getResponsiveFontSize(10)
                            }
                        },
                        ticks: {
                            color: '#9CA3AF',
                            backdropColor: 'transparent'
                        }
                    }
                },
                ...options
            }
        };
    }

    /**
     * 更新图表主题
     */
    static updateChartTheme(chart, isDark = true) {
        const textColor = isDark ? '#D1D5DB' : '#374151';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        if (chart.options.plugins?.legend?.labels) {
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        if (chart.options.scales) {
            Object.keys(chart.options.scales).forEach(scaleKey => {
                const scale = chart.options.scales[scaleKey];
                if (scale.ticks) scale.ticks.color = textColor;
                if (scale.grid) scale.grid.color = gridColor;
            });
        }
        
        chart.update();
    }

    /**
     * 销毁图表实例
     */
    static destroyChart(chartInstance) {
        if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
        }
    }

    /**
     * 获取图表数据点击处理器
     */
    static getClickHandler(callback) {
        return function(event, elements) {
            if (elements.length > 0) {
                const element = elements[0];
                const datasetIndex = element.datasetIndex;
                const index = element.index;
                const chart = this;
                const data = chart.data.datasets[datasetIndex].data[index];
                const label = chart.data.labels[index];
                
                if (callback) {
                    callback({
                        datasetIndex,
                        index,
                        data,
                        label,
                        chart
                    });
                }
            }
        };
    }
}

/**
 * 图表管理器
 */
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.resizeObserver = null;
        this.init();
    }

    init() {
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 创建 ResizeObserver 监听容器大小变化
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const chartId = entry.target.dataset.chartId;
                    if (chartId && this.charts.has(chartId)) {
                        const chart = this.charts.get(chartId);
                        chart.resize();
                    }
                });
            });
        }
    }

    /**
     * 创建图表
     */
    createChart(canvasId, config, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas element with id "${canvasId}" not found`);
            return null;
        }

        // 销毁现有图表
        this.destroyChart(canvasId);

        // 创建新图表
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, config);
        
        // 存储图表实例
        this.charts.set(canvasId, chart);
        
        // 监听容器大小变化
        if (this.resizeObserver && canvas.parentElement) {
            canvas.parentElement.dataset.chartId = canvasId;
            this.resizeObserver.observe(canvas.parentElement);
        }

        return chart;
    }

    /**
     * 获取图表实例
     */
    getChart(canvasId) {
        return this.charts.get(canvasId);
    }

    /**
     * 销毁图表
     */
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    /**
     * 销毁所有图表
     */
    destroyAllCharts() {
        this.charts.forEach((chart, id) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    /**
     * 更新图表数据
     */
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }

    /**
     * 切换图表主题
     */
    toggleTheme(isDark = true) {
        this.charts.forEach(chart => {
            ChartUtils.updateChartTheme(chart, isDark);
        });
    }
}

// 创建全局图表管理器实例
window.chartManager = new ChartManager();
window.ChartUtils = ChartUtils;
window.ChartThemes = ChartThemes;

// 页面卸载时清理图表
window.addEventListener('beforeunload', () => {
    window.chartManager.destroyAllCharts();
}); 