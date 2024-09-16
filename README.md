
<div align="center">

<img width="600px" src="./.github/banner.png" alt="Common bait">

[![brz-fishing-ci](https://github.com/brz-gta5/fivem-brz-fishing-ts/actions/workflows/brz-fishing-ci.yml/badge.svg)](https://github.com/brz-gta5/fivem-brz-fishing-ts/actions/workflows/brz-fishing-ci.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/0ee2efc6d497410325d1/maintainability)](https://codeclimate.com/github/brz-gta5/fivem-brz-fishing-ts/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/0ee2efc6d497410325d1/test_coverage)](https://codeclimate.com/github/brz-gta5/fivem-brz-fishing-ts/test_coverage)

### Highly customisable fishing script for FiveM servers
</div>

## Supported frameworks

- [x] qb-core, qb-inventory
- [x] Quasar Framework implementation for QBCore (qs-inventory)

Note: ESX or any other framework is not supported at the moment, feel free to contribute or open a feature request.

## Installation
1. Download the latest package from the [releases page](https://github.com/brz-gta5/fivem-brz-fishing-ts/releases).
2. Extract the contents of the zip file into your resources folder.
3. Make sure the resource is added to your server.cfg file.
```cfg
ensure brz-fishing
```
4. Add the following items to your qb-core `items.lua` file
```lua
-- brz-fishing
['fishingrod1'] = {
    ['name'] = 'fishingrod1',
    ['label'] = 'Fishing Rod',
    ['weight'] = 80,
    ['type'] = 'item',
    ['image'] = 'fishingrod.png',
    ['unique'] = false,
    ['useable'] = true,
    ['shouldClose'] = true,
    ['combinable'] = nil,
    ['description'] = 'Common fishing rod'
},
['commonbait'] = {
    ['name'] = 'commonbait',
    ['label'] = 'Common bait',
    ['weight'] = 1,
    ['type'] = 'item',
    ['image'] = 'fishbait.png',
    ['unique'] = false,
    ['useable'] = false,
    ['shouldClose'] = false,
    ['combinable'] = true,
    ['description'] = 'Common bait. Can be found at any fishing store'
},
```
5. Allow the fishing items to be bought in your server. E.g. in qb-shops `config.lua`:
```lua
...
['gearshop'] = {
    ...
    [1] = {
        name = 'commonbait',
        price = 50,
        amount = 5000,
        info = {},
        type = 'item',
        slot = 3,
    },
    [2] = {
        name = 'fishingrod1',
        price = 200,
        amount = 100,
        info = {},
        type = 'item',
        slot = 4,
    },
},
...
```

## 🧞 Features

### qb-inventory items

| Item name                  | Description                                        |
| :--------------------- | :------------------------------------------------- |
| <img width="30px" src="./.github/fishingrod.png" alt="Common bait"> fishingrod1              | Rod object the player will be assigned with when start fishing    |
| <img width="30px" src="./.github/fishbait.png" alt="Fishing rod"> commonbait                 | Consumable item automatically used when the casting minigame finishes    |

## ⚡️ Want new features?

Sponsors gets priority support and feature requests. [Become a sponsor 💜](
    https://github.com/sponsors/pedropapa
)

## 👨‍💻 Contributing

1. Clone the repository into your local server.

```bash
cd <server_root_path>/txdata/resources
git submodule add https://github.com/brz-gta5/fivem-brz-fishing-ts.git brz-fishing
```

1. Install [NodeJS](https://nodejs.org/en/download/package-manager) and [nvm](https://github.com/nvm-sh/nvm).
   - Tip: You can quickly install nvm by running `npm install -g nvm`.
2. Install the correct Node version, project dependencies and test if tests and build are working:
```bash
cd brz-fishing
nvm install
nvm use
yarn
yarn test
yarn build
```
3. Work on your changes and test them with `yarn test`
4. Make sure the build is successful with `yarn build`
5. Create a pull request

Note: Contributions not covered by tests will not be accepted.