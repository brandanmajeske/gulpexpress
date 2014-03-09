
/*
 * GET Home Page
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express w/ Gulp' });
};

exports.home = function(req, res){
  res.render('index', { title: 'Express w/ Gulp - Home Link' });
};

/*
* GET About Page
*/

exports.about = function(req, res){
	res.render('about', {title: 'About GulpExpress'});
};

/*
* GET Contact Page
*/
exports.contact = function(req, res){
	res.render('contact', {title: 'Contact Page'});
}