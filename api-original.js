// API สำหรับระบบขนส่ง
class TransportAPI {
    constructor() {
        this.dbFile = 'database.json';
        this.data = null;
        this.loadData();
    }

    // โหลดข้อมูลจากไฟล์ JSON
    async loadData() {
        try {
            const response = await fetch(this.dbFile);
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading database:', error);
            // ใช้ข้อมูลเริ่มต้นหากไม่สามารถโหลดได้
            this.data = this.getDefaultData();
            return this.data;
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

    // บันทึกข้อมูลลง localStorage (เนื่องจากไม่สามารถเขียนไฟล์ได้ในเบราว์เซอร์)
    saveData() {
        try {
            localStorage.setItem('transportDB', JSON.stringify(this.data));
            this.updateStatistics();
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // โหลดข้อมูลจาก localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('transportDB');
            if (stored) {
                this.data = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    // อัพเดทสถิติ
    updateStatistics() {
        if (!this.data) return;

        const stats = {
            totalTransports: this.data.transports.length,
            completedTransports: this.data.transports.filter(t => t.status === 'completed').length,
            inTransitTransports: this.data.transports.filter(t => t.status === 'in_transit').length,
            pendingTransports: this.data.transports.filter(t => t.status === 'pending').length,
            cancelledTransports: this.data.transports.filter(t => t.status === 'cancelled').length,
            totalVehicles: this.data.vehicles.length,
            availableVehicles: this.data.vehicles.filter(v => v.status === 'available').length,
            inUseVehicles: this.data.vehicles.filter(v => v.status === 'in_use').length,
            maintenanceVehicles: this.data.vehicles.filter(v => v.status === 'maintenance').length,
            totalWarehouses: this.data.warehouses.length,
            lastUpdated: new Date().toISOString()
        };

        this.data.statistics = stats;
    }

    // === API Methods for Vehicles ===
    getVehicles() {
        return this.data?.vehicles || [];
    }

    getVehicleById(id) {
        return this.data?.vehicles.find(v => v.id === id);
    }

    getAvailableVehicles() {
        return this.data?.vehicles.filter(v => v.status === 'available') || [];
    }

    addVehicle(vehicle) {
        if (!this.data) return false;
        vehicle.id = vehicle.id || `V-${Date.now()}`;
        this.data.vehicles.push(vehicle);
        this.saveData();
        return vehicle;
    }

    updateVehicle(id, updates) {
        if (!this.data) return false;
        const index = this.data.vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            this.data.vehicles[index] = { ...this.data.vehicles[index], ...updates };
            this.saveData();
            return this.data.vehicles[index];
        }
        return false;
    }

    deleteVehicle(id) {
        if (!this.data) return false;
        const index = this.data.vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            this.data.vehicles.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // === API Methods for Warehouses ===
    getWarehouses() {
        return this.data?.warehouses || [];
    }

    getWarehouseById(id) {
        return this.data?.warehouses.find(w => w.id === id);
    }

    addWarehouse(warehouse) {
        if (!this.data) return false;
        warehouse.id = warehouse.id || `WH-${Date.now()}`;
        this.data.warehouses.push(warehouse);
        this.saveData();
        return warehouse;
    }

    updateWarehouse(id, updates) {
        if (!this.data) return false;
        const index = this.data.warehouses.findIndex(w => w.id === id);
        if (index !== -1) {
            this.data.warehouses[index] = { ...this.data.warehouses[index], ...updates };
            this.saveData();
            return this.data.warehouses[index];
        }
        return false;
    }

    deleteWarehouse(id) {
        if (!this.data) return false;
        const index = this.data.warehouses.findIndex(w => w.id === id);
        if (index !== -1) {
            this.data.warehouses.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // === API Methods for Transports ===
    getTransports() {
        return this.data?.transports || [];
    }

    getTransportById(id) {
        return this.data?.transports.find(t => t.id === id);
    }

    getTransportsByStatus(status) {
        return this.data?.transports.filter(t => t.status === status) || [];
    }

    getRecentTransports(limit = 5) {
        return this.data?.transports
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit) || [];
    }

    addTransport(transport) {
        if (!this.data) return false;
        
        transport.id = transport.id || `T-${Date.now()}`;
        transport.createdAt = new Date().toISOString();
        transport.updatedAt = new Date().toISOString();
        transport.status = transport.status || 'pending';
        
        this.data.transports.push(transport);
        
        // อัพเดทสถานะรถ
        if (transport.vehicleId && transport.status === 'in_transit') {
            this.updateVehicle(transport.vehicleId, { status: 'in_use' });
        }
        
        this.saveData();
        return transport;
    }

    updateTransport(id, updates) {
        if (!this.data) return false;
        const index = this.data.transports.findIndex(t => t.id === id);
        if (index !== -1) {
            const oldTransport = this.data.transports[index];
            updates.updatedAt = new Date().toISOString();
            
            // หากสถานะเปลี่ยนเป็น completed
            if (updates.status === 'completed' && oldTransport.status !== 'completed') {
                updates.completedDate = new Date().toISOString().split('T')[0];
                updates.completedTime = new Date().toLocaleTimeString('th-TH', { hour12: false });
                
                // อัพเดทสถานะรถให้ว่าง
                if (oldTransport.vehicleId) {
                    this.updateVehicle(oldTransport.vehicleId, { status: 'available' });
                }
            }
            
            this.data.transports[index] = { ...oldTransport, ...updates };
            this.saveData();
            return this.data.transports[index];
        }
        return false;
    }

    deleteTransport(id) {
        if (!this.data) return false;
        const index = this.data.transports.findIndex(t => t.id === id);
        if (index !== -1) {
            const transport = this.data.transports[index];
            
            // อัพเดทสถานะรถให้ว่าง
            if (transport.vehicleId && transport.status === 'in_transit') {
                this.updateVehicle(transport.vehicleId, { status: 'available' });
            }
            
            this.data.transports.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // === API Methods for Users ===
    getUsers() {
        return this.data?.users || [];
    }

    getUserById(id) {
        return this.data?.users.find(u => u.id === id);
    }

    authenticateUser(usernameOrEmail, password) {
        const user = this.data?.users.find(u => 
            (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
            u.password === password
        );
        if (user) {
            // อัพเดทเวลาล็อกอินล่าสุด
            this.updateUser(user.id, { lastLogin: new Date().toISOString() });
            
            // Store user session
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }));
            
            // Redirect based on role
            if (user.role === 'driver') {
                window.location.href = 'driver-dashboard.html';
            } else if (user.role === 'admin') {
                window.location.href = 'admin-panel.html';
            } else {
                window.location.href = 'index.html';
            }
            
            return { ...user, password: undefined }; // ไม่ส่งรหัสผ่านกลับ
        }
        return null;
    }

    addUser(user) {
        if (!this.data) return false;
        user.id = user.id || `U-${Date.now()}`;
        user.createdAt = new Date().toISOString();
        this.data.users.push(user);
        this.saveData();
        return { ...user, password: undefined };
    }

    updateUser(id, updates) {
        if (!this.data) return false;
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users[index] = { ...this.data.users[index], ...updates };
            this.saveData();
            return { ...this.data.users[index], password: undefined };
        }
        return false;
    }

    deleteUser(id) {
        if (!this.data) return false;
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // === API Methods for Notifications ===
    getNotifications(userId = null) {
        if (userId) {
            return this.data?.notifications.filter(n => n.userId === userId) || [];
        }
        return this.data?.notifications || [];
    }

    getUnreadNotifications(userId) {
        return this.data?.notifications.filter(n => n.userId === userId && !n.isRead) || [];
    }

    addNotification(notification) {
        if (!this.data) return false;
        notification.id = notification.id || `N-${Date.now()}`;
        notification.createdAt = new Date().toISOString();
        notification.isRead = false;
        this.data.notifications.push(notification);
        this.saveData();
        return notification;
    }

    markNotificationAsRead(id) {
        if (!this.data) return false;
        const index = this.data.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.data.notifications[index].isRead = true;
            this.saveData();
            return true;
        }
        return false;
    }

    deleteNotification(id) {
        if (!this.data) return false;
        const index = this.data.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.data.notifications.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // === API Methods for Statistics ===
    getStatistics() {
        this.updateStatistics();
        return this.data?.statistics || {};
    }

    // === API Methods for Settings ===
    getSettings() {
        return this.data?.settings || {};
    }

    updateSettings(updates) {
        if (!this.data) return false;
        this.data.settings = { ...this.data.settings, ...updates };
        this.saveData();
        return this.data.settings;
    }

    // === Search and Filter Methods ===
    searchTransports(query) {
        if (!this.data || !query) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.data.transports.filter(transport => {
            const vehicle = this.getVehicleById(transport.vehicleId);
            const origin = this.getWarehouseById(transport.originId);
            const destination = this.getWarehouseById(transport.destinationId);
            
            return (
                transport.id.toLowerCase().includes(lowerQuery) ||
                transport.driver?.toLowerCase().includes(lowerQuery) ||
                transport.cargo?.description?.toLowerCase().includes(lowerQuery) ||
                vehicle?.id.toLowerCase().includes(lowerQuery) ||
                origin?.name.toLowerCase().includes(lowerQuery) ||
                destination?.name.toLowerCase().includes(lowerQuery)
            );
        });
    }

    filterTransports(filters) {
        if (!this.data) return [];
        
        let filtered = [...this.data.transports];
        
        if (filters.status) {
            filtered = filtered.filter(t => t.status === filters.status);
        }
        
        if (filters.vehicleId) {
            filtered = filtered.filter(t => t.vehicleId === filters.vehicleId);
        }
        
        if (filters.originId) {
            filtered = filtered.filter(t => t.originId === filters.originId);
        }
        
        if (filters.destinationId) {
            filtered = filtered.filter(t => t.destinationId === filters.destinationId);
        }
        
        if (filters.dateFrom) {
            filtered = filtered.filter(t => t.date >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            filtered = filtered.filter(t => t.date <= filters.dateTo);
        }
        
        return filtered;
    }

    // === Utility Methods ===
    generateTransportId() {
        return `T-${Date.now()}`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('th-TH');
    }

    formatTime(time) {
        return new Date(time).toLocaleTimeString('th-TH', { hour12: false });
    }

    // === Export/Import Methods ===
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = imported;
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// สร้าง instance ของ API
const transportAPI = new TransportAPI();

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user has permission
function hasPermission(requiredRole) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = {
        'admin': 4,
        'manager': 3,
        'operator': 2,
        'driver': 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// Get driver's assigned vehicle
function getDriverAssignedVehicle(driverId) {
    const assignments = transportAPI.data.assignments || [];
    const activeAssignment = assignments.find(a => a.driverId === driverId && a.status === 'active');
    
    if (activeAssignment) {
        return transportAPI.data.vehicles.find(v => v.id === activeAssignment.vehicleId);
    }
    
    return null;
}

// Get driver's transports (only their own)
function getDriverTransports(driverId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'driver' || user.id !== driverId) {
        return [];
    }
    
    const assignedVehicle = getDriverAssignedVehicle(driverId);
    if (!assignedVehicle) {
        return [];
    }
    
    return transportAPI.data.transports.filter(t => t.vehicleId === assignedVehicle.id);
}

// Check page access permission
function checkPageAccess() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // Public pages
    const publicPages = ['login.html', 'index.html'];
    if (publicPages.includes(currentPage)) {
        return true;
    }
    
    // If no user logged in, redirect to login
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Admin-only pages
    const adminPages = ['admin-panel.html'];
    if (adminPages.includes(currentPage) && user.role !== 'admin') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'index.html';
        return false;
    }
    
    // Driver-only pages
    const driverPages = ['driver-dashboard.html'];
    if (driverPages.includes(currentPage) && user.role !== 'driver') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransportAPI;
}