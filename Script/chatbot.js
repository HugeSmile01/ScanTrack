    // --- System Prompt & Conversation History ---
    const SYSTEM_PROMPT_TEXT = `You are ScanTrackSys, a smart AI assistant integrated into the ScanTrackSys platform — a QR-based attendance tracking system purposefully developed for DepEd (Department of Education, Philippines) teachers and learners. Your primary role is to assist users in navigating the platform’s features, solving common issues, and maximizing the benefits of digital attendance management. Designed with simplicity and accuracy in mind, ScanTrackSys minimizes paperwork and manual logging through the use of scannable QR codes generated from student information such as their LRN, grade level, and full name. You guide teachers through both real-time and offline attendance scanning using mobile or desktop devices. When scanning isn’t available, you also support manual logging to ensure flexibility in various teaching environments. You assist in generating and interpreting attendance reports, especially those formatted to meet DepEd’s official SF2 standards. Users can filter reports by day, week, month, or year, and download them as Excel files directly from the dashboard. You are also equipped to help users search attendance records using either the student’s name or LRN. In terms of access, you inform users that full system capabilities — including scanning and dashboard tools — are best experienced when DepEd teachers log in using their official @deped.gov.ph email accounts. You help with login issues, explain Firebase authentication, and provide clear troubleshooting steps when things go wrong. As a technical assistant, you remind users that the system works best on modern browsers that support HTML5, JavaScript, and Service Workers. You explain that ScanTrackSys is PWA-enabled, meaning it can be installed and used like a mobile app even when offline. Your tone is professional, helpful, and easy to understand, especially for teachers who may not be tech‑savvy. list of links: index.html(homepage), scanner.html(attendance mark or qr scanner), qr` // truncated for brevity, paste full text in production
    const conversationHistory = [
      { role: "user", text: SYSTEM_PROMPT_TEXT }
    ];

    const SECURITY_CONFIG = {
      API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/',
      MODEL: 'gemini-1.5-pro-latest',
      MAX_RESPONSE_LENGTH: 5000,
      RATE_LIMIT: { REQUESTS: 20, INTERVAL: 60000 }
    };

    const rateLimiter = {
      lastRequest: Date.now(),
      requestCount: 0,
      check() {
        const now = Date.now();
        if (now - this.lastRequest > SECURITY_CONFIG.RATE_LIMIT.INTERVAL) {
          this.requestCount = 0;
          this.lastRequest = now;
        }
        if (this.requestCount >= SECURITY_CONFIG.RATE_LIMIT.REQUESTS) {
          throw new Error('Chatbot is at rest.');
        }
        this.requestCount++;
      }
    };

    let offlineQueue = [];
window.addEventListener('online', () => {
  const statusElement = document.getElementById('chatStatus');
  statusElement.textContent = 'Online';
  statusElement.style.color = ''; // Reset to default color
  while (offlineQueue.length) {
    const { history, resolve, reject } = offlineQueue.shift();
    sendPrompt(history).then(resolve).catch(reject);
  }
});

