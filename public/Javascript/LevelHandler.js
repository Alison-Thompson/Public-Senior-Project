
function LevelHandler(mainFPS, level) {
	this.level = level;

	this.mainFPS;
	this.lastTime = null;
	this.waveNumber = 0;

	this.levelComplete = false;

	this.rangedGruntSpriteWidth = 416;
	this.rangedGruntSpriteHeight = 416;
	this.rangedGruntSpriteScale = 0.27;

	this.meleeGruntSpriteWidth = 416;
	this.meleeGruntSpriteHeight = 416;
	this.meleeGruntSpriteScale = 0.27;

	this.darkScottSpriteWidth = 416;
	this.darkScottSpriteHeight = 416;
	this.darkScottSpriteScale = 0.27;
};

LevelHandler.prototype.Update = function() {
	// Handle Timing.
	if (this.lastTime == null) {
		this.lastTime = Date.now();
	}
	var currentTime = Date.now();
	var delta = currentTime - this.lastTime;

	// SpawnRangedGrunt: function(x, y, maxHealth, attackDamage, attackCooldown, direction) 
	// SpawnMeleeGrunt: function(x, y, maxHealth, attackDamage, walkingSpeed)
	// SpawnDarkScott: function(maxHealth, attackDamage, attackCooldown, teleportCooldown)

	// Top Left: 0, 20
	// Top Middle: (window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20
	// Top Right: window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20

	// Middle Left: 0, (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale)
	// Middle Right: window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale)

	// Bottom Left: 0, window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale)
	// Bottom Middle: (window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale)
	// Bottom Right: window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale)

	if (this.level == -1) { // Example Level.
		if (this.waveNumber == 0 && delta > 3000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 & delta > 17000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 10, 200);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == -2) { // Dark Scott example level
		if (this.waveNumber == 0 && delta > 3000) {
			Game.SpawnDarkScott(100, 10, 1000, 2000);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
		
	} else if (this.level == 1) { // 2 weak ranged.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 2) { // 2 weak melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt(0, 20, 50, 7, 150);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnMeleeGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 3) { // 2 weak ranged, 1 weak melee
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 17000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 4) { // 2 weak ranged, 2 weak melee
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 60, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 5) { // Weak Dark Scott
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnDarkScott(100, 5, 2000, 5000);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 6) { // 3 weak ranged, 1 medium melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 17000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 50, 7, 250);
			this.waveNumber += 1;
		} else if (this.waveNumber == 3 && delta > 21000) {
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 60, 5, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 7) { // 3 weak melee, 1 medium ranged.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 9000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 50, 7, 250);
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 8) { // 2 weak ranged, 2 medium ranged.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 60, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 8000) {
			Game.SpawnRangedGrunt(0, window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 1);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 9) { // 3 medium ranged. 1 weak melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 3);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 2);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 12000) {
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 7, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 15000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), window.innerHeight-(this.meleeGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 10) { // medium Dark Scott.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnDarkScott(150, 7, 2000, 3000);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 11) { // 3 weak ranged. 2 weak melee. 1 medium melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 60, 5, 1000, 3);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), (window.innerHeight/2)-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 60, 5, 1000, 2);
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 60, 5, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 12000) {
			Game.SpawnMeleeGrunt(0, 20, 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 50, 7, 150);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 16000) {
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 7, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 12) { // 2 medium melee. 2 weak melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 50, 7, 150);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.meleeGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 13) { // 2 hard ranged.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 80, 7, 500, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 7, 500, 0);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 14) { // Spawn super tanky high damage melee.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 150, 15, 200);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 15) { // hard Dark Scott.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnDarkScott(150, 10, 1000, 2000);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 16) { // Spawn two strong ranged grunts.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 100, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 100, 0);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 17) { // Spawn two weak melee. two medium ranged. two weak melee and one weak ranged.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 10000) {
			Game.SpawnRangedGrunt(0, 20, 80, 7, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 7, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 16000) {
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 5, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 18) { // two strong ranged grunts. + jugernaut.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 80, 5, 200, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 5, 200, 0);
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 120, 10, 200);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 19) { // ambush of a ton of weak shit.
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(0, window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 20) {
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			Game.SpawnDarkScott(150, 10, 1000, 2000);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 21) {
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 8000) {
			Game.SpawnRangedGrunt(0, 20, 80, 7, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 7, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 14000) {
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 5, 1000, 1);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 22) {
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 50, 7, 250);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 250);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 250);
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.meleeGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 250);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 23) {
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(0, window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 170);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 170);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 24) {
		if (this.waveNumber == 0 && delta > 2000) {
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnRangedGrunt((window.innerWidth/2)-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 80, 5, 1000, 1);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 8000) {
			Game.SpawnRangedGrunt(0, 20, 80, 7, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 80, 7, 1000, 0);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 14000) {
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 150);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	} else if (this.level == 25) {
		if (this.waveNumber == 0) {
			Game.SpawnDarkScott(150, 10, 1000, 2000, true);
			this.waveNumber += 1;
		} else if (this.waveNumber == 1 && delta > 2000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			Game.SpawnDarkScott(150, 10, 1000, 2000);
			this.waveNumber += 1;
		} else if (this.waveNumber == 2 && delta > 8000) {
			Game.SpawnRangedGrunt(0, 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), 20, 100, 5, 1000, 0);
			Game.SpawnRangedGrunt(0, window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnRangedGrunt(window.innerWidth-(this.rangedGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.rangedGruntSpriteHeight*this.rangedGruntSpriteScale), 100, 5, 1000, 1);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 170);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 170);
			this.waveNumber += 1;
		} else if (this.waveNumber == 3 && delta > 14000) {
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), 20, 50, 7, 250);
			Game.SpawnMeleeGrunt(0, (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 250);
			Game.SpawnMeleeGrunt(window.innerWidth-(this.meleeGruntSpriteWidth*this.meleeGruntSpriteScale), (window.innerHeight/2)-(this.meleeGruntSpriteHeight*this.meleeGruntSpriteScale), 50, 7, 250);
			Game.SpawnMeleeGrunt((window.innerWidth/2)-(this.meleeGruntSpriteWidth*this.rangedGruntSpriteScale), window.innerHeight-(this.meleeGruntSpriteHeight*this.rangedGruntSpriteScale), 50, 7, 250);
			this.waveNumber += 1;
			this.levelComplete = true;
		}
	}

};

LevelHandler.prototype.IsLevelComplete = function() {
	return this.levelComplete;
};