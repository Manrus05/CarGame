const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const level = document.querySelector('.level');


// loading audio files

let gameStart = new Audio();
let gameOver = new Audio();

gameStart.src = "audio/baby-music-light-202175.mp3";
gameOver.src = "audio/gameOver_theme.mp3";


const levelSpeed = {easy: 7, moderate: 10, difficult: 14};      //variable für speed
const zahl = {easy: 3, moderate: 5, difficult: 7};
let keys = {                                              ///Tasten sind festgelegt
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
}
let player = { speed: 7, score: 0, tod: 0 };
level.addEventListener('click', (e)=> {        //level von User wird festgelegt
    player.speed = levelSpeed[e.target.id];

    an = zahl[e.target.id];
});

startScreen.addEventListener('click', () => {  
   // player.speed = 7;
    //an = 3;                                                  // nach dem klick wird startScreen weg
    // gameArea.classList.remove('hide');
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    gameStart.play();
    gameStart.loop = true;
    player.score = 0;
    player.tod = 0;

    window.requestAnimationFrame(gamePlay);        // function ist aufgerufen

    for(let i=0; i<5; i++){                                    // roadLine wird deklariert und schleife lässt  laufen (5-roadLines) 
        let roadLineElement = document.createElement('div');
        roadLineElement.setAttribute('class', 'roadLines');
        roadLineElement.y = (i*150);
        roadLineElement.style.top = roadLineElement.y + "px";
        gameArea.appendChild(roadLineElement);                 //hinzufügt elemente von road
    }

    let carElement = document.createElement('div');
    carElement.setAttribute('class', 'car');
    gameArea.appendChild(carElement);                 /// hinzufügt element von auto

    player.x = carElement.offsetLeft;              //position von Auto wird übergeben
    player.y = carElement.offsetTop  ;

    for(let i=0; i<an; i++){
        let enemyCar = document.createElement('div');                      ///EnemyCar wird gemacht und Anzahl festgelegt   
        enemyCar.setAttribute('class', 'enemyCar');
        enemyCar.y = ((i+1) * 350) * - 1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);

    }  
             
    
});
     
window.addEventListener('keydown', (e) => {
    console.log(e.key);
    if (e.key == "Enter") {
          
        let bombe = document.createElement('div');
        bombe.setAttribute('class', 'bombe');
        bombe.y = player.y;
        bombe.style.top = bombe.y + "px";
        bombe.style.left = player.x + "px";
        gameArea.appendChild(bombe);
    }     
} );



function randomColor(){                            //// mit Random wird Color für EnemyCar gewählt
    function c(){
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0"+ String(hex)).substr(-2);
    }
    return "#"+c()+c()+c();
}

function kol(er){
    gameArea.removeChild(er);
  }
 

function onCollision(a,b){                    // collision wird gemacht
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();
    
    return !((aRect.top >  bRect.bottom) || (aRect.bottom <  bRect.top) ||
    (aRect.right <  bRect.left) || (aRect.left >  bRect.right)); 

        
}


function onGameOver() {                      //startScreen wird angezeigt 
    player.start = false;
    gameStart.pause();
    gameOver.play();
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + " <br>Tode Gegner "+  player.tod  +"<br> Press here to restart the game.";
}

function moveRoadLines(){                                         /// Malen von roadlines ist festgelegt
    let roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach((item)=> {
        if(item.y >= 700){                                     //// wann auto existiert und wann weg
            item.y -= 750;
        }
        
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemyCars(carElement){
    let enemyCars = document.querySelectorAll('.enemyCar');
    enemyCars.forEach((item)=> {
       schiessen(item);
        if(onCollision(carElement, item)){    //überprüfung ob es collision gibt
            onGameOver();
        }
        if(item.y >= 750){                    // enemyAutos fahren
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
} 
function schiessen(er){
    let bombe = document.querySelectorAll('.bombe');                     // bombe fliegen
    bombe.forEach((item) => {
        if(onCollision(er, item)){    //überprüfung ob es collision gibt
            er.y = -300;
            er.style.left = Math.floor(Math.random() * 350) + "px";
            player.score += 10;
            player.tod++;
        } 
        item.y -= player.speed;
        item.style.top = item.y + "px";  
        if(item.y <= -300){
            kol(item);
        }
    }); 
}

function gamePlay() {
    let carElement = document.querySelector('.car');      //variablen für auto und road initialisieren
    let road = gameArea.getBoundingClientRect();

    if(player.start){
        moveRoadLines();                                                   //Aufrufe von functionen
        moveEnemyCars(carElement);
        
        if(keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;           // bewegung von car
        if(keys.ArrowDown && player.y < (road.bottom - 85)) player.y += player.speed;
        if(keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if(keys.ArrowRight && player.x < (road.width - 70)) player.x += player.speed;

        carElement.style.top = player.y + "px";
        carElement.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);

        player.score++;
        const ps = player.score - 1;
        score.innerHTML = 'Score: ' + ps;          
    }
}
document.addEventListener('keydown', (e)=>{           //// wenn gameOver Tasten werden auf true gestellt, damit nichts passiert 
    e.preventDefault();
    keys[e.key] = true;
});

document.addEventListener('keyup', (e)=>{              //// Tasten werden false zugewiesen 
    e.preventDefault();
    keys[e.key] = false;
});
