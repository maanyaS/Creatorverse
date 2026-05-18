import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../client'

export default function EditCreator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCreator = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setForm({
          name: data.name ?? '',
          url: data.url ?? '',
          description: data.description ?? '',
          imageURL: data.imageURL ?? '',
        })
      }
      setLoading(false)
    }

    fetchCreator()
  }, [id])

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

    const { error } = await supabase.from('creators').update(payload).eq('id', id)

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    navigate(`/creators/${id}`)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${form.name || 'this creator'}? This cannot be undone.`
    )
    if (!confirmed) return

    setSubmitting(true)
    const { error } = await supabase.from('creators').delete().eq('id', id)

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    navigate('/')
  }

  if (loading) return <p>Loading…</p>

  return (
    <section className="page">
      <Link to={`/creators/${id}`} className="back-link">
        ← Back to creator
      </Link>
      <h1>Edit creator</h1>

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
          />
        </label>

        {error && <p className="error">Error: {error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn--danger"
            disabled={submitting}
          >
            Delete creator
          </button>
        </div>
      </form>
    </section>
  )
}
