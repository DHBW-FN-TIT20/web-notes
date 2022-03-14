// @ts-check
import { createClient, PostgrestResponse } from '@supabase/supabase-js'

/**
 * DataBase Model to Connect BackendController with Supabase DB
 * @category API
 */
export class DatabaseModel {
  //#region Variables
  static CLIENT;
  //#endregion

  //#region Constructor
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    DatabaseModel.CLIENT = createClient(supabaseUrl, supabaseAnonKey);
  }

  //#endregion

  //#region Universal Methods

  /**
   * Checks if DB-Response is sucessfull
   * @param {PostgrestResponse<any>} dbResponse Response of DB
   * @returns {boolean} if Response Sucessful
   */
  evaluateSuccess(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log("evaluateSuccess: ", dbResponse.error)
      return false;
    }
    return true;
  }

  //#endregion

  //#region User Methods

  /**
   * This mehtod extracts user object from db response
   * @param {PostgrestResponse<{id: number, name: string, password: string}>} dbResponse Response of Database
   * @returns {Array.<{id: number, name: string, password: string}>} List of user objects.
   */
  getUserFromResponse(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allUsers = [];

    for (const user of dbResponse.data) {
      allUsers.push({ id: user.id, name: user.name, password: user.password })
    }
    return allUsers;
  }

  /**
   * This is a universal select function for the user database
   * @param {number} userID  Filter userID
   * @param {string} username Filter username
   * @param {string} password Filter password (hash)
   * @returns {Promise<PostgrestResponse<{id: number, name: string, password: string}>>} DB result as list of user objects
   */
  async selectUserTable(userID = undefined, username = undefined, password = undefined) {
    let idColumnName = "";
    let usernameColumnName = "";
    let passwordColumnName = "";

    if (!(userID === undefined) && !isNaN(userID)) idColumnName = "id";
    if (!(username === undefined)) usernameColumnName = "name";
    if (!(password === undefined)) passwordColumnName = "password";

    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .eq(idColumnName, userID)
      .eq(usernameColumnName, username)
      .eq(passwordColumnName, password)

    return userResponse;
  }

  /**
   * This method adds a user to the db
   * @param {string} username username to register
   * @param {string} hashedPassword password for the user
   * @returns {Promise<PostgrestResponse<{id: number, name: string, password: string}>>} DB result as list of user objects
   */
  async addUser(username, hashedPassword) {
    const addedUser = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { name: username, password: hashedPassword },
      ]);

    return addedUser;
  }

  /** 
   * This method is used to change the password of a user
   * @param {string} newHashedPassword
   * @param {number} userID
   * @returns {Promise<PostgrestResponse<{id: number, name: string, password: string}>>} DB result as list of user objects
   */
  async changeUserPassword(newHashedPassword, userID) {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ password: newHashedPassword })
      .eq('id', userID);

    return updatedUser;
  }

  /**
   * This method removes a target user from the database
   * @param {number} targetUserID
   * @returns {Promise<PostgrestResponse<{id: number, name: string, password: string}>>} DB result as list of user objects
   */
  async deleteUser(targetUserID) {
    const deletedUser = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'id': targetUserID });

    return deletedUser;
  }

  //#endregion

  //#region Note Methods

  /**
   * This method extracts note objects from the database response
   * @param {PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>} dbResponse Response of Database
   * @returns {Array.<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>} List of user objects.
   */
  getNoteFromResponse(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log("getNoteFromResponse: ", dbResponse.error, dbResponse.data);
      return [];
    }

    const allNotes = [];

    for (const note of dbResponse.data) {
      allNotes.push({ id: note.id, title: note.title, ownerID: note.ownerID, modifiedAt: new Date(note.modifiedAt), content: note.content, inUse: note.inUse });
    }
    return allNotes;
  }

  /**
   * This is a universal select function for the note database
   * @param {number} id  Filter noteID
   * @param {string} title Filter title
   * @param {number} ownerID Filter ownerID
   * @param {Date} modifiedAt Filter modified
   * @param {string} inUse Filter in use
   * @returns {Promise<PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>>} DB result as list of note objects
   */
  async selectNoteTable(id = undefined, title = undefined, ownerID = undefined, modifiedAt = undefined, inUse = undefined) {
    let idColumnName = "";
    let titleColumnName = "";
    let ownerColumnName = "";
    let modifiedColumnName = "";
    let inUseColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(title === undefined)) titleColumnName = "title";
    if (!(ownerID === undefined) && !isNaN(ownerID)) ownerColumnName = "ownerID";
    if (!(modifiedAt === undefined)) modifiedColumnName = "modifiedAt";
    if (!(inUse === undefined)) inUseColumnName = "inUse";

    const noteResponse = await DatabaseModel.CLIENT
      .from('Note')
      .select()
      .eq(idColumnName, id)
      .eq(titleColumnName, title)
      .eq(ownerColumnName, ownerID)
      .eq(modifiedColumnName, modifiedAt)
      .eq(inUseColumnName, inUse)
      .order('modifiedAt', { ascending: true });

    return noteResponse;
  }

  /**
   * This method creates a new note.
   * @param {number} ownerID
   * @param {string} inUse
   * @param {string} title
   * @param {string} content
   * @returns {Promise<PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>>} DB result as list of note objects
   */
  async addNote(ownerID, inUse, title, content) {
    const addedNote = await DatabaseModel.CLIENT
      .from('Note')
      .insert([
        { ownerID: ownerID, inUse: inUse, title: title, content: content },
      ]);

    return addedNote;
  }

  /**
   * This method updates a note.
   * @param {number} noteID NoteID of note to update
   * @param {{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}} note Modified note (containing updated values)
   * @returns {Promise<PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>>} DB result as list of note objects
   */
  async updateNote(noteID, note) {
    const updatedNote = await DatabaseModel.CLIENT
      .from('Note')
      .update(note)
      .eq('id', noteID);

    return updatedNote;
  }

  /**
   * This method deletes a note.
   * @param {number} id
   * @returns {Promise<PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>>} DB result as list of note objects
   */
  async deleteNote(id) {
    const deletedNote = DatabaseModel.CLIENT
      .from('Note')
      .delete()
      .match({ id: id })

    return deletedNote;
  }

  //#endregion

  //#region UserNoteRelation Methods

  /**
   * This method extracts shared-note objects from the database response
   * @param {PostgrestResponse<{noteID: number, userID: number, Note: {id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}}>} dbResponse Response of Database
   * @returns {Array.<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}>} List of user objects.
   */
  getSharedNoteFromResponse(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allSharedNotes = [];

    for (const note of dbResponse.data) {
      allSharedNotes.push({ id: note.Note.id, title: note.Note.title, ownerID: note.Note.ownerID, modifiedAt: new Date(note.Note.modifiedAt), content: note.Note.content, inUse: note.Note.inUse });
    }

    allSharedNotes.sort((a, b) => a.modifiedAt.getTime() - b.modifiedAt.getTime());

    return allSharedNotes;
  }

  /**
   * This method extracts user-note relations from the databse response
   * @param {PostgrestResponse<{noteID: number, userID: number}>} dbResponse Response of Database
   * @returns {Array.<{noteID: number, userID: number}>} List of user objects.
   */
  getSharedUserNoteRelationFromResponse(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allRelations = [];

    for (const relation of dbResponse.data) {
      allRelations.push({ noteID: relation.noteID, userID: relation.userID });
    }

    return allRelations
  }

  /**
   * This is a universal select function for the UserNoteRelation database to get the shared notes
   * @param {number} userID Filter userID
   * @returns {Promise<PostgrestResponse<{noteID: number, userID: number, Note: {id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: string}}>>} DB result as list of note objects
   */
  async selectUserNoteRelationTable(userID = undefined) {
    let userIDColumnName = "";

    if (!(userID === undefined) && !isNaN(userID)) userIDColumnName = "userID";

    const noteResponse = await DatabaseModel.CLIENT
      .from('UserNoteRelation')
      .select('*, Note(*)')
      .eq(userIDColumnName, userID);

    return noteResponse;
  }

  /**
   * This is a universal select function for the UserNoteRelation database to get the note relations
   * @param {number} noteID Filter noteID
   * @returns {Promise<PostgrestResponse<{noteID: number, userID: number}>>} DB result as list of note-user relations
   */
  async selectUserRelationTable(noteID = undefined) {
    let noteIDColumnName = "";

    if (!(noteID === undefined) && !isNaN(noteID)) noteIDColumnName = "noteID";

    const noteResponse = await DatabaseModel.CLIENT
      .from('UserNoteRelation')
      .select()
      .eq(noteIDColumnName, noteID);

    return noteResponse;
  }

  /**
   * This method adds user-note relation (share note)
   * @param {number | number[]} userID
   * @param {number} noteID
   * @returns {Promise<PostgrestResponse<{noteID: number, userID: number}>>} DB result as list of note-user relations
   */
  async addUserNoteRelation(userID, noteID) {
    let relationsToInsert = [];

    let userIDs = Array.isArray(userID) ? userID : [userID];

    for (const userID of userIDs) {
      relationsToInsert.push({ noteID: noteID, userID: userID });
    }

    const addedUserNoteRelation = await DatabaseModel.CLIENT
      .from('UserNoteRelation')
      .insert(relationsToInsert);

    return addedUserNoteRelation;
  }

  /**
   * This method adds a user-note relation (share note)
   * @param {number | number[]} userID
   * @param {number} noteID
   * @returns {Promise<PostgrestResponse<{noteID: number, userID: number}>>} DB result as list of note-user relations
   */
  async deleteUserNoteRelation(userID, noteID) {

    let relationsToDelete = [];
    
    if (Array.isArray(userID)) {
      let userIDs = userID;

      for (const userID of userIDs) {
        relationsToDelete.push({ noteID: noteID, userID: userID });
      }

      const deletedUserNoteRelation = await DatabaseModel.CLIENT
        .from('UserNoteRelation')
        .delete(relationsToDelete)

      return deletedUserNoteRelation;
    }

    let userIDColumnName = "";
    if (!(userID === undefined) && !isNaN(userID)) userIDColumnName = "userID";

    let noteIDColumnName = "";
    if (!(noteID === undefined) && !isNaN(noteID)) noteIDColumnName = "noteID";

    const deletedUserNoteRelation = await DatabaseModel.CLIENT
      .from('UserNoteRelation')
      .delete()
      .eq(userIDColumnName, userID)
      .eq(noteIDColumnName, noteID);

    return deletedUserNoteRelation;
  }

  //#endregion

}