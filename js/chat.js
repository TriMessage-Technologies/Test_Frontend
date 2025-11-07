// Логика чата

// Глобальные переменные
let activeContactId = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация чата
    initChat();

    // Обработчики событий
    setupEventListeners();
});

// Инициализация чата
function initChat() {
    // Получаем данные пользователя
    currentUser = getFromStorage('currentUser');

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Отображаем имя пользователя
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('userAvatar').textContent = currentUser.avatar;

    // Загружаем контакты и чаты
    loadContacts();
    loadChats();

    // Показываем мессенджер
    document.getElementById('messengerPage').style.display = 'block';
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка выхода
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Кнопка нового чата
    document.getElementById('newChatBtn').addEventListener('click', showNewChatModal);

    // Кнопка закрытия модального окна
    document.getElementById('closeModalBtn').addEventListener('click', hideNewChatModal);

    // Кнопка отправки сообщения
    document.getElementById('sendBtn').addEventListener('click', sendMessage);

    // Отправка сообщения по Enter
    document.getElementById('messageInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Поиск контактов
    document.getElementById('searchContact').addEventListener('input', searchContacts);

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('newChatModal');
        if (e.target === modal) {
            hideNewChatModal();
        }
    });
}

// Загрузка контактов
function loadContacts() {
    // В реальном приложении здесь был бы запрос к серверу
    // Для демо используем тестовые данные
    const contacts = [
        { id: 1, name: 'Алексей', avatar: 'А', lastMessage: 'Привет! Как дела?', unread: 2 },
        { id: 2, name: 'Мария', avatar: 'М', lastMessage: 'Добро пожаловать в TriMessage!', unread: 0 },
        { id: 3, name: 'Команда', avatar: 'К', lastMessage: 'Обсуждение проекта TriMessage', unread: 5 },
        { id: 4, name: 'Дмитрий', avatar: 'Д', lastMessage: 'Отправил тебе файл', unread: 0 },
        { id: 5, name: 'Елена', avatar: 'Е', lastMessage: 'Спасибо за помощь!', unread: 1 }
    ];

    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.dataset.contactId = contact.id;

        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="last-message">${contact.lastMessage}</div>
            </div>
            ${contact.unread > 0 ? `<div class="unread-count">${contact.unread}</div>` : ''}
        `;

        contactElement.addEventListener('click', () => selectContact(contact));
        contactsList.appendChild(contactElement);
    });

    // Автоматически выбираем первый контакт
    if (contacts.length > 0) {
        selectContact(contacts[0]);
    }
}

// Загрузка чатов
function loadChats() {
    // В реальном приложении здесь был бы запрос к серверу
    // Для демо используем тестовые данные
    const chats = getFromStorage('chats') || {};

    // Сохраняем чаты для дальнейшего использования
    if (!getFromStorage('chats')) {
        const demoChats = {
            1: [
                { id: generateId(), text: "Привет!", time: "10:00", type: "received", sender: "Алексей" },
                { id: generateId(), text: "Как дела?", time: "10:01", type: "sent", sender: "You" },
                { id: generateId(), text: "Отлично, спасибо! А у тебя?", time: "10:02", type: "received", sender: "Алексей" }
            ],
            2: [
                { id: generateId(), text: "Добро пожаловать в TriMessage!", time: "09:30", type: "received", sender: "Мария" },
                { id: generateId(), text: "Спасибо! Очень удобный мессенджер.", time: "09:35", type: "sent", sender: "You" }
            ],
            3: [
                { id: generateId(), text: "Напоминаю о встрече завтра в 15:00", time: "08:15", type: "received", sender: "Команда" },
                { id: generateId(), text: "Хорошо, я подготовлю отчет", time: "08:20", type: "sent", sender: "You" }
            ]
        };

        saveToStorage('chats', demoChats);
    }
}

// Выбор контакта
function selectContact(contact) {
    // Убираем активный класс у всех контактов
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));

    // Добавляем активный класс выбранному контакту
    const contactElement = document.querySelector(`.contact[data-contact-id="${contact.id}"]`);
    if (contactElement) {
        contactElement.classList.add('active');
    }

    // Обновляем информацию в заголовке чата
    document.getElementById('chatAvatar').textContent = contact.avatar;
    document.getElementById('chatPartnerName').textContent = contact.name;

    // Устанавливаем активный контакт
    activeContactId = contact.id;

    // Показываем поле ввода сообщения
    document.getElementById('inputArea').style.display = 'flex';

    // Загружаем сообщения для выбранного контакта
    loadMessages(contact.id);
}

// Загрузка сообщений
function loadMessages(contactId) {
    const chats = getFromStorage('chats') || {};
    const messages = chats[contactId] || [];

    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';

    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h3>Начните общение с ${document.getElementById('chatPartnerName').textContent}</h3>
                <p>Напишите первое сообщение</p>
            </div>
        `;
        return;
    }

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        messageElement.innerHTML = `
            <div>${escapeHtml(message.text)}</div>
            <div class="timestamp">${message.time}</div>
        `;
        messagesContainer.appendChild(messageElement);
    });

    // Прокручиваем к последнему сообщению
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();

    if (!text) {
        showNotification('Введите сообщение', 'warning');
        return;
    }

    if (!activeContactId) {
        showNotification('Выберите чат для отправки сообщения', 'error');
        return;
    }

    const chats = getFromStorage('chats') || {};

    // Создаем новое сообщение
    const newMessage = {
        id: generateId(),
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent',
        sender: currentUser.username
    };

    // Добавляем сообщение в чат
    if (!chats[activeContactId]) {
        chats[activeContactId] = [];
    }

    chats[activeContactId].push(newMessage);
    saveToStorage('chats', chats);

    // Очищаем поле ввода
    messageInput.value = '';

    // Обновляем отображение сообщений
    loadMessages(activeContactId);

    // Обновляем последнее сообщение в списке контактов
    updateLastMessage(activeContactId, text);

    // Имитируем ответ
    simulateReply(activeContactId);
}

