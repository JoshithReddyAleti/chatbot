function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
  }
  
  document.getElementById('pieChart').innerHTML = '<strong>Pie Chart showing last 3 months spending</strong>';
  document.getElementById('barChart').innerHTML = '<strong>Bar Chart showing category-wise spending</strong>';
  
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');
  
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
      const userMessage = chatInput.value;
      chatBody.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
      chatInput.value = '';
  
      setTimeout(() => {
        if (userMessage.toLowerCase().includes('spending')) {
          chatBody.innerHTML += `<p><strong>Bot:</strong> You spent $2,000 last month. Most of it was on groceries and rent.</p>`;
        } else if (userMessage.toLowerCase().includes('savings')) {
          chatBody.innerHTML += `<p><strong>Bot:</strong> You have saved 60% of your vacation goal. Keep it up!</p>`;
        } else {
          chatBody.innerHTML += `<p><strong>Bot:</strong> I'm working on that. Please wait a moment.</p>`;
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    }
  });
  