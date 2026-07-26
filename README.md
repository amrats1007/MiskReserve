# 🏛️ مِسك رُومز | MiskReserve
### نظام حجز قاعات الاجتماعات والتدريب الإلكتروني - MiskTech

نظام ذكي مزدوج اللغة (عربي / إنجليزي) مخصص لشركة **MiskTech** لتنظيم وتمتتة حجوزات قاعات الاجتماعات وقاعات التدريب لحل مشكلة **سجل السكرتارية الورقي** نهائياً وتحويله إلى سجل إلكتروني تفاعلي متكامل يضمن منع تضارب الحجوزات وتسهيل عمل فريق الدعم الفني والسكرتارية.

---

## 🚀 المميزات الرئيسية (Key Features)

- 🌐 **دعم كامل للغتين (عربي / English)**: تحويل فوري بضغطة زر مع تنسيق RTL للغة العربية و LTR للإنجليزية.
- 📖 **سجل السكرتارية الإلكتروني (Digital Logbook)**: بديل عصري لكشكول السكرتارية الورقي يعرض اسم الحاجز، اسم الجهة/الإدارة، الموضوع، التواريخ والأوقات، وملاحظات الدعم الفني.
- 🗓️ **جدول المواعيد التفاعلي (Interactive Calendar Grid)**: يعرض ساعات اليوم (من 08:00 إلى 18:00) لكل قاعة بوضوح (الأوقات الشاغرة vs المشغولة).
- ⚡ **محرك منع تضارب الحجوزات (Conflict Detection Engine)**: يفحص السجل تلقائياً قبل الحفظ ويحذر المستخدم فورا في حال كان الوقت المطلوب مشغولا.
- 🖨️ **إمكانية طباعة السجل اليومي (Print-Ready Schedule)**: تنسيق طباعة مخصص للسكرتارية لطباعة جدول حجوزات اليوم وتعليقه على لوحة الإعلانات.
- 📊 **إحصائيات مباشرة (Real-time Analytics)**: استعراض إجمالي الحجوزات، الفعاليات النشطة اليوم، القاعة الأكثر طلباً، والجهة الأكثر استخداماً للقاعات.
- 🧰 **دليل القاعات والتجهيزات التقنية (Rooms Directory)**: استعراض سعة كل قاعة والتجهيزات المتوفرة بها (بروجكتور، مايكروفون، سبورة تفاعلية، فيديو كونفرانس، ضيافة، أجهزة كمبيوتر).
- 🐘 **قاعدة بيانات سحابية Neon PostgreSQL**: ربط مباشر مع قاعدة بيانات نيون السحابية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework**: Next.js (App Router, React 19, TypeScript)
- **Styling**: Vanilla CSS3 + Tailwind CSS v4 + Glassmorphism Design
- **Database**: Neon PostgreSQL via `@neondatabase/serverless`
- **Icons**: Lucide React
- **Hosting & Deployment**: Vercel & GitHub

---

## 🗄️ هيكل قاعدة البيانات (Neon Database Schema)

مشروع Neon باسم: **`MiskReserve`** (Project ID: `dry-scene-62258910`)

```sql
-- جدول القاعات
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL DEFAULT 10,
    location_ar VARCHAR(150),
    location_en VARCHAR(150),
    amenities JSONB DEFAULT '[]'::jsonb,
    color VARCHAR(20) DEFAULT '#6366f1',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الحجوزات
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    booker_name VARCHAR(150) NOT NULL,
    booker_email VARCHAR(150),
    booker_phone VARCHAR(50),
    entity_name VARCHAR(150) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) DEFAULT 'meeting',
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    attendees_count INT DEFAULT 1,
    requested_equipment JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 الخطوات للرفع على Vercel (Vercel Deployment)

1. ربط المشروع بمستودع GitHub: `https://github.com/amrats1007/MiskReserve.git`
2. إضافة متغّير البيئة (Environment Variable) على Vercel:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://neondatabase_owner:npg_4kRYIDedXsO9@ep-soft-hall-a6af11b3-pooler.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require`
3. سيقوم Vercel بالنشر التلقائي ومزامنة أحدث التغييرات فورا.

---
تم التطوير لشركة **MiskTech - قسم الدعم الفني 2026**.
