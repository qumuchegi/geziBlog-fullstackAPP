var multer  = require('multer')

var storage = (destination)=> multer.diskStorage({
    destination,
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      //console.log('中间件',file,'完')
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = destination => multer({ storage: storage(destination), fileFilter: imageFilter})

  module.exports = upload