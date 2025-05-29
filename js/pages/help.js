/**
 * 帮助中心页面模块 - 现代化重构版本
 */
const HelpPage = {
    currentCategory: 'getting-started',
    
    render() {
        return `
            <div class="help-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-white mb-4">
                            <i class="fas fa-question-circle text-primary mr-3"></i>帮助中心
                        </h2>
                        <p class="text-gray-400 text-lg">快速找到您需要的帮助信息</p>
                    </div>
                </div>

                <!-- 搜索区域 -->
                <div class="search-section mb-12">
                    <div class="max-w-2xl mx-auto">
                        <div class="relative">
                            <input type="text" id="helpSearch" placeholder="搜索帮助内容..." 
                                   class="w-full px-6 py-4 pl-14 text-lg bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors">
                            <i class="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4 justify-center">
                            <span class="search-tag">快速入门</span>
                            <span class="search-tag">影像上传</span>
                            <span class="search-tag">分析结果</span>
                            <span class="search-tag">患者管理</span>
                            <span class="search-tag">常见问题</span>
                        </div>
                    </div>
                </div>

                <!-- 主要内容区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- 侧边栏导航 -->
                    <div class="lg:col-span-1">
                        <div class="card hover-lift sticky top-6">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-list text-primary mr-2"></i>帮助分类
                            </h3>
                            <nav class="help-nav">
                                <a href="#getting-started" class="help-nav-item active" data-category="getting-started">
                                    <i class="fas fa-rocket"></i>
                                    <span>快速入门</span>
                                </a>
                                <a href="#upload" class="help-nav-item" data-category="upload">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>影像上传</span>
                                </a>
                                <a href="#analysis" class="help-nav-item" data-category="analysis">
                                    <i class="fas fa-search"></i>
                                    <span>分析结果</span>
                                </a>
                                <a href="#patients" class="help-nav-item" data-category="patients">
                                    <i class="fas fa-users"></i>
                                    <span>患者管理</span>
                                </a>
                                <a href="#settings" class="help-nav-item" data-category="settings">
                                    <i class="fas fa-cog"></i>
                                    <span>系统设置</span>
                                </a>
                                <a href="#faq" class="help-nav-item" data-category="faq">
                                    <i class="fas fa-question"></i>
                                    <span>常见问题</span>
                                </a>
                                <a href="#contact" class="help-nav-item" data-category="contact">
                                    <i class="fas fa-headset"></i>
                                    <span>联系支持</span>
                                </a>
                            </nav>
                        </div>
                    </div>

                    <!-- 内容区域 -->
                    <div class="lg:col-span-3">
                        <div id="helpContent" class="help-content">
                            <!-- 内容将动态加载 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('帮助中心页面已加载');
        this.initEventListeners();
        this.loadContent(this.currentCategory);
    },

    initEventListeners() {
        // 导航点击事件
        document.querySelectorAll('.help-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.dataset.category;
                this.switchCategory(category);
            });
        });

        // 搜索功能
        const searchInput = document.getElementById('helpSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        // 搜索标签点击
        document.querySelectorAll('.search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                this.handleSearch();
            });
        });
    },

    switchCategory(category) {
        this.currentCategory = category;
        
        // 更新导航状态
        document.querySelectorAll('.help-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // 加载内容
        this.loadContent(category);
    },

    loadContent(category) {
        const content = this.getContentByCategory(category);
        const helpContent = document.getElementById('helpContent');
        if (helpContent) {
            helpContent.innerHTML = content;
            this.initContentInteractions();
        }
    },

    getContentByCategory(category) {
        const contents = {
            'getting-started': this.getGettingStartedContent(),
            'upload': this.getUploadContent(),
            'analysis': this.getAnalysisContent(),
            'patients': this.getPatientsContent(),
            'settings': this.getSettingsContent(),
            'faq': this.getFAQContent(),
            'contact': this.getContactContent()
        };
        
        return contents[category] || contents['getting-started'];
    },

    getGettingStartedContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">快速入门指南</h2>
                <p class="content-subtitle">欢迎使用AI医学影像分析平台，让我们帮助您快速上手</p>
                
                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3 class="step-title">系统概述</h3>
                            <p class="step-desc">AI医学影像分析平台是一个基于人工智能的医疗影像诊断辅助系统，支持CT、MRI、X-Ray等多种影像类型的自动分析。</p>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3 class="step-title">主要功能</h3>
                            <div class="feature-grid">
                                <div class="feature-item">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>影像上传</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-brain"></i>
                                    <span>AI分析</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-users"></i>
                                    <span>患者管理</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-archive"></i>
                                    <span>病例库</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3 class="step-title">使用流程</h3>
                            <div class="workflow">
                                <div class="workflow-step">
                                    <div class="workflow-icon">
                                        <i class="fas fa-upload"></i>
                                    </div>
                                    <div class="workflow-text">上传影像</div>
                                </div>
                                <div class="workflow-arrow">→</div>
                                <div class="workflow-step">
                                    <div class="workflow-icon">
                                        <i class="fas fa-cog"></i>
                                    </div>
                                    <div class="workflow-text">AI分析</div>
                                </div>
                                <div class="workflow-arrow">→</div>
                                <div class="workflow-step">
                                    <div class="workflow-icon">
                                        <i class="fas fa-file-medical"></i>
                                    </div>
                                    <div class="workflow-text">查看结果</div>
                                </div>
                                <div class="workflow-arrow">→</div>
                                <div class="workflow-step">
                                    <div class="workflow-icon">
                                        <i class="fas fa-user-md"></i>
                                    </div>
                                    <div class="workflow-text">医生诊断</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-info">
                    <i class="fas fa-info-circle mr-3"></i>
                    <div>
                        <strong>重要提示：</strong>AI分析结果仅供参考，最终诊断需要专业医生确认。
                    </div>
                </div>
            </div>
        `;
    },

    getUploadContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">影像上传指南</h2>
                <p class="content-subtitle">了解如何正确上传医学影像文件</p>
                
                <div class="guide-section">
                    <h3 class="guide-title">支持的文件格式</h3>
                    <div class="format-grid">
                        <div class="format-item">
                            <i class="fas fa-file-medical"></i>
                            <div class="format-name">DICOM</div>
                            <div class="format-desc">推荐格式，获得最佳分析效果</div>
                        </div>
                        <div class="format-item">
                            <i class="fas fa-file-image"></i>
                            <div class="format-name">JPEG/PNG</div>
                            <div class="format-desc">常见图像格式，支持基础分析</div>
                        </div>
                    </div>
                </div>
                
                <div class="guide-section">
                    <h3 class="guide-title">上传步骤</h3>
                    <ol class="step-list">
                        <li>点击"上传影像"按钮或拖拽文件到上传区域</li>
                        <li>选择要上传的影像文件（支持批量上传）</li>
                        <li>等待文件上传完成</li>
                        <li>系统自动开始AI分析</li>
                        <li>分析完成后查看结果</li>
                    </ol>
                </div>
                
                <div class="guide-section">
                    <h3 class="guide-title">注意事项</h3>
                    <div class="tips-grid">
                        <div class="tip-item">
                            <i class="fas fa-check text-green-400"></i>
                            <span>确保影像清晰，无遮挡</span>
                        </div>
                        <div class="tip-item">
                            <i class="fas fa-check text-green-400"></i>
                            <span>单个文件不超过50MB</span>
                        </div>
                        <div class="tip-item">
                            <i class="fas fa-check text-green-400"></i>
                            <span>单次最多上传10个文件</span>
                        </div>
                        <div class="tip-item">
                            <i class="fas fa-check text-green-400"></i>
                            <span>DICOM格式获得最佳效果</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getAnalysisContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">分析结果说明</h2>
                <p class="content-subtitle">了解如何解读AI分析结果</p>
                
                <div class="guide-section">
                    <h3 class="guide-title">结果组成</h3>
                    <div class="result-components">
                        <div class="component-item">
                            <div class="component-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div class="component-content">
                                <h4>AI分析摘要</h4>
                                <p>包含置信度、异常区域占比、检出疾病类型等关键信息</p>
                            </div>
                        </div>
                        <div class="component-item">
                            <div class="component-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="component-content">
                                <h4>异常发现</h4>
                                <p>详细列出检测到的异常区域，包括位置、大小、形态等</p>
                            </div>
                        </div>
                        <div class="component-item">
                            <div class="component-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div class="component-content">
                                <h4>诊断建议</h4>
                                <p>基于AI分析给出的初步诊断建议和后续处理意见</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="guide-section">
                    <h3 class="guide-title">风险等级说明</h3>
                    <div class="risk-levels">
                        <div class="risk-item risk-high">
                            <div class="risk-badge">高风险</div>
                            <div class="risk-desc">需要立即关注，建议进一步检查</div>
                        </div>
                        <div class="risk-item risk-medium">
                            <div class="risk-badge">中风险</div>
                            <div class="risk-desc">需要定期随访，建议3-6个月复查</div>
                        </div>
                        <div class="risk-item risk-low">
                            <div class="risk-badge">低风险</div>
                            <div class="risk-desc">良性可能性大，建议年度体检</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getPatientsContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">患者管理</h2>
                <p class="content-subtitle">学习如何有效管理患者信息</p>
                
                <div class="guide-section">
                    <h3 class="guide-title">新增患者</h3>
                    <ol class="step-list">
                        <li>点击"新增患者"按钮</li>
                        <li>填写患者基本信息（姓名、性别、年龄等）</li>
                        <li>添加联系方式和地址信息</li>
                        <li>记录相关病史（可选）</li>
                        <li>保存患者信息</li>
                    </ol>
                </div>
                
                <div class="guide-section">
                    <h3 class="guide-title">搜索和筛选</h3>
                    <div class="search-features">
                        <div class="feature-card">
                            <i class="fas fa-search"></i>
                            <h4>快速搜索</h4>
                            <p>支持按姓名、病历号、身份证号搜索</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-filter"></i>
                            <h4>条件筛选</h4>
                            <p>按性别、年龄范围、检查状态筛选</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-sort"></i>
                            <h4>排序功能</h4>
                            <p>按时间、姓名、状态等排序</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getSettingsContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">系统设置</h2>
                <p class="content-subtitle">个性化配置您的工作环境</p>
                
                <div class="settings-categories">
                    <div class="setting-category">
                        <h3 class="category-title">
                            <i class="fas fa-user-cog"></i>
                            账户设置
                        </h3>
                        <ul class="setting-list">
                            <li>修改个人信息</li>
                            <li>更改密码</li>
                            <li>设置头像</li>
                            <li>科室信息</li>
                        </ul>
                    </div>
                    
                    <div class="setting-category">
                        <h3 class="category-title">
                            <i class="fas fa-bell"></i>
                            通知设置
                        </h3>
                        <ul class="setting-list">
                            <li>邮件通知</li>
                            <li>系统消息</li>
                            <li>分析完成提醒</li>
                            <li>异常病例警报</li>
                        </ul>
                    </div>
                    
                    <div class="setting-category">
                        <h3 class="category-title">
                            <i class="fas fa-palette"></i>
                            界面设置
                        </h3>
                        <ul class="setting-list">
                            <li>主题选择</li>
                            <li>语言设置</li>
                            <li>字体大小</li>
                            <li>布局偏好</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    getFAQContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">常见问题</h2>
                <p class="content-subtitle">快速找到常见问题的解答</p>
                
                <div class="faq-container">
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>AI分析需要多长时间？</span>
                            <i class="fas fa-chevron-down faq-toggle"></i>
                        </div>
                        <div class="faq-answer">
                            <p>通常情况下，AI分析会在2-5分钟内完成。具体时间取决于影像文件的大小和复杂程度。</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>支持哪些影像格式？</span>
                            <i class="fas fa-chevron-down faq-toggle"></i>
                        </div>
                        <div class="faq-answer">
                            <p>系统支持DICOM、JPEG、PNG等格式。推荐使用DICOM格式以获得最佳分析效果。</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>AI分析结果的准确率如何？</span>
                            <i class="fas fa-chevron-down faq-toggle"></i>
                        </div>
                        <div class="faq-answer">
                            <p>我们的AI模型在大规模数据集上训练，准确率达到96.8%。但请注意，AI结果仅供参考，最终诊断需要专业医生确认。</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>如何保证数据安全？</span>
                            <i class="fas fa-chevron-down faq-toggle"></i>
                        </div>
                        <div class="faq-answer">
                            <p>我们采用端到端加密技术，所有数据传输和存储都经过加密处理。系统符合医疗数据安全标准。</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>可以批量上传文件吗？</span>
                            <i class="fas fa-chevron-down faq-toggle"></i>
                        </div>
                        <div class="faq-answer">
                            <p>是的，系统支持批量上传，单次最多可上传10个文件，每个文件不超过50MB。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getContactContent() {
        return `
            <div class="content-section">
                <h2 class="content-title">联系技术支持</h2>
                <p class="content-subtitle">我们随时为您提供帮助</p>
                
                <div class="contact-methods">
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <h3>电话支持</h3>
                        <p class="contact-info">400-123-4567</p>
                        <p class="contact-time">工作日 9:00-18:00</p>
                    </div>
                    
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <h3>邮件支持</h3>
                        <p class="contact-info">support@medai.com</p>
                        <p class="contact-time">24小时内回复</p>
                    </div>
                    
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3>在线客服</h3>
                        <p class="contact-info">即时聊天支持</p>
                        <p class="contact-time">工作日 9:00-18:00</p>
                    </div>
                </div>
                
                <div class="contact-form-section">
                    <h3 class="form-title">发送反馈</h3>
                    <form class="contact-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="input-field" required>
                            </div>
                            <div class="form-group">
                                <label>邮箱</label>
                                <input type="email" class="input-field" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>问题类型</label>
                            <select class="input-field">
                                <option>技术问题</option>
                                <option>功能建议</option>
                                <option>Bug报告</option>
                                <option>其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>详细描述</label>
                            <textarea class="input-field" rows="5" placeholder="请详细描述您遇到的问题..."></textarea>
                        </div>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-paper-plane mr-2"></i>发送反馈
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    initContentInteractions() {
        // FAQ折叠功能
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const toggle = question.querySelector('.faq-toggle');
                
                faqItem.classList.toggle('active');
                
                if (faqItem.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.style.transform = 'rotate(180deg)';
                } else {
                    answer.style.maxHeight = '0';
                    toggle.style.transform = 'rotate(0deg)';
                }
            });
        });

        // 联系表单提交
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('反馈已发送，我们会尽快回复您', 'success');
            });
        }

        // 搜索标签点击
        document.querySelectorAll('.search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const searchInput = document.getElementById('helpSearch');
                if (searchInput) {
                    searchInput.value = tag.textContent;
                    this.handleSearch();
                }
            });
        });
    },

    handleSearch() {
        const searchTerm = document.getElementById('helpSearch').value.toLowerCase();
        if (searchTerm.length < 2) return;

        // 简单的搜索逻辑，实际项目中可以实现更复杂的搜索
        const searchResults = this.searchContent(searchTerm);
        this.displaySearchResults(searchResults);
    },

    searchContent(term) {
        // 模拟搜索结果
        const allContent = [
            { title: '快速入门指南', category: 'getting-started', content: '系统概述、主要功能、使用流程' },
            { title: '影像上传', category: 'upload', content: 'DICOM格式、文件上传、批量处理' },
            { title: '分析结果', category: 'analysis', content: 'AI分析、异常发现、诊断建议' },
            { title: '患者管理', category: 'patients', content: '新增患者、搜索筛选、信息管理' }
        ];

        return allContent.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.content.toLowerCase().includes(term)
        );
    },

    displaySearchResults(results) {
        const helpContent = document.getElementById('helpContent');
        if (!helpContent) return;

        if (results.length === 0) {
            helpContent.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search text-4xl text-gray-600 mb-4"></i>
                    <h3 class="text-xl font-semibold text-white mb-2">未找到相关内容</h3>
                    <p class="text-gray-400">请尝试其他关键词或浏览帮助分类</p>
                </div>
            `;
            return;
        }

        helpContent.innerHTML = `
            <div class="search-results">
                <h2 class="content-title">搜索结果</h2>
                <p class="content-subtitle">找到 ${results.length} 个相关结果</p>
                <div class="results-list">
                    ${results.map(result => `
                        <div class="result-item" onclick="window.HelpPage.switchCategory('${result.category}')">
                            <h3 class="result-title">${result.title}</h3>
                            <p class="result-content">${result.content}</p>
                            <span class="result-category">${this.getCategoryName(result.category)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    getCategoryName(category) {
        const names = {
            'getting-started': '快速入门',
            'upload': '影像上传',
            'analysis': '分析结果',
            'patients': '患者管理',
            'settings': '系统设置',
            'faq': '常见问题',
            'contact': '联系支持'
        };
        return names[category] || category;
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// 添加帮助中心页面样式
const helpStyles = document.createElement('style');
helpStyles.textContent = `
    .search-tag {
        display: inline-block;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        color: #9CA3AF;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .search-tag:hover {
        background: rgba(38, 87, 253, 0.2);
        border-color: rgba(38, 87, 253, 0.3);
        color: #2657FD;
    }

    .help-nav {
        space-y: 2px;
    }

    .help-nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        color: #9CA3AF;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        margin-bottom: 4px;
    }

    .help-nav-item:hover,
    .help-nav-item.active {
        background: rgba(38, 87, 253, 0.1);
        color: #2657FD;
    }

    .content-title {
        font-size: 2rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 8px;
    }

    .content-subtitle {
        font-size: 1.125rem;
        color: #9CA3AF;
        margin-bottom: 32px;
    }

    .guide-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 16px;
    }

    .steps-container {
        space-y: 32px;
    }

    .step-item {
        display: flex;
        gap: 24px;
        align-items: flex-start;
    }

    .step-number {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #2657FD, #64B5F6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .step-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 8px;
    }

    .step-desc {
        color: #D1D5DB;
        line-height: 1.6;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-top: 16px;
    }

    .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .feature-item i {
        color: #2657FD;
        font-size: 1.25rem;
    }

    .workflow {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 24px;
        flex-wrap: wrap;
    }

    .workflow-step {
        text-align: center;
    }

    .workflow-icon {
        width: 64px;
        height: 64px;
        background: rgba(38, 87, 253, 0.1);
        border: 2px solid rgba(38, 87, 253, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 8px;
        color: #2657FD;
        font-size: 1.5rem;
    }

    .workflow-text {
        font-size: 0.875rem;
        color: #9CA3AF;
    }

    .workflow-arrow {
        color: #2657FD;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .alert {
        padding: 16px;
        border-radius: 8px;
        margin-top: 24px;
        display: flex;
        align-items: flex-start;
    }

    .alert-info {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93C5FD;
    }

    .faq-container {
        space-y: 16px;
    }

    .faq-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
    }

    .faq-question {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .faq-question:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .faq-question span {
        flex: 1;
        font-weight: 500;
        color: #ffffff;
    }

    .faq-toggle {
        transition: transform 0.3s ease;
        color: #9CA3AF;
    }

    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .faq-answer p {
        padding: 0 20px 20px;
        color: #D1D5DB;
        line-height: 1.6;
    }

    .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 48px;
    }

    .contact-card {
        text-align: center;
        padding: 32px 24px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .contact-card:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-4px);
    }

    .contact-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #2657FD, #64B5F6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 1.5rem;
        color: white;
    }

    .contact-card h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 8px;
    }

    .contact-info {
        font-size: 1.125rem;
        color: #2657FD;
        font-weight: 500;
        margin-bottom: 4px;
    }

    .contact-time {
        font-size: 0.875rem;
        color: #9CA3AF;
    }

    .contact-form-section {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 32px;
    }

    .form-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 24px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #D1D5DB;
        margin-bottom: 8px;
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .workflow {
            justify-content: center;
        }
        
        .workflow-arrow {
            display: none;
        }
    }
`;
document.head.appendChild(helpStyles);

window.HelpPage = HelpPage; 