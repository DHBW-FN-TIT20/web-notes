// @ts-check
import Head from 'next/head'
import { Component } from 'react'
import withRouter from 'next/dist/client/with-router'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import SavingIndicator from '../components/SavingIndicator'
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode, TextField, KTP_FULL_PREFIX } from '@fluentui/react';


/**
 * @class Home Component Class
 * @component
 */
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      isSaving: false,
      isSaved: true,
      noteList: [],
      searchString: "",
    };
    this.noteListColumns = [
      { key: "title", name: "Name", fieldName: "title", minWidth: 100, maxWidth: 200, isResizable: true },
      { key: "modifiedAt", name: "Zuletzt geändert am", fieldName: "modifiedAt", minWidth: 100, maxWidth: 200, isResizable: true },
      { key: "type", name: "Art", fieldName: "type", minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => { if (item.isShared) { return (`Geteilte Notiz`) } else { return (`Eigene Notiz`) } } },
      {
        key: "content", name: "Vorschau", fieldName: "content", minWidth: 300, maxWidth: 200, isResizable: true, onRender: (item) => {
          const maxElements = 5;
          let previewLine = this.splitHTMLintoElements(item.content, maxElements).join("");
          return (
            <div
              className={styles.previewLine}
              dangerouslySetInnerHTML={{
                __html: previewLine
              }}
            >
            </div>
          )
        }
      },
    ];
  }

  /**
   * This function splits the HTML input into a list of elements
   * @param {string} html The HTML string to be split into elements
   * @param {number} maxStringElements The maximum number of displayed elements.
   * @returns {string[]} The array of elements
   */
  splitHTMLintoElements(html, maxStringElements) {
    let elements = [];
    let currentElement = "";

    // split the html string into elements
    for (let i = 0; i < html.length; i++) {
      if (html[i] == "<") {
        if (currentElement != "") {
          elements.push(currentElement);
          currentElement = "";
        }
        currentElement += html[i];
      } else if (html[i] == ">") {
        currentElement += html[i];
        elements.push(currentElement);
        currentElement = "";
      } else {
        currentElement += html[i];
      }
    }

    let result = [];
    let openTagElements = [];
    let textElementsCount = 0;
    let isShrinked = false;

    // the elements are splittet into text and tag elements and the text elements are counted
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.startsWith("<") && element.endsWith(">") && element[1] != "/") {
        openTagElements.push(element);
        result.push(element);
      } else if (element.startsWith("<") && element.endsWith(">") && element[1] == "/") {
        openTagElements.pop();
        result.push(element);
      } else {
        textElementsCount++;
        result.push(element);
      }

      // if the maximum number of elements is reached, no more text elements are added to the result
      if (textElementsCount >= maxStringElements) {
        isShrinked = true;
        break;
      }
    }

    // for every open tag the corresponding closing tag is added
    for (let i = openTagElements.length - 1; i > -1; i--) {
      result.push(`</${openTagElements[i].substring(1, openTagElements[i].length - 1)}>`);
    }

    // if the maximum number of elements is reached, the result is shrinked and the last element is a "..."
    if (isShrinked) {
      result.push("<div style='color: gray;'>...</div>");
    }
    return result;
  }


  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)

    await this.getNoteList();
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

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
      this.setState({ isLoggedIn: false })
    }
  }

  onActiveItemChanged = (item, index, ev) => {
    // open the note
    FrontEndController.setCurrentNoteID(item.id);
    this.props.router.push(`/edit`);
  }


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
              <TextField onChange={this.handleSearchChange} placeholder={"Suchen..."} />
              <DetailsList
                items={filteredNoteList}
                columns={this.noteListColumns}
                setKey="set"
                // onItemInvoked={this.onItemInvoked}
                onActiveItemChanged={this.onActiveItemChanged}
                selectionMode={SelectionMode.none}
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

export default withRouter(Home)
