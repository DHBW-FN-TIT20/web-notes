import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontendController } from '../controller'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import DevChatLogo from '../public/Dev-Chat.png'
import SavingIndicator from '../components/SavingIndicator'

/**
 * @class Home Component Class
 * @component
 */
class Home extends Component {
  editorInstance = null;
  
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isSaving: false,
      isSaved: true,
    }
  }

  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)

    this.setupEditor();
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
      this.setState({ isLoggedIn: true, currentToken: currentToken });
    } else {
      this.setState({ isLoggedIn: false })
    }
  }

  Editor = () => {
    return (
      <div>
        Loading...
      </div>
    )
  }

  setupEditor() {
    if (window !== undefined) {
      console.log("Loading Editor...");

      let CKEditor = require("@ckeditor/ckeditor5-react").CKEditor
      let CustomEditor = require("../components/custom_editor")

      this.Editor = () => {
        return (
          <div className={styles.ckEditor}>
            <CKEditor className={styles.ckEditor}
              type=""
              name="editor1"
              editor={CustomEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.autoSave.handleChange();
              }}
              key="ckeditor"
              onReady={(editor) => {
                this.editorInstance = editor;
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "100vh",
                    editor.editing.view.document.getRoot()
                  );
                  writer.setStyle(
                    "width",
                    "50vw",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
            />
          </div>
        )
      }
      this.editorIsLoaded = true;
    }
  }



  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {

    const { router } = this.props

    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>Welcome</title>
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
            <title>Welcome</title>
            <meta name="description" content="Welcome page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontendController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.contentOne}>
              <div>
                <h1>Home</h1>
                <SavingIndicator
                  isSaving={this.state.isSaving}
                  isSaved={this.state.isSaved}
                />
              </div>
              <div>
                <Image
                  src={DevChatLogo}
                  objectFit='contain'
                  sizes='fitContent'
                  height={100}
                  width={100}
                  alt='Dev-Chat Logo'
                  onClick={() => { router.push("https://dev-chat.me") }}
                />
              </div>
              <this.Editor />
            </div>
          </main>

          <footer>
            <Footer />
          </footer>
        </div>
      )
    }
  }


  autoSave = {
    timeout: null,
    dataWasChanged: false,
    start: async () => {
      if (this.autoSave.timeout === null) {
        this.autoSave.timeout = setTimeout( async () => {
          if (this.editorInstance !== null) {
            this.setState({ isSaving: true, isSaved: false });
            let isSaved = await FrontendController.saveNote(this.editorInstance.getData())
            this.autoSave.dataWasChanged = false;
            this.autoSave.stop();
            this.setState({ isSaved: isSaved, isSaving: false });
          }
        }, 1000);
      }
    },
    stop: () => {
      if (this.autoSave.timeout) {
        clearTimeout(this.autoSave.timeout)
        this.autoSave.timeout = null
      }
    },
    handleChange: () => {
      if (this.autoSave.dataWasChanged === false) {
        this.autoSave.start();
      } else {
        this.autoSave.stop();
        this.autoSave.start();
      }
      this.autoSave.dataWasChanged = true;
      this.setState({ isSaved: false });
    }
  }
}

export default withRouter(Home)
