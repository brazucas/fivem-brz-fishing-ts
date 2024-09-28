-- INSTALLING BRZ-FISHING
-- Copy the following code to the items.lua file in your qb-core shared folder
-- Do not replace all your QBShared.Items object, just add the items below to your file.

QBShared.Items = {
    -- Copy the items from here
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
    ['commonbait']  = {
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
    ['fish']        = {
        ['name'] = 'fish',
        ['label'] = 'Common Fish',
        ['weight'] = 5,
        ['type'] = 'item',
        ['image'] = 'fish.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Common fish that can be found in any fishing spots'
    },
    ['dolphin']     = {
        ['name'] = 'dolphin',
        ['label'] = 'Dolphin',
        ['weight'] = 50,
        ['type'] = 'item',
        ['image'] = 'dolphin.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Uncomon fish that can be found in the deep sea'
    },
    ['hammershark'] = {
        ['name'] = 'hammershark',
        ['label'] = 'Hammer Shark',
        ['weight'] = 50,
        ['type'] = 'item',
        ['image'] = 'hammershark.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Uncomon fish that can be found in the deep sea'
    },
    ['tigershark']  = {
        ['name'] = 'tigershark',
        ['label'] = 'Tiger Shark',
        ['weight'] = 50,
        ['type'] = 'item',
        ['image'] = 'tigershark.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Uncomon fish that can be found in the deep sea'
    },
    ['killerwhale'] = {
        ['name'] = 'killerwhale',
        ['label'] = 'Killer Whale',
        ['weight'] = 50,
        ['type'] = 'item',
        ['image'] = 'killerwhale.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Epic fish that can be found in deep sea at certain seasons of the year'
    },
    ['humpback']    = {
        ['name'] = 'humpback',
        ['label'] = 'Humpback',
        ['weight'] = 200,
        ['type'] = 'item',
        ['image'] = 'humpback.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Legendary fish that can be found in deep sea at certain seasons of the year'
    },
    ['stingray']    = {
        ['name'] = 'stingray',
        ['label'] = 'Stingray',
        ['weight'] = 20,
        ['type'] = 'item',
        ['image'] = 'stingray.png',
        ['unique'] = false,
        ['useable'] = false,
        ['shouldClose'] = false,
        ['combinable'] = true,
        ['description'] = 'Rare fish that can be found in deep sea at certain seasons of the year'
    },
    -- To here
}
