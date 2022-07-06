const multer = require('multer');
const path = require('path');
const wallet = require('../models/b2b.walletAccount.model');

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '../../public/images/wallet'));
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      callback(null, true);
    } else {
      console.log('Only png And Jpg file supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 5024 * 5024 * 5,
  },
});

module.exports = upload;