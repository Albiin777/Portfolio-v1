import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

type DirectMessage = {
  type: 'direct'
  name: string
  email: string
  message: string
}

type AnonymousMessage = {
  type: 'anonymous'
  message: string
}

type PortfolioMessage = DirectMessage | AnonymousMessage

const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

const saveToFirestore = async (data: PortfolioMessage) => {
  if (!db) return false

  await addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: serverTimestamp()
  })

  return true
}

const sendToWeb3Forms = async (data: PortfolioMessage) => {
  if (!web3FormsAccessKey) return false

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_key: web3FormsAccessKey,
      subject: data.type === 'anonymous' ? 'New anonymous portfolio message' : 'New portfolio contact message',
      from_name: 'Albin Portfolio',
      source: data.type === 'anonymous' ? 'Anonymous chat' : 'Contact form',
      name: data.type === 'direct' ? data.name : 'Anonymous',
      email: data.type === 'direct' ? data.email : undefined,
      replyto: data.type === 'direct' ? data.email : undefined,
      message: data.message
    })
  })

  if (!response.ok) {
    throw new Error('Web3Forms failed to receive the message.')
  }

  return true
}

export const sendPortfolioMessage = async (data: PortfolioMessage) => {
  const results = await Promise.allSettled([
    saveToFirestore(data),
    sendToWeb3Forms(data)
  ])

  const sentSomewhere = results.some((result) => result.status === 'fulfilled' && result.value)
  const failedDestination = results.find((result) => result.status === 'rejected')

  if (!sentSomewhere && failedDestination?.status === 'rejected') {
    throw failedDestination.reason
  }

  if (!sentSomewhere) {
    throw new Error('No message receiver is configured.')
  }
}
