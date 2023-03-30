import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import Trending from '../Trending'

import Originals from '../Originals'

import Footer from '../Footer'

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class Home extends Component {
  state = {bannerMovie: [], apiStatus: apiStatusConstant.initial}

  componentDidMount() {
    this.getOneMovieData()
  }

  getOneMovieData = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogress})
    const url = 'https://apis.ccbp.in/movies-app/originals'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const oneMove =
        data.results[Math.floor(Math.random() * data.results.length)]
      const updateData = {
        id: oneMove.id,
        backDropPath: oneMove.backdrop_path,
        overview: oneMove.overview,
        posterPath: oneMove.poster_path,
        title: oneMove.title,
      }

      this.setState({
        apiStatus: apiStatusConstant.success,
        bannerMovie: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderInSuccessView = () => {
    const {bannerMovie} = this.state
    const {backDropPath, overview, title} = bannerMovie
    return (
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
          <p className="home-banner-para">{overview}</p>
          <button className="btn-banner" type="button">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-main-container">
      <Header />
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </div>
  )

  renderInFailureView = () => (
    <div className="loader-main-container">
      <Header />
      <div className="loader-container">
        <img
          alt="failure view"
          src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665899171/Background-Complete_wschfx.png"
          className="failure-image"
        />
        <p className="error-para">Something went wrong. Please try again</p>
        <button
          type="button"
          className="error-btn"
          onClick={this.getOneMovieData}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderHomePage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inprogress:
        return this.renderLoadingView()
      case apiStatusConstant.success:
        return this.renderInSuccessView()
      case apiStatusConstant.failure:
        return this.renderInFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-home-container">
        {this.renderHomePage()}
        <Trending />
        <Originals />
        <Footer />
      </div>
    )
  }
}

export default Home
