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
    fs.readdir(__base + 'public/uploads/mei', function (err, files) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (files.length !== 0) {
        var index = files.indexOf('.gitignore');
        files.splice(index, (index < 0 ? 0 : 1));
        res.render('index', { 'files': files });
      } else {
        res.render('index', { 'nofiles': 'No files Uploaded', 'files': files });
      }
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
router.route('/edit-iiif')
  .get((req, res) => {
    var manifest = 'https://images.simssa.ca/iiif/manuscripts/cdn-hsmu-m2149l4/manifest.json';
    res.render('editor', { 'manifest': manifest });
  });

module.exports = router;
