import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="para-container-contact-us">
    <div className="footer-container">
      <FaGoogle className="google-icon" />
      <FaTwitter className="google-icon" />
      <FaInstagram className="google-icon" />
      <FaYoutube className="you-tube-icon" />
    </div>
    <p className="contact-us-para">Contact us</p>
  </div>
)

export default Footer
