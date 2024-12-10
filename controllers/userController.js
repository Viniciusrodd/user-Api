

class userController{

    async index(req, res){}

    async create(req, res){
        var { name, email, password } = req.body;

        if (name === '' || email === '' || password === '') {
            return res.status(400).send('Bad request my friend: Some fields are EMPTY');
        }
        
        if (name === undefined || email === undefined || password === undefined) {
            return res.status(403).send('Its UNDEFINED my friend');
        }

        console.log(req.body);
        return res.status(200).send('Its OK my friend');
    }
}


module.exports = new userController();