/**
 * 表单验证工具
 * 提供各种验证规则和实用函数
 */
class ValidationUtils {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^1[3-9]\d{9}$/,
            username: /^[a-zA-Z0-9_-]{3,20}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
            idCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
        };
        
        this.messages = {
            required: '此字段为必填项',
            email: '请输入有效的邮箱地址',
            phone: '请输入有效的手机号码',
            username: '用户名只能包含字母、数字、下划线和连字符，长度3-20位',
            password: '密码至少8位，包含大小写字母和数字',
            minLength: '字符长度不能少于 {min} 位',
            maxLength: '字符长度不能超过 {max} 位',
            min: '数值不能小于 {min}',
            max: '数值不能大于 {max}',
            match: '两次输入不一致',
            custom: '输入格式不正确'
        };
    }

    // 验证必填字段
    validateRequired(value) {
        return value !== null && value !== undefined && String(value).trim() !== '';
    }

    // 验证邮箱
    validateEmail(email) {
        return this.patterns.email.test(email);
    }

    // 验证手机号
    validatePhone(phone) {
        return this.patterns.phone.test(phone);
    }

    // 验证用户名
    validateUsername(username) {
        return this.patterns.username.test(username);
    }

    // 验证密码强度
    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;
        
        return {
            isValid: passedChecks >= 3,
            strength: this.calculatePasswordStrength(passedChecks),
            checks
        };
    }

    calculatePasswordStrength(passedChecks) {
        if (passedChecks < 2) return 'weak';
        if (passedChecks < 4) return 'medium';
        if (passedChecks < 5) return 'strong';
        return 'very-strong';
    }

    // 验证身份证号
    validateIdCard(idCard) {
        if (!this.patterns.idCard.test(idCard)) {
            return false;
        }

        // 校验位验证
        const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += parseInt(idCard[i]) * factors[i];
        }
        
        const expectedCheck = checkCodes[sum % 11];
        const actualCheck = idCard[17].toUpperCase();
        
        return expectedCheck === actualCheck;
    }

    // 验证URL
    validateUrl(url) {
        return this.patterns.url.test(url);
    }

    // 验证字符长度
    validateLength(value, min, max) {
        const length = String(value).length;
        if (min !== undefined && length < min) return false;
        if (max !== undefined && length > max) return false;
        return true;
    }

    // 验证数值范围
    validateRange(value, min, max) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== undefined && num < min) return false;
        if (max !== undefined && num > max) return false;
        return true;
    }

    // 验证两个值是否匹配
    validateMatch(value1, value2) {
        return value1 === value2;
    }

    // 验证日期
    validateDate(dateString, format = 'YYYY-MM-DD') {
        try {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        } catch {
            return false;
        }
    }

    // 验证年龄
    validateAge(birthDate, minAge = 0, maxAge = 120) {
        try {
            const birth = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age >= minAge && age <= maxAge;
        } catch {
            return false;
        }
    }

    // 自定义正则表达式验证
    validatePattern(value, pattern) {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return regex.test(value);
    }

    // 验证文件类型
    validateFileType(file, allowedTypes) {
        if (!file || !allowedTypes) return false;
        
        const fileType = file.type;
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        return allowedTypes.some(type => {
            if (type.includes('/')) {
                // MIME type
                return fileType === type || fileType.startsWith(type.split('/')[0] + '/');
            } else {
                // File extension
                return fileExtension === type.toLowerCase();
            }
        });
    }

    // 验证文件大小
    validateFileSize(file, maxSize) {
        if (!file) return false;
        return file.size <= maxSize;
    }

    // 综合表单验证
    validateForm(formData, rules) {
        const errors = {};
        let isValid = true;

        for (const [field, value] of Object.entries(formData)) {
            const fieldRules = rules[field];
            if (!fieldRules) continue;

            const fieldErrors = this.validateField(value, fieldRules, formData);
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }

        return { isValid, errors };
    }

    // 验证单个字段
    validateField(value, rules, formData = {}) {
        const errors = [];

        for (const rule of rules) {
            const { type, message, ...params } = rule;
            let isValid = true;
            let errorMessage = message || this.messages[type] || this.messages.custom;

            switch (type) {
                case 'required':
                    isValid = this.validateRequired(value);
                    break;
                
                case 'email':
                    if (value) isValid = this.validateEmail(value);
                    break;
                
                case 'phone':
                    if (value) isValid = this.validatePhone(value);
                    break;
                
                case 'username':
                    if (value) isValid = this.validateUsername(value);
                    break;
                
                case 'password':
                    if (value) {
                        const result = this.validatePassword(value);
                        isValid = result.isValid;
                    }
                    break;
                
                case 'minLength':
                    if (value) {
                        isValid = this.validateLength(value, params.min);
                        errorMessage = errorMessage.replace('{min}', params.min);
                    }
                    break;
                
                case 'maxLength':
                    if (value) {
                        isValid = this.validateLength(value, undefined, params.max);
                        errorMessage = errorMessage.replace('{max}', params.max);
                    }
                    break;
                
                case 'min':
                    if (value) {
                        isValid = this.validateRange(value, params.min);
                        errorMessage = errorMessage.replace('{min}', params.min);
                    }
                    break;
                
                case 'max':
                    if (value) {
                        isValid = this.validateRange(value, undefined, params.max);
                        errorMessage = errorMessage.replace('{max}', params.max);
                    }
                    break;
                
                case 'match':
                    if (value) {
                        const compareValue = formData[params.field];
                        isValid = this.validateMatch(value, compareValue);
                    }
                    break;
                
                case 'pattern':
                    if (value) isValid = this.validatePattern(value, params.pattern);
                    break;
                
                case 'custom':
                    if (typeof params.validator === 'function') {
                        isValid = params.validator(value, formData);
                    }
                    break;
            }

            if (!isValid) {
                errors.push(errorMessage);
            }
        }

        return errors;
    }

    // 实时验证辅助函数
    addRealTimeValidation(form, rules) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const fieldName = input.name || input.id;
            if (!rules[fieldName]) return;

            // 失去焦点时验证
            input.addEventListener('blur', () => {
                this.validateAndShowErrors(input, rules[fieldName], this.getFormData(form));
            });

            // 输入时清除错误
            input.addEventListener('input', () => {
                this.clearFieldErrors(input);
            });
        });
    }

    // 验证并显示错误
    validateAndShowErrors(input, fieldRules, formData) {
        const value = input.value;
        const errors = this.validateField(value, fieldRules, formData);
        
        if (errors.length > 0) {
            this.showFieldError(input, errors[0]);
            return false;
        } else {
            this.clearFieldErrors(input);
            return true;
        }
    }

    // 显示字段错误
    showFieldError(input, message) {
        this.clearFieldErrors(input);
        
        input.classList.add('border-red-500', 'focus:border-red-500');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-400 text-xs mt-1 validation-error';
        errorDiv.textContent = message;
        
        // 插入错误消息
        const container = input.closest('.form-group') || input.parentNode;
        container.appendChild(errorDiv);
    }

    // 清除字段错误
    clearFieldErrors(input) {
        input.classList.remove('border-red-500', 'focus:border-red-500');
        
        const container = input.closest('.form-group') || input.parentNode;
        const errorDiv = container.querySelector('.validation-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // 获取表单数据
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    // 格式化错误消息
    formatErrors(errors) {
        const formatted = {};
        
        for (const [field, fieldErrors] of Object.entries(errors)) {
            formatted[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
        }
        
        return formatted;
    }

    // 高亮错误字段
    highlightErrors(form, errors) {
        // 先清除所有错误状态
        this.clearAllErrors(form);
        
        // 显示新的错误
        for (const [field, messages] of Object.entries(errors)) {
            const input = form.querySelector(`[name="${field}"], #${field}`);
            if (input && messages.length > 0) {
                this.showFieldError(input, messages[0]);
            }
        }
    }

    // 清除所有错误
    clearAllErrors(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearFieldErrors(input));
    }

    // 常用验证规则集合
    getCommonRules() {
        return {
            username: [
                { type: 'required' },
                { type: 'minLength', min: 3 },
                { type: 'maxLength', max: 20 },
                { type: 'username' }
            ],
            
            email: [
                { type: 'required' },
                { type: 'email' }
            ],
            
            phone: [
                { type: 'required' },
                { type: 'phone' }
            ],
            
            password: [
                { type: 'required' },
                { type: 'minLength', min: 8 },
                { type: 'password' }
            ],
            
            confirmPassword: [
                { type: 'required' },
                { type: 'match', field: 'password', message: '密码确认不匹配' }
            ],
            
            name: [
                { type: 'required' },
                { type: 'minLength', min: 2 },
                { type: 'maxLength', max: 50 }
            ]
        };
    }
}

// 表单验证装饰器
class FormValidator {
    constructor(form, rules, options = {}) {
        this.form = form;
        this.rules = rules;
        this.options = {
            realTime: true,
            showSuccess: false,
            scrollToError: true,
            ...options
        };
        this.validator = new ValidationUtils();
        this.init();
    }

    init() {
        if (this.options.realTime) {
            this.validator.addRealTimeValidation(this.form, this.rules);
        }
        
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
            }
        });
    }

    validate() {
        const formData = this.validator.getFormData(this.form);
        const result = this.validator.validateForm(formData, this.rules);
        
        if (!result.isValid) {
            this.validator.highlightErrors(this.form, result.errors);
            
            if (this.options.scrollToError) {
                this.scrollToFirstError();
            }
            
            // 触发验证失败事件
            this.form.dispatchEvent(new CustomEvent('validationFailed', {
                detail: { errors: result.errors }
            }));
        } else {
            this.validator.clearAllErrors(this.form);
            
            // 触发验证成功事件
            this.form.dispatchEvent(new CustomEvent('validationSuccess', {
                detail: { data: formData }
            }));
        }
        
        return result.isValid;
    }

    scrollToFirstError() {
        const firstError = this.form.querySelector('.validation-error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    addRule(field, rule) {
        if (!this.rules[field]) {
            this.rules[field] = [];
        }
        this.rules[field].push(rule);
    }

    removeRule(field, ruleType) {
        if (this.rules[field]) {
            this.rules[field] = this.rules[field].filter(rule => rule.type !== ruleType);
        }
    }

    updateRules(newRules) {
        this.rules = { ...this.rules, ...newRules };
    }
}

// 全局实例
window.ValidationUtils = ValidationUtils;
window.FormValidator = FormValidator;

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ValidationUtils, FormValidator };
} 