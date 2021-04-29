/*
Todo

*/


function DarkScott(mainFPS, maxHealth, attackDamage, attackCooldown, teleportCooldown, friendly) {
	this.spriteWidth = 416;
	this.spriteHeight = 416;
	this.scale = 0.27;

	this.friendly = friendly;

	this.x = window.innerWidth/2 - (this.spriteWidth*this.scale/2);
	this.y = 20;
	this.currentLocation = 0;

	this.attackDamage = attackDamage; // 10

	this.currentHealth = maxHealth; // 100
	this.maxHealth = maxHealth;
	this.healthBarHeight = 20;
	this.alive = true;

	this.myFrame = 0;
	this.currentFrame = 0;
	this.mainFPS = mainFPS;
	this.lastFrame = 0;

	this.teleportColumn = 2;
	this.teleportRow = 4;
	this.teleportFPS = 18;

	this.attackColumn = 2;
	this.attackRow = 5;
	this.attackFPS = 6;

	this.ForwardAttackMap = null;
	this.BackwardAttackMap = null;
	this.LeftAttackMap = null;
	this.RightAttackMap = null;

	this.ForwardTeleportMap = null;
	this.ForwardReappearMap = null;
	this.BackwardTeleportMap = null;
	this.BackwardReappearMap = null;
	this.LeftTeleportMap = null;
	this.LeftReappearMap = null;
	this.RightTeleportMap = null;
	this.RightReappearMap = null;

	// Timing.
	this.attackTime = null;
	this.teleportTime = null;
	this.timeBetweenAttacks = attackCooldown; // 1000 == 1 second.
	this.timeBetweenTeleports = teleportCooldown; // 2000 == 2 seconds.
	this.currentTeleportPhase = 0; // 0: Disapearing, 1: Reapearing somewhere else.

	this.projectileSpeed = 1000;
	this.projectileColor = "#4a0067";

	// 0: Forward, 1: Backward, 2: Left, 3: Right
	this.direction = 0;

	// 0: Standing Still, 1: Attacking, 2: Teleporting
	this.state = 0;
};

DarkScott.prototype.Draw = function(ctx) {
	if (this.direction == 0) { // Forward.
		if (this.state == 0) { // Standing Still.
			ctx.drawImage(this.ForwardAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.ForwardAttackMap, this.attackFPS);
		} else if (this.state == 2) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.ForwardTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.ForwardReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 1) { // Backward.
		if (this.state == 0) { // Standing Still.
			ctx.drawImage(this.BackwardAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.BackwardAttackMap, this.attackFPS);
		} else if (this.state == 2) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.BackwardTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.BackwardReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 2) { // Left.
		if (this.state == 0) { // Standing Still.
			ctx.drawImage(this.LeftAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.LeftAttackMap, this.attackFPS);
		} else if (this.state == 2) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.LeftTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.LeftReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 3) { // Right.
		if (this.state == 0) { // Standing Still.
			ctx.drawImage(this.RightAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.RightAttackMap, this.attackFPS);
		} else if (this.state == 2) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.RightTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.RightReappearMap, this.teleportFPS);
			}
		}
	}

	this.DrawHealthBar(ctx);
};

DarkScott.prototype.DrawHealthBar = function(ctx) {
	if (this.currentHealth > 0) {
		var barWidth = this.spriteWidth*this.scale;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y-this.healthBarHeight, barWidth, this.healthBarHeight);
		ctx.fillStyle = "green";
		var healthPercent = this.currentHealth/this.maxHealth
		ctx.fillRect(this.x, this.y-this.healthBarHeight, Math.floor(barWidth*healthPercent), this.healthBarHeight);
	}
};

DarkScott.prototype.CollisionHandler = function(p) {
	if (p.IsFriendly() && !this.friendly) {
		// Amount of pixels into the sprite the projectile can go.
		var pX = p.GetX();
		var pY = p.GetY();
		var pRadius = p.GetRadius();
		var boxX = (this.x+25)-pRadius;
		var boxY = (this.y+15)-pRadius;

		var scaledWidth = this.spriteWidth*this.scale - (25-pRadius);
		var scaledHeight = this.spriteHeight*this.scale - (25-pRadius);

		if ((pX >= boxX) && (pX <= boxX+scaledWidth) &&
		   (pY >= boxY) && (pY <= boxY+scaledHeight)) {
			p.SetShouldClean(true);
			var d = p.GetDamage();
			this.currentHealth -= d;

			if (this.currentHealth <= 0) {
				// Handle death here.
				this.alive = false;
			}
		}
	}
};

DarkScott.prototype.Update = function() {
	var currentTime = Date.now();

	// Decide when to attack.
	var attackDelta = currentTime - this.attackTime;
	if (this.state == 0 && attackDelta > this.timeBetweenAttacks) {
		this.state = 1;
	}

	// Decided when to teleport.
	var teleportDelta = currentTime - this.teleportTime;
	if (this.state == 0 && teleportDelta > this.timeBetweenTeleports) {
		this.state = 2;
	}

	// What to do if we're attacking.
	if (this.state == 1) {
		if (this.currentFrame+1 == this.attackColumn*this.attackRow) {
			this.state = 0;
			this.attackTime = Date.now();
			this.currentFrame = 0;
		} else if (this.lastFrame != this.currentFrame) {
			this.Attack();
		}
	}
	// What to do if we're teleporting.
	else if (this.state == 2) {
		if (this.currentFrame+1 == this.teleportColumn*this.teleportRow && this.currentTeleportPhase == 0) {
			this.currentTeleportPhase = 1;
			this.currentFrame = 0;
			this.Teleport();
		} else if (this.currentFrame+1 == this.teleportColumn*this.teleportRow && this.currentTeleportPhase == 1) {
			this.state = 0;
			this.currentTeleportPhase = 0;
			this.teleportTime = Date.now();
			this.currentFrame = 0;
		}
	}

	this.lastFrame = this.currentFrame;
};