window.addEventListener('offline', () => {
  const statusElement = document.getElementById('chatStatus');
  statusElement.textContent = 'Offline';
  statusElement.style.color = 'red';
  addMessage('You are offline. Messages will send when reconnected.', false);
});

    function sanitizeInput(text) {
      return text.replace(/[^a-zA-Z0-9 .,?!@'\-]/g, '');
    }
    function sanitizeOutput(text) {
      const ta = document.createElement('textarea');
      ta.textContent = text;
      return ta.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function showTypingIndicator(show) {
      const ti = document.getElementById('typingIndicator');
      if (ti) ti.style.display = show ? 'flex' : 'none';
      autoScroll();
    }

    function autoScroll() {
      const cb = document.getElementById('chatBody');
      if (cb.scrollHeight - cb.scrollTop - cb.clientHeight < 50) {
        cb.scrollTop = cb.scrollHeight;
      }
    }

    function addMessage(msg, isUser) {
  const chatBody = document.getElementById('chatBody');
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper ${isUser ? 'user-message' : 'bot-message'}`;
  
  const m = document.createElement('div');
  m.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const c = document.createElement('div');
  c.className = 'message-content markdown-body';
  c.innerHTML = isUser ? sanitizeOutput(msg) : formatResponse(msg);
  
  const btn = document.createElement('button');
  btn.className = 'copy-response-button';
  btn.innerText = 'Copy';
  
  // Click handler for message container
  m.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-response-button')) return;
    document.querySelectorAll('.message-wrapper.active').forEach(el => el.classList.remove('active'));
    wrapper.classList.toggle('active');
  });
  
  // Click handler for copy button
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const text = c.innerText.trim();
    navigator.clipboard.writeText(text);
    btn.innerText = 'Copied!';
    setTimeout(() => {
      btn.innerText = 'Copy';
      wrapper.classList.remove('active');
    }, 2000);
  });
  
  m.appendChild(c);
  wrapper.appendChild(m);
  wrapper.appendChild(btn);
  
  const ti = document.getElementById('typingIndicator');
  chatBody.insertBefore(wrapper, ti);
  autoScroll();
}

    function formatResponse(text) {
      const rawHtml = marked.parse(text);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      const container = document.createElement('div');
      container.innerHTML = cleanHtml;
      container.querySelectorAll('pre > code').forEach(codeElem => {
        const pre = codeElem.parentNode;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-container';

        const btn = document.createElement('button');
        btn.className = 'copy-response-button';
        btn.innerText = 'Copy';
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeElem.innerText)
            .then(() => {
              btn.innerText = 'Copied!';
              setTimeout(() => btn.innerText = 'Copy', 2000);
            });
        });

        pre.parentNode.replaceChild(wrapper, pre);
        wrapper.appendChild(btn);
        wrapper.appendChild(pre);
      });
      return container.innerHTML;
    }

    async function getAIResponse(history) {
      const url = `${SECURITY_CONFIG.API_ENDPOINT}${SECURITY_CONFIG.MODEL}:generateContent`;
      const contents = history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
      const body = { systemInstruction: { parts: [{ text: SYSTEM_PROMPT_TEXT }] }, contents };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyB0q54ctyevQxpII-K_GI0bLPmhAFxCk5I'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { msg = (await res.json()).error?.message || msg; } catch {}
        throw new Error(`⚠️ ${msg}`);
      }

      const data = await res.json();
      return data.candidates[0].content.parts[0].text
        .slice(0, SECURITY_CONFIG.MAX_RESPONSE_LENGTH);
    }

    async function retryFetch(history, attempts = 3, delay = 500) {
      try {
        return await getAIResponse(history);
      } catch (err) {
        if (err.message.startsWith('⚠️ HTTP') || attempts <= 1) throw err;
        await new Promise(r => setTimeout(r, delay));
        return retryFetch(history, attempts - 1, delay * 2);
      }
    }

    async function sendPrompt(history) {
      try {
        rateLimiter.check();
        return await getAIResponse(history);
      } catch (err) {
        if (!navigator.onLine) {
          return new Promise((resolve, reject) => {
            offlineQueue.push({ history, resolve, reject });
          });
        }
        return retryFetch(history);
      }
    }

    function handleInput() {
      const inputEl = document.getElementById('userInput');
      const raw = inputEl.value.trim();
      const prompt = sanitizeInput(raw);
      if (!prompt) return;

      addMessage(prompt, true);
      conversationHistory.push({ role: 'user', text: prompt });

      inputEl.value = '';
      showTypingIndicator(true);

      sendPrompt(conversationHistory)
        .then(res => {
          addMessage(res, false);
          conversationHistory.push({ role: 'assistant', text: res });
        })
        .catch(err => addMessage(err.message || '⚠️ Error', false))
        .finally(() => showTypingIndicator(false));
    }

    let debounceTimer;
    document.getElementById('userInput').addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleInput, 300);
      }
    });

    window.onload = () => {
      const cb = document.getElementById('chatBody');
      if (cb.children.length <= 1) {
        addMessage("How can I assist you today?", false);
      }
    };
    
    
    
    // new features
    
    
// Constants for filtering report
const REPORT_FILTERS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

    
    
    
    
    async function handleReportRequest(userInput) {
  let filterType = '';
  
  if (userInput.toLowerCase().includes('week')) {
    filterType = REPORT_FILTERS.WEEK;
  } else if (userInput.toLowerCase().includes('month')) {
    filterType = REPORT_FILTERS.MONTH;
  } else if (userInput.toLowerCase().includes('year')) {
    filterType = REPORT_FILTERS.YEAR;
  } else if (userInput.toLowerCase().includes('day') || userInput.toLowerCase().includes('today')) {
    filterType = REPORT_FILTERS.DAY;
  } else {
    return 'Please specify a valid time frame (day, week, month, year) for the report.';
  }

  // Proceed to generate the report with the chosen filter
  try {
    const reportData = await generateReport(filterType);  // Generate the report data (in SF2 format)
    const reportFile = await convertToSF2Format(reportData); // Convert it into SF2 format
    
    // Generate download link or send the file directly
    return `Your report for the selected time period (${filterType}) has been generated. You can download it [here](link_to_report).`;
  } catch (err) {
    return '⚠️ There was an error generating the report. Please try again later.';
  }
}

async function handleInput() {
  const inputEl = document.getElementById('userInput');
  const raw = inputEl.value.trim();
  const prompt = sanitizeInput(raw);

  if (!prompt) return;

  addMessage(prompt, true);
  conversationHistory.push({ role: 'user', text: prompt });

  inputEl.value = '';
  showTypingIndicator(true);

  // Check if the input is a report generation request
  if (prompt.toLowerCase().includes('report')) {
    const response = await handleReportRequest(prompt);
    addMessage(response, false);
    conversationHistory.push({ role: 'assistant', text: response });
  } else {
    sendPrompt(conversationHistory)
      .then(res => {
        addMessage(res, false);
        conversationHistory.push({ role: 'assistant', text: res });
      })
      .catch(err => addMessage(err.message || '⚠️ Error', false))
      .finally(() => showTypingIndicator(false));
  }
}
