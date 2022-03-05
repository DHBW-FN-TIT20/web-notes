import jwt from 'jsonwebtoken'
/**
 * This is the controller of web-notes
 */
export class FrontendController {
  static userTokenName = "webnotes.auth.token";
  constructor() {

  }

  /**
   * This method checks the username for current username requirements
   * @param {string} username username to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  static isUsernameValid = async (username) => {
    let response = await fetch('./api/users/is_username_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method checks the password for current password requirements
   * @param {string} password password to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  static isPasswordValid = async (password) => {
    let response = await fetch('./api/users/is_password_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method checks whether a given user exists in the database
   * @param {number} user name or id to check
   * @returns {Promise<boolean>} True if user exists, else false
   */
  static doesUserExist = async (user) => {
    let response = await fetch('./api/users/does_exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: user.id,
        username: user.name
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method returns the current authentication token
   * @returns {string} token of the currently logged in user
   */
  static getUserToken = () => {
    let token = localStorage.getItem(FrontendController.userTokenName);
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
  static getUsernameFromToken = (token) => {
    let content = jwt.decode(token)
    if (typeof content === "object" && content !== null) {
      return content.username
    }
    return ""
  }

  /**
   * This method returns a filled IUser object for the given user.
   * @param {string} token Token of the user
   * @returns {Promise<IUser>} IUser object with all credentials of the user from the token, empty IUser if token not valid
   */
  static getIUserFromToken = async (token) => {
    let response = await fetch('./api/users/get_iuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });
    let data = await response.json();
    return data.user;
  }

  /**
   * This method checks whether the given token has a valid signature and user
   * @param {string} token token to be verified
   * @returns {Promise<boolean>} true if signature is valid and user exists, false if not
   */
  static verifyUserByToken = async (token) => {
    // request backend for validation
    let response = await fetch('./api/users/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method logs a user in if there is a match with the database. Therfore a token is created which is stored in the browsers local storage.
   * @param {string} username Username to log in
   * @param {string} password Password for user
   * @returns {Promise<boolean>} True if login was successfull, false if not
   */
  static loginUser = async (username, password) => {
    let response = await fetch('./api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    console.log(data.userToken)
    if (data.userToken === "") {
      localStorage.removeItem("webnotes.auth.token")
      return false;
    }

    localStorage.setItem("webnotes.auth.token", data.userToken)

    return true;
  }

  /**
   * This method registers a user to the database
   * @param {string} username the username of the user to be created
   * @param {string} password the password of the user to be created
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
  static registerUser = async (username, password) => {
    let response = await fetch('./api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    if (data.wasSuccessfull) {
      await FrontendController.loginUser(username, password);
    }
    return data.wasSuccessfull;
  }

  /**
   * This mehtod loggs out the current user.
   * @returns {boolean} True if logout was successfull, false if not
   */
  static logoutUser = () => {
    localStorage.removeItem("webnotes.auth.token")
    return true;
  }


  static saveNote = async (note) => {

    console.log(note);

    let response = await fetch('./api/notes/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        note: note,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

}

export default new FrontendController();