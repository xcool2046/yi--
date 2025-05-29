/**
 * 简化版认证管理器
 * 处理基本的用户登录和注册功能
 */
class AuthManager {
    constructor() {
        this.currentForm = 'login';
        this.isLoading = false;
        this.mockUsers = this.loadMockUsers();
        this.init();
    }

    init() {
        this.bindEvents();
        this.initPasswordToggle();
        console.log('🔐 认证管理器已初始化');
    }

    // 加载模拟用户数据
    loadMockUsers() {
        const savedUsers = localStorage.getItem('mock_users');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // 默认用户数据
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@medai.com',
                name: '系统管理员',
                password: 'admin',
                role: 'admin',
                isActive: true
            },
            {
                id: 2,
                username: 'doctor',
                email: 'doctor@medai.com',
                name: '张医生',
                password: 'doctor',
                role: 'doctor',
                isActive: true
            }
        ];
        
        this.saveMockUsers(defaultUsers);
        return defaultUsers;
    }

    saveMockUsers(users) {
        localStorage.setItem('mock_users', JSON.stringify(users));
    }

    // 绑定事件监听器
    bindEvents() {
        // 表单切换
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        
        if (loginTab) {
            loginTab.addEventListener('click', () => this.switchForm('login'));
        }
        
        if (registerTab) {
            registerTab.addEventListener('click', () => this.switchForm('register'));
        }

        // 表单提交
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // 模态框事件
        const successModalBtn = document.getElementById('successModalBtn');
        if (successModalBtn) {
            successModalBtn.addEventListener('click', () => this.hideSuccessModal());
        }
    }

    // 表单切换
    switchForm(formType) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (formType === 'login') {
            loginTab.classList.add('active');
            loginTab.classList.remove('text-gray-400');
            loginTab.classList.add('text-white');
            
            registerTab.classList.remove('active');
            registerTab.classList.add('text-gray-400');
            registerTab.classList.remove('text-white');
            
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            
            this.currentForm = 'login';
        } else {
            registerTab.classList.add('active');
            registerTab.classList.remove('text-gray-400');
            registerTab.classList.add('text-white');
            
            loginTab.classList.remove('active');
            loginTab.classList.add('text-gray-400');
            loginTab.classList.remove('text-white');
            
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            
            this.currentForm = 'register';
        }
    }

    // 初始化密码显示/隐藏切换
    initPasswordToggle() {
        const toggleButtons = [
            'toggleLoginPassword',
            'toggleRegisterPassword',
            'toggleConfirmPassword'
        ];

        toggleButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => this.togglePasswordVisibility(button));
            }
        });
    }

    togglePasswordVisibility(button) {
        const input = button.closest('div').querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // 处理登录
    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            this.showToast('请填写完整的登录信息', 'error');
            return;
        }

        this.setLoading(true, 'loginBtn');
        
        try {
            // 模拟API调用延迟
            await this.delay(1000);
            
            const user = this.authenticateUser(username, password);
            
            if (user) {
                // 登录成功
                this.setUserSession(user);
                this.showSuccessModal('登录成功！正在跳转到系统主页...', () => {
                    window.location.href = 'index.html';
                });
            } else {
                this.showToast('用户名或密码错误', 'error');
            }
        } catch (error) {
            console.error('登录错误:', error);
            this.showToast('登录失败，请稍后重试', 'error');
        } finally {
            this.setLoading(false, 'loginBtn');
        }
    }

    // 处理注册
    async handleRegister(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        const formData = this.getRegisterFormData();
        
        // 简单验证
        if (!this.validateRegisterForm(formData)) {
            return;
        }

        this.setLoading(true, 'registerBtn');
        
        try {
            // 模拟API调用延迟
            await this.delay(1500);
            
            const newUser = this.createUser(formData);
            
            if (newUser) {
                this.showSuccessModal('注册成功！请使用新账户登录。', () => {
                    this.switchForm('login');
                    document.getElementById('loginUsername').value = formData.username;
                });
            } else {
                this.showToast('注册失败，请稍后重试', 'error');
            }
        } catch (error) {
            console.error('注册错误:', error);
            this.showToast('注册失败，请稍后重试', 'error');
        } finally {
            this.setLoading(false, 'registerBtn');
        }
    }

    getRegisterFormData() {
        return {
            username: document.getElementById('registerUsername').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };
    }

    // 简化的表单验证
    validateRegisterForm(data) {
        if (!data.username) {
            this.showToast('请输入用户名', 'error');
            return false;
        }
        
        if (!data.email) {
            this.showToast('请输入邮箱地址', 'error');
            return false;
        }
        
        if (!data.password) {
            this.showToast('请输入密码', 'error');
            return false;
        }
        
        if (data.password !== data.confirmPassword) {
            this.showToast('两次输入的密码不一致', 'error');
            return false;
        }
        
        if (!data.agreeTerms) {
            this.showToast('请同意用户协议和隐私政策', 'error');
            return false;
        }

        // 检查用户名是否已存在
        if (this.isUsernameExists(data.username)) {
            this.showToast('用户名已存在', 'error');
            return false;
        }

        return true;
    }

    isUsernameExists(username) {
        return this.mockUsers.some(user => user.username === username);
    }

    // 用户认证
    authenticateUser(username, password) {
        return this.mockUsers.find(user => 
            (user.username === username || user.email === username) && 
            user.password === password && 
            user.isActive
        );
    }

    // 创建新用户
    createUser(data) {
        const newUser = {
            id: this.mockUsers.length + 1,
            username: data.username,
            email: data.email,
            name: data.username,
            role: 'user',
            password: data.password,
            isActive: true
        };

        this.mockUsers.push(newUser);
        this.saveMockUsers(this.mockUsers);
        
        return newUser;
    }

    // 设置用户会话
    setUserSession(user) {
        const sessionData = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
    }

    // 设置加载状态
    setLoading(loading, buttonId) {
        this.isLoading = loading;
        const button = document.getElementById(buttonId);
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('span');
        
        if (loading) {
            button.disabled = true;
            if (spinner) spinner.classList.remove('hidden');
            if (text) text.textContent = '处理中...';
        } else {
            button.disabled = false;
            if (spinner) spinner.classList.add('hidden');
            if (text) text.textContent = buttonId === 'loginBtn' ? '登录' : '注册账户';
        }
    }

    // 显示成功模态框
    showSuccessModal(message, callback) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.remove('hidden');
            
            // 设置回调
            this.successCallback = callback;
        }
    }

    hideSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('hidden');
            
            if (this.successCallback) {
                this.successCallback();
                this.successCallback = null;
            }
        }
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
        
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-600');
                break;
            case 'error':
                toast.classList.add('bg-red-600');
                break;
            case 'warning':
                toast.classList.add('bg-yellow-600');
                break;
            default:
                toast.classList.add('bg-blue-600');
        }
        
        toast.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 动画显示
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 公共API
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('auth-container')) {
        window.authManager = new AuthManager();
    }
});

// 导出
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
} 