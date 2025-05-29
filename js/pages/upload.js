/**
 * 影像上传页面模块 - 增强版
 */
const UploadPage = {
    uploadedFiles: [],
    uploadHistory: JSON.parse(localStorage.getItem('uploadHistory') || '[]'),
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10,
    
    render() {
        return `
            <div class="upload-container">
                <!-- 页面标题 -->
                <div class="page-header mb-8">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        <i class="fas fa-cloud-upload-alt text-primary mr-3"></i>影像上传
                    </h2>
                    <p class="text-gray-400">上传医学影像文件进行AI智能分析</p>
                </div>

                <!-- 上传区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- 主上传区域 -->
                    <div class="lg:col-span-2">
                        <div class="card hover-lift">
                            <div class="upload-zone" id="uploadZone">
                                <div class="upload-content">
                                    <div class="upload-icon">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-white mb-2">拖拽文件到此处</h3>
                                    <p class="text-gray-400 mb-4">或点击选择文件上传 (最多${this.maxFiles}个文件)</p>
                                    <div class="flex gap-3 justify-center">
                                        <button class="btn-primary" id="selectFileBtn">
                                            <i class="fas fa-folder-open mr-2"></i>选择文件
                                        </button>
                                        <button class="btn-outline" id="selectFolderBtn">
                                            <i class="fas fa-folder mr-2"></i>选择文件夹
                                        </button>
                                    </div>
                                    <input type="file" id="fileInput" multiple accept=".dcm,.jpg,.jpeg,.png" style="display: none;">
                                    <input type="file" id="folderInput" webkitdirectory multiple style="display: none;">
                                </div>
                                <div class="upload-progress" id="uploadProgress" style="display: none;">
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progressFill"></div>
                                    </div>
                                    <p class="progress-text" id="progressText">上传中... 0%</p>
                                </div>
                            </div>
                            
                            <!-- 支持格式说明 -->
                            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
                                <h4 class="text-sm font-medium text-white mb-3">支持的文件格式</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="flex items-center">
                                        <i class="fas fa-file-medical text-primary mr-2"></i>
                                        <span class="text-sm text-gray-300">DICOM (.dcm)</span>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-file-image text-primary mr-2"></i>
                                        <span class="text-sm text-gray-300">JPEG (.jpg, .jpeg)</span>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-file-image text-primary mr-2"></i>
                                        <span class="text-sm text-gray-300">PNG (.png)</span>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-info-circle text-primary mr-2"></i>
                                        <span class="text-sm text-gray-300">最大 50MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 侧边栏信息 -->
                    <div class="space-y-6">
                        <!-- 快速统计 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-chart-bar text-primary mr-2"></i>今日统计
                            </h3>
                            <div class="space-y-4" id="todayStats">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">已上传</span>
                                    <span class="text-white font-medium" id="uploadedCount">0 个文件</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">已分析</span>
                                    <span class="text-white font-medium" id="analyzedCount">0 个文件</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">队列中</span>
                                    <span class="text-yellow-400 font-medium" id="queueCount">0 个文件</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">总大小</span>
                                    <span class="text-white font-medium" id="totalSize">0 MB</span>
                                </div>
                            </div>
                        </div>

                        <!-- 上传提示 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-lightbulb text-primary mr-2"></i>上传提示
                            </h3>
                            <div class="space-y-3 text-sm text-gray-300">
                                <div class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span>确保影像清晰，无遮挡</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span>DICOM格式获得最佳分析效果</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span>单次最多上传${this.maxFiles}个文件</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span>分析结果将在2-5分钟内完成</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span>支持批量上传和文件夹上传</span>
                                </div>
                            </div>
                        </div>

                        <!-- 快捷操作 -->
                        <div class="card hover-lift">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                <i class="fas fa-bolt text-primary mr-2"></i>快捷操作
                            </h3>
                            <div class="space-y-3">
                                <button class="w-full btn-outline text-sm" id="pauseAllBtn">
                                    <i class="fas fa-pause mr-2"></i>暂停所有上传
                                </button>
                                <button class="w-full btn-outline text-sm" id="resumeAllBtn">
                                    <i class="fas fa-play mr-2"></i>恢复所有上传
                                </button>
                                <button class="w-full btn-outline text-sm" id="retryFailedBtn">
                                    <i class="fas fa-redo mr-2"></i>重试失败文件
                                </button>
                                <button class="w-full btn-outline text-sm" id="viewHistoryBtn">
                                    <i class="fas fa-history mr-2"></i>查看上传历史
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 已上传文件列表 -->
                <div class="mt-8">
                    <div class="card hover-lift">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-semibold text-white">
                                <i class="fas fa-list text-primary mr-2"></i>上传队列
                            </h3>
                            <div class="flex gap-3">
                                <button class="btn-outline" id="selectAllBtn">
                                    <i class="fas fa-check-square mr-2"></i>全选
                                </button>
                                <button class="btn-outline" id="clearSelectedBtn">
                                    <i class="fas fa-trash mr-2"></i>删除选中
                                </button>
                                <button class="btn-outline" id="clearAllBtn">
                                    <i class="fas fa-trash-alt mr-2"></i>清空队列
                                </button>
                            </div>
                        </div>
                        <div id="fileList" class="space-y-3">
                            <!-- 文件列表将动态生成 -->
                        </div>
                        <div id="emptyState" class="text-center py-12">
                            <i class="fas fa-inbox text-4xl text-gray-600 mb-4"></i>
                            <p class="text-gray-400">暂无上传文件</p>
                            <p class="text-gray-500 text-sm mt-2">拖拽文件到上方区域开始上传</p>
                        </div>
                    </div>
                </div>

                <!-- 文件预览模态框 -->
                <div id="previewModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden flex items-center justify-center">
                    <div class="bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
                        <div class="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 class="text-lg font-semibold text-white" id="previewTitle">文件预览</h3>
                            <button class="text-gray-400 hover:text-white" id="closePreviewBtn">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div class="p-4" id="previewContent">
                            <!-- 预览内容 -->
                        </div>
                    </div>
                </div>

                <!-- 上传历史模态框 -->
                <div id="historyModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden flex items-center justify-center">
                    <div class="bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
                        <div class="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 class="text-lg font-semibold text-white">上传历史</h3>
                            <button class="text-gray-400 hover:text-white" id="closeHistoryBtn">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div class="p-4 max-h-96 overflow-y-auto" id="historyContent">
                            <!-- 历史记录内容 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('影像上传页面已加载');
        this.initEventListeners();
        this.initDragAndDrop();
        this.updateFileList();
        this.updateStats();
        this.loadUploadHistory();
    },

    initEventListeners() {
        // 选择文件按钮
        const selectFileBtn = document.getElementById('selectFileBtn');
        const fileInput = document.getElementById('fileInput');
        
        if (selectFileBtn && fileInput) {
            selectFileBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }

        // 选择文件夹按钮
        const selectFolderBtn = document.getElementById('selectFolderBtn');
        const folderInput = document.getElementById('folderInput');
        
        if (selectFolderBtn && folderInput) {
            selectFolderBtn.addEventListener('click', () => {
                folderInput.click();
            });

            folderInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }

        // 批量操作按钮
        const selectAllBtn = document.getElementById('selectAllBtn');
        const clearSelectedBtn = document.getElementById('clearSelectedBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAllFiles();
            });
        }
        
        if (clearSelectedBtn) {
            clearSelectedBtn.addEventListener('click', () => {
                this.clearSelectedFiles();
            });
        }
        
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.clearAllFiles();
            });
        }

        // 快捷操作按钮
        const pauseAllBtn = document.getElementById('pauseAllBtn');
        const resumeAllBtn = document.getElementById('resumeAllBtn');
        const retryFailedBtn = document.getElementById('retryFailedBtn');
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');
        
        if (pauseAllBtn) {
            pauseAllBtn.addEventListener('click', () => {
                this.pauseAllUploads();
            });
        }
        
        if (resumeAllBtn) {
            resumeAllBtn.addEventListener('click', () => {
                this.resumeAllUploads();
            });
        }
        
        if (retryFailedBtn) {
            retryFailedBtn.addEventListener('click', () => {
                this.retryFailedUploads();
            });
        }
        
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', () => {
                this.showUploadHistory();
            });
        }

        // 模态框关闭按钮
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        const closeHistoryBtn = document.getElementById('closeHistoryBtn');
        const previewModal = document.getElementById('previewModal');
        const historyModal = document.getElementById('historyModal');
        
        if (closePreviewBtn && previewModal) {
            closePreviewBtn.addEventListener('click', () => {
                previewModal.classList.add('hidden');
            });
            
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    previewModal.classList.add('hidden');
                }
            });
        }
        
        if (closeHistoryBtn && historyModal) {
            closeHistoryBtn.addEventListener('click', () => {
                historyModal.classList.add('hidden');
            });
            
            historyModal.addEventListener('click', (e) => {
                if (e.target === historyModal) {
                    historyModal.classList.add('hidden');
                }
            });
        }
    },

    initDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');
        if (!uploadZone) return;

        let dragCounter = 0;

        // 创建全屏拖拽覆盖层
        const createDragOverlay = () => {
            const overlay = document.createElement('div');
            overlay.className = 'drag-overlay';
            overlay.innerHTML = `
                <div class="drag-overlay-content">
                    <i class="fas fa-cloud-upload-alt text-4xl text-primary mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">释放文件开始上传</h3>
                    <p class="text-gray-300">支持 DICOM、JPEG、PNG 格式</p>
                </div>
            `;
            return overlay;
        };

        // 全屏拖拽事件
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragCounter++;
            
            if (dragCounter === 1) {
                const overlay = createDragOverlay();
                document.body.appendChild(overlay);
            }
        });

        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragCounter--;
            
            if (dragCounter === 0) {
                const overlay = document.querySelector('.drag-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            dragCounter = 0;
            
            const overlay = document.querySelector('.drag-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            // 只在上传区域外处理文件
            if (!uploadZone.contains(e.target)) {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFiles(files);
                }
            }
        });

        // 上传区域特定的拖拽事件
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // 拖拽进入和离开的视觉反馈
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove('drag-over');
            });
        });

        // 处理文件拖拽到上传区域
        uploadZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
    },

    handleFiles(files) {
        const fileArray = Array.from(files);
        
        // 检查文件数量限制
        if (this.uploadedFiles.length + fileArray.length > this.maxFiles) {
            this.showToast(`最多只能上传${this.maxFiles}个文件，当前队列已有${this.uploadedFiles.length}个文件`, 'error');
            return;
        }
        
        // 验证文件
        const validFiles = fileArray.filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            this.showToast('请选择有效的文件格式', 'error');
            return;
        }

        if (validFiles.length !== fileArray.length) {
            this.showToast(`${fileArray.length - validFiles.length}个文件格式不支持，已跳过`, 'warning');
        }

        // 添加到上传队列
        validFiles.forEach(file => {
            const fileData = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size,
                status: 'pending', // pending, uploading, completed, error, paused
                progress: 0,
                uploadTime: new Date(),
                selected: false,
                retryCount: 0,
                maxRetries: 3
            };
            this.uploadedFiles.push(fileData);
        });

        this.updateFileList();
        this.updateStats();
        this.startUpload(validFiles);
        this.showToast(`成功添加${validFiles.length}个文件到上传队列`, 'success');
    },

    validateFile(file) {
        const allowedTypes = [
            'application/dicom',
            'image/jpeg',
            'image/jpg', 
            'image/png'
        ];
        
        const allowedExtensions = ['.dcm', '.jpg', '.jpeg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        // 检查文件类型
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            this.showToast(`不支持的文件格式: ${file.name}`, 'error');
            return false;
        }
        
        // 检查文件大小
        if (file.size > this.maxFileSize) {
            this.showToast(`文件过大: ${file.name} (最大${this.formatFileSize(this.maxFileSize)})`, 'error');
            return false;
        }
        
        // 检查文件是否已存在
        const existingFile = this.uploadedFiles.find(f => f.name === file.name && f.size === file.size);
        if (existingFile) {
            this.showToast(`文件已存在: ${file.name}`, 'warning');
            return false;
        }
        
        return true;
    },

    startUpload(files) {
        files.forEach((file, index) => {
            setTimeout(() => {
                this.uploadFile(file);
            }, index * 1000); // 错开上传时间
        });
    },

    uploadFile(file) {
        const fileData = this.uploadedFiles.find(f => f.file === file);
        if (!fileData || fileData.status === 'paused') return;

        fileData.status = 'uploading';
        fileData.uploadStartTime = new Date();
        this.updateFileList();
        this.updateStats();

        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
            // 检查是否被暂停
            if (fileData.status === 'paused') {
                clearInterval(interval);
                return;
            }
            
            progress += Math.random() * 15;
            
            // 模拟随机错误（5%概率）
            if (Math.random() < 0.05 && progress > 30 && progress < 90) {
                clearInterval(interval);
                fileData.status = 'error';
                fileData.retryCount++;
                this.updateFileList();
                this.updateStats();
                this.showToast(`${file.name} 上传失败`, 'error');
                return;
            }
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                fileData.status = 'completed';
                fileData.progress = 100;
                fileData.uploadEndTime = new Date();
                
                // 添加到历史记录
                this.addToHistory(fileData);
                
                this.updateFileList();
                this.updateStats();
                this.showToast(`${file.name} 上传完成`, 'success');
            } else {
                fileData.progress = Math.floor(progress);
                this.updateFileList();
            }
        }, 200);
        
        // 保存interval引用以便暂停
        fileData.uploadInterval = interval;
    },

    updateFileList() {
        const fileList = document.getElementById('fileList');
        const emptyState = document.getElementById('emptyState');
        
        if (!fileList || !emptyState) return;

        if (this.uploadedFiles.length === 0) {
            fileList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        fileList.style.display = 'block';
        emptyState.style.display = 'none';

        fileList.innerHTML = this.uploadedFiles.map(file => `
            <div class="file-item p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors ${file.selected ? 'border-primary bg-gray-700' : ''}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" class="file-checkbox" data-file-id="${file.id}" ${file.selected ? 'checked' : ''}>
                        <div class="file-icon cursor-pointer" onclick="window.UploadPage.previewFile('${file.id}')">
                            ${this.getFileIcon(file.name)}
                        </div>
                        <div>
                            <h4 class="text-white font-medium cursor-pointer hover:text-primary" onclick="window.UploadPage.previewFile('${file.id}')">${file.name}</h4>
                            <p class="text-sm text-gray-400">${this.formatFileSize(file.size)} • ${this.formatTime(file.uploadTime)}</p>
                            ${file.uploadEndTime ? `<p class="text-xs text-green-400">完成时间: ${this.formatTime(file.uploadEndTime)}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="status-badge">
                            ${this.getStatusBadge(file.status)}
                        </div>
                        <div class="flex space-x-2">
                            ${file.status === 'uploading' ? `
                                <button class="text-yellow-400 hover:text-yellow-300 transition-colors" onclick="window.UploadPage.pauseFile('${file.id}')" title="暂停">
                                    <i class="fas fa-pause"></i>
                                </button>
                            ` : ''}
                            ${file.status === 'paused' ? `
                                <button class="text-green-400 hover:text-green-300 transition-colors" onclick="window.UploadPage.resumeFile('${file.id}')" title="恢复">
                                    <i class="fas fa-play"></i>
                                </button>
                            ` : ''}
                            ${file.status === 'error' ? `
                                <button class="text-blue-400 hover:text-blue-300 transition-colors" onclick="window.UploadPage.retryFile('${file.id}')" title="重试">
                                    <i class="fas fa-redo"></i>
                                </button>
                            ` : ''}
                            <button class="text-gray-400 hover:text-red-400 transition-colors" onclick="window.UploadPage.removeFile('${file.id}')" title="删除">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                ${file.status === 'uploading' || file.status === 'paused' ? `
                    <div class="mt-3">
                        <div class="flex items-center justify-between text-sm mb-1">
                            <span class="text-gray-400">上传进度</span>
                            <span class="text-white">${file.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${file.status === 'paused' ? 'bg-yellow-500' : ''}" style="width: ${file.progress}%"></div>
                        </div>
                        ${file.status === 'paused' ? '<p class="text-xs text-yellow-400 mt-1">已暂停</p>' : ''}
                    </div>
                ` : ''}
                ${file.status === 'error' && file.retryCount > 0 ? `
                    <div class="mt-2">
                        <p class="text-xs text-red-400">重试次数: ${file.retryCount}/${file.maxRetries}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // 添加复选框事件监听器
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const fileId = e.target.dataset.fileId;
                const file = this.uploadedFiles.find(f => f.id == fileId);
                if (file) {
                    file.selected = e.target.checked;
                    this.updateFileList();
                }
            });
        });
    },

    getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'dcm': '<i class="fas fa-file-medical text-primary text-xl"></i>',
            'jpg': '<i class="fas fa-file-image text-blue-400 text-xl"></i>',
            'jpeg': '<i class="fas fa-file-image text-blue-400 text-xl"></i>',
            'png': '<i class="fas fa-file-image text-green-400 text-xl"></i>'
        };
        return iconMap[extension] || '<i class="fas fa-file text-gray-400 text-xl"></i>';
    },

    getStatusBadge(status) {
        const statusMap = {
            'pending': '<span class="badge badge-info">等待中</span>',
            'uploading': '<span class="badge badge-warning">上传中</span>',
            'completed': '<span class="badge badge-success">已完成</span>',
            'error': '<span class="badge badge-error">失败</span>',
            'paused': '<span class="badge bg-yellow-900 text-yellow-300">已暂停</span>'
        };
        return statusMap[status] || '';
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatTime(date) {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.id != fileId);
        this.updateFileList();
        this.showToast('文件已移除', 'info');
    },

    clearAllFiles() {
        if (this.uploadedFiles.length === 0) return;
        
        if (confirm('确定要清空所有文件吗？')) {
            this.uploadedFiles = [];
            this.updateFileList();
            this.showToast('队列已清空', 'info');
        }
    },

    showToast(message, type = 'info') {
        if (window.animationManager) {
            window.animationManager.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    },

    updateStats() {
        const uploadedCount = this.uploadedFiles.filter(f => f.status === 'completed').length;
        const analyzedCount = Math.floor(uploadedCount * 0.8); // 模拟分析完成数
        const queueCount = this.uploadedFiles.filter(f => ['pending', 'uploading', 'paused'].includes(f.status)).length;
        const totalSize = this.uploadedFiles.reduce((sum, f) => sum + f.size, 0);
        
        const uploadedCountEl = document.getElementById('uploadedCount');
        const analyzedCountEl = document.getElementById('analyzedCount');
        const queueCountEl = document.getElementById('queueCount');
        const totalSizeEl = document.getElementById('totalSize');
        
        if (uploadedCountEl) uploadedCountEl.textContent = `${uploadedCount} 个文件`;
        if (analyzedCountEl) analyzedCountEl.textContent = `${analyzedCount} 个文件`;
        if (queueCountEl) queueCountEl.textContent = `${queueCount} 个文件`;
        if (totalSizeEl) totalSizeEl.textContent = this.formatFileSize(totalSize);
    },

    loadUploadHistory() {
        this.uploadHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    },

    selectAllFiles() {
        const hasSelected = this.uploadedFiles.some(f => f.selected);
        this.uploadedFiles.forEach(file => {
            file.selected = !hasSelected;
        });
        this.updateFileList();
        this.showToast(hasSelected ? '已取消全选' : '已全选所有文件', 'info');
    },

    clearSelectedFiles() {
        const selectedFiles = this.uploadedFiles.filter(f => f.selected);
        if (selectedFiles.length === 0) {
            this.showToast('请先选择要删除的文件', 'warning');
            return;
        }
        
        if (confirm(`确定要删除选中的${selectedFiles.length}个文件吗？`)) {
            this.uploadedFiles = this.uploadedFiles.filter(f => !f.selected);
            this.updateFileList();
            this.updateStats();
            this.showToast(`已删除${selectedFiles.length}个文件`, 'success');
        }
    },

    pauseAllUploads() {
        const uploadingFiles = this.uploadedFiles.filter(f => f.status === 'uploading');
        uploadingFiles.forEach(file => {
            file.status = 'paused';
            if (file.uploadInterval) {
                clearInterval(file.uploadInterval);
            }
        });
        this.updateFileList();
        this.updateStats();
        this.showToast(`已暂停${uploadingFiles.length}个上传任务`, 'info');
    },

    resumeAllUploads() {
        const pausedFiles = this.uploadedFiles.filter(f => f.status === 'paused');
        pausedFiles.forEach(file => {
            this.uploadFile(file.file);
        });
        this.showToast(`已恢复${pausedFiles.length}个上传任务`, 'info');
    },

    retryFailedUploads() {
        const failedFiles = this.uploadedFiles.filter(f => f.status === 'error');
        if (failedFiles.length === 0) {
            this.showToast('没有失败的上传任务', 'info');
            return;
        }
        
        failedFiles.forEach(file => {
            if (file.retryCount < file.maxRetries) {
                file.status = 'pending';
                file.progress = 0;
                this.uploadFile(file.file);
            }
        });
        this.showToast(`正在重试${failedFiles.length}个失败任务`, 'info');
    },

    showUploadHistory() {
        const historyModal = document.getElementById('historyModal');
        const historyContent = document.getElementById('historyContent');
        
        if (!historyModal || !historyContent) return;
        
        if (this.uploadHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-history text-4xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400">暂无上传历史</p>
                </div>
            `;
        } else {
            historyContent.innerHTML = `
                <div class="space-y-3">
                    ${this.uploadHistory.slice(-20).reverse().map(item => `
                        <div class="p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="file-icon">
                                        ${this.getFileIcon(item.name)}
                                    </div>
                                    <div>
                                        <h4 class="text-white font-medium">${item.name}</h4>
                                        <p class="text-sm text-gray-400">${this.formatFileSize(item.size)}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-green-400">上传成功</p>
                                    <p class="text-xs text-gray-500">${this.formatDateTime(new Date(item.uploadTime))}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        historyModal.classList.remove('hidden');
    },

    previewFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id == fileId);
        if (!file) return;
        
        const previewModal = document.getElementById('previewModal');
        const previewTitle = document.getElementById('previewTitle');
        const previewContent = document.getElementById('previewContent');
        
        if (!previewModal || !previewTitle || !previewContent) return;
        
        previewTitle.textContent = `预览 - ${file.name}`;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            // 图片预览
            const reader = new FileReader();
            reader.onload = (e) => {
                previewContent.innerHTML = `
                    <div class="text-center">
                        <img src="${e.target.result}" alt="${file.name}" class="max-w-full max-h-96 mx-auto rounded-lg">
                        <div class="mt-4 p-4 bg-gray-800 rounded-lg text-left">
                            <h4 class="text-white font-medium mb-2">文件信息</h4>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-400">文件名:</span>
                                    <span class="text-white ml-2">${file.name}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">文件大小:</span>
                                    <span class="text-white ml-2">${this.formatFileSize(file.size)}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">上传时间:</span>
                                    <span class="text-white ml-2">${this.formatDateTime(file.uploadTime)}</span>
                                </div>
                                <div>
                                    <span class="text-gray-400">状态:</span>
                                    <span class="ml-2">${this.getStatusBadge(file.status)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file.file);
        } else {
            // 其他文件类型显示信息
            previewContent.innerHTML = `
                <div class="text-center">
                    <div class="text-6xl text-gray-600 mb-4">
                        ${this.getFileIcon(file.name)}
                    </div>
                    <h3 class="text-xl text-white mb-4">${file.name}</h3>
                    <div class="p-4 bg-gray-800 rounded-lg text-left">
                        <h4 class="text-white font-medium mb-2">文件信息</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-400">文件类型:</span>
                                <span class="text-white ml-2">${fileExtension.toUpperCase()}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">文件大小:</span>
                                <span class="text-white ml-2">${this.formatFileSize(file.size)}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">上传时间:</span>
                                <span class="text-white ml-2">${this.formatDateTime(file.uploadTime)}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">状态:</span>
                                <span class="ml-2">${this.getStatusBadge(file.status)}</span>
                            </div>
                        </div>
                        ${fileExtension === 'dcm' ? `
                            <div class="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded border border-blue-700">
                                <p class="text-blue-300 text-sm">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    DICOM文件包含医学影像数据，需要专业软件查看详细内容
                                </p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        previewModal.classList.remove('hidden');
    },

    pauseFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id == fileId);
        if (file && file.status === 'uploading') {
            file.status = 'paused';
            if (file.uploadInterval) {
                clearInterval(file.uploadInterval);
            }
            this.updateFileList();
            this.updateStats();
            this.showToast(`已暂停 ${file.name}`, 'info');
        }
    },

    resumeFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id == fileId);
        if (file && file.status === 'paused') {
            this.uploadFile(file.file);
            this.showToast(`已恢复 ${file.name}`, 'info');
        }
    },

    retryFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id == fileId);
        if (file && file.status === 'error' && file.retryCount < file.maxRetries) {
            file.retryCount++;
            file.status = 'pending';
            file.progress = 0;
            this.uploadFile(file.file);
            this.showToast(`正在重试 ${file.name} (${file.retryCount}/${file.maxRetries})`, 'info');
        } else if (file && file.retryCount >= file.maxRetries) {
            this.showToast(`${file.name} 已达到最大重试次数`, 'error');
        }
    },

    addToHistory(fileData) {
        const historyItem = {
            name: fileData.name,
            size: fileData.size,
            uploadTime: fileData.uploadEndTime || new Date(),
            status: 'completed'
        };
        
        this.uploadHistory.push(historyItem);
        
        // 只保留最近100条记录
        if (this.uploadHistory.length > 100) {
            this.uploadHistory = this.uploadHistory.slice(-100);
        }
        
        localStorage.setItem('uploadHistory', JSON.stringify(this.uploadHistory));
    },

    formatDateTime(date) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
};

