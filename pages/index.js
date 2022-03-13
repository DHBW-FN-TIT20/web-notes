// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Notizen.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode, TextField, KTP_FULL_PREFIX, ShimmeredDetailsList } from '@fluentui/react';
import splitHTMLintoElements from '../shared/split_HTML_into_elements'
import { BeatLoader } from 'react-spinners'

/**
 * @class Notizen Component Class
 * @component
 */
class Notizen extends Component {
  constructor(props) {
    super(props)
    this.updateNoteListInterval = null;
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isLoading: false,
      noteList: [],
      searchString: "",
    };

    // define the columns for the note list with custom render functions
    this.noteListColumns = [
      {
        key: "title", name: "Name", fieldName: "title", minWidth: 100, maxWidth: 200, isResizable: true
      },
      {
        key: "modifiedAt", name: "Zuletzt geändert am", fieldName: "modifiedAt", minWidth: 100, maxWidth: 200, isResizable: true,
        onRender: (item) => {
          const date = new Date(item.modifiedAt);
          if (String(date) == "Invalid Date") {
            return "";
          }
          return (`${date.toLocaleString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`);
        }
      },
      {
        key: "type", name: "Art", fieldName: "type", minWidth: 100, maxWidth: 200, isResizable: true,
        onRender: (item) => {
          if (item.isShared === true) {
            return (`Geteilte Notiz`)
          } else if (item.isShared === false) {
            return (`Eigene Notiz`)
          } else {
            return (``)
          }
        }
      },
      {
        key: "content", name: "Vorschau", fieldName: "content", minWidth: 300, maxWidth: 200, isResizable: true,
        onRender: (item) => {
          const maxElements = 5;
          let previewContent = splitHTMLintoElements(item.content, maxElements).join("");
          return (
            <div className={styles.previewLine} dangerouslySetInnerHTML={{ __html: previewContent }}>
            </div>
          )
        }
      },
      {
        key: "inUse", name: "Gerade geöffnet von", fieldName: "inUse", minWidth: 300, maxWidth: 200, isResizable: true,
        onRender: (item) => {
          if (item.inUse === undefined || item.inUse === "") {
            return (`-`)
          } else {
            return (`${item.inUse}`)
          }
        }
      },
    ];
  }

  /**
   * This method is called when the component is mounted.
   */
  async componentDidMount() {

    // check if the user is logged in
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)

    // get the note list
    this.setState({ isLoading: true });
    const notes = await FrontEndController.getNotes();

    // set timeinterval to update the note list
    this.updateNoteListInterval = setInterval(async () => {
      const notes = await FrontEndController.getNotes();
      this.setState({ noteList: notes });
    }, 2000);

    // set up listen on cmd+n and strg+n 
    document.addEventListener("keydown", (event) => {
      if (event.key === "n" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.addNewNote();
      }
    });

    // update the state
    this.setState({ isLoading: false, noteList: notes });
  }

  /**
   * This method is called just bevor the component is unmounted.
   * It is used to remove the storage event listener.
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
    clearInterval(this.updateNoteListInterval);
    this.updateNoteListInterval = null;
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
      this.props.router.push('/getting-started');
      this.setState({ isLoggedIn: false })
    }
  }

  /**
   * This method is called when the user clicks on a item in the details list. It redirects the user to the corresponding note.
   * @param {{ id: number; title: string; ownerID: number; modifiedAt: Date; content: string; inUse: boolean; isShared: boolean }} item The item that was clicked
   * @param {number} index The index of the item in the list
   * @param {any} ev The event that triggered the method
   */
  onActiveItemChanged = (item, index, ev) => {

    // open the note
    if (item.id !== -1 || item.id === undefined) {
      FrontEndController.setCurrentNoteID(item.id);
      this.props.router.push(`/edit?id=${item.id}`);
    } else {
      this.addNewNote();
    }
  }

  /**
   * This method is called when the user changes the search string.
   * @param {any} event 
   * @param {string} newValue 
   */
  handleSearchChange = (event, newValue) => {
    if (newValue) {
      this.setState({ searchString: newValue });
    } else {
      this.setState({ searchString: "" });
    }
  }

  /**
   * This method adds a new note and redirects the user to the editor.
   */
  async addNewNote() {
    this.props.router.push(`/edit?new=true`);
  }

  /**
   * Generates the JSX Output for the Client
   * @returns {JSX.Element} JSX Output
   */
  render() {

    // filter the list of notes according to the search string
    let filteredNoteList = [];
    if (this.state.searchString == "") {
      filteredNoteList = this.state.noteList;
    } else if (this.state.noteList.length == 0) {
      filteredNoteList = [];
    } else {
      filteredNoteList = this.state.noteList.filter(note => {
        return note.title.toLowerCase().includes(this.state.searchString.toLowerCase()) || note.content.toLowerCase().includes(this.state.searchString.toLowerCase());
      });
    }

    // add the "new note" button
    const newNote = { id: -1, title: "Neue Notiz...", content: "", isShared: null, }
    if (filteredNoteList.length > 0) {
      if (filteredNoteList[0].id !== -1) {
        filteredNoteList.splice(0, 0, newNote);
      }
    } else {
      filteredNoteList.splice(0, 0, newNote);
    }

    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>WEB-NOTES</title>
            <meta name="description" content="Notizen" />
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
            <meta name="description" content="Notizen" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.contentOne}>
                <TextField onChange={this.handleSearchChange} placeholder={"Suchen..."} disabled={this.state.isLoading} />
                <ShimmeredDetailsList className={styles.detailsList}
                  items={filteredNoteList}
                  columns={this.noteListColumns}
                  setKey="set"
                  onActiveItemChanged={this.onActiveItemChanged}
                  selectionMode={SelectionMode.none}
                  enableShimmer={this.state.isLoading}
                  shimmerLines={7}
                />
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

export default withRouter(Notizen)
