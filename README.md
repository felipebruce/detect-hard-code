# eslint-plugin-detect-hard-code

Detect hard coded strings.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

or if you use `yarn`

```
$ yarn add eslint -D
```

Next, install `eslint-plugin-detect-hard-code`:

```
$ npm install eslint-plugin-detect-hard-code --save-dev
```

or

```
$ yarn add eslint-plugin-detect-hard-code -D
```

## Usage

Add `detect-hard-code` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["detect-hard-code"],
  "rules": {
    "detect-hard-code/detect-hard-code": "error"
  }
}
```
