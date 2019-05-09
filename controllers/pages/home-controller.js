const path = require('path');
const gm = require('getmac');

// Get user's mac address
// this will be used for naming unique localStorage key
let vitalData;
gm.getMac((err, macAddress) => {
    if (err) {
        vitalData = 'GodIsGood777';
    }

    vitalData = macAddress;
});

// Controller for your homepage or index
const renderHome = (req, res) => {
    res.render('index', {
        // for es6Renderer
        locals: {
            pageTitle: 'Cratz Pad | Write All You Want',
            title: 'Cratz Pad',
            vital: vitalData.toString(),
        },
        partials: {
            header: path.resolve('views/partials/header.html'),
            footer: path.resolve('views/partials/footer.html'),
        },
    });
};

module.exports = { renderHome };
