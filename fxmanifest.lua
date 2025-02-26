fx_version 'cerulean'
name 'brz-fishing'
author 'brz.gg'
lua54 'yes'
game 'gta5'

shared_scripts {
    'settings.js',
    '@ox_lib/init.lua',
}

ox_libs {
    'interface',
}

server_script 'dist/server/**/*.js'

client_script 'dist/client/**/*.js'

ui_page 'nui/fishing.html'

files {
    'settings.js',
    'nui/*.html',
    'nui/dist/*.js',
    'nui/dist/dom/*.js'
}
