var express = require('express');
var router = express.Router();
 
var upload = require('../middleware/multerPicture');
const auth = require('../middleware/user_verify');

router.post('/modifyblogpicture',auth, upload('server/asset/blogImg').any(), (req,res,next) => {
    let blogPicture = req.files[0]
    let uploader = res.body
    console.log(blogPicture,uploader)
    res.json({code:0,data:{pictureURL:blogPicture.path}})

})

 
module.exports = router
