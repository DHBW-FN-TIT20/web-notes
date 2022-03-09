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

/**
 * @class Notizen Component Class
 * @component
 */
class Notizen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isLoading: false,
      noteList: [],
      searchString: "",
    };
    this.noteListColumns = [
      { key: "title", name: "Name", fieldName: "title", minWidth: 100, maxWidth: 200, isResizable: true },
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
            <div
              className={styles.previewLine}
              dangerouslySetInnerHTML={{
                __html: previewContent
              }}
            >
            </div>
          )
        }
      },
    ];
  }

  /**
   * This method is called when the component is mounted.
   */
  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ isLoading: true });
    await this.getNoteList();
    this.setState({ isLoading: false });
    FrontEndController.freeNote();
  }

  /**
   * This method is called just bevor the component is unmounted.
   * It is used to remove the storage event listener.
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method is used to load the notes from the backend.
   */
  async getNoteList() {

    // get the note list from backend
    let notes = await FrontEndController.getNotes();

    // update the state
    console.log(notes);
    this.setState({ noteList: notes });

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
      this.props.router.push(`/edit`);
    } else {
      FrontEndController.removeCurrentNoteID();
      this.props.router.push(`/edit`);
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
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {

    const { router } = this.props

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
              <Footer />
            </footer>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(Notizen)
