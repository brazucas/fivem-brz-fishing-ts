fx_version 'cerulean'
name 'brz-fishing'
author 'brz.gg'
game 'gta5'

shared_scripts {
    'settings.js',
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
