# lambda-pack

Package your AWS Lambda efficiently, ready to be deployed with [apex/up](https://github.com/apex/up)

### Installation

Install and save to devDependencies:
```bash
npm install --save-dev lambdapack
```

### Project configuration

Run for the first time in your node.js project root folder:

```bash
npx lambdapack
```

This will setup everything that is needed:
- Add scripts to `package.json`
- Create `webpack.config.babel.js` file
- Create/Update `.babelrc` config file
- Create/Update `up.json` file

### Deploy

Now you can deploy using [apex/up](https://github.com/apex/up):

```bash
up
```

and

```bash
up deploy production
```

### Future improvements

- Bundle Node.js 8 (or latest) inside package
- Allow to customize the whitelist and blacklist
- Support other deployment methods other than `apex/up` 
