// ==========================================================================
// AutoVroom — Innovation University | Computer Science Team
// Official MCQ Engine (20 Questions - Beginner Level)
// ==========================================================================

import { quizQuestions, quizInfo } from './questions.js';
import { config } from './config.js';

// Application State
const state = {
  questions: [...quizQuestions],
  student: {
    name: '',
    email: '',
    phone: '',
    academicInfo: ''
  },
  answers: {}, // { [questionId]: selectedOptionIndex }
  currentQuestionIndex: 0,
  viewMode: 'step', // 'step' | 'all'
  timerSeconds: config.totalTimeMinutes * 60,
  timerInterval: null,
  startTime: null,
  endTime: null,
  timeSpentFormatted: '',
  isSubmitted: false,
  reviewFilter: 'all',
  
  // Custom Settings (persisted in localStorage)
  adminEmail: localStorage.getItem('autovroom_admin_email') || config.emailService.recipientEmail,
  web3Key: localStorage.getItem('autovroom_web3_key') || config.emailService.web3formsAccessKey,
  webhookUrl: localStorage.getItem('autovroom_webhook_url') || ''
};

// DOM Elements
const elements = {
  // Screens
  welcomeScreen: document.getElementById('welcomeScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultScreen: document.getElementById('resultScreen'),
  
  // Header & Navigation
  quizTimer: document.getElementById('quizTimer'),
  timerText: document.getElementById('timerText'),
  stickyProgress: document.getElementById('stickyProgress'),
  answeredCount: document.getElementById('answeredCount'),
  totalCountHeader: document.getElementById('totalCountHeader'),
  percentageBadge: document.getElementById('percentageBadge'),
  progressFill: document.getElementById('progressFill'),
  questionsMap: document.getElementById('questionsMap'),

  // Registration Form
  studentForm: document.getElementById('studentForm'),
  studentName: document.getElementById('studentName'),
  studentEmail: document.getElementById('studentEmail'),
  studentPhone: document.getElementById('studentPhone'),
  academicInfo: document.getElementById('academicInfo'),

  // Quiz Area Controls
  singleQuestionArea: document.getElementById('singleQuestionArea'),
  allQuestionsArea: document.getElementById('allQuestionsArea'),
  modeStepBtn: document.getElementById('modeStepBtn'),
  modeAllBtn: document.getElementById('modeAllBtn'),
  btnPrevQuestion: document.getElementById('btnPrevQuestion'),
  btnNextQuestion: document.getElementById('btnNextQuestion'),
  btnSubmitQuiz: document.getElementById('btnSubmitQuiz'),

  // Submit Confirmation Modal
  submitModal: document.getElementById('submitModal'),
  modalBody: document.getElementById('modalBody'),
  btnCloseModal: document.getElementById('btnCloseModal'),
  btnCancelSubmit: document.getElementById('btnCancelSubmit'),
  btnConfirmSubmit: document.getElementById('btnConfirmSubmit'),

  // Settings Modal
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  settingsModal: document.getElementById('settingsModal'),
  btnCloseSettings: document.getElementById('btnCloseSettings'),
  inputAdminEmail: document.getElementById('inputAdminEmail'),
  inputWeb3Key: document.getElementById('inputWeb3Key'),
  inputWebhookUrl: document.getElementById('inputWebhookUrl'),
  btnSaveSettings: document.getElementById('btnSaveSettings'),

  // Results Screen
  finalScoreVal: document.getElementById('finalScoreVal'),
  resultBadge: document.getElementById('resultBadge'),
  studentGreeting: document.getElementById('studentGreeting'),
  resultSummary: document.getElementById('resultSummary'),
  emailStatusCard: document.getElementById('emailStatusCard'),
  emailStatusIcon: document.getElementById('emailStatusIcon'),
  emailStatusTitle: document.getElementById('emailStatusTitle'),
  emailStatusDesc: document.getElementById('emailStatusDesc'),
  answersReviewContainer: document.getElementById('answersReviewContainer'),
  filterAll: document.getElementById('filterAll'),
  filterCorrect: document.getElementById('filterCorrect'),
  filterWrong: document.getElementById('filterWrong'),
  btnPrintReport: document.getElementById('btnPrintReport'),
  btnCopyReport: document.getElementById('btnCopyReport'),
  btnWhatsAppShare: document.getElementById('btnWhatsAppShare'),

  // Toast
  toast: document.getElementById('toast'),
  toastIcon: document.getElementById('toastIcon'),
  toastText: document.getElementById('toastText')
};

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  attachEvents();
});

