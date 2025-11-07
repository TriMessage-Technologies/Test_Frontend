// Управление темами

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Настройка обработчиков для переключателей темы
    setupThemeToggle();
});

// Инициализация темы
function initTheme() {
    const savedTheme = getFromStorage('theme') || 'light-theme';
    document.body.className = savedTheme;
    updateThemeToggleText(savedTheme);
}

// Настройка переключателей темы
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle-btn, #headerThemeToggle');
    
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    
    // Применяем новую тему
    document.body.className = newTheme;
    
    // Сохраняем выбор пользователя
    saveToStorage('theme', newTheme);
    
    // Обновляем текст переключателя
    updateThemeToggleText(newTheme);
    
    // Показываем уведомление
    const themeName = newTheme === 'light-theme' ? 'Светлая' : 'Тёмная';
    showNotification(`${themeName} тема активирована`, 'success');
}

// Обновление текста переключателя темы
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

// Функция для принудительной установки темы (для отладки)
function setTheme(theme) {
    if (theme !== 'light-theme' && theme !== 'dark-theme') {
        console.error('Неверное значение темы. Используйте "light-theme" или "dark-theme"');
        return;
    }
    
    document.body.className = theme;
    saveToStorage('theme', theme);
    updateThemeToggleText(theme);
}