/**
 * Apple风格滚动动效系统
 * 包含视差滚动、交集观察器、滚动触发动画等
 */

class AppleScrollAnimations {
    constructor() {
        this.scrollY = 0;
        this.lastScrollY = 0;
        this.ticking = false;
        this.observers = new Map();
        this.parallaxElements = [];
        this.animatedElements = [];
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupIntersectionObservers();
        this.setupParallaxElements();
        this.initScrollAnimations();
        this.createFloatingElements();
        
        console.log('🍎 Apple风格滚动动效系统已启动');
    }

    setupScrollListener() {
        // 使用被动监听器优化性能
        window.addEventListener('scroll', this.onScroll.bind(this), {
            passive: true
        });

        // 滚动开始和结束检测
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            document.body.classList.add('is-scrolling');
            
            // 清除之前的超时
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // 设置滚动结束检测
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                document.body.classList.remove('is-scrolling');
                this.onScrollEnd();
            }, 150);
        }, { passive: true });
    }

    onScroll() {
        this.lastScrollY = this.scrollY;
        this.scrollY = window.pageYOffset;
        
        if (!this.ticking) {
            requestAnimationFrame(this.updateAnimations.bind(this));
            this.ticking = true;
        }
    }

    updateAnimations() {
        this.ticking = false;
        
        // 更新视差效果
        this.updateParallax();
        
        // 更新滚动进度动画
        this.updateScrollProgress();
        
        // 更新背景效果
        this.updateBackgroundEffects();
        
        // 滚动方向检测
        const scrollDirection = this.scrollY > this.lastScrollY ? 'down' : 'up';
        document.body.setAttribute('data-scroll-direction', scrollDirection);
    }

    setupIntersectionObservers() {
        // 淡入动画观察器
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementIn(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 滑入动画观察器
        const slideInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSlideIn(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // 缩放动画观察器
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateScale(entry.target);
                } else {
                    this.resetScale(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slideIn', slideInObserver);
        this.observers.set('scale', scaleObserver);
    }

    initScrollAnimations() {
        // 自动检测并应用动画到页面元素
        const animatableElements = document.querySelectorAll(`
            .bento-item,
            .card,
            .notification-item,
            .quick-action-btn,
            .metric-card,
            .insight-card
        `);

        animatableElements.forEach((element, index) => {
            // 添加初始状态
            element.style.opacity = '0';
            element.style.transform = 'translateY(40px) scale(0.95)';
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transitionDelay = `${index * 0.1}s`;
            
            // 添加数据属性
            element.setAttribute('data-animate', 'fadeInUp');
            element.setAttribute('data-delay', index * 100);
            
            // 观察元素
            this.observers.get('fadeIn').observe(element);
        });

        // 特殊元素动画
        this.initSpecialAnimations();
    }

    initSpecialAnimations() {
        // 标题动画
        const titles = document.querySelectorAll('h1, h2, h3, .bento-title');
        titles.forEach((title, index) => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            title.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            title.setAttribute('data-animate', 'titleFade');
            this.observers.get('fadeIn').observe(title);
        });

        // 按钮悬停增强
        this.enhanceButtonAnimations();
        
        // 卡片悬停效果
        this.enhanceCardAnimations();
    }

    enhanceButtonAnimations() {
        const buttons = document.querySelectorAll('.btn, .quick-action-btn, button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });

            button.addEventListener('mousedown', (e) => {
                e.target.style.transform = 'translateY(0) scale(0.98)';
            });

            button.addEventListener('mouseup', (e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
            });
        });
    }

    enhanceCardAnimations() {
        const cards = document.querySelectorAll('.bento-item, .card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02) rotateX(2deg)';
                card.style.boxShadow = '0 25px 50px rgba(38, 87, 253, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                card.style.boxShadow = '';
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
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
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupParallaxElements() {
        // 背景视差效果
        this.parallaxElements = [
            {
                element: document.querySelector('.cyber-background'),
                speed: 0.3,
                direction: 'vertical'
            },
            {
                element: document.querySelector('.cyber-grid'),
                speed: 0.5,
                direction: 'both'
            },
            {
                element: document.querySelector('.cyber-neon-beams'),
                speed: 0.2,
                direction: 'vertical'
            }
        ].filter(item => item.element);
    }

    updateParallax() {
        const scrollPercent = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        this.parallaxElements.forEach(item => {
            if (!item.element) return;
            
            const { element, speed, direction } = item;
            
            if (direction === 'vertical') {
                const yPos = -(this.scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            } else if (direction === 'both') {
                const yPos = -(this.scrollY * speed);
                const xPos = Math.sin(scrollPercent * Math.PI * 2) * 20;
                element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }
        });
    }

    updateScrollProgress() {
        const scrollPercent = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // 更新背景渐变
        const cyberGradient = document.querySelector('.cyber-gradient');
        if (cyberGradient) {
            const hue = 200 + (scrollPercent * 60); // 从蓝色到紫色
            cyberGradient.style.filter = `hue-rotate(${hue}deg) brightness(${1 + scrollPercent * 0.3})`;
        }

        // 更新粒子系统
        if (window.particleSystem && window.particleSystem.updateScrollProgress) {
            window.particleSystem.updateScrollProgress(scrollPercent);
        }
    }

    updateBackgroundEffects() {
        const scrollVelocity = Math.abs(this.scrollY - this.lastScrollY);
        
        // 根据滚动速度调整背景效果强度
        const intensity = Math.min(scrollVelocity / 10, 1);
        
        // 更新光束效果
        const neonBeams = document.querySelectorAll('.neon-beam');
        neonBeams.forEach((beam, index) => {
            const delay = index * 0.1;
            beam.style.animationDuration = `${6 - intensity * 2}s`;
            beam.style.animationDelay = `${delay}s`;
        });

        // 更新脉冲效果
        const pulseRings = document.querySelectorAll('.pulse-ring');
        pulseRings.forEach(ring => {
            ring.style.animationDuration = `${4 - intensity}s`;
        });
    }

    animateElementIn(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        
        setTimeout(() => {
            switch (animationType) {
                case 'fadeInUp':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                    break;
                case 'titleFade':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    break;
                default:
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
            }
        }, delay);
        
        // 移除观察器以避免重复动画
        this.observers.get('fadeIn').unobserve(element);
    }

    animateSlideIn(element) {
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
    }

    animateScale(element) {
        element.style.transform = 'scale(1.05)';
    }

    resetScale(element) {
        element.style.transform = 'scale(1)';
    }

    createFloatingElements() {
        // 创建浮动装饰元素
        for (let i = 0; i < 3; i++) {
            const floatingElement = document.createElement('div');
            floatingElement.className = 'floating-decoration';
            floatingElement.style.cssText = `
                position: fixed;
                width: ${20 + Math.random() * 30}px;
                height: ${20 + Math.random() * 30}px;
                background: radial-gradient(circle, rgba(38, 87, 253, 0.1), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                animation: float-decoration ${15 + Math.random() * 10}s infinite ease-in-out;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
            `;
            
            document.body.appendChild(floatingElement);
        }
    }

    onScrollEnd() {
        // 滚动结束时的特殊效果
        document.body.classList.add('scroll-ended');
        
        setTimeout(() => {
            document.body.classList.remove('scroll-ended');
        }, 1000);
    }

    // 公共方法
    addParallaxElement(element, speed = 0.5, direction = 'vertical') {
        this.parallaxElements.push({ element, speed, direction });
    }

    removeParallaxElement(element) {
        this.parallaxElements = this.parallaxElements.filter(item => item.element !== element);
    }

    // 清理方法
    destroy() {
        // 清理观察器
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // 清理事件监听器
        window.removeEventListener('scroll', this.onScroll);
        
        // 清理浮动元素
        document.querySelectorAll('.floating-decoration').forEach(el => el.remove());
        
        console.log('🍎 Apple风格滚动动效系统已销毁');
    }
}

// 添加必要的CSS动画
const scrollAnimationStyles = document.createElement('style');
scrollAnimationStyles.textContent = `
    /* Apple风格滚动动效样式 */
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes float-decoration {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(20px, -30px) scale(1.1);
            opacity: 0.6;
        }
        50% {
            transform: translate(-10px, -60px) scale(0.9);
            opacity: 0.4;
        }
        75% {
            transform: translate(30px, -40px) scale(1.2);
            opacity: 0.7;
        }
    }

    /* 滚动状态样式 */
    body.is-scrolling .cyber-background {
        filter: blur(0.5px);
    }

    body.scroll-ended .cyber-background {
        filter: blur(0px);
        transition: filter 0.5s ease;
    }

    /* 增强按钮和卡片动画 */
    .btn, .quick-action-btn, button {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center;
    }

    .bento-item, .card {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center;
        transform-style: preserve-3d;
    }

    /* 滚动方向相关样式 */
    body[data-scroll-direction="down"] .sidebar {
        transform: translateX(-5px);
    }

    body[data-scroll-direction="up"] .sidebar {
        transform: translateX(0);
    }

    /* 减少动画偏好支持 */
    @media (prefers-reduced-motion: reduce) {
        .floating-decoration,
        .btn, .quick-action-btn, button,
        .bento-item, .card {
            animation: none !important;
            transition: none !important;
        }
        
        body.is-scrolling .cyber-background {
            filter: none !important;
        }
    }
`;

document.head.appendChild(scrollAnimationStyles);

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.appleScrollAnimations = new AppleScrollAnimations();
});

// 导出
if (typeof window !== 'undefined') {
    window.AppleScrollAnimations = AppleScrollAnimations;
} 