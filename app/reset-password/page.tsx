// pages/reset-password.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: any) {
    e.preventDefault()
    if (password !== confirm) return setError("Passwords don't match")
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })
    if (res.ok) router.push('/login?reset=success')
    else setError(await res.text())
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Reset Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="password" placeholder="New password" value={password}
             onChange={e => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm password" value={confirm}
             onChange={e => setConfirm(e.target.value)} required />
      <button type="submit">Reset</button>
    </form>
  )
}