import withRouter from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontendController } from '../controller'
import styles from '../styles/Profile.module.css'
import Header from '../components/header'
import Footer from '../components/footer'

/**
 * @class Home Component Class
 * @component
 */
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      currentUser: undefined,
    }
  }

  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ currentUser: await FrontendController.getIUserFromToken(FrontendController.getUserToken()) });
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event) => {
    if (event.key === FrontendController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    let currentToken = FrontendController.getUserToken();
    if (await FrontendController.verifyUserByToken(currentToken)) {
      this.setState({isLoggedIn: true, currentToken: currentToken})
    } else {
      const { router } = this.props
      router.push("/login")
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
          <title>Profile</title>
          <meta name="description" content="Profile page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>
        </div>
      )
    } else {

      let getAccessString = (accessLevel) => {
        switch (accessLevel) {
          case 0:
            return "User";
          case 1:
            return "Admin";
          default:
            return "unavailable";
        }
      }

      return (
        <div>
          <Head>
            <title>Profile</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontendController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.content}>
              <h1>User: {FrontendController.getUsernameFromToken(FrontendController.getUserToken())}</h1>
              <h2>Information</h2>
              <table>
                <thead>
                  <tr>
                    <td>ID:</td> 
                    <td>{this.state.currentUser?.id || "unavailable"}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access Level:</td>
                    <td>{getAccessString(this.state.currentUser?.accessLevel)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>

          <footer>
            <Footer />
          </footer>
        </div>
      )
    }
  }
}

export default withRouter(Profile)
