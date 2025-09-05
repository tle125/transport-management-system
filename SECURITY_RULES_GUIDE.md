# Firebase Security Rules สำหรับระบบขนส่ง

## 📋 ภาพรวม

ไฟล์ `firestore.rules` ประกอบด้วยกฎความปลอดภัยสำหรับ Firestore Database ที่ควบคุมการเข้าถึงข้อมูลตามบทบาทของผู้ใช้

## 👥 บทบาทผู้ใช้ (User Roles)

### 🔴 Admin
- สิทธิ์สูงสุด: อ่าน/เขียนข้อมูลทุกประเภท
- จัดการผู้ใช้ทั้งหมด
- ลบข้อมูลได้
- เข้าถึง audit logs และ settings

### 🟡 Manager
- อ่านข้อมูลผู้ใช้ทั้งหมด
- แก้ไขผู้ใช้ที่ไม่ใช่ admin
- จัดการยานพาหนะและการขนส่ง
- สร้างการแจ้งเตือน
- อ่าน settings

### 🟢 Driver
- อ่านข้อมูลส่วนตัว
- อ่านยานพาหนะที่ได้รับมอบหมาย
- อัพเดทสถานะยานพาหนะ (บำรุงรักษา)
- อ่าน/อัพเดทการขนส่งที่ได้รับมอบหมาย
- สร้างรายงาน

## 📊 กฎการเข้าถึงข้อมูล

### 👤 Users Collection
```
/users/{userId}
```
- **Admin**: อ่าน/เขียนทั้งหมด
- **Manager**: อ่านทั้งหมด, แก้ไขผู้ใช้ที่ไม่ใช่ admin
- **User**: อ่าน/แก้ไขข้อมูลตัวเอง (ยกเว้น role)

### 🚛 Vehicles Collection
```
/vehicles/{vehicleId}
```
- **Admin/Manager**: อ่าน/เขียนทั้งหมด
- **Driver**: อ่านยานพาหนะที่ได้รับมอบหมาย, อัพเดทสถานะ

### 📦 Transports Collection
```
/transports/{transportId}
```
- **Admin/Manager**: อ่าน/เขียนทั้งหมด
- **Driver**: อ่าน/อัพเดทการขนส่งที่ได้รับมอบหมาย

### 🔔 Notifications Collection
```
/notifications/{notificationId}
```
- **Admin**: อ่านทั้งหมด
- **Admin/Manager**: สร้างการแจ้งเตือน
- **User**: อ่าน/อัพเดท/ลบการแจ้งเตือนตัวเอง

### 🏭 Warehouses Collection
```
/warehouses/{warehouseId}
```
- **Admin/Manager**: อ่าน/เขียนทั้งหมด
- **Driver**: อ่านอย่างเดียว

### ⚙️ Settings Collection
```
/settings/{settingId}
```
- **Admin**: อ่าน/เขียนทั้งหมด
- **Manager**: อ่านอย่างเดียว

### 📈 Reports Collection
```
/reports/{reportId}
```
- **Admin/Manager**: อ่าน/เขียนทั้งหมด
- **Driver**: สร้างรายงาน, อ่านรายงานตัวเอง

### 📋 Audit Logs Collection
```
/audit_logs/{logId}
```
- **Admin**: อ่านอย่างเดียว
- การสร้างจะทำผ่าน server-side เท่านั้น

## 🛡️ ฟังก์ชันความปลอดภัย

### การตรวจสอบสิทธิ์
```javascript
function isAuthenticated() // ตรวจสอบการเข้าสู่ระบบ
function getUserRole()     // ดึงบทบาทผู้ใช้
function isAdmin()        // ตรวจสอบสิทธิ์ admin
function isManager()      // ตรวจสอบสิทธิ์ manager
function isDriver()       // ตรวจสอบสิทธิ์ driver
```

### การตรวจสอบข้อมูล
```javascript
function isValidTransportData() // ตรวจสอบข้อมูลการขนส่ง
function isValidVehicleData()   // ตรวจสอบข้อมูลยานพาหนะ
function isValidUserData()      // ตรวจสอบข้อมูลผู้ใช้
```

## 🚀 การติดตั้ง Security Rules

### 1. ผ่าน Firebase Console
1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจค `wh1-transport`
3. ไปที่ **Firestore Database** > **Rules**
4. คัดลอกเนื้อหาจากไฟล์ `firestore.rules`
5. วางในช่อง Rules Editor
6. คลิก **Publish**

### 2. ผ่าน Firebase CLI
```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# เข้าสู่ระบบ
firebase login

# เริ่มต้นโปรเจค
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## ⚠️ ข้อควรระวัง

1. **การทดสอบ**: ทดสอบ rules ใน Firebase Console ก่อน deploy
2. **Backup**: สำรองข้อมูล rules เดิมก่อนอัพเดท
3. **Monitoring**: ตรวจสอบ logs เพื่อดู security violations
4. **Updates**: อัพเดท rules เมื่อมีการเปลี่ยนแปลงโครงสร้างข้อมูล

## 🔍 การทดสอบ Rules

### ใน Firebase Console
1. ไปที่ **Firestore Database** > **Rules**
2. คลิก **Rules Playground**
3. ทดสอบ scenarios ต่างๆ:
   - Admin อ่านข้อมูล users
   - Driver อัพเดทสถานะ transport
   - Manager สร้าง vehicle ใหม่

### ตัวอย่างการทดสอบ
```javascript
// ทดสอบ Admin อ่านข้อมูล users
Authentication: Authenticated as admin_user_id
Operation: get
Path: /databases/(default)/documents/users/some_user_id
Result: Allow ✅

// ทดสอบ Driver อ่านข้อมูล transport ที่ไม่ได้รับมอบหมาย
Authentication: Authenticated as driver_user_id
Operation: get
Path: /databases/(default)/documents/transports/other_transport_id
Result: Deny ❌
```

## 📞 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย
1. **Permission Denied**: ตรวจสอบ user role และ authentication
2. **Invalid Data**: ตรวจสอบ validation functions
3. **Rules Syntax Error**: ตรวจสอบ syntax ใน Firebase Console

### Debug Tips
```javascript
// เพิ่ม debug ใน rules
allow read: if isAuthenticated() && debug(getUserRole()) == 'admin';
```

## 🔄 การอัพเดท Rules

เมื่อต้องการแก้ไข rules:
1. แก้ไขไฟล์ `firestore.rules`
2. ทดสอบใน Firebase Console
3. Deploy ผ่าน CLI หรือ Console
4. ตรวจสอบการทำงานของแอปพลิเคชัน

---

**หมายเหตุ**: Security Rules เป็นส่วนสำคัญของความปลอดภัยข้อมูล กรุณาทดสอบอย่างละเอียดก่อนใช้งานจริง