import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobsCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const Filter = props => {
  const {name, onChangeFunction, set, value} = props

  return (
    <li>
      <input
        id={name}
        onChange={onChangeFunction}
        type="radio"
        name={set}
        value={value}
      />
      <label htmlFor={name}>{name}</label>
    </li>
  )
}

class Jobs extends Component {
  state = {
    apiStatus: 'Loading',
    employmentType: '',
    salary: '',
    search: '',
    profileDetails: {},
  }

  changeEmployment = event => {
    this.setState({employmentType: event.target.value}, this.getDetails)
  }

  changeSalary = event => {
    this.setState({salary: event.target.value}, this.getDetails)
  }

  changeSearch = event => {
    console.log(event.key)

    console.log('enter')
    this.setState({search: event.target.value})
  }

  SearchKeyDown = event => {
    if (event.key === 'Enter') {
      this.getDetails()
    }
  }

  getProfile = async jwtToken => {
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      this.setState({profileDetails: data.profile_details})
    }
  }

  getDetails = async () => {
    const {employmentType, salary, search} = this.state
    const jwtToken = Cookie.get('jwt_token')
    this.getProfile(jwtToken)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salary}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({apiStatus: 'Success', data: data.jobs})
      console.log(data)
    } else if (response.status === 401) {
      this.setState({apiStatus: 'Failure'})
    }
  }

  renderSuccess = () => {
    const {data} = this.state
    if (data.length !== 0) {
      return (
        <ul className="jobs-list">
          {data.map(each => (
            <JobCard data={each} key={each.id} />
          ))}
        </ul>
      )
    }

    return (
      <>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </>
    )
  }

  renderFailure = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failureImg"
        alt="failure view"
      />
      <h1>OOPS! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for. </p>
      <button
        type="button"
        onClick={this.getDetails}
        className="retry-desktop-btn"
      >
        Retry
      </button>
    </>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  componentDidMount = () => {
    this.getDetails()
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'Success':
        return this.renderSuccess()
      case 'Loading':
        return this.renderLoading()
      case 'Failure':
        return this.renderFailure()
      default:
        return this.renderFailure()
    }
  }

  renderUser = () => {
    const {profileDetails, apiStatus} = this.state
    if (apiStatus === 'Success') {
      return (
        <div className="userCard">
          <h1>{profileDetails.name}</h1>
          <p>{profileDetails.short_bio}</p>
        </div>
      )
    }
    return (
      <div className="userCard">
        <h1>User Name</h1>
        <p>Lead software developer and AI-Ml Expret</p>
      </div>
    )
  }

  render() {
    const {search} = this.state

    return (
      <>
        <Header />

        <div className="info">
          <div className="sideBar">
            <div className="miniSearchBar">
              <input
                type="search"
                className="searchBarMini searchBar"
                placeholder="Search"
                onChange={this.changeSearch}
                onKeyDown={this.SearchKeyDown}
                value={search}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon"
                onClick={this.getDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderUser()}
            <hr />
            <div className="filters">
              <p>Type of Employment</p>
              <ul>
                {employmentTypesList.map(each => (
                  <Filter
                    name={each.label}
                    onChangeFunction={this.changeEmployment}
                    value={each.employmentTypeId}
                    key={each.employmentTypeId}
                    set="employment"
                  />
                ))}
              </ul>
              <hr />
              <p>Salary Range</p>
              <ul>
                {salaryRangesList.map(each => (
                  <Filter
                    name={each.label}
                    onChangeFunction={this.changeSalary}
                    value={each.salaryRangeId}
                    key={each.salaryRangeId}
                    set="Salary"
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="information">
            <div className="SearchBar">
              <input
                type="search"
                className="searchBar"
                placeholder="Search"
                onChange={this.changeSearch}
                onKeyDown={this.SearchKeyDown}
                value={search}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon"
                onClick={this.getDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderResult()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
