/**
 * 动画管理器 - 优化版本
 */
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.pageLoadAnimations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPageLoadAnimations();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.initializePageEntryAnimation();
    }

    /**
     * 页面入场动画
     */
    initializePageEntryAnimation() {
        // 页面加载时的整体动画序列
        const timeline = [
            { selector: '.bento-dashboard', delay: 0, duration: 800 },
            { selector: '.bento-item:nth-child(1)', delay: 100, duration: 600 },
            { selector: '.bento-item:nth-child(2)', delay: 200, duration: 600 },
            { selector: '.bento-item:nth-child(3)', delay: 300, duration: 600 },
            { selector: '.bento-item:nth-child(4)', delay: 400, duration: 600 },
            { selector: '.bento-item:nth-child(5)', delay: 500, duration: 600 },
            { selector: '.bento-item:nth-child(6)', delay: 600, duration: 600 },
            { selector: '.bento-item:nth-child(7)', delay: 700, duration: 600 },
            { selector: '.bento-item:nth-child(8)', delay: 800, duration: 600 }
        ];

        this.executeTimeline(timeline);
    }

    /**
     * 执行动画时间线
     */
    executeTimeline(timeline) {
        timeline.forEach(({ selector, delay, duration }) => {
            setTimeout(() => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    this.animateElementEntry(element, duration);
                });
            }, delay);
        });
    }

    /**
     * 元素入场动画
     */
    animateElementEntry(element, duration = 600) {
        if (!element) return;

        // 重置元素状态
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) scale(0.95)';
        element.style.filter = 'blur(5px)';
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        // 触发动画
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.style.filter = 'blur(0px)';
        });

        // 添加完成回调
        setTimeout(() => {
            element.style.transition = '';
            this.addInteractiveEffects(element);
        }, duration);
    }

    /**
     * 添加交互效果
     */
    addInteractiveEffects(element) {
        if (element.classList.contains('bento-item')) {
            this.addBentoItemEffects(element);
        }
        
        if (element.classList.contains('quick-action-btn')) {
            this.addButtonEffects(element);
        }

        if (element.classList.contains('metric-card')) {
            this.addMetricCardEffects(element);
        }
    }

    /**
     * Bento项目交互效果
     */
    addBentoItemEffects(element) {
        let hoverTimeout;

        element.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            this.animateBentoHover(element, true);
        });

        element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                this.animateBentoHover(element, false);
            }, 100);
        });

        // 添加点击波纹效果
        element.addEventListener('click', (e) => {
            this.createRippleEffect(e, element);
        });
    }

    /**
     * Bento悬停动画
     */
    animateBentoHover(element, isHover) {
        const duration = 400;
        const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

        if (isHover) {
            element.style.transition = `all ${duration}ms ${easing}`;
            element.style.transform = 'translateY(-8px) scale(1.02)';
            element.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(38, 87, 253, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
            element.style.borderColor = 'rgba(38, 87, 253, 0.3)';

            // 添加内部元素动画
            this.animateInnerElements(element, true);
        } else {
            element.style.transform = 'translateY(0) scale(1)';
            element.style.boxShadow = 'none';
            element.style.borderColor = 'rgba(255, 255, 255, 0.1)';

            this.animateInnerElements(element, false);
        }
    }

    /**
     * 内部元素动画
     */
    animateInnerElements(container, isHover) {
        const icons = container.querySelectorAll('i');
        const titles = container.querySelectorAll('.bento-title');
        const metrics = container.querySelectorAll('.metric-value, .ai-efficiency');

        icons.forEach(icon => {
            if (isHover) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.textShadow = '0 0 15px rgba(38, 87, 253, 0.6)';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.textShadow = '0 0 10px rgba(38, 87, 253, 0.3)';
            }
        });

        titles.forEach(title => {
            if (isHover) {
                title.style.transform = 'translateX(5px)';
            } else {
                title.style.transform = 'translateX(0)';
            }
        });

        metrics.forEach(metric => {
            if (isHover) {
                metric.style.transform = 'scale(1.05)';
                metric.style.textShadow = '0 0 15px rgba(38, 87, 253, 0.5)';
            } else {
                metric.style.transform = 'scale(1)';
                metric.style.textShadow = '0 0 10px rgba(38, 87, 253, 0.3)';
            }
        });
    }

    /**
     * 按钮交互效果
     */
    addButtonEffects(button) {
        button.addEventListener('mouseenter', () => {
            this.animateButton(button, true);
        });

        button.addEventListener('mouseleave', () => {
            this.animateButton(button, false);
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(-2px) scale(0.98)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-4px) scale(1)';
        });
    }

    /**
     * 按钮动画
     */
    animateButton(button, isHover) {
        const icon = button.querySelector('.action-icon');
        
        if (isHover) {
            button.style.transform = 'translateY(-4px)';
            button.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 5px 15px rgba(38, 87, 253, 0.4)';
            }
        } else {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = 'none';
            }
        }
    }

    /**
     * 指标卡片效果
     */
    addMetricCardEffects(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.background = 'rgba(0, 0, 0, 0.6)';
            card.style.borderColor = 'rgba(38, 87, 253, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.background = 'rgba(0, 0, 0, 0.4)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    }

    /**
     * 创建波纹效果
     */
    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(38, 87, 253, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms ease-out;
            pointer-events: none;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * 设置滚动动画
     */
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll-animation]');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.dataset.scrollAnimation;
                    this.executeScrollAnimation(entry.target, animationType);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }

    /**
     * 执行滚动动画
     */
    executeScrollAnimation(element, type) {
        switch (type) {
            case 'fadeInUp':
                this.animateElementEntry(element);
                break;
            case 'slideInLeft':
                this.slideInLeft(element);
                break;
            case 'slideInRight':
                this.slideInRight(element);
                break;
            case 'zoomIn':
                this.zoomIn(element);
                break;
        }
    }

    /**
     * 左滑入动画
     */
    slideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * 右滑入动画
     */
    slideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * 缩放入场动画
     */
    zoomIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    /**
     * 页面切换动画
     */
    animatePageTransition(fromPage, toPage, callback) {
        const duration = 500;
        
        // 退出动画
        if (fromPage) {
            fromPage.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            fromPage.style.opacity = '0';
            fromPage.style.transform = 'translateY(-20px) scale(0.98)';
            fromPage.style.filter = 'blur(5px)';
        }

        setTimeout(() => {
            if (callback) callback();
            
            // 入场动画
            if (toPage) {
                toPage.style.opacity = '0';
                toPage.style.transform = 'translateY(20px) scale(0.98)';
                toPage.style.filter = 'blur(5px)';
                toPage.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

                requestAnimationFrame(() => {
                    toPage.style.opacity = '1';
                    toPage.style.transform = 'translateY(0) scale(1)';
                    toPage.style.filter = 'blur(0px)';
                });

                // 重新初始化页面动画
                setTimeout(() => {
                    this.initializePageContent(toPage);
                }, duration);
            }
        }, duration / 2);
    }

    /**
     * 初始化页面内容动画
     */
    initializePageContent(container) {
        const elements = container.querySelectorAll('.bento-item, .card, .stat-card');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElementEntry(element, 400);
            }, index * 100);
        });
    }

    /**
     * 数据更新动画
     */
    animateDataUpdate(element, newValue, options = {}) {
        const {
            duration = 800,
            easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
            format = (val) => val
        } = options;

        if (!element) return;

        const currentValue = parseFloat(element.textContent) || 0;
        const targetValue = parseFloat(newValue) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easedProgress = this.easeOutCubic(progress);
            const currentDisplayValue = currentValue + (targetValue - currentValue) * easedProgress;
            
            element.textContent = format(currentDisplayValue);
            
            // 添加闪烁效果
            if (progress < 1) {
                element.style.textShadow = `0 0 ${10 + Math.sin(progress * Math.PI * 4) * 5}px rgba(38, 87, 253, 0.6)`;
                requestAnimationFrame(animate);
            } else {
                element.style.textShadow = '0 0 10px rgba(38, 87, 253, 0.3)';
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * 缓动函数
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * 通知动画
     */
    animateNotification(notification, type = 'slideIn') {
        switch (type) {
            case 'slideIn':
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                notification.style.transition = 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    notification.style.transform = 'translateX(0)';
                    notification.style.opacity = '1';
                });
                break;
                
            case 'slideOut':
                notification.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                break;
        }
    }

    /**
     * 图表动画
     */
    animateChart(chartElement, animationType = 'fadeIn') {
        if (!chartElement) return;

        switch (animationType) {
            case 'fadeIn':
                chartElement.style.opacity = '0';
                chartElement.style.transform = 'scale(0.9)';
                chartElement.style.transition = 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    chartElement.style.opacity = '1';
                    chartElement.style.transform = 'scale(1)';
                });
                break;
                
            case 'slideUp':
                chartElement.style.opacity = '0';
                chartElement.style.transform = 'translateY(30px)';
                chartElement.style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    chartElement.style.opacity = '1';
                    chartElement.style.transform = 'translateY(0)';
                });
                break;
        }
    }

    /**
     * 加载动画
     */
    showLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'loading-animation';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <div class="loading-text">加载中...</div>
        `;
        
        container.appendChild(loader);
        
        // 动画入场
        requestAnimationFrame(() => {
            loader.style.opacity = '1';
        });
        
        return loader;
    }

    /**
     * 隐藏加载动画
     */
    hideLoadingAnimation(loader) {
        if (!loader) return;
        
        loader.style.transition = 'all 300ms ease-out';
        loader.style.opacity = '0';
        loader.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            loader.remove();
        }, 300);
    }

    /**
     * Toast通知动画
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // 入场动画
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        
        requestAnimationFrame(() => {
            toast.style.transition = 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)';
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        // 自动隐藏
        const hideTimeout = setTimeout(() => {
            this.hideToast(toast);
        }, duration);

        // 手动关闭
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideToast(toast);
        });

        return toast;
    }

    /**
     * 隐藏Toast
     */
    hideToast(toast) {
        toast.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    /**
     * 获取Toast图标
     */
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * 设置悬停动画
     */
    setupHoverAnimations() {
        // 为所有可交互元素添加悬停效果
        const interactiveElements = document.querySelectorAll('button, .nav-link, .card, .bento-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverGlow(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeHoverGlow(element);
            });
        });
    }

    /**
     * 添加悬停发光效果
     */
    addHoverGlow(element) {
        element.style.transition = 'all 300ms ease-out';
        element.style.filter = 'brightness(1.1) drop-shadow(0 0 10px rgba(38, 87, 253, 0.3))';
    }

    /**
     * 移除悬停发光效果
     */
    removeHoverGlow(element) {
        element.style.filter = 'brightness(1) drop-shadow(none)';
    }

    /**
     * 清理动画
     */
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animationQueue = [];
    }
}

// 添加动画相关的CSS样式
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* 波纹动画 */
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    /* 加载动画 */
    .loading-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        text-align: center;
        opacity: 0;
        transition: opacity 300ms ease-out;
    }

    .loading-spinner {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
    }

    .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top: 3px solid #2657FD;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .spinner-ring:nth-child(2) {
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
        border-top-color: #64B5F6;
        animation-duration: 1.5s;
        animation-direction: reverse;
    }

    .spinner-ring:nth-child(3) {
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        border-top-color: #10B981;
        animation-duration: 2s;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text {
        color: #ffffff;
        font-size: 1rem;
        font-weight: 500;
    }

    /* Toast样式 */
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        min-width: 300px;
        max-width: 500px;
    }

    .toast-success {
        border-left: 4px solid #10B981;
    }

    .toast-error {
        border-left: 4px solid #EF4444;
    }

    .toast-warning {
        border-left: 4px solid #F59E0B;
    }

    .toast-info {
        border-left: 4px solid #3B82F6;
    }

    .toast-icon {
        font-size: 1.25rem;
    }

    .toast-success .toast-icon {
        color: #10B981;
    }

    .toast-error .toast-icon {
        color: #EF4444;
    }

    .toast-warning .toast-icon {
        color: #F59E0B;
    }

    .toast-info .toast-icon {
        color: #3B82F6;
    }

    .toast-message {
        flex: 1;
        color: #ffffff;
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .toast-close {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 200ms ease;
    }

    .toast-close:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
    }

    /* 平滑过渡 */
    * {
        transition-property: transform, opacity, filter, box-shadow, border-color, background-color, color;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 减少动画对性能的影响 */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(animationStyles);

// 创建全局动画管理器实例
window.animationManager = new AnimationManager();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.animationManager) {
        window.animationManager.cleanup();
    }
}); 