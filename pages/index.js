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
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';


// export type Note {
//   id: string;
//   title: string;
//   content: string;
//   ownerID: number;
//   createdAt?: string;
//   sharedWith?: number[];
// }


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
    };
    this._columns = [
      { key: "title", name: "Name", fieldName: "title", minWidth: 100, maxWidth: 200, isResizable: true },
      { key: "createdAt", name: "Erstellt am", fieldName: "createdAt", minWidth: 100, maxWidth: 200, isResizable: true },
      { key: "type", name: "Art", fieldName: "type", minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => { if (item.isSharedToMe) { return (`Geteilte Notiz`) } else { return (`Eigene Notiz`) } } },
      {
        key: "content", name: "Vorschau", fieldName: "content", minWidth: 300, maxWidth: 200, isResizable: true, onRender: (item) => {
          let previewLine = "";
          const maxElements = 20;
          if (item.content.split(`><`).length == 0) {
            previewLine = "<div>empty</div>";
          } else if (item.content.split(`><`).length == 1) {
            previewLine = item.content.split(`><`)[0];
          } else {
            previewLine = item.content.split(`><`)[0]
            for (let i = 1; i < Math.min(item.content.split(`><`).length, maxElements); i++) {
              previewLine += "><" + item.content.split(`><`)[i]
            }
            if (item.content.split(`><`).length < maxElements) { 
              previewLine += ">" 
            }

          }          
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

  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)

    this.getNoteList();
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  getNoteList = async () => {
    // get the note list from backend

    setTimeout(() => {
      let dummyNoteList = [
        {
          id: "1",
          title: "Einkaufsliste",
          content: "<div>This is my Einkaufsliste</div>",
          ownerID: 1,
          createdAt: "2020-01-01",
          sharedWith: [2, 3],
          isSharedToMe: true,
        },
        {
          id: "2",
          title: "Todo-Liste",
          content: "<div>This is my Todo-Liste</div>",
          ownerID: 2,
          createdAt: "2020-01-01",
          sharedWith: [1, 3],
          isSharedToMe: false,
        },
        {
          id: "3",
          title: "JavaScript-Tutorial",
          content: "<h1>Große Schrift</h1><div>This is my JavaScript-Tutorial</div>",
          ownerID: 3,
          createdAt: "2020-01-01",
          sharedWith: [1, 2],
          isSharedToMe: true,
        },
      ];
      this.setState({ noteList: dummyNoteList });
    }, 50);

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

  _onItemInvoked = (item) => {
    // open the note
    alert(`You selected ${item.title} which has the id ${item.id}`);
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
              <DetailsList
                items={this.state.noteList}
                columns={this._columns}
                setKey="set"
                onItemInvoked={this._onItemInvoked}
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
