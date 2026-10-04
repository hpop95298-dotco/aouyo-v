// إعدادات نظام الاختبار واستقبال الإجابات
// AutoVroom — Innovation University | Computer Science Team
export const config = {
  // اسم الفريق والهوية
  teamName: "AutoVroom — Innovation University",
  subTeam: "Computer Science Team",
  quizTitle: "اختبار تقييم المستوى (Beginner Level) — 20 سؤال",
  totalTimeMinutes: 20, // مدة الاختبار بالدقائق

  // طريقة إرسال الإجابات إلى الإيميل:
  emailService: {
    // الطريقة الأولى: Web3Forms (أسهل طريقة بدون كتابة سطر كود خلفي ومجانية تماماً)
    // احصل على مفتاحك المجاني في ثوانٍ من https://web3forms.com وضع المفتاح هنا
    web3formsAccessKey: "0c494a24-4a78-40b5-b227-5281a6331bb7",

    // الإيميل اللي حابب تستقبل عليه الإجابات
    recipientEmail: "popheme19@gmail.com", 

    // بدائل أخرى مثل Formspree أو Webhook:
    formspreeEndpoint: "", 
    webhookEndpoint: "https://hema1115478.app.n8n.cloud/webhook/autovroom-quiz-results"
  },

  // إعدادات إضافية
  settings: {
    showScoreImmediately: true, // إظهار الدرجة للطالب فور الانتهاء
    allowReviewAfterSubmit: true, // السماح بمراجعة الإجابات والشرح العلمي
    enforceTimer: true, // إنهاء الاختبار تلقائياً عند انتهاء الوقت
    shuffleQuestions: false
  }
};
