// Firebase API Functions
// ฟังก์ชันสำหรับจัดการข้อมูลใน Firestore

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { db, FirebaseUtils } from './firebase-config.js';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  TRANSPORTS: 'transports',
  VEHICLES: 'vehicles',
  DRIVERS: 'drivers',
  NOTIFICATIONS: 'notifications',
  ASSIGNMENTS: 'assignments'
};

// Firebase API Class
class FirebaseAPI {
  constructor() {
    // Removed real-time listeners to prevent connection errors
  }

  // ===== USER MANAGEMENT =====
  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async authenticateUser(usernameOrEmail, password) {
    try {
      const users = await this.getUsers();
      const user = users.find(u => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
        u.password === password
      );
      return user || null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async addUser(userData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // ===== TRANSPORT MANAGEMENT =====
  async getTransports() {
    try {
      const q = query(collection(db, COLLECTIONS.TRANSPORTS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting transports:', error);
      throw error;
    }
  }

  async getTransportById(transportId) {
    try {
      const docRef = doc(db, COLLECTIONS.TRANSPORTS, transportId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error getting transport:', error);
      throw error;
    }
  }

  async getDriverTransports(driverId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.TRANSPORTS),
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting driver transports:', error);
      throw error;
    }
  }

  async addTransport(transportData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TRANSPORTS), {
        ...transportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding transport:', error);
      throw error;
    }
  }

  async updateTransport(transportId, transportData) {
    try {
      const docRef = doc(db, COLLECTIONS.TRANSPORTS, transportId);
      await updateDoc(docRef, {
        ...transportData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating transport:', error);
      throw error;
    }
  }

  async deleteTransport(transportId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TRANSPORTS, transportId));
      return true;
    } catch (error) {
      console.error('Error deleting transport:', error);
      throw error;
    }
  }

  // ===== VEHICLE MANAGEMENT =====
  async getVehicles() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.VEHICLES));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting vehicles:', error);
      throw error;
    }
  }

  async addVehicle(vehicleData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), {
        ...vehicleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  }

  // ===== ASSIGNMENT MANAGEMENT =====
  async getAssignments() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ASSIGNMENTS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting assignments:', error);
      throw error;
    }
  }

  async addAssignment(assignmentData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ASSIGNMENTS), {
        ...assignmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  }

  async updateAssignment(assignmentId, assignmentData) {
    try {
      const docRef = doc(db, COLLECTIONS.ASSIGNMENTS, assignmentId);
      await updateDoc(docRef, {
        ...assignmentData,
        updatedAt: serverTimestamp()
      });
      return assignmentId;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  }

  async deleteAssignment(assignmentId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ASSIGNMENTS, assignmentId));
      return assignmentId;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  }

  async getActiveAssignments() {
    try {
      const q = query(
        collection(db, COLLECTIONS.ASSIGNMENTS),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      const assignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by assignedAt in memory to avoid index requirement
      return assignments.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
    } catch (error) {
      console.error('Error getting active assignments:', error);
      throw error;
    }
  }

  // ===== REMOVED REAL-TIME LISTENERS =====
  // Real-time listeners removed to prevent Firestore connection errors
  // Use regular get methods instead for better stability

  // ===== NOTIFICATION FUNCTIONS =====
  async getNotifications(userId = null) {
    try {
      let q;
      if (userId) {
        q = query(
          collection(db, COLLECTIONS.NOTIFICATIONS),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('createdAt', 'desc'));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async addNotification(notification) {
    try {
      const notificationData = {
        ...notification,
        id: notification.id || `N-${Date.now()}`,
        createdAt: serverTimestamp(),
        isRead: false
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), notificationData);
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async getUnreadNotifications(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  }

  // ===== UTILITY FUNCTIONS =====
  async initializeData() {
    try {
      // Check if data already exists
      const users = await this.getUsers();
      if (users.length > 0) {
        console.log('Data already exists in Firestore');
        return;
      }

      console.log('Initializing Firestore with default data...');
      // Add default users, vehicles, etc.
      // This will be implemented when migrating from database.json
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }
}

// Create and export Firebase API instance
const firebaseAPI = new FirebaseAPI();
export default firebaseAPI;

// Export collections for direct access if needed
export { COLLECTIONS };