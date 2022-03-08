// @ts-check
import withRouter from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Register.module.css'
import Header from '../components/header'
import Footer from '../components/footer'

/**
 * @class Register Component Class
 * @component
 */
class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
      username: "",
      password: "",
      confirmPassword: "",
      usernameReqMessage: "",
      passwordReqMessage: "",
      doesUserExist: false,
      feedbackMessage: "",
      showRequirements: false,
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
   * This method is called when the component will unmount.
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
   * This method checks whether the entered password meets the needed requirements and sets the passwordReqMessage state accordingly.
   */
  async updatePasswordValid(password) {
    if (await FrontEndController.isPasswordValid(password)) {
      this.setState({ passwordReqMessage: "" })
    } else {
      this.setState({ passwordReqMessage: "check password requirements" })
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

    /**
     * This method checks for enter key press in event and calls the registerVerification method.
     * @param {any} event Button-Press event
     */
    const registerEnter = async (event) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        registerVerification();
      }
    }

    /**
     * This method registers the user with the currently entered credentials. If the registration was successfull, it routes to root, else all fields are cleared.
     */
    const registerVerification = async () => {
      if (this.state.password === this.state.confirmPassword && this.state.usernameReqMessage === "" && this.state.passwordReqMessage === "") {
        if (await FrontEndController.registerUser(this.state.username, this.state.password)) {
          router.push("/");
        }
        this.setState({ username: "", password: "", confirmPassword: "" });
        document.getElementById("userInput")?.focus();
      }
    }

    /**
     * This method checks whether the entered username meets the needed requirements and sets the usernameReqMessage state accordingly.
     */
    const updateUsernameValid = async () => {
      if (await FrontEndController.isUsernameValid(this.state.username)) {
        this.setState({ usernameReqMessage: "" })
      } else {
        this.setState({ usernameReqMessage: "check username requirements" })
      }
    }

    /**
     * This method updates the feedback message for the entered username and password.
     */
    const updateFeedbackMessage = async (doesExist, password, confirmPassword) => {
      if (doesExist) {
        this.setState({ feedbackMessage: "Username not available." })
      } else if (password !== undefined && password !== confirmPassword) {
        this.setState({ feedbackMessage: "Passwords do not match." })
      } else {
        this.setState({ feedbackMessage: "" })
      }
    }

    if (this.state.isNotLoggedIn) {
      return (
        <div>
          <Head>
            <title>Register</title>
            <meta name="description" content="Register page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={""} hideLogin={false} hideLogout={true} />
          </header>

          <div className="scrollBody">
            <main className={styles.field}>
              <div className={styles.fieldDiv}>
                <h1>Register</h1>
                <input
                  type="text"
                  placeholder="Username..."
                  id='userInput'
                  className='formularInput'
                  autoFocus
                  onChange={async (e) => {
                    this.setState({ username: e.target.value });
                    this.setState({ doesUserExist: await FrontEndController.doesUserExist(e.target.value) });
                    updateFeedbackMessage(this.state.doesUserExist, this.state.password, this.state.confirmPassword);
                    updateUsernameValid();
                  }}
                  value={this.state.username}
                  onKeyDown={registerEnter} />
                <div hidden={this.state.usernameReqMessage === ""} className={styles.inputRequirements}>
                  {this.state.usernameReqMessage}
                </div>
                <input
                  type="password"
                  placeholder="Password..."
                  className='formularInput'
                  onChange={async (e) => {
                    this.setState({ password: e.target.value });
                    updateFeedbackMessage(this.state.doesUserExist, e.target.value, this.state.confirmPassword);
                    console.log(e.target.value)
                    this.updatePasswordValid(e.target.value);
                  }}
                  value={this.state.password}
                  onKeyDown={registerEnter} />
                <div hidden={this.state.passwordReqMessage === ""} className={styles.inputRequirements}>
                  {this.state.passwordReqMessage}
                </div>
                <input
                  type="password"
                  placeholder="Confirm password..."
                  className='formularInput'
                  onChange={async (e) => {
                    this.setState({ confirmPassword: e.target.value });
                    updateFeedbackMessage(this.state.doesUserExist, this.state.password, e.target.value);
                  }}
                  value={this.state.confirmPassword}
                  onKeyDown={registerEnter} />
                <div hidden={this.state.feedbackMessage === ""} className={styles.error} >
                  {this.state.feedbackMessage}
                </div>
                <button onClick={async () => {
                  registerVerification()
                }}>
                  Register
                </button>
                <div className={styles.flexBox}>
                  <p className={styles.loginInstead}>
                    Or&nbsp;
                    <a onClick={() => { router.push("/login") }}>
                      login
                    </a>
                    &nbsp;instead.
                  </p>
                  <p className={styles.showReq}>
                    <a onClick={() => { this.setState({ showRequirements: !this.state.showRequirements }) }}>
                      show requirements
                    </a>
                  </p>
                </div>
              </div>
              <div hidden={!this.state.showRequirements} className={styles.requirementsDiv}>
                <h2>Username</h2>
                <ul>
                  <li>4-16 characters</li>
                  <li>only letters and numbers</li>
                  <li>keyword &ldquo;admin&ldquo; is not allowed</li>
                </ul>
                <h2>Password</h2>
                <ul>
                  <li>min. 8 characters</li>
                  <li>min. 1 number, 1 lowercase, 1 uppercase</li>
                  <li>min. 1 of: ! * # , ; ? + - _ . = ~ ^ % ( ) &#123; &#125; | : &ldquo; /</li>
                </ul>
              </div>
            </main>

            <footer>
              <Footer />
            </footer>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Register</title>
            <meta name="description" content="Register page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Register)
