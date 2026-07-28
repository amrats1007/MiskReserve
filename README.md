# 🏛️ مِسك رُومز | MiskReserve
### نظام حجز قاعات الاجتماعات والتدريب الإلكتروني - MiskTech

نظام ذكي مزدوج اللغة (عربي / إنجليزي) مخصص لشركة **MiskTech** لتنظيم وتمتتة حجوزات قاعات الاجتماعات وقاعات التدريب لحل مشكلة **سجل السكرتارية الورقي** نهائياً وتحويله إلى سجل إلكتروني تفاعلي متكامل يضمن منع تضارب الحجوزات وتسهيل عمل فريق الدعم الفني والسكرتارية.

---

## 🚀 المميزات الرئيسية (Key Features)

- 🌐 **دعم كامل للغتين (عربي / English)**: تحويل فوري بضغطة زر مع تنسيق RTL للغة العربية و LTR للإنجليزية.
- 📖 **سجل السكرتارية الإلكتروني (Digital Logbook)**: بديل عصري لكشكول السكرتارية الورقي يعرض اسم الحاجز، اسم الجهة/الإدارة، الموضوع، التواريخ والأوقات، وملاحظات الدعم الفني.
- 🗓️ **جدول المواعيد التفاعلي (Interactive Calendar Grid)**: يعرض ساعات اليوم لكل قاعة بوضوح (الأوقات الشاغرة vs المشغولة).
- ⚡ **محرك منع تضارب الحجوزات (Conflict Detection Engine)**: يفحص السجل تلقائياً قبل الحفظ ويحذر المستخدم فورا في حال كان الوقت المطلوب مشغولا.
- ✏️ **تعديل وتحديث الحجوزات (Booking Editing)**: إمكانية تعديل الحجوزات القائمة بواسطة الحاجز أو المشرف.
- 📊 **تصدير السجل إلى Excel (CSV Export)**: إكانية تصدير كافة الحجوزات أو الحجوزات المفلترة إلى ملف CSV بنقرة زر.
- 🖨️ **طباعة السجل اليومي (Print-Ready Schedule)**: تنسيق طباعة مخصص للسكرتارية لطباعة جدول حجوزات اليوم.
- 📊 **إحصائيات مباشرة (Real-time Analytics)**: استعراض إجمالي الحجوزات، الفعاليات النشطة اليوم، القاعة الأكثر طلباً، والجهة الأكثر استخداماً.
- 🧰 **دليل القاعات والتجهيزات التقنية (Rooms Directory)**: استعراض سعة كل قاعة والتجهيزات المتوفرة بها.
- 🐘 **قاعدة بيانات سحابية Neon PostgreSQL**: ربط مع قاعدة بيانات نيون السحابية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework**: Next.js (App Router, React 19, TypeScript)
- **Styling**: Vanilla CSS3 + Tailwind CSS v4 + Glassmorphism Design
- **Database**: Neon PostgreSQL via `@neondatabase/serverless`
- **Security**: PBKDF2 Password Hashing (600k iterations) + HMAC Token Sessions
- **Icons**: Lucide React
- **Hosting & Deployment**: Vercel & GitHub

---

## 🌐 المتغيرات البيئية (Environment Variables)

يرجى إنشاء ملف `.env.local` واستخدام المتغيرات التالية:

```bash
# Neon Database Connection String
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Secret Key for Signed Cookie Sessions
SESSION_SECRET="your-super-secret-key-here"

# Secret Key for Manual DB Init Endpoint
INIT_SECRET="your-init-secret-here"
```

---

## 🌐 الخطوات للرفع على Vercel (Vercel Deployment)

1. ربط المشروع بمستودع GitHub.
2. إضافة متغيرات البيئة في Vercel Dashboard (`DATABASE_URL`, `SESSION_SECRET`, `INIT_SECRET`).
3. النشر التلقائي ومزامنة أحدث التغييرات.

---
تم التطوير لشركة **MiskTech - قسم الدعم الفني 2026**.
