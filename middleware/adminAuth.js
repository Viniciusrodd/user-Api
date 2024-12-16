
const jwt = require('jsonwebtoken');
var secretToken = 'dsadsadasdsajdshalkhlkhaa';


module.exports = function(req, res, next){
    const authToken = req.headers['authorization'];

    if(!authToken){
        return res.status(403).send('Header token not sended');
    }

    const bearer = authToken.split(' ');
    var tokenVar = bearer[1];

    try{
        var encoded = jwt.verify(tokenVar, secretToken);

        if(encoded.role < 1){
            return res.status(403).send('(Unauthorized) You`re not a admin, my friend');
        }else{
            console.log(encoded);
            next();        
        }
    }
    catch(error){
        return res.status(403).send('Invalid token');
    }
}