var db = new PouchDB('Neon-User-Storage');

getAllDocuments().then(response => {
  let storage = document.getElementById('storage-selector');
  for (let doc of response.rows) {
    let option = document.createElement('option');
    option.setAttribute('value', doc.id);
    option.textContent = doc.id;
    storage.appendChild(option);
  }
}).catch(err => {
  console.error(err);
});

document.getElementById('add-storage-form').onsubmit = (evt) => {
  evt.preventDefault();
  if (evt.target.checkValidity()) {
    let file = document.getElementById('upload-manifest').files[0];
    console.log(file);
    addEntry(file.name, file).then(response => {
      window.location.reload();
    }).catch(err => {
      console.error(err);
    });
  }
};

function getAllDocuments () {
  return new Promise((resolve, reject) => {
    db.allDocs().then(result => { resolve(result); })
      .catch(err => { reject(err); });
  });
}

/**
 * @param {string} title
 * @param {Blob} content
 * @returns {Promise}
 */
function addEntry (title, content) {
  return new Promise((resolve, reject) => {
    (new window.Response(content)).text().then(data => {
      db.put({
        _id: title,
        content: data
      }).then(response => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  });
}

/**
 * @param {string} id
 * @returns {Promise}
 */
function deleteEntry (id) {
  return new Promise((resolve, reject) => {
    db.get(id).then(doc => {
      db.remove(doc).then(response => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
}
