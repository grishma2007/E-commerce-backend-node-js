var jwt = require('jsonwebtoken');

module.exports = auth = (req, res, next) => {

    console.log(req.headers.token);
    
    jwt.verify(req.headers.token, 'abc', function (err, decoded) {
      
        if(err){
            
            res.status(401).send("Unauthorized Access");
        }else{
            next();  
        }
    });
}
 