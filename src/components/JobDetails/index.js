import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {MdWork} from 'react-icons/md'
import {HiExternalLink} from 'react-icons/hi'
import Header from '../Header'
import './index.css'

const updateData = data => ({
  jobDetails: data.job_details,
  similarJobs: data.similar_jobs,
})

const SkillItem = props => {
  const {data} = props
  return (
    <li className="skill-item">
      <img src={data.image_url} alt={data.name} className="skill-logo" />
      <p>{data.name}</p>
    </li>
  )
}

const SimilarJobsItem = props => {
  const {data, click} = props
  return (
    <Link to={`/jobs/${data.id}`} onClick={click}>
      <li className="SimilarJobsItem">
        <div className="header">
          <img
            src={data.company_logo_url}
            alt="similar job company logo"
            className="logo"
          />
          <div>
            <h1>{data.title}</h1>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <AiFillStar fill="gold" style={{marginRight: '3px'}} />
              <p>{data.rating}</p>
            </div>
          </div>
        </div>
        <h1>Description</h1>
        <p>{data.job_description}</p>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ImLocation fill="white" />
          <p>{data.location}</p>
          <MdWork fill="white" style={{marginLeft: '15px'}} />

          <p>{data.employment_type}</p>
        </div>
      </li>
    </Link>
  )
}



class JobDetails extends Component {
  state = {apiStatus: 'loading', data: []}

  getDetail = async () => {
    this.setState({apiStatus: 'loading'})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookie.get('jwt_token')

    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(apiUrl, option)
    const data = await response.json()

    if (response.ok) {
      this.setState({apiStatus: 'Success', data: updateData(data)})
    } else {
      this.setState({apiStatus: 'Failure'})
    }
  }

  componentDidMount = () => {
    this.getDetail()
  }

  renderFailure = () => (
    <div className="JobsDetails-bg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failureImg"
        alt="failure view"
      />
      <h1>OOPS! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for. </p>
      <button
        type="button"
        onClick={this.getDetail}
        className="retry-desktop-btn"
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {data} = this.state
    const {jobDetails} = data
    const {similarJobs} = data

    return (
      <>
        <div className="JobsDetails-bg">
          <div className="info-card-jobDetail">
            <div className="header">
              <img
                src={jobDetails.company_logo_url}
                alt={jobDetails.title}
                className="logo"
              />
              <div>
                <h1>{jobDetails.title}</h1>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <AiFillStar fill="gold" style={{marginRight: '3px'}} />
                  <p>{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="sub-header">
              <div className="logo-list">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <ImLocation fill="white" />
                  <p>{jobDetails.location}</p>
                  <MdWork fill="white" style={{marginLeft: '15px'}} />

                  <p>{jobDetails.employment_type}</p>
                </div>
                <p>{jobDetails.package_per_annum}</p>
              </div>
              <hr />
              <div className="flex-container">
                <h1>Description</h1>
                <a
                  href={jobDetails.company_website_url}
                  style={{color: ' #b6c5ff'}}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit <HiExternalLink fill=" #b6c5ff" />
                </a>
              </div>
              <p>{jobDetails.job_description}</p>
            </div>
            <h1>Skills</h1>
            <ul className="skills-list">
              {jobDetails.skills.map(each => (
                <SkillItem data={each} key={data.name} />
              ))}
            </ul>
            <h1>Life at Company</h1>
            <div className=" flex-mobile flex-container">
              <p>{jobDetails.life_at_company.description}</p>
              <img
                src={jobDetails.life_at_company.image_url}
                alt="lifeAtCompany"
              />
            </div>
          </div>
          <div className="similarjobs-div">
            <h1>Similar Jobs</h1>
            <div>
              <ul className="wrap-container">
                {similarJobs.map(each => (
                  <SimilarJobsItem
                    data={each}
                    key={each.id}
                    click={this.getDetail}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderLoading = () => (
    <div className="JobsDetails-bg">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'Success':
        return this.renderSuccess()
      case 'loading':
        return this.renderLoading()
      case 'Failure':
        return this.renderFailure()
      default:
        return this.renderLoading()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderResult()}
      </>
    )
  }
}

export default JobDetails
