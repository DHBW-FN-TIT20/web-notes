// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Edit.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import SavingIndicator from '../components/SavingIndicator'
import { Spinner, SpinnerSize, DetailsList, DefaultButton, PrimaryButton, DetailsListLayoutMode, Selection, IColumn, SelectionMode, TextField, KTP_FULL_PREFIX } from '@fluentui/react'
import { FrontendController } from '../controller/frontEndController' 

/**
 * @class Home Component Class
 * @component
 */
class Edit extends Component {
  editorInstance = null;

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isSaving: false,
      isSaved: true,
      title: "",
      isTitleSaved: true,
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
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value, isTitleSaved: false });
  }

  renderTitleLabel = (props) => {
    if (this.state.isTitleSaved) {
      return (
        <div className={styles.titleLabel}>
          <span>Title</span>
        </div>
      )
    } else {
      return (
        <div className={styles.titleLabel}>
          <span>Title (Not Saved...)</span>
        </div>
      )
    }
  }

  handleSaveTitle = () => {
    this.setState({ isTitleSaved: false });
    console.log("Saving Title...");
    setTimeout(() => {
      this.setState({ isTitleSaved: true });
      console.log("Title saved!");
    }, 1000);
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
          <div>
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
                    "100%",
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
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.contentOne}>
              <div>
                <TextField
                  label="Title"
                  onRenderLabel={this.renderTitleLabel}
                  onChange={this.handleTitleChange}
                  placeholder={"Titel..."}
                  value={this.state.title}
                  onBlur={this.handleSaveTitle}
                  style={{ borderColor: this.state.isTitleSaved ? "green" : "red" }}
                />
                {/* <Spinner size={SpinnerSize.small}  hidden={this.state.isTitleSaved}/> */}
              </div>
              <SavingIndicator
                isSaving={this.state.isSaving}
                isSaved={this.state.isSaved}
                notSaveMessage={"Not saved yet!"}
              />
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
        this.autoSave.timeout = setTimeout(async () => {
          if (this.editorInstance !== null) {
            this.setState({ isSaving: true, isSaved: false });
            let isSaved = await FrontEndController.saveNote(this.editorInstance.getData())
            this.autoSave.dataWasChanged = false;
            this.autoSave.stop();
            this.setState({ isSaved: isSaved, isSaving: false });
          }
        }, 2000);
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


export default withRouter(Edit)
