# 🔧 แก้ไขปัญหา Firestore Permissions

## ❌ ปัญหาที่พบ
```
Firestore connection error: FirebaseError: Missing or insufficient permissions.
```

## 🔍 สาเหตุ
ปัญหานี้เกิดขึ้นเพราะ:
1. **ยังไม่ได้ติดตั้ง Security Rules** ใน Firebase Console
2. **Firestore Database ยังไม่ได้เปิดใช้งาน** หรือตั้งค่าไม่ถูกต้อง
3. **Authentication ยังไม่ได้ตั้งค่า** สำหรับการเข้าถึงข้อมูล

## 🚀 วิธีแก้ไข (เลือก 1 วิธี)

### วิธีที่ 1: ใช้ Test Rules (แนะนำสำหรับการทดสอบ)

#### ขั้นตอนที่ 1: ติดตั้ง Test Rules
1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจค `wh1-transport`
3. ไปที่ **Firestore Database** > **Rules**
4. คัดลอกเนื้อหาจากไฟล์ `firestore-test-rules.rules`
5. วางในช่อง Rules Editor
6. คลิก **Publish**

#### ⚠️ คำเตือน
- Test Rules อนุญาตให้ทุกคนเข้าถึงข้อมูลได้
- ใช้เฉพาะในการทดสอบเท่านั้น
- เปลี่ยนเป็น Production Rules ก่อนใช้งานจริง

### วิธีที่ 2: ใช้ Production Rules (แนะนำสำหรับการใช้งานจริง)

#### ขั้นตอนที่ 1: ติดตั้ง Production Rules
1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจค `wh1-transport`
3. ไปที่ **Firestore Database** > **Rules**
4. คัดลอกเนื้อหาจากไฟล์ `firestore.rules`
5. วางในช่อง Rules Editor
6. คลิก **Publish**

#### ขั้นตอนที่ 2: ตั้งค่า Authentication
1. ไปที่ **Authentication** > **Sign-in method**
2. เปิดใช้งาน **Email/Password**
3. สร้างผู้ใช้ทดสอบ:
   - Email: `admin@test.com`
   - Password: `123456`

#### ขั้นตอนที่ 3: เพิ่มข้อมูลผู้ใช้ใน Firestore
1. ไปที่ **Firestore Database** > **Data**
2. สร้าง Collection ชื่อ `users`
3. สร้าง Document ใหม่:
   - Document ID: `admin@test.com`
   - Fields:
     ```
     email: "admin@test.com"
     name: "Admin User"
     role: "admin"
     active: true
     createdAt: [current timestamp]
     ```

## 🔄 ขั้นตอนการทดสอบ

### 1. ทดสอบการเชื่อมต่อ
1. เปิด `firebase-test.html`
2. คลิก **Test Firestore Connection**
3. ควรเห็นข้อความ "✅ Firestore connected successfully"

### 2. ทดสอบการ Authentication (สำหรับ Production Rules)
1. ใน `firebase-test.html`
2. ใส่ Email: `admin@test.com`
3. ใส่ Password: `123456`
4. คลิก **Test Authentication**

### 3. ทดสอบการ Migration
1. คลิก **Run Migration**
2. รอให้ข้อมูลจาก `database.json` ถูกย้ายไปยัง Firestore
3. ตรวจสอบใน Firebase Console

## 🛠️ การแก้ไขปัญหาเพิ่มเติม

### ปัญหา: Firestore Database ยังไม่ได้สร้าง
1. ไปที่ Firebase Console
2. เลือก **Firestore Database**
3. คลิก **Create database**
4. เลือก **Start in test mode** (ชั่วคราว)
5. เลือก Location ที่ใกล้ที่สุด

### ปัญหา: Project ID ไม่ตรงกัน
1. ตรวจสอบ `firebase-config.js`
2. ให้แน่ใจว่า `projectId: "wh1-transport"`
3. ตรวจสอบใน Firebase Console ว่า Project ID ถูกต้อง

### ปัญหา: API Key ไม่ถูกต้อง
1. ไปที่ Firebase Console > Project Settings
2. ไปที่แท็บ **General**
3. ในส่วน **Your apps** คัดลอก Config ใหม่
4. อัพเดทใน `firebase-config.js`

## 📞 ขั้นตอนการตรวจสอบ

### ตรวจสอบใน Browser Console
```javascript
// เปิด Developer Tools (F12)
// ไปที่แท็บ Console
// ดูว่ามี error อื่นๆ หรือไม่
```

### ตรวจสอบใน Firebase Console
1. ไปที่ **Firestore Database** > **Usage**
2. ดูว่ามีการเข้าถึงข้อมูลหรือไม่
3. ตรวจสอบ **Rules** ว่าติดตั้งแล้วหรือยัง

## ✅ เมื่อแก้ไขเสร็จแล้ว

1. **ทดสอบการเชื่อมต่อ** ใน `firebase-test.html`
2. **ทดสอบการ Migration** ข้อมูล
3. **ทดสอบ API Functions** ต่างๆ
4. **เปลี่ยนเป็น Production Rules** ก่อนใช้งานจริง

---

**หมายเหตุ**: หากยังมีปัญหา กรุณาตรวจสอบ Browser Console และ Firebase Console เพื่อดู error messages เพิ่มเติม