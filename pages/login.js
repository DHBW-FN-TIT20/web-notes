// @ts-check
import withRouter from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Login.module.css'
import Header from '../components/header'
import Footer from '../components/footer'

/**
 * @class Login Component Class
 * @component
 */
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
      username: "",
      password: "",
      credentialsInfo: false,
    }

  }

  /**
   * This method is called when the component is mounted.
   */
  componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method is called when the component will unmout.
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it verifys the token and routes to root on success.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event) => {
    if (event.key === FrontEndController.userTokenName) {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If valid, it routes to root, if not, the isNotLoggedIn state is set to true.
   */
  async checkLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      const { router } = this.props
      router.push("/")
    } else {
      this.setState({ isNotLoggedIn: true })
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns {JSX.Element} JSX Output
   */
  render() {
    /**
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    /**
     * This method checks for enter key press in event and calls the loginVerification method.
     * @param {any} event Button-Press event
     */
    const loginEnter = async (event) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        loginVerification();
      }
    }

    /**
     * This method logs the user in with the currently entered credentials. If the login was successfull, it routes to root, else all fields are cleared.
     */
    const loginVerification = async () => {
      if (await FrontEndController.loginUser(this.state.username, this.state.password)) {
        router.push("/");
      } else {
        this.setState({ username: "", password: "", credentialsInfo: true })
        document.getElementById("userInput")?.focus()
      }
    }

    if (this.state.isNotLoggedIn) {
      return (
        <div>
          <Head>
            <title>Login</title>
            <meta name="description" content="Login" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>

          <div className="scrollBody">
            <main className={styles.field}>
              <div className={styles.fieldDiv}>
                <h1>Login</h1>
                <input
                  type="text"
                  placeholder="Benutzername..."
                  id='userInput'
                  className='formularInput'
                  autoFocus
                  onChange={(e) => this.setState({ username: e.target.value })}
                  value={this.state.username}
                  onKeyDown={loginEnter} />
                <input
                  type="password"
                  placeholder="Passwort..."
                  className='formularInput'
                  onChange={(e) => this.setState({ password: e.target.value })}
                  value={this.state.password}
                  onKeyDown={loginEnter} />
                <div hidden={!this.state.credentialsInfo} className={styles.error} >
                  Ungültige Anmeldedaten!
                </div>
                <button onClick={loginVerification}>
                  Login
                </button>
                <p>
                  Oder stattdessen&nbsp;
                  <a onClick={() => router.push("/register")}>
                    registrieren
                  </a>
                </p>
              </div>
            </main>

            <footer>
              <Footer isLoggedIn={!this.state.isNotLoggedIn} />
            </footer>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Login</title>
            <meta name="description" content="Login" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Login)
