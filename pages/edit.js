// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Edit.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import SavingIndicator from '../components/SavingIndicator'
import { initializeIcons, IBasePicker, ITag, IInputProps, IBasePickerSuggestionsProps, Spinner, SpinnerSize, DetailsList, DefaultButton, PrimaryButton, DetailsListLayoutMode, Selection, IColumn, SelectionMode, TextField, KTP_FULL_PREFIX, TagPicker } from '@fluentui/react'

/**
 * @class Home Component Class
 * @component
 */
class Edit extends Component {
  editorInstance = null;
  TitleField = null;

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isSaving: false,
      isSaved: true,
      title: "",
      allUserTags: [],
      selectedUserTags: [],
    }
  }

  /**
   * This method is called when the component is mounted.
   * It is used to set up all the editing components and to load the note.
   */
  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)

    // get initial data
    let noteID = FrontEndController.getCurrentNoteID();
    let currentNote = undefined;

    // check if there is a noteID if not a new note is created
    if (!noteID) {
      currentNote = {
        content: "",
        title: "Neue Notiz",
        id: undefined,
        inUse: true,
        // sharedUsers: [],
      }
      currentNote.id = await FrontEndController.saveNote(currentNote);
      FrontEndController.setCurrentNoteID(currentNote.id);
      this.TitleField.focus();
    } else {
      currentNote = (await FrontEndController.getNotes()).find(note => note.id === noteID);
      setTimeout(() => {
        this.editorInstance.focus();
      }, 1000);
    }

    // setup editor
    await this.setupEditor(currentNote.content);

    // setup title
    this.setState({ title: currentNote.title });

    // TODO: get currentNote.sharedUsers from the database
    const dummyNote_sharedUsers = [1, 2, 3];

    // setup user tag picker
    await this.setupUserTagPicker(dummyNote_sharedUsers); // TODO: change to currentNote.sharedUsers
  }

  /**
   * This method is called just bevor the component is unmounted.
   * It is used to remove the storage event listener and to save the note (it was probably saved bevor).
   */
  async componentWillUnmount() {
    const noteToSave = {
      content: this.editorInstance.getData(),
      title: this.state.title,
      id: FrontEndController.getCurrentNoteID(),
      inUse: false
    }
    await FrontEndController.saveNote(noteToSave);
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
   */
  setupEditor(content) {
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
                this.autoSave.handleChange();
              }}
              key="ckeditor"
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
              }}
              data={content}
            />
          </div>
        )
      }
      this.editorIsLoaded = true;
    }
  }

  /**
   * This method handles the change of the person tag picker.
   * @param {ITag[]} items The currently selected items
   */
  handlePersonPickerChange = (items) => {
    this.setState({ selectedUserTags: items })
    console.log("Selected User Tags: ", items)
    this.autoSave.handleChange();
  }

  /**
   * This method filters the suggested tags.
   * @param {string} filterText The text input to filter the suggestions
   * @param {ITag[]} tagList The already selected tags
   * @returns {ITag[]} The filtered tags
   */
  filterSuggestedTags = (filterText, tagList) => {
    return filterText
      ? this.state.allUserTags.filter(
        tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !this.listContainsTagList(tag, tagList),
      )
      : [];
  };

  /**
   * This method checks whether a tag is already in the selected tag list.
   * @param {ITag} tag The tag to check
   * @param {ITag[]} tagList The already selected tags
   * @returns True if the tag is in the tagList
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
            this.setState({ isSaving: true, isSaved: false });

            // save the note  TODO: Add the shared user IDs
            const noteToSave = {
              id: FrontEndController.getCurrentNoteID(),
              title: this.state.title,
              content: this.editorInstance.getData(),
              inUse: true,
            }
            let isSaved = await FrontEndController.saveNote(noteToSave)

            this.autoSave.dataWasChanged = false;
            this.autoSave.stop();
            this.setState({ isSaved: isSaved, isSaving: false });
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
              <div className={styles.nameAndSaveIndicator}>
                <TextField
                  className={styles.titleInput}
                  label="Title"
                  onChange={(e, newValue) => {
                    this.setState({ title: newValue })
                    this.autoSave.handleChange()
                  }}
                  placeholder={"Titel..."}
                  value={this.state.title}
                  onFocus={event => {
                    event.target.select();
                    setTimeout(() => { event.target.setSelectionRange(0, event.target.value.length); }, 0);
                  }}
                  componentRef={(textField) => { this.TitleField = textField }}
                />
                <SavingIndicator
                  className={styles.savingIndicator}
                  isSaving={this.state.isSaving}
                  isSaved={this.state.isSaved}
                  notSaveMessage={"Not saved yet!"}
                />
              </div>
              <this.Editor />
              <TagPicker
                onResolveSuggestions={this.filterSuggestedTags}
                getTextFromItem={(item) => { return item.name }}
                pickerSuggestionsProps={{ suggestionsHeaderText: 'Vorgeschlagene Personen', noResultsFoundText: 'Keine Personen gefunden', }}
                onChange={this.handlePersonPickerChange}
                selectedItems={this.state.selectedUserTags}
              />
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


export default withRouter(Edit)