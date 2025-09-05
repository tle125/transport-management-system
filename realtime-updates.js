// Real-time Updates สำหรับระบบขนส่ง
import { FirebaseUtils } from './firebase-config.js';
import firebaseAPI from './firebase-api.js';

class RealtimeUpdates {
    constructor() {
        this.listeners = new Map();
        this.isInitialized = false;
        this.callbacks = {
            transports: new Set(),
            vehicles: new Set(),
            users: new Set()
        };
    }

    // เริ่มต้น real-time listeners (ปิดการใช้งานเพื่อแก้ปัญหา connection errors)
    async initialize() {
        console.log('⚠️ Real-time updates ถูกปิดการใช้งานเพื่อแก้ปัญหา Firestore connection errors');
        console.log('💡 ใช้การรีเฟรชหน้าเพื่อดูข้อมูลล่าสุด');
        this.isInitialized = false;
        return false;
    }

    // ตั้งค่า listener สำหรับ transports (ปิดการใช้งาน)
    async setupTransportListener() {
        console.log('⚠️ Transport listener ถูกปิดการใช้งาน');
        // Real-time listeners ถูกปิดเพื่อแก้ปัญหา Firestore connection errors
    }

    // ตั้งค่า listener สำหรับ vehicles (ปิดการใช้งาน)
    async setupVehicleListener() {
        console.log('⚠️ Vehicle listener ถูกปิดการใช้งาน');
        // Real-time listeners ถูกปิดเพื่อแก้ปัญหา Firestore connection errors
    }

    // ตั้งค่า listener สำหรับ users (ปิดการใช้งาน)
    async setupUserListener() {
        console.log('⚠️ User listener ถูกปิดการใช้งาน');
        // Real-time listeners ถูกปิดเพื่อแก้ปัญหา Firestore connection errors
    }

