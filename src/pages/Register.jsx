import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/register`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      }
    )

    const data = await response.json()

    if (response.ok) {
      navigate('/login')
    } else {
      setMessage(data.message)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">

      <h1 className="text-4xl font-bold">
        Create Account
      </h1>

      <p className="mt-2 text-gray-400">
        Create an account to start tracking your games.
      </p>

      <form
        onSubmit={registerUser}
        className="mt-8 space-y-5"
      >

        <div>
          <p className="mb-2 text-sm text-gray-400">
            Username
          </p>

          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white outline-none"
            required
          />
        </div>

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
          Create Account
        </button>

      </form>

      <p className="mt-5 text-sm text-gray-400">
        {message}
      </p>

    </main>
  )
}

export default Register