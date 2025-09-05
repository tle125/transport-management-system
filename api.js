// API สำหรับระบบขนส่ง (Firebase Version)
import { FirebaseUtils } from './firebase-config.js';
import firebaseAPI from './firebase-api.js';

class TransportAPI {
    constructor() {
        this.firebaseAPI = firebaseAPI;
        this.data = null;
        this.initializeData();
    }

    // เริ่มต้นข้อมูล
    async initializeData() {
        try {
            if (!FirebaseUtils.isConfigured()) {
                console.warn('Firebase ยังไม่ได้กำหนดค่า กำลังใช้ข้อมูลเริ่มต้น');
                this.data = this.getDefaultData();
                return;
            }
            
            // โหลดข้อมูลจาก Firestore
            await this.loadDataFromFirestore();
        } catch (error) {
            console.error('Error initializing data:', error);
            this.data = this.getDefaultData();
        }
    }

    // โหลดข้อมูลจาก Firestore
    async loadDataFromFirestore() {
        try {
            const [users, vehicles, transports] = await Promise.all([
                this.firebaseAPI.getUsers(),
                this.firebaseAPI.getVehicles(),
                this.firebaseAPI.getTransports()
            ]);

            this.data = {
                users: users || [],
                vehicles: vehicles || [],
                transports: transports || [],
                warehouses: [], // TODO: เพิ่มการจัดการ warehouses
                notifications: [],
                statistics: this.calculateStatistics(vehicles, transports),
                settings: {}
            };
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
            throw error;
        }
    }

    // ข้อมูลเริ่มต้น
    getDefaultData() {
        return {
            vehicles: [],
            warehouses: [],
            transports: [],
            users: [],
            notifications: [],
            statistics: {
                totalTransports: 0,
                completedTransports: 0,
                inTransitTransports: 0,
                pendingTransports: 0,
                cancelledTransports: 0,
                totalVehicles: 0,
                availableVehicles: 0,
                inUseVehicles: 0,
                maintenanceVehicles: 0,
                totalWarehouses: 0,
                lastUpdated: new Date().toISOString()
            },
            settings: {}
        };
    }

    // คำนวณสถิติ
    calculateStatistics(vehicles = [], transports = []) {
        const stats = {
            totalTransports: transports.length,
            completedTransports: transports.filter(t => t.status === 'completed').length,
            inTransitTransports: transports.filter(t => t.status === 'in_transit').length,
            pendingTransports: transports.filter(t => t.status === 'pending').length,
            cancelledTransports: transports.filter(t => t.status === 'cancelled').length,
            totalVehicles: vehicles.length,
            availableVehicles: vehicles.filter(v => v.status === 'available').length,
            inUseVehicles: vehicles.filter(v => v.status === 'in_use').length,
            maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
            totalWarehouses: 0,
            lastUpdated: new Date().toISOString()
        };
        return stats;
    }

    // === Vehicle Methods ===
    async getVehicles() {
        try {
            return await this.firebaseAPI.getVehicles();
        } catch (error) {
            console.error('Error getting vehicles:', error);
            return this.data?.vehicles || [];
        }
    }

    async getVehicleById(id) {
        try {
            return await this.firebaseAPI.getVehicleById(id);
        } catch (error) {
            console.error('Error getting vehicle by ID:', error);
            return this.data?.vehicles?.find(v => v.id === id) || null;
        }
    }

    async getAvailableVehicles() {
        try {
            const vehicles = await this.getVehicles();
            return vehicles.filter(v => v.status === 'available');
        } catch (error) {
            console.error('Error getting available vehicles:', error);
            return [];
        }
    }

    async addVehicle(vehicle) {
        try {
            const newVehicle = {
                ...vehicle,
                id: FirebaseUtils.generateId(),
                createdAt: FirebaseUtils.getTimestamp(),
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.addVehicle(newVehicle);
        } catch (error) {
            console.error('Error adding vehicle:', error);
            throw error;
        }
    }

    async updateVehicle(id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.updateVehicle(id, updateData);
        } catch (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }
    }

