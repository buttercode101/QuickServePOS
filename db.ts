
import { Order } from './types';

const DB_NAME = 'QuickServePOS';
const STORE_NAME = 'orders';
const VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveOrder = async (order: Order): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add(order);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getTodayOrders = async (): Promise<Order[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const today = new Date().toDateString();
      const filtered = request.result.filter((o: Order) => 
        new Date(o.timestamp).toDateString() === today
      );
      resolve(filtered);
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearAllData = async (): Promise<void> => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
};
