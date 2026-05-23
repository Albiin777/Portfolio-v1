export const getAdminEmail = () => (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase()

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false
  return email.toLowerCase() === getAdminEmail()
}
