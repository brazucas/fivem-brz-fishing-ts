-- INSTALLING BRZ-FISHING
-- Copy the following code to the items.lua file in your ox_inventory data folder
-- Do not replace all your items object, just add the items below to your file.

return {
    -- Copy the items from here
    ['fishingrod1'] = {
        label = 'Fishing Rod',
        consume = 0,
        stack = false,
        weight = 80,
        client = {
            image = 'fishingrod.png'
        }
    },
    ['commonbait'] = {
        label = 'Common bait',
        consume = 1,
        stack = true,
        weight = 5,
        client = {
            image = 'commonbait.png'
        }
    },
    ['fish'] = {
        label = 'Common Fish',
        weight = 5,
        client = {
            image = 'fish.png',
        },
        stack = true,
        consume = 0,
    },
    ['dolphin'] = {
        label = 'Dolphin',
        weight = 50,
        client = {
            image = 'dolphin.png',
        },
        stack = true,
        consume = 0,
    },
    ['hammershark'] = {
        label = 'Hammer Shark',
        weight = 50,
        client = {
            image = 'hammershark.png',
        },
        stack = true,
        consume = 0,
    },
    ['tigershark'] = {
        label = 'Tiger Shark',
        weight = 50,
        client = {
            image = 'tigershark.png',
        },
        stack = true,
        consume = 0,
    },
    ['killerwhale'] = {
        label = 'Killer Whale',
        weight = 50,
        client = {
            image = 'killerwhale.png',
        },
        stack = true,
        consume = 0,
    },
    ['humpback'] = {
        label = 'Humpback',
        weight = 200,
        client = {
            image = 'humpback.png',
        },
        stack = true,
        consume = 0,
    },
    ['stingray'] = {
        label = 'Stingray',
        weight = 20,
        client = {
            image = 'stingray.png',
        },
        stack = true,
        consume = 0,
    },
    -- To here
}
