// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Impressum.module.css'
import Header from '../components/header'
import Footer from '../components/footer'

/**
 * @class Impressum Component Class
 * @component
 */
class Impressum extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
    }
  }

  /**
   * This method is called when the component is mounted.
   */
  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
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
  async storageTokenListener(event) {
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   */
  async updateLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
      return
    }
    this.setState({ isLoggedIn: false })
  }

  /**
   * Generates the JSX Output for the Client
   * @returns {JSX.Element} JSX Output
   */
  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>Impressum</title>
            <meta name="description" content="Impressum" />
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
            <title>Impressum</title>
            <meta name="description" content="Impressum" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.content}>
                <h1>Impressum</h1>

                <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
                <p>Johannes Brandenburger<br />
                  Kirchstr. 16<br />
                  88512 Mengen</p>

                <h2>Kontakt</h2>
                <p>Telefon: +49 152 25366286<br />
                  E-Mail: johannes@brandenburger.dev</p>
              </div>
            </main>

            <footer>
              <Footer isLoggedIn={this.state.isLoggedIn} />
            </footer>
          </div>
        </div>
      )
    }
  }
}

export default Impressum
