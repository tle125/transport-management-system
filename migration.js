// Data Migration Script
// สคริปต์สำหรับย้ายข้อมูลจาก database.json ไปยัง Firestore

import firebaseAPI from './firebase-api.js';
import { FirebaseUtils } from './firebase-config.js';

class DataMigration {
  constructor() {
    this.migrationLog = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    this.migrationLog.push(logEntry);
  }

  async migrateFromLocalData(localData) {
    try {
      this.log('Starting data migration to Firestore...');
      
      // Check if Firebase is configured
      if (!FirebaseUtils.isConfigured()) {
        throw new Error('Firebase is not properly configured. Please update firebase-config.js');
      }

      // Migrate Users
      if (localData.users && localData.users.length > 0) {
        await this.migrateUsers(localData.users);
      }

      // Migrate Vehicles
      if (localData.vehicles && localData.vehicles.length > 0) {
        await this.migrateVehicles(localData.vehicles);
      }

      // Migrate Transports
      if (localData.transports && localData.transports.length > 0) {
        await this.migrateTransports(localData.transports);
      }

      // Migrate Notifications
      if (localData.notifications && localData.notifications.length > 0) {
        await this.migrateNotifications(localData.notifications);
      }

      this.log('Data migration completed successfully!');
      return {
        success: true,
        log: this.migrationLog
      };

    } catch (error) {
      this.log(`Migration failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        log: this.migrationLog
      };
    }
  }

  async migrateUsers(users) {
    this.log(`Migrating ${users.length} users...`);
    
    for (const user of users) {
      try {
        // Transform user data for Firestore
        const userData = {
          username: user.username || user.email || 'Unknown',
          email: user.email || `${user.username || 'unknown'}@example.com`,
          password: user.password || 'defaultPassword123', // In production, this should be hashed
          role: user.role || 'driver',
          name: user.name || user.username || 'Unknown User',
          phone: user.phone || '',
          status: user.status || 'active',
          assignedVehicle: user.assignedVehicle || null,
          permissions: user.permissions || this.getDefaultPermissions(user.role || 'driver'),
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString()
        };

        await firebaseAPI.addUser(userData);
        this.log(`✓ Migrated user: ${user.username}`);
      } catch (error) {
        this.log(`✗ Failed to migrate user ${user.username}: ${error.message}`);
      }
    }
  }

  async migrateVehicles(vehicles) {
    this.log(`Migrating ${vehicles.length} vehicles...`);
    
    for (const vehicle of vehicles) {
      try {
        const vehicleData = {
          plateNumber: vehicle.licensePlate || vehicle.plateNumber || vehicle.id || 'Unknown',
          type: vehicle.type || 'Unknown',
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          capacity: vehicle.capacity || 0,
          status: vehicle.status || 'available',
          assignedDriver: vehicle.driver || vehicle.assignedDriver || null,
          lastMaintenance: vehicle.lastMaintenance || null,
          nextMaintenance: vehicle.nextMaintenance || null,
          year: vehicle.year || null
        };

        await firebaseAPI.addVehicle(vehicleData);
        this.log(`✓ Migrated vehicle: ${vehicle.plateNumber}`);
      } catch (error) {
        this.log(`✗ Failed to migrate vehicle ${vehicle.plateNumber}: ${error.message}`);
      }
    }
  }

  async migrateTransports(transports) {
    this.log(`Migrating ${transports.length} transports...`);
    
    for (const transport of transports) {
      try {
        const transportData = {
          transportId: transport.id || 'Unknown',
          driverId: transport.driverId || null,
          driverName: transport.driver || transport.driverName || 'Unknown',
          vehicleId: transport.vehicleId || 'Unknown',
          vehiclePlate: transport.vehiclePlate || transport.vehicleId || 'Unknown',
          origin: transport.originId || transport.origin || 'Unknown',
          destination: transport.destinationId || transport.destination || 'Unknown',
          cargo: transport.cargo || {},
          weight: (transport.cargo && transport.cargo.weight) ? transport.cargo.weight : (transport.weight || 0),
          status: transport.status || 'pending',
          startTime: transport.date && transport.time ? `${transport.date}T${transport.time}:00Z` : (transport.startTime || null),
          endTime: transport.completedDate && transport.completedTime ? `${transport.completedDate}T${transport.completedTime}:00Z` : (transport.endTime || null),
          distance: transport.distance || 0,
          cost: (transport.cargo && transport.cargo.value) ? transport.cargo.value : (transport.cost || 0),
          notes: transport.notes || '',
          route: transport.route || [],
          createdBy: transport.createdBy || 'system',
          createdAt: transport.createdAt || new Date().toISOString(),
          updatedAt: transport.updatedAt || new Date().toISOString()
        };

        await firebaseAPI.addTransport(transportData);
        this.log(`✓ Migrated transport: ${transport.id}`);
      } catch (error) {
        this.log(`✗ Failed to migrate transport ${transport.id}: ${error.message}`);
      }
    }
  }

  async migrateNotifications(notifications) {
    this.log(`Migrating ${notifications.length} notifications...`);
    
    for (const notification of notifications) {
      try {
        const notificationData = {
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
          read: notification.read || false,
          priority: notification.priority || 'normal',
          data: notification.data || {}
        };

        // Add notification to Firestore (you'll need to implement this in firebase-api.js)
        // await firebaseAPI.addNotification(notificationData);
        this.log(`✓ Migrated notification: ${notification.title}`);
      } catch (error) {
        this.log(`✗ Failed to migrate notification: ${error.message}`);
      }
    }
  }

  getDefaultPermissions(role) {
    const permissions = {
      admin: [
        'view_all_transports',
        'create_transport',
        'edit_transport',
        'delete_transport',
        'manage_users',
        'manage_vehicles',
        'view_reports'
      ],
      manager: [
        'view_all_transports',
        'create_transport',
        'edit_transport',
        'view_reports'
      ],
      driver: [
        'view_own_transports',
        'update_transport_status'
      ]
    };

    return permissions[role] || permissions.driver;
  }

  // Helper function to load data from database.json
  async loadLocalData() {
    try {
      const response = await fetch('./database.json');
      if (!response.ok) {
        throw new Error('Failed to load database.json');
      }
      return await response.json();
    } catch (error) {
      this.log(`Error loading local data: ${error.message}`);
      throw error;
    }
  }

  // Main migration function
  async runMigration() {
    try {
      this.log('Loading local data from database.json...');
      const localData = await this.loadLocalData();
      
      this.log('Starting migration process...');
      const result = await this.migrateFromLocalData(localData);
      
      if (result.success) {
        this.log('Migration completed successfully!');
        this.log('You can now switch to using Firebase API instead of local storage.');
      } else {
        this.log('Migration failed. Please check the errors above.');
      }
      
      return result;
    } catch (error) {
      this.log(`Migration error: ${error.message}`);
      return {
        success: false,
        error: error.message,
        log: this.migrationLog
      };
    }
  }
}

// Export migration class
export default DataMigration;

// Helper function to run migration from console
export async function runMigration() {
  const migration = new DataMigration();
  return await migration.runMigration();
}

// Auto-run migration if this script is loaded directly
if (typeof window !== 'undefined' && window.location.search.includes('migrate=true')) {
  console.log('Auto-running migration...');
  runMigration().then(result => {
    console.log('Migration result:', result);
  });
}