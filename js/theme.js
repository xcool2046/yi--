/**
 * 主题和背景效果管理器
 * 处理主题切换、背景动画、视觉效果等
 */
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.backgroundAnimations = new Map();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.initThemeToggle();
        this.initBackgroundAnimations();
        this.initSystemThemeListener();
        
        console.log('🎨 主题管理器已初始化');
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        if (theme === this.currentTheme) return;

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        
        // 触发主题变更事件
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    applyTheme(theme) {
        // 添加过渡效果
        document.documentElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 应用主题类
        document.documentElement.className = theme;
        
        // 更新主题图标
        this.updateThemeIcon(theme);
        
        // 更新背景效果
        this.updateBackgroundForTheme(theme);
        
        // 移除过渡效果
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 500);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (icon) {
            // 添加旋转动画
            icon.style.transform = 'rotate(180deg)';
            icon.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }
    }

    updateBackgroundForTheme(theme) {
        const backgroundElements = {
            gradient: document.querySelector('.absolute.inset-0.bg-gradient-to-br'),
            animations: document.querySelector('.absolute.inset-0.opacity-30'),
            particles: document.getElementById('particleCanvas'),
            grid: document.querySelector('.grid-background')
        };

        if (theme === 'light') {
            this.applyLightThemeBackground(backgroundElements);
        } else {
            this.applyDarkThemeBackground(backgroundElements);
        }
    }

    applyDarkThemeBackground(elements) {
        if (elements.gradient) {
            elements.gradient.className = 'absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black';
        }
        
        // 重新启动粒子系统（如果存在）
        if (window.particleSystem) {
            window.particleSystem.updateTheme('dark');
        }
    }

    applyLightThemeBackground(elements) {
        if (elements.gradient) {
            elements.gradient.className = 'absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-white';
        }
        
        // 重新启动粒子系统（如果存在）
        if (window.particleSystem) {
            window.particleSystem.updateTheme('light');
        }
    }

    initBackgroundAnimations() {
        this.startFloatingElementsAnimation();
        this.startGradientShiftAnimation();
        this.startNetworkAnimation();
    }

    startFloatingElementsAnimation() {
        const floatingElements = document.querySelectorAll('.absolute.top-1\\/4, .absolute.top-3\\/4, .absolute.bottom-1\\/4');
        
        floatingElements.forEach((element, index) => {
            const duration = 8000 + (index * 2000); // 不同的动画持续时间
            const delay = index * 1000; // 错开动画开始时间
            
            this.animateFloatingElement(element, duration, delay);
        });
    }

    animateFloatingElement(element, duration, delay) {
        if (!element) return;

        setTimeout(() => {
            const animate = () => {
                element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.6, 1)`;
                
                // 随机移动
                const translateX = (Math.random() - 0.5) * 100;
                const translateY = (Math.random() - 0.5) * 100;
                const scale = 0.8 + Math.random() * 0.4;
                
                element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                
                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, duration);
            };
            
            animate();
        }, delay);
    }

    startGradientShiftAnimation() {
        const gradientElement = document.querySelector('.bg-gradient-to-br');
        if (!gradientElement) return;

        let hue = 200; // 起始色调
        
        const shiftGradient = () => {
            hue = (hue + 0.5) % 360;
            
            // 动态更新渐变色
            const newGradient = `linear-gradient(45deg, 
                hsl(${hue}, 70%, 10%), 
                hsl(${(hue + 60) % 360}, 50%, 5%), 
                hsl(${(hue + 120) % 360}, 60%, 8%)
            )`;
            
            gradientElement.style.background = newGradient;
            
            requestAnimationFrame(shiftGradient);
        };
        
        // 只在用户偏好允许时启动
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            shiftGradient();
        }
    }

    startNetworkAnimation() {
        // 创建动态网络连接效果
        this.createNetworkNodes();
    }

    createNetworkNodes() {
        const container = document.body;
        const nodeCount = 15;
        const nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'network-node';
            node.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(38, 87, 253, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 10px rgba(38, 87, 253, 0.3);
            `;
            
            // 随机位置
            node.style.left = Math.random() * window.innerWidth + 'px';
            node.style.top = Math.random() * window.innerHeight + 'px';
            
            container.appendChild(node);
            nodes.push({
                element: node,
                x: parseFloat(node.style.left),
                y: parseFloat(node.style.top),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        // 动画循环
        const animateNetwork = () => {
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                // 边界检查
                if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
                if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

                node.element.style.left = node.x + 'px';
                node.element.style.top = node.y + 'px';
            });

            // 绘制连接线
            this.drawNetworkConnections(nodes);
            
            if (!document.hidden) {
                requestAnimationFrame(animateNetwork);
            }
        };

        animateNetwork();
    }

    drawNetworkConnections(nodes) {
        // 移除旧的连接线
        document.querySelectorAll('.network-connection').forEach(line => line.remove());

        const maxDistance = 200;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const line = document.createElement('div');
                    line.className = 'network-connection';
                    
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    const length = distance;
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    line.style.cssText = `
                        position: fixed;
                        width: ${length}px;
                        height: 1px;
                        background: rgba(38, 87, 253, ${opacity});
                        left: ${nodes[i].x}px;
                        top: ${nodes[i].y}px;
                        transform-origin: 0 0;
                        transform: rotate(${angle}deg);
                        pointer-events: none;
                        z-index: 1;
                    `;
                    
                    document.body.appendChild(line);
                }
            }
        }
    }

    initSystemThemeListener() {
        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addListener((e) => {
            // 只有当用户没有手动设置主题时才跟随系统
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // 清理方法
    destroy() {
        // 清理动画
        this.backgroundAnimations.forEach(animation => {
            if (animation.stop) animation.stop();
        });
        
        // 移除网络节点
        document.querySelectorAll('.network-node, .network-connection').forEach(el => el.remove());
        
        console.log('🎨 主题管理器已销毁');
    }
}

// 增强的粒子系统（支持主题切换）
class EnhancedParticleSystem extends ParticleSystem {
    constructor() {
        super();
        this.theme = 'dark';
    }

    updateTheme(theme) {
        this.theme = theme;
        this.updateParticleColors();
    }

    updateParticleColors() {
        this.particles.forEach(particle => {
            if (this.theme === 'light') {
                particle.hue = Math.random() * 60 + 180; // 更亮的蓝色
                particle.brightness = Math.random() * 0.4 + 0.3;
            } else {
                particle.hue = Math.random() * 60 + 200; // 深蓝色
                particle.brightness = Math.random() * 0.6 + 0.2;
            }
        });
    }

    drawConnections() {
        const maxDistance = 120;
        const baseColor = this.theme === 'light' ? '38, 87, 253' : '59, 130, 246';
        
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
                    this.ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
}

// 背景效果管理器
class BackgroundEffectsManager {
    constructor() {
        this.effects = new Map();
        this.isActive = true;
        this.init();
    }

    init() {
        this.initMorphingShapes();
        this.initLightBeams();
        this.initFloatingOrbs();
        
        console.log('🌟 背景效果管理器已启动');
    }

    initMorphingShapes() {
        const shapes = this.createMorphingShapes();
        this.effects.set('morphingShapes', shapes);
    }

    createMorphingShapes() {
        const container = document.createElement('div');
        container.className = 'morphing-shapes-container';
        container.style.cssText = `
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'morphing-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${100 + Math.random() * 200}px;
                height: ${100 + Math.random() * 200}px;
                background: radial-gradient(circle, rgba(38, 87, 253, 0.1), transparent);
                border-radius: ${Math.random() * 50 + 25}%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: morph ${10 + Math.random() * 10}s infinite ease-in-out;
                filter: blur(${Math.random() * 3 + 1}px);
            `;
            container.appendChild(shape);
        }

        document.body.appendChild(container);
        return container;
    }

    initLightBeams() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes morph {
                0%, 100% {
                    transform: translate(0, 0) scale(1) rotate(0deg);
                    border-radius: 25%;
                }
                25% {
                    transform: translate(50px, -30px) scale(1.2) rotate(90deg);
                    border-radius: 50%;
                }
                50% {
                    transform: translate(-30px, 50px) scale(0.8) rotate(180deg);
                    border-radius: 75%;
                }
                75% {
                    transform: translate(-50px, -50px) scale(1.1) rotate(270deg);
                    border-radius: 35%;
                }
            }

            @keyframes lightBeam {
                0% {
                    opacity: 0;
                    transform: translateX(-100px) rotate(45deg);
                }
                50% {
                    opacity: 0.3;
                }
                100% {
                    opacity: 0;
                    transform: translateX(calc(100vw + 100px)) rotate(45deg);
                }
            }

            .light-beam {
                position: fixed;
                width: 2px;
                height: 100vh;
                background: linear-gradient(to bottom, transparent, rgba(38, 87, 253, 0.4), transparent);
                animation: lightBeam 8s infinite linear;
                pointer-events: none;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);

        // 定期创建光束
        setInterval(() => {
            if (this.isActive && Math.random() < 0.3) {
                this.createLightBeam();
            }
        }, 2000);
    }

    createLightBeam() {
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        beam.style.top = Math.random() * 50 + '%';
        beam.style.left = '-100px';
        
        document.body.appendChild(beam);
        
        // 8秒后移除
        setTimeout(() => {
            if (beam.parentNode) {
                beam.parentNode.removeChild(beam);
            }
        }, 8000);
    }

    initFloatingOrbs() {
        // 创建浮动光球效果
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFloatingOrb();
            }, i * 2000);
        }
    }

    createFloatingOrb() {
        const orb = document.createElement('div');
        orb.style.cssText = `
            position: fixed;
            width: ${20 + Math.random() * 40}px;
            height: ${20 + Math.random() * 40}px;
            background: radial-gradient(circle, rgba(38, 87, 253, 0.6), rgba(59, 130, 246, 0.2), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            pointer-events: none;
            z-index: 1;
            filter: blur(1px);
            animation: float ${15 + Math.random() * 10}s infinite ease-in-out;
        `;

        document.body.appendChild(orb);

        // 25秒后移除
        setTimeout(() => {
            if (orb.parentNode) {
                orb.parentNode.removeChild(orb);
            }
        }, 25000);

        // 递归创建新的光球
        setTimeout(() => {
            if (this.isActive) {
                this.createFloatingOrb();
            }
        }, 8000 + Math.random() * 10000);
    }

    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = true;
    }

    destroy() {
        this.isActive = false;
        this.effects.forEach(effect => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        });
        
        // 清理光束和光球
        document.querySelectorAll('.light-beam, .morphing-shape').forEach(el => el.remove());
        
        console.log('🌟 背景效果管理器已停止');
    }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题管理器
    window.themeManager = new ThemeManager();
    
    // 替换原有的粒子系统
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
    window.particleSystem = new EnhancedParticleSystem();
    
    // 初始化背景效果
    window.backgroundEffects = new BackgroundEffectsManager();
    
    // 添加浮动动画样式
    const floatStyles = document.createElement('style');
    floatStyles.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.6;
            }
            25% {
                transform: translate(50px, -100px) scale(1.1);
                opacity: 0.8;
            }
            50% {
                transform: translate(-75px, -50px) scale(0.9);
                opacity: 0.5;
            }
            75% {
                transform: translate(25px, -150px) scale(1.2);
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(floatStyles);
    
    console.log('🎭 主题和效果系统已完全加载');
});

// 导出
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
    window.EnhancedParticleSystem = EnhancedParticleSystem;
    window.BackgroundEffectsManager = BackgroundEffectsManager;
} 