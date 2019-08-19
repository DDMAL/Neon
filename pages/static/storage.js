const db = new PouchDB('Neon-User-Storage');

getAllDocuments().then(response => {
  const storage = document.getElementById('storage-selector');
  for (const doc of response.rows) {
    const option = document.createElement('option');
    option.setAttribute('value', doc.id);
    option.textContent = doc.id;
    storage.appendChild(option);
  }
}).catch(err => {
  console.error(err);
});

document.getElementById('generate-storage-form').onsubmit = (evt) => {
  evt.preventDefault();
  if (evt.target.checkValidity()) {
    const mei = document.getElementById('upload-mei').files[0];
    const bg = document.getElementById('upload-bg').files[0];
    createManifest(mei, bg).then(manifest => {
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'applicaton/ld+json' });
      return addEntry(mei.name, manifestBlob);
    }).then(() => {
      window.location.reload();
    }).catch(err => {
      console.error(err);
    });
  }
};

document.getElementById('add-storage-form').onsubmit = (evt) => {
  evt.preventDefault();
  if (evt.target.checkValidity()) {
    const file = document.getElementById('upload-manifest').files[0];
    console.log(file);
    addEntry(file.name, file).then(() => {
      window.location.reload();
    }).catch(err => {
      console.error(err);
    });
  }
};

document.getElementById('remove-button').onclick = (evt) => {
  const form = document.getElementById('user-form');
  if (form.checkValidity()) {
    const selectedIndex = document.getElementById('storage-selector').selectedIndex;
    if (selectedIndex >= 0) {
      const option = document.getElementById('storage-selector')[selectedIndex];
      deleteEntry(option.value).then(response => {
        window.location.reload();
      }).catch(err => {
        console.error(err);
      });
    }
  }
};

function getAllDocuments () {
  return new Promise((resolve, reject) => {
    db.allDocs().then(result => { resolve(result); })
      .catch(err => { reject(err); });
  });
}

function createManifest (mei, bg) {
  const manifest = {
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      {
        'schema': 'http://schema.org/',
        'title': 'schema:name',
        'timestamp': 'schema:dateModified',
        'image': {
          '@id': 'schema:image',
          '@type': '@id'
        },
        'mei_annotations': {
          '@id': 'Annotation',
          '@type': '@id',
          '@container': '@list'
        }
      }
    ],
    '@id': 'test-id',
    'title': mei.name,
    'timestamp': (new Date()).toISOString()
  };
  return new Promise((resolve, reject) => {
    let meiUri, bgUri;
    const meiPromise = new Promise(resolve => {
      const meiReader = new window.FileReader();
      meiReader.addEventListener('load', () => {
        resolve(meiReader.result);
      });
      meiReader.readAsDataURL(mei);
    });
    const bgPromise = new Promise(resolve => {
      const bgReader = new window.FileReader();
      bgReader.addEventListener('load', () => {
        resolve(bgReader.result);
      });
      bgReader.readAsDataURL(bg);
    });
    meiPromise.then(uri => {
      meiUri = uri;
      return bgPromise;
    }).then(uri => {
      bgUri = uri;
      manifest['image'] = bgUri;
      manifest['mei_annotations'] = [
        {
          'id': 'test-id-2',
          'type': 'Annotation',
          'body': meiUri,
          'target': bgUri
        }
      ];
      resolve(manifest);
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
}

/**
 * @param {string} title
 * @param {Blob} content
 * @returns {Promise}
 */
function addEntry (title, content) {
  return new Promise((resolve, reject) => {
    db.put({
      _id: title,
      _attachments: {
        manifest: {
          content_type: 'application/ld+json',
          data: content
        }
      }
    }).then(response => {
      resolve(true);
    }).catch(err => {
      reject(err);
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
