import { openDB } from 'idb'

const DB_NAME = 'GastoHoyDB'
const DB_VERSION = 1
const STORE_NAME = 'expenses'

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id'
        })
        store.createIndex('date', 'date')
        store.createIndex('backedUp', 'backedUp')
      }
    }
  })
}

export async function addExpense(expense) {
  const db = await initDB()
  return db.put(STORE_NAME, expense)
}

export async function getAllExpenses() {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export async function deleteExpense(id) {
  const db = await initDB()
  return db.delete(STORE_NAME, id)
}

export async function getExpensesByDateRange(startDate, endDate) {
  const db = await initDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const index = tx.store.index('date')
  const range = IDBKeyRange.bound(startDate, endDate)
  return index.getAll(range)
}

export async function markAsBackedUp(ids) {
  const db = await initDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  
  for (const id of ids) {
    const expense = await store.get(id)
    if (expense) {
      expense.backedUp = true
      await store.put(expense)
    }
  }
  await tx.done
}

export async function clearAllExpenses() {
  const db = await initDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.store.clear()
  await tx.done
}
