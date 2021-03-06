// @ts-check
import { DatabaseModel } from '../pages/api/databaseModel';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

/**
 * Backend Controller of WebNotes
 * @category Controller
 */
export class BackEndController {
  //#region Variables
  static KEY;
  databaseModel = new DatabaseModel();

  //#endregion

  //#region Constructor
  constructor() {
    BackEndController.KEY = process.env.TOKEN_KEY || '';
  }

  //#endregion

  //#region Token Methods

  /**
   * This method validates a given token with the current key.
   * @param {string} token Token to validate
   * @returns {boolean} True if the token is valid, false if not
   */
  isTokenValid(token) {
    try {
      jwt.verify(token, BackEndController.KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * This method checks whether a given token is valid and contains an existing user
   * @param {string} token Token with user credentials
   * @returns {Promise<boolean>} True if token contains a valid user, false if not
   */
  async isUserTokenValid(token) {
    if (this.isTokenValid(token)) {
      if (await this.handleUserAlreadyExists(this.getUsernameFromToken(token))) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method extracts the username from a token
   * @param {string} token Token to extract username from
   * @returns {string} Username if token contains username, empty string if not
   */
  getUsernameFromToken(token) {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.username
      }
    } catch (error) {

    }
    return "";
  }

  //#endregion

  //#region Password Methods

  /**
   * This method checks a password for requirements
   * @param {string} password password to check
   * @returns {boolean} true if the password meets the requirements, false if not
   */
  isPasswordValid(password) {
    /**
    * Requirements:
    * Length: min. 8 characters
    * Characters: min. 1 number, 1 uppercase character, 1 lowercase character, 1 special character
    * Characters: only letters and numbers + !*#,;?+-_.=~^%(){}|:"/
    */
    if (password.length >= 8) {
      if (password.match(".*[0-9].*") && password.match(".*[A-Z].*") && password.match(".*[a-z].*") && password.match('.*[!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-].*')) {
        if (password.match('^[a-z,A-Z,0-9,!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-]*$')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Function to hash a password
   * @param {string} password password to hash
   * @returns {Promise<string>} hashed password
   */
  async hashPassword(password) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword
  }

  /**
   * Function to check plain text with hash
   * @param {string} clearPassword password as plain text
   * @param {string} hashedpassword password as hash from db
   * @returns {Promise<boolean>} true if password and hash match, false if not
   */
  async checkPassword(clearPassword, hashedpassword) {
    return await bcrypt.compare(clearPassword, hashedpassword);
  }

  //#endregion

  //#region User Methods

  /**
   * This method returns a filled User object for the given User.
   * @param {string} token Token to get User object from
   * @returns {Promise<{id: number, name: string, password: string} | {}>} User object of username, empty User if token invalid
   */
  async handleGetUserFromToken(token) {
    if (this.isTokenValid(token)) {
      const username = this.getUsernameFromToken(token);
      return this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, username));
    }
    return {};
  }

  /**
   * This method changes the password from the current user
   * @param {string} token Token to extract username from
   * @param {string} oldPassword contains the old User Password
   * @param {string} newPassword contains the new User Password
   * @returns {Promise<boolean>} if password was changed -> return true
   */
  async handleChangeUserPassword(token, oldPassword, newPassword) {
    if (!this.isTokenValid(token)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(token)))[0];

    if (user === undefined) {
      return false;
    }

    if (this.isPasswordValid(newPassword) && await this.checkPassword(oldPassword, user.password)) {
      const newHashedPassword = await this.hashPassword(newPassword);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeUserPassword(newHashedPassword, user.id));
    }

    return false;
  }

  /**
   * This method removes a target user from the database
   * @param {string} userToken user token to verificate delete process
   * @returns {Promise<boolean>} true if user was deleted, false if not
   */
  async handleDeleteUser(userToken) {
    if (!await this.isUserTokenValid(userToken)) {
      return false;
    }

    const userTokenName = this.getUsernameFromToken(userToken);

    const targetUser = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, userTokenName))[0];

    if (targetUser === undefined) {
      return false;
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUser(targetUser.id));
  }

