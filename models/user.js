
const knexBd = require('../database/connection');
const bcrypt = require('bcrypt');

class users{

    async newUsers(newUsers){
        try{

            await knexBd.insert({
                name: newUsers.name,
                email: newUsers.email,
                password: newUsers.password,
                role: 0 //role por padrão recebe 0
            }).table('users')
            
        }catch(error){
            console.log(error)
        }
    }

}


module.exports = new users();
