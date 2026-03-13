// ここには他の場所で使うと思う物を入れておく場所
export function getElementName(name) { return document.getElementsByName(name); }
export function getElementTag(tagName) { return document.getElementsByTagName(tagName); }
export function getElementClass(className) { return document.getElementsByClassName(className); }
export function getElementById(idName) { return document.getElementById(idName);  }
export function createElement(elmName) { return document.createElement(elmName); }
export function add(body, element) { body.appendChild(element); }
export function remove(body, element) { body.removeChild(element); }