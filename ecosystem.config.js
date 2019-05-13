module.exports = {
    apps: [{
        name: 'CratzPad',
        script: 'app-back-bundle.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
    }],

    deploy: {
        production: {
            user: 'node',
            host: 'cratzpad.herokuapp.com',
            ref: 'origin/master',
            repo: 'git@github.com:MelodicCrypter/Cratz-Pad.git',
            path: 'app-back-bundle.js',
            'post-deploy': 'yarn install && pm2-runtime reload ecosystem.config.js --env production',
        },
    },
};
