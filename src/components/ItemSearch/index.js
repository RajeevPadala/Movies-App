import {Link} from 'react-router-dom'
import './index.css'

const ItemSearch = props => {
  const {eachMovie} = props
  const {posterPath, title, id} = eachMovie

  return (
    <li className="li-container" key={id}>
      <Link to={`/movies/${id}`} key={id}>
        <img
          src={posterPath}
          alt={title}
          className="tending-movie-poster-path"
        />
      </Link>
    </li>
  )
}
export default ItemSearch
