(function launch(): Promise<any> {
  if (process.env.ENV === 'heroku') {
    return import('./server');
  }

  return import('dotenv').then(({ default: dotenv }) => {
    dotenv.config();
  });
}());
