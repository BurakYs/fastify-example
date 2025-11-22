import '@/bootstrap';
import Server from '@/server';

const server = new Server();
server
  .start()
  .then(() => {
    const terminationSignals = ['SIGINT', 'SIGTERM'];

    for (const signal of terminationSignals) {
      process.on(signal, async () => {
        await server.shutdown();
        process.exit(0);
      });
    }
  })
  .catch(async (err) => {
    global.logger.error(err);
    await server.shutdown();
    process.exit(1);
  });

process.on('unhandledRejection', (error) => global.logger.error(error));
process.on('uncaughtException', (error) => global.logger.error(error));
