/**
 * 患者管理页面模块 - 现代化重构版本
 */
const PatientsPage = {
    patients: [],
    filteredPatients: [],
    currentPage: 1,
    pageSize: 10,
    
    render() {
        return `
            <div class="patients-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-2">
                                <i class="fas fa-users text-primary mr-3"></i>患者管理
                            </h2>
                            <p class="text-gray-400">管理患者信息与病历档案</p>
                        </div>
                        <button id="addPatientBtn" class="btn-primary">
                            <i class="fas fa-user-plus mr-2"></i>新增患者
                        </button>
                    </div>
                </div>

                <!-- 搜索和筛选区域 -->
                <div class="card hover-lift mb-8">
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div class="lg:col-span-2">
                            <label class="block text-sm font-medium text-gray-300 mb-2">搜索患者</label>
                            <div class="relative">
                                <input type="text" id="searchInput" placeholder="搜索患者姓名、病历号、身份证号..." class="input-field pl-10">
                                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">性别筛选</label>
                            <select id="genderFilter" class="input-field">
                                <option value="">全部性别</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">年龄范围</label>
                            <select id="ageFilter" class="input-field">
                                <option value="">全部年龄</option>
                                <option value="0-18">0-18岁</option>
                                <option value="19-35">19-35岁</option>
                                <option value="36-60">36-60岁</option>
                                <option value="60+">60岁以上</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 患者列表 -->
                <div class="card hover-lift">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-white">
                            <i class="fas fa-list text-primary mr-2"></i>患者列表
                        </h3>
                        <div class="flex items-center space-x-4">
                            <span class="text-sm text-gray-400">共 <span id="totalCount">0</span> 位患者</span>
                            <div class="flex items-center space-x-2">
                                <button class="btn-outline text-sm">
                                    <i class="fas fa-download mr-2"></i>导出
                                </button>
                                <button class="btn-outline text-sm">
                                    <i class="fas fa-filter mr-2"></i>高级筛选
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700">
                                    <th class="text-left py-3 px-4 text-gray-300 font-medium">
                                        <input type="checkbox" id="selectAll" class="mr-2">
                                        患者信息
                                    </th>
                                    <th class="text-left py-3 px-4 text-gray-300 font-medium">联系方式</th>
                                    <th class="text-left py-3 px-4 text-gray-300 font-medium">最近检查</th>
                                    <th class="text-left py-3 px-4 text-gray-300 font-medium">状态</th>
                                    <th class="text-left py-3 px-4 text-gray-300 font-medium">操作</th>
                                </tr>
                            </thead>
                            <tbody id="patientsTableBody">
                                <!-- 患者数据将动态生成 -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- 分页 -->
                    <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                        <div class="text-sm text-gray-400">
                            显示第 <span id="startIndex">1</span>-<span id="endIndex">10</span> 条，共 <span id="totalItems">0</span> 条记录
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

            <!-- 新增/编辑患者模态框 -->
            <div id="patientModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle" class="text-xl font-semibold text-white">新增患者</h3>
                        <button id="closeModal" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="patientForm" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">患者姓名 *</label>
                                    <input type="text" id="patientName" class="input-field" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">身份证号</label>
                                    <input type="text" id="patientIdCard" class="input-field" maxlength="18">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">性别 *</label>
                                    <select id="patientGender" class="input-field" required>
                                        <option value="">请选择性别</option>
                                        <option value="男">男</option>
                                        <option value="女">女</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">出生日期</label>
                                    <input type="date" id="patientBirthDate" class="input-field">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">联系电话 *</label>
                                    <input type="tel" id="patientPhone" class="input-field" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">紧急联系人</label>
                                    <input type="text" id="emergencyContact" class="input-field">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">家庭地址</label>
                                <textarea id="patientAddress" rows="3" class="input-field" placeholder="请输入详细地址..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">病史备注</label>
                                <textarea id="medicalHistory" rows="3" class="input-field" placeholder="请输入相关病史信息..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="cancelBtn" class="btn-outline">取消</button>
                        <button type="submit" form="patientForm" id="saveBtn" class="btn-primary">
                            <i class="fas fa-save mr-2"></i>保存
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('患者管理页面已加载');
        this.loadMockData();
        this.initEventListeners();
        this.renderPatientsList();
    },

    initEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        // 筛选功能
        const genderFilter = document.getElementById('genderFilter');
        const ageFilter = document.getElementById('ageFilter');
        if (genderFilter) genderFilter.addEventListener('change', () => this.handleFilter());
        if (ageFilter) ageFilter.addEventListener('change', () => this.handleFilter());

        // 新增患者按钮
        const addPatientBtn = document.getElementById('addPatientBtn');
        if (addPatientBtn) {
            addPatientBtn.addEventListener('click', () => this.openModal());
        }

        // 模态框相关
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

        // 表单提交
        const patientForm = document.getElementById('patientForm');
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // 全选功能
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.handleSelectAll(e));
        }

        // 分页功能
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        if (prevPage) prevPage.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        if (nextPage) nextPage.addEventListener('click', () => this.goToPage(this.currentPage + 1));
    },

    loadMockData() {
        this.patients = [
            {
                id: 'P2023061587',
                name: '李某某',
                gender: '男',
                age: 45,
                phone: '138****5678',
                idCard: '110101197801011234',
                address: '北京市朝阳区某某街道',
                lastExam: '2023-06-15',
                status: 'normal',
                emergencyContact: '王某某',
                medicalHistory: '高血压病史3年'
            },
            {
                id: 'P2023061588',
                name: '王某某',
                gender: '女',
                age: 38,
                phone: '139****1234',
                idCard: '110101198501011234',
                address: '北京市海淀区某某小区',
                lastExam: '2023-06-14',
                status: 'follow-up',
                emergencyContact: '李某某',
                medicalHistory: '无特殊病史'
            },
            {
                id: 'P2023061589',
                name: '张某某',
                gender: '男',
                age: 52,
                phone: '137****9876',
                idCard: '110101197101011234',
                address: '北京市西城区某某胡同',
                lastExam: '2023-06-13',
                status: 'abnormal',
                emergencyContact: '张女士',
                medicalHistory: '糖尿病病史5年，吸烟史20年'
            }
        ];
        this.filteredPatients = [...this.patients];
    },

    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.filteredPatients = this.patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.id.toLowerCase().includes(searchTerm) ||
            patient.phone.includes(searchTerm) ||
            patient.idCard.includes(searchTerm)
        );
        this.currentPage = 1;
        this.renderPatientsList();
    },

    handleFilter() {
        const genderFilter = document.getElementById('genderFilter').value;
        const ageFilter = document.getElementById('ageFilter').value;
        
        this.filteredPatients = this.patients.filter(patient => {
            let matches = true;
            
            if (genderFilter && patient.gender !== genderFilter) {
                matches = false;
            }
            
            if (ageFilter && matches) {
                const age = patient.age;
                switch (ageFilter) {
                    case '0-18':
                        matches = age <= 18;
                        break;
                    case '19-35':
                        matches = age >= 19 && age <= 35;
                        break;
                    case '36-60':
                        matches = age >= 36 && age <= 60;
                        break;
                    case '60+':
                        matches = age > 60;
                        break;
                }
            }
            
            return matches;
        });
        
        this.currentPage = 1;
        this.renderPatientsList();
    },

    renderPatientsList() {
        const tbody = document.getElementById('patientsTableBody');
        const totalCount = document.getElementById('totalCount');
        
        if (!tbody || !totalCount) return;

        // 更新总数
        totalCount.textContent = this.filteredPatients.length;

        // 计算分页
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredPatients.length);
        const currentPageData = this.filteredPatients.slice(startIndex, endIndex);

        // 渲染表格
        tbody.innerHTML = currentPageData.map(patient => `
            <tr class="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" class="patient-checkbox" data-id="${patient.id}">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-white"></i>
                            </div>
                            <div>
                                <div class="font-medium text-white">${patient.name}</div>
                                <div class="text-sm text-gray-400">${patient.id} | ${patient.gender} | ${patient.age}岁</div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <div class="text-white">${patient.phone}</div>
                    <div class="text-sm text-gray-400">${patient.address}</div>
                </td>
                <td class="py-4 px-4">
                    <div class="text-white">${patient.lastExam}</div>
                    <div class="text-sm text-gray-400">胸部CT</div>
                </td>
                <td class="py-4 px-4">
                    ${this.getStatusBadge(patient.status)}
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-2">
                        <button class="action-btn" onclick="window.PatientsPage.viewPatient('${patient.id}')" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="window.PatientsPage.editPatient('${patient.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn text-red-400 hover:text-red-300" onclick="window.PatientsPage.deletePatient('${patient.id}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // 更新分页信息
        this.updatePagination();
    },

    getStatusBadge(status) {
        const statusMap = {
            'normal': '<span class="badge badge-success">正常</span>',
            'follow-up': '<span class="badge badge-warning">待复查</span>',
            'abnormal': '<span class="badge badge-error">异常</span>'
        };
        return statusMap[status] || '<span class="badge badge-info">未知</span>';
    },

    updatePagination() {
        const totalItems = this.filteredPatients.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize + 1;
        const endIndex = Math.min(this.currentPage * this.pageSize, totalItems);

        // 更新分页信息
        document.getElementById('startIndex').textContent = startIndex;
        document.getElementById('endIndex').textContent = endIndex;
        document.getElementById('totalItems').textContent = totalItems;

        // 更新按钮状态
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

        // 生成页码
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
                    onclick="window.PatientsPage.goToPage(${page})">
                ${page}
            </button>
        `).join('');
    },

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderPatientsList();
        }
    },

    openModal(patient = null) {
        const modal = document.getElementById('patientModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (patient) {
            modalTitle.textContent = '编辑患者';
            this.fillForm(patient);
        } else {
            modalTitle.textContent = '新增患者';
            this.clearForm();
        }
        
        modal.classList.add('active');
    },

    closeModal() {
        const modal = document.getElementById('patientModal');
        modal.classList.remove('active');
        this.clearForm();
    },

    fillForm(patient) {
        document.getElementById('patientName').value = patient.name || '';
        document.getElementById('patientIdCard').value = patient.idCard || '';
        document.getElementById('patientGender').value = patient.gender || '';
        document.getElementById('patientPhone').value = patient.phone || '';
        document.getElementById('emergencyContact').value = patient.emergencyContact || '';
        document.getElementById('patientAddress').value = patient.address || '';
        document.getElementById('medicalHistory').value = patient.medicalHistory || '';
    },

    clearForm() {
        document.getElementById('patientForm').reset();
    },

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('patientName').value,
            idCard: document.getElementById('patientIdCard').value,
            gender: document.getElementById('patientGender').value,
            phone: document.getElementById('patientPhone').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            address: document.getElementById('patientAddress').value,
            medicalHistory: document.getElementById('medicalHistory').value
        };

        // 简单验证
        if (!formData.name || !formData.gender || !formData.phone) {
            this.showToast('请填写必填字段', 'error');
            return;
        }

        // 模拟保存
        this.savePatient(formData);
    },

    savePatient(patientData) {
        // 生成新的患者ID
        const newId = 'P' + Date.now();
        const newPatient = {
            id: newId,
            ...patientData,
            age: this.calculateAge(patientData.birthDate),
            lastExam: '-',
            status: 'normal'
        };

        this.patients.unshift(newPatient);
        this.filteredPatients = [...this.patients];
        this.renderPatientsList();
        this.closeModal();
        this.showToast('患者信息已保存', 'success');
    },

    calculateAge(birthDate) {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },

    viewPatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            console.log('查看患者详情:', patient);
            this.showToast(`查看患者 ${patient.name} 的详细信息`, 'info');
        }
    },

    editPatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            this.openModal(patient);
        }
    },

    deletePatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient && confirm(`确定要删除患者 ${patient.name} 吗？`)) {
            this.patients = this.patients.filter(p => p.id !== patientId);
            this.filteredPatients = this.filteredPatients.filter(p => p.id !== patientId);
            this.renderPatientsList();
            this.showToast('患者已删除', 'success');
        }
    },

    handleSelectAll(e) {
        const checkboxes = document.querySelectorAll('.patient-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// 添加患者管理页面样式
const patientsStyles = document.createElement('style');
patientsStyles.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .modal.active {
        opacity: 1;
        visibility: visible;
    }

    .modal-content {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .modal.active .modal-content {
        transform: scale(1);
    }

    .modal-header {
        padding: 24px 24px 0;
        display: flex;
        align-items: center;
        justify-content: between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 24px;
    }

    .modal-body {
        padding: 0 24px;
    }

    .modal-footer {
        padding: 24px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 24px;
    }

    .action-btn {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: #9CA3AF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-btn:hover {
        background: rgba(38, 87, 253, 0.2);
        border-color: rgba(38, 87, 253, 0.3);
        color: #2657FD;
    }

    .page-btn {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: #9CA3AF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
    }

    .page-btn:hover,
    .page-btn.active {
        background: #2657FD;
        border-color: #2657FD;
        color: white;
    }
`;
document.head.appendChild(patientsStyles);

window.PatientsPage = PatientsPage; 