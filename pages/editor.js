import NeonView from '../src/NeonView.js';

let mei = getGetParam('page');

NeonView({
  meifile: './mei/' + mei + '.mei',
  bgimg: './img/' + mei + '.png',
  mode: 'pages'
});

function getGetParam (paramName) {
  let result = null;

  let tmp = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === paramName) {
        result = decodeURIComponent(tmp[1]);
      }
    });
  return result;
}
