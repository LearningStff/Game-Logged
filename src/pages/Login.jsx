import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  async function loginUser(event) {
    event.preventDefault()

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        credentials: 'include',

        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    )

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      navigate('/')
    } else {
      setMessage(data.message)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">

      <h1 className="text-4xl font-bold">
        Login
      </h1>

      <p className="mt-2 text-gray-400">
        Login to your GameLog account.
      </p>

      <form
        onSubmit={loginUser}
        className="mt-8 space-y-5"
      >

        <div>
          <p className="mb-2 text-sm text-gray-400">
            Email
          </p>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-gray-400">
            Password
          </p>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500"
        >
          Login
        </button>

      </form>

      <p className="mt-5 text-sm text-gray-400">
        {message}
      </p>

    </main>
  )
}

export default Login