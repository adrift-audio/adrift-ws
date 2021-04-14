/**
 * Launch the server and load the environment variables if necessary
 */
(function Launch(): Promise<any> {
  const { env: { ENV = '' } = {} } = process;

  if (ENV && ENV === 'heroku') {
    return import('./server');
  }

  return import('dotenv').then(({ default: dotenv }): Promise<any> => {
    dotenv.config();
    return import('./server');
  }).catch((error: Error): Error => {
    throw error;
  });
}());
