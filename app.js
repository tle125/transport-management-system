// Transport Management System - Main JavaScript File

// Local Storage Keys
const STORAGE_KEYS = {
    TRANSPORTS: 'transports',
    USER_SESSION: 'userSession'
};

// Initialize the application
function initApp() {
    // Check if user is logged in
    if (!isLoggedIn() && !window.location.pathname.includes('transfer.html')) {
        window.location.href = 'transfer.html';
        return;
    }
    
    // Initialize sample data if no data exists
    if (getTransports().length === 0) {
        initializeSampleData();
    }
}

// Authentication Functions
function login(username, password) {
    // Simple authentication (in real app, this would be server-side)
    if (username && password) {
        const userSession = {
            username: username,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userSession));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    window.location.href = 'transfer.html';
}

function isLoggedIn() {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!session) return false;
    
    try {
        const userSession = JSON.parse(session);
        return userSession.isLoggedIn === true;
    } catch (e) {
        return false;
    }
}

function getCurrentUser() {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!session) return null;
    
    try {
        return JSON.parse(session);
    } catch (e) {
        return null;
    }
}

// Transport Data Management Functions
function getTransports() {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSPORTS);
    if (!data) return [];
    
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Error parsing transport data:', e);
        return [];
    }
}

function saveTransport(transport) {
    const transports = getTransports();
    
    // Add timestamp if not exists
    if (!transport.createdAt) {
        transport.createdAt = new Date().toISOString();
    }
    
    // Add updated timestamp
    transport.updatedAt = new Date().toISOString();
    
    transports.push(transport);
    localStorage.setItem(STORAGE_KEYS.TRANSPORTS, JSON.stringify(transports));
    
    return transport;
}

function updateTransport(id, updatedTransport) {
    const transports = getTransports();
    const index = transports.findIndex(t => t.id === id);
    
    if (index === -1) {
        throw new Error('Transport not found');
    }
    
    // Preserve original creation time and add update time
    updatedTransport.createdAt = transports[index].createdAt;
    updatedTransport.updatedAt = new Date().toISOString();
    
    transports[index] = updatedTransport;
    localStorage.setItem(STORAGE_KEYS.TRANSPORTS, JSON.stringify(transports));
    
    return updatedTransport;
}

function removeTransport(id) {
    const transports = getTransports();
    const filteredTransports = transports.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSPORTS, JSON.stringify(filteredTransports));
    
    return true;
}

function getTransportById(id) {
    const transports = getTransports();
    return transports.find(t => t.id === id) || null;
}

// Search and Filter Functions
function searchTransports(query) {
    const transports = getTransports();
    const searchTerm = query.toLowerCase();
    
    return transports.filter(transport => 
        transport.customerName.toLowerCase().includes(searchTerm) ||
        transport.origin.toLowerCase().includes(searchTerm) ||
        transport.destination.toLowerCase().includes(searchTerm) ||
        transport.status.toLowerCase().includes(searchTerm) ||
        (transport.itemDescription && transport.itemDescription.toLowerCase().includes(searchTerm)) ||
        (transport.notes && transport.notes.toLowerCase().includes(searchTerm))
    );
}

function filterTransportsByStatus(status) {
    const transports = getTransports();
    if (!status) return transports;
    
    return transports.filter(transport => transport.status === status);
}

function filterTransportsByDate(date) {
    const transports = getTransports();
    if (!date) return transports;
    
    return transports.filter(transport => transport.date === date);
}

function filterTransportsByDateRange(startDate, endDate) {
    const transports = getTransports();
    if (!startDate && !endDate) return transports;
    
    return transports.filter(transport => {
        const transportDate = new Date(transport.date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');
        
        return transportDate >= start && transportDate <= end;
    });
}

// Statistics Functions
function getTransportStats() {
    const transports = getTransports();
    const today = new Date().toDateString();
    
    const stats = {
        total: transports.length,
        today: transports.filter(t => new Date(t.date).toDateString() === today).length,
        pending: transports.filter(t => t.status === 'รอดำเนินการ').length,
        inTransit: transports.filter(t => t.status === 'กำลังขนส่ง').length,
        completed: transports.filter(t => t.status === 'เสร็จสิ้น').length,
        cancelled: transports.filter(t => t.status === 'ยกเลิก').length,
        totalRevenue: transports
            .filter(t => t.status === 'เสร็จสิ้น')
            .reduce((sum, t) => sum + parseFloat(t.cost || 0), 0),
        averageCost: 0
    };
    
    if (stats.total > 0) {
        stats.averageCost = transports.reduce((sum, t) => sum + parseFloat(t.cost || 0), 0) / stats.total;
    }
    
    return stats;
}

function getMonthlyStats(year, month) {
    const transports = getTransports();
    const monthTransports = transports.filter(transport => {
        const transportDate = new Date(transport.date);
        return transportDate.getFullYear() === year && transportDate.getMonth() === month;
    });
    
    return {
        total: monthTransports.length,
        completed: monthTransports.filter(t => t.status === 'เสร็จสิ้น').length,
        revenue: monthTransports
            .filter(t => t.status === 'เสร็จสิ้น')
            .reduce((sum, t) => sum + parseFloat(t.cost || 0), 0)
    };
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';
    
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateTimeString;
    }
}