// 添加上传区域样式
const uploadStyles = document.createElement('style');
uploadStyles.textContent = `
    .upload-zone {
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 48px 24px;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .upload-zone:hover,
    .upload-zone.drag-over {
        border-color: #2657FD;
        background: rgba(38, 87, 253, 0.05);
    }

    .upload-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #2657FD, #64B5F6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        font-size: 2rem;
        color: white;
    }

    .progress-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2657FD, #64B5F6);
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .file-item {
        animation: slideInLeft 0.3s ease-out;
    }

    .file-item.selected {
        border-color: #2657FD !important;
        background: rgba(38, 87, 253, 0.1) !important;
    }

    .file-checkbox {
        width: 18px;
        height: 18px;
        accent-color: #2657FD;
        cursor: pointer;
        appearance: none;
        border: 2px solid #4B5563;
        border-radius: 4px;
        background: #1F2937;
        position: relative;
        transition: all 0.2s ease;
    }

    .file-checkbox:checked {
        background: #2657FD;
        border-color: #2657FD;
    }

    .file-checkbox:checked::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }

    .file-checkbox:hover {
        border-color: #2657FD;
        background: rgba(38, 87, 253, 0.1);
    }

    .file-icon {
        transition: transform 0.2s ease;
    }

    .file-icon:hover {
        transform: scale(1.1);
    }

    /* 模态框样式 */
    .modal-backdrop {
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    }

    .modal-content {
        animation: slideInUp 0.3s ease;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 按钮悬停效果 */
    .btn-outline:hover {
        background: rgba(38, 87, 253, 0.1);
        border-color: #2657FD;
        color: #2657FD;
    }

    /* 状态指示器 */
    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
    }

    .status-indicator.uploading {
        background: #F59E0B;
        animation: pulse 2s infinite;
    }

    .status-indicator.completed {
        background: #10B981;
    }

    .status-indicator.error {
        background: #EF4444;
    }

    .status-indicator.paused {
        background: #F59E0B;
    }

    /* 拖拽提示 */
    .drag-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(38, 87, 253, 0.1);
        border: 3px dashed #2657FD;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        pointer-events: none;
    }

    .drag-overlay-content {
        background: rgba(0, 0, 0, 0.8);
        padding: 32px;
        border-radius: 16px;
        text-align: center;
        color: white;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .upload-zone {
            padding: 32px 16px;
        }
        
        .upload-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
        }
        
        .file-item {
            padding: 16px;
        }
        
        .file-item .flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
        
        .modal-content {
            margin: 16px;
            max-width: calc(100vw - 32px);
        }
    }

    /* 工具提示 */
    [title] {
        position: relative;
    }

    [title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 4px;
    }

    /* 加载动画 */
    .loading-dots {
        display: inline-block;
    }

    .loading-dots::after {
        content: '';
        animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
        0%, 20% { content: ''; }
        40% { content: '.'; }
        60% { content: '..'; }
        80%, 100% { content: '...'; }
    }
`;
document.head.appendChild(uploadStyles);

window.UploadPage = UploadPage; 