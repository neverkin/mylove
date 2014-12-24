module.exports = function(app) {
  app.get('/', function(req, res) {
  	var user = req.session.user;
  	res.render('index', {
  	  title: 'home',
  	  user: user
  	})
  })
}