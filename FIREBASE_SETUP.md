# การตั้งค่า Firebase สำหรับระบบขนส่ง

## ขั้นตอนการเตรียม Firebase

### 1. สร้าง Firebase Project
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Create a project" หรือ "เพิ่มโปรเจ็กต์"
3. ตั้งชื่อโปรเจ็กต์ (เช่น "transport-system")
4. เลือกการตั้งค่า Analytics (แนะนำให้เปิดใช้งาน)
5. คลิก "Create project"

### 2. เปิดใช้งาน Firestore Database
1. ในหน้า Firebase Console ไปที่ "Firestore Database"
2. คลิก "Create database"
3. เลือก "Start in test mode" (สำหรับการพัฒนา)
4. เลือก location ที่ใกล้ที่สุด (แนะนำ asia-southeast1)
5. คลิก "Done"

### 3. เปิดใช้งาน Authentication (ถ้าต้องการ)
1. ไปที่ "Authentication"
2. คลิก "Get started"
3. ในแท็บ "Sign-in method" เปิดใช้งาน "Email/Password"

### 4. เพิ่ม Web App
1. ในหน้าหลักของโปรเจ็กต์ คลิกไอคอน "</>"
2. ตั้งชื่อแอป (เช่น "transport-web")
3. เลือก "Also set up Firebase Hosting" (ถ้าต้องการ)
4. คลิก "Register app"
5. **คัดลอก Firebase Config** ที่แสดงขึ้นมา

## การตั้งค่าในโค้ด

### 1. อัพเดท firebase-config.js
แทนที่ค่าใน `firebase-config.js` ด้วย config ที่ได้จาก Firebase Console:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2. ติดตั้ง Firebase SDK
เพิ่ม Firebase SDK ในไฟล์ HTML ของคุณ:

```html
<!-- Firebase v9 SDK -->
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
  import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
  // เพิ่ม imports อื่นๆ ตามต้องการ
</script>
```

### 3. ย้ายข้อมูลจาก database.json
หลังจากตั้งค่า Firebase เรียบร้อยแล้ว:

1. เปิดเว็บไซต์ด้วย URL: `http://localhost:8000/login.html?migrate=true`
2. หรือเรียกใช้ใน Developer Console:
   ```javascript
   import { runMigration } from './migration.js';
   runMigration();
   ```

## โครงสร้างข้อมูลใน Firestore

### Collections ที่จะถูกสร้าง:

#### 1. users
```javascript
{
  username: "admin",
  email: "admin@transport.com",
  password: "admin123", // ในการใช้งานจริงควร hash
  role: "admin",
  name: "ผู้ดูแลระบบ",
  phone: "",
  status: "active",
  assignedVehicle: null,
  permissions: ["view_all_transports", "manage_users", ...],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. vehicles
```javascript
{
  plateNumber: "TT-01",
  type: "รถบรรทุก",
  brand: "Isuzu",
  model: "FRR",
  capacity: 5000,
  status: "available",
  assignedDriver: "นายสมชาย ใจดี",
  lastMaintenance: "2024-01-15",
  nextMaintenance: "2024-04-15",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. transports
```javascript
{
  transportId: "T001",
  driverId: "driver123",
  driverName: "นายสมชาย ใจดี",
  vehicleId: "TT-01",
  vehiclePlate: "TT-01",
  origin: "กรุงเทพฯ",
  destination: "เชียงใหม่",
  cargo: "เหล็กแผ่น",
  weight: 3000,
  status: "completed",
  startTime: "2024-01-15T08:00:00Z",
  endTime: "2024-01-16T18:00:00Z",
  distance: 700,
  cost: 15000,
  notes: "",
  route: [],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## การใช้งาน Real-time Features

หลังจากตั้งค่าเรียบร้อย ระบบจะมีความสามารถ:

1. **Real-time Updates**: ข้อมูลการขนส่งจะอัพเดทแบบ real-time
2. **Offline Support**: ทำงานได้แม้ไม่มีอินเทอร์เน็ต
3. **Scalability**: รองรับผู้ใช้งานจำนวนมาก
4. **Security**: ระบบรักษาความปลอดภัยระดับ enterprise

## การตั้งค่า Security Rules (แนะนำ)

ในหน้า Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transports - drivers can only see their own
    match /transports/{transportId} {
      allow read, write: if request.auth != null;
      // Add more specific rules based on user roles
    }
    
    // Vehicles - read only for drivers, full access for admins
    match /vehicles/{vehicleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Add admin role check
    }
  }
}
```

## หมายเหตุ

- ในการใช้งานจริง ควรใช้ Firebase Authentication แทนการเก็บรหัสผ่านใน Firestore
- ควรตั้งค่า Security Rules ให้เหมาะสมกับระบบ
- สำหรับการใช้งานจริง ควรเปลี่ยนจาก "test mode" เป็น "production mode"
- ควรสำรองข้อมูลเป็นประจำ

## การแก้ไขปัญหาที่พบบ่อย

1. **CORS Error**: ตรวจสอบว่าเรียกใช้ผ่าน HTTP Server ไม่ใช่ file://
2. **Permission Denied**: ตรวจสอบ Security Rules ใน Firestore
3. **Module Import Error**: ตรวจสอบ Firebase SDK version และ import paths
4. **Network Error**: ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและ Firebase project settings