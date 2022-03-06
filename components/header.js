// @ts-check
import { withRouter } from 'next/router'
import { Component } from 'react'
import styles from '../styles/Header.module.css'
import { FrontEndController } from '../controller/frontEndController'

/** 
 * @class Header Component Class
 * @component
 */
class Header extends Component {
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
      username = <></>
    } else {
      username = <td 
                  className={styles.td_right && styles.nav}
                  onClick={() => router.push("/profile")}
                >
                  {this.props.username}
                </td>
    }

    let loginButton;

    if (this.props.hideLogin) {
      loginButton = <></>
    } else {
      loginButton = <td className={styles.td_right}>
                      <button 
                        onClick={() => router.push("/login")
                      }>
                        Login
                      </button>
                    </td>
    }

    let logoutButton;

    if (this.props.hideLogout) {
      logoutButton = <></>
    } else {
      logoutButton = <td className={styles.td_right}>
                      <button
                        onClick={() => {
                          FrontEndController.logoutUser();
                          location.reload();
                        }
                      }>
                        Logout
                      </button>  
                    </td>
    }

    return (
      <div>
        <table className={styles.table}>
          <tbody>
            <tr>
                <td 
                  className={styles.td_left && styles.nav} 
                  onClick={() => router.push("/")}
                >
                  Home
                </td>
                <td
                  className={styles.td_left && styles.nav}
                  onClick={() => router.push("/impressum")}
                >
                  Impressum
                </td>
                <td className={styles.td_space}></td>
                { username }
                { loginButton }
                { logoutButton }
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(Header);