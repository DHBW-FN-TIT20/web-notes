// @ts-check
import withRouter from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Profile.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { checkPasswordOnRegex } from '../shared/check_password_regex'

/**
 * @class Profile Component Class
 * @component
 */
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      currentUser: undefined,
      showRequirements: false,
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      isInputValidForChangePassword: false,
      passwordReqMessage: "",
      updatedPasswordMessage: ""
    }
  }

  /**
   * This method is called when the component is mounted.
   */
  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ currentUser: await FrontEndController.getUserFromToken(FrontEndController.getUserToken()) });
  }

  /** 
   * This method is called when the component will unmount.
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event) => {
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
    } else {
      const { router } = this.props
      router.push("/login")
    }
  }

  /**
   * This method is used to handle the event when the user clicks on the change password button.
   * It triggers the changePassword method of the FrontEndController.
   */
  changePassword = async () => {
    const changedPasswordSuccessfully = await FrontEndController.changePassword(this.state.oldPassword, this.state.newPassword);

    if (!changedPasswordSuccessfully) {
      this.setState({ isInputValidForChangePassword: false, passwordReqMessage: "Incorrect old password.", oldPassword: "", newPassword: "", newPasswordConfirm: "" });
    } else {
      this.setState({ isInputValidForChangePassword: false, passwordReqMessage: "", oldPassword: "", newPassword: "", newPasswordConfirm: "", updatedPasswordMessage: "Password changed successfully." });
    }
  }

  /**
   * This function is used to handle the user input. 
   * It evaluates the input and sets the feedback state accordingly.
   * @param {any} event the change event
   */
  changedInput = async (event) => {

    // get all input values
    const oldPassword = event.target.name === "oldPassword" ? event.target.value : this.state.oldPassword;
    const newPassword = event.target.name === "newPassword" ? event.target.value : this.state.newPassword;
    const newPasswordConfirm = event.target.name === "newPasswordConfirm" ? event.target.value : this.state.newPasswordConfirm;

    let isInputValidForChangePassword = false;
    let passwordReqMessage = "";

    // evaluate input values and set the feedback
    if (oldPassword.length > 0 && newPassword.length > 0 && checkPasswordOnRegex(newPassword) !== "") {
      passwordReqMessage = "Das Passwort erfüllt die Anforderungen nicht.";
    }
    if (oldPassword.length > 0 && newPassword.length > 0 && newPasswordConfirm.length > 0) {
      if (checkPasswordOnRegex(newPassword) !== "") {
        passwordReqMessage = "Das Passwort erfüllt die Anforderungen nicht.";
      } else if (newPassword === newPasswordConfirm) {
        isInputValidForChangePassword = true;
      } else {
        isInputValidForChangePassword = false;
        passwordReqMessage = "Die Passwörter stimmen nicht überein.";
      }
    } else {
      isInputValidForChangePassword = false;
      // passwordReqMessage = "Bitte füllen Sie alle Felder aus.";
    }

    // apply the feedback and the input values to the state
    this.setState({ [event.target.name]: event.target.value, isInputValidForChangePassword: isInputValidForChangePassword, passwordReqMessage: passwordReqMessage, updatedPasswordMessage: "" });
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
      return (
        <div>
          <Head>
            <title>Profile</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.content}>
              <h1>Username: {FrontEndController.getUsernameFromToken(FrontEndController.getUserToken())}</h1>
              {/* <h2>Information</h2>
                <table>
                  <thead>
                    <tr>
                      <td>ID:</td>
                      <td>{this.state.currentUser?.id || "unavailable"}</td>
                    </tr>
                  </thead>
                </table> */}

              <div>
                <h2>Passwort ändern</h2>
                <div className={styles.fieldDiv}>
                  <label className={styles.fieldLabel}>Altes Passwort:</label>
                  <input className={styles.fieldInput} type="password" name="oldPassword" onChange={this.changedInput} value={this.state.oldPassword} />
                  <label className={styles.fieldLabel}>Neues Passwort:</label>
                  <input className={styles.fieldInput} type="password" name="newPassword" onChange={this.changedInput} value={this.state.newPassword} />
                  <label className={styles.fieldLabel}>Neues Passwort wiederholen:</label>
                  <input className={styles.fieldInput} type="password" name="newPasswordConfirm" onChange={this.changedInput} value={this.state.newPasswordConfirm} />
                  <div hidden={this.state.passwordReqMessage === ""} className={styles.inputRequirements}>
                    {this.state.passwordReqMessage}
                  </div>
                  <button disabled={!this.state.isInputValidForChangePassword} onClick={this.changePassword}>Passwort ändern</button>

                  <p className={styles.showReq}>
                    <a onClick={() => { this.setState({ showRequirements: !this.state.showRequirements }) }}>
                      show requirements
                    </a>
                  </p>

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
                  <p hidden={this.state.updatedPasswordMessage === ""}>{this.state.updatedPasswordMessage}</p>
                </div>

              </div>

            </div>
          </main >

          <footer>
            <Footer />
          </footer>
        </div >
      )
    }
  }
}

export default withRouter(Profile)
