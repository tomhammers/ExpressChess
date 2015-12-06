// using routes
exports.index = function (req, res) {
	res.render('default', {
		title: 'ExpressChess'
	});
}

// exports.game = function (req, res) {
// 	res.render('default', {
// 		title: 'ExpressChess'
// 	});
// }