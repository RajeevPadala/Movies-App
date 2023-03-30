import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import MovieContext from '../../context/MovieContext'

import './index.css'

class Login extends Component {
  state = {errorMsg: '', isErrorMsg: false}

  render() {
    return (
      <MovieContext.Consumer>
        {value => {
          const {
            username,
            password,
            triggerChangeUsername,
            triggerChangePassword,
          } = value
          const onChangeUsername = event => {
            triggerChangeUsername(event)
          }

          const onChangePassword = event => {
            triggerChangePassword(event)
          }
          const onSubmitSuccess = jwtToken => {
            const {history} = this.props

            Cookies.set('jwt_token', jwtToken, {
              expires: 30,
              path: '/',
            })
            history.replace('/')
          }

          const onSubmitFailure = errorMsg => {
            this.setState({errorMsg, isErrorMsg: true})
          }

          const onSubmitForm = async event => {
            event.preventDefault()

            const url = 'https://apis.ccbp.in/login'
            const userDetails = {
              username,
              password,
            }
            const options = {
              method: 'POST',
              body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data = await response.json()

            if (response.ok === true) {
              onSubmitSuccess(data.jwt_token)
            } else {
              onSubmitFailure(data.error_msg)
            }
          }

          const {isErrorMsg, errorMsg} = this.state

          const jwtToken = Cookies.get('jwt_token')
          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }

          return (
            <div className="login-container">
              <img
                src="https://res.cloudinary.com/duv0mhzrm/image/upload/v1665899170/Group_7399_vwxbql.png"
                alt="login website logo"
                className="web-site-logo"
              />
              <div className="login-form-container">
                <h1 className="login-heading">Login</h1>
                <form className="form" onSubmit={onSubmitForm}>
                  <label className="label-login" htmlFor="username">
                    USERNAME
                  </label>
                  <input
                    id="username"
                    className="login-input-user-name"
                    type="text"
                    value={username}
                    onChange={onChangeUsername}
                  />
                  <label className="label-login-password" htmlFor="password">
                    PASSWORD
                  </label>
                  <input
                    id="password"
                    value={password}
                    onChange={onChangePassword}
                    className="login-input-user-name"
                    type="password"
                  />
                  {isErrorMsg && <p className="error-msg-para">{errorMsg}</p>}
                  <button type="submit" className="sign-in-button">
                    Login
                  </button>
                </form>
              </div>
            </div>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default Login
