
const knexBd = require('../database/connection');
const bcrypt = require('bcrypt');

class users{

    async newUsers(newUsers){
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

            var result = await knexBd.select('*').from('users')
            .where({
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

}


module.exports = new users();
