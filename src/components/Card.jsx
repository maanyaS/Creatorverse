import { Link } from 'react-router-dom'

export default function Card({ creator }) {
  const { id, name, url, description, imageURL } = creator

  return (
    <article className="creator-card">
      {imageURL && (
        <img
          className="creator-card__image"
          src={imageURL}
          alt={`Photo of ${name}`}
        />
      )}
      <h3 className="creator-card__name">{name}</h3>
      <p className="creator-card__description">{description}</p>
      <a
        className="creator-card__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit channel
      </a>
      <div className="creator-card__actions">
        <Link to={`/creators/${id}`} className="btn btn--secondary">
          View
        </Link>
        <Link to={`/creators/${id}/edit`} className="btn btn--secondary">
          Edit
        </Link>
      </div>
    </article>
  )
}
