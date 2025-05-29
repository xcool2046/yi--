/**
 * 病例库页面模块 - 现代化重构版本
 */
const CasesPage = {
    cases: [],
    filteredCases: [],
    currentPage: 1,
    pageSize: 9,
    viewMode: 'grid', // grid 或 list
    
    render() {
        return `
            <div class="cases-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-2">
                                <i class="fas fa-archive text-primary mr-3"></i>病例库
                            </h2>
                            <p class="text-gray-400">历史病例档案与诊断记录</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="view-toggle">
                                <button id="gridView" class="view-btn active" title="网格视图">
                                    <i class="fas fa-th-large"></i>
                                </button>
                                <button id="listView" class="view-btn" title="列表视图">
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                            <button class="btn-outline">
                                <i class="fas fa-download mr-2"></i>导出报告
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 筛选区域 -->
                <div class="card hover-lift mb-8">
                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">疾病类型</label>
                            <select id="diseaseFilter" class="input-field">
                                <option value="">全部疾病</option>
                                <option value="肺结节">肺结节</option>
                                <option value="肺炎">肺炎</option>
                                <option value="肺气肿">肺气肿</option>
                                <option value="肺癌">肺癌</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">风险等级</label>
                            <select id="riskFilter" class="input-field">
                                <option value="">全部风险</option>
                                <option value="高风险">高风险</option>
                                <option value="中风险">中风险</option>
                                <option value="低风险">低风险</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">检查类型</label>
                            <select id="examFilter" class="input-field">
                                <option value="">全部类型</option>
                                <option value="胸部CT">胸部CT</option>
                                <option value="头部MRI">头部MRI</option>
                                <option value="腹部CT">腹部CT</option>
                                <option value="X光片">X光片</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">日期范围</label>
                            <select id="dateFilter" class="input-field">
                                <option value="">全部时间</option>
                                <option value="today">今天</option>
                                <option value="week">本周</option>
                                <option value="month">本月</option>
                                <option value="quarter">本季度</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button id="resetFilters" class="btn-outline w-full">
                                <i class="fas fa-undo mr-2"></i>重置筛选
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-folder-open"></i>
                        </div>
                        <div class="stat-value" id="totalCases">0</div>
                        <div class="stat-label">总病例数</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-value" id="highRiskCases">0</div>
                        <div class="stat-label">高风险病例</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div class="stat-value" id="todayCases">0</div>
                        <div class="stat-label">今日新增</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-value" id="completedCases">0</div>
                        <div class="stat-label">已完成诊断</div>
                    </div>
                </div>

                <!-- 病例列表 -->
                <div class="card hover-lift">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-white">
                            <i class="fas fa-list text-primary mr-2"></i>病例列表
                        </h3>
                        <div class="flex items-center space-x-4">
                            <span class="text-sm text-gray-400">共 <span id="filteredCount">0</span> 个病例</span>
                            <div class="relative">
                                <input type="text" id="searchInput" placeholder="搜索病例..." class="input-field pl-10 pr-4 py-2 w-64">
                                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 病例内容区域 -->
                    <div id="casesContent">
                        <!-- 内容将动态生成 -->
                    </div>
                    
                    <!-- 分页 -->
                    <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                        <div class="text-sm text-gray-400">
                            显示第 <span id="startIndex">1</span>-<span id="endIndex">9</span> 条，共 <span id="totalItems">0</span> 条记录
                        </div>
                        <div class="flex items-center space-x-2">
                            <button id="prevPage" class="btn-outline text-sm" disabled>
                                <i class="fas fa-chevron-left mr-1"></i>上一页
                            </button>
                            <div id="pageNumbers" class="flex items-center space-x-1">
                                <!-- 页码将动态生成 -->
                            </div>
                            <button id="nextPage" class="btn-outline text-sm">
                                下一页<i class="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 病例详情模态框 -->
            <div id="caseModal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3 id="caseModalTitle" class="text-xl font-semibold text-white">病例详情</h3>
                        <button id="closeCaseModal" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="caseModalBody">
                        <!-- 病例详情内容将动态生成 -->
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('病例库页面已加载');
        this.loadMockData();
        this.initEventListeners();
        this.renderCasesList();
        this.updateStatistics();
    },

    initEventListeners() {
        // 视图切换
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        if (gridView) gridView.addEventListener('click', () => this.switchView('grid'));
        if (listView) listView.addEventListener('click', () => this.switchView('list'));

        // 筛选功能
        ['diseaseFilter', 'riskFilter', 'examFilter', 'dateFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('change', () => this.handleFilter());
        });

        // 重置筛选
        const resetFilters = document.getElementById('resetFilters');
        if (resetFilters) resetFilters.addEventListener('click', () => this.resetFilters());

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        // 分页功能
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        if (prevPage) prevPage.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        if (nextPage) nextPage.addEventListener('click', () => this.goToPage(this.currentPage + 1));

        // 模态框关闭
        const closeCaseModal = document.getElementById('closeCaseModal');
        if (closeCaseModal) closeCaseModal.addEventListener('click', () => this.closeCaseModal());
    },

    loadMockData() {
        this.cases = [
            {
                id: 'CT20230615001',
                patientName: '李某某',
                patientId: 'P2023061587',
                age: 45,
                gender: '男',
                examType: '胸部CT',
                examDate: '2023-06-15',
                disease: '肺结节',
                riskLevel: '高风险',
                status: 'completed',
                findings: '右肺上叶发现0.8cm结节，形态不规则',
                diagnosis: '建议进一步检查',
                doctor: '张医生',
                imageUrl: 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=CT+影像'
            },
            {
                id: 'CT20230614002',
                patientName: '王某某',
                patientId: 'P2023061588',
                age: 38,
                gender: '女',
                examType: '胸部CT',
                examDate: '2023-06-14',
                disease: '肺炎',
                riskLevel: '低风险',
                status: 'completed',
                findings: '双肺散在炎症病灶',
                diagnosis: '考虑病毒性肺炎，建议抗炎治疗',
                doctor: '李医生',
                imageUrl: 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=CT+影像'
            },
            {
                id: 'CT20230613003',
                patientName: '张某某',
                patientId: 'P2023061589',
                age: 52,
                gender: '男',
                examType: '胸部CT',
                examDate: '2023-06-13',
                disease: '肺气肿',
                riskLevel: '中风险',
                status: 'completed',
                findings: '双肺弥漫性肺气肿改变',
                diagnosis: '与长期吸烟史相关',
                doctor: '王医生',
                imageUrl: 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=CT+影像'
            }
        ];
        this.filteredCases = [...this.cases];
    },

    switchView(mode) {
        this.viewMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + 'View').classList.add('active');
        
        this.renderCasesList();
    },

    handleFilter() {
        const diseaseFilter = document.getElementById('diseaseFilter').value;
        const riskFilter = document.getElementById('riskFilter').value;
        const examFilter = document.getElementById('examFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        this.filteredCases = this.cases.filter(caseItem => {
            let matches = true;
            
            if (diseaseFilter && caseItem.disease !== diseaseFilter) matches = false;
            if (riskFilter && caseItem.riskLevel !== riskFilter) matches = false;
            if (examFilter && caseItem.examType !== examFilter) matches = false;
            
            if (dateFilter && matches) {
                const examDate = new Date(caseItem.examDate);
                const today = new Date();
                
                switch (dateFilter) {
                    case 'today':
                        matches = examDate.toDateString() === today.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matches = examDate >= weekAgo;
                        break;
                    case 'month':
                        matches = examDate.getMonth() === today.getMonth() && 
                                 examDate.getFullYear() === today.getFullYear();
                        break;
                    case 'quarter':
                        const quarter = Math.floor(today.getMonth() / 3);
                        const caseQuarter = Math.floor(examDate.getMonth() / 3);
                        matches = quarter === caseQuarter && 
                                 examDate.getFullYear() === today.getFullYear();
                        break;
                }
            }
            
            return matches;
        });
        
        this.currentPage = 1;
        this.renderCasesList();
        this.updateStatistics();
    },

    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        this.filteredCases = this.cases.filter(caseItem =>
            caseItem.patientName.toLowerCase().includes(searchTerm) ||
            caseItem.id.toLowerCase().includes(searchTerm) ||
            caseItem.disease.toLowerCase().includes(searchTerm) ||
            caseItem.findings.toLowerCase().includes(searchTerm)
        );
        
        this.currentPage = 1;
        this.renderCasesList();
    },

    resetFilters() {
        document.getElementById('diseaseFilter').value = '';
        document.getElementById('riskFilter').value = '';
        document.getElementById('examFilter').value = '';
        document.getElementById('dateFilter').value = '';
        document.getElementById('searchInput').value = '';
        
        this.filteredCases = [...this.cases];
        this.currentPage = 1;
        this.renderCasesList();
        this.updateStatistics();
    },

    renderCasesList() {
        const casesContent = document.getElementById('casesContent');
        const filteredCount = document.getElementById('filteredCount');
        
        if (!casesContent || !filteredCount) return;

        filteredCount.textContent = this.filteredCases.length;

        // 计算分页
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredCases.length);
        const currentPageData = this.filteredCases.slice(startIndex, endIndex);

        if (this.viewMode === 'grid') {
            casesContent.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    ${currentPageData.map(caseItem => this.renderCaseCard(caseItem)).join('')}
                </div>
            `;
        } else {
            casesContent.innerHTML = `
                <div class="space-y-4">
                    ${currentPageData.map(caseItem => this.renderCaseListItem(caseItem)).join('')}
                </div>
            `;
        }

        this.updatePagination();
    },

    renderCaseCard(caseItem) {
        return `
            <div class="case-card hover-lift cursor-pointer" onclick="window.CasesPage.viewCaseDetail('${caseItem.id}')">
                <div class="case-image">
                    <img src="${caseItem.imageUrl}" alt="医学影像" class="w-full h-48 object-cover">
                    <div class="case-overlay">
                        <button class="view-btn-overlay">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="case-info">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="case-title">${caseItem.id}</h4>
                        ${this.getRiskBadge(caseItem.riskLevel)}
                    </div>
                    <div class="case-patient">
                        <i class="fas fa-user mr-2"></i>
                        ${caseItem.patientName} | ${caseItem.gender} | ${caseItem.age}岁
                    </div>
                    <div class="case-exam">
                        <i class="fas fa-stethoscope mr-2"></i>
                        ${caseItem.examType} | ${caseItem.examDate}
                    </div>
                    <div class="case-disease">
                        <span class="disease-tag">${caseItem.disease}</span>
                    </div>
                    <p class="case-findings">${caseItem.findings}</p>
                    <div class="case-footer">
                        <span class="case-doctor">
                            <i class="fas fa-user-md mr-1"></i>
                            ${caseItem.doctor}
                        </span>
                        <span class="case-status ${caseItem.status}">
                            ${caseItem.status === 'completed' ? '已完成' : '进行中'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    },

    renderCaseListItem(caseItem) {
        return `
            <div class="case-list-item hover-lift cursor-pointer" onclick="window.CasesPage.viewCaseDetail('${caseItem.id}')">
                <div class="flex items-center space-x-4">
                    <div class="case-image-small">
                        <img src="${caseItem.imageUrl}" alt="医学影像" class="w-16 h-16 object-cover rounded-lg">
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="case-title">${caseItem.id}</h4>
                            ${this.getRiskBadge(caseItem.riskLevel)}
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div class="case-info-item">
                                <span class="label">患者:</span>
                                <span class="value">${caseItem.patientName}</span>
                            </div>
                            <div class="case-info-item">
                                <span class="label">检查:</span>
                                <span class="value">${caseItem.examType}</span>
                            </div>
                            <div class="case-info-item">
                                <span class="label">日期:</span>
                                <span class="value">${caseItem.examDate}</span>
                            </div>
                            <div class="case-info-item">
                                <span class="label">医生:</span>
                                <span class="value">${caseItem.doctor}</span>
                            </div>
                        </div>
                        <p class="case-findings mt-2">${caseItem.findings}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="disease-tag">${caseItem.disease}</span>
                        <button class="action-btn" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getRiskBadge(riskLevel) {
        const riskMap = {
            '高风险': 'badge-error',
            '中风险': 'badge-warning',
            '低风险': 'badge-success'
        };
        const badgeClass = riskMap[riskLevel] || 'badge-info';
        return `<span class="badge ${badgeClass}">${riskLevel}</span>`;
    },

    updatePagination() {
        const totalItems = this.filteredCases.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize + 1;
        const endIndex = Math.min(this.currentPage * this.pageSize, totalItems);

        document.getElementById('startIndex').textContent = startIndex;
        document.getElementById('endIndex').textContent = endIndex;
        document.getElementById('totalItems').textContent = totalItems;

        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

        this.renderPageNumbers(totalPages);
    },

    renderPageNumbers(totalPages) {
        const pageNumbers = document.getElementById('pageNumbers');
        if (!pageNumbers) return;

        let pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            pages = Array.from({length: totalPages}, (_, i) => i + 1);
        } else {
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(totalPages, start + maxVisible - 1);
            pages = Array.from({length: end - start + 1}, (_, i) => start + i);
        }

        pageNumbers.innerHTML = pages.map(page => `
            <button class="page-btn ${page === this.currentPage ? 'active' : ''}" 
                    onclick="window.CasesPage.goToPage(${page})">
                ${page}
            </button>
        `).join('');
    },

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredCases.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderCasesList();
        }
    },

    updateStatistics() {
        const totalCases = this.cases.length;
        const highRiskCases = this.cases.filter(c => c.riskLevel === '高风险').length;
        const todayCases = this.cases.filter(c => c.examDate === new Date().toISOString().split('T')[0]).length;
        const completedCases = this.cases.filter(c => c.status === 'completed').length;

        document.getElementById('totalCases').textContent = totalCases;
        document.getElementById('highRiskCases').textContent = highRiskCases;
        document.getElementById('todayCases').textContent = todayCases;
        document.getElementById('completedCases').textContent = completedCases;
    },

    viewCaseDetail(caseId) {
        const caseItem = this.cases.find(c => c.id === caseId);
        if (!caseItem) return;

        const modal = document.getElementById('caseModal');
        const modalTitle = document.getElementById('caseModalTitle');
        const modalBody = document.getElementById('caseModalBody');

        modalTitle.textContent = `病例详情 - ${caseItem.id}`;
        modalBody.innerHTML = this.renderCaseDetail(caseItem);
        modal.classList.add('active');
    },

    renderCaseDetail(caseItem) {
        return `
            <div class="case-detail">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 class="text-lg font-semibold text-white mb-4">患者信息</h4>
                        <div class="space-y-3">
                            <div class="detail-row">
                                <span class="detail-label">患者姓名:</span>
                                <span class="detail-value">${caseItem.patientName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">病历号:</span>
                                <span class="detail-value">${caseItem.patientId}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">性别年龄:</span>
                                <span class="detail-value">${caseItem.gender} / ${caseItem.age}岁</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">检查类型:</span>
                                <span class="detail-value">${caseItem.examType}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">检查日期:</span>
                                <span class="detail-value">${caseItem.examDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">主治医生:</span>
                                <span class="detail-value">${caseItem.doctor}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold text-white mb-4">诊断信息</h4>
                        <div class="space-y-3">
                            <div class="detail-row">
                                <span class="detail-label">疾病类型:</span>
                                <span class="disease-tag">${caseItem.disease}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">风险等级:</span>
                                ${this.getRiskBadge(caseItem.riskLevel)}
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">诊断状态:</span>
                                <span class="badge ${caseItem.status === 'completed' ? 'badge-success' : 'badge-warning'}">
                                    ${caseItem.status === 'completed' ? '已完成' : '进行中'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8">
                    <h4 class="text-lg font-semibold text-white mb-4">影像资料</h4>
                    <div class="case-image-large">
                        <img src="${caseItem.imageUrl}" alt="医学影像" class="w-full max-w-2xl mx-auto rounded-lg">
                    </div>
                </div>
                
                <div class="mt-8">
                    <h4 class="text-lg font-semibold text-white mb-4">检查发现</h4>
                    <p class="text-gray-300 leading-relaxed">${caseItem.findings}</p>
                </div>
                
                <div class="mt-8">
                    <h4 class="text-lg font-semibold text-white mb-4">诊断意见</h4>
                    <p class="text-gray-300 leading-relaxed">${caseItem.diagnosis}</p>
                </div>
            </div>
        `;
    },

    closeCaseModal() {
        const modal = document.getElementById('caseModal');
        modal.classList.remove('active');
    }
};

