"use strict";(()=>{var maxLineHeight=170;var minLineHeight=30;var castMinigameTemplate=`
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
</div>`;var baitingMinigameTemplate=`
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
                (PRESSIONE)
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
</div>`;var containers={cast:{selector:"#cast-minigame",template:castMinigameTemplate,children:{castDistanceIndicator:".castDistanceIndicator",toast:".toast"}},baiting:{selector:"#baiting-minigame",template:baitingMinigameTemplate,children:{catchOpportunityIndicator:"#catchOpportunityIndicator",distance:"#distance",baitingSpot:"#baitingSpot",catchTooltip:".catchTooltip"}},reeling:{selector:"#reeling-minigame",template:reelingMinigameTemplate,children:{lineTension:`#lineTension`,fishDistanceIndicator:`#fishDistanceIndicator`,fishDistanceText:"#fishDistanceText",lineTensionBackground:`#lineTensionBackground`,reelingKeyPress:".reelingKeyPress"}}};var fadeAnimationDuration=200;var hideAllContainers=()=>{Object.values(containers).forEach(container=>{$(container.selector).hide()})};var hideNui=()=>{$("body").css("opacity",0)};var showNui=()=>{$(".minigame-container").css("position","block");$("body").css("opacity",1)};var showContainer=container=>{hideAllContainers();$(containers[container].selector).css("opacity",1);$(containers[container].selector+".minigame-container").css("opacity",1);$(containers[container].selector).fadeIn({duration:fadeAnimationDuration})};var showCatchTooltip=()=>{$(containers.baiting.children.catchTooltip).fadeIn()};var hideCatchTooltip=()=>{$(containers.baiting.children.catchTooltip).fadeOut()};var lineTensionBackground=anime({targets:containers.reeling.children.lineTensionBackground,ry:"20%",easing:"easeInOutSine",duration:100,loop:false,autoplay:false});var distanceFilling=anime({targets:containers.reeling.children.fishDistanceIndicator,strokeDashoffset:[anime.setDashoffset,0],easing:"easeInOutSine",duration:100,loop:false,autoplay:false});var lineTension=anime({targets:containers.reeling.children.lineTension,ry:"20%",easing:"easeInOutSine",duration:100,loop:false,autoplay:false,keyframes:[{value:0,fill:"#00ff00"},{value:600,fill:"#ffff00"},{value:1300,fill:"#ff0000"}],update:function(anim){if(anim.progress>90){shakeElement(containers.reeling.selector,"hard")}else if(anim.progress>70){shakeElement(containers.reeling.selector,"medium")}else if(anim.progress>50){shakeElement(containers.reeling.selector,"light")}else{stopShakingElement(containers.reeling.selector)}}});anime({targets:containers.baiting.children.catchTooltip,opacity:.5,strokeOpacity:1,easing:"easeInOutSine",duration:500,loop:true,autoplay:true});var reelingKeyPress=anime({targets:containers.reeling.children.reelingKeyPress,opacity:1,keyframes:[{value:0,opacity:1},{value:50,opacity:.5},{value:100,opacity:1}],strokeOpacity:1,easing:"easeInOutSine",duration:300,loop:false,autoplay:false});var castDistance=anime({targets:containers.cast.children.castDistanceIndicator,keyframes:[{cy:minLineHeight},{cy:maxLineHeight}],elasticity:100,easing:"easeInOutSine",duration:100,loop:false,autoplay:false});var batiting=anime({targets:containers.baiting.selector,easing:"easeInOutSine",duration:100,loop:false,autoplay:false,update:anim=>{if(anim.progress>80){shakeElement(containers.baiting.selector,"hard")}else if(anim.progress>50){shakeElement(containers.baiting.selector,"medium")}else{shakeElement(containers.baiting.selector,"light")}}});var batitingCatchOpportunity=anime({targets:containers.baiting.children.catchOpportunityIndicator,strokeDashoffset:[anime.setDashoffset,0],keyframes:[{value:0,stroke:"#00ff00"},{value:50,stroke:"#ffff00"},{value:100,stroke:"#ff0000"}],easing:"easeInOutSine",duration:100,loop:false,autoplay:false});var setLineTensionAnimation=value=>{lineTensionBackground.seek(value);lineTension.seek(value)};var setFishDistanceAnimation=(distance,animationPercentageInverted)=>{$(containers.reeling.children.fishDistanceText).text(distance.toFixed(2)+"m");distanceFilling.seek(animationPercentageInverted)};var setCastDistanceAnimation=percentage=>{castDistance.seek(percentage);$(`${containers.cast.selector} ${containers.cast.children.toast}`).attr("y",Number($(containers.cast.children.castDistanceIndicator).attr("cy")))};var setBaitFishDistanceText=distance=>$(containers.baiting.children.distance).text(distance.toFixed(2)+"m");var setInitialFishDistanceAnimation=()=>{const parentContainerSelector=containers.cast.selector;$(`${parentContainerSelector} .toast`).text("SHORT");$(`${parentContainerSelector} .toast`).fadeIn()};var hideInitialFishDistanceAnimation=()=>{const parentContainerSelector=containers.cast.selector;$(`${parentContainerSelector} .toast`).fadeOut()};var setBaitingAnimation=percentage=>{batiting.seek(percentage)};var stopBaitingAnimation=()=>{stopShakingElement(containers.baiting.selector)};var setBaitingCatchOpportunityAnimation=percentage=>{batitingCatchOpportunity.seek(percentage)};var runReelingKeyPressAnimation=()=>{reelingKeyPress.play()};var shakeIntensity={hard:"hard",medium:"medium",light:"light"};var shakeElement=(selector,intensity)=>{$(selector).addClass(`shake-${intensity}`);const classesToRemove=Object.values(Object.assign({},shakeIntensity)).filter(_class=>_class!==intensity);classesToRemove.forEach(_class=>{$(selector).removeClass(`shake-${_class}`)})};var stopShakingElement=selector=>{Object.values(shakeIntensity).forEach(intensity=>{$(selector).removeClass(`shake-${intensity}`)})};var startDevelopmentMode=()=>{showNui();$("body").css("background-color","blue")};var stopDevelopmentMode=()=>{hideNui();$("body").css("background-color","transparent")};var initialFishDistance=0;var setLineTension=setLineTensionAnimation;var setFishDistance=distance=>{const animationPercentageInverted=100-distance/Math.max(initialFishDistance,distance,1)*100;setFishDistanceAnimation(distance,animationPercentageInverted)};var setCastingPercentage=percentage=>{setCastDistanceAnimation(percentage)};var setInitialFishDistance=distance=>{if(distance>0){initialFishDistance=distance;setBaitFishDistanceText(distance);setInitialFishDistanceAnimation()}else{hideInitialFishDistanceAnimation()}};var actionHandlers={"start-fishing":showNui,"stop-fishing":hideNui,"show-baiting-tooltips":()=>{stopBaitingAnimation();return showCatchTooltip()},"hide-baiting-tooltips":hideCatchTooltip,"reeling-key-pressed":runReelingKeyPressAnimation,"set-state":event=>{const{state}=event.data;stateHandlers[state]()},"set-param":event=>{const{param,value}=event.data;paramsHandlers[param](value)},"fish-2d-position":event=>{const{center,posX,posY}=event.data;if(center){$(".minigame-container").css("position","block")}else{$(".minigame-container").css("position","absolute");$(".minigame-container").css("left",posX+"px");$(".minigame-container").css("top",posY+"px")}}};var stateHandlers={"not-fishing":hideNui,casting:()=>showContainer("cast"),baiting:()=>{showContainer("baiting");$(containers.baiting.children.baitingSpot).fadeIn();$(containers.baiting.children.distance).fadeIn()},reeling:()=>showContainer("reeling")};var paramsHandlers={lineTension:setLineTension,fishDistance:setFishDistance,rodCastPercentage:setCastingPercentage,baitingTime:setBaitingAnimation,catchOpportunityWindow:percentage=>{setBaitingCatchOpportunityAnimation(percentage);$(containers.baiting.children.baitingSpot).fadeOut();$(containers.baiting.children.distance).fadeOut()},initialFishDistance:setInitialFishDistance};window.addEventListener("message",event=>{const{action}=event.data;if(action&&actionHandlers[action]){actionHandlers[action](event)}console.error(`[brz-fishing] Unknown action ${action}`)});window.startDevelopmentMode=startDevelopmentMode;window.setCastDistanceAnimation=setCastDistanceAnimation;window.stopDevelopmentMode=stopDevelopmentMode;window.showContainer=showContainer;window.setInitialFishDistanceAnimation=setInitialFishDistanceAnimation;window.setBaitingAnimation=setBaitingAnimation;window.setInitialFishDistance=setInitialFishDistance;window.stopBaitingAnimation=stopBaitingAnimation;window.setBaitingCatchOpportunityAnimation=setBaitingCatchOpportunityAnimation;})();
