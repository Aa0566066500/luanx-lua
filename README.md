# Lunex Scripts

واجهة عربية داكنة لاستضافة سورسات Lua الخاصة، بتسجيل Google وصلاحيات مالك/مستخدم.

## الموجود في النسخة الأولى
- تسجيل دخول Google عبر Firebase Authentication.
- Node.js + Express API.
- PostgreSQL على Render.
- كل مستخدم يرى سورساته فقط؛ حسابات الإدارة تضبط عبر `ADMIN_EMAILS`.
- إنشاء/تعديل/حذف السورسات وتعطيلها.
- سجل أولي للأحداث ولوحة مالك.
- حماية أساسية عبر Helmet وتحديد معدل الطلبات.

## حدود مهمة
هذه نسخة تأسيسية وليست نظامًا جاهزًا لاستضافة سكربتات تنفيذ Roblox العامة.
لا توجد حاليًا نقطة نهاية عامة تُرجع محتوى السورس دون تسجيل دخول.
لإضافة منفّذ موثوق، يلزم تصميم تدفق تفويض مستقل قابل للتحقق، وعدم تضمين أسرار ثابتة داخل سكربت العميل.
أي معلومة يرسلها العميل عن اللاعب أو المنفّذ أو التجربة يمكن تزويرها.
لا يمكن ضمان منع استخراج الكود بعد إرساله إلى جهاز العميل.

## 1) Firebase Google Login
1. افتح https://console.firebase.google.com وأنشئ مشروعًا.
2. Authentication → Sign-in method → فعّل Google.
3. Project settings → أضف تطبيق Web وانسخ إعدادات `firebaseConfig`.
4. عدّل `frontend/app.js` واستبدل القيم `REPLACE_WITH_...`.
5. Authentication → Settings → Authorized domains، أضف نطاق Render بعد النشر.

## 2) Firebase Admin credentials
1. Project settings → Service accounts → Generate new private key.
2. انسخ محتوى JSON كاملًا بأمان.
3. في Render أضف Environment Variable اسمه `FIREBASE_SERVICE_ACCOUNT_JSON`، وضع JSON كاملًا كقيمة.
4. لا ترفع ملف الخدمة إلى GitHub ولا ترسله لأحد.

## 3) النشر على Render من iPad
1. أنشئ مستودع GitHub وارفع هذه الملفات.
2. في Render اختر New → Blueprint واربط المستودع.
3. راجع إنشاء Web Service وقاعدة البيانات من `render.yaml`.
4. أضف متغير `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. أضف `ADMIN_EMAILS` وضع بريد Google الإداري الذي ستستخدمه.
6. انشر الخدمة وانتظر نجاح Build وDeploy.
7. أضف نطاق الموقع إلى Firebase Authorized domains.

## 4) ملاحظات تشغيل
- لا تشارك مفاتيح Firebase Admin أو كلمات مرور قاعدة البيانات.
- إعداد `ADMIN_EMAILS` هو الذي يحدد حسابات الإدارة، وليس قيمة من الواجهة.
- اختبر بحسابين: يجب أن يحصل كل حساب على سورساته فقط.
- خطط نسخ احتياطي لقاعدة البيانات قبل الاستخدام الفعلي.
- ملف `render.yaml` يستخدم خطة `free` إذا كانت متاحة لحسابك/منطقتك؛ قد تتغير الأسعار والقيود.
