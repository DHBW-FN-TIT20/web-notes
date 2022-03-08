// @ts-check
import { withRouter } from 'next/router'
import { Component } from 'react'
import styles from '../styles/Header.module.css'
import { FrontEndController } from '../controller/frontEndController'
import Link from 'next/link';
import Image from 'next/image';
// @ts-ignore
import Logo from '../public/Logo.png'
// @ts-ignore
import LogoSchrift from '../public/Logo_Schrift_Weiss.png'

/** 
 * @class Header Component Class
 * @component
 */
class Header extends Component {
  isVisible = false;
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /** 
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props;

    let username;

    if (this.props.hideLogout) {
      username = <div></div>
    } else {
      username = <Link href={'/profile'} passHref>
        <div className={styles.nav}>
          <span>
            {this.props.username}
          </span>
        </div>
      </Link>
    }

    let loginButton;

    if (this.props.hideLogin) {
      loginButton = <></>
    } else {
      loginButton = <Link href={'/login'} passHref>
        <button>
          Login
        </button>
      </Link>
    }

    let logoutButton;

    if (this.props.hideLogout) {
      logoutButton = <></>
    } else {
      logoutButton = <>
        <button
          onClick={() => {
            FrontEndController.logoutUser();
            location.reload();
          }
          }>
          Logout
        </button>
      </>
    }

    return (
      <div>
        <nav role="navigation">

        </nav>
        <nav>
          <div className={styles.navBar}>
            <div
              className={`${styles.navElement} ${styles.menuIcon}`}
              id={styles.menuIcon}
              onClick={() => {
                if (this.isVisible) {
                  console.log("Hide")
                  document.getElementById("menu").classList.remove(`${styles.showHeader}`)
                  //document.getElementById("menu").style.transform = "translate(-100%, 0)";
                  console.log(document.documentElement.scrollHeight)
                  this.isVisible = false;
                } else {
                  console.log("Show")
                  document.getElementById("menu").classList.add(`${styles.showHeader}`)
                  //document.getElementById("menu").style.transform = "none";
                  this.isVisible = true;
                }
                console.log()
              }}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.logoSchrift}>
              <Image 
                src={LogoSchrift}
                alt='Logo_Schrift_Weiss.png missing.'
                objectFit='contain'
                sizes='fitContent'
                layout="fill">
              </Image>
            </div>
            <div
              className={styles.menu}
              id="menu">
              <div className={styles.navLogo}>
                <Image 
                  src={Logo}
                  alt='Logo_Schrift_Weiss.png missing.'
                  objectFit='contain'
                  sizes='fitContent'
                  layout="fill">
                </Image>
              </div>
              <div className={styles.navLogoSchrift}>
                  <Image 
                    src={LogoSchrift}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
              </div>
              <Link href={'/'} passHref>
                <div className={styles.nav}>
                  <span>
                    Home
                  </span>
                </div>
              </Link>
              <Link href={'/getting-started'} passHref>
                <div className={styles.nav}>
                  <span>
                    Getting Started
                  </span>
                </div>
              </Link>
              <Link href={'/impressum'} passHref>
                <div className={styles.nav}>
                  <span>
                    Impressum
                  </span>
                </div>
              </Link>
              <div className={styles.pcSpacing}>
                {/* Spacing for View */}
              </div>
              {username}
              <div className={styles.mobileSpacing}>
                {/* Spacing for View */}
              </div>
              <div className={`${styles.nav} ${styles.button}`}>
                {loginButton}
                {logoutButton}
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default withRouter(Header);