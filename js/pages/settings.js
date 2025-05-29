/**
 * 系统设置页面模块
 */
const SettingsPage = {
    settings: {
        account: {
            username: '张医生',
            email: 'zhang.doctor@hospital.com',
            phone: '138****8888',
            department: '影像科',
            position: '主治医师'
        },
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            analysisComplete: true,
            highRiskAlert: true,
            systemMaintenance: false
        },
        interface: {
            theme: 'dark',
            language: 'zh-CN',
            autoSave: true,
            showTips: true,
            animationEnabled: true
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            autoLogout: true,
            passwordExpiry: 90
        },
        system: {
            autoBackup: true,
            backupFrequency: 'daily',
            dataRetention: 365,
            logLevel: 'info'
        }
    },

    render() {
        return `
            <div class="settings-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        <i class="fas fa-cog text-primary mr-3"></i>系统设置
                    </h2>
                    <p class="text-gray-400">个性化配置和系统管理</p>
                </div>

                <!-- 设置导航 -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- 左侧导航 -->
                    <div class="lg:col-span-1">
                        <div class="card">
                            <nav class="settings-nav">
                                <button class="settings-nav-item active" data-section="account">
                                    <i class="fas fa-user"></i>
                                    <span>账户设置</span>
                                </button>
                                <button class="settings-nav-item" data-section="notifications">
                                    <i class="fas fa-bell"></i>
                                    <span>通知设置</span>
                                </button>
                                <button class="settings-nav-item" data-section="interface">
                                    <i class="fas fa-palette"></i>
                                    <span>界面设置</span>
                                </button>
                                <button class="settings-nav-item" data-section="security">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>安全设置</span>
                                </button>
                                <button class="settings-nav-item" data-section="system">
                                    <i class="fas fa-server"></i>
                                    <span>系统配置</span>
                                </button>
                                <button class="settings-nav-item" data-section="about">
                                    <i class="fas fa-info-circle"></i>
                                    <span>关于系统</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- 右侧内容 -->
                    <div class="lg:col-span-3">
                        <div class="settings-content">
                            <!-- 账户设置 -->
                            <div id="account-section" class="settings-section active">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">账户信息</h3>
                                        <p class="text-gray-400">管理您的个人信息和账户设置</p>
                                    </div>
                                    
                                    <div class="settings-form">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label class="form-label">用户名</label>
                                                <input type="text" class="form-input" value="${this.settings.account.username}" id="username">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">邮箱地址</label>
                                                <input type="email" class="form-input" value="${this.settings.account.email}" id="email">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">手机号码</label>
                                                <input type="tel" class="form-input" value="${this.settings.account.phone}" id="phone">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">所属科室</label>
                                                <select class="form-input" id="department">
                                                    <option value="影像科" ${this.settings.account.department === '影像科' ? 'selected' : ''}>影像科</option>
                                                    <option value="内科" ${this.settings.account.department === '内科' ? 'selected' : ''}>内科</option>
                                                    <option value="外科" ${this.settings.account.department === '外科' ? 'selected' : ''}>外科</option>
                                                    <option value="急诊科" ${this.settings.account.department === '急诊科' ? 'selected' : ''}>急诊科</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">职位</label>
                                                <select class="form-input" id="position">
                                                    <option value="主治医师" ${this.settings.account.position === '主治医师' ? 'selected' : ''}>主治医师</option>
                                                    <option value="副主任医师" ${this.settings.account.position === '副主任医师' ? 'selected' : ''}>副主任医师</option>
                                                    <option value="主任医师" ${this.settings.account.position === '主任医师' ? 'selected' : ''}>主任医师</option>
                                                    <option value="住院医师" ${this.settings.account.position === '住院医师' ? 'selected' : ''}>住院医师</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-primary" onclick="window.SettingsPage.saveAccountSettings()">
                                                <i class="fas fa-save mr-2"></i>保存更改
                                            </button>
                                            <button class="btn-outline" onclick="window.SettingsPage.changePassword()">
                                                <i class="fas fa-key mr-2"></i>修改密码
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 通知设置 -->
                            <div id="notifications-section" class="settings-section">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">通知设置</h3>
                                        <p class="text-gray-400">配置系统通知和提醒方式</p>
                                    </div>
                                    
                                    <div class="settings-form">
                                        <div class="space-y-6">
                                            <div class="notification-group">
                                                <h4 class="text-white font-medium mb-4">通知方式</h4>
                                                <div class="space-y-4">
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">邮件通知</span>
                                                            <span class="setting-desc">通过邮件接收重要通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.emailNotifications ? 'checked' : ''} id="emailNotifications">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">短信通知</span>
                                                            <span class="setting-desc">通过短信接收紧急通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.smsNotifications ? 'checked' : ''} id="smsNotifications">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">推送通知</span>
                                                            <span class="setting-desc">浏览器推送通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.pushNotifications ? 'checked' : ''} id="pushNotifications">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="notification-group">
                                                <h4 class="text-white font-medium mb-4">通知内容</h4>
                                                <div class="space-y-4">
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">分析完成通知</span>
                                                            <span class="setting-desc">AI分析完成时通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.analysisComplete ? 'checked' : ''} id="analysisComplete">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">高风险预警</span>
                                                            <span class="setting-desc">发现高风险病例时立即通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.highRiskAlert ? 'checked' : ''} id="highRiskAlert">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                    <div class="setting-item">
                                                        <div class="setting-info">
                                                            <span class="setting-title">系统维护通知</span>
                                                            <span class="setting-desc">系统维护和更新通知</span>
                                                        </div>
                                                        <label class="toggle-switch">
                                                            <input type="checkbox" ${this.settings.notifications.systemMaintenance ? 'checked' : ''} id="systemMaintenance">
                                                            <span class="toggle-slider"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-primary" onclick="window.SettingsPage.saveNotificationSettings()">
                                                <i class="fas fa-save mr-2"></i>保存设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 界面设置 -->
                            <div id="interface-section" class="settings-section">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">界面设置</h3>
                                        <p class="text-gray-400">个性化界面外观和交互设置</p>
                                    </div>
                                    
                                    <div class="settings-form">
                                        <div class="space-y-6">
                                            <div class="form-group">
                                                <label class="form-label">主题模式</label>
                                                <select class="form-input" id="theme">
                                                    <option value="dark" ${this.settings.interface.theme === 'dark' ? 'selected' : ''}>深色模式</option>
                                                    <option value="light" ${this.settings.interface.theme === 'light' ? 'selected' : ''}>浅色模式</option>
                                                    <option value="auto" ${this.settings.interface.theme === 'auto' ? 'selected' : ''}>跟随系统</option>
                                                </select>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">语言设置</label>
                                                <select class="form-input" id="language">
                                                    <option value="zh-CN" ${this.settings.interface.language === 'zh-CN' ? 'selected' : ''}>简体中文</option>
                                                    <option value="en-US" ${this.settings.interface.language === 'en-US' ? 'selected' : ''}>English</option>
                                                </select>
                                            </div>
                                            
                                            <div class="space-y-4">
                                                <div class="setting-item">
                                                    <div class="setting-info">
                                                        <span class="setting-title">自动保存</span>
                                                        <span class="setting-desc">自动保存工作进度</span>
                                                    </div>
                                                    <label class="toggle-switch">
                                                        <input type="checkbox" ${this.settings.interface.autoSave ? 'checked' : ''} id="autoSave">
                                                        <span class="toggle-slider"></span>
                                                    </label>
                                                </div>
                                                <div class="setting-item">
                                                    <div class="setting-info">
                                                        <span class="setting-title">显示提示</span>
                                                        <span class="setting-desc">显示操作提示和帮助信息</span>
                                                    </div>
                                                    <label class="toggle-switch">
                                                        <input type="checkbox" ${this.settings.interface.showTips ? 'checked' : ''} id="showTips">
                                                        <span class="toggle-slider"></span>
                                                    </label>
                                                </div>
                                                <div class="setting-item">
                                                    <div class="setting-info">
                                                        <span class="setting-title">动画效果</span>
                                                        <span class="setting-desc">启用界面动画和过渡效果</span>
                                                    </div>
                                                    <label class="toggle-switch">
                                                        <input type="checkbox" ${this.settings.interface.animationEnabled ? 'checked' : ''} id="animationEnabled">
                                                        <span class="toggle-slider"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-primary" onclick="window.SettingsPage.saveInterfaceSettings()">
                                                <i class="fas fa-save mr-2"></i>保存设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 安全设置 -->
                            <div id="security-section" class="settings-section">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">安全设置</h3>
                                        <p class="text-gray-400">账户安全和访问控制设置</p>
                                    </div>
                                    
                                    <div class="settings-form">
                                        <div class="space-y-6">
                                            <div class="setting-item">
                                                <div class="setting-info">
                                                    <span class="setting-title">双因素认证</span>
                                                    <span class="setting-desc">启用双因素认证增强账户安全</span>
                                                </div>
                                                <label class="toggle-switch">
                                                    <input type="checkbox" ${this.settings.security.twoFactorAuth ? 'checked' : ''} id="twoFactorAuth">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">会话超时时间（分钟）</label>
                                                <select class="form-input" id="sessionTimeout">
                                                    <option value="15" ${this.settings.security.sessionTimeout === 15 ? 'selected' : ''}>15分钟</option>
                                                    <option value="30" ${this.settings.security.sessionTimeout === 30 ? 'selected' : ''}>30分钟</option>
                                                    <option value="60" ${this.settings.security.sessionTimeout === 60 ? 'selected' : ''}>1小时</option>
                                                    <option value="120" ${this.settings.security.sessionTimeout === 120 ? 'selected' : ''}>2小时</option>
                                                </select>
                                            </div>
                                            
                                            <div class="setting-item">
                                                <div class="setting-info">
                                                    <span class="setting-title">自动登出</span>
                                                    <span class="setting-desc">长时间无操作时自动登出</span>
                                                </div>
                                                <label class="toggle-switch">
                                                    <input type="checkbox" ${this.settings.security.autoLogout ? 'checked' : ''} id="autoLogout">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">密码过期时间（天）</label>
                                                <select class="form-input" id="passwordExpiry">
                                                    <option value="30" ${this.settings.security.passwordExpiry === 30 ? 'selected' : ''}>30天</option>
                                                    <option value="60" ${this.settings.security.passwordExpiry === 60 ? 'selected' : ''}>60天</option>
                                                    <option value="90" ${this.settings.security.passwordExpiry === 90 ? 'selected' : ''}>90天</option>
                                                    <option value="180" ${this.settings.security.passwordExpiry === 180 ? 'selected' : ''}>180天</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-primary" onclick="window.SettingsPage.saveSecuritySettings()">
                                                <i class="fas fa-save mr-2"></i>保存设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 系统配置 -->
                            <div id="system-section" class="settings-section">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">系统配置</h3>
                                        <p class="text-gray-400">系统级别的配置和管理设置</p>
                                    </div>
                                    
                                    <div class="settings-form">
                                        <div class="space-y-6">
                                            <div class="setting-item">
                                                <div class="setting-info">
                                                    <span class="setting-title">自动备份</span>
                                                    <span class="setting-desc">定期自动备份系统数据</span>
                                                </div>
                                                <label class="toggle-switch">
                                                    <input type="checkbox" ${this.settings.system.autoBackup ? 'checked' : ''} id="autoBackup">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">备份频率</label>
                                                <select class="form-input" id="backupFrequency">
                                                    <option value="daily" ${this.settings.system.backupFrequency === 'daily' ? 'selected' : ''}>每日</option>
                                                    <option value="weekly" ${this.settings.system.backupFrequency === 'weekly' ? 'selected' : ''}>每周</option>
                                                    <option value="monthly" ${this.settings.system.backupFrequency === 'monthly' ? 'selected' : ''}>每月</option>
                                                </select>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">数据保留期（天）</label>
                                                <select class="form-input" id="dataRetention">
                                                    <option value="90" ${this.settings.system.dataRetention === 90 ? 'selected' : ''}>90天</option>
                                                    <option value="180" ${this.settings.system.dataRetention === 180 ? 'selected' : ''}>180天</option>
                                                    <option value="365" ${this.settings.system.dataRetention === 365 ? 'selected' : ''}>1年</option>
                                                    <option value="730" ${this.settings.system.dataRetention === 730 ? 'selected' : ''}>2年</option>
                                                </select>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label class="form-label">日志级别</label>
                                                <select class="form-input" id="logLevel">
                                                    <option value="error" ${this.settings.system.logLevel === 'error' ? 'selected' : ''}>错误</option>
                                                    <option value="warn" ${this.settings.system.logLevel === 'warn' ? 'selected' : ''}>警告</option>
                                                    <option value="info" ${this.settings.system.logLevel === 'info' ? 'selected' : ''}>信息</option>
                                                    <option value="debug" ${this.settings.system.logLevel === 'debug' ? 'selected' : ''}>调试</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-primary" onclick="window.SettingsPage.saveSystemSettings()">
                                                <i class="fas fa-save mr-2"></i>保存设置
                                            </button>
                                            <button class="btn-outline" onclick="window.SettingsPage.exportSettings()">
                                                <i class="fas fa-download mr-2"></i>导出配置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 关于系统 -->
                            <div id="about-section" class="settings-section">
                                <div class="card">
                                    <div class="settings-section-header">
                                        <h3 class="text-lg font-semibold text-white">关于系统</h3>
                                        <p class="text-gray-400">系统信息和版本详情</p>
                                    </div>
                                    
                                    <div class="about-content">
                                        <div class="system-info">
                                            <div class="info-item">
                                                <span class="info-label">系统名称</span>
                                                <span class="info-value">AI医学影像分析平台</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">版本号</span>
                                                <span class="info-value">v2.1.0</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">发布日期</span>
                                                <span class="info-value">2024年12月</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">技术栈</span>
                                                <span class="info-value">JavaScript, TailwindCSS, Chart.js</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">开发团队</span>
                                                <span class="info-value">医疗AI研发中心</span>
                                            </div>
                                        </div>
                                        
                                        <div class="update-info mt-6">
                                            <h4 class="text-white font-medium mb-4">更新日志</h4>
                                            <div class="changelog">
                                                <div class="changelog-item">
                                                    <div class="changelog-version">v2.1.0</div>
                                                    <div class="changelog-date">2024-12-28</div>
                                                    <ul class="changelog-list">
                                                        <li>新增批量上传功能</li>
                                                        <li>优化AI分析算法</li>
                                                        <li>改进用户界面体验</li>
                                                        <li>修复已知问题</li>
                                                    </ul>
                                                </div>
                                                <div class="changelog-item">
                                                    <div class="changelog-version">v2.0.0</div>
                                                    <div class="changelog-date">2024-11-15</div>
                                                    <ul class="changelog-list">
                                                        <li>全新界面设计</li>
                                                        <li>增强安全性</li>
                                                        <li>支持多种文件格式</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-actions">
                                            <button class="btn-outline" onclick="window.SettingsPage.checkUpdates()">
                                                <i class="fas fa-sync mr-2"></i>检查更新
                                            </button>
                                            <button class="btn-outline" onclick="window.SettingsPage.showLicense()">
                                                <i class="fas fa-file-contract mr-2"></i>许可协议
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('系统设置页面已加载');
        this.initEventListeners();
        this.loadSettings();
    },

    initEventListeners() {
        // 导航切换
        document.addEventListener('click', (e) => {
            if (e.target.matches('.settings-nav-item') || e.target.closest('.settings-nav-item')) {
                const button = e.target.matches('.settings-nav-item') ? e.target : e.target.closest('.settings-nav-item');
                const section = button.dataset.section;
                this.switchSection(section);
            }
        });
    },

    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
    },

    loadSettings() {
        // 从localStorage加载设置
        const savedSettings = localStorage.getItem('systemSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    },

    saveAccountSettings() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const department = document.getElementById('department').value;
        const position = document.getElementById('position').value;

        this.settings.account = {
            username, email, phone, department, position
        };

        this.saveSettings();
        this.showToast('账户设置已保存', 'success');
    },

    saveNotificationSettings() {
        const notifications = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
            pushNotifications: document.getElementById('pushNotifications').checked,
            analysisComplete: document.getElementById('analysisComplete').checked,
            highRiskAlert: document.getElementById('highRiskAlert').checked,
            systemMaintenance: document.getElementById('systemMaintenance').checked
        };

        this.settings.notifications = notifications;
        this.saveSettings();
        this.showToast('通知设置已保存', 'success');
    },

    saveInterfaceSettings() {
        const interface = {
            theme: document.getElementById('theme').value,
            language: document.getElementById('language').value,
            autoSave: document.getElementById('autoSave').checked,
            showTips: document.getElementById('showTips').checked,
            animationEnabled: document.getElementById('animationEnabled').checked
        };

        this.settings.interface = interface;
        this.saveSettings();
        this.showToast('界面设置已保存', 'success');
    },

    saveSecuritySettings() {
        const security = {
            twoFactorAuth: document.getElementById('twoFactorAuth').checked,
            sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
            autoLogout: document.getElementById('autoLogout').checked,
            passwordExpiry: parseInt(document.getElementById('passwordExpiry').value)
        };

        this.settings.security = security;
        this.saveSettings();
        this.showToast('安全设置已保存', 'success');
    },

    saveSystemSettings() {
        const system = {
            autoBackup: document.getElementById('autoBackup').checked,
            backupFrequency: document.getElementById('backupFrequency').value,
            dataRetention: parseInt(document.getElementById('dataRetention').value),
            logLevel: document.getElementById('logLevel').value
        };

        this.settings.system = system;
        this.saveSettings();
        this.showToast('系统配置已保存', 'success');
    },

    saveSettings() {
        localStorage.setItem('systemSettings', JSON.stringify(this.settings));
    },

    changePassword() {
        // 模拟密码修改
        this.showToast('密码修改功能开发中', 'info');
    },

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'system-settings.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('配置已导出', 'success');
    },

    checkUpdates() {
        this.showToast('正在检查更新...', 'info');
        setTimeout(() => {
            this.showToast('当前已是最新版本', 'success');
        }, 2000);
    },

    showLicense() {
        this.showToast('许可协议功能开发中', 'info');
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// 添加设置页面样式
const settingsStyles = document.createElement('style');
settingsStyles.textContent = `
    .settings-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .settings-nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: transparent;
        border: none;
        border-radius: 8px;
        color: #9CA3AF;
        text-align: left;
        transition: all 0.2s ease;
        cursor: pointer;
        width: 100%;
    }

    .settings-nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
    }

    .settings-nav-item.active {
        background: rgba(38, 87, 253, 0.1);
        color: #2657FD;
    }

    .settings-nav-item i {
        width: 20px;
        text-align: center;
    }

    .settings-section {
        display: none;
    }

    .settings-section.active {
        display: block;
    }

    .settings-section-header {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .settings-form {
        padding: 0;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        display: block;
        margin-bottom: 8px;
        color: #ffffff;
        font-weight: 500;
        font-size: 14px;
    }

    .form-input {
        width: 100%;
        padding: 12px 16px;
        background: #1F2937;
        border: 1px solid #374151;
        border-radius: 8px;
        color: #ffffff;
        font-size: 14px;
        transition: border-color 0.2s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: #2657FD;
    }

    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .setting-info {
        flex: 1;
    }

    .setting-title {
        display: block;
        color: #ffffff;
        font-weight: 500;
        margin-bottom: 4px;
    }

    .setting-desc {
        display: block;
        color: #9CA3AF;
        font-size: 14px;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #374151;
        transition: 0.3s;
        border-radius: 24px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }

    input:checked + .toggle-slider {
        background-color: #2657FD;
    }

    input:checked + .toggle-slider:before {
        transform: translateX(24px);
    }

    .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .notification-group {
        padding: 20px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .notification-group:last-child {
        border-bottom: none;
    }

    .about-content {
        padding: 0;
    }

    .system-info {
        display: grid;
        gap: 16px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .info-item:last-child {
        border-bottom: none;
    }

    .info-label {
        color: #9CA3AF;
        font-weight: 500;
    }

    .info-value {
        color: #ffffff;
    }

    .changelog {
        space-y: 24px;
    }

    .changelog-item {
        margin-bottom: 24px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .changelog-version {
        color: #2657FD;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .changelog-date {
        color: #9CA3AF;
        font-size: 12px;
        margin-bottom: 12px;
    }

    .changelog-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .changelog-list li {
        color: #ffffff;
        font-size: 14px;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
    }

    .changelog-list li:before {
        content: '•';
        color: #2657FD;
        position: absolute;
        left: 0;
    }
`;
document.head.appendChild(settingsStyles);

window.SettingsPage = SettingsPage; 