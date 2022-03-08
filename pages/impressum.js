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
      return
    }
    this.setState({ isLoggedIn: false })
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
            <title>Impressum</title>
            <meta name="description" content="Impressum page." />
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
            <meta name="description" content="Impressum page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.content}>
                <h1>Impressum</h1>
                <h2>Verantwortlich</h2>
                <p>Dummy</p>
                <h2>Kontakt</h2>
                <p>
                  Dummy <br />
                  Fallenbrunnen 2 <br />
                  Friedrichshafen <br />
                  <br />
                  Telefon: &#43;49 1234 56789 <br />
                  E-Mail: test&#64;outlook.de <br />
                </p>
              </div>
            </main>

            <footer>
              <Footer />
            </footer>
          </div>
        </div>
      )
    }
  }
}

export default Impressum
