// Diplays the home page

module.exports.getIndex = (req, res, next) => {
    res.render('./index/index.ejs', {
        pageTitle: 'Home',
        path: '/',
        title: 'HOME' 
    });
}