// @ts-check
import { createClient, PostgrestResponse } from '@supabase/supabase-js'

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
   * Gets der UserFromResponse
   * @param {PostgrestResponse<{id: number, name: string, password: string}>} dbResponse Response of Database
   * @returns {{id: number, name: string, password: string}[]} List of user objects.
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
   * API function to register a user
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
   * This function is used to reset the password of a user
   * @param {string} newHashedPassword
   * @param {number} userID
   * @returns {Promise<PostgrestResponse<{id: number, name: string, password: string}>>} DB result as list of user objects
   */
  async changeUserPassword(newHashedPassword, userID) {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ hashedPassword: newHashedPassword })
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
   * Gets notes from the database response
   * @param {PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}>} dbResponse Response of Database
   * @returns {{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}[]} List of user objects.
   */
   getNoteFromResponse(dbResponse) {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
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
   * @param {boolean} inUse Filter in use
   * @returns {Promise<PostgrestResponse<{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}>>} DB result as list of note objects
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

  //#endregion

  //#region UserNoteRelation Methods

  /**
   * Gets notes from the database response
   * @param {PostgrestResponse<{noteID: number, userID: number, Note: {id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}}>} dbResponse Response of Database
   * @returns {{id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}[]} List of user objects.
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
   * This is a universal select function for the UserNoteRelation database
   * @param {number} userID Filter userID
   * @returns {Promise<PostgrestResponse<{noteID: number, userID: number, Note: {id: number, title: string, ownerID: number, modifiedAt: Date, content: string, inUse: boolean}}>>} DB result as list of note objects
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

  //#endregion

}