DarkScott.prototype.Attack = function() {
	var scaledWidth = this.spriteWidth*this.scale;
	var scaledHeight = this.spriteHeight*this.scale;

	var midX = Math.floor(this.x + (scaledWidth/2));
	var midY = Math.floor(this.y + (scaledHeight/2))+20;

	// Shoot Out Projectiles.
	if (this.direction == 0) { // Forward.
		midX += 18;
		var dx = 0;
		var dy = this.projectileSpeed;

		var tempX = -500;
		while (tempX != 500) {
			let p = new Projectile(midX, midY, dx+tempX, dy, 7, this.projectileColor, this.friendly, this.attackDamage);
			Game.AddProjectile(p);
			tempX += 100;
		}

	} else if (this.direction == 1) { // Backward.
		midX += 18;
		var dx = 0;
		var dy = -this.projectileSpeed;

		var tempX = -500;
		while (tempX != 500) {
			let p = new Projectile(midX, midY, dx+tempX, dy, 7, this.projectileColor, this.friendly, this.attackDamage);
			Game.AddProjectile(p);
			tempX += 100;
		}
	} else if (this.direction == 2) { // Left.
		var dx = -this.projectileSpeed;
		var dy = 0;

		var tempY = -500;
		while (tempY != 500) {
			let p = new Projectile(midX, midY, dx, dy+tempY, 7, this.projectileColor, this.friendly, this.attackDamage);
			Game.AddProjectile(p);
			tempY += 100;
		}
	} else { // Right.
		var dx = this.projectileSpeed;
		var dy = 0;

		var tempY = -500;
		while (tempY != 500) {
			let p = new Projectile(midX, midY, dx, dy+tempY, 7, this.projectileColor, this.friendly, this.attackDamage);
			Game.AddProjectile(p);
			tempY += 100;
		}
	}
};

DarkScott.prototype.Teleport = function() {
	// Find Landing Location.
	var location;
	while (1) {
		location = Math.floor(Math.random() * 4);
		if (location != this.currentLocation) {
			break;
		}
	}

	this.currentLocation = location;

	switch(location) {
		case 0: // Forward.
			this.x = window.innerWidth/2 - (this.spriteWidth*this.scale/2);
			this.y = this.healthBarHeight;
			this.direction = 0;
			break;
		case 1: // Backward.
			this.x = window.innerWidth/2 - (this.spriteWidth*this.scale/2);
			this.y = window.innerHeight - (this.spriteHeight*this.scale);
			this.direction = 1;
			break;
		case 2: // Left.
			this.x = 0;
			this.y = window.innerHeight/2 - (this.spriteHeight*this.scale/2);
			this.direction = 3;
			break;
		case 3: // Right.
			this.x = window.innerWidth - (this.spriteWidth*this.scale);
			this.y = window.innerHeight/2 - (this.spriteHeight*this.scale/2);
			this.direction = 2;
			break;
		default:
			alert("DarkScott->Teleport: Invaild Location Generated.");
			break;
	}
	
};

// framesToSkip is optional, it's 0 by default.
DarkScott.prototype.Animate = function(ctx, columns, rows, image, animationFPS, framesToSkip) {
	// Row and column values must match the map of the animation.

	if (typeof framesToSkip == 'undefined') {
		var framesToSkip = 0;
	}

	var currentRow = Math.floor(this.currentFrame/columns)
	var currentColumn = this.currentFrame % columns;


	var scaledWidth = this.spriteWidth*this.scale;
	var scaledHeight = this.spriteHeight*this.scale;

	var drawThisFrame = false;
	if (Math.floor(this.mainFPS/animationFPS) == this.myFrame) {
		drawThisFrame = true;
		this.myFrame = 0;
	}

	this.myFrame++;

	ctx.drawImage(image, currentColumn*this.spriteWidth, currentRow*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, scaledWidth, scaledHeight);
	
	if (drawThisFrame) {
		this.currentFrame++;
		if (this.currentFrame == columns*rows - framesToSkip) {
			this.currentFrame = 0;
		}
	}
};

DarkScott.prototype.Init = function() {
	// Load Attack Animations.
	let img = new Image();
	img.src = "Resources/Sprites/DarkScottForwardMultiattack.png"
	this.ForwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottBackwardMultiattack.png"
	this.BackwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottLeftMultiattack.png"
	this.LeftAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottRightMultiattack.png"
	this.RightAttackMap = img;


	// Load Teleport Animations.
	img = new Image();
	img.src = "Resources/Sprites/DarkScottForwardTeleport.png"
	this.ForwardTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottForwardReappear.png"
	this.ForwardReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottBackwardTeleport.png"
	this.BackwardTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottBackwardReappear.png"
	this.BackwardReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottLeftTeleport.png"
	this.LeftTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottLeftReappear.png"
	this.LeftReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottRightTeleport.png"
	this.RightTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/DarkScottRightReappear.png"
	this.RightReappearMap = img;

	// Init Start Time.
	this.attackTime = Date.now();
	this.teleportTime = Date.now();
};

DarkScott.prototype.GetAlive = function() {
	return this.alive;
};

DarkScott.prototype.GetSpriteWidth = function() {
	return this.spriteWidth;
};

DarkScott.prototype.GetSpriteHeight = function() {
	return this.spriteHeight;
};

DarkScott.prototype.GetScale = function() {
	return this.scale;
};