// lib/admin.ts
// Define quem é administrador do site.
// Configure a env ADMIN_EMAILS com os emails separados por vírgula, ex:
//   ADMIN_EMAILS=rodrigolgirardi@gmail.com,outro@grapetools.com

export function listaAdmins(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return listaAdmins().includes(email.toLowerCase())
}
