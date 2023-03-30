import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import ItemPopular from '../ItemPopular'
import Footer from '../Footer'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {apiStatusPopular: apiStatusConstant.initial, popularMovieData: []}

  componentDidMount() {
    this.getPopularData()
  }

  getPopularData = async () => {
    this.setState({apiStatusPopular: apiStatusConstant.inprogress})
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        popularMovieData: updateData,
        apiStatusPopular: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatusPopular: apiStatusConstant.failure})
    }
  }

  renderInSuccessViewOfPopular = () => {
    const {popularMovieData} = this.state

    return (
      <div className="popular-list-container">
        <ul className="popular-ul-container">
          {popularMovieData.map(eachPopular => (
            <ItemPopular key={eachPopular.id} itemDetails={eachPopular} />
          ))}
        </ul>
      </div>
    )
  }

  renderInFailureViewOfPopular = () => (
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
        onClick={this.getPopularData}
      >
        Try Again
      </button>
    </div>
  )

  renderLoadingViewOfPopular = () => (
    <div className="loader-container-popular" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularData = () => {
    const {apiStatusPopular} = this.state

    switch (apiStatusPopular) {
      case apiStatusConstant.inprogress:
        return this.renderLoadingViewOfPopular()
      case apiStatusConstant.success:
        return this.renderInSuccessViewOfPopular()
      case apiStatusConstant.failure:
        return this.renderInFailureViewOfPopular()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-container">
        <Header />
        {this.renderPopularData()}
        <Footer />
      </div>
    )
  }
}

export default Popular
