/* eslint spaced-comment: ["error", "always", { "exceptions": ["/"] }] */
var express = require('express');
var fs = require('fs');
var multer = require('multer');
const request = require('request');

var router = express.Router();
const __base = '';

//////////////////
// Index routes //
//////////////////

// Main Page
router.route('/')
  .get(function (req, res) {
    var meiFiles = [];
    var iiifFiles = [];
    fs.readdir(__base + 'public/uploads/mei', function (err, files) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (files.length !== 0) {
        var index = files.indexOf('.gitignore');
        files.splice(index, (index < 0 ? 0 : 1));
        meiFiles = files;
      }

      fs.readdir(__base + 'public/uploads/iiif', { withFileTypes: true }, function (err, files) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        files.filter(entry => { return entry.isDirectory(); }).forEach(entry => {
          let label = entry.name;
          let revisions = fs.readdirSync(__base + 'public/uploads/iiif/' + label, { withFileTypes: true });
          revisions.filter(entry => { return entry.isDirectory(); }).forEach(entry => {
            if (err) {
              console.error(err);
              res.status(500).send(err);
            } else {
              iiifFiles.push([label, entry.name]);
            }
          });
        });
        if (meiFiles.length !== 0 || iiifFiles.length !== 0) {
          res.render('index', { 'files': meiFiles, 'iiif': iiifFiles });
        } else {
          res.render('index', { 'nofiles': 'No files uploaded', 'files': meiFiles, 'iiif': iiifFiles });
        }
      });
    });
  });

// File upload using Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../../../public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage,
  limits: { filesize: 1000000, files: 2 }
}).array('resource', 2);

var genericUpload = multer({
  storage: multer.memoryStorage(),
  limits: { filesize: 100000 }
});

router.route('/upload_file')
  .post(function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return console.error(err);
      }
      // Check if two files were uploaded
      if (req.files.length !== 2) {
        for (let i = 0; i < req.files.length; i++) {
          fs.unlink(__base + 'public/uploads/' + req.files[i].originalname, function (err) {
            if (err) {
              return console.log('Failed to delete file' + err);
            }
          });
        }
        fs.readdir(__base + 'public/uploads/mei', function (err, files) {
          if (err) {
            return console.error(err);
          }
          res.render('index', { 'files': files, 'err': 'Error: must upload two files' });
        });
        return;
      }
      // rename img file to have same name as MEI
      var files = [req.files[0].originalname, req.files[1].originalname];
      var meiSplit = files[0].split('.', 2);
      var filename = meiSplit[0];
      var meiext = meiSplit[1];
      var imgext = files[1].split('.', 2)[1];
      var newImg = filename + '.' + imgext;

      // Check if valid filetypes
      if (meiext !== 'mei' || imgext !== 'png') {
        for (let i = 0; i < files.length; i++) {
          fs.unlink(__base + 'public/uploads/' + files[i], function (err) {
            if (err) {
              return console.log('Failed to delete file');
            }
          });
        }
        fs.readdir(__base + 'public/uploads/mei', function (err, files) {
          res.render('index', { 'files': files, 'err': 'Error: Invalid file type' });
        });
        return;
      } else {
        // Move files into their respective folders
        // Move MEI file
        fs.rename(__base + 'public/uploads/' + files[0], __base + 'public/uploads/mei/' + files[0], function (err) {
          if (err) {
            return console.log('Failed to rename file');
          }
        });
        // Move PNG file
        fs.rename(__base + 'public/uploads/' + files[1], __base + 'public/uploads/png/' + newImg, function (err) {
          if (err) {
            return console.log('Failed to rename file');
          }
        });
      }
      // Reload page
      res.redirect('/');
    });
  });

// Delete file TODO: Optimize function with regex
router.route('/delete/:filename')
  .get(function (req, res) {
    var meifile = req.params.filename;
    var pngfile = meifile.split('.')[0] + '.png';
    // delete file from all folders
    fs.unlink(__base + 'public/uploads/mei/' + meifile, function (err) {
      if (err) {
        return console.log('failed to delete mei file');
      }
    });
    fs.unlink(__base + 'public/uploads/png/' + pngfile, function (err) {
      if (err) {
        return console.log('failed to delete png file');
      }
    });
    res.redirect('/');
  });

