"use strict";(()=>{var maxLineHeight=170;var castMinigameTemplate=`
<div id="cast-minigame" class="minigame-container" style="display: flex; width: 400px">
  <div style="float:left; width: 200px">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Vertical line shadow -->
      <line x1="100" y1="20" x2="100" y2="180" stroke="#000" stroke-width="4" />

      <!-- Vertical line -->
      <line x1="100" y1="20" x2="100" y2="180" stroke="#fff" stroke-width="2" />
      <!-- Upward arrow -->
      <path
        d="M90 30 L100 20 L110 30"
        fill="none"
        stroke="#888"
        stroke-width="4"
      />
      <path
        d="M90 30 L100 20 L110 30"
        fill="none"
        stroke="white"
        stroke-width="2"
      />
      <!-- Downward arrow -->
      <path
        d="M90 170 L100 180 L110 170"
        fill="none"
        stroke="#888"
        stroke-width="4"
      />
      <path
        d="M90 170 L100 180 L110 170"
        fill="none"
        stroke="white"
        stroke-width="2"
      />
      <!-- Circle indicator -->
      <circle cx="100" cy=${maxLineHeight} r="5" fill="#dddd00" class="castDistanceIndicator" />
      <circle
        class="castDistanceIndicator"
        cx="100"
        cy=${maxLineHeight}
        r="5"
        fill="#dddd00"
        stroke="#888"
        stroke-width="1"
      />

      <text x="120" y=${maxLineHeight} class="toast" fill="#ffffff"></text>
    </svg>
    </div>

    <div style="float:right; width: 200px">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .cls-1 {
                        fill-rule: evenodd;
                        fill: #fff;
                        opacity: 0.9;
                        transform: translate(2rem, 5.5rem);
                    }

                    .catchTooltip {
                        display: none;
                    }
                </style>
            </defs>

            <rect
            rx="2"
            ry="2"
            x="0"
            y="80"
            width="30"
            height="30"
            fill="black"
            stroke="black"
            />

            <rect
            rx="2"
            ry="2"
            x="0"
            y="80"
            width="30"
            height="30"
            fill="none"
            stroke="white"
            stroke-width="1"
            />

            <text x="15" y="95" fill="#ffffff" dominant-baseline="middle" text-anchor="middle" style="font-size: 20px; font-weight: bold; font-family: Arial">
                E
            </text>

            <text x="100" y="95" fill="#ffffff" dominant-baseline="middle" text-anchor="middle" style="font-size: 13px; font-weight: bold; font-family: Arial; letter-spacing: 1px">
                (PARA LANÇAR)
            </text>
        </svg>
    </div>
</div>`;var LocaleDefaults={fishing_spot_error:{label:"You are not at a fishing spot.",variables:{}},has_bait_error:{label:"You don't have fishing bait.",variables:{}},has_rod_error:{label:"You don't have a fishing rod.",variables:{}},near_spot_error:{label:"You are not near a fishing spot.",variables:{}},in_vehicle_error:{label:"You can't fish inside a vehicle.",variables:{}},already_fishing_error:{label:"You are already fishing.",variables:{}},fishing_state:{label:"You are now fishing...",variables:{}},fish_command_description:{label:"Start fishing if you are near a fishing spot.",variables:{}},fish_command:{label:"fish",variables:{}},pull_too_hard:{label:"The line broke! pull slower next time.",variables:{}},rod_cast_took_too_long:{label:"You took too long to cast the line",variables:{}},fishing_spot_not_found:{label:"Fishing spot not found",variables:{}},fish_ran_away:{label:"The fish ran away!",variables:{}},fish_pull_hint:{label:"Press [E] to pull the fish! be careful not to break the line!",variables:{}},fish_bite_bait:{label:"The fish bit the bait, press [E] to pull it!",variables:{}},fish_pull_too_soon:{label:"You pulled too soon! the fish ran away.",variables:{}},initialise_script:{label:"brz-fishing by brz.gg has started!",variables:{}},initialise_error:{label:"An error occurred while initializing brz-fishing.",variables:{}},no_fish_assigned:{label:"There's no fish assigned for player id %PLAYER_ID%",variables:{PLAYER_ID:"PLAYER_ID"}},catching_success:{label:"You got a %ITEM_LABEL%!",variables:{ITEM_LABEL:"ITEM_LABEL"}},unknown_error:{label:"An error occurred while initializing brz-fishing.",variables:{}}};var BrazilianPortuguese={fishing_spot_error:{label:"Você não está em um ponto de pesca.",variables:{}},has_bait_error:{label:"Você não tem uma isca de pesca.",variables:{}},has_rod_error:{label:"Você não tem uma vara de pesca.",variables:{}},near_spot_error:{label:"Você não está perto de um ponto de pesca.",variables:{}},in_vehicle_error:{label:"Você não pode pescar dentro de um veículo.",variables:{}},already_fishing_error:{label:"Você já está pescando.",variables:{}},fishing_state:{label:"Você agora está pescando...",variables:{}},fish_command_description:{label:"Inicia a pescaria caso esteja próximo a um ponto de pesca.",variables:{}},fish_command:{label:"pescar",variables:{}},pull_too_hard:{label:"A linha estourou! puxe mais devagar na próxima vez.",variables:{}},rod_cast_took_too_long:{label:"Você demorou muito para lançar a linha",variables:{}},fishing_spot_not_found:{label:"Local de pesca não encontrado",variables:{}},fish_ran_away:{label:"O peixe escapou!",variables:{}},fish_pull_hint:{label:"Pressione [E] para puxar o peixe! cuidado para não quebrar a linha!",variables:{}},fish_bite_bait:{label:"O peixe mordeu a isca, pressione [E] para puxá-lo!",variables:{}},fish_pull_too_soon:{label:"Você puxou a linha cedo demais! o peixe acabou fugindo",variables:{}},initialise_script:{label:"brz-fishing por brz.gg iniciado!",variables:{}},initialise_error:{label:"Um erro ocorreu ao iniciar a pesca.",variables:{}},no_fish_assigned:{label:"Não há peixe atribuído ao player id %PLAYER_ID%",variables:{PLAYER_ID:"PLAYER_ID"}},catching_success:{label:"Você pescou um %ITEM_LABEL%!",variables:{ITEM_LABEL:"ITEM_LABEL"}},unknown_error:{label:"Um erro ocorreu ao iniciar a pesca.",variables:{}}};var t=(phase,vars)=>{const locale=locales[SETTINGS.DEFAULT_LANG];let phrase=locale[phase];if(!vars)return phrase;for(const varName of Object.keys(vars)){phrase=phrase.replace(`%${varName}%`,vars[varName])}return phrase};var getLocaleVars=locale=>Object.values(locale).reduce((acc,curr,index)=>{if(typeof curr==="string"){acc[Object.keys(LocaleDefaults)[index]]=curr}else{acc[Object.keys(LocaleDefaults)[index]]=curr.label}return acc},{});var locales={"en-us":getLocaleVars(LocaleDefaults),"pt-br":getLocaleVars(BrazilianPortuguese)};var baitingMinigameTemplate=`
<div id="baiting-minigame" class="minigame-container shake-light" style="display: flex; width: 350px">
    <div style="float:left; width: 150px">
        <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .cls-1 {
                        fill-rule: evenodd;
                        fill: #fff;
                        opacity: 0.9;
                        transform: translate(2rem, 5.5rem);
                    }
                </style>
            </defs>

            <text x="50%" y="10" id="distance" fill="#ffffff" dominant-baseline="middle" text-anchor="middle"></text>

            <circle
            cx="100"
            cy="120"
            r="90"
            fill="black"
            stroke="black"
            opacity="0.5"
            stroke-width="15"
            />

            <circle
            cx="100"
            cy="120"
            r="90"
            fill="none"
            stroke="white"
            stroke-width="2"
            />

            <circle
            id="catchOpportunityIndicator"
            cx="100"
            cy="120"
            r="90"
            fill="none"
            stroke="#28f7af"
            stroke-width="5"
            stroke-dasharray="0"
            transform="rotate(-90,100,120)"
            />

            <line
            id="lineTension"
            x1="100"
            y1="70"
            x2="100"
            y2="30"
            stroke="white"
            stroke-width="2"
            />

            <path
            class="cls-1"
            d="M82.71,11.84l6.7-6.91c-9.32-7-30-3.33-38.91,3.22A39.36,39.36,0,0,0,37.39,6.94c-10.63.46-1.71,9.23,1.68,12.71-2.85,4.6-5.44,9.37-7.92,14.21C29.26,39,25.29,41,19.62,40.32l-6.29-1.25C10,38.41-1.8,35,.23,41.89c2.05,4.46,7.07,8.35,12.37,12.2a82.6,82.6,0,0,0,2.07,9.3c2.49,9,6.33,8.83,9,.5l3.59-11.45c1.11-4.1,3.44-5.93,6.45-6.19,9.19-.79,16.79,2.48,29.12-1.37a51.67,51.67,0,0,0,2.64,9.45c1.29,2.26,3.14,2.49,5.78-.31a42,42,0,0,0,5.22-15c9.19-9.52,15.66-22.88,14.73-30.72l-8.45,3.57ZM118.61,0V8.58a7.81,7.81,0,0,1,0,13.92V37.19c-.1,7-3.71,12-8.38,14.52a14.85,14.85,0,0,1-6.29,1.75,13.46,13.46,0,0,1-6.49-1.33c-4.45-2.16-8-7-8.55-14.8L92.59,29l3.27,7.84c.35,4.94,2.26,7.86,4.64,9a6.55,6.55,0,0,0,3.13.64,7.64,7.64,0,0,0,3.3-.93,9.39,9.39,0,0,0,4.71-8.42h0V22.54a7.81,7.81,0,0,1,0-14V0ZM75.21,5.27a3.54,3.54,0,1,0,2.5,4.32,3.54,3.54,0,0,0-2.5-4.32Z"
            />

            <line
            id="lineTension"
            x1="100"
            y1="210"
            x2="100"
            y2="170"
            stroke="white"
            stroke-width="2"
            />

            <text x="50%" y="240" id="landingSpot" fill="#00ff00" class="baitingSpot" dominant-baseline="middle" text-anchor="middle">Landed on spot</text>
        </svg>
    </div>

    <div style="float:right; width: 200px">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .cls-1 {
                        fill-rule: evenodd;
                        fill: #fff;
                        opacity: 0.9;
                        transform: translate(2rem, 5.5rem);
                    }

                    .catchTooltip {
                        display: none;
                    }
                </style>
            </defs>

            <rect
            rx="2"
            ry="2"
            x="30"
            y="80"
            width="30"
            height="30"
            fill="black"
            stroke="black"
            class="catchTooltip"
            />

            <rect
            rx="2"
            ry="2"
            x="30"
            y="80"
            width="30"
            height="30"
            fill="none"
            stroke="white"
            stroke-width="1"
            class="catchTooltip"
            />

            <text x="45" y="95" fill="#ffffff" class="catchTooltip" dominant-baseline="middle" text-anchor="middle" style="font-size: 20px; font-weight: bold; font-family: Arial">
                E
            </text>

            <text x="120" y="95" fill="#ffffff" class="catchTooltip" dominant-baseline="middle" text-anchor="middle" style="font-size: 13px; font-weight: bold; font-family: Arial; letter-spacing: 1px">
                (${t("catching_success")})
            </text>
        </svg>
    </div>
</div>`;var reelingMinigameTemplate=`
<div id="reeling-minigame" class="minigame-container" style="width: 400px; display: flex;">
    <div style="float:left; width: 200px">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern
            id="smallGrid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            >
            <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="gray"
                stroke-width="0.5"
            />
            </pattern>
            <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            >
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="gray"
                stroke-width="1"
            />
            </pattern>
        </defs>

        <text
            id="fishDistanceText"
            x="50%"
            y="10%"
            text-anchor="middle"
            fill="#ffffff"
            font-size="12"
        >
            100m
        </text>

        <circle
            cx="50%"
            cy="50%"
            r="57"
            id="fishDistanceIndicator"
            fill="none"
            stroke="#ffffff"
            stroke-width="5"
            stroke-dasharray="360"
            transform="rotate(-90,100,100)"
        />

        <circle
            id="fishDistanceRing"
            cx="50%"
            cy="50%"
            r="57"
            fill="none"
            stroke="#ffffff"
            stroke-width="1"
            stroke-opacity="0.5"
            stroke-dasharray="360"
            transform="rotate(-90,100,100)"
        />

        <circle cx="50%" cy="50%" r="48" fill="#00000" fill-opacity="0.5" />

        <circle
            cx="50%"
            cy="50%"
            r="48"
            fill="none"
            stroke="#ffffff"
            stroke-width="2"
            stroke-dasharray="60 85"
            transform="rotate(-120,100,100)"
        />

        <ellipse
            id="lineTension"
            cx="50%"
            cy="50%"
            rx="10%"
            ry="3%"
            fill="url(#grid)"
            fill-opacity="0.7"
        />

        <ellipse
            id="lineTensionBackground"
            cx="50%"
            cy="50%"
            rx="10%"
            ry="3%"
            fill="#00ff00"
            fill-opacity="0.7"
        />
        </svg>
    </div>

    <div style="float:right; width: 200px">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .cls-1 {
                        fill-rule: evenodd;
                        fill: #fff;
                        opacity: 0.9;
                        transform: translate(2rem, 5.5rem);
                    }
                </style>
            </defs>

            <rect
            rx="2"
            ry="2"
            x="30"
            y="80"
            width="30"
            height="30"
            fill="black"
            stroke="black"
            class="reelingKeyPress"
            />

            <rect
            rx="2"
            ry="2"
            x="30"
            y="80"
            width="30"
            height="30"
            fill="none"
            stroke="white"
            stroke-width="1"
            class="reelingKeyPress"
            />

            <text x="45" y="95" fill="#ffffff" class="reelingKeyPress" dominant-baseline="middle" text-anchor="middle" style="font-size: 20px; font-weight: bold; font-family: Arial">
                E
            </text>

            <text x="120" y="95" fill="#ffffff" class="reelingKeyPress" dominant-baseline="middle" text-anchor="middle" style="font-size: 13px; font-weight: bold; font-family: Arial; letter-spacing: 1px">
                PARA PUXAR
            </text>
        </svg>
    </div>
</div>`;var containers={cast:{selector:"#cast-minigame",template:castMinigameTemplate,children:{castDistanceIndicator:".castDistanceIndicator",toast:".toast"}},baiting:{selector:"#baiting-minigame",template:baitingMinigameTemplate,children:{catchOpportunityIndicator:"#catchOpportunityIndicator",distance:"#distance",baitingSpot:"#baitingSpot",catchTooltip:".catchTooltip"}},reeling:{selector:"#reeling-minigame",template:reelingMinigameTemplate,children:{lineTension:`#lineTension`,fishDistanceIndicator:`#fishDistanceIndicator`,fishDistanceText:"#fishDistanceText",lineTensionBackground:`#lineTensionBackground`,reelingKeyPress:".reelingKeyPress"}}};Object.values(containers).forEach(container=>{$("body").append(container.template)});})();
