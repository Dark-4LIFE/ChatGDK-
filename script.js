const responses = {
  "salut": "Salut! Cu ce te pot ajuta?",
  "ce faci": "Sunt un bot, deci mereu pregătit!",
  "cum te cheamă": "Numele meu este ChatGDK!",
  "la revedere": "La revedere! Revino oricând!",
};

const keyPhrases = {
  "salut": ["bună", "hey", "hello", "hi", "bună ziua", "servus"],
  "ce faci": ["cum ești", "cum te simți", "ce mai faci", "cum o duci"],
  "cum te cheamă": ["cine ești", "cum te numești", "care e numele tău", "prezintă-te"],
  "la revedere": ["pa", "bye", "ciao", "ne vedem", "pe curând"]
};

const fallbacks = [
  "Îmi pare rău, nu înțeleg întrebarea.",
  "Poți să reformulezi, te rog?",
  "Hmm, nu sunt programat să răspund la asta.",
  "Interesant... dar n-am răspuns la asta încă.",
  "Vrei să reformulezi întrebarea?"
];

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim().toLowerCase();
  if (!message) return;

  appendMessage("Tu", message, "user");
  saveToHistory("Tu", message);

  const typingElement = document.createElement("div");
  typingElement.className = "message bot typing-indicator animated";
  typingElement.innerHTML = "<strong>Bot:</strong> <span class='dots'>...</span>";
  document.getElementById("messages").appendChild(typingElement);

  const response = findResponse(message);

  setTimeout(() => {
    typingElement.remove();
    const botMessage = appendMessage("Bot", "", "bot");
    typeMessage(botMessage.querySelector(".message-content"), response);
    saveToHistory("Bot", response);
  }, 1000);

  input.value = "";
}

function findResponse(message) {
  const norm = message.toLowerCase().trim();
  if (responses[norm]) return responses[norm];

  for (const [key, phrases] of Object.entries(keyPhrases)) {
    if (phrases.some(p => norm.includes(p)) || norm.includes(key)) {
      return responses[key];
    }
  }

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function appendMessage(sender, text, className) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${className} animated`;

  const now = new Date();
  const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

  messageElement.innerHTML = `
    <div class="message-header">
      <strong>${sender}</strong>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-content">${text}</div>
  `;

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return messageElement;
}

function typeMessage(element, text, speed = 30) {
  let i = 0;
  element.textContent = "";
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      setTimeout(typing, speed);
    }
  }
  typing();
}

const chatHistory = [];
function saveToHistory(sender, message) {
  chatHistory.push({ sender, message, timestamp: new Date().toISOString() });
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    JSON.parse(saved).forEach(item => {
      appendMessage(item.sender, item.message, item.sender.toLowerCase());
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadChatHistory();

  document.getElementById("sendButton").addEventListener("click", sendMessage);
  document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});