// redirect to editor
router.route('/edit/:filename')
  .get(function (req, res) {
    var mei = req.params.filename;
    var bgimg = mei.split('.', 2)[0] + '.png';
    var autosave = false;
    // Check that the MEI exists
    fs.stat(__base + 'public/uploads/mei/' + mei, (err, stats) => {
      if (err) {
        console.error("File of name '" + mei + "' does not exist.");
        res.status(404).render('error', { statusCode: '404 - File Not Found', message: 'The file ' + mei + ' could not be found on the server!' });
        return;
      }
      // Check if a newer autosave exists
      fs.stat(__base + 'public/uploads/mei-auto/' + mei, (autoErr, autoStats) => {
        if (!autoErr) {
          // Check if the autosave is newer
          if (autoStats.mtimeMs > stats.mtimeMs) { // compares time of last modification in terms of ms since posix epoch (January 1 1970, 00:00 UTC)
            autosave = true;
          }
        }
        res.render('editor', { 'meifile': '/uploads/mei/' + mei, 'bgimg': '/uploads/png/' + bgimg, 'autosave': autosave });
      });
    });
  });

// redirect to salzinnes editor
router.route('/edit-iiif/:label/:rev')
  .get(function (req, res) {
    let label = req.params.label + '/' + req.params.rev;
    fs.readFile(__base + 'public/uploads/iiif/' + label + '/manifest.link', (err, data) => {
      if (err) {
        console.error('Could not find manifest for IIIF entry with label ' + label);
        console.error(err);
      } else {
        var manifest = data.toString().trim();
        let map = new Map();
        let regex = /page-(\d+)\.mei/;
        fs.readdir(__base + 'public/uploads/iiif/' + label, (err, files) => {
          if (err) {
            console.error(err);
          } else {
            files.filter(file => { return regex.test(file); }).forEach(mei => {
              let num = parseInt(regex.exec(mei)[1]);
              let contents = fs.readFileSync(__base + 'public/uploads/iiif/' + label + '/' + mei).toString();
              map.set(num, contents);
            });
            res.render('editor', { 'manifest': manifest, 'meiMap': encodeURIComponent(JSON.stringify([...map])) });
          }
        });
      }
    });
  });

router.route('/add-iiif').get(function (req, res) {
  res.render('add-iiif', {});
}).post(function (req, res) {
  if (req.body.manifest === undefined || req.body.revision === undefined) {
    res.render('add-iiif', { messages: 'All fields are required!' });
  } else {
    request(req.body.manifest, (error, response, body) => {
      if (error) {
        res.render('add-iiif', { messages: error });
      } else if (!response.statusCode === 200) {
        res.render('add-iiif', { messages: 'Received status code ' + response.statusCode });
      } else {
        let manifest;
        try {
          manifest = JSON.parse(body);
        } catch (e) {
          res.render('add-iiif', { messages: 'URL was not to a valid JSON object.' });
        }
        if (manifest['@context'] !== 'http://iiif.io/api/presentation/2/context.json' ||
            manifest['@type'] !== 'sc:Manifest') {
          res.render('add-iiif', { messages: 'URL was not to a IIIF Presentation manifest.' });
        }

        // Check if a revision for this already exists.
        let label = manifest.label;
        if (label === undefined) {
          res.status(400).render('error', {
            statusCode: '400 - Bad Request',
            message: 'The provided manifest does not have a label and cannot be processed.'
          });
        }
        let directoryExists = true;
        try {
          fs.accessSync(__base + 'public/uploads/iiif/' + label + '/' + req.body.revision);
        } catch (e) {
          directoryExists = false;
        }
        if (directoryExists) {
          res.render('add-iiif', { messages: 'The revision specified already exists!' });
          return;
        }

        // Create appropriate directory
        fs.mkdir(__base + 'public/uploads/iiif/' + label + '/' + req.body.revision, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send(err.message);
          }
          fs.writeFile(__base + 'public/uploads/iiif/' + label + '/' + req.body.revision + '/metadata.json',
            JSON.stringify({ manifest: req.body.manifest, pages: [] }),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send(err.message);
              }
              res.render('add-mei-iiif', { label: label, rev: req.body.revision });
            });
        });
      }
    });
  }
});

router.route('/add-mei-iiif/:label/:rev').post(genericUpload.single('mei'), function (req, res) {
  res.status(501).render('error', {
    statusCode: '501 - Not Implemented',
    message: 'Adding a IIIF manifest and MEI files is not fully supported yet. Sorry!'
  });
});

module.exports = router;