// 添加病例库页面样式
const casesStyles = document.createElement('style');
casesStyles.textContent = `
    .view-toggle {
        display: flex;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 4px;
    }

    .view-btn {
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: #9CA3AF;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .view-btn.active,
    .view-btn:hover {
        background: #2657FD;
        color: white;
    }

    .case-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .case-image {
        position: relative;
        overflow: hidden;
    }

    .case-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .case-card:hover .case-overlay {
        opacity: 1;
    }

    .view-btn-overlay {
        width: 48px;
        height: 48px;
        background: #2657FD;
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .view-btn-overlay:hover {
        transform: scale(1.1);
    }

    .case-info {
        padding: 20px;
    }

    .case-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #ffffff;
    }

    .case-patient,
    .case-exam {
        font-size: 0.875rem;
        color: #9CA3AF;
        margin-bottom: 8px;
    }

    .case-disease {
        margin: 12px 0;
    }

    .disease-tag {
        display: inline-block;
        padding: 4px 8px;
        background: rgba(38, 87, 253, 0.2);
        color: #2657FD;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .case-findings {
        font-size: 0.875rem;
        color: #D1D5DB;
        line-height: 1.5;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .case-footer {
        display: flex;
        align-items: center;
        justify-content: between;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .case-doctor {
        font-size: 0.75rem;
        color: #9CA3AF;
    }

    .case-status {
        font-size: 0.75rem;
        font-weight: 500;
    }

    .case-status.completed {
        color: #10B981;
    }

    .case-list-item {
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .case-info-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .case-info-item .label {
        color: #9CA3AF;
        min-width: 40px;
    }

    .case-info-item .value {
        color: #ffffff;
        font-weight: 500;
    }

    .modal.large .modal-content {
        max-width: 1200px;
    }

    .case-detail .detail-row {
        display: flex;
        align-items: center;
        justify-content: between;
        padding: 8px 0;
    }

    .case-detail .detail-label {
        color: #9CA3AF;
        min-width: 100px;
    }

    .case-detail .detail-value {
        color: #ffffff;
        font-weight: 500;
    }

    .case-image-large {
        text-align: center;
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
    }
`;
document.head.appendChild(casesStyles);

window.CasesPage = CasesPage; 