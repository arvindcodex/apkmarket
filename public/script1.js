
(function() {
    const triggerBtn = document.getElementById('apkAiTriggerBtn');
    const chatBox = document.getElementById('apkAiChatBox');
    const closeBtn = document.getElementById('apkAiCloseBtn');
    const clearBtn = document.getElementById('apkAiClearBtn');
    const messagesContainer = document.getElementById('apkAiMessages');
    const typingIndicator = document.getElementById('apkAiTyping');
    const inputEl = document.getElementById('apkAiInput');
    const sendBtn = document.getElementById('apkAiSendBtn');
    const chipsBar = document.getElementById('apkAiChipsBar');

    const STORAGE_KEY = 'apkmarket_ai_chat_history_v1';
    let chatHistory = [];

    // Full Rich Markdown Parser (Tables, Code, Lists, Quotes, Headings, Bold)
        function renderMarkdown(text) {
            if (!text) return '';
            let escaped = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Extract and protect code blocks
            const codeBlocks = [];
            escaped = escaped.replace(/```([\s\S]*?)```/g, function(match, code) {
                const id = '___CODEBLOCK_' + codeBlocks.length + '___';
                codeBlocks.push('<pre class="ai-code-block"><code>' + code.trim() + '</code></pre>');
                return id;
            });

            // Inline code
            escaped = escaped.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');

            // Parse Markdown Tables
            escaped = escaped.replace(/(?:^|\n)(\|[^\n]+\|\r?\n\|[-:\s|]+\|\r?\n(?:\|[^\n]+\|\r?\n?)+)/g, function(match, tableText) {
                const lines = tableText.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
                if (lines.length < 2) return match;
                
                let html = '<div class="ai-table-wrap"><table class="ai-table">';
                const rawHeaders = lines[0].split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
                html += '<thead><tr>';
                rawHeaders.forEach(cell => {
                    html += '<th>' + cell + '</th>';
                });
                html += '</tr></thead><tbody>';
                
                for (let i = 2; i < lines.length; i++) {
                    const rowCells = lines[i].split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
                    if (rowCells.length > 0) {
                        html += '<tr>';
                        rowCells.forEach(cell => {
                            html += '<td>' + cell + '</td>';
                        });
                        html += '</tr>';
                    }
                }
                html += '</tbody></table></div>';
                return '\n' + html + '\n';
            });

            // Blockquotes
            escaped = escaped.replace(/(?:^|\n)&gt;\s*([^\n]+)/g, '<div class="ai-blockquote">$1</div>');

            // Headings
            escaped = escaped.replace(/(?:^|\n)###\s+([^\n]+)/g, '<div class="ai-heading-3">$1</div>');
            escaped = escaped.replace(/(?:^|\n)##\s+([^\n]+)/g, '<div class="ai-heading-2">$1</div>');
            escaped = escaped.replace(/(?:^|\n)#\s+([^\n]+)/g, '<div class="ai-heading-1">$1</div>');

            // Bold & Italic
            escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

            // Links
            escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ai-chat-link">$1 ↗</a>');

            // Lists
            escaped = escaped.replace(/(?:^|\n)(\d+)\.\s+([^\n]+)/g, '<div class="ai-list-item"><span class="ai-list-num">$1.</span> <span>$2</span></div>');
            escaped = escaped.replace(/(?:^|\n)[-*•]\s+([^\n]+)/g, '<div class="ai-list-item"><span class="ai-list-bullet">•</span> <span>$1</span></div>');

            // Restore Code Blocks
            codeBlocks.forEach((block, idx) => {
                escaped = escaped.replace('___CODEBLOCK_' + idx + '___', block);
            });

            // Clean newlines
            escaped = escaped.replace(/\n{2,}/g, '<br><br>');
            escaped = escaped.replace(/\n/g, '<br>');

            // Clean breaks around container elements
            escaped = escaped.replace(/<\/div><br>/g, '</div>');
            escaped = escaped.replace(/<br><div/g, '<div');
            escaped = escaped.replace(/<\/table><\/div><br>/g, '</table></div>');

            return escaped;
        }

    // Load saved history
    function loadHistory() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) {
                    chatHistory = list;
                    list.forEach(item => {
                        appendMessage(item.role, item.content, false);
                    });
                }
            }
        } catch(e) {}
    }

    // Save history
    function saveHistory() {
        try {
            // Keep last 10
            const trimmed = chatHistory.slice(-10);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch(e) {}
    }

    // Append Message to UI
    function appendMessage(role, content, shouldSave = true) {
        const isUser = role === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg ' + (isUser ? 'ai-msg-user' : 'ai-msg-bot');

        const avatar = document.createElement('div');
        avatar.className = 'ai-msg-avatar';
        avatar.innerHTML = isUser ? '👤' : '🤖';

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-content';
        bubble.innerHTML = renderMarkdown(content);

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (shouldSave) {
            chatHistory.push({ role, content });
            saveHistory();
        }
    }

    // Toggle Chat Window
    function toggleChat(forceOpen = null) {
        const isOpen = !chatBox.classList.contains('closed');
        const nextState = forceOpen !== null ? forceOpen : !isOpen;

        if (nextState) {
            chatBox.classList.remove('closed');
            triggerBtn.classList.add('active');
            chatBox.setAttribute('aria-hidden', 'false');
            setTimeout(() => inputEl.focus(), 200);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            chatBox.classList.add('closed');
            triggerBtn.classList.remove('active');
            chatBox.setAttribute('aria-hidden', 'true');
        }
    }

    // Send User Message
    async function sendMessage(text) {
        const trimmed = (text || inputEl.value).trim();
        if (!trimmed) return;

        inputEl.value = '';
        inputEl.style.height = 'auto';
        appendMessage('user', trimmed);

        sendBtn.disabled = true;
        typingIndicator.style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Send to backend API
            const response = await fetch('ai_chat_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    history: chatHistory.slice(-6)
                })
            });

            const data = await response.json();
            typingIndicator.style.display = 'none';
            sendBtn.disabled = false;

            if (data.reply) {
                appendMessage('assistant', data.reply);
            } else if (data.error) {
                appendMessage('assistant', '⚠️ ' + data.error);
            } else {
                appendMessage('assistant', '⚠️ An unexpected response occurred. Please try again.');
            }
        } catch (err) {
            typingIndicator.style.display = 'none';
            sendBtn.disabled = false;
            appendMessage('assistant', '⚠️ Network error. Please check your internet connection and try again.');
        }
    }

    // Event Listeners
    triggerBtn.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));

    clearBtn.addEventListener('click', () => {
        if (confirm('Kya aap chat history clear karna chahte hain?')) {
            sessionStorage.removeItem(STORAGE_KEY);
            chatHistory = [];
            messagesContainer.innerHTML = `
                <div class="ai-msg ai-msg-bot">
                    <div class="ai-msg-avatar">🤖</div>
                    <div class="ai-msg-content">
                        <p>Chat history cleared! Main aapki kya madad kar sakta hu?</p>
                    </div>
                </div>
            `;
        }
    });

    // Chips click
    if (chipsBar) {
        chipsBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.ai-chip');
            if (btn && btn.dataset.prompt) {
                toggleChat(true);
                sendMessage(btn.dataset.prompt);
            }
        });
    }

    // Auto-expand input & Enter handling
    inputEl.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', () => sendMessage());

    // Auto-tuck / peek behavior (Right side docking like big sites)
    let tuckTimeout = null;

    function tuckBtn() {
        if (!chatBox.classList.contains('closed')) return; // Do not tuck if chat is open
        triggerBtn.classList.remove('untucked');
    }

    function untuckBtn() {
        triggerBtn.classList.add('untucked');
        clearTimeout(tuckTimeout);
        tuckTimeout = setTimeout(tuckBtn, 3000);
    }

    triggerBtn.addEventListener('mouseenter', untuckBtn);
    triggerBtn.addEventListener('touchstart', untuckBtn, { passive: true });
    triggerBtn.addEventListener('mouseleave', () => {
        clearTimeout(tuckTimeout);
        tuckTimeout = setTimeout(tuckBtn, 1200);
    });

    // Auto tuck on scroll
    window.addEventListener('scroll', () => {
        if (chatBox.classList.contains('closed')) {
            triggerBtn.classList.remove('untucked');
        }
    }, { passive: true });

    // Show initial untuck for 2.5s on load so user notices it, then smoothly tucks away
    setTimeout(tuckBtn, 2500);

    // Init load
    loadHistory();
})();
