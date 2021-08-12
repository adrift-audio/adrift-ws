## adrift-ws

Websockets server for the [Adrift](https://github.com/adrift-audio/adrift-desktop) project

Stack: [Node](https://nodejs.org), [Socket.IO](https://socket.io), [Redis](https://www.npmjs.com/package/redis), [Typescript](https://www.typescriptlang.org)

DEV: http://localhost:5622

### Deploy

```shell script
git clone https://github.com/adrift-audio/adrift-ws
cd ./adrift-ws
nvm use 16
npm i
```

### Environment variables

The `.env` file is required, see [.env.example](.env.example) for details

### Launch

```shell script
npm run dev
```

### Lint

```shell script
npm run lint
```

Using [ESLint](https://eslint.org)

### License

[MIT](LICENSE.md)
