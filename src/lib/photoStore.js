const DB_NAME = 'kababyan-private-media'
const STORE_NAME = 'place-photos'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore(mode, action) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    const request = action(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

export function savePlacePhoto(placeId, file) {
  return withStore('readwrite', (store) => store.put(file, placeId))
}

export function getPlacePhoto(placeId) {
  return withStore('readonly', (store) => store.get(placeId))
}

export function deletePlacePhoto(placeId) {
  return withStore('readwrite', (store) => store.delete(placeId))
}

export async function clearPlacePhotos(placeIds) {
  await Promise.all(placeIds.map(deletePlacePhoto))
}
