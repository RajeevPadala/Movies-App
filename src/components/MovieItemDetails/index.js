import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {format} from 'date-fns'
import Header from '../Header'
import MoreLikeMovie from '../MoreLikeMovie'
import Footer from '../Footer'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {movieDetails: [], apiMovieDetailsStatus: apiStatusConstant.initial}

  componentDidMount() {
    this.getMovieDetailsData()
  }

  getMovieDetailsData = async () => {
    this.setState({apiMovieDetailsStatus: apiStatusConstant.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateMovieData = {
        adult: data.movie_details.adult,
        backDropPath: data.movie_details.backdrop_path,
        budget: data.movie_details.budget,
        title: data.movie_details.title,
        overview: data.movie_details.overview,
        runtime: data.movie_details.runtime,
        releaseDate: data.movie_details.release_date,
        genres: data.movie_details.genres.map(eachGenres => ({
          id: eachGenres.id,
          name: eachGenres.name,
        })),
        id: data.movie_details.id,
        posterPath: data.movie_details.poster_path,
        similarMovies: data.movie_details.similar_movies.map(eachSimilar => ({
          backDropPath: eachSimilar.backdrop_path,
          id: eachSimilar.id,
          posterPath: eachSimilar.poster_path,
          title: eachSimilar.title,
        })),
        spokenLanguages: data.movie_details.spoken_languages.map(
          eachLanguage => ({
            id: eachLanguage.id,
            englishName: eachLanguage.english_name,
          }),
        ),
        voteAverage: data.movie_details.vote_average,
        voteCount: data.movie_details.vote_count,
      }
      this.setState({
        movieDetails: updateMovieData,
        apiMovieDetailsStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiMovieDetailsStatus: apiStatusConstant.failure})
    }
  }

  getFormateDate = forDate => {
    const newDate = format(new Date(forDate), 'do LLLL Y')
    return newDate
  }

  extractYear = releaseDate => {
    const date = new Date(releaseDate)
    const year = date.getFullYear()
    return year
  }

  formateRunningTime = runtime => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return `${hours}h ${minutes}m`
  }

  ifAdultOrNot = adult => {
    if (adult) {
      return <p className="adult">A</p>
    }
    return <p className="adult">U/A</p>
  }

  renderInSuccessViewOfMovieDetails = () => {
    const {movieDetails} = this.state
    const {
      backDropPath,
      title,
      overview,
      runtime,
      adult,
      releaseDate,
      genres,
      spokenLanguages,
      voteCount,
      voteAverage,
      budget,
      similarMovies,
    } = movieDetails

    return (
      <>
        <div
          className="home-container"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(24, 24, 24, 0.546875) 38.26%, #181818 92.82%, #181818 98.68%, #181818 108.61%),url(${backDropPath}) `,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          alt={title}
        >
          <Header />
          <div className="banner-name-container">
            <h1 className="home-banner-heading">{title}</h1>
            <div className="running-time-container">
              <p className="para-movie-details">
                {this.formateRunningTime(runtime)}
              </p>
              {this.ifAdultOrNot(adult)}
              <p className="para-movie-details">
                {this.extractYear(releaseDate)}
              </p>
            </div>
            <p className="home-banner-para">{overview}</p>
            <button className="btn-banner" type="button">
              Play
            </button>
          </div>
        </div>
        <div className="more-details-container">
          <div className="genres-container">
            <h1 className="topic-para">Genres</h1>
            <ul className="ul-genres">
              {genres.map(eachListGenres => (
                <p className="li-para" key={eachListGenres.name}>
                  {eachListGenres.name}
                </p>
              ))}
            </ul>
          </div>
          <div className="audio-container">
            <h1 className="topic-para">Audio Available</h1>
            <ul className="ul-genres">
              {spokenLanguages.map(eachListLanguage => (
                <p className="li-para" key={eachListLanguage.englishName}>
                  {eachListLanguage.englishName}
                </p>
              ))}
            </ul>
          </div>
          <div className="audio-container">
            <h1 className="topic-para">Rating Count</h1>
            <div className="ul-genres">
              <p className="li-para">{voteCount}</p>
            </div>
            <h1 className="topic-para">Rating Average</h1>
            <div className="ul-genres">
              <p className="li-para">{voteAverage}</p>
            </div>
          </div>
          <div className="date-container">
            <h1 className="topic-para">Budget</h1>
            <div className="ul-genres">
              <p className="li-para">{budget}</p>
            </div>
            <h1 className="topic-para">Release Date</h1>
            <div className="ul-genres">
              <p className="li-para">{this.getFormateDate(releaseDate)}</p>
            </div>
          </div>
        </div>
        <div className="more-like-container">
          <h1 className="more-like-heading">More like this</h1>
          <ul className="ul-more-like">
            {similarMovies.map(eachLikedMovies => (
              <MoreLikeMovie
                key={eachLikedMovies.id}
                likedMovieDetails={eachLikedMovies}
              />
            ))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  renderInFailureViewOfMovieDetails = () => (
    <>
      <Header />
      <div className="loader-container-popular">
        <img
          src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665899171/Background-Complete_wschfx.png"
          alt="failure view"
          className="error-image"
        />
        <p className="error-popular-para">
          Something went wrong, Please try again.
        </p>
        <button
          type="button"
          className="btn-popular"
          onClick={this.getMovieDetailsData}
        >
          Try Again
        </button>
      </div>
    </>
  )

  renderLoadingViewOfMovieDetails = () => (
    <>
      <Header />
      <div className="loader-container-movie-details" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  renderMovieDetailsData = () => {
    const {apiMovieDetailsStatus} = this.state

    switch (apiMovieDetailsStatus) {
      case apiStatusConstant.inprogress:
        return this.renderLoadingViewOfMovieDetails()
      case apiStatusConstant.success:
        return this.renderInSuccessViewOfMovieDetails()
      case apiStatusConstant.failure:
        return this.renderInFailureViewOfMovieDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-movie-details-container">
        {this.renderMovieDetailsData()}
      </div>
    )
  }
}

export default MovieItemDetails
