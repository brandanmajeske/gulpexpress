
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express w/ Gulp' });
};

/*
* GET Hello World
*/

exports.helloworld = function(req, res){
	res.render('helloworld', {title: 'Hello World fool!!!'});
};
