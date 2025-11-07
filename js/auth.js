// Логика аутентификации

document.addEventListener('DOMContentLoaded', function() {
    // Элементы страницы входа
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const registerLink = document.getElementById('registerLink');
    
    // Проверяем, авторизован ли пользователь
    checkAuthStatus();
    
    // Обработчик для кнопки входа
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Обработчик для кнопки регистрации
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
    
    // Обработчик для ссылки регистрации
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});

// Обработка входа
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // В реальном приложении здесь был бы запрос к серверу
    // Для демо просто сохраняем пользователя
    const user = {
        id: generateId(),
        username: username,
        avatar: username.charAt(0).toUpperCase(),
        lastLogin: new Date().toISOString()
    };
    
    // Сохраняем данные пользователя
    saveToStorage('currentUser', user);
    
    // Показываем уведомление об успешном входе
    showNotification(`Добро пожаловать, ${username}!`, 'success');
    
    // Перенаправляем на страницу чата
    setTimeout(() => {
        window.location.href = 'chat.html';
    }, 1000);
}

// Обработка регистрации
function handleRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать не менее 6 символов', 'error');
        return;
    }
    
    // В реальном приложении здесь был бы запрос к серверу
    // Для демо просто сохраняем пользователя и перенаправляем на вход
    
    showNotification('Регистрация прошла успешно! Теперь вы можете войти.', 'success');
    
    // Перенаправляем на страницу входа через 2 секунды
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Проверка статуса авторизации
function checkAuthStatus() {
    const currentUser = getFromStorage('currentUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Если пользователь авторизован и находится на странице входа/регистрации
    if (currentUser && (currentPage === 'index.html' || currentPage === 'login.html')) {
        // Перенаправляем на страницу чата
        window.location.href = 'chat.html';
    }
    
    // Если пользователь не авторизован и находится на странице чата
    if (!currentUser && currentPage === 'chat.html') {
        // Перенаправляем на страницу входа
        window.location.href = 'index.html';
    }
}

// Выход из системы
function handleLogout() {
    // Получаем текущего пользователя для персонализированного сообщения
    const currentUser = getFromStorage('currentUser');
    const username = currentUser ? currentUser.username : '';
    
    // Удаляем данные пользователя
    localStorage.removeItem('currentUser');
    
    // Показываем уведомление о выходе
    showNotification(`До свидания, ${username}!`, 'info');
    
    // Перенаправляем на страницу входа
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}