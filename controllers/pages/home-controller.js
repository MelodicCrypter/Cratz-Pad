const path = require('path');
const gm = require('getmac');
const find = require('find');

// Get user's mac address
// this will be used for naming unique localStorage key
let vitalData;
gm.getMac((err, macAddress) => {
    if (err) {
        vitalData = 'GodIsGood777';
    }

    vitalData = macAddress;
});

// This will get the frontend.bundle.js files
let appJS;
let vendorsJS;
let runtimeJS;
find
    .file(/(?:^|\W)app(?:$|\W)/, path.join(__dirname, '../../public/dist/'), (files) => {
        appJS = files[0].replace('public/dist/', '');
    })
    .error((err) => {
        if (err) {
            //console.log(err);
        }
    });

find
    .file(/(?:^|\W)runtime(?:$|\W)/, path.join(__dirname, '../../public/dist/'), (files) => {
        runtimeJS = files[0].replace('public/dist/', '');
    })
    .error((err) => {
        if (err) {
            //console.log(err);
        }
    });

find
    .file(/(?:^|\W)vendors(?:$|\W)/, path.join(__dirname, '../../public/dist/'), (files) => {
        vendorsJS = files[0].replace('public/dist/', '');
    })
    .error((err) => {
        if (err) {
            //console.log(err);
        }
    });

// Controller for your homepage or index
const renderHome = (req, res) => {
    res.render('index', {
        // for es6Renderer
        locals: {
            pageTitle: 'Cratz Pad | Write All You Want',
            title: 'Cratz Pad',
            vital: vitalData.toString(),
            appJS,
            runtimeJS,
            vendorsJS,
        },
        partials: {
            header: path.resolve('views/partials/header.html'),
            footer: path.resolve('views/partials/footer.html'),
        },
    });
};

module.exports = { renderHome };
