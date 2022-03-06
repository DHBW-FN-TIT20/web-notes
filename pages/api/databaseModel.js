import { createClient } from '@supabase/supabase-js'

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
   * Gets der IUserFromResponse
   * @param {PostgrestResponse<{id: number, name: string, password: string}>} dbResponse Response of Database
   * @returns {[{id: number, name: string, password: string}]} List of user objects.
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
   * @param {string} hashedPassword Filter password (hash)
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
   * @param {string} user username to register
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

}