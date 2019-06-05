/* eslint spaced-comment: ["error", "always", { "exceptions": ["/"] }] */
var express = require('express');
var fs = require('fs');
var multer = require('multer');

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

var upload = multer({
  storage: multer.memoryStorage(),
  limits: { filesize: 100000 }
});

router.route('/upload_file')
  .post(upload.array('resource', 2), function (req, res) {
    if (req.files[1].mimetype !== 'image/png') {
      res.status(400).send('PNG file expected');
    }
    let files = [req.files[0].originalname, req.files[1].originalname];
    let meiSplit = files[0].split(/\.mei/, 2);
    let filename = meiSplit[0];
    let newImageName = filename + '.png';
    fs.writeFile(__base + 'public/uploads/mei/' + files[0], req.files[0].buffer, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      fs.writeFile(__base + 'public/uploads/png/' + newImageName, req.files[1].buffer, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        res.redirect('/');
      });
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
        res.render('404', { 'meifile': mei });
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

module.exports = router;