function formatCurrency(amount) {
    if (isNaN(amount)) return '฿0';
    
    return '฿' + parseFloat(amount).toLocaleString('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Data Validation Functions
function validateTransportData(transport) {
    const errors = [];
    
    if (!transport.customerName || transport.customerName.trim() === '') {
        errors.push('ชื่อลูกค้าเป็นข้อมูลที่จำเป็น');
    }
    
    if (!transport.origin || transport.origin.trim() === '') {
        errors.push('จุดต้นทางเป็นข้อมูลที่จำเป็น');
    }
    
    if (!transport.destination || transport.destination.trim() === '') {
        errors.push('จุดหมายเป็นข้อมูลที่จำเป็น');
    }
    
    if (!transport.date) {
        errors.push('วันที่ขนส่งเป็นข้อมูลที่จำเป็น');
    }
    
    if (!transport.cost || isNaN(transport.cost) || parseFloat(transport.cost) < 0) {
        errors.push('ค่าขนส่งต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0');
    }
    
    if (!transport.status) {
        errors.push('สถานะเป็นข้อมูลที่จำเป็น');
    }
    
    const validStatuses = ['รอดำเนินการ', 'กำลังขนส่ง', 'เสร็จสิ้น', 'ยกเลิก'];
    if (transport.status && !validStatuses.includes(transport.status)) {
        errors.push('สถานะไม่ถูกต้อง');
    }
    
    return errors;
}

// Export/Import Functions
function exportTransportsToJSON() {
    const transports = getTransports();
    const dataStr = JSON.stringify(transports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `transport-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importTransportsFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (!Array.isArray(importedData)) {
                    reject(new Error('ไฟล์ข้อมูลไม่ถูกต้อง'));
                    return;
                }
                
                // Validate imported data
                const validTransports = [];
                const errors = [];
                
                importedData.forEach((transport, index) => {
                    const validationErrors = validateTransportData(transport);
                    if (validationErrors.length === 0) {
                        // Generate new ID to avoid conflicts
                        transport.id = generateId();
                        transport.importedAt = new Date().toISOString();
                        validTransports.push(transport);
                    } else {
                        errors.push(`แถวที่ ${index + 1}: ${validationErrors.join(', ')}`);
                    }
                });
                
                if (validTransports.length > 0) {
                    const existingTransports = getTransports();
                    const allTransports = [...existingTransports, ...validTransports];
                    localStorage.setItem(STORAGE_KEYS.TRANSPORTS, JSON.stringify(allTransports));
                }
                
                resolve({
                    imported: validTransports.length,
                    errors: errors
                });
                
            } catch (error) {
                reject(new Error('ไม่สามารถอ่านไฟล์ได้: ' + error.message));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
        };
        
        reader.readAsText(file);
    });
}

// Initialize sample data for demonstration
function initializeSampleData() {
    const sampleTransports = [
        {
            id: generateId(),
            customerName: 'บริษัท ABC จำกัด',
            customerPhone: '02-123-4567',
            origin: 'กรุงเทพมหานคร',
            destination: 'เชียงใหม่',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            itemDescription: 'อุปกรณ์อิเล็กทรอนิกส์',
            cost: 15000,
            status: 'กำลังขนส่ง',
            notes: 'ระวังของแตก',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            customerName: 'ร้านค้าปลีก XYZ',
            customerPhone: '081-234-5678',
            origin: 'นครราชสีมา',
            destination: 'อุบลราชธานี',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
            time: '14:30',
            itemDescription: 'สินค้าอุปโภคบริโภค',
            cost: 8500,
            status: 'เสร็จสิ้น',
            notes: '',
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: generateId(),
            customerName: 'โรงงาน DEF',
            customerPhone: '038-345-6789',
            origin: 'ระยอง',
            destination: 'สมุทรปราการ',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: '08:00',
            itemDescription: 'วัตถุดิบอุตสาหกรรม',
            cost: 25000,
            status: 'รอดำเนินการ',
            notes: 'ต้องมีใบอนุญาตพิเศษ',
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem(STORAGE_KEYS.TRANSPORTS, JSON.stringify(sampleTransports));
}

// Clear all data (for development/testing)
function clearAllData() {
    if (confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
        localStorage.removeItem(STORAGE_KEYS.TRANSPORTS);
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
        alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
        window.location.href = 'transfer.html';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Don't initialize on login page
    if (!window.location.pathname.includes('transfer.html')) {
        initApp();
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
});

// Export functions for global access
window.TransportApp = {
    // Authentication
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    
    // Data Management
    getTransports,
    saveTransport,
    updateTransport,
    removeTransport,
    getTransportById,
    
    // Search & Filter
    searchTransports,
    filterTransportsByStatus,
    filterTransportsByDate,
    filterTransportsByDateRange,
    
    // Statistics
    getTransportStats,
    getMonthlyStats,
    
    // Utilities
    formatDate,
    formatDateTime,
    formatCurrency,
    generateId,
    validateTransportData,
    
    // Import/Export
    exportTransportsToJSON,
    importTransportsFromJSON,
    
    // Development
    clearAllData,
    initializeSampleData
};