// Обновление последнего сообщения в списке контактов
function updateLastMessage(contactId, message) {
    const contactElement = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
    if (contactElement) {
        const lastMessageElement = contactElement.querySelector('.last-message');
        if (lastMessageElement) {
            lastMessageElement.textContent = message.length > 30 ?
                message.substring(0, 30) + '...' : message;
        }

        // Сбрасываем счетчик непрочитанных
        const unreadCountElement = contactElement.querySelector('.unread-count');
        if (unreadCountElement) {
            unreadCountElement.remove();
        }
    }
}

// Имитация ответа
function simulateReply(contactId) {
    const responses = [
        "Хорошо, понял!",
        "Интересно, расскажи подробнее",
        "Согласен с тобой",
        "Спасибо за информацию!",
        "Давай обсудим это позже",
        "Отличная идея!",
        "Я подумаю над этим"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
        const chats = getFromStorage('chats') || {};

        const replyMessage = {
            id: generateId(),
            text: randomResponse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received',
            sender: document.getElementById('chatPartnerName').textContent
        };

        if (!chats[contactId]) {
            chats[contactId] = [];
        }

        chats[contactId].push(replyMessage);
        saveToStorage('chats', chats);

        // Если это активный чат, обновляем сообщения
        if (activeContactId === contactId) {
            loadMessages(contactId);
        }

        // Обновляем последнее сообщение в списке контактов
        updateLastMessage(contactId, randomResponse);

        // Добавляем счетчик непрочитанных, если чат не активен
        if (activeContactId !== contactId) {
            const contactElement = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
            if (contactElement && !contactElement.querySelector('.unread-count')) {
                const unreadCount = document.createElement('div');
                unreadCount.className = 'unread-count';
                unreadCount.textContent = '1';
                contactElement.appendChild(unreadCount);
            }
        }
    }, 1000 + Math.random() * 2000);
}

// Показать модальное окно нового чата
function showNewChatModal() {
    document.getElementById('newChatModal').style.display = 'flex';
}

// Скрыть модальное окно нового чата
function hideNewChatModal() {
    document.getElementById('newChatModal').style.display = 'none';
    document.getElementById('searchContact').value = '';
    document.getElementById('contactsSearchResults').innerHTML = '';
}

// Поиск контактов
function searchContacts() {
    const searchTerm = document.getElementById('searchContact').value.toLowerCase();
    const contactsList = document.getElementById('contactsSearchResults');

    // В реальном приложении здесь был бы запрос к серверу
    // Для демо используем тестовые данные
    const allContacts = [
        { id: 6, name: 'Анна', avatar: 'А' },
        { id: 7, name: 'Борис', avatar: 'Б' },
        { id: 8, name: 'Виктор', avatar: 'В' },
        { id: 9, name: 'Галина', avatar: 'Г' },
        { id: 10, name: 'Денис', avatar: 'Д' }
    ];

    const filteredContacts = searchTerm ?
        allContacts.filter(contact => contact.name.toLowerCase().includes(searchTerm)) :
        allContacts;

    contactsList.innerHTML = '';

    if (filteredContacts.length === 0) {
        contactsList.innerHTML = '<div class="no-results">Контакты не найдены</div>';
        return;
    }

    filteredContacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'search-contact';
        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-name">${contact.name}</div>
        `;

        contactElement.addEventListener('click', () => {
            // В реальном приложении здесь была бы логика создания нового чата
            showNotification(`Чат с ${contact.name} создан`, 'success');
            hideNewChatModal();

            // Добавляем новый контакт в список
            addNewContact(contact);
        });

        contactsList.appendChild(contactElement);
    });
}

// Добавление нового контакта
function addNewContact(contact) {
    const contactsList = document.getElementById('contactsList');

    const contactElement = document.createElement('div');
    contactElement.className = 'contact';
    contactElement.dataset.contactId = contact.id;

    contactElement.innerHTML = `
        <div class="contact-avatar">${contact.avatar}</div>
        <div class="contact-info">
            <div class="contact-name">${contact.name}</div>
            <div class="last-message">Новый чат</div>
        </div>
    `;

    contactElement.addEventListener('click', () => selectContact(contact));
    contactsList.appendChild(contactElement);

    // Создаем пустой чат для нового контакта
    const chats = getFromStorage('chats') || {};
    if (!chats[contact.id]) {
        chats[contact.id] = [];
        saveToStorage('chats', chats);
    }
}