    async deleteVehicle(id) {
        try {
            return await this.firebaseAPI.deleteVehicle(id);
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            throw error;
        }
    }

    // === Transport Methods ===
    async getTransports() {
        try {
            return await this.firebaseAPI.getTransports();
        } catch (error) {
            console.error('Error getting transports:', error);
            return this.data?.transports || [];
        }
    }

    async getTransportById(id) {
        try {
            return await this.firebaseAPI.getTransportById(id);
        } catch (error) {
            console.error('Error getting transport by ID:', error);
            return this.data?.transports?.find(t => t.id === id) || null;
        }
    }

    async getTransportsByStatus(status) {
        try {
            const transports = await this.getTransports();
            return transports.filter(t => t.status === status);
        } catch (error) {
            console.error('Error getting transports by status:', error);
            return [];
        }
    }

    async getRecentTransports(limit = 5) {
        try {
            const transports = await this.getTransports();
            return transports
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting recent transports:', error);
            return [];
        }
    }

    async addTransport(transport) {
        try {
            const newTransport = {
                ...transport,
                id: this.generateTransportId(),
                status: transport.status || 'pending',
                createdAt: FirebaseUtils.getTimestamp(),
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.addTransport(newTransport);
        } catch (error) {
            console.error('Error adding transport:', error);
            throw error;
        }
    }

    async updateTransport(id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.updateTransport(id, updateData);
        } catch (error) {
            console.error('Error updating transport:', error);
            throw error;
        }
    }

    async deleteTransport(id) {
        try {
            return await this.firebaseAPI.deleteTransport(id);
        } catch (error) {
            console.error('Error deleting transport:', error);
            throw error;
        }
    }

    // === User Methods ===
    async getUsers() {
        try {
            return await this.firebaseAPI.getUsers();
        } catch (error) {
            console.error('Error getting users:', error);
            return this.data?.users || [];
        }
    }

    async getUserById(id) {
        try {
            return await this.firebaseAPI.getUserById(id);
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return this.data?.users?.find(u => u.id === id) || null;
        }
    }

