import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import { getAdminEmail, isAdminEmail } from '../lib/admin'
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinary'

type DocItem = { id: string; data: Record<string, unknown> }

type UploadField = {
  field: string
  label: string
  accept: string
  folder: string
}

type DefaultDoc = {
  id: string
  data: Record<string, unknown>
}

type CollectionEditorProps = {
  title: string
  collectionName: string
  defaultJson: Record<string, unknown>
  uploadFields?: UploadField[]
  defaultDocId?: string
  defaultDocs?: DefaultDoc[]
}

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '-')

const getFirebaseErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'code' in error) {
    return `${fallback} (${String(error.code)})`
  }
  if (error instanceof Error && error.message) {
    return `${fallback} (${error.message})`
  }
  return fallback
}

const getDocLabel = (item: DocItem) => {
  const title = item.data.title || item.data.name || item.data.org || item.data.institution || item.data.year
  return typeof title === 'string' && title.trim() ? title : item.id
}

const toEditableData = (data: Record<string, unknown>) => {
  const { createdAt, updatedAt, ...editableData } = data
  void createdAt
  void updatedAt
  return editableData
}

const CollectionEditor = ({
  title,
  collectionName,
  defaultJson,
  uploadFields = [],
  defaultDocId,
  defaultDocs = []
}: CollectionEditorProps) => {
  const [docsList, setDocsList] = useState<DocItem[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({})
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!db) return

    const q = query(collection(db, collectionName), orderBy('order', 'asc'))
    return onSnapshot(q, (snap) => {
      const next: DocItem[] = snap.docs.map((d) => ({ id: d.id, data: d.data() }))
      setDocsList(next)
      setDrafts((prev) => {
        const nextDrafts = { ...prev }
        next.forEach((item) => {
          if (!nextDrafts[item.id]) {
            nextDrafts[item.id] = JSON.stringify(toEditableData(item.data), null, 2)
          }
        })
        return nextDrafts
      })
    })
  }, [collectionName])

  const handleSave = async (id: string) => {
    setError(null)
    setSavingId(id)
    try {
      if (!db) {
        throw new Error('Firebase is not configured.')
      }

      const raw = drafts[id]
      const data = JSON.parse(raw)
      await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      setError(getFirebaseErrorMessage(error, 'Failed to save. Check JSON format or Firestore rules.'))
    } finally {
      setSavingId(null)
    }
  }

  const handleAdd = async () => {
    setError(null)
    setAdding(true)
    try {
      if (!db) {
        throw new Error('Firebase is not configured.')
      }
      const currentDb = db

      if (defaultDocs.length) {
        await Promise.all(defaultDocs.map((defaultDoc) => setDoc(doc(currentDb, collectionName, defaultDoc.id), {
          ...defaultDoc.data,
          updatedAt: serverTimestamp()
        }, { merge: true })))
      } else if (defaultDocId) {
        const payload = {
          ...defaultJson,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
        await setDoc(doc(currentDb, collectionName, defaultDocId), payload, { merge: true })
      } else {
        const payload = {
          ...defaultJson,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
        await addDoc(collection(currentDb, collectionName), payload)
      }
    } catch (error) {
      setError(getFirebaseErrorMessage(error, 'Failed to add new document. Check Firestore rules.'))
    } finally {
      setAdding(false)
    }
  }

  const handleFieldUpload = async (id: string, uploadField: UploadField, file: File) => {
    setError(null)
    const key = `${id}:${uploadField.field}`
    setUploadingKey(key)

    try {
      if (!db) {
        throw new Error('Firebase is not configured.')
      }

      const currentData = JSON.parse(drafts[id] || '{}') as Record<string, unknown>
      const uploadFolder = [
        uploadField.folder,
        collectionName,
        id
      ].join('/')

      const renamedFile = new File([file], `${file.lastModified}-${sanitizeFileName(file.name)}`, {
        type: file.type
      })
      const url = await uploadToCloudinary(renamedFile, uploadFolder)
      const nextData = {
        ...currentData,
        [uploadField.field]: url,
        updatedAt: serverTimestamp()
      }

      await setDoc(doc(db, collectionName, id), nextData, { merge: true })

      setDrafts((prev) => ({
        ...prev,
        [id]: JSON.stringify({ ...currentData, [uploadField.field]: url }, null, 2)
      }))
    } catch (error) {
      setError(getFirebaseErrorMessage(error, `Failed to upload ${uploadField.label}. Check Cloudinary preset settings.`))
    } finally {
      setUploadingKey(null)
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    setDeletingId(id)

    try {
      if (!db) {
        throw new Error('Firebase is not configured.')
      }

      await deleteDoc(doc(db, collectionName, id))
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setConfirmDeleteId(null)
    } catch (error) {
      setError(getFirebaseErrorMessage(error, 'Failed to delete document. Check Firestore rules.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="border border-white/10 bg-white/[0.02] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono tracking-[0.2em] uppercase text-white/70">{title}</span>
          <span className="text-[10px] text-white/35 font-mono">
            {docsList.length} {docsList.length === 1 ? 'doc' : 'docs'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
            disabled={adding}
          >
            {adding ? 'Adding...' : defaultDocs.length ? 'Create Skill Cards' : defaultDocId ? 'Create Default' : 'Add New'}
          </button>
        </div>
      </div>

      {error && <div className="text-[11px] text-rose-400 mb-3">{error}</div>}

      <div className="flex flex-col gap-3">
        {!docsList.length && (
          <div className="text-[11px] text-white/40 font-mono">
            No documents yet. Use the button above to create one.
          </div>
        )}
        {docsList.map((item) => {
          const docExpanded = Boolean(expandedDocs[item.id])

          return (
            <div key={item.id} className="border border-white/10 rounded-lg p-3">
              <button
                onClick={() => setExpandedDocs((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[12px] text-white/80 font-mono">{getDocLabel(item)}</span>
                  <span className="text-[10px] text-white/35 font-mono">ID: {item.id}</span>
                </span>
                <span className="text-accent text-[12px]">{docExpanded ? 'Collapse' : 'Edit'}</span>
              </button>

              {docExpanded && (
                <>
                  <textarea
                    className="w-full min-h-[160px] bg-[#0a0a0c]/80 border border-white/[0.08] text-white/70 text-[12px] font-mono p-3 mt-3 outline-none"
                    value={drafts[item.id] || ''}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  />
                  {uploadFields.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {uploadFields.map((uploadField) => {
                        const key = `${item.id}:${uploadField.field}`
                        const isUploading = uploadingKey === key

                        return (
                          <label
                            key={uploadField.field}
                            className="cursor-pointer px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                          >
                            {isUploading ? 'Uploading...' : `Upload ${uploadField.label}`}
                            <input
                              type="file"
                              accept={uploadField.accept}
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                e.currentTarget.value = ''
                                if (file) handleFieldUpload(item.id, uploadField, file)
                              }}
                            />
                          </label>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {confirmDeleteId === item.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 transition-colors"
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? 'Deleting...' : 'Confirm Delete'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-white/15 text-white/50 hover:text-white transition-colors"
                            disabled={deletingId === item.id}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-rose-400/25 text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleSave(item.id)}
                      className="px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
                      disabled={savingId === item.id}
                    >
                      {savingId === item.id ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

type MessageItem = {
  id: string
  data: Record<string, unknown>
}

const MessagesPanel = () => {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!db) return

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, data: d.data() })))
    })
  }, [])

  const known = messages.filter((m) => m.data.type === 'direct')
  const unknown = messages.filter((m) => m.data.type === 'anonymous')

  const renderMessage = (item: MessageItem) => (
    <div key={item.id} className="border border-white/10 rounded-lg p-3">
      <div className="text-[10px] text-white/40 font-mono mb-1">ID: {item.id}</div>
      <div className="text-[12px] text-white/80 font-mono whitespace-pre-wrap">
        {(item.data.message as string) || ''}
      </div>
      {Boolean(item.data.name || item.data.email) && (
        <div className="text-[11px] text-white/50 mt-2">
          {item.data.name ? `Name: ${item.data.name}` : ''}
          {item.data.email ? ` ${item.data.name ? '•' : ''} Email: ${item.data.email}` : ''}
        </div>
      )}
    </div>
  )

  return (
    <section className="border border-white/10 bg-white/[0.02] rounded-xl p-5">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm font-mono tracking-[0.2em] uppercase text-white/70">Messages</h3>
        <span className="text-accent text-[13px]">{isExpanded ? '[-]' : `[+] ${messages.length}`}</span>
      </button>
      {isExpanded && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-[11px] font-mono text-white/50 mb-2 uppercase tracking-widest">Known</div>
          <div className="flex flex-col gap-3">
            {known.length ? known.map(renderMessage) : <div className="text-[11px] text-white/40">No known messages.</div>}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-mono text-white/50 mb-2 uppercase tracking-widest">Unknown</div>
          <div className="flex flex-col gap-3">
            {unknown.length ? unknown.map(renderMessage) : <div className="text-[11px] text-white/40">No anonymous messages.</div>}
          </div>
        </div>
      </div>}
    </section>
  )
}

export default function Admin() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!auth) return

    const currentAuth = auth
    return onAuthStateChanged(auth, (user) => {
      if (user?.email && isAdminEmail(user.email)) {
        setUserEmail(user.email)
        setAuthError(null)
      } else if (user?.email) {
        setAuthError('This account is not authorized for admin access.')
        signOut(currentAuth).catch(() => {})
        setUserEmail(null)
      } else {
        setUserEmail(null)
      }
    })
  }, [])

  const handleAuth = async () => {
    setAuthError(null)
    try {
      if (!auth) {
        setAuthError('Firebase is not configured. Add your VITE_FIREBASE_* values to .env.')
        return
      }

      if (!email || !password) {
        setAuthError('Enter email and password.')
        return
      }
      if (email.toLowerCase() !== getAdminEmail()) {
        setAuthError('Email is not on the admin allowlist.')
        return
      }
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch {
      setAuthError('Authentication failed. Check credentials.')
    }
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-bg-dark text-white font-sans flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-white/10 bg-white/[0.03] rounded-2xl p-6">
          <div className="text-[10px] text-white/40 font-mono tracking-[0.25em] uppercase">Admin Access</div>
          <h1 className="text-2xl font-bold mt-2 mb-4">Sign In</h1>
          {!isFirebaseConfigured && (
            <div className="text-[11px] text-amber-300 mb-3">
              Firebase is not configured. Add your VITE_FIREBASE_* values to .env and restart Vite.
            </div>
          )}
          {!isCloudinaryConfigured && (
            <div className="text-[11px] text-amber-300 mb-3">
              Cloudinary uploads are not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.
            </div>
          )}
          {authError && <div className="text-[11px] text-rose-400 mb-3">{authError}</div>}
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0c]/80 border border-white/[0.08] px-4 py-3 text-[12px] text-white outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0c]/80 border border-white/[0.08] px-4 py-3 text-[12px] text-white outline-none"
            />
            <button
              onClick={handleAuth}
              className="w-full px-4 py-3 text-[11px] font-mono tracking-widest uppercase border border-accent/40 text-accent hover:bg-accent/10"
            >
              {mode === 'signup' ? 'Create Admin' : 'Sign In'}
            </button>
            <button
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-[11px] text-white/50 hover:text-white transition-colors"
            >
              {mode === 'signup' ? 'I already have an account' : 'Create admin account'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 font-mono tracking-[0.25em] uppercase">Admin Panel</div>
            <h1 className="text-2xl font-bold mt-2">Content Manager</h1>
            <div className="text-[11px] text-white/50 mt-1">Signed in as {userEmail}</div>
          </div>
          <button
            onClick={() => {
              if (auth) signOut(auth)
            }}
            className="px-3 py-2 text-[11px] font-mono tracking-widest uppercase border border-white/20 text-white/70 hover:text-white"
          >
            Sign Out
          </button>
        </div>

        <MessagesPanel />

        <CollectionEditor
          title="Profile (doc: profile/main)"
          collectionName="profile"
          defaultDocId="main"
          uploadFields={[
            { field: 'photoUrl', label: 'Photo', accept: 'image/*', folder: 'uploads/images' },
            { field: 'resumeUrl', label: 'Resume', accept: 'application/pdf', folder: 'uploads/documents' }
          ]}
          defaultJson={{
            name: 'Albin Thomas',
            headline: 'Full Stack Developer',
            summary1: 'Computer Science Engineering student and developer passionate about building intelligent, user-focused digital solutions.',
            summary2: 'I enjoy turning ideas into meaningful products through code, creativity, and innovation.',
            resumeUrl: '/Albin_Thomas-resume.pdf',
            photoUrl: '/albin.png',
            contact: {
              phone: '+91 80785 74876',
              email: 'albiin7777@gmail.com',
              location: 'Thiruvalla, Keralam'
            },
            socials: {
              github: 'https://github.com/Albiin777',
              linkedin: 'https://www.linkedin.com/in/albinthomas18/',
              twitter: 'https://x.com/albiin7777',
              instagram: 'https://instagram.com/albiin.thomas/'
            },
            order: 0
          }}
        />

        <CollectionEditor
          title="Projects"
          collectionName="projects"
          uploadFields={[
            { field: 'imageUrl', label: 'Project Image', accept: 'image/*', folder: 'uploads/images' }
          ]}
          defaultJson={{
            title: '',
            description: '',
            bullets: [],
            tech: ['TypeScript'],
            liveUrl: '#',
            codeUrl: '#',
            type: 'featured',
            types: ['featured'],
            imageUrl: '',
            order: 0
          }}
        />

        <CollectionEditor
          title="Education"
          collectionName="education"
          defaultJson={{
            year: '2023 - Present',
            title: 'Degree / Program',
            institution: 'Institution Name',
            score: 'CGPA: 0.0',
            badge: null,
            order: 0
          }}
        />

        <CollectionEditor
          title="Experience"
          collectionName="experience"
          defaultJson={{
            org: 'Company / Org',
            branchName: 'org/branch',
            active: false,
            roles: [
              { role: 'Role Title', duration: '2024 - 2025', tags: ['Tag'], active: false }
            ],
            order: 0
          }}
        />

        <CollectionEditor
          title="Skills"
          collectionName="skills"
          defaultJson={{}}
          defaultDocs={[
            {
              id: 'frontend',
              data: {
                title: 'Frontend',
                description: 'Building responsive and interactive user experiences with modern web technologies.',
                skills: [
                  { name: 'React.js' },
                  { name: 'JavaScript' },
                  { name: 'TypeScript' },
                  { name: 'HTML' },
                  { name: 'CSS' },
                  { name: 'Tailwind CSS' },
                  { name: 'Vite' }
                ],
                order: 0
              }
            },
            {
              id: 'backend',
              data: {
                title: 'Backend',
                description: 'Developing scalable backend systems and APIs for modern applications.',
                skills: [
                  { name: 'Node.js' },
                  { name: 'Express.js' },
                  { name: 'Java' },
                  { name: 'Python' },
                  { name: 'C' },
                  { name: 'Firebase' },
                  { name: 'MySQL' }
                ],
                order: 1
              }
            },
            {
              id: 'tools',
              data: {
                title: 'Tools / Platforms',
                description: 'Tools and platforms I use to streamline development and productivity.',
                skills: [
                  { name: 'VS Code' },
                  { name: 'Git' },
                  { name: 'GitHub' },
                  { name: 'Antigravity' }
                ],
                order: 2
              }
            }
          ]}
        />
      </div>
    </div>
  )
}
