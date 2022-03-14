// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/GettingStarted.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import Link from 'next/link'

/**
 * Getting Started Component Class
 * @component
 * @category Pages
 */
class GettingStarted extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
    };
    this.linkToDHBW = "https://www.ravensburg.dhbw.de/startseite";
    this.linkToTIT20 = "https://github.com/DHBW-FN-TIT20"
  }

  /**
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
      this.setState({ isLoggedIn: true, currentToken: currentToken });
    } else {
      this.setState({ isLoggedIn: false })
    }
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
            <title>Willkommen bei WEB-NOTES</title>
            <meta name="description" content="Getting-Started" />
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
            <title>Willkommen bei WEB-NOTES</title>
            <meta name="description" content="Getting-Started" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} hideGettingStarted={true} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.content}>
                <h1>Willkommen bei WebNotes!</h1>
                <div>
                  Mit WebNotes kannst du Notizen erstellen, bearbeiten und mit anderen Nutzern Teilen. <br />
                  <br />
                  Die Bearbeitung der Notizen erfolgt komplett in deinem Browser und deine Änderungen werden automatisch gespeichert. Du kannst deine Notizen außerdem formatieren und als PDF-Dokument exportieren.<br />
                  <br />
                  Starte jetzt und teile deine Notizen mit deinen Freunden oder deiner Familie.<br />
                  <br />
                  Du kannst dir <Link href={'/register'}>hier</Link> kostenlos einen Account erstellen und direkt loslegen!
                </div>
              </div>
              <div className={styles.content}>
                <h1>Getting started</h1>
                <div className={styles.contentSection}>
                  <h2>Übersicht</h2>
                  <ol>
                    <li><Link href="#createAccount">Account erstellen</Link></li>
                    <li><Link href="#createNote">Notiz erstellen</Link></li>
                    <li><Link href="#editNote">Notiz bearbeiten</Link></li>
                    <li><Link href="#shareNote">Notiz teilen</Link></li>
                  </ol>
                </div>

                <div className={styles.contentSection} id="createAccount">
                  <h2>1. Account erstellen</h2>
                  <div>
                    <ul>
                      <li>Klicke in dem Navigationsmenü auf den &quot;Login&quot; Knopf.</li>
                      <li>Klicke auf den &quot;registrieren&quot; Link unterhalb der Eingabefelder.</li>
                      <li>Fülle das angezeigte Formular aus. <br />Über den Link unterhalb der Eingabefelder kannst du dir dafür die Vorgaben anzeigen lassen.</li>
                      <li>Hast du das Formular erfolgreich ausgefüllt und über den &quot;Registrieren&quot; Knopf bestätigt, wirst du automatisch eingeloggt.</li>
                      <li>Über den &quot;Logout&quot; Knopf in der Navigationsmenü kannst du dich später wieder ausloggen.</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.contentSection} id="createNote">
                  <h2>2. Notiz erstellen</h2>
                  <div>
                    <ul>
                      <li>Klicke in der Navigationsmenü auf den Reiter &quot;Notizen&quot;.</li>
                      <li>Hier siehst du neben deinen bereits erstellten Notizen auch die Zeile &quot;Neue Notiz...&quot;.</li>
                      <li>Klicke auf diese Zeile und warte bis sich der Editor geöffnet hat. Dies kann einen Moment dauern.</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.contentSection} id="editNote">
                  <h2>3. Notiz bearbeiten</h2>
                  <div>
                    <ul>
                      <li>Klicke in der Navigationsmenü auf den Reiter &quot;Notizen&quot;.</li>
                      <li>Du siehst eine Tabelle mit deinen eigenen, sowie deinen geteilten Notizen.</li>
                      <li>Klicke auf die zu bearbeitende Notiz. (Hast du noch keine Notiz erstellt, folge <Link href="#createNote">Schritt 2</Link>).</li>
                      <li>Nach einer kurzen Ladezeit öffnet sich auch schon der Editor.</li>
                      <li>Wird die geöffnete Notiz bereits von einem anderen Benutzer bearbeitet, so kannst du leider keine Veränderungen an der Notiz vornehmen.</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.contentSection} id="shareNote">
                  <h2>4. Notiz teilen</h2>
                  <div>
                    <ul>
                      <li>Du kannst nur die von dir erstellten Notizen teilen. Für dich Freigegebene Notizen kann nur der Ersteller mit weiteren Nutzern teilen.</li>
                      <li>Begebe dich in den <Link href="#editNote">Bearbeitungsmodus</Link> einer von dir erstellten Notiz.</li>
                      <li>Unter dem Editor befindet sich ein Eingabefeld. In diesem Feld kannst du alle Benutzernamen eingeben, mit denen die Notiz geteilt werden soll.</li>
                      <li>Der grüne Haken über dem Editor indiziert das erfolgreiche Übernehmen der Änderungen.</li>
                    </ul>
                  </div>
                </div>
                {/* <div>
                  Die Entwicklung der Web-App war ein Projekt im Rahmen der Informatik Vorlesung Web-Engineering an der <Link href={this.linkToDHBW}>Dualen Hochschule Baden-Württemberg Campus Friedrichshafen</Link> und wurde von Studenten des Kurses <Link href={this.linkToTIT20}>TIT20</Link> durchgeführt.
                </div> */}
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

export default withRouter(GettingStarted)
