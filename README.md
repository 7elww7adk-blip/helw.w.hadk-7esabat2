# نظام إدارة الفروع والمحاسبة والدليفري (MVP)

نظام ويب عربي (RTL) مبني بـ **Vanilla JS + Google Apps Script + Google Sheets** لإدارة:
- الفروع
- اليومية المحاسبية
- التحويلات الداخلية
- الدليفري والتسويات
- الخزنة
- التقارير
- الإعدادات

> هذا النظام **إداري/محاسبي تشغيلي** وليس POS لحظي.

## 1) Architecture Overview

- **Frontend (Static Web App)**
  - HTML/CSS/JS بدون إطار معقد
  - واجهة RTL responsive
  - إدارة الحالة على المتصفح (`localStorage`) لجلسة المستخدم
  - استدعاء API عبر `fetch` إلى Google Apps Script Web App

- **Backend (Google Apps Script)**
  - Router بسيط عبر `doPost/doGet`
  - طبقة خدمات (Business Logic)
  - طبقة Repository للتعامل مع Google Sheets
  - Utilities للأمان والتحقق وتوحيد الاستجابة

- **Data Layer (Google Sheets)**
  - كل Sheet تمثل كيانًا واضحًا (Users, Branches, ...)
  - IDs نصية بسيطة (`USR-001`, `BR-001`...)
  - Audit columns: `createdAt`, `updatedAt`, `createdBy`, `isActive`

## 2) Folder Structure

```text
.
├─ backend/
│  └─ apps-script/
│     ├─ appsscript.json
│     ├─ Config.gs
│     ├─ Utils.gs
│     ├─ Repository.gs
│     ├─ Services.gs
│     ├─ Seeds.gs
│     └─ Code.gs
├─ frontend/
│  ├─ index.html
│  └─ assets/
│     ├─ css/styles.css
│     └─ js/
│        ├─ config.example.js
│        ├─ state.js
│        ├─ api.js
│        ├─ auth.js
│        ├─ validation.js
│        ├─ ui.js
│        └─ app.js
├─ docs/
│  └─ google-sheets-schema.md
├─ data/
│  └─ seed-sample.json
└─ README.md
```

## 3) Google Sheets Schema

- راجع الملف: `docs/google-sheets-schema.md`
- السكربت يدعم إنشاء الشيتات تلقائيًا عبر `setupSpreadsheet()`

## 4) تشغيل المشروع خطوة بخطوة

### A) تجهيز Google Sheet + Apps Script
1. أنشئ Google Sheet جديدة.
2. افتح **Extensions > Apps Script**.
3. انسخ ملفات `backend/apps-script/*.gs` + `appsscript.json`.
4. عدّل `Config.gs`:
   - `SPREADSHEET_ID`
   - `ALLOW_ORIGINS`
   - `APP_SECRET`
5. شغّل الدالة `setupSpreadsheet` مرة واحدة.
6. شغّل الدالة `seedInitialData` لإضافة بيانات تجريبية.
7. Deploy > New deployment > Web app:
   - Execute as: Me
   - Who has access: Anyone with the link (أو حسب سياسة المؤسسة)
8. انسخ رابط Web App.

### B) تجهيز Frontend
1. افتح `frontend/assets/js/config.example.js`.
2. غيّر `API_BASE_URL` إلى رابط Web App.
3. احفظه باسم `config.js` في نفس المجلد.
4. افتح `frontend/index.html` (أو انشره على Netlify/GitHub Pages).

### C) تسجيل الدخول التجريبي
- صاحب المحل: `owner` / `123456`
- مدير الفرع: `manager1` / `123456`
- محاسب: `accountant` / `123456`
- مندوب: `agent1` / `123456`
- مشاهد: `viewer` / `123456`

## 5) ملاحظات MVP

- كلمات المرور في MVP مخزنة بصيغة hash بسيطة (للتجربة فقط).
- التوسع المقترح:
  - JWT حقيقي + OAuth
  - سجل تدقيق متقدم Audit Trail
  - رفع مرفقات للفواتير
  - نسخ احتياطي تلقائي
  - Dashboard رسوم بيانية متقدمة

## 6) اقتراحات تطوير لاحقة

1. Multi-tenant (أكثر من نشاط على نفس الكود)
2. Offline-first للمندوبين
3. إشعارات WhatsApp / Telegram للتسويات والتنبيهات
4. مركز صلاحيات ديناميكي أدق (permission matrix)
5. إقفال فترة محاسبية شهرية مع ترحيل تلقائي
