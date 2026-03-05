// ここには他の場所で使うと思う物を入れておく場所
export function createElement(tagName) { return document.createElement(tagName); }
export function add(body, element) { body.appendChild(element); }
export function remove(body, element) { body.removeChild(element); }