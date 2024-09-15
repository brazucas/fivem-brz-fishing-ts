## BRZ.GG fishing script

[![brz-fishing-ci](https://github.com/brz-gta5/fivem-brz-fishing-ts/actions/workflows/brz-fishing-ci.yml/badge.svg)](https://github.com/brz-gta5/fivem-brz-fishing-ts/actions/workflows/brz-fishing-ci.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/0ee2efc6d497410325d1/maintainability)](https://codeclimate.com/github/brz-gta5/fivem-brz-fishing-ts/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/0ee2efc6d497410325d1/test_coverage)](https://codeclimate.com/github/brz-gta5/fivem-brz-fishing-ts/test_coverage)

# brz-fishing

Highly maintainable and customisable FiveM fishing script written in TypeScript.

## Supported frameworks

- [x] qb-core, qb-inventory
- [x] Quasar Framework implementation for QBCore (qs-inventory)

Note: ESX or any other framework is not supported at the moment, feel free to contribute or open a feature request.

## 👨‍💻 Contributing

1. Fork the repository
2. Install NodeJS, nvm is recommended.
3. Install the correct Node version with `nvm install`
4. Install dependencies with `yarn`
5. Work on your changes and test them with `yarn test`
6. Make sure the build is successful with `yarn build`
7. Create a pull request

Note: Contributions not covered by tests will not be accepted.

## 🧞 Commands

All available commands in package.json:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `yarn`                 | Installs dependencies                              |
| `yarn build`           | Build the production script to `./dist/`           |
| `yarn test`            | Runs all unit & e2e tests                          |
| `docker-compose up`    | Uses Docker for running dev environment            |