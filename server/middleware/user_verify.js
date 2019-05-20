var jwt = require('jsonwebtoken');
var secret = require('../config').jwt_secret;

let auth = (req, res, next) => {
    // 获取请求头 authorization
    let authorization = req.headers["authorization"];
    console.log(req.headers,authorization)
   
    // 如果存在，则获取 token
 
    if (authorization) {
        let token = authorization;
        try {
            // 对 token 进行校验

            jwt.verify(token,secret,{algorithm:'Hs256'},(err,decoded)=>{
                if(err){
                    console.log(err)
                    next(err)
                }else{
                    console.log(decoded)
                    next()
                }
            })
        } catch (e) {
            res.status(401).send("Not Allowed");
        }
    
    } else {
        res.status(401).send("Not Allowed");
    }
    
 
}
module.exports = auth

 