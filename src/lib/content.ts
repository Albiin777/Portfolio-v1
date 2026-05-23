import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export const useCollectionData = <T,>(
  collectionName: string,
  fallback: T[],
  orderField = 'order'
) => {
  const [items, setItems] = useState<T[]>(fallback)

  useEffect(() => {
    if (!db) return

    return onSnapshot(collection(db, collectionName), (snap) => {
      const next = snap.docs
        .map((d) => ({ ...d.data(), __id: d.id }) as T)
        .sort((a, b) => {
          const aOrder = Number((a as Record<string, unknown>)[orderField] ?? 0)
          const bOrder = Number((b as Record<string, unknown>)[orderField] ?? 0)
          return aOrder - bOrder
        })
      if (next.length) setItems(next)
    })
  }, [collectionName, orderField])

  return items
}

export const useDocData = <T,>(
  collectionName: string,
  docId: string,
  fallback: T
) => {
  const [item, setItem] = useState<T>(fallback)

  useEffect(() => {
    if (!db) return

    const ref = doc(db, collectionName, docId)
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) setItem(snap.data() as T)
    })
  }, [collectionName, docId])

  return item
}
