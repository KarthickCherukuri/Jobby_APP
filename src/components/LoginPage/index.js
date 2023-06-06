import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginPage extends Component {
  state = {message: '', username: '', password: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    console.log()
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})
      const {history} = this.props
      history.replace('/')
    } else if (response.status === 400) {
      this.setState({message: data.error_msg})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, message} = this.state
    return (
      <div className="bg">
        <form onSubmit={this.onSubmit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="box">
            <label htmlFor="username">USERNAME</label>
            <br />
            <input
              type="text"
              id="username"
              onChange={this.onChangeUsername}
              value={username}
            />
            <br />
            <label htmlFor="password">PASSWORD</label>
            <br />
            <input
              type="password"
              id="password"
              onChange={this.onChangePassword}
              value={password}
            />
            <button type="submit">Login</button>
            <p className="error-message">{message}</p>
          </div>
        </form>
      </div>
    )
  }
}

export default LoginPage
