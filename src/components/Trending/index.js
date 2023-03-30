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

class Trending extends Component {
  state = {apiTrendingStatus: apiStatusConstant.initial, trendingData: []}

  componentDidMount() {
    this.getTrendingData()
  }

  getTrendingData = async () => {
    this.setState({apiTrendingStatus: apiStatusConstant.inprogress})
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        trendingData: updateData,
        apiTrendingStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiTrendingStatus: apiStatusConstant.failure})
    }
  }

  renderInSuccessViewOfTrending = () => {
    const {trendingData} = this.state

    return (
      <div className="main-container">
        <div className="slick-container">
          <Slider {...settings}>
            {trendingData.map(eachTrending => {
              const {id, posterPath, title} = eachTrending
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

  renderInFailureViewOfTrending = () => (
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
        onClick={this.getTrendingData}
      >
        Try Again
      </button>
    </div>
  )

  renderLoadingViewOfTrending = () => (
    <div className="loader-container-trending" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderTrendingData = () => {
    const {apiTrendingStatus} = this.state

    switch (apiTrendingStatus) {
      case apiStatusConstant.inprogress:
        return this.renderLoadingViewOfTrending()
      case apiStatusConstant.success:
        return this.renderInSuccessViewOfTrending()
      case apiStatusConstant.failure:
        return this.renderInFailureViewOfTrending()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="trending-container">
        <h1 className="trending-heading">Trending Now</h1>
        {this.renderTrendingData()}
      </div>
    )
  }
}

export default Trending
