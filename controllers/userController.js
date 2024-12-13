

const usersModel = require('../models/user');
class userController{

    async findUsers(req, res){
        var usersFinded = await usersModel.findAll();
        res.status(200).json(usersFinded);
    }

    async findUsersbyId(req, res){
        var idVar = req.params.id;
        var userFinded = await usersModel.findById(idVar);

        if(!userFinded){
            res.status(404).json({});
        }else{
            res.status(200).json(userFinded);
        }
    }

    async create(req, res){
        var { nameVar, emailVar, passwordVar } = req.body;

        if (nameVar === '' || emailVar === '' || passwordVar === '') {
            return res.status(400).send('Bad request my friend: Some fields are EMPTY');
        }
        
        if (nameVar === undefined || emailVar === undefined || passwordVar === undefined) {
            return res.status(403).send('Its UNDEFINED my friend');
        }

        var emailExist = await usersModel.findEmail(emailVar)
        if(emailExist){
            return res.status(406).send('Your email already exist')
        }

        await usersModel.createUsers({
            name: nameVar,
            email: emailVar,
            password: passwordVar
        })
        return res.status(200).send('its CREATED my friend')

    }

    async editUsers(req, res){
        var {id, name, email, role} = req.body;

        var result = await usersModel.updateUsers(id, name, email, role);
        if(result.status){
            res.status(200).send('Users updated');
        }else{
            res.status(406).json(result);
        }
    }

    async delete(req, res){
        var id = req.params.id;

        var result = await usersModel.deleteUsers(id);

        if(result.status === true){
            var newusers = await usersModel.findAll()
            return res.status(200).json(newusers);
        }

        if(result.status === false){
            return res.status(400).send(result.error);
        }
    }

}


module.exports = new userController();