function initUI() {
  elements.totalCountHeader.textContent = state.questions.length;
  elements.inputAdminEmail.value = state.adminEmail;
  elements.inputWeb3Key.value = (state.web3Key && state.web3Key !== 'YOUR_WEB3FORMS_ACCESS_KEY') ? state.web3Key : '';
  elements.inputWebhookUrl.value = state.webhookUrl;
}

// --------------------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------------------
function attachEvents() {
  // Start Quiz
  elements.studentForm.addEventListener('submit', handleStartQuiz);

  // View Mode Switchers
  elements.modeStepBtn.addEventListener('click', () => setViewMode('step'));
  elements.modeAllBtn.addEventListener('click', () => setViewMode('all'));

  // Question Navigation (Step Mode)
  elements.btnPrevQuestion.addEventListener('click', () => navigateQuestion(-1));
  elements.btnNextQuestion.addEventListener('click', () => navigateQuestion(1));
  elements.btnSubmitQuiz.addEventListener('click', openSubmitConfirmationModal);

  // Submit Modal Actions
  elements.btnCloseModal.addEventListener('click', closeSubmitModal);
  elements.btnCancelSubmit.addEventListener('click', closeSubmitModal);
  elements.btnConfirmSubmit.addEventListener('click', finalizeAndSubmit);

  // Settings Modal Actions
  elements.btnOpenSettings.addEventListener('click', openSettingsModal);
  elements.btnCloseSettings.addEventListener('click', closeSettingsModal);
  elements.btnSaveSettings.addEventListener('click', saveSettings);

  // Result Review Filters
  elements.filterAll.addEventListener('click', () => setReviewFilter('all'));
  elements.filterCorrect.addEventListener('click', () => setReviewFilter('correct'));
  elements.filterWrong.addEventListener('click', () => setReviewFilter('wrong'));

  // Result Actions
  elements.btnPrintReport.addEventListener('click', () => window.print());
  elements.btnCopyReport.addEventListener('click', copyReportToClipboard);

  // Keyboard Navigation (1, 2, 3, 4 for options, arrows for navigation)
  document.addEventListener('keydown', handleKeyboardNav);
}

// --------------------------------------------------------------------------
// Start Quiz
// --------------------------------------------------------------------------
function handleStartQuiz(e) {
  e.preventDefault();

  state.student.name = elements.studentName.value.trim();
  state.student.email = elements.studentEmail.value.trim();
  state.student.phone = elements.studentPhone.value.trim();
  state.student.academicInfo = elements.academicInfo.value.trim();

  if (!state.student.name || !state.student.email || !state.student.phone) {
    showToast('يرجى ملء جميع الحقول المطلوبة بالكامل', '⚠️');
    return;
  }

  state.startTime = new Date();

  // Transition UI
  elements.welcomeScreen.style.display = 'none';
  elements.quizScreen.style.display = 'block';
  elements.quizTimer.style.display = 'flex';
  elements.stickyProgress.style.display = 'block';

  // Render question map dots & view
  renderQuestionMap();
  renderCurrentQuestion();

  // Start Countdown Timer
  startTimer();

  showToast(`أهلاً بك يا ${state.student.name}، بالتوفيق في اختبار AutoVroom! 🏎️`, '⚡');
}

// --------------------------------------------------------------------------
// Countdown Timer
// --------------------------------------------------------------------------
function startTimer() {
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;

    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      state.timerSeconds = 0;
      updateTimerDisplay();
      showToast('انتهى الوقت المحدد للاختبار! يتم تسليم الإجابات الآن تلقائياً.', '⏰');
      finalizeAndSubmit();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timerSeconds / 60);
  const seconds = state.timerSeconds % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  elements.timerText.textContent = formatted;

  if (state.timerSeconds <= 180 && state.timerSeconds > 60) {
    elements.quizTimer.classList.add('warning');
    elements.quizTimer.classList.remove('danger');
  } else if (state.timerSeconds <= 60) {
    elements.quizTimer.classList.remove('warning');
    elements.quizTimer.classList.add('danger');
  }
}