  /**
   * This method logs in a user if the given credentials are valid.
   * @param {string} username Username to log in
   * @param {string} password Password for the given username
   * @returns {Promise<string>} Signed token with username if login was successfull, empty string if not
   */
  async handleLoginUser(username, password) {
    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, username))[0];

    if (user === undefined) {
      return "";
    }

    if (await this.checkPassword(password, user.password)) {
      const token = jwt.sign({
        username: username,
      }, BackEndController.KEY, { expiresIn: '1 day' });
      return token;
    }

    return "";
  }

  /**
   * API function to register a user
   * @param {string} username username to register
   * @param {string} password password for the user
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
  async handleRegisterUser(username, password) {
    if (!await this.handleUserAlreadyExists(username)) {
      const vUsernameValid = this.isUsernameValid(username);
      const vPasswordValid = this.isPasswordValid(password);
      if (vUsernameValid && vPasswordValid) {
        const hashedPassword = await this.hashPassword(password);

        return this.databaseModel.evaluateSuccess(await this.databaseModel.addUser(username, hashedPassword));
      }
    }
    return false;
  }

  /**
   * This method checks whether a user already exists in the DB.
   * @param {string} username username to check
   * @returns {Promise<boolean>} true if user exists, false if not
   */
  async handleUserAlreadyExists(username) {
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable(undefined, username));
  }

  /**
   * This method checks a username for requirements
   * @param {string} username username to check
   * @returns {boolean} true if the username meets the requirements, false if not
   */
  isUsernameValid(username) {
    /**
    * Requirements:
    * Length: 4-16 characters
    * Characters: only letters and numbers
    * Keyword admin is not allowed
    */
    if (username.length >= 4 && username.length <= 16) {
      if (username.match("^[a-zA-Z0-9]+$")) {
        if (username.match("[a-z,A-Z,0-9]*[a,A][d,D][m,M][i,I][n,N][a-z,A-Z,0-9]*")) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  //#endregion

  //#region Note Methods

  /**
   * Saves the String to the Database
   * @param {{id: number | undefined, title: string | undefined, content: string | undefined, inUse: string, sharedUserIDs: number[] | undefined}} note Note to save
   * @param {string} userToken Token to extract username from
   */
  async saveNote(note, userToken) {
    console.log("saveNote", note);
    const isUserValid = await this.isUserTokenValid(userToken);

    if (!isUserValid) {
      console.log("user invalid");
      return undefined;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];

    if (user === undefined) {
      return undefined;
    }

    if (note.id === -1) {
      // create new note
      console.log("create new note");

      const addedNote = this.databaseModel.getNoteFromResponse(await this.databaseModel.addNote(user.id, note.inUse, note.title, note.content))[0];
      console.log("addedNote: ", addedNote);

      if (addedNote === undefined) {
        return undefined;
      }

      if (note.sharedUserIDs.length > 0) {
        console.log(this.databaseModel.evaluateSuccess(await this.databaseModel.addUserNoteRelation(note.sharedUserIDs, addedNote.id)));
      }

      return addedNote.id;
    } else if (note.id !== undefined && note.id !== null) {
      // save note
      const currentNote = this.databaseModel.getNoteFromResponse(await this.databaseModel.selectNoteTable(note.id))[0];
      console.log(currentNote);
      if (currentNote === undefined) {
        return undefined;
      }

      // check if the user is allowed to edit the note
      if ((currentNote.inUse !== this.getUsernameFromToken(userToken)) && (currentNote.inUse !== "")) {
        return undefined;
      }

      const noteToSave = currentNote;
      noteToSave.title = note.title;
      noteToSave.modifiedAt = new Date();
      noteToSave.content = note.content;
      noteToSave.inUse = note.inUse;
      const savedNote = this.databaseModel.getNoteFromResponse(await this.databaseModel.updateNote(note.id, noteToSave))[0];

      console.log("note.sharedUserIDs: ", note.sharedUserIDs);

      if (note.sharedUserIDs !== undefined && savedNote.ownerID === user.id) {
        const currentSharedUserIDs = (this.databaseModel.getSharedUserNoteRelationFromResponse(await this.databaseModel.selectUserRelationTable(savedNote.id))).map(x => x.userID);
        const relationsToDelete = currentSharedUserIDs.filter(userID => !note.sharedUserIDs.includes(userID));
        const relationsToAdd = note.sharedUserIDs.filter(userID => !currentSharedUserIDs.includes(userID));
        if (relationsToDelete.length > 0) {
          for (const userID of relationsToDelete) {
            console.log(this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUserNoteRelation(userID, note.id)));
          }
        }
        if (note.sharedUserIDs.length > 0) console.log(this.databaseModel.evaluateSuccess(await this.databaseModel.addUserNoteRelation(relationsToAdd, note.id)));
      }

      if (savedNote === undefined) {
        return undefined;
      }

      return savedNote.id;
    }
  }

  /**
   * This method deletes a note from the database
   * @param {number} noteID The ID of the note to delete
   * @param {string} userToken The token of the user who wants to delete the note
   * @returns {Promise<boolean>} true if delete was Sucessful
   */
  async deleteNote(noteID, userToken) {
    // check if the user is valid
    const isUserValid = await this.isUserTokenValid(userToken);
    if (!isUserValid) {
      return false;
    }

    // get the user
    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];
    if (user === undefined) {
      return false;
    }

    // get the note
    const noteToDelete = this.databaseModel.getNoteFromResponse(await this.databaseModel.selectNoteTable(noteID))[0];
    if (noteToDelete === undefined) {
      return false;
    }

    // check if the note itself has to be deleted or just the relation
    const isOwner = noteToDelete.ownerID === user.id;
    if (isOwner) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteNote(noteID));
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUserNoteRelation(user.id, noteID));
  }

  /**
   * Gets get all notes which are related to the user from the database
   * @param {string} userToken
   */
  async getNotes(userToken) {
    const isUserValid = await this.isUserTokenValid(userToken);

    if (!isUserValid) {
      // return a empty array to indicate that the user is not valid
      return [];
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];

    if (user === undefined) {
      return [];
    }

    const ownNotes = this.databaseModel.getNoteFromResponse(await this.databaseModel.selectNoteTable(undefined, undefined, user.id));

    const sharedNotes = this.databaseModel.getSharedNoteFromResponse(await this.databaseModel.selectUserNoteRelationTable(user.id));

    const ownNotesWithSharedAttribute = [];

    for (const note of ownNotes) {
      ownNotesWithSharedAttribute.push({
        id: note.id,
        title: note.title,
        ownerID: note.ownerID,
        modifiedAt: note.modifiedAt,
        content: note.content,
        inUse: note.inUse,
        isShared: false,
        sharedUserIDs: []
      });
    }

    const sharedNotesWithSharedAttribute = sharedNotes.map(note => ({
      id: note.id,
      title: note.title,
      ownerID: note.ownerID,
      modifiedAt: note.modifiedAt,
      content: note.content,
      inUse: note.inUse,
      isShared: true,
      sharedUserIDs: []
    }));

    const allNotes = ownNotesWithSharedAttribute.concat(sharedNotesWithSharedAttribute);

    const sortedNotes = allNotes.sort((a, b) => (b.modifiedAt.getTime() - a.modifiedAt.getTime()));

    return sortedNotes;
  }


  /**
   * Get a note from the database by its ID
   * @param {string} userToken The token of the user who wants to get the note
   * @param {number} id note ID
   * @returns {Promise<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string, isShared: boolean, sharedUserIDs: number[]}>} note object
   */
  async getNoteByID(userToken, id) {

    console.log("get note by id : ", id);

    const isUserValid = await this.isUserTokenValid(userToken);

    if (!isUserValid) {
      // return a empty array to indicate that the user is not valid
      return undefined;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];

    if (user === undefined) {
      return undefined;
    }

    const ownNotes = this.databaseModel.getNoteFromResponse(await this.databaseModel.selectNoteTable(id, undefined, user.id));

    const sharedNotes = this.databaseModel.getSharedNoteFromResponse(await this.databaseModel.selectUserNoteRelationTable(user.id));

    const ownNotesWithSharedAttribute = [];

    for (const note of ownNotes) {
      ownNotesWithSharedAttribute.push({
        id: note.id,
        title: note.title,
        ownerID: note.ownerID,
        modifiedAt: note.modifiedAt,
        content: note.content,
        inUse: note.inUse,
        isShared: false,
        sharedUserIDs: await this.getSharedUserIDFromNoteID(note.id)
      });
    }

    console.log("ownNotesWithSharedAttribute: ", ownNotesWithSharedAttribute);

    const sharedNotesWithSharedAttribute = sharedNotes.map(note => ({
      id: note.id,
      title: note.title,
      ownerID: note.ownerID,
      modifiedAt: note.modifiedAt,
      content: note.content,
      inUse: note.inUse,
      isShared: true,
      sharedUserIDs: []
    }));

    console.log("sharedNotesWithSharedAttribute: ", sharedNotesWithSharedAttribute);

    const allNotes = ownNotesWithSharedAttribute.concat(sharedNotesWithSharedAttribute);

    const oneNote = allNotes.filter(note => note.id === id)[0];
    console.log("oneNote: ", oneNote);

    return oneNote;
  }

  /**
   * This method returns the userIDs that the note is shared with
   * @param {number} noteID The ID of the note
   * @returns {Promise<number[]>} Array of userIDs
   */
  async getSharedUserIDFromNoteID(noteID) {
    const relations = this.databaseModel.getSharedUserNoteRelationFromResponse(await this.databaseModel.selectUserRelationTable(noteID));

    const userIDs = [];
    for (const element of relations) {
      userIDs.push(element.userID);
    }
    return userIDs;
  }

  async getAllUsers(userToken) {

    // check if user is valid
    const isUserValid = await this.isUserTokenValid(userToken);

    if (!isUserValid) {
      // return a empty array to indicate that the user is not valid
      return [];
    }

    // get the current user
    const currentUser = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];

    if (currentUser === undefined) {
      return [];
    }

    // get all users
    const allUsers = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, undefined, undefined));

    // only add users which are not the current user and remove passwords
    let allOtherUsers = [];
    for (let user of allUsers) {
      if (user.id !== currentUser.id) {
        allOtherUsers.push({ id: user.id, name: user.name });
      }
    }

    return allOtherUsers;
  }

  //#endregion
}