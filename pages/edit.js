// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Edit.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import SavingIndicator from '../components/SavingIndicator'
import { initializeIcons, ITag, TextField, TagPicker } from '@fluentui/react'
import BeatLoader from "react-spinners/BeatLoader";


/**
 * @class Edit Component Class
 * @component
 */
class Edit extends Component {
  editorInstance = null;
  TitleField = null;
  noteID = null;

  constructor(props) {
    super(props)
    this.isNoteNew = false;
    this.currentUsername = "";
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isSaving: false,
      isSaved: true,
      title: "",
      allUserTags: [],
      selectedUserTags: [],
      isLoading: true,
      isReadOnly: false,
      isSharedNote: false,
    }
  }

  /**
   * This method is called when the component is mounted.
   * It is used to set up all the editing components and to load the note.
   */
  async componentDidMount() {

    // check if the user is logged in
    this.updateLoginState();

    // set up the storage event listener
    window.addEventListener('storage', this.storageTokenListener)

    // set up beforunload listener
    window.addEventListener('beforeunload', async (ev) => {
      await this.leaveNote();
    });

    // set up listen on cmd+s and strg+s 
    document.addEventListener("keydown", (event) => {
      if (event.key === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.autoSave.stop();
        this.autoSave.save();
      }
    });

    // check the url if the note is new
    let currentNote;
    if (this.props.router.query.new) {

      // set the note as new
      this.isNoteNew = true;
      this.props.router.replace(this.props.router.pathname); 
      currentNote = { content: "", title: "Neue Notiz", id: undefined, inUse: this.currentUsername, isShared: false, sharedUserIDs: [] };
    } else {

      // get the note id from the url parameter 
      if (!this.props.router.query.id || isNaN(this.props.router.query.id)) {
        this.props.router.push("/");
      } else {

        // get the note
        currentNote = await FrontEndController.getNoteByID(Number(this.props.router.query.id));
        this.props.router.replace(this.props.router.pathname);
        if (!currentNote) {
          this.props.router.push("/");
          return;
        }

        // write current note id to local storage
        FrontEndController.setCurrentNoteID(currentNote.id);

        // set the currentnote in use
        await FrontEndController.setNoteInUse(currentNote.id);
      }
    }

    // if the currentNote is undefined, redirect to the home page
    if (currentNote === undefined) {
      this.props.router.push("/");
      return;
    }

    // check if the note should be read only or not
    this.currentUsername = FrontEndController.getUsernameFromToken(FrontEndController.getUserToken());
    const readOnly = (currentNote.inUse !== this.currentUsername) && (currentNote.inUse !== "");

    // setup editor
    this.setupEditor(currentNote.content, readOnly);

    // setup user tag picker
    await this.setupUserTagPicker(currentNote.sharedUserIDs);

    // update the state
    this.setState({ isLoading: false, title: currentNote.title, isSharedNote: currentNote.isShared, isReadOnly: readOnly });

    // if the note is new focus the title field
    if (this.isNoteNew) {
      this.TitleField.focus();
    }
  }

  /**
   * This method is called just bevor the component is unmounted.
   * It is used to remove the storage event listener and to save the note (it was probably saved bevor).
   */
  async componentWillUnmount() {
    await this.leaveNote();
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
   * This method sets up the user tag picker.
   * @param {number[]} sharedUserIDs The IDs of the users to share the note with
   */
  async setupUserTagPicker(sharedUserIDs) {

    // initialize the icons of Fluent UI
    initializeIcons();

    // get all user as tags
    const allUserTags = (await FrontEndController.getAllUsers()).map(user => { return { key: user.id, name: user.name } });

    // get all user tags of the current note
    const selectedUserTags = allUserTags.filter(userTag => sharedUserIDs.includes(userTag.key));

    // update the state
    this.setState({ allUserTags: allUserTags, selectedUserTags: selectedUserTags });
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
   * This functional component renders the Editor.
   * If the editor is not loaded yet, it renders "Loading..."
   * @returns {JSX.Element} The Editor
   */
  Editor = () => {
    return (
      <div>
        Loading...
      </div>
    )
  }

  /**
   * This method sets up the editor.
   * @param {string} content The HTML content of the note
   * @param {boolean} readOnly If the note is currently read only
   */
  setupEditor(content, readOnly) {
    if (window !== undefined) {

      // load the editor from the components folder
      let CKEditor = require("@ckeditor/ckeditor5-react").CKEditor
      let CustomEditor = require("../components/custom_editor")

      // set up the editor (overwrite the previously assigned loading component)
      this.Editor = () => {
        return (
          <div>
            <CKEditor className={styles.ckEditor}
              disabled={readOnly}
              editor={CustomEditor}
              onChange={this.autoSave.handleChange}
              data={content}
              onReady={(editor) => {
                this.editorInstance = editor;
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "70vh",
                    editor.editing.view.document.getRoot()
                  );
                  writer.setStyle(
                    "width",
                    "100%",
                    editor.editing.view.document.getRoot()
                  );
                });
                if (!this.isNoteNew) {
                  editor.focus();
                }
              }}
            />
          </div>
        )
      }
    }
  }

  /**
   * This method handles the change of the person tag picker.
   * @param {ITag[]} items The currently selected items
   */
  handlePersonPickerChange = (items) => {
    this.setState({ selectedUserTags: items })
    this.autoSave.handleChange();
  }

  /**
   * This method filters the suggested tags.
   * @param {string} filterText The text input to filter the suggestions
   * @param {ITag[]} tagList The already selected tags
   * @returns {ITag[]} The filtered tags
   */
  filterSuggestedTags = (filterText, tagList) => {
    if (filterText) {
      return this.state.allUserTags.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !this.listContainsTagList(tag, tagList));
    } else {
      return [];
    }
  };

  /**
   * This method checks whether a tag is already in the selected tag list.
   * @param {ITag} tag The tag to check
   * @param {ITag[]} tagList The already selected tags
   * @returns {boolean} True if the tag is already in the list, false otherwise
   */
  listContainsTagList = (tag, tagList) => {
    if (!tagList || !tagList.length || tagList.length === 0) {
      return false;
    }
    return tagList.some(compareTag => compareTag.key === tag.key);
  };

  /**
   * This variable is used to handle the auto-saving of the document.
   */
  autoSave = {
    timeout: null,
    dataWasChanged: false,

    /**
     * This method starts the timer for the auto-saving.
     */
    start: async () => {
      if (this.autoSave.timeout === null) {
        this.autoSave.timeout = setTimeout(async () => {
          if (this.editorInstance !== null) {
            await this.autoSave.save();
          }
        }, 2000);
      }
    },

    /**
     * This method is called when the user interupts the auto-saving.
     * It clears the timeout.
     */
    stop: () => {
      if (this.autoSave.timeout) {
        clearTimeout(this.autoSave.timeout)
        this.autoSave.timeout = null
      }
    },

    /**
     * This method is called when the user changes the document.
     */
    handleChange: () => {
      if (this.autoSave.dataWasChanged === false) {
        this.autoSave.start();
      } else {
        this.autoSave.stop();
        this.autoSave.start();
      }
      this.autoSave.dataWasChanged = true;
      this.setState({ isSaved: false });
    },

    /**
     * This method saves the current note.
     */
    save: async () => {
      this.setState({ isSaving: true, isSaved: false });
      let isSaved = false;

      if (this.isNoteNew) {

        // add a new note
        const newNoteToSave = { title: this.state.title, content: this.editorInstance.getData(), sharedUserIDs: this.state.selectedUserTags.map(tag => {return tag.key}), inUse: this.currentUsername, };
        // console.log("Saving new note...", newNoteToSave);
        const noteID = await FrontEndController.saveNote(newNoteToSave);
        isSaved = noteID ? true : false;
        FrontEndController.setCurrentNoteID(noteID);
        this.isNoteNew = false; 

      } else {

        // save the note
        const noteToSave = {
          id: FrontEndController.getCurrentNoteID(),
          title: this.state.title,
          content: this.editorInstance.getData(),
          inUse: this.currentUsername,
          sharedUserIDs: this.state.selectedUserTags.map(userTag => { return userTag.key }),
        }
        isSaved = (await FrontEndController.saveNote(noteToSave)) ? true : false;
      }

      this.autoSave.dataWasChanged = false;
      this.autoSave.stop();
      this.setState({ isSaved: isSaved, isSaving: false });
    }
  }

  /**
   * This method sets the note on not in use on leaving the page.
   */
  async leaveNote() {
    if (!this.state.isReadOnly && FrontEndController.getCurrentNoteID()) {
      await FrontEndController.setNoteNotInUse(FrontEndController.getCurrentNoteID());
    }
    FrontEndController.removeCurrentNoteID();
  }


  /**
    * Generates the JSX Output for the Client
    * @returns {JSX.Element} JSX Output
    */
  render() {

    if (this.state.isLoggedIn === undefined) {

      // if the user is not logged in, display a blank page and wait for the redirect to the getting-started page
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
    } else if (this.state.isLoading) {

      // while the editor is loading, show a loading screen
      return (
        <div>
          <Head>
            <title>Loading...</title>
            <meta name="description" content="Laden..." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.centerScreen}>
              <BeatLoader />
              <div>{"Editor wird vorbereitet... "}</div>
            </div>
          </main>

        </div>
      )

    } else {

      // if the note is currently being edited by another user, show a message next to the title
      let infoString = "";
      if (this.state.isReadOnly && this.state.isSharedNote) {
        infoString = "(Geteilte Notiz: Geschützt, da gerade ein anderer Nutzer diese Notiz bearbeitet)";
      } else if (this.state.isReadOnly && !this.state.isSharedNote) {
        infoString = "(Geschützt, da gerade ein anderer Nutzer diese Notiz bearbeitet)";
      } else if (!this.state.isReadOnly && this.state.isSharedNote) {
        infoString = "(Geteilte Notiz)";
      }

      // when the editor is loaded, show the editor
      return (
        <div>
          <Head>
            <title>Editor</title>
            <meta name="description" content="Editor" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.content}>
                <div className={styles.nameAndSaveIndicator}>
                  <div className={styles.titleText}>
                    {"Titel " + infoString}
                  </div>
                  <div>
                    {/* Empty grid element */}
                  </div>


                  {/* TITLE: */}

                  <TextField
                    onChange={(e, newValue) => {
                      this.setState({ title: newValue })
                      this.autoSave.handleChange()
                    }}
                    placeholder={"Titel..."}
                    value={this.state.title}
                    onFocus={event => {
                      event.target.select();
                      setTimeout(() => { event.target.setSelectionRange(0, event.target.value.length); }, 1);
                    }}
                    componentRef={(textField) => { this.TitleField = textField }}
                    disabled={this.state.isReadOnly}
                  />

                  {/* SAVING INDICATOR: */}

                  <SavingIndicator
                    className={styles.savingIndicator}
                    isSaving={this.state.isSaving}
                    isSaved={this.state.isSaved}
                  />
                </div>


                {/* EDITOR: */}

                <this.Editor />
              </div>
              <div className={styles.content}>


                {/* SHARED WITH: */}

                <div hidden={this.state.isSharedNote}>
                  <label>Diese Notiz teilen mit...</label>
                  <TagPicker
                    onResolveSuggestions={this.filterSuggestedTags}
                    getTextFromItem={(item) => { return item.name }}
                    pickerSuggestionsProps={{ suggestionsHeaderText: 'Vorgeschlagene Personen', noResultsFoundText: 'Keine Personen gefunden', }}
                    onChange={this.handlePersonPickerChange}
                    selectedItems={this.state.selectedUserTags}
                    disabled={this.state.isReadOnly}
                    className={styles.sharedPicker}
                  />
                </div>
              </div>
            </main>

            <footer>
              <Footer isLoggedIn={this.state.isLoggedIn}/>
            </footer>
          </div>
        </div>
      )
    }
  }

}


export default withRouter(Edit)