    // แจ้งเตือน callbacks ที่ลงทะเบียนไว้
    notifyCallbacks(type, data) {
        if (this.callbacks[type]) {
            this.callbacks[type].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${type} callback:`, error);
                }
            });
        }
    }

    // อัพเดท UI สำหรับ transports
    updateTransportUI(transports) {
        // อัพเดทตารางการขนส่ง
        const transportTable = document.getElementById('transportTable');
        if (transportTable) {
            this.refreshTransportTable(transports);
        }

        // อัพเดทสถิติ
        this.updateTransportStatistics(transports);

        // อัพเดท dashboard cards
        this.updateDashboardCards(transports);
    }

    // อัพเดท UI สำหรับ vehicles
    updateVehicleUI(vehicles) {
        // อัพเดทตารางยานพาหนะ
        const vehicleTable = document.getElementById('vehicleTable');
        if (vehicleTable) {
            this.refreshVehicleTable(vehicles);
        }

        // อัพเดทสถิติยานพาหนะ
        this.updateVehicleStatistics(vehicles);
    }

    // อัพเดท UI สำหรับ users
    updateUserUI(users) {
        // อัพเดทตารางผู้ใช้
        const userTable = document.getElementById('userTable');
        if (userTable) {
            this.refreshUserTable(users);
        }
    }

    // รีเฟรชตารางการขนส่ง
    refreshTransportTable(transports) {
        const tbody = document.querySelector('#transportTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        transports.forEach(transport => {
            const row = this.createTransportRow(transport);
            tbody.appendChild(row);
        });
    }

    // สร้างแถวในตารางการขนส่ง
    createTransportRow(transport) {
        const row = document.createElement('tr');
        const statusClass = this.getStatusClass(transport.status);
        
        row.innerHTML = `
            <td>${transport.id}</td>
            <td>${transport.origin}</td>
            <td>${transport.destination}</td>
            <td>${transport.driverName || '-'}</td>
            <td>${transport.vehiclePlate || '-'}</td>
            <td><span class="status-badge ${statusClass}">${this.getStatusText(transport.status)}</span></td>
            <td>${this.formatDate(transport.departureDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewTransport('${transport.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editTransport('${transport.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    // รีเฟรชตารางยานพาหนะ
    refreshVehicleTable(vehicles) {
        const tbody = document.querySelector('#vehicleTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = this.createVehicleRow(vehicle);
            tbody.appendChild(row);
        });
    }

    // สร้างแถวในตารางยานพาหนะ
    createVehicleRow(vehicle) {
        const row = document.createElement('tr');
        const statusClass = this.getVehicleStatusClass(vehicle.status);
        
        row.innerHTML = `
            <td>${vehicle.plate}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.capacity} ตัน</td>
            <td>${vehicle.driverName || '-'}</td>
            <td><span class="status-badge ${statusClass}">${this.getVehicleStatusText(vehicle.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewVehicle('${vehicle.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editVehicle('${vehicle.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    // อัพเดทสถิติการขนส่ง
    updateTransportStatistics(transports) {
        const stats = {
            total: transports.length,
            pending: transports.filter(t => t.status === 'pending').length,
            inTransit: transports.filter(t => t.status === 'in_transit').length,
            completed: transports.filter(t => t.status === 'completed').length,
            cancelled: transports.filter(t => t.status === 'cancelled').length
        };

        // อัพเดท DOM elements
        this.updateStatElement('totalTransports', stats.total);
        this.updateStatElement('pendingTransports', stats.pending);
        this.updateStatElement('inTransitTransports', stats.inTransit);
        this.updateStatElement('completedTransports', stats.completed);
        this.updateStatElement('cancelledTransports', stats.cancelled);
    }

    // อัพเดทสถิติยานพาหนะ
    updateVehicleStatistics(vehicles) {
        const stats = {
            total: vehicles.length,
            available: vehicles.filter(v => v.status === 'available').length,
            inUse: vehicles.filter(v => v.status === 'in_use').length,
            maintenance: vehicles.filter(v => v.status === 'maintenance').length
        };

        // อัพเดท DOM elements
        this.updateStatElement('totalVehicles', stats.total);
        this.updateStatElement('availableVehicles', stats.available);
        this.updateStatElement('inUseVehicles', stats.inUse);
        this.updateStatElement('maintenanceVehicles', stats.maintenance);
    }

    // อัพเดท dashboard cards
    updateDashboardCards(transports) {
        const recentTransports = transports
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const recentList = document.getElementById('recentTransportsList');
        if (recentList) {
            recentList.innerHTML = '';
            recentTransports.forEach(transport => {
                const item = document.createElement('div');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${transport.id}</h6>
                            <p class="mb-1">${transport.origin} → ${transport.destination}</p>
                            <small>${this.formatDate(transport.createdAt)}</small>
                        </div>
                        <span class="badge ${this.getStatusClass(transport.status)}">
                            ${this.getStatusText(transport.status)}
                        </span>
                    </div>
                `;
                recentList.appendChild(item);
            });
        }
    }

    // อัพเดท element สถิติ
    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }

    // ลงทะเบียน callback สำหรับการอัพเดท
    onTransportsUpdate(callback) {
        this.callbacks.transports.add(callback);
        return () => this.callbacks.transports.delete(callback);
    }

    onVehiclesUpdate(callback) {
        this.callbacks.vehicles.add(callback);
        return () => this.callbacks.vehicles.delete(callback);
    }

    onUsersUpdate(callback) {
        this.callbacks.users.add(callback);
        return () => this.callbacks.users.delete(callback);
    }

    // ยกเลิก listeners ทั้งหมด
    cleanup() {
        this.listeners.forEach((unsubscribe, key) => {
            try {
                unsubscribe();
                console.log(`✅ Unsubscribed from ${key} listener`);
            } catch (error) {
                console.error(`❌ Error unsubscribing from ${key}:`, error);
            }
        });
        
        this.listeners.clear();
        this.callbacks.transports.clear();
        this.callbacks.vehicles.clear();
        this.callbacks.users.clear();
        this.isInitialized = false;
    }

    // Utility methods
    getStatusClass(status) {
        const statusClasses = {
            'pending': 'bg-warning',
            'in_transit': 'bg-info',
            'completed': 'bg-success',
            'cancelled': 'bg-danger'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': 'รอดำเนินการ',
            'in_transit': 'กำลังขนส่ง',
            'completed': 'เสร็จสิ้น',
            'cancelled': 'ยกเลิก'
        };
        return statusTexts[status] || status;
    }

    getVehicleStatusClass(status) {
        const statusClasses = {
            'available': 'bg-success',
            'in_use': 'bg-info',
            'maintenance': 'bg-warning'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    getVehicleStatusText(status) {
        const statusTexts = {
            'available': 'พร้อมใช้งาน',
            'in_use': 'กำลังใช้งาน',
            'maintenance': 'ซ่อมบำรุง'
        };
        return statusTexts[status] || status;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// สร้าง instance
const realtimeUpdates = new RealtimeUpdates();

// Auto-initialize เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    // รอสักครู่เพื่อให้ Firebase config โหลดเสร็จ
    setTimeout(async () => {
        await realtimeUpdates.initialize();
    }, 1000);
});

// Cleanup เมื่อออกจากหน้า
window.addEventListener('beforeunload', () => {
    realtimeUpdates.cleanup();
});

// Export
export default realtimeUpdates;
export { RealtimeUpdates };