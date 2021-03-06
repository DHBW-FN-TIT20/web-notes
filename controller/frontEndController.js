// @ts-check
import jwt from 'jsonwebtoken'

/**
 * This is the Frontend Controller of WebNotes
 * @category Controller
 */
export class FrontEndController {
  static userTokenName = "webnotes.auth.token";
  static currentNoteName = "webnotes.noteID";

  //#region User Methods

  /**
   * This method checks whether a given user exists in the database
   * @param {string} username name to check
   * @returns {Promise<boolean>} True if user exists, else false
   */
  static async doesUserExist(username) {
    const response = await fetch('./api/users/does_exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }


  /**
   * This method is used to store the id of the current note in the local storage
   * @param {number} noteID ID of the note to be set as the current note
   */
  static setCurrentNoteID(noteID) {
    localStorage.removeItem(FrontEndController.currentNoteName);
    localStorage.setItem(FrontEndController.currentNoteName, String(noteID));
  }

  /**
   * This method is used to get the id of the current note from the local storage
   * @returns {number} ID of the current note
   */
  static getCurrentNoteID() {
    const currentNoteString = localStorage.getItem(FrontEndController.currentNoteName);
    if (currentNoteString === null) {
      return undefined;
    }
    return Number(currentNoteString);
  }

  /**
   * This method removes the note id from the local storage
   */
  static removeCurrentNoteID() {
    localStorage.removeItem(FrontEndController.currentNoteName);
  }

  /**
   * This method returns a filled User object for the given user.
   * @param {string} token Token of the user
   * @returns {Promise<{id: number, name: string, password: string}>} User object with all credentials of the user from the token, empty User if token not valid
   */
  static async getUserFromToken(token) {
    const response = await fetch('./api/users/get_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    return data.user[0];
  }

  /**
   * This method checks the password for current password requirements
   * @param {string} password password to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  static async isPasswordValid(password) {
    const response = await fetch('./api/users/is_password_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method checks the username for current username requirements
   * @param {string} username username to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  static async isUsernameValid(username) {
    const response = await fetch('./api/users/is_username_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method logs a user in if there is a match with the database. Therfore a token is created which is stored in the browsers local storage.
   * @param {string} username Username to log in
   * @param {string} password Password for user
   * @returns {Promise<boolean>} True if login was successfull, false if not
   */
  static async loginUser(username, password) {
    const response = await fetch('./api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    const data = await response.json();

    if (data.userToken === "") {
      localStorage.removeItem(this.userTokenName);
      return false;
    }
    localStorage.setItem(this.userTokenName, data.userToken);
    return true;
  }

  /**
   * This method registers a user to the database
   * @param {string} username the username of the user to be created
   * @param {string} password the password of the user to be created
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
  static async registerUser(username, password) {
    const response = await fetch('./api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    const data = await response.json();
    if (data.wasSuccessfull) {
      await FrontEndController.loginUser(username, password);
    }

    return data.wasSuccessfull;
  }

  /**
   * This method changes the password of the current user
   * @param {string} oldPassword the old password of the user
   * @param {string} newPassword the new password of the user
   * @returns {Promise<boolean>} True if password was changed, false if not
   */
  static async changePassword(oldPassword, newPassword) {
    const response = await fetch('./api/users/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: this.getUserToken(),
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    });

    const data = await response.json();

    if (data.wasSuccessfull) {
      return await this.loginUser(this.getUsernameFromToken(this.getUserToken()), newPassword);
    }

    return false;
  }

  /**
   * This method checks whether the given token has a valid signature and user
   * @param {string} token token to be verified
   * @returns {Promise<boolean>} true if signature is valid and user exists, false if not
   */
  static async verifyUserByToken(token) {
    const response = await fetch('./api/users/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This mehtod loggs out the current user.
   * @returns {boolean} True if logout was successfull, false if not
   */
  static logoutUser() {
    localStorage.removeItem(this.userTokenName);
    return true;
  }



  /**
   * This method gets all the users from the database
   * @returns {Promise<Array.<{id: number, name: string}>>} Array of all users
   */
  static async getAllUsers() {
    const response = await fetch('./api/users/get_all_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: FrontEndController.getUserToken()
      })
    });

    const data = await response.json();
    return data.users;
  }


  //#endregion

  //#region Token Methods

  /**
   * This method returns the current authentication token
   * @returns {string} token of the currently logged in user
   */
  static getUserToken() {
    const token = localStorage.getItem(this.userTokenName);
    if (token !== null) {
      return token;
    }
    return "";
  }

  /**
   * This method extracts the username from the token and returns it.
   * @param {string} token Token with user information
   * @returns {string} Username if token contains username, else empty string
   */
  static getUsernameFromToken(token) {
    const content = jwt.decode(token);
    if (typeof content === "object" && content !== null) {
      return content.username;
    }
    return "";
  }

  //#endregion

  //#region Note Methods

  /**
   * This method is used to save a note to the database. If no note.id is given, a new note is created.
   * @param {{id: number | undefined, title: string | undefined, content: string | undefined, inUse: string | undefined, isShared: boolean | undefined, sharedUserIDs: number[] | undefined}} note note which should be saved
   * @returns {Promise<number>} returns the id of the saved note
   */
  static async saveNote(note) {

    const response = await fetch('./api/notes/save_note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        note: note,
        userToken: FrontEndController.getUserToken()
      })
    });

    const data = await response.json();
    return data.noteID;
  }

  /**
   * This function writes the username in the inUse field of the note to make it read only for other users.
   * @param {number} noteID ID of the note which should be made read only
   */
  static async setNoteInUse(noteID) {
    this.saveNote({
      id: noteID,
      inUse: this.getUsernameFromToken(this.getUserToken()),
      title: undefined,
      content: undefined,
      isShared: undefined,
      sharedUserIDs: undefined
    });
  }


  /**
   * This function removes the username from the inUse field of a note to make it available for other users
   * @param {number} noteID ID of the note which should be made available
   */
  static async setNoteNotInUse(noteID) {
    await this.saveNote({
      id: noteID,
      inUse: "",
      title: undefined,
      content: undefined,
      isShared: undefined,
      sharedUserIDs: undefined
    });
  }

  /**
   * This method is used to get all notes which are related to the user.
   * @returns {Promise<Array.<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string, isShared: boolean, sharedUserIDs: number[]}>>} Array of all notes of the current user
   */
  static async getNotes() {

    const response = await fetch('./api/notes/get_all_notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: FrontEndController.getUserToken()
      })
    });

    const data = await response.json();

    return data.notes;
  }

  /**
   * This method is used to get get a note by its id.
   * @param {number} noteID id of the note
   * @returns {Promise<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string, isShared: boolean, sharedUserIDs: number[]}>} Array of all notes of the current user
   */
  static async getNoteByID(noteID) {

    const response = await fetch('./api/notes/get_note_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: FrontEndController.getUserToken(),
        id: noteID
      })
    });

    const data = await response.json();

    return data.note;
  }

  /**
   * This method creates a new note.
   * @returns {Promise<number>} ID of the created note
   */
  static async addNewNote() {
    const currentNote = { content: "", title: "Neue Notiz", id: undefined, inUse: this.getUsernameFromToken(this.getUserToken()), isShared: false, sharedUserIDs: [], }
    const nodeID = await this.saveNote(currentNote);
    return nodeID;
  }

  /**
   * This method deletes the current note.
   * @returns {Promise<boolean>} True if the note was deleted, false if not
   */
  static async deleteNote() {
    const response = await fetch('./api/notes/delete_note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: FrontEndController.getUserToken(),
        id: this.getCurrentNoteID()
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }

  //#endregion
}
