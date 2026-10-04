// Vercel Serverless Function - api/submit.js
// AutoVroom — Innovation University | Computer Science Team
// يستقبل نتيجة الاختبار ويرسل إيميل مفصل للمنظم

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { student, score, total, percentage, timeSpent, answers, web3Key } = req.body;

    if (!student || !student.name || !student.email) {
      return res.status(400).json({ success: false, message: 'بيانات الطالب غير مكتملة' });
    }

    const dateFormatted = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    
    const answersHtml = answers.map((ans, idx) => {
      const isCorrect = ans.userChoice === ans.correctChoice;
      const statusColor = isCorrect ? '#10B981' : '#F43F5E';
      const statusText = isCorrect ? '✔️ إجابة صحيحة' : '❌ إجابة خاطئة';

      return `
        <div style="border-bottom: 1px solid #2d1b4e; padding: 14px 0; font-family: 'Cairo', Tahoma, sans-serif; direction: rtl; text-align: right;">
          <p style="margin: 0 0 6px; font-weight: bold; color: #ffffff; font-size: 15px;">
            س${idx + 1}: ${ans.question}
          </p>
          <div style="font-size: 14px; margin-bottom: 4px;">
            <span style="color: ${statusColor}; font-weight: bold;">[${statusText}]</span>
            <span style="color: #cbd5e1;">إجابة المتقدم: <strong style="color: #ffffff;">${ans.userAnswerText || 'لم يُجب'}</strong></span>
          </div>
          ${!isCorrect ? `<div style="font-size: 13px; color: #a855f7;">الإجابة النموذجية: <strong style="color: #c084fc;">${ans.correctAnswerText}</strong></div>` : ''}
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; background: #160b2e; padding: 6px 10px; border-radius: 4px;">
            💡 الشرح: ${ans.explanation}
          </div>
        </div>
      `;
    }).join('');

    const fullHtmlEmail = `
      <div style="background-color: #06030c; padding: 30px 15px; font-family: 'Cairo', Tahoma, sans-serif; direction: rtl; text-align: right; color: #f5f3ff;">
        <div style="max-width: 620px; margin: 0 auto; background-color: #12092a; border-radius: 16px; overflow: hidden; border: 1.5px solid #a855f7; box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); padding: 26px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 0.5px;">AUTO VROOM</h1>
            <p style="margin: 4px 0 0; color: #f3e8ff; font-size: 13px; font-weight: bold;">INNOVATION UNIVERSITY · COMPUTER SCIENCE TEAM</p>
            <p style="margin: 10px 0 0; color: #ffffff; font-size: 15px; background: rgba(0,0,0,0.25); display: inline-block; padding: 4px 14px; border-radius: 20px;">
              🎯 تقرير نتيجة اختبار تقييم الويب (Beginner Level)
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 26px;">
            
            <!-- Student Information Card -->
            <div style="background-color: #1a0f3d; border-radius: 10px; padding: 18px; margin-bottom: 22px; border-right: 4px solid #a855f7;">
              <h3 style="margin: 0 0 12px; color: #c084fc; font-size: 16px;">👤 بيانات المتقدم:</h3>
              <p style="margin: 5px 0; color: #e2e8f0;"><strong>الاسم:</strong> ${student.name}</p>
              <p style="margin: 5px 0; color: #e2e8f0;"><strong>البريد:</strong> ${student.email}</p>
              ${student.phone ? `<p style="margin: 5px 0; color: #e2e8f0;"><strong>الهاتف / واتساب:</strong> ${student.phone}</p>` : ''}
              ${student.academicInfo ? `<p style="margin: 5px 0; color: #e2e8f0;"><strong>الكلية / الفرقة:</strong> ${student.academicInfo}</p>` : ''}
              <p style="margin: 5px 0; color: #a78bfa; font-size: 13px;"><strong>تاريخ وتوقيت التسليم:</strong> ${dateFormatted}</p>
              <p style="margin: 5px 0; color: #a78bfa; font-size: 13px;"><strong>الوقت المستغرق:</strong> ${timeSpent}</p>
            </div>

            <!-- Score Banner -->
            <div style="text-align: center; background: #0a0518; border-radius: 12px; padding: 22px; margin-bottom: 26px; border: 1px solid #3b186b;">
              <div style="font-size: 14px; color: #a78bfa; margin-bottom: 4px; font-weight: bold;">الدرجة النهائية</div>
              <div style="font-size: 42px; font-weight: 900; color: ${percentage >= 60 ? '#10B981' : '#F43F5E'};">
                ${score} / ${total}
              </div>
              <div style="font-size: 17px; font-weight: bold; color: #f5f3ff; margin-top: 4px;">
                النسبة المئوية: ${percentage}%
              </div>
            </div>

            <!-- Questions Breakdown -->
            <h3 style="color: #ffffff; border-bottom: 2px solid #3b186b; padding-bottom: 10px; margin-bottom: 18px; font-size: 17px;">
              تفاصيل الإجابات (20 سؤال):
            </h3>

            <div style="background-color: #0d0722; border-radius: 10px; padding: 16px; border: 1px solid #2d1b4e;">
              ${answersHtml}
            </div>
            
            <p style="text-align: center; font-size: 12px; color: #715b94; margin-top: 26px;">
              تم إرسال هذا التقرير تلقائيًا عبر نظام اختبارات AutoVroom CS Team
            </p>
          </div>
        </div>
      </div>
    `;

    // 1. Resend integration (if RESEND_API_KEY environment variable is configured in Vercel)
    if (process.env.RESEND_API_KEY && process.env.TO_EMAIL) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'AutoVroom CS Quiz <onboarding@resend.dev>',
          to: process.env.TO_EMAIL,
          reply_to: student.email,
          subject: `🏎️ [نتيجة اختبار AutoVroom] ${student.name} (${score}/${total} - ${percentage}%)`,
          html: fullHtmlEmail
        })
      });

      if (resendRes.ok) {
        return res.status(200).json({ success: true, message: 'تم إرسال النتيجة للإيميل بنجاح عبر Resend' });
      }
    }

    // 2. Web3Forms integration
    const activeKey = process.env.WEB3FORMS_ACCESS_KEY || web3Key;
    if (activeKey && activeKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
      const w3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: activeKey,
          subject: `🏎️ [نتيجة اختبار AutoVroom CS] ${student.name} (${score}/${total})`,
          from_name: 'AutoVroom CS Team',
          name: student.name,
          email: student.email,
          message: `
نتيجة اختبار تقييم الويب (AutoVroom CS Team - Innovation University):
اسم المتقدم: ${student.name}
البريد الإلكتروني: ${student.email}
الهاتف: ${student.phone || 'غير مسجل'}
الكلية: ${student.academicInfo || 'غير مسجل'}
الدرجة: ${score} من ${total} (${percentage}%)
الوقت المستغرق: ${timeSpent}
تاريخ التقديم: ${dateFormatted}

تفاصيل الإجابات:
${answers.map((a, i) => `${i+1}. ${a.question}\nإجابة المتقدم: ${a.userAnswerText} [${a.isCorrect ? 'صحيحة ✔️' : 'خاطئة ❌'}]\nالإجابة النموذجية: ${a.correctAnswerText}`).join('\n\n')}
          `
        })
      });
      const data = await w3Response.json();
      return res.status(200).json({ success: true, data, message: 'تم الإرسال بنجاح عبر Web3Forms' });
    }

    return res.status(200).json({
      success: true,
      needsClientFallback: true,
      message: 'Serverless ready for client delivery.'
    });

  } catch (error) {
    console.error('Submit API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
