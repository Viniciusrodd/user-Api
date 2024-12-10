

class HomeController{

    async index(req, res){
        console.log(req.body)
        res.send(`<h1>APP EXPRESS! - Guia do programador</h1>`);
    }

}

module.exports = new HomeController();