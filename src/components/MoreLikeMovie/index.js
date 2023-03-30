import './index.css'

const MoreLikeMovie = props => {
  const {likedMovieDetails} = props
  const {posterPath, title} = likedMovieDetails

  return (
    <li className="liked-li">
      <img src={posterPath} alt={title} className="more-liked-poster" />
    </li>
  )
}

export default MoreLikeMovie
