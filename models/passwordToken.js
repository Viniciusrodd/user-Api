
var knexBd = require('../database/connection');
var userModel = require('./user')


class passwordToken{
    async create(emailVar){
        try{
            var user = await userModel.findEmail(emailVar);
            var tokenVar = Date.now();

            if(!user){
                return {
                    status: false,
                    error: `User email "${emailVar}" not found`
                }
            }

            await knexBd.insert({
                user_id: user.id,
                used: 0,
                token: tokenVar //Here its recommend uses a 'UUID' for token key
            }).table("passwordTokens")

            return {
                status: true,
                sucess: 'passwordTokens data generate w/ sucess',
                token: tokenVar
            }

        }
        catch(error){
            console.error("Error during create operation:", error);
            return {
                status: false,
                error: "An unexpected error occurred"
            };
        }
    }
}

module.exports = new passwordToken();