-- INSTALLING BRZ-FISHING
-- Copy the following code to the config.lua file in your qb-core shared folder
-- Do not replace all your QBShared.Items object, just add the items below to your file.

Config.Products = {
    ['gearshop'] = {
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
    }
}