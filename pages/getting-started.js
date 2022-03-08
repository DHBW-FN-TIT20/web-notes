// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import SavingIndicator from '../components/SavingIndicator'
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode, TextField, KTP_FULL_PREFIX, ShimmeredDetailsList } from '@fluentui/react';
import splitHTMLintoElements from '../shared/split_HTML_into_elements'

/**
 * @class Getting Started Component Class
 * @component
 */
class GettingStarted extends Component {
  constructor(props) {
    super(props)
    this.state = {
    };
    this.linkToDHBW = "https://www.ravensburg.dhbw.de/startseite";
    this.linkToTIT20 = "https://github.com/DHBW-FN-TIT20"
  }  /**
   * This method is called when the component is mounted.
   */
  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method is called just bevor the component is unmounted.
   * It is used to remove the storage event listener.
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
      this.setState({ isLoggedIn: true, currentToken: currentToken });
    } else {
      this.setState({ isLoggedIn: false })
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {

    const { router } = this.props


    return (
      <div>
        <Head>
          <title>Willkommen bei WEB-NOTES</title>
          <meta name="description" content="Welcome page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} hideGettingStarted={true}/>
        </header>

        <main>
          <h1>Willkommen bei WEB-NOTES!</h1>
          <p>
            Hier kannst du Notizen erstellen, bearbeiten und mit anderen Teilen.
            Du kannst dir&nbsp;
                <a onClick={() => router.push("/register")}>
                  hier
                </a> kostenlos einen Account erstellen und direkt loslegen!
          </p>
          <p>
            Die Bearbeitung der Notizen erfolgt komplett in deinem Browser und deine Änderungen werden automatisch gespeichert. Du kannst deine Notizen außerdem formatieren und als PDF-Dokument exportieren.
          </p>
          <p>
            Starte jetzt und teile deine Notizen mit deinen Freunden oder Familie.
          </p>
          <br/>
          <p>
            Die Entwicklung der Web-App war ein Projekt im Rahmen der Informatik Vorlesung Web-Engineering an der <a href={this.linkToDHBW}>Dualen Hochschule Baden-Württemberg Campus Friedrichshafen</a> und wurde von Studenten des Kurses <a href={this.linkToTIT20}>TIT20</a> durchgeführt.
          </p>
        </main>
      </div>
    )

    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>WEB-NOTES</title>
            <meta name="description" content="Welcome page." />
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
            <title>WEB-NOTES</title>
            <meta name="description" content="Welcome page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.contentOne}>
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

export default withRouter(GettingStarted)
