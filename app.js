import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import routes from './routes';
import Path from 'path';
import inert from 'inert';
dotenv.config()

const init = async () => {
    // Server Configuration
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST ||'localhost'
    });

    // To render react views we use inert plugin
    await server.register(inert);
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, './client/build'),
            listing: false,
            index: true
          }
        }
      });

    // Router
    server.route(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
    console.log(`Please visit on ${server.info.uri}/index.html`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
