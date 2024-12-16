
const knexBd = require('../database/connection');
const bcrypt = require('bcrypt');
const passwordTokenModel = require('./passwordToken');


class users{
    async findAll(){
        try{
            var dataUsers = await knexBd.select('id', 'name', 'email', 'role')
            .from('users');
            return dataUsers;

        }catch(error){
            console.log(error);
            return [];
        }
    }

    async findById(idVar){
        try{
            var idUser = await knexBd.select('id', 'name', 'email', 'role')
            .where({
                id: idVar
            }).from('users');

            if(idUser.length > 0){
                return idUser[0];
            }else{
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email){
        try{
            var emailfind = await knexBd.select()
            .where({
                email: email
            }).from('users');

            if(emailfind.length > 0){
                return emailfind[0];
            }else{
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async createUsers(newUsers){
        try{

            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(newUsers.password, salt)

            await knexBd.insert({
                name: newUsers.name,
                email: newUsers.email,
                password: hash,
                role: 0 //role por padrão recebe 0
            }).table('users')
            
        }catch(error){
            console.log(error)
        }
    }

    async findEmail(emailVar){
        try{

            var result = await knexBd.select('*').from('users').where({
                email: emailVar
            })

            //if array returned by result for bigger than 0, 
            //so exists a similar email
            if(result.length > 0){
                return true
            }else{
                return false
            }

        }catch(error){
            console.log(error)
        }
    }

    async updateUsers(idVar, nameVar, emailVar, roleVar){
        try{
            var user = await this.findById(idVar);
            var emailExist = await this.findEmail(emailVar);
            var editUser = {};

            if(!user){
                return {
                    status: false,
                    error: 'User doesn`t exist'
                }
            }else{
                if(emailVar != user.email){
                    editUser.email = emailVar;
                }else{
                    return {
                        status: false,
                        error: 'User email already exist'
                    }
                }
            }

            if(nameVar != undefined){
                editUser.name = nameVar
            }

            if(roleVar != undefined){
                editUser.role = roleVar
            }

            await knexBd.update(editUser).where({
                id: idVar
            }).from('users')
            return {
                status: true
            }

        }catch(error){
            return {
                status: false,
                error: error
            }
        }
    }

    async deleteUsers(idVar){
        try{
            var idFind = await this.findById(idVar);
            if(!idFind){
                console.log('Id not found');
                return {
                    status: false,
                    error: `User by id: ${idVar} doesn't exist!!!`
                }
            }

            await knexBd('users').where({ 
                id: idVar 
            }).delete();
            console.log(`Sucess user delete by id: ${idVar}`);
            return {
                status:true
            };  
        }
        catch(error){
            console.error('Error deleting user:', error);
            return {
                status: false
            };
        };
    }

    async newPassword(newPass, idVar, token){
        try{
            var newHash = await bcrypt.hash(newPass, 10);

            await knexBd.update({
                password: newHash 
            }).where({id: idVar}).from('users')

            await passwordTokenModel.tokenUsed(token)
            console.log('tokenUsed changed')
        }
        catch(error){
            return {
                status: false,
                error: 'Error to change password' 
            }
        }
    }

}


module.exports = new users();
