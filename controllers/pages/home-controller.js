const path = require('path');
const gm = require('getmac');
const find = require('find');

// 1. Get user's mac address
// this will be used for naming unique localStorage key
let vitalData;
gm.getMac((err, macAddress) => {
    if (err) {
        vitalData = 'GodIsGood777';
    }

    // Final and clean mac address
    vitalData = macAddress;
});

// 2. This section will get the all frontend.bundle.js files
// and inject them to the footer.html of the app
const filePath = path.join(path.basename(path.dirname('../')), 'public/dist/');
const fileNames = ['app', 'runtime', 'vendors'];
let appJS, runtimeJS, vendorsJS;

// 2.1 Process each file
fileNames.forEach((name) => {
    // Find in the root/public/dist/ a file that has 'app', 'runtime', or 'vendors' string on it
    const regex = new RegExp(`(?:^|\\W)${name}(?:$|\\W)`);

    if (name === 'app') {
        find.file(regex, filePath, (files) => {
            appJS = files[0].replace('public/dist/', '');
        });
    } else if (name === 'runtime') {
        find.file(regex, filePath, (files) => {
            runtimeJS = files[0].replace('public/dist/', '');
        });
    } else if (name === 'vendors') {
        find.file(regex, filePath, (files) => {
            vendorsJS = files[0].replace('public/dist/', '');
        });
    }
});

// 3. Controller for your homepage or index
function renderHome(req, res) {
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
}

export default renderHome;
