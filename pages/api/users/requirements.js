/**
 * Function to check whether the given username meets the requirements.
 * @param {string} name username to check
 * @returns {boolean} true if username meets requirements, false if not
 */
function isUsernameValid(name) {
  /**
   * Requirements:
   * Length: 4-16 characters
   * Characters: only letters and numbers
   * Keyword admin is not allowed
   */
  if (name.length >= 4 && name.length <= 16) {
    if (name.match("^[a-zA-Z0-9]+$")) {
      if (name.match("[a-z,A-Z,0-9]*[a,A][d,D][m,M][i,I][n,N][a-z,A-Z,0-9]*")) {
        return false;
      }
      return true;
    }
  }
  return false;
}

/**
 * Funciton to check whether the given password meets the requirements.
 * @param {string} password password to check
 * @returns {boolean} true if password meets requirements, false if not
 */
function isPasswordValid(password) {
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

export { isUsernameValid, isPasswordValid }