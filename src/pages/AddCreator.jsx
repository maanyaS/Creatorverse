import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function AddCreator() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim(),
      imageURL: form.imageURL.trim() || null,
    }

    const { error } = await supabase.from('creators').insert(payload)

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    navigate('/')
  }

  return (
    <section className="page">
      <Link to="/" className="back-link">
        ← Back to all creators
      </Link>
      <h1>Add a new creator</h1>

      <form onSubmit={handleSubmit} className="creator-form">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          URL
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://…"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <label>
          Image URL <span className="muted">(optional)</span>
          <input
            type="url"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            placeholder="https://…"
          />
        </label>

        {error && <p className="error">Error: {error}</p>}

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add creator'}
        </button>
      </form>
    </section>
  )
}
