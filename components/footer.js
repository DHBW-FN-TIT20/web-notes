import { withRouter } from 'next/router'
import { Component } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Footer.module.css'
import GitHubIcon from '../public/GitHub.png'
import DevChatIcon from '../public/Dev-Chat.png'

/** 
 * @class Footer Component Class
 * @component
 */
class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /** 
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    return (
      <div>
        <div className={styles.footer}>
          <div className={styles.footerElement}>
            <h4>
              Social Media
            </h4>
            <div className={styles.socialMedia}>
              <Link 
                href={'https://github.com/DHBW-FN-TIT20/web-notes'}
                passHref>
                <div>
                  <Image 
                    src={GitHubIcon} 
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='GitHub Icon'
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Projects
            </h4>
            <div className={styles.socialMedia}>
              <Link 
                href={'https://dev-chat.me'}
                passHref>
                <div>
                  <Image 
                    src={DevChatIcon} 
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='DEV-CHAT Icon'
                    href={'https://dev-chat.me'}
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Contact
            </h4>
            <Link 
              href={"/impressum"}>
              Impressum
            </Link>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Account
            </h4>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Footer)