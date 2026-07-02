import React from 'react'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import TwitterIcon from '@mui/icons-material/Twitter'

const footerData = [
  {
    title: 'Support',
    links: [
      'Help Center',
      'Safety information',
      'Cancellation options',
      'Our COVID-19 Response',
      'Supporting people with disabilities',
      'Report a neighbourhood concern',
    ],
  },
  {
    title: 'Community',
    links: [
      'Airbnb.org: disaster relief housing',
      'Support: Afghan refugees',
      'Celebrating diversity & belonging',
      'Combating discrimination',
    ],
  },
  {
    title: 'Hosting',
    links: [
      'Try hosting',
      'AirCover: protection for Hosts',
      'Explore hosting resources',
      'Visit our community forum',
      'How to host responsibly',
    ],
  },
  {
    title: 'About',
    links: [
      'Newsroom',
      'Learn about new features',
      'Letter from our founders',
      'Careers',
      'Investors',
      'Airbnb Luxe',
    ],
  },
]

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_links">
        {footerData.map((section) => (
          <div className="footer_section" key={section.title}>
            <h3>{section.title}</h3>
            <ul>
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer_copyright">
        <p>© 2022 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
        <div className="footer_meta">
          <a href="#" aria-label="Language">
            <LanguageRoundedIcon />
          </a>
          <a href="#">English (US)</a>
          <a href="#">$ USD</a>
          <a href="#" aria-label="Facebook">
            <FacebookRoundedIcon />
          </a>
          <a href="#" aria-label="Twitter">
            <TwitterIcon />
          </a>
          <a href="#" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
