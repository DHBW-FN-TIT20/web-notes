  /**
   * This function splits the HTML input into a list of elements
   * @param {string} html The HTML string to be split into elements
   * @param {number} maxStringElements The maximum number of displayed elements.
   * @returns {string[]} The array of elements
   */
  export default function splitHTMLintoElements(html, maxStringElements) {
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