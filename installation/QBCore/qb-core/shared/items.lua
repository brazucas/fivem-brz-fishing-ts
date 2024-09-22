-- INSTALLING BRZ-FISHING
-- Copy the following code to the items.lua file in your qb-core shared folder
-- Do not replace all your QBShared.Items object, just add the items below to your file.

QBShared.Items = {
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
    }
    -- ...
}