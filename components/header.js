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

    let home;

    if (this.props.hideLogout) {
      home = <div></div>
    } 
    if (this.props.hideLogin) {
      home =  <Link href={'/'} passHref>
        <div className={styles.nav}>
          <span>
            Home
          </span>
        </div>
      </Link>
    }

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
                  // rotation elements for menu icon
                  document.getElementById("spanOne").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.remove(`${styles.span}`)
                  document.getElementById("spanThree").classList.remove(`${styles.spanThree}`)
                  console.log(document.documentElement.scrollHeight)
                  this.isVisible = false;
                } else {
                  console.log("Show")
                  document.getElementById("menu").classList.add(`${styles.showHeader}`)
                  // rotation elements for menu icon
                  document.getElementById("spanOne").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.add(`${styles.span}`)
                  document.getElementById("spanThree").classList.add(`${styles.spanThree}`)
                  this.isVisible = true;
                }
                console.log()
              }}>
              <span id="spanOne"></span>
              <span id="spanTwo"></span>
              <span id="spanThree"></span>
            </div>
            <div className={styles.logoSchrift}>
              <Image 
                onClick={() => { router.push('/') }}
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
                  onClick={() => { router.push('/') }}
                  src={Logo}
                  alt='Logo_Schrift_Weiss.png missing.'
                  objectFit='contain'
                  sizes='fitContent'
                  layout="fill">
                </Image>
              </div>
              <div className={styles.navLogoSchrift}>
                  <Image 
                    onClick={() => { router.push('/') }}
                    src={LogoSchrift}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
              </div>
             {home}
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