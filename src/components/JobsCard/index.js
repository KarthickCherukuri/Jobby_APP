import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {MdWork} from 'react-icons/md'
import './index.css'

const JobsCard = props => {
  const {data} = props
  const updatedData = {
    id: data.id,
    title: data.title,
    rating: data.rating,
    companyLogoUrl: data.company_logo_url,
    jobDescription: data.job_description,
    employmentType: data.employment_type,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
  }

  return (
    <li className="info-card">
      <Link to={`/jobs/${updatedData.id}`}>
        <div className="header">
          <img
            src={updatedData.companyLogoUrl}
            alt="job details company logo"
            className="logo"
          />
          <div>
            <h1>{updatedData.title}</h1>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <AiFillStar fill="gold" style={{marginRight: '3px'}} />
              <p>{updatedData.rating}</p>
            </div>
          </div>
        </div>
        <div className="sub-header">
          <div className="logo-list">
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ImLocation fill="white" />
              <p>{updatedData.location}</p>
              <MdWork fill="white" style={{marginLeft: '15px'}} />
              <p>{updatedData.employmentType}</p>
            </div>
            <p>{updatedData.packagePerAnnum}</p>
          </div>
          <hr />
          <p>Description</p>
          <p>{updatedData.jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobsCard
