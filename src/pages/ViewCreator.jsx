import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../client'

export default function ViewCreator() {
  const { id } = useParams()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
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
      } else {
        setCreator(data)
      }
      setLoading(false)
    }

    fetchCreator()
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error) return <p className="error">Error: {error}</p>
  if (!creator) return <p>Creator not found.</p>

  return (
    <section className="page">
      <Link to="/" className="back-link">
        ← Back to all creators
      </Link>

      <article className="creator-detail">
        {creator.imageURL && (
          <img
            className="creator-detail__image"
            src={creator.imageURL}
            alt={`Photo of ${creator.name}`}
          />
        )}
        <h1>{creator.name}</h1>
        <p className="creator-detail__description">{creator.description}</p>
        <a
          className="creator-detail__link"
          href={creator.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {creator.url}
        </a>

        <div className="creator-detail__actions">
          <Link to={`/creators/${creator.id}/edit`} className="btn btn--primary">
            Edit
          </Link>
        </div>
      </article>
    </section>
  )
}
