// @ts-check
import jwt from 'jsonwebtoken'

/**
 * This is the Frontend Controller of web-notes
 */
export class FrontEndController {
  static userTokenName = "webnotes.auth.token";

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

  static async saveNote(note) {

    console.log(note);

    const response = await fetch('./api/notes/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        note: note,
      })
    });

    const data = await response.json();
    return data.wasSuccessfull;
  }

  //#endregion
}
