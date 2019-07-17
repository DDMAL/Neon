const template = require('./template.html');

function setBody () {
  document.body.innerHTML = template;
}

export { setBody as default };
