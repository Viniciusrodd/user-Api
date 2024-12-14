
var knexBd = require('../database/connection');
var userModel = require('./user')


class passwordToken{
    async create(emailVar){
        try{
            var user = await userModel.findByEmail(emailVar);
            var tokenVar = String(Date.now());

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
            }).table("passwordtokens")

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

    async validate(tokenVar){
        try{
            var tokenData = await knexBd.select()
            .where({
                token: tokenVar
            }).from("passwordtokens")

            if(tokenData[0].used < 1){
                console.log('Token never used (0)')
                return {
                    status: true,
                    token: tokenData
                }
            }else{
                console.log('token already used')
            }

        
        }
        catch(error){
            return {
                status: false,
                error: 'error to find token'
            }
        }
    }
}

module.exports = new passwordToken();