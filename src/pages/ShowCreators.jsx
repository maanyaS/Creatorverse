import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../client'
import Card from '../components/Card'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select()
        .order('id', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setCreators(data ?? [])
      }
      setLoading(false)
    }

    fetchCreators()
  }, [])

  return (
    <section className="page">
      <header className="page__header">
        <h1>Creatorverse</h1>
        <Link to="/creators/new" className="btn btn--primary">
          Add a creator
        </Link>
      </header>

      {loading && <p>Loading creators…</p>}
      {error && <p className="error">Error loading creators: {error}</p>}

      {!loading && !error && creators.length === 0 && (
        <p>No creators yet. Add your first one!</p>
      )}

      <div className="creator-grid">
        {creators.map((creator) => (
          <Card key={creator.id} creator={creator} />
        ))}
      </div>
    </section>
  )
}