    async authenticateUser(usernameOrEmail, password) {
        try {
            const users = await this.getUsers();
            const user = users.find(u => 
                (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
                u.password === password
            );
            
            if (user) {
                // บันทึกข้อมูลผู้ใช้ใน localStorage
                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                return userData;
            }
            return null;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    }

    async addUser(user) {
        try {
            const newUser = {
                ...user,
                id: FirebaseUtils.generateId(),
                createdAt: FirebaseUtils.getTimestamp(),
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.addUser(newUser);
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async updateUser(id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: FirebaseUtils.getTimestamp()
            };
            return await this.firebaseAPI.updateUser(id, updateData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.firebaseAPI.deleteUser(id);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // === Warehouse Methods (Placeholder) ===
    getWarehouses() {
        return this.data?.warehouses || [];
    }

    getWarehouseById(id) {
        return this.data?.warehouses?.find(w => w.id === id) || null;
    }

    // === Notification Methods (Placeholder) ===
    getNotifications(userId = null) {
        const notifications = this.data?.notifications || [];
        return userId ? notifications.filter(n => n.userId === userId) : notifications;
    }

    getUnreadNotifications(userId) {
        return this.getNotifications(userId).filter(n => !n.read);
    }

    // === Statistics Methods ===
    async getStatistics() {
        try {
            const [vehicles, transports] = await Promise.all([
                this.getVehicles(),
                this.getTransports()
            ]);
            return this.calculateStatistics(vehicles, transports);
        } catch (error) {
            console.error('Error getting statistics:', error);
            return this.data?.statistics || this.getDefaultData().statistics;
        }
    }

    // === Search and Filter Methods ===
    async searchTransports(query) {
        try {
            const transports = await this.getTransports();
            const searchTerm = query.toLowerCase();
            return transports.filter(transport => 
                transport.id?.toLowerCase().includes(searchTerm) ||
                transport.origin?.toLowerCase().includes(searchTerm) ||
                transport.destination?.toLowerCase().includes(searchTerm) ||
                transport.driverName?.toLowerCase().includes(searchTerm) ||
                transport.vehiclePlate?.toLowerCase().includes(searchTerm) ||
                transport.cargo?.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching transports:', error);
            return [];
        }
    }

    async filterTransports(filters) {
        try {
            let transports = await this.getTransports();
            
            if (filters.status && filters.status !== 'all') {
                transports = transports.filter(t => t.status === filters.status);
            }
            
            if (filters.dateFrom) {
                transports = transports.filter(t => new Date(t.departureDate) >= new Date(filters.dateFrom));
            }
            
            if (filters.dateTo) {
                transports = transports.filter(t => new Date(t.departureDate) <= new Date(filters.dateTo));
            }
            
            if (filters.driverId) {
                transports = transports.filter(t => t.driverId === filters.driverId);
            }
            
            if (filters.vehicleId) {
                transports = transports.filter(t => t.vehicleId === filters.vehicleId);
            }
            
            return transports;
        } catch (error) {
            console.error('Error filtering transports:', error);
            return [];
        }
    }

    // === Utility Methods ===
    generateTransportId() {
        return 'T' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('th-TH');
    }

    formatTime(time) {
        return new Date(time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    }

    // === Data Export/Import ===
    async exportData() {
        try {
            const [users, vehicles, transports] = await Promise.all([
                this.getUsers(),
                this.getVehicles(),
                this.getTransports()
            ]);
            
            return {
                users,
                vehicles,
                transports,
                warehouses: this.getWarehouses(),
                notifications: this.getNotifications(),
                statistics: await this.getStatistics(),
                exportDate: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }
}

// สร้าง instance
const transportAPI = new TransportAPI();

// === Global Functions ===
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function hasPermission(requiredRole) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const roleHierarchy = {
        'admin': 3,
        'manager': 2,
        'driver': 1
    };
    
    const userLevel = roleHierarchy[currentUser.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
}

async function getDriverAssignedVehicle(driverId) {
    try {
        const vehicles = await transportAPI.getVehicles();
        return vehicles.find(vehicle => 
            vehicle.assignedDriverId === driverId && 
            vehicle.status !== 'maintenance'
        ) || null;
    } catch (error) {
        console.error('Error getting driver assigned vehicle:', error);
        return null;
    }
}

async function getDriverTransports(driverId) {
    try {
        const transports = await transportAPI.getTransports();
        return transports.filter(transport => 
            transport.driverId === driverId
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error getting driver transports:', error);
        return [];
    }
}

function checkPageAccess() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    const currentPage = window.location.pathname.split('/').pop();
    const userRole = currentUser.role;
    
    // กำหนดสิทธิ์การเข้าถึงหน้าต่างๆ
    const pagePermissions = {
        'admin-dashboard.html': ['admin'],
        'manager-dashboard.html': ['admin', 'manager'],
        'driver-dashboard.html': ['admin', 'manager', 'driver'],
        'vehicles.html': ['admin', 'manager'],
        'transports.html': ['admin', 'manager'],
        'users.html': ['admin'],
        'settings.html': ['admin'],
        'reports.html': ['admin', 'manager']
    };
    
    const allowedRoles = pagePermissions[currentPage];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // เปลี่ยนเส้นทางไปยังหน้าที่เหมาะสมตาม role
        switch (userRole) {
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            case 'manager':
                window.location.href = 'manager-dashboard.html';
                break;
            case 'driver':
                window.location.href = 'driver-dashboard.html';
                break;
            default:
                window.location.href = 'login.html';
        }
        return false;
    }
    
    return true;
}

// Export สำหรับ Node.js (ถ้าจำเป็น)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransportAPI;
}

// Export สำหรับ ES6 modules
export { transportAPI, logout, getCurrentUser, hasPermission, getDriverAssignedVehicle, getDriverTransports, checkPageAccess };
export default transportAPI;