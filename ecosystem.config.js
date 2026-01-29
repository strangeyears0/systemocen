module.exports = {
    apps: [{
        name: 'teacher-panel-backend',
        cwd: '/root/systemocen/server',
        script: 'server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
            NODE_ENV: 'production'
        },
        error_file: '/root/systemocen/logs/err.log',
        out_file: '/root/systemocen/logs/out.log',
        time: true
    }]
};
