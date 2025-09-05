# ระบบจัดการขนส่ง (Transport Management System)

ระบบจัดการขนส่งสำหรับ Material Handling WH1 ที่พัฒนาด้วย HTML, CSS, JavaScript และ Firebase

## คุณสมบัติหลัก

- 🚛 **จัดการรถขนส่ง** - เพิ่ม แก้ไข และติดตามสถานะรถขนส่ง
- 📋 **จัดการการขนส่ง** - สร้างและติดตามงานขนส่ง
- 👥 **จัดการผู้ใช้** - ระบบผู้ดูแล ผู้จัดการ และคนขับรถ
- 📊 **แดชบอร์ด** - สถิติและข้อมูลการขนส่งแบบเรียลไทม์
- 🔐 **ระบบความปลอดภัย** - การเข้าสู่ระบบและการจัดการสิทธิ์

## เทคโนโลยีที่ใช้

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Tailwind CSS
- **Backend**: Firebase (Firestore Database, Authentication)
- **Icons**: Material Symbols
- **Fonts**: Noto Sans Thai, Spline Sans

## โครงสร้างโปรเจกต์

```
├── index.html              # หน้าแรก
├── login.html              # หน้าเข้าสู่ระบบ
├── dashboard.html          # แดชบอร์ดหลัก
├── admin-panel.html        # แผงควบคุมผู้ดูแล
├── driver-dashboard.html   # แดชบอร์ดคนขับ
├── new-transport.html      # สร้างงานขนส่งใหม่
├── transport-history.html  # ประวัติการขนส่ง
├── firebase-api.js         # API สำหรับ Firebase
├── firebase-config.js      # การตั้งค่า Firebase
├── realtime-updates.js     # อัปเดตแบบเรียลไทม์
└── styles.css              # สไตล์เพิ่มเติม
```

## การติดตั้งและใช้งาน

### 1. Clone Repository
```bash
git clone https://github.com/[username]/transport-management-system.git
cd transport-management-system
```

### 2. ตั้งค่า Firebase
1. สร้างโปรเจกต์ใหม่ใน [Firebase Console](https://console.firebase.google.com/)
2. เปิดใช้งาน Firestore Database และ Authentication
3. อัปเดตการตั้งค่าใน `firebase-config.js`

### 3. เรียกใช้เซิร์ฟเวอร์ท้องถิ่น
```bash
# ใช้ Python
python -m http.server 8000

# หรือใช้ Node.js
npx serve .
```

### 4. เข้าถึงแอปพลิเคชัน
เปิดเบราว์เซอร์และไปที่ `http://localhost:8000`

## การใช้งาน

### สำหรับผู้ดูแลระบบ
- เข้าสู่ระบบด้วยบัญชีผู้ดูแล
- จัดการรถขนส่งและผู้ใช้
- ดูสถิติและรายงาน

### สำหรับผู้จัดการ
- สร้างและจัดการงานขนส่ง
- ติดตามสถานะการขนส่ง
- จัดสรรรถและคนขับ

### สำหรับคนขับรถ
- ดูงานที่ได้รับมอบหมาย
- อัปเดตสถานะการขนส่ง
- รายงานปัญหา

## ประเภทรถขนส่ง

- **Tailer** (TT-xx) - รถพ่วง
- **Forklift** (FL-xx) - รถยกของ
- **SC** (SC-xx) - รถขนส่งพิเศษ
- **EV** (EV-xx) - รถไฟฟ้า

## การพัฒนา

### โครงสร้างฐานข้อมูล
```javascript
// Collections ใน Firestore
- users/          // ข้อมูลผู้ใช้
- vehicles/       // ข้อมูลรถขนส่ง
- transports/     // ข้อมูลการขนส่ง
- drivers/        // ข้อมูลคนขับ
```

### การเพิ่มฟีเจอร์ใหม่
1. สร้างไฟล์ HTML สำหรับหน้าใหม่
2. เพิ่มฟังก์ชันใน `firebase-api.js`
3. อัปเดต navigation ในไฟล์ที่เกี่ยวข้อง
4. ทดสอบการทำงาน

## การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา

## ลิขสิทธิ์

© 2024 TMT Steel Public Company Limited. สงวนลิขสิทธิ์.

---

**หมายเหตุ**: โปรเจกต์นี้พัฒนาสำหรับใช้งานภายในองค์กร TMT Steel เท่านั้น