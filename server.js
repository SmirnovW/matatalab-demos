
// Include the server in your file
const server = require('server');
const { get } = server.router;
const { render } = server.reply;

server({
        security: {
            csrf: false,
        }},
    [
        get('/', () => render('/public/index.html')),
    ]
);