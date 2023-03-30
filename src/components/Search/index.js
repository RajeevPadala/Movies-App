import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import ItemSearch from '../ItemSearch'

import './index.css'

const searchRoute = true

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    searchResultsList: [],
    renderStatus: apiStatusConstant.initial,
    searchValue: '',
  }

  getSearchMoviesData = async searchValue => {
    this.setState({renderStatus: apiStatusConstant.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const searchApi = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(searchApi, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedSearchMoviesData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        searchResultsList: fetchedSearchMoviesData,
        renderStatus: apiStatusConstant.success,
        searchValue,
      })
    } else {
      this.setState({renderStatus: apiStatusConstant.failure})
    }
  }

  renderSuccessView = () => {
    const {searchResultsList} = this.state
    return searchResultsList.length > 0 ? (
      <ul className="popular-ul-container">
        {searchResultsList.map(eachMovie => (
          <ItemSearch eachMovie={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    ) : (
      this.renderNoResultsView()
    )
  }

  renderNoResultsView = () => {
    const {searchValue} = this.state

    return (
      <div className="loader-container-popular">
        <img
          className="error-image"
          alt="no movies"
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/No_Views_awtv8d.svg"
        />
        <p className="error-popular-para">
          Your search for {searchValue} did not find any matches.
        </p>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
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
        onClick={this.getSearchMoviesData}
      >
        Try Again
      </button>
    </div>
  )

  renderSwitchView = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case apiStatusConstant.inprogress:
        return this.renderLoaderView()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-container">
        <Header
          getSearchMoviesData={this.getSearchMoviesData}
          searchRoute={searchRoute}
        />
        <div className="search-container">{this.renderSwitchView()}</div>
        <Footer />
      </div>
    )
  }
}
export default Search
