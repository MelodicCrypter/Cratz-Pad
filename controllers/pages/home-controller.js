const path = require('path');

// Controller for your homepage or index
const renderHome = (req, res) => {
    res.render('index', {
        // for es6Renderer
        locals: {
            pageTitle: 'Cratz Pad | Write All You Want',
            title: 'Cratz Pad',
        },
        partials: {
            header: path.resolve('views/partials/header.html'),
            footer: path.resolve('views/partials/footer.html'),
        },
    });
};

module.exports = { renderHome };