// --------------------------------------------------------------------------
// Question Rendering & Navigation
// --------------------------------------------------------------------------
function renderQuestionMap() {
  elements.questionsMap.innerHTML = '';

  state.questions.forEach((q, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'nav-dot';
    dot.id = `nav-dot-${idx}`;
    dot.textContent = idx + 1;
    dot.title = `سؤال رقم ${idx + 1}: ${q.question}`;

    if (idx === state.currentQuestionIndex && state.viewMode === 'step') {
      dot.classList.add('active');
    }
    if (state.answers[q.id] !== undefined) {
      dot.classList.add('answered');
    }

    dot.addEventListener('click', () => {
      if (state.viewMode === 'step') {
        state.currentQuestionIndex = idx;
        renderCurrentQuestion();
      } else {
        const el = document.getElementById(`q-card-${q.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    elements.questionsMap.appendChild(dot);
  });
}

function updateProgress() {
  const answeredCount = Object.keys(state.answers).length;
  const total = state.questions.length;
  const percentage = Math.round((answeredCount / total) * 100);

  elements.answeredCount.textContent = answeredCount;
  elements.percentageBadge.textContent = `${percentage}%`;
  elements.progressFill.style.width = `${percentage}%`;

  state.questions.forEach((q, idx) => {
    const dot = document.getElementById(`nav-dot-${idx}`);
    if (!dot) return;

    dot.classList.remove('active', 'answered');

    if (idx === state.currentQuestionIndex && state.viewMode === 'step') {
      dot.classList.add('active');
    }
    if (state.answers[q.id] !== undefined) {
      dot.classList.add('answered');
    }
  });
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'step') {
    elements.modeStepBtn.classList.add('active');
    elements.modeAllBtn.classList.remove('active');
    elements.singleQuestionArea.style.display = 'block';
    elements.allQuestionsArea.style.display = 'none';
    elements.btnPrevQuestion.style.display = 'inline-flex';
    elements.btnNextQuestion.style.display = 'inline-flex';
    renderCurrentQuestion();
  } else {
    elements.modeStepBtn.classList.remove('active');
    elements.modeAllBtn.classList.add('active');
    elements.singleQuestionArea.style.display = 'none';
    elements.allQuestionsArea.style.display = 'block';
    elements.btnPrevQuestion.style.display = 'none';
    elements.btnNextQuestion.style.display = 'none';
    elements.btnSubmitQuiz.style.display = 'inline-flex';
    renderAllQuestions();
  }
  updateProgress();
}

// Helper: Escape HTML characters and format code tags
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatOptionLabel(opt) {
  const escaped = escapeHtml(opt);
  if (opt.includes('<') && opt.includes('>')) {
    return `<code class="code-badge">${escaped}</code>`;
  }
  return escaped;
}

function renderCurrentQuestion() {
  const q = state.questions[state.currentQuestionIndex];
  const total = state.questions.length;
  const isSelected = state.answers[q.id];

  const html = `
    <div class="cyber-card question-card" id="q-card-${q.id}">
      <div class="question-header">
        <div class="q-badge-wrap">
          <span class="q-num-badge">سؤال ${state.currentQuestionIndex + 1} / ${total}</span>
          <span class="q-category-badge">${escapeHtml(q.category)}</span>
        </div>
        <span style="font-size: 0.85rem; color: var(--text-dim); font-family: var(--font-mono);">Mark: 1.0</span>
      </div>

      <h2 class="question-title">${escapeHtml(q.question)}</h2>

      <div class="options-list">
        ${q.options.map((opt, optIdx) => `
          <div class="option-item ${isSelected === optIdx ? 'selected' : ''}" 
               data-qid="${q.id}" 
               data-opt="${optIdx}">
            <div class="option-radio"></div>
            <span class="option-label">${formatOptionLabel(opt)}</span>
            <span style="font-size: 0.82rem; color: var(--text-dim); font-family: var(--font-mono); font-weight: 700;">${optIdx + 1}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  elements.singleQuestionArea.innerHTML = html;

  // Click handlers
  const optionEls = elements.singleQuestionArea.querySelectorAll('.option-item');
  optionEls.forEach(el => {
    el.addEventListener('click', () => {
      const qid = Number(el.dataset.qid);
      const optIdx = Number(el.dataset.opt);
      selectOption(qid, optIdx);
    });
  });

  // Next / Submit Buttons
  elements.btnPrevQuestion.disabled = state.currentQuestionIndex === 0;
  if (state.currentQuestionIndex === total - 1) {
    elements.btnNextQuestion.style.display = 'none';
    elements.btnSubmitQuiz.style.display = 'inline-flex';
  } else {
    elements.btnNextQuestion.style.display = 'inline-flex';
    elements.btnSubmitQuiz.style.display = 'none';
  }

  updateProgress();
}

function renderAllQuestions() {
  const html = state.questions.map((q, qIdx) => {
    const isSelected = state.answers[q.id];
    return `
      <div class="cyber-card question-card" id="q-card-${q.id}">
        <div class="question-header">
          <div class="q-badge-wrap">
            <span class="q-num-badge">سؤال ${qIdx + 1} / ${state.questions.length}</span>
            <span class="q-category-badge">${escapeHtml(q.category)}</span>
          </div>
        </div>

        <h2 class="question-title">${escapeHtml(q.question)}</h2>

        <div class="options-list">
          ${q.options.map((opt, optIdx) => `
            <div class="option-item ${isSelected === optIdx ? 'selected' : ''}" 
                 data-qid="${q.id}" 
                 data-opt="${optIdx}">
              <div class="option-radio"></div>
              <span class="option-label">${formatOptionLabel(opt)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  elements.allQuestionsArea.innerHTML = html;

  const optionEls = elements.allQuestionsArea.querySelectorAll('.option-item');
  optionEls.forEach(el => {
    el.addEventListener('click', () => {
      const qid = Number(el.dataset.qid);
      const optIdx = Number(el.dataset.opt);
      selectOption(qid, optIdx);
    });
  });
}

function selectOption(qid, optIdx) {
  state.answers[qid] = optIdx;

  if (state.viewMode === 'step') {
    renderCurrentQuestion();
  } else {
    const card = document.getElementById(`q-card-${qid}`);
    if (card) {
      card.querySelectorAll('.option-item').forEach((item, idx) => {
        if (idx === optIdx) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    }
    updateProgress();
  }
}

function navigateQuestion(delta) {
  const newIndex = state.currentQuestionIndex + delta;
  if (newIndex >= 0 && newIndex < state.questions.length) {
    state.currentQuestionIndex = newIndex;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function handleKeyboardNav(e) {
  if (state.isSubmitted || elements.quizScreen.style.display === 'none') return;

  if (['1', '2', '3', '4'].includes(e.key) && state.viewMode === 'step') {
    const q = state.questions[state.currentQuestionIndex];
    const optIdx = parseInt(e.key, 10) - 1;
    if (q.options[optIdx]) {
      selectOption(q.id, optIdx);
    }
  }

  if (e.key === 'ArrowLeft' && state.viewMode === 'step') {
    navigateQuestion(1);
  } else if (e.key === 'ArrowRight' && state.viewMode === 'step') {
    navigateQuestion(-1);
  }
}

// --------------------------------------------------------------------------
// Submission Confirmation Modal
// --------------------------------------------------------------------------
function openSubmitConfirmationModal() {
  const answeredCount = Object.keys(state.answers).length;
  const total = state.questions.length;
  const unansweredCount = total - answeredCount;

  let modalContentHtml = '';

  if (unansweredCount > 0) {
    const unansweredIds = state.questions
      .map((q, idx) => ({ q, idx: idx + 1 }))
      .filter(item => state.answers[item.q.id] === undefined);

    modalContentHtml = `
      <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px;">
        <div style="font-weight: 800; color: #fbbf24; margin-bottom: 6px; font-size: 1.05rem;">⚠️ تنبيه: أسئلة متبقية بدون إجابة</div>
        <p style="color: #cbd5e1; font-size: 0.95rem;">
          لقد قمت بالإجابة على <strong>${answeredCount}</strong> سؤال، وما زال لديك <strong>${unansweredCount}</strong> سؤال بحاجة لإجابة:
        </p>
      </div>

      <div class="unanswered-list">
        ${unansweredIds.map(item => `
          <button type="button" class="nav-dot" style="width: 38px; height: 38px; border-color: #f59e0b; color: #fbbf24;" onclick="window.jumpToQuestion(${item.idx - 1})">
            ${item.idx}
          </button>
        `).join('')}
      </div>
      <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 10px;">اضغط على أي رقم للانتقال إليه مباشرة، أو اضغط "تأكيد التسليم" للإنهاء الآن.</p>
    `;
  } else {
    modalContentHtml = `
      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-md); padding: 22px; text-align: center;">
        <div style="font-size: 2.4rem; margin-bottom: 8px;">🏁</div>
        <div style="font-weight: 800; color: #34d399; font-size: 1.2rem; margin-bottom: 6px;">رائع جداً! تم الإجابة على جميع الأسئلة الـ 20</div>
        <p style="color: #e2e8f0; font-size: 0.96rem;">
          هل أنت مستعد لإنهاء الاختبار وتسليم إجاباتك وعرض تقرير نتيجتك النهائية؟
        </p>
      </div>
    `;
  }

  elements.modalBody.innerHTML = modalContentHtml;
  elements.submitModal.classList.add('active');
}

function closeSubmitModal() {
  elements.submitModal.classList.remove('active');
}

window.jumpToQuestion = function(idx) {
  closeSubmitModal();
  setViewMode('step');
  state.currentQuestionIndex = idx;
  renderCurrentQuestion();
};

// --------------------------------------------------------------------------
// Final Score Calculation & Submission
// --------------------------------------------------------------------------
async function finalizeAndSubmit() {
  closeSubmitModal();
  if (state.isSubmitted) return;

  state.isSubmitted = true;
  clearInterval(state.timerInterval);
  state.endTime = new Date();

  // Elapsed time
  const timeDiffMs = state.endTime - state.startTime;
  const minutesSpent = Math.floor(timeDiffMs / 60000);
  const secondsSpent = Math.floor((timeDiffMs % 60000) / 1000);
  state.timeSpentFormatted = `${minutesSpent} دقيقة و ${secondsSpent} ثانية`;

  // Calculate score
  let score = 0;
  const answersDetail = state.questions.map((q, idx) => {
    const userChoice = state.answers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      questionNumber: idx + 1,
      category: q.category,
      question: q.question,
      options: q.options,
      userChoice: userChoice !== undefined ? userChoice : null,
      userAnswerText: userChoice !== undefined ? q.options[userChoice] : 'لم يُجب المتقدم',
      correctChoice: q.correctAnswer,
      correctAnswerText: q.options[q.correctAnswer],
      explanation: q.explanation,
      isCorrect
    };
  });

  const total = state.questions.length;
  const percentage = Math.round((score / total) * 100);

  // Transition to Result Screen
  elements.quizScreen.style.display = 'none';
  elements.stickyProgress.style.display = 'none';
  elements.quizTimer.style.display = 'none';
  elements.resultScreen.style.display = 'block';

  // Render Result Card
  elements.finalScoreVal.textContent = score;
  elements.studentGreeting.textContent = `عاش يا ${state.student.name}!`;
  elements.resultSummary.textContent = `النسبة المئوية: ${percentage}% · الوقت المستغرق: ${state.timeSpentFormatted}`;

  // Performance Badge
  if (percentage >= 85) {
    elements.resultBadge.className = 'result-badge excellent';
    elements.resultBadge.textContent = '🚀 مستوى أسطوري (مؤهل بجدارة للفريق)';
    triggerConfetti();
  } else if (percentage >= 60) {
    elements.resultBadge.className = 'result-badge good';
    elements.resultBadge.textContent = '👏 أداء متميز ومبشر جداً';
    triggerConfetti();
  } else {
    elements.resultBadge.className = 'result-badge needs-work';
    elements.resultBadge.textContent = '💪 بداية جيدة — واصل التعلم والممارسة';
  }

  // Configure WhatsApp Share Link
  const waMsg = encodeURIComponent(
    `🏎️ نتيجة اختبار الويب — AutoVroom CS Team (Innovation University):\n` +
    `👤 المتقدم: ${state.student.name}\n` +
    `🎯 الدرجة: ${score} من ${total} (${percentage}%)\n` +
    `⏱️ الوقت المستغرق: ${state.timeSpentFormatted}`
  );
  elements.btnWhatsAppShare.href = `https://wa.me/?text=${waMsg}`;

  // Render detailed educational review
  renderReviewSheet(answersDetail);

  // Dispatch Email Report
  await dispatchEmailReport({
    student: state.student,
    score,
    total,
    percentage,
    timeSpent: state.timeSpentFormatted,
    answers: answersDetail
  });
}

// --------------------------------------------------------------------------
// Email Dispatcher
// --------------------------------------------------------------------------
async function dispatchEmailReport(payload) {
  elements.emailStatusCard.className = 'email-status-card';
  elements.emailStatusIcon.textContent = '⏳';
  elements.emailStatusTitle.textContent = 'جاري إرسال النتيجة إلى بريد الفريق...';
  elements.emailStatusDesc.textContent = 'يتم الآن توصيل التقرير الإلكتروني.';

  const adminEmail = state.adminEmail;
  const web3Key = state.web3Key;

  try {
    // 1. Try Vercel Serverless Function first (/api/submit)
    try {
      const serverlessRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, web3Key })
      });

      if (serverlessRes.ok) {
        const json = await serverlessRes.json();
        if (json.success && !json.needsClientFallback) {
          markEmailSuccess(adminEmail);
          return;
        }
      }
    } catch {
      // Local dev fallback
    }

    // 2. Direct Web3Forms submission (Free & Serverless)
    if (web3Key && web3Key !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
      const w3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `🏎️ [نتيجة اختبار AutoVroom CS] ${payload.student.name} (${payload.score}/${payload.total})`,
          from_name: 'AutoVroom CS Team',
          name: payload.student.name,
          email: payload.student.email,
          phone: payload.student.phone,
          message: formatTextReport(payload)
        })
      });

      const w3Data = await w3Response.json();
      if (w3Data.success) {
        markEmailSuccess(adminEmail);
        return;
      }
    }

    // 3. Custom Webhook
    if (state.webhookUrl) {
      await fetch(state.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      markEmailSuccess('الـ Webhook وقاعدة البيانات');
      return;
    }

    // 4. Default Notice
    elements.emailStatusCard.className = 'email-status-card';
    elements.emailStatusIcon.textContent = 'ℹ️';
    elements.emailStatusTitle.textContent = 'تم تسجيل النتيجة محلياً بنجاح';
    elements.emailStatusDesc.textContent = `لإرسال النتيجة إلى ${adminEmail} تلقائياً على Vercel، يمكنك إدخال مفتاح Web3Forms المجاني من زر الإعدادات ⚙️ بأعلى الصفحة.`;

  } catch (error) {
    console.error('Email dispatch error:', error);
    elements.emailStatusCard.className = 'email-status-card error';
    elements.emailStatusIcon.textContent = '⚠️';
    elements.emailStatusTitle.textContent = 'تم حفظ النتيجة محلياً';
    elements.emailStatusDesc.textContent = 'يمكنك نسخ التقرير أو إرساله عبر واتساب بضغطة زر.';
  }
}

function markEmailSuccess(target) {
  elements.emailStatusCard.className = 'email-status-card';
  elements.emailStatusIcon.textContent = '✅';
  elements.emailStatusTitle.textContent = 'تم إرسال تقرير النتيجة بنجاح!';
  elements.emailStatusDesc.textContent = `وصل التقرير المفصل مع الإجابات إلى إدارة الفريق (${target}).`;
  showToast('تم إرسال النتيجة إلى الإيميل بنجاح!', '📬');
}

function formatTextReport(payload) {
  return `
=== نتيجة اختبار AutoVroom CS Team — Innovation University ===
اسم المتقدم: ${payload.student.name}
البريد الإلكتروني: ${payload.student.email}
الهاتف / واتساب: ${payload.student.phone}
الكلية: ${payload.student.academicInfo || 'غير محدد'}
الدرجة: ${payload.score} من ${payload.total} (${payload.percentage}%)
الوقت المستغرق: ${payload.timeSpent}

--- تفاصيل الإجابات (20 سؤال) ---
${payload.answers.map(a => `
س${a.questionNumber}: ${a.question}
إجابة المتقدم: ${a.userAnswerText} [${a.isCorrect ? 'صحيحة ✔️' : 'خاطئة ❌'}]
الإجابة الصحيحة: ${a.correctAnswerText}
الشرح: ${a.explanation}
`).join('\n')}
  `;
}

// --------------------------------------------------------------------------
// Detailed Review & Educational Explanations
// --------------------------------------------------------------------------
function renderReviewSheet(answers) {
  const container = elements.answersReviewContainer;
  container.innerHTML = '';

  const filtered = answers.filter(a => {
    if (state.reviewFilter === 'correct') return a.isCorrect;
    if (state.reviewFilter === 'wrong') return !a.isCorrect;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 24px;">لا توجد عناصر مطابقة لهذا الفلتر.</p>`;
    return;
  }

  filtered.forEach(a => {
    const item = document.createElement('div');
    item.className = `review-item ${a.isCorrect ? 'is-correct' : 'is-incorrect'}`;

    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="q-category-badge">${a.category}</span>
        <span style="font-weight: 800; font-size: 0.92rem; color: ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">
          ${a.isCorrect ? '✔️ إجابة صحيحة (+1)' : '❌ إجابة خاطئة (0)'}
        </span>
      </div>

      <h4 class="review-q-title">س${a.questionNumber}: ${escapeHtml(a.question)}</h4>

      <div class="review-ans-row">
        <div class="ans-line ${a.isCorrect ? 'user-choice-correct' : 'user-choice-wrong'}">
          <strong>إجابتك:</strong> <span>${formatOptionLabel(a.userAnswerText)}</span>
        </div>
        ${!a.isCorrect ? `
          <div class="ans-line model-ans">
            <strong>الإجابة النموذجية:</strong> <span>${formatOptionLabel(a.correctAnswerText)}</span>
          </div>
        ` : ''}
      </div>

      <div class="explanation-box">
        💡 <strong>الشرح التعليمي:</strong> ${escapeHtml(a.explanation)}
      </div>
    `;

    container.appendChild(item);
  });
}

function setReviewFilter(filter) {
  state.reviewFilter = filter;
  elements.filterAll.classList.toggle('active', filter === 'all');
  elements.filterCorrect.classList.toggle('active', filter === 'correct');
  elements.filterWrong.classList.toggle('active', filter === 'wrong');

  const answersDetail = state.questions.map((q, idx) => {
    const userChoice = state.answers[q.id];
    return {
      questionId: q.id,
      questionNumber: idx + 1,
      category: q.category,
      question: q.question,
      userAnswerText: userChoice !== undefined ? q.options[userChoice] : 'لم يُجب المتقدم',
      correctAnswerText: q.options[q.correctAnswer],
      explanation: q.explanation,
      isCorrect: userChoice === q.correctAnswer
    };
  });

  renderReviewSheet(answersDetail);
}

// --------------------------------------------------------------------------
// Settings Modal
// --------------------------------------------------------------------------
function openSettingsModal() {
  elements.settingsModal.classList.add('active');
}

function closeSettingsModal() {
  elements.settingsModal.classList.remove('active');
}

function saveSettings() {
  const newEmail = elements.inputAdminEmail.value.trim();
  const newKey = elements.inputWeb3Key.value.trim();
  const newWebhook = elements.inputWebhookUrl.value.trim();

  if (newEmail) {
    state.adminEmail = newEmail;
    localStorage.setItem('autovroom_admin_email', newEmail);
  }
  if (newKey) {
    state.web3Key = newKey;
    localStorage.setItem('autovroom_web3_key', newKey);
  }
  state.webhookUrl = newWebhook;
  localStorage.setItem('autovroom_webhook_url', newWebhook);

  closeSettingsModal();
  showToast('تم حفظ الإعدادات بنجاح! ستصلك النتائج على هذا الإيميل.', '✅');
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------
function triggerConfetti() {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
  }
}

function copyReportToClipboard() {
  const total = state.questions.length;
  let score = 0;
  state.questions.forEach(q => {
    if (state.answers[q.id] === q.correctAnswer) score++;
  });
  const percentage = Math.round((score / total) * 100);

  const text = `🎯 نتيجة اختبار الويب — AutoVroom CS Team:\n` +
               `المتقدم: ${state.student.name}\n` +
               `البريد: ${state.student.email}\n` +
               `الدرجة: ${score} من ${total} (${percentage}%)\n` +
               `الوقت المستغرق: ${state.timeSpentFormatted}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('تم نسخ ملخص النتيجة إلى الحافظة بنجاح!', '📋');
  }).catch(() => {
    showToast('تعذر النسخ التلقائي.', '⚠️');
  });
}

function showToast(text, icon = 'ℹ️') {
  elements.toastText.textContent = text;
  elements.toastIcon.textContent = icon;
  elements.toast.classList.add('show');

  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 4000);
}
