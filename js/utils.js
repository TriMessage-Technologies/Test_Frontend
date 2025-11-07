// Утилитарные функции

// Сохранение данных в localStorage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

// Получение данных из localStorage
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Генерация случайного ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Форматирование времени
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Форматирование даты
function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера';
    } else {
        return date.toLocaleDateString();
    }
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Цвета для разных типов уведомлений
    const colors = {
        info: 'var(--primary-color)',
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)'
    };
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: var(--shadow-heavy);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Предотвращение XSS атак
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Функция для проверки поддержки тем в браузере
function checkThemeSupport() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Автоматическое определение системной темы
function autoDetectTheme() {
    if (!checkThemeSupport()) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = getFromStorage('theme');
    
    // Если пользователь уже выбирал тему, не переопределяем
    if (savedTheme) return;
    
    // Устанавливаем тему в соответствии с системными настройками
    const theme = prefersDark ? 'dark-theme' : 'light-theme';
    document.body.className = theme;
    updateThemeToggleText(theme);
}

// Обновление текста переключателя темы (для использования в utils.js)
function updateThemeToggleText(theme) {
    const themeTexts = document.querySelectorAll('.theme-text');
    const themeIcons = document.querySelectorAll('.theme-icon');
    
    if (theme === 'light-theme') {
        themeTexts.forEach(text => text.textContent = 'Тёмная тема');
        themeIcons.forEach(icon => icon.textContent = '🌙');
    } else {
        themeTexts.forEach(text => text.textContent = 'Светлая тема');
        themeIcons.forEach(icon => icon.textContent = '☀️');
    }
}

// Вызываем автоопределение темы при загрузке
document.addEventListener('DOMContentLoaded', autoDetectTheme);