// بنك الأسئلة الرسمي - AutoVroom Computer Science Team
// Innovation University — Beginner Level (20 Questions)

export const quizInfo = {
  teamName: "AutoVroom — Innovation University",
  subTeam: "Computer Science Team",
  quizTitle: "اختبار تقييم المستوى (Beginner Level) — 20 سؤال",
  totalQuestions: 20,
  totalMarks: 30,
  timeMinutes: 20
};

export const quizQuestions = [
  {
    id: 1,
    category: "مفاهيم الويب",
    question: "يعني إيه Website؟",
    options: [
      "برنامج بيشتغل على الكمبيوتر بس",
      "مجموعة صفحات ومحتوى بنقدر نوصل لهم عن طريق المتصفح",
      "لغة برمجة",
      "قاعدة بيانات فقط"
    ],
    correctAnswer: 1,
    explanation: "الموقع الإلكتروني (Website) هو مجموعة من صفحات الويب والمحتوى المرتبط بها، المخزنة على سيرفر ويمكن تصفحها عبر متصفح الإنترنت."
  },
  {
    id: 2,
    category: "مفاهيم الويب",
    question: "لما تفتح Website من المتصفح، مين غالبًا بيطلب الصفحة من السيرفر؟",
    options: [
      "HTML",
      "CSS",
      "Browser",
      "GitHub"
    ],
    correctAnswer: 2,
    explanation: "المتصفح (Browser مثل Chrome أو Firefox) هو العميل (Client) اللي بيرسل طلب HTTP/HTTPS للسيرفر عشان يجيب ملفات الصفحة ويعرضها."
  },
  {
    id: 3,
    category: "HTML",
    question: "إيه اللغة الأساسية المسؤولة عن بناء هيكل صفحة الويب؟",
    options: [
      "CSS",
      "HTML",
      "JavaScript",
      "SQL"
    ],
    correctAnswer: 1,
    explanation: "لغة HTML (HyperText Markup Language) هي المسؤولة عن وضع الهيكل واللبنات الأساسية للموقع (عناوين، نصوص، صور، روابط)."
  },
  {
    id: 4,
    category: "CSS",
    question: "إيه الاستخدام الأساسي لـ CSS؟",
    options: [
      "تنسيق وتصميم الصفحة",
      "تخزين بيانات المستخدمين",
      "إدارة ملفات المشروع",
      "إرسال الإيميلات"
    ],
    correctAnswer: 0,
    explanation: "لغة CSS (Cascading Style Sheets) مسؤولة عن الشكل الجمالي: الألوان، الخطوط، المسافات، وتنسيق العناصر."
  },
  {
    id: 5,
    category: "JavaScript",
    question: "JavaScript بتُستخدم أساسًا في إيه داخل الموقع؟",
    options: [
      "كتابة النصوص فقط",
      "تغيير لون الشاشة فقط",
      "إضافة التفاعل والسلوك للصفحة",
      "إنشاء الصور فقط"
    ],
    correctAnswer: 2,
    explanation: "لغة JavaScript تضيف الحيوية والتفاعل: مثل الأزرار التفاعلية، النوافذ المنبثقة، التحقق من النماذج، والتعامل مع البيانات دون إعادة تحميل الصفحة."
  },
  {
    id: 6,
    category: "مفاهيم الويب",
    question: "إيه الفرق الأقرب بين HTML وCSS وJavaScript؟",
    options: [
      "كلهم بيعملوا نفس الوظيفة",
      "HTML للهيكل، CSS للتصميم، JavaScript للتفاعل",
      "HTML للتصميم، CSS للبيانات، JavaScript للصور",
      "CSS هي اللي بتبني السيرفر فقط"
    ],
    correctAnswer: 1,
    explanation: "التشبيه الكلاسيكي: HTML هو الهيكل العظمي، CSS هو المظهر والملابس، وJavaScript هي العضلات والحركة."
  },
  {
    id: 7,
    category: "HTML",
    question: "أنهي Tag بنستخدمه لعنوان رئيسي في HTML؟",
    options: [
      "<p>",
      "<img>",
      "<h1>",
      "<a>"
    ],
    correctAnswer: 2,
    explanation: "وسم <h1> هو العنوان الرئيسي الأعلى رتبة في الصفحة، ويتدرج حتى <h6>."
  },
  {
    id: 8,
    category: "HTML",
    question: "أنهي Tag مناسب لكتابة فقرة نصية؟",
    options: [
      "<p>",
      "<button>",
      "<div>",
      "<img>"
    ],
    correctAnswer: 0,
    explanation: "وسم <p> يرمز إلى Paragraph وهو المخصص لكتابة الفقرات النصية في HTML."
  },
  {
    id: 9,
    category: "HTML",
    question: "إزاي تعمل رابط لصفحة تانية في HTML؟",
    options: [
      "<linkto>",
      "<a href=\"...\">",
      "<p url=\"...\">",
      "<button href=\"...\">"
    ],
    correctAnswer: 1,
    explanation: "وسم <a> (Anchor) مع الخاصية href هو الطريقة القياسية لإنشاء الروابط التشعبية."
  },
  {
    id: 10,
    category: "HTML",
    question: "أنهي Tag بنستخدمه لعرض صورة؟",
    options: [
      "<picture-text>",
      "<a>",
      "<img>",
      "<h1>"
    ],
    correctAnswer: 2,
    explanation: "وسم <img> مع الخاصية src هو الوسم المستخدم لتضمين الصور داخل صفحة الويب."
  },
  {
    id: 11,
    category: "HTML",
    question: "أنهي Tag مناسب لزرار قابل للضغط؟",
    options: [
      "<button>",
      "<h1>",
      "<p>",
      "<title>"
    ],
    correctAnswer: 0,
    explanation: "وسم <button> هو المخصص للأزرار التفاعلية القابلة للنقر لتنفيذ أوامر أو إرسال استمارات."
  },
  {
    id: 12,
    category: "HTML",
    question: "إيه الاستخدام الشائع لـ div؟",
    options: [
      "تشغيل قاعدة البيانات",
      "تجميع عناصر الصفحة داخل حاوية",
      "إضافة صورة تلقائيًا",
      "كتابة كود CSS فقط"
    ],
    correctAnswer: 1,
    explanation: "عنصر <div> (Division) هو حاوية عامة تُستخدم لتجميع عناصر وتطبيق تنسيقات أو تنظيم التخطيط بواسطة CSS."
  },
  {
    id: 13,
    category: "CSS",
    question: "في CSS، إزاي تغيّر لون النص؟",
    options: [
      "font-size",
      "background-image",
      "color",
      "margin"
    ],
    correctAnswer: 2,
    explanation: "الخاصية color في CSS هي المسؤولة عن تحديد لون النص (Foreground Color)."
  },
  {
    id: 14,
    category: "CSS",
    question: "إيه الفرق بين Margin وPadding؟",
    options: [
      "مفيش فرق",
      "Margin مساحة خارج العنصر، وPadding مساحة داخلية بين المحتوى والحدود",
      "Padding خارج العنصر وMargin داخل المحتوى",
      "الاتنين لتغيير لون النص"
    ],
    correctAnswer: 1,
    explanation: "في الـ Box Model: الـ Margin مساحة خارجية تبعد العنصر عن جيرانه، والـ Padding مساحة داخلية بين المحتوى وإطار العنصر (Border)."
  },
  {
    id: 15,
    category: "CSS",
    question: "لو عايز تكبّر حجم الخط في CSS، تستخدم إيه؟",
    options: [
      "font-size",
      "font-color",
      "text-space",
      "size-text"
    ],
    correctAnswer: 0,
    explanation: "الخاصية font-size هي المسؤولة عن التحكم في حجم ونسبة خط النص في CSS."
  },
  {
    id: 16,
    category: "تصميم الويب",
    question: "يعني إيه Responsive Website؟",
    options: [
      "موقع بيشتغل على الكمبيوتر فقط",
      "موقع بيتكيف مع أحجام الشاشات المختلفة",
      "موقع من غير صور",
      "موقع محتاج إنترنت سريع فقط"
    ],
    correctAnswer: 1,
    explanation: "الموقع المتجاوب (Responsive) هو الموقع الذي يُعاد تشكيل وتكييف عناصره تلقائياً ليظهر بشكل مثالي على الهواتف والأجهزة اللوحية وشاشات الكمبيوتر."
  },
  {
    id: 17,
    category: "مسارات الويب",
    question: "إيه المقصود بالـ Front-End؟",
    options: [
      "الجزء اللي المستخدم بيشوفه وبيتفاعل معاه",
      "السيرفر فقط",
      "قاعدة البيانات فقط",
      "نظام تشغيل الكمبيوتر"
    ],
    correctAnswer: 0,
    explanation: "الـ Front-End (واجهة المستخدم) يمثل كل ما يظهر أمام شاشة المستخدم من تصميم وتفاعل باستخدام HTML و CSS و JS."
  },
  {
    id: 18,
    category: "مسارات الويب",
    question: "إيه المقصود بالـ Back-End؟",
    options: [
      "الألوان والخطوط فقط",
      "الجزء المسؤول عن منطق السيرفر والتعامل مع البيانات",
      "شكل الزرار",
      "حجم الصور"
    ],
    correctAnswer: 1,
    explanation: "الـ Back-End هو الجزء الخلفي الكامن خلف الكواليس: السيرفر، قواعد البيانات، التحقق من الأمان، وإدارة المنطق والعمليات."
  },
  {
    id: 19,
    category: "أدوات التطوير (Git)",
    question: "إيه الفرق بين Git وGitHub؟",
    options: [
      "هما نفس الحاجة بالضبط",
      "Git لغة تصميم وGitHub متصفح",
      "Git لإدارة إصدارات الكود، وGitHub منصة لاستضافة المستودعات والتعاون",
      "Git لتصميم الصور وGitHub لكتابة HTML"
    ],
    correctAnswer: 2,
    explanation: "Git هو برنامج محلي لتتبع التغييرات وإدارة النسخ (Version Control)، بينما GitHub هي خدمة سحابية لحفظ ومشاركة وإدارة تلك المشاريع سحابياً بين المبرمجين."
  },
  {
    id: 20,
    category: "أدوات التطوير (Git)",
    question: "لو فريق بيشتغل على نفس Website، إزاي Git بيساعدهم؟",
    options: [
      "بيمنع أي حد يعدل الكود",
      "بيحذف النسخ القديمة تلقائيًا دائمًا",
      "بيساعد على تتبع التغييرات ودمج شغل الفريق",
      "بيحوّل HTML إلى CSS"
    ],
    correctAnswer: 2,
    explanation: "Git يتيح للفريق العمل بالتوازي من خلال الـ Branches، تتبع كل تعديل بدقة، وحل أي تعارض ودمج الأكواد بسهولة وأمان."
  }
];
