const template = require('html-loader!./template.html');

function setBody () {
  document.body.innerHTML = template;
}

export { setBody as default };
