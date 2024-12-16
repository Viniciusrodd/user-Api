
var usersModel = require('../models/user');
var passwordTokenModel = require('../models/passwordToken');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');


var secretToken = 'dsadsadasdsajdshalkhlkhaa';


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
            res.status(200).send(userFinded);
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

    async passwordRecover(req, res){
        var email = req.body.email;

        try{
            var result = await passwordTokenModel.createToken(email)

            if(!result.status){
                return res.status(400).send(result.error);
            }
            return res.status(200).send(result.token);
        }
        catch(error){
            return res.status(404).send('Email send not found my friend!!' + error);
        }
    }

    async changePassword(req, res){
        var tokenVar = req.body.token;
        var passwordVar = req.body.password;

        try{
            var isTokenValid = await passwordTokenModel.validate(tokenVar)

            if(!isTokenValid.status){
                res.status(406).send('Token invalidated');
            }

            await usersModel.newPassword(
                passwordVar, 
                isTokenValid.token[0].user_id,
                isTokenValid.token[0].token
            )
            res.status(200).send('Password changed successfully');
        }
        catch(error){
            return res.status(404).send('Token already used my friend');
        }
    }

    async login(req, res){
        var {emailVar, passwordVar} = req.body;

        try{
            var userData = await usersModel.findByEmail(emailVar);

            if(!userData){
                return res.status(406).send({
                    status: false, 
                    error: 'User email not found'
                })
            }

            var result = await bcrypt.compare(passwordVar, userData.password)
            if(!result){
                return res.status(406).send({
                    status: false, 
                    error: 'User password not found'
                })
            }

            var tokenVar = jwt.sign({
                email: userData.email,
                role: userData.role
            }, secretToken)

            return res.status(200).json({
                status: true, 
                result: result,
                token: tokenVar
            })    
        }
        catch(error){
            return res.status(404).send('Login failed');
        }
    }
}


module.exports = new userController();