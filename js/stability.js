/**
 * 页面稳定性管理器
 * 防止意外刷新、优化性能、处理错误等
 */
class StabilityManager {
    constructor() {
        this.isInitialized = false;
        this.errorCount = 0;
        this.maxErrors = 10;
        this.autoSaveInterval = null;
        this.isInternalNavigation = false; // 跟踪是否为内部导航
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTime: 0,
            errorRate: 0,
            memoryUsage: 0
        };
        this.init();
    }

    init() {
        this.preventAccidentalRefresh();
        this.setupErrorHandling();
        this.setupPerformanceMonitoring();
        this.setupAutoSave();
        this.optimizeAnimations();
        this.preventMemoryLeaks();
        this.setupHealthCheck();
        
        this.isInitialized = true;
        console.log('🛡️ 页面稳定性管理器已启动');
    }

    // 防止意外刷新
    preventAccidentalRefresh() {
        // 防止意外的F5刷新
        document.addEventListener('keydown', (e) => {
            // 阻止F5键
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                this.showRefreshWarning();
                return false;
            }
            
            // 阻止Ctrl+Shift+R (强制刷新)
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.showRefreshWarning();
                return false;
            }
        });

        // 防止意外导航离开 - 但不阻止正常的单页面导航
        window.addEventListener('beforeunload', (e) => {
            // 只有在真正有未保存数据时才阻止
            if (this.hasUnsavedData() && !this.isInternalNavigation) {
                e.preventDefault();
                e.returnValue = '您有未保存的数据，确定要离开吗？';
                return '您有未保存的数据，确定要离开吗？';
            }
        });

        // 优化后退按钮处理 - 减少干预
        window.addEventListener('popstate', (e) => {
            // 只在有关键未保存数据时才干预
            if (this.hasUnsavedData() && this.shouldPreventNavigation()) {
                // 给用户选择的机会，而不是强制阻止
                const shouldStay = confirm('您有未保存的数据，确定要离开当前页面吗？');
                if (!shouldStay) {
                    history.pushState(null, null, location.href);
                    this.showNavigationWarning();
                }
            }
        });

        // 减少历史状态干预
        // history.pushState(null, null, location.href);
    }

    showRefreshWarning() {
        if (window.toastManager) {
            window.toastManager.show(
                '刷新可能会丢失当前数据，请使用侧边栏导航', 
                'warning',
                3000
            );
        }
    }

    showNavigationWarning() {
        if (window.toastManager) {
            window.toastManager.show(
                '请使用应用内导航，避免数据丢失', 
                'info',
                2000
            );
        }
    }

    hasUnsavedData() {
        // 检查表单数据、编辑状态等
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                if (value && value.toString().trim()) {
                    return true;
                }
            }
        }

        // 检查 localStorage 中的草稿数据
        const draftKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('draft_') || key.startsWith('temp_')
        );
        return draftKeys.length > 0;
    }

    shouldPreventNavigation() {
        // 检查当前是否在重要操作中
        return this.hasUnsavedData() || 
               document.querySelector('.loading') !== null ||
               document.querySelector('.uploading') !== null;
    }

    // 错误处理设置
    setupErrorHandling() {
        // 全局JavaScript错误捕获
        window.addEventListener('error', (e) => {
            this.handleError('JavaScript Error', e.error, e.filename, e.lineno);
        });

        // Promise 拒绝捕获
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Promise Rejection', e.reason);
            e.preventDefault();
        });

        // 资源加载错误捕获
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.handleResourceError(e.target);
            }
        }, true);

        // 网络错误监控
        this.monitorNetworkErrors();
    }

    handleError(type, error, filename = '', lineno = 0) {
        this.errorCount++;
        
        const errorInfo = {
            type,
            message: error?.message || error?.toString() || 'Unknown error',
            filename,
            lineno,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error(`[${type}]`, errorInfo);

        // 错误率过高时采取措施
        if (this.errorCount > this.maxErrors) {
            this.enterSafeMode();
        }

        // 显示用户友好的错误提示
        this.showUserFriendlyError(type, errorInfo.message);

        // 记录错误到本地存储（用于调试）
        this.logErrorToStorage(errorInfo);
    }

    handleResourceError(element) {
        const resourceType = element.tagName.toLowerCase();
        const src = element.src || element.href;
        
        console.warn(`资源加载失败: ${resourceType} - ${src}`);
        
        // 只对非关键的CSS文件进行重试，避免脚本重新加载导致状态重置
        if (resourceType === 'link' && element.rel === 'stylesheet') {
            this.retryResourceLoad(element);
        } else if (resourceType === 'script') {
            // 对于脚本文件，不进行自动重试，只记录错误
            console.error(`关键脚本加载失败，请检查网络连接: ${src}`);
            
            // 显示用户友好的错误提示
            if (window.toastManager) {
                window.toastManager.show(
                    '部分功能可能无法正常使用，请刷新页面重试', 
                    'error',
                    5000
                );
            }
        }
    }

    retryResourceLoad(element, maxRetries = 2) {
        const retryCount = parseInt(element.dataset.retryCount || '0');
        
        if (retryCount < maxRetries) {
            setTimeout(() => {
                element.dataset.retryCount = (retryCount + 1).toString();
                
                // 只对CSS文件进行重试
                if (element.tagName.toLowerCase() === 'link' && element.rel === 'stylesheet') {
                    // 添加缓存破坏参数
                    const originalHref = element.href.split('?')[0];
                    element.href = originalHref + '?retry=' + Date.now();
                    console.log(`正在重试CSS加载: ${element.href}`);
                }
            }, 2000 * (retryCount + 1)); // 增加重试间隔
        } else {
            console.error(`资源加载重试失败，超过最大重试次数: ${element.src || element.href}`);
        }
    }

    monitorNetworkErrors() {
        // 简化网络监控，减少干预
        
        // 监控在线状态
        window.addEventListener('online', () => {
            if (window.toastManager) {
                window.toastManager.show('网络连接已恢复', 'success', 2000);
            }
        });

        window.addEventListener('offline', () => {
            if (window.toastManager) {
                window.toastManager.show('网络连接已断开，请检查网络设置', 'warning', 5000);
            }
        });
        
        // 不再全局拦截fetch请求，避免影响正常功能
        console.log('📡 网络状态监控已启动');
    }

    showUserFriendlyError(type, message) {
        if (!window.toastManager) return;

        let userMessage = '系统遇到了一个小问题';
        
        if (message.includes('network') || message.includes('fetch')) {
            userMessage = '网络请求失败，请稍后重试';
        } else if (message.includes('permission')) {
            userMessage = '权限不足，请联系管理员';
        } else if (message.includes('syntax') || message.includes('parse')) {
            userMessage = '数据格式错误，请刷新页面重试';
        }

        window.toastManager.show(userMessage, 'error', 5000);
    }

    logErrorToStorage(errorInfo) {
        try {
            const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
            errors.push(errorInfo);
            
            // 只保留最近50个错误
            if (errors.length > 50) {
                errors.splice(0, errors.length - 50);
            }
            
            localStorage.setItem('app_errors', JSON.stringify(errors));
        } catch (e) {
            console.warn('无法记录错误到本地存储:', e);
        }
    }

    enterSafeMode() {
        console.warn('进入安全模式 - 错误过多');
        
        // 停止所有动画
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });

        // 停止背景效果
        if (window.backgroundEffects) {
            window.backgroundEffects.pause();
        }

        if (window.particleSystem) {
            window.particleSystem.stopAnimation();
        }

        if (window.toastManager) {
            window.toastManager.show(
                '系统进入安全模式，已禁用部分特效以保证稳定性', 
                'warning', 
                8000
            );
        }
    }

    // 性能监控
    setupPerformanceMonitoring() {
        // 页面加载完成时记录性能指标
        window.addEventListener('load', () => {
            this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
            console.log(`📊 页面加载时间: ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
        });

        // 定期检查内存使用
        if ('memory' in performance) {
            setInterval(() => {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
                this.checkMemoryUsage();
            }, 30000); // 每30秒检查一次
        }

        // 监控长任务
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // 超过50ms的任务
                        console.warn(`长任务检测: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    checkMemoryUsage() {
        if (!performance.memory) return;

        const used = performance.memory.usedJSHeapSize;
        const limit = performance.memory.jsHeapSizeLimit;
        const usage = (used / limit) * 100;

        if (usage > 80) {
            console.warn(`内存使用率过高: ${usage.toFixed(2)}%`);
            this.triggerGarbageCollection();
        }
    }

    triggerGarbageCollection() {
        // 清理不必要的数据
        this.cleanupUnusedData();
        
        // 强制垃圾回收（如果支持）
        if (window.gc) {
            window.gc();
        }
    }

    cleanupUnusedData() {
        // 清理过期的本地存储数据
        const now = Date.now();
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('temp_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.expiry && now > data.expiry) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // 清理无效数据
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // 自动保存设置
    setupAutoSave() {
        // 增加自动保存间隔，减少频繁操作
        this.autoSaveInterval = setInterval(() => {
            this.autoSaveData();
        }, 120000); // 改为每2分钟自动保存一次
    }

    autoSaveData() {
        try {
            // 只保存标记为需要自动保存的表单
            const forms = document.querySelectorAll('form[data-autosave]');
            if (forms.length === 0) {
                return; // 没有需要保存的表单时直接返回
            }
            
            forms.forEach(form => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // 检查是否有实际数据需要保存
                const hasData = Object.values(data).some(value => 
                    value && value.toString().trim() !== ''
                );
                
                if (hasData) {
                    const key = `autosave_${form.id || 'form'}_${Date.now()}`;
                    
                    localStorage.setItem(key, JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
                    }));
                }
            });

            // 轻量级的应用状态保存
            if (window.sidebarManager && typeof window.sidebarManager.getCurrentState === 'function') {
                const state = window.sidebarManager.getCurrentState();
                if (state) {
                    localStorage.setItem('app_state', JSON.stringify(state));
                }
            }
        } catch (e) {
            console.warn('自动保存失败:', e);
            // 不显示错误提示，避免打扰用户
        }
    }

    // 动画优化
    optimizeAnimations() {
        // 检查用户偏好
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }

        // 监听偏好变化
        prefersReducedMotion.addListener(() => {
            if (prefersReducedMotion.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });

        // 页面不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    disableAnimations() {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('--transition-duration', '0s');
    }

    enableAnimations() {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('--transition-duration');
    }

    pauseAnimations() {
        if (window.backgroundEffects) {
            window.backgroundEffects.pause();
        }
        if (window.particleSystem) {
            window.particleSystem.stopAnimation();
        }
    }

    resumeAnimations() {
        if (window.backgroundEffects) {
            window.backgroundEffects.resume();
        }
        if (window.particleSystem) {
            window.particleSystem.startAnimation();
        }
    }

    // 防止内存泄漏
    preventMemoryLeaks() {
        // 定期清理事件监听器
        setInterval(() => {
            this.cleanupEventListeners();
        }, 60000); // 每分钟清理一次

        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanupEventListeners() {
        // 移除孤立的事件监听器
        const elements = document.querySelectorAll('[data-cleanup]');
        elements.forEach(el => {
            if (!el.parentNode) {
                // 元素已从DOM中移除，但可能仍有事件监听器
                el.remove();
            }
        });
    }

    // 健康检查
    setupHealthCheck() {
        // 减少检查频率，避免过度干预
        setInterval(() => {
            this.performHealthCheck();
        }, 300000); // 改为每5分钟检查一次
    }

    performHealthCheck() {
        const issues = [];

        // 提高错误率阈值
        if (this.errorCount > 15) {
            issues.push('错误率过高');
        }

        // 提高内存阈值
        if (performance.memory && performance.memory.usedJSHeapSize > 200 * 1024 * 1024) {
            issues.push('内存使用量较高');
        }

        // 提高DOM节点阈值
        const nodeCount = document.querySelectorAll('*').length;
        if (nodeCount > 5000) {
            issues.push('DOM节点过多');
        }

        // 提高存储阈值
        const storageUsage = JSON.stringify(localStorage).length;
        if (storageUsage > 8 * 1024 * 1024) { // 8MB
            issues.push('本地存储使用过多');
        }

        if (issues.length > 2) { // 只有在多个问题同时出现时才干预
            console.warn('健康检查发现多个问题:', issues);
            this.optimizePerformance();
        }
    }

    optimizePerformance() {
        // 清理本地存储
        this.cleanupUnusedData();
        
        // 减少动画强度
        if (window.backgroundEffects) {
            window.backgroundEffects.reduceIntensity();
        }
        
        // 优化图片加载
        this.optimizeImages();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    // 清理方法
    cleanup() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // 清理其他组件
        if (window.backgroundEffects) {
            window.backgroundEffects.destroy();
        }
        
        if (window.particleSystem) {
            window.particleSystem.destroy();
        }
        
        if (window.sidebarManager) {
            window.sidebarManager.destroy();
        }

        console.log('🛡️ 页面稳定性管理器已清理');
    }

    // 公共API
    getErrorLog() {
        return JSON.parse(localStorage.getItem('app_errors') || '[]');
    }

    clearErrorLog() {
        localStorage.removeItem('app_errors');
        this.errorCount = 0;
    }

    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    forceOptimization() {
        this.optimizePerformance();
        if (window.toastManager) {
            window.toastManager.show('性能优化已执行', 'success');
        }
    }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
    window.stabilityManager = new StabilityManager();
    
    // 添加性能优化CSS
    const style = document.createElement('style');
    style.textContent = `
        /* 性能优化样式 */
        * {
            transform: translateZ(0);
            backface-visibility: hidden;
        }
        
        img {
            loading: lazy;
        }
        
        .performance-mode * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
        
        .safe-mode * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
});

// 导出
if (typeof window !== 'undefined') {
    window.StabilityManager = StabilityManager;
} 