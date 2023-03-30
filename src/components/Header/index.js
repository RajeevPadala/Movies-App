import {withRouter, Link} from 'react-router-dom'
import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {CgPlayList} from 'react-icons/cg'

import './index.css'

class Header extends Component {
  state = {isMenuClicked: false, searchValue: ''}

  getSearchInput = event => {
    this.setState({searchValue: event.target.value})
  }

  onSearch = () => {
    const {getSearchMoviesData} = this.props
    const {searchValue} = this.state
    if (searchValue !== '') {
      getSearchMoviesData(searchValue)
    }
  }

  onClickMore = () => {
    this.setState({
      isMenuClicked: true,
    })
  }

  onClickCloseMore = () => {
    this.setState({isMenuClicked: false})
  }

  render() {
    const {searchValue} = this.state
    const {searchRoute} = this.props
    const {isMenuClicked} = this.state
    const {match} = this.props
    const {path} = match
    let homeClassName
    let popularClassName
    let accountClassName

    switch (path) {
      case '/popular':
        homeClassName = 'not-selected'
        popularClassName = 'selected'
        accountClassName = 'not-selected'
        break
      case '/profile':
        homeClassName = 'not-selected'
        popularClassName = 'not-selected'
        accountClassName = 'selected'
        break
      case '/search':
        homeClassName = 'not-selected'
        popularClassName = 'not-selected'
        accountClassName = 'not-selected'
        break
      case '/':
        homeClassName = 'selected'
        popularClassName = 'not-selected'
        accountClassName = 'not-selected'
        break
      default:
        homeClassName = 'not-selected'
        popularClassName = 'not-selected'
        accountClassName = 'not-selected'
        break
    }

    return (
      <nav className="main-container">
        <div className="nav-container">
          <div className="align-container">
            <Link to="/" className="link">
              <img
                src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665899170/Group_7399_vwxbql.png"
                alt="website logo"
                className="web-site-logo-header"
              />
            </Link>
            <ul className="logo-home-popular-container">
              <Link to="/" className="link">
                <li className={`home-link ${homeClassName}`}>Home</li>
              </Link>
              <Link to="/popular" className="link">
                <li className={`home-link ${popularClassName}`}>Popular</li>
              </Link>
            </ul>
          </div>
          <ul className="logo-home-popular-container">
            {searchRoute ? (
              <div className="searchContainer">
                <input
                  type="search"
                  className="search-input"
                  value={searchValue}
                  onChange={this.getSearchInput}
                  placeholder="Search"
                />
                <button
                  onClick={this.onSearch}
                  type="button"
                  className="search-icon-clicked btn-true"
                  testid="searchButton"
                >
                  <HiOutlineSearch className="search-icon-in-search" />
                </button>
              </div>
            ) : (
              <Link to="/search" className="link">
                <li>
                  <button
                    type="button"
                    className="btn-search"
                    testid="searchButton"
                  >
                    <HiOutlineSearch className="search-icon" />
                  </button>
                </li>
              </Link>
            )}

            <Link to="/account" className="link">
              <li>
                <img
                  src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665994997/Avatar_hzuzbt.png"
                  alt="profile"
                  className="profile"
                />
              </li>
            </Link>
            <li>
              <button
                type="button"
                className="btn-more btn-search"
                onClick={this.onClickMore}
              >
                <CgPlayList className="search-icon" />
              </button>
            </li>
          </ul>
        </div>

        {isMenuClicked && (
          <ul className="more-menu-container">
            <Link to="/" className="link">
              <li className={`more-menu-para ${homeClassName}`}>Home</li>
            </Link>
            <Link to="/popular" className="link">
              <li className={`more-menu-para ${popularClassName}`}>Popular</li>
            </Link>
            <Link to="/account" className="link">
              <li className={`more-menu-para ${accountClassName}`}>Account</li>
            </Link>
            <AiFillCloseCircle
              className="crosser"
              onClick={this.onClickCloseMore}
            />
          </ul>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
