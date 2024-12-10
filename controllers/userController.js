

const users = require('../models/user');
class userController{

    async index(req, res){}

    async create(req, res){
        var { nameVar, emailVar, passwordVar } = req.body;

        if (nameVar === '' || emailVar === '' || passwordVar === '') {
            return res.status(400).send('Bad request my friend: Some fields are EMPTY');
        }
        
        if (nameVar === undefined || emailVar === undefined || passwordVar === undefined) {
            return res.status(403).send('Its UNDEFINED my friend');
        }

        await users.newUsers({
            name: nameVar,
            email: emailVar,
            password: passwordVar
        })
        return res.status(200).send('its OK my friend')

    }
}


module.exports = new userController();