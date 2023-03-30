import {Component} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class Originals extends Component {
  state = {apiOriginalsStatus: apiStatusConstant.initial, originalsData: []}

  componentDidMount() {
    this.getOriginalMovieData()
  }

  getOriginalMovieData = async () => {
    this.setState({apiOriginalsStatus: apiStatusConstant.inprogress})
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
      const updateData = data.results.map(eachData => ({
        id: eachData.id,
        backDropPath: eachData.backdrop_path,
        overview: eachData.overview,
        posterPath: eachData.poster_path,
        title: eachData.title,
      }))
      this.setState({
        originalsData: updateData,
        apiOriginalsStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiOriginalsStatus: apiStatusConstant.failure})
    }
  }

  renderInSuccessViewOfOriginals = () => {
    const {originalsData} = this.state
    return (
      <div className="main-container">
        <div className="slick-container">
          <Slider {...settings}>
            {originalsData.map(eachOriginals => {
              const {id, posterPath, title} = eachOriginals
              return (
                <div className="slick-item" key={id}>
                  <Link to={`/movies/${id}`}>
                    <img
                      className="tending-movie-poster-path"
                      src={posterPath}
                      alt={title}
                    />
                  </Link>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    )
  }

  renderInFailureViewOfOriginals = () => (
    <div className="loader-container-originals">
      <img
        alt="failure view"
        src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665899171/Background-Complete_wschfx.png"
        className="failure-image-originals"
      />
      <p className="error-para-originals">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="error-btn-originals"
        onClick={this.getOriginalMovieData}
      >
        Try Again
      </button>
    </div>
  )

  renderLoadingViewOfOriginals = () => (
    <div className="loader-container-originals" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalMovieData = () => {
    const {apiOriginalsStatus} = this.state

    switch (apiOriginalsStatus) {
      case apiStatusConstant.inprogress:
        return this.renderLoadingViewOfOriginals()
      case apiStatusConstant.success:
        return this.renderInSuccessViewOfOriginals()
      case apiStatusConstant.failure:
        return this.renderInFailureViewOfOriginals()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="originals-container">
        <h1 className="originals-heading">Originals</h1>
        {this.renderOriginalMovieData()}
      </div>
    )
  }
}

export default Originals
