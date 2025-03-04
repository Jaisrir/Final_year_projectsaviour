document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbotPopup');
    const closeChat = document.querySelector('.close-chat');
    const sendMessage = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chatbot popup
    chatbotToggle.addEventListener('click', () => {
        chatbotPopup.classList.toggle('active');
    });

    // Close chatbot
    closeChat.addEventListener('click', () => {
        chatbotPopup.classList.remove('active');
    });

    // Send message
    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage('user', message);
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage('bot', botResponse);
            }, 500);

            userInput.value = '';
        }
    }

    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);

    // Send message on Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Add message to chat
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simple bot responses
    function getBotResponse(message) {
        message = message.toLowerCase();
        if (message.includes('hello') || message.includes('hi')) {
            return 'Hello! How can I help you today?';
        } else if (message.includes('balance')) {
            return 'Your current balance is ₹2,03,050';
        } else if (message.includes('transfer')) {
            return 'To make a transfer, click the "Transfer money" button in the sidebar.';
        } else if (message.includes('card')) {
            return 'You can manage your cards in the Cards section. Need help with anything specific?';
        } else {
            return 'I\'m here to help! Feel free to ask about your balance, transfers, or card management.';
        }
    }
}); 