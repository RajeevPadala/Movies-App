import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Popular from './components/Popular'
import MovieContext from './context/MovieContext'
import MovieItemDetails from './components/MovieItemDetails'
import Search from './components/Search'
import Account from './components/Account'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {username: '', password: ''}

  triggerChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  triggerChangePassword = event => {
    this.setState({password: event.target.value})
  }

  triggerLogout = props => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
    this.setState({username: '', password: ''})
  }

  render() {
    const {username, password} = this.state

    return (
      <MovieContext.Provider
        value={{
          username,
          password,
          triggerChangeUsername: this.triggerChangeUsername,
          triggerChangePassword: this.triggerChangePassword,
          triggerLogout: this.triggerLogout,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/account" component={Account} />
          <ProtectedRoute exact path="/popular" component={Popular} />
          <ProtectedRoute exact path="/search" component={Search} />
          <ProtectedRoute
            exact
            path="/movies/:id"
            component={MovieItemDetails}
          />

          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </MovieContext.Provider>
    )
  }
}

export default App
