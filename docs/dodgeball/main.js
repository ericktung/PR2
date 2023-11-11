// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.

title = "Dodge ball";
let balls =1;
let foot =1;
let playc =1;
let count =5;
description = `
 Just [Dodge]
`;

characters = [
`	 
  ll 	       		
  ll
llllll
l ll l
  lll
ll  ll
`,
`
rppr
rppr
rpprrr
rrrrrr
rrrrrr
`
,
`
yyllyy
yyllyy
llyyll
llyyll
yyllyy
yyllyy
`

	
];

const G = {
	WIDTH: 100,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
    
    PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,

    FBULLET_SPEED: 5,

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
    ENEMY_FIRE_RATE: 60,

    EBULLET_SPEED: 2.0,
    EBULLET_ROTATION_SPD: 0.1
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true
};

// JSDoc comments for typing


/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;



/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;
/**
 * 
 */

// The game loop function
function update() {
	
    // The init function running at startup
	if (!ticks) {
        // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
	

        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true
        };

        
        enemies = [];
        eBullets = [];

        waveCount = 0;
	}

    // Spawning enemies
    if (enemies.length === 0) {
        currentEnemySpeed =rnd(0, 0) ;
		for (let i = 0; i < playc; i++) {
			const posX = rnd(0, G.WIDTH);
            const posY = rnd(0,G.HEIGHT);

            enemies.push({
                pos: vec(posX, posY),
                firingCooldown: G.ENEMY_FIRE_RATE 
            });
		foot=1;
		
        waveCount++; // Increase the tracking variable by one
		console.log(playc);
    }
}

    

    // Updating and drawing the player
    player.pos = vec(input.pos.x, input.pos.y);
    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    // Cooling down for the next shot

    color ("black");
    char("a", player.pos);

    // text(fBullets.length.toString(), 3, 10);

    // Updating and drawing bullets
  

    remove(enemies, (e) => {
		e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
			balls+=1;
			if(balls%count==0){
				playc+=1;
				//count+=5;
			}
            eBullets.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            }
			);
			
            e.firingCooldown = G.ENEMY_FIRE_RATE;
			foot+=1;
            
        }
        color("black");
        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
			foot=1;
			playc=1;
            end();
           
        }
        
		
		return (foot%5==0);
		
      
        // Also another condition to remove                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     the object
        
    });

  

    remove(eBullets, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += G.EBULLET_ROTATION_SPD;

        
        const isCollidingWithPlayer
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
			foot=1;
			playc=1;
            end();
           
        }

        const isCollidingWithFBullets
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
        if ( eb.pos.y>G.HEIGHT+50||eb.pos.y>G.WIDTH+50||eb.pos.y<0||eb.pos.x<0||eb.pos.x>G.WIDTH){
			addScore(10);
		} 
        
        // If eBullet is not onscreen, remove it
		
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT));
		
    });
}