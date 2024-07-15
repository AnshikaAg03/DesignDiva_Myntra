const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const messageText = userInput.value;
    if (!messageText) return;

    addMessage('user', messageText);
    userInput.value = '';
    setTimeout(() => addMessage('myra', generateResponse(messageText)), 500);
}

function addMessage(sender, text) {
    const message = document.createElement('div');
    message.classList.add('message', `${sender}-message`);
    message.innerText = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateResponse(userText) {
    if (userText.toLowerCase().includes('hello')) {
        return "Hi there! How can I assist you with your order today?";
    } else if (userText.toLowerCase().includes('customize') || userText.toLowerCase().includes('order')) {
        return "Sure! Our seller will soon contact you for the details of the customized product you want to order.";
    } else if (userText.toLowerCase().includes('thank')) {
        return "You're welcome! If you need any further assistance, feel free to ask.";
    } else {
        return "I'm here to help you with placing customized orders. Could you please provide more details?";
    }

}
userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});