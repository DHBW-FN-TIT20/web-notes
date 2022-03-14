// @ts-check
import { Component } from 'react'
import styles from './Header.module.css'
import { FrontEndController } from '../controller/frontEndController'
import Link from 'next/link';
import Image from 'next/image';
// @ts-ignore
import Logo from '../public/Logo.png'
// @ts-ignore
import LogoName from '../public/Logo_Schrift_Weiss.png'

/** 
 * @class Header Component Class
 * @component
 * @category Components
 */
export class Header extends Component {
  isVisible = false;
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    // Nav-Bar element for note list
    let notes;

    if (this.props.hideLogout) {
      notes = <div></div>
    } else {
      notes = <Link href={'/'} passHref>
        <div className={styles.nav}>
          <span>
            Notizen
          </span>
        </div>
      </Link>
    }

    // Nav-Bar element for profile
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

    // Nav-Bar element for login
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

    // Nav-Bar element for logout
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
        <nav>
          <div className={styles.navBar}>
            {/* Menu Icon for mobile device view */}
            <div
              className={`${styles.navElement} ${styles.menuIcon}`}
              id={styles.menuIcon}
              onClick={() => {
                if (this.isVisible) {
                  // slide side-nav to the left (hide)
                  document.getElementById("menu").classList.remove(`${styles.showHeader}`)
                  // rotate spans for menu icon (parallel lines)
                  document.getElementById("spanOne").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.remove(`${styles.span}`)
                  document.getElementById("spanThree").classList.remove(`${styles.spanThree}`)
                  this.isVisible = false;
                } else {
                  // slide side-nav to the right (view)
                  document.getElementById("menu").classList.add(`${styles.showHeader}`)
                  // rotate spans for menu close icon (x)
                  document.getElementById("spanOne").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.add(`${styles.span}`)
                  document.getElementById("spanThree").classList.add(`${styles.spanThree}`)
                  this.isVisible = true;
                }
              }}>
              {/* Three bars that make up the menu-icon */}
              <span id="spanOne"></span>
              <span id="spanTwo"></span>
              <span id="spanThree"></span>
            </div>
            {/* Logo for Top-Nav-Bar in mobile view */}
            <Link href={'/'} passHref>
              <div className={styles.logoName}>
                <Image
                  src={LogoName}
                  alt='Logo_Schrift_Weiss.png missing.'
                  objectFit='contain'
                  sizes='fitContent'
                  layout="fill">
                </Image>
              </div>
            </Link>
            {/* Nav-Bar elements (top and left-side) */}
            <div
              className={styles.menu}
              id="menu">
              <Link href={'/'} passHref>
                <div className={styles.navLogo}>
                  <Image
                    src={Logo}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
                </div>
              </Link>
              <Link href={'/'} passHref>
                <div className={styles.navLogoName}>
                  <Image
                    src={LogoName}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
                </div>
              </Link>
              {notes}
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
                {/* Spacing for PC (top bar) View */}
              </div>
              {username}
              <div className={styles.mobileSpacing}>
                {/* Spacing for Mobile (side bar) View */}
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