/**
 * 分析结果页面模块 - 现代化重构版本
 */
const AnalysisPage = {
    currentCase: null,
    
    render() {
        return `
            <div class="analysis-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        <i class="fas fa-search text-primary mr-3"></i>分析结果
                    </h2>
                    <p class="text-gray-400">AI智能分析结果与诊断建议</p>
                </div>

                <!-- 患者信息卡片 -->
                <div class="card hover-lift mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-white">
                            <i class="fas fa-user-circle text-primary mr-2"></i>患者信息
                        </h3>
                        <div class="flex items-center space-x-2">
                            <span class="badge badge-success">已完成分析</span>
                            <button class="btn-outline text-sm">
                                <i class="fas fa-download mr-2"></i>导出报告
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label class="text-sm text-gray-400">患者姓名</label>
                            <p class="text-white font-medium">李某某</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">性别/年龄</label>
                            <p class="text-white font-medium">男 / 45岁</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">病历号</label>
                            <p class="text-white font-medium">P2023061587</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">检查日期</label>
                            <p class="text-white font-medium">2023-06-15</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">检查类型</label>
                            <p class="text-white font-medium">胸部CT平扫</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">设备型号</label>
                            <p class="text-white font-medium">Siemens SOMATOM</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">主治医生</label>
                            <p class="text-white font-medium">张医生</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">分析时间</label>
                            <p class="text-white font-medium">14:30:25</p>
                        </div>
                    </div>
                </div>

                <!-- 主要分析区域 -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    <!-- 影像视图 -->
                    <div class="xl:col-span-2 card hover-lift">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-semibold text-white">
                                <i class="fas fa-image text-primary mr-2"></i>影像视图
                            </h3>
                            <div class="flex items-center space-x-2">
                                <button class="image-tool-btn" title="放大">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button class="image-tool-btn" title="缩小">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <button class="image-tool-btn" title="测量">
                                    <i class="fas fa-ruler"></i>
                                </button>
                                <button class="image-tool-btn" title="标注">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="image-tool-btn" title="重置">
                                    <i class="fas fa-undo"></i>
                                </button>
                            </div>
                        </div>
                        <div class="image-viewer">
                            <div class="image-container">
                                <img src="https://via.placeholder.com/800x600/1a1a1a/ffffff?text=CT+影像" alt="CT影像" class="medical-image">
                                <div class="image-overlay">
                                    <!-- AI标注区域 -->
                                    <div class="annotation annotation-1" style="top: 30%; left: 40%;">
                                        <div class="annotation-marker"></div>
                                        <div class="annotation-label">结节 0.8cm</div>
                                    </div>
                                    <div class="annotation annotation-2" style="top: 60%; left: 25%;">
                                        <div class="annotation-marker"></div>
                                        <div class="annotation-label">钙化灶 0.3cm</div>
                                    </div>
                                </div>
                            </div>
                            <div class="image-info">
                                <div class="flex items-center justify-between text-sm text-gray-400">
                                    <span>层厚: 1.0mm | 窗宽: 400 | 窗位: 40</span>
                                    <span>第 45/120 层</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AI分析摘要 -->
                    <div class="space-y-6">
                        <!-- 分析概览 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-brain text-primary mr-2"></i>AI分析摘要
                            </h3>
                            <div class="space-y-4">
                                <div class="analysis-metric">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-gray-300">置信度</span>
                                        <span class="text-white font-semibold">92%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 92%"></div>
                                    </div>
                                </div>
                                <div class="analysis-metric">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-gray-300">异常区域占比</span>
                                        <span class="text-white font-semibold">15%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill bg-yellow-500" style="width: 15%"></div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span class="badge badge-error">肺结节</span>
                                    <span class="badge badge-warning">钙化灶</span>
                                    <span class="badge badge-info">肺气肿</span>
                                </div>
                            </div>
                        </div>

                        <!-- 关键指标 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-chart-bar text-primary mr-2"></i>关键指标
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="metric-item">
                                    <div class="metric-value">2</div>
                                    <div class="metric-label">结节数量</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">0.8cm</div>
                                    <div class="metric-label">最大结节</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">-45 HU</div>
                                    <div class="metric-label">平均密度</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">12%</div>
                                    <div class="metric-label">恶性概率</div>
                                </div>
                            </div>
                        </div>

                        <!-- 风险评估 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-exclamation-triangle text-primary mr-2"></i>风险评估
                            </h3>
                            <div class="risk-assessment">
                                <div class="risk-level risk-medium">
                                    <div class="risk-icon">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div class="risk-content">
                                        <div class="risk-title">中等风险</div>
                                        <div class="risk-desc">建议3个月后复查</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 详细分析结果 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- 异常发现 -->
                    <div class="card hover-lift">
                        <h3 class="text-lg font-semibold text-white mb-6">
                            <i class="fas fa-search text-primary mr-2"></i>异常发现
                        </h3>
                        <div class="space-y-4">
                            <div class="finding-item finding-high">
                                <div class="finding-header">
                                    <div class="finding-title">右肺上叶结节</div>
                                    <span class="badge badge-error">高风险</span>
                                </div>
                                <div class="finding-details">
                                    <div class="detail-row">
                                        <span class="detail-label">尺寸:</span>
                                        <span class="detail-value">0.8cm</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">密度:</span>
                                        <span class="detail-value">-25 HU</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">形态:</span>
                                        <span class="detail-value">不规则</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="finding-item finding-medium">
                                <div class="finding-header">
                                    <div class="finding-title">左肺下叶钙化灶</div>
                                    <span class="badge badge-warning">中风险</span>
                                </div>
                                <div class="finding-details">
                                    <div class="detail-row">
                                        <span class="detail-label">尺寸:</span>
                                        <span class="detail-value">0.3cm</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">密度:</span>
                                        <span class="detail-value">180 HU</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">形态:</span>
                                        <span class="detail-value">规则</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="finding-item finding-low">
                                <div class="finding-header">
                                    <div class="finding-title">轻度肺气肿改变</div>
                                    <span class="badge badge-success">低风险</span>
                                </div>
                                <div class="finding-details">
                                    <div class="detail-row">
                                        <span class="detail-label">范围:</span>
                                        <span class="detail-value">局限性</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">程度:</span>
                                        <span class="detail-value">轻度</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AI诊断建议 -->
                    <div class="card hover-lift">
                        <h3 class="text-lg font-semibold text-white mb-6">
                            <i class="fas fa-lightbulb text-primary mr-2"></i>AI诊断建议
                        </h3>
                        <div class="space-y-4">
                            <div class="suggestion-item suggestion-warning">
                                <div class="suggestion-icon">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="suggestion-content">
                                    <h4 class="suggestion-title">右肺上叶结节 (0.8cm)</h4>
                                    <p class="suggestion-desc">该结节具有中度恶性风险特征，建议3个月后复查CT或进一步行PET-CT检查</p>
                                </div>
                            </div>
                            
                            <div class="suggestion-item suggestion-info">
                                <div class="suggestion-icon">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="suggestion-content">
                                    <h4 class="suggestion-title">左肺下叶钙化灶 (0.3cm)</h4>
                                    <p class="suggestion-desc">考虑为良性钙化灶，建议年度随访观察</p>
                                </div>
                            </div>
                            
                            <div class="suggestion-item suggestion-success">
                                <div class="suggestion-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="suggestion-content">
                                    <h4 class="suggestion-title">轻度肺气肿改变</h4>
                                    <p class="suggestion-desc">与吸烟史相关，建议戒烟并定期肺功能检查</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 医生诊断区域 -->
                <div class="card hover-lift">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-white">
                            <i class="fas fa-user-md text-primary mr-2"></i>医生诊断意见
                        </h3>
                        <div class="flex items-center space-x-2 text-sm text-gray-400">
                            <i class="fas fa-clock mr-1"></i>
                            <span>最后更新: 2023-06-15 15:30</span>
                        </div>
                    </div>
                    <form id="diagnosisForm" class="space-y-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">诊断结论</label>
                                <select id="diagnosisConclusion" class="input-field">
                                    <option value="">请选择诊断结论</option>
                                    <option value="benign">考虑良性病变，建议随访</option>
                                    <option value="suspicious">可疑恶性，建议进一步检查</option>
                                    <option value="malignant">高度怀疑恶性，建议活检</option>
                                    <option value="other">其他</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">随访建议</label>
                                <select id="followUpSuggestion" class="input-field">
                                    <option value="">请选择随访建议</option>
                                    <option value="3months">3个月后复查</option>
                                    <option value="6months">6个月后复查</option>
                                    <option value="1year">1年后复查</option>
                                    <option value="immediate">立即进一步检查</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">详细诊断意见</label>
                            <textarea id="diagnosisDetails" rows="4" class="input-field" placeholder="请输入详细的诊断意见和建议..."></textarea>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <label class="flex items-center">
                                    <input type="checkbox" id="confirmDiagnosis" class="mr-2">
                                    <span class="text-sm text-gray-300">确认诊断结果</span>
                                </label>
                            </div>
                            <div class="flex items-center space-x-3">
                                <button type="button" class="btn-outline">
                                    <i class="fas fa-save mr-2"></i>保存草稿
                                </button>
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-check mr-2"></i>确认诊断
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    init() {
        console.log('分析结果页面已加载');
        this.initEventListeners();
        this.initImageViewer();
        this.loadCaseData();
    },

    initEventListeners() {
        // 诊断表单提交
        const diagnosisForm = document.getElementById('diagnosisForm');
        if (diagnosisForm) {
            diagnosisForm.addEventListener('submit', (e) => this.handleDiagnosisSubmit(e));
        }

        // 图像工具按钮
        document.querySelectorAll('.image-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleImageTool(e));
        });

        // 保存草稿按钮
        const saveDraftBtn = document.querySelector('button[type="button"]');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => this.saveDraft());
        }
    },

    initImageViewer() {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;

        // 添加鼠标滚轮缩放功能
        imageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const img = imageContainer.querySelector('.medical-image');
            const scale = e.deltaY > 0 ? 0.9 : 1.1;
            const currentTransform = img.style.transform || 'scale(1)';
            const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
            const newScale = Math.max(0.5, Math.min(3, currentScale * scale));
            img.style.transform = `scale(${newScale})`;
        });

        // 添加拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        imageContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const img = imageContainer.querySelector('.medical-image');
            const rect = img.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            imageContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const img = imageContainer.querySelector('.medical-image');
            img.style.left = `${deltaX}px`;
            img.style.top = `${deltaY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            imageContainer.style.cursor = 'grab';
        });
    },

    handleImageTool(e) {
        const tool = e.currentTarget.querySelector('i').className;
        
        if (tool.includes('search-plus')) {
            this.zoomImage(1.2);
        } else if (tool.includes('search-minus')) {
            this.zoomImage(0.8);
        } else if (tool.includes('ruler')) {
            this.toggleMeasureTool();
        } else if (tool.includes('pen')) {
            this.toggleAnnotationTool();
        } else if (tool.includes('undo')) {
            this.resetImageView();
        }
    },

    zoomImage(factor) {
        const img = document.querySelector('.medical-image');
        if (!img) return;
        
        const currentTransform = img.style.transform || 'scale(1)';
        const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
        const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
        img.style.transform = `scale(${newScale})`;
    },

    toggleMeasureTool() {
        console.log('测量工具已激活');
        this.showToast('测量工具已激活，点击图像进行测量', 'info');
    },

    toggleAnnotationTool() {
        console.log('标注工具已激活');
        this.showToast('标注工具已激活，点击图像进行标注', 'info');
    },

    resetImageView() {
        const img = document.querySelector('.medical-image');
        if (!img) return;
        
        img.style.transform = 'scale(1)';
        img.style.left = '0';
        img.style.top = '0';
        this.showToast('图像视图已重置', 'info');
    },

    handleDiagnosisSubmit(e) {
        e.preventDefault();
        
        const conclusion = document.getElementById('diagnosisConclusion').value;
        const followUp = document.getElementById('followUpSuggestion').value;
        const details = document.getElementById('diagnosisDetails').value;
        const confirmed = document.getElementById('confirmDiagnosis').checked;
        
        if (!conclusion) {
            this.showToast('请选择诊断结论', 'error');
            return;
        }
        
        if (!confirmed) {
            this.showToast('请确认诊断结果', 'error');
            return;
        }
        
        // 模拟保存诊断
        this.saveDiagnosis({
            conclusion,
            followUp,
            details,
            confirmed,
            timestamp: new Date().toISOString()
        });
    },

    saveDiagnosis(diagnosisData) {
        console.log('保存诊断数据:', diagnosisData);
        this.showToast('诊断意见已保存', 'success');
        
        // 可以在这里添加实际的保存逻辑
        // 例如发送到服务器API
    },

    saveDraft() {
        const conclusion = document.getElementById('diagnosisConclusion').value;
        const followUp = document.getElementById('followUpSuggestion').value;
        const details = document.getElementById('diagnosisDetails').value;
        
        console.log('保存草稿:', { conclusion, followUp, details });
        this.showToast('草稿已保存', 'info');
    },

    loadCaseData() {
        // 模拟加载病例数据
        this.currentCase = {
            id: 'CT20230615001',
            patientName: '李某某',
            patientId: 'P2023061587',
            examDate: '2023-06-15',
            examType: '胸部CT平扫',
            findings: [
                {
                    type: '肺结节',
                    location: '右肺上叶',
                    size: '0.8cm',
                    density: '-25 HU',
                    risk: 'high'
                },
                {
                    type: '钙化灶',
                    location: '左肺下叶',
                    size: '0.3cm',
                    density: '180 HU',
                    risk: 'medium'
                }
            ]
        };
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// 添加分析页面样式
const analysisStyles = document.createElement('style');
analysisStyles.textContent = `
    .image-viewer {
        background: #1a1a1a;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .image-container {
        position: relative;
        height: 500px;
        overflow: hidden;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .medical-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
        position: relative;
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }

    .annotation {
        position: absolute;
        pointer-events: auto;
    }

    .annotation-marker {
        width: 12px;
        height: 12px;
        background: #2657FD;
        border: 2px solid white;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
    }

    .annotation-label {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
    }

    .image-info {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .image-tool-btn {
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #9CA3AF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .image-tool-btn:hover {
        background: rgba(38, 87, 253, 0.2);
        border-color: rgba(38, 87, 253, 0.3);
        color: #2657FD;
    }

    .analysis-metric {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric-item {
        text-align: center;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2657FD;
        margin-bottom: 4px;
    }

    .metric-label {
        font-size: 0.875rem;
        color: #9CA3AF;
    }

    .risk-assessment {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .risk-level {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .risk-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .risk-medium .risk-icon {
        background: rgba(245, 158, 11, 0.2);
        color: #F59E0B;
    }

    .risk-title {
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 2px;
    }

    .risk-desc {
        font-size: 0.875rem;
        color: #9CA3AF;
    }

    .finding-item {
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid;
        background: rgba(255, 255, 255, 0.05);
    }

    .finding-high {
        border-left-color: #EF4444;
        background: rgba(239, 68, 68, 0.1);
    }

    .finding-medium {
        border-left-color: #F59E0B;
        background: rgba(245, 158, 11, 0.1);
    }

    .finding-low {
        border-left-color: #10B981;
        background: rgba(16, 185, 129, 0.1);
    }

    .finding-header {
        display: flex;
        align-items: center;
        justify-content: between;
        margin-bottom: 12px;
    }

    .finding-title {
        font-weight: 600;
        color: #ffffff;
        flex: 1;
    }

    .finding-details {
        space-y: 8px;
    }

    .detail-row {
        display: flex;
        justify-content: between;
        font-size: 0.875rem;
    }

    .detail-label {
        color: #9CA3AF;
        min-width: 60px;
    }

    .detail-value {
        color: #ffffff;
        font-weight: 500;
    }

    .suggestion-item {
        display: flex;
        gap: 12px;
        padding: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .suggestion-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        flex-shrink: 0;
    }

    .suggestion-warning .suggestion-icon {
        background: rgba(245, 158, 11, 0.2);
        color: #F59E0B;
    }

    .suggestion-info .suggestion-icon {
        background: rgba(59, 130, 246, 0.2);
        color: #3B82F6;
    }

    .suggestion-success .suggestion-icon {
        background: rgba(16, 185, 129, 0.2);
        color: #10B981;
    }

    .suggestion-title {
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 4px;
    }

    .suggestion-desc {
        font-size: 0.875rem;
        color: #9CA3AF;
        line-height: 1.5;
    }
`;
document.head.appendChild(analysisStyles);

window.AnalysisPage = AnalysisPage; 