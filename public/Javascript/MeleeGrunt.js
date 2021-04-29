
function MeleeGrunt(mainFPS, x, y, maxHealth, attackDamage, walkingSpeed) {
	this.spriteWidth = 416;
	this.spriteHeight = 416;
	this.scale = 0.27;

	this.x = x;
	this.y = y;

	this.ForwardWalkMap = null;
	this.BackwardWalkMap = null;
	this.LeftWalkMap = null;
	this.RightWalkMap = null;

	this.ForwardAttackMap = null;
	this.BackwardAttackMap = null;
	this.LeftAttackMap = null;
	this.RightAttackMap = null;

	this.walkFPS = 7;
	this.walkColumn = 2;
	this.walkRow = 2;
	this.walkingSpeed = walkingSpeed; // Pixels per second. 200

	this.attackFPS = 7;
	this.attackColumn = 2;
	this.attackRow = 2;
	this.attackDamage = attackDamage; // 10

	this.myFrame = 0;
	this.currentFrame = 0;
	this.mainFPS = mainFPS;

	this.currentHealth = maxHealth; // 100
	this.maxHealth = maxHealth;
	this.healthBarHeight = 20; // in pixels
	this.alive = true;

	this.lastTime = null;

	// States
	// 0: Forward, 1: Backward, 2: Left, 3: Right
	this.direction = 0;

	// 0: Standing Still, 1: Walking, 2: Attacking
	this.state = 0;
};

MeleeGrunt.prototype.Draw = function(ctx) {
	if (this.direction == 0) { // Forward
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.ForwardWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Running.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.ForwardWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.ForwardAttackMap, this.attackFPS);
		}
	} else if (this.direction == 1) { // Backward
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.BackwardWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Running.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.BackwardWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.BackwardAttackMap, this.attackFPS);
		}
	} else if (this.direction == 2) { // Left
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.LeftWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Running.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.LeftWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.LeftAttackMap, this.attackFPS);
		}
	} else if (this.direction == 3) { // Right
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.RightWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Running.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.RightWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.RightAttackMap, this.attackFPS);
		}
	}
	this.DrawHealthBar(ctx);
};

MeleeGrunt.prototype.DrawHealthBar = function(ctx) {
	if (this.currentHealth > 0) {
		var barWidth = this.spriteWidth*this.scale;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y-this.healthBarHeight, barWidth, this.healthBarHeight);
		ctx.fillStyle = "green";
		var healthPercent = this.currentHealth/this.maxHealth
		ctx.fillRect(this.x, this.y-this.healthBarHeight, Math.floor(barWidth*healthPercent), this.healthBarHeight);
	}
};

// Takes in a projectile and determines if it hit.
// If so, it does the damage.
MeleeGrunt.prototype.CollisionHandler = function(p) {
	if (p.IsFriendly()) {
		// Amount of pixels into the sprite the projectile can go.
		var pX = p.GetX();
		var pY = p.GetY();
		var pRadius = p.GetRadius();
		var boxX = (this.x+35)-pRadius;
		var boxY = (this.y+25)-pRadius;

		var scaledWidth = this.spriteWidth*this.scale - (35-pRadius);
		var scaledHeight = this.spriteHeight*this.scale - (35-pRadius);

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

MeleeGrunt.prototype.Update = function() {
	if (this.state == 0) { // standing still
		// find out where Scott is.
		var scottX = Game.GetScott().GetX();
		var scottY = Game.GetScott().GetY();

		var scottSpriteWidth = Game.GetScott().GetSpriteWidth();
		var scottSpriteHeight = Game.GetScott().GetSpriteHeight();
		var scottSpriteScale = Game.GetScott().GetScale();

		var scottScaledWidth = scottSpriteWidth*scottSpriteScale;
		var scottScaledHeight = scottSpriteHeight*scottSpriteScale;

		var scottMidX = Math.floor(scottX + (scottScaledWidth/2));
		var scottMidY = Math.floor(scottY + (scottScaledHeight/2));

		var scaledWidth = this.spriteWidth*this.scale;
		var scaledHeight = this.spriteHeight*this.scale;
		var midX = Math.floor(this.x + (scaledWidth/2));
		var midY = Math.floor(this.y + (scaledHeight/2));

		// find direction vector.
		var dx = scottMidX - midX;
		var dy = scottMidY - midY;

		if (Math.abs(dx) < scottScaledWidth/2 && Math.abs(dy) < scottScaledHeight/2) {
			this.state = 2;
		} else {
			this.state = 1;
		}
	} else if (this.state == 1) { // running.

		// find out where Scott is.
		var scottX = Game.GetScott().GetX();
		var scottY = Game.GetScott().GetY();

		var scottSpriteWidth = Game.GetScott().GetSpriteWidth();
		var scottSpriteHeight = Game.GetScott().GetSpriteHeight();
		var scottSpriteScale = Game.GetScott().GetScale();

		var scottScaledWidth = scottSpriteWidth*scottSpriteScale;
		var scottScaledHeight = scottSpriteHeight*scottSpriteScale;

		var scottMidX = Math.floor(scottX + (scottScaledWidth/2));
		var scottMidY = Math.floor(scottY + (scottScaledHeight/2));

		var scaledWidth = this.spriteWidth*this.scale;
		var scaledHeight = this.spriteHeight*this.scale;
		var midX = Math.floor(this.x + (scaledWidth/2));
		var midY = Math.floor(this.y + (scaledHeight/2));

		// find direction vector.
		var dx = scottMidX - midX;
		var dy = scottMidY - midY;

		// Make sure walking speed is in pixels per second.
		if (this.lastTime == null) {
			this.lastTime = Date.now();
		}
		var currentTime = Date.now();
		var delta = (currentTime-this.lastTime)/1000;
		this.lastTime = currentTime;

		if (Math.abs(dx) > 10) {
			if (dx >= 0) {
				this.x += this.walkingSpeed*delta;
				this.direction = 3;
			} else {
				this.x -= this.walkingSpeed*delta;
				this.direction = 2;
			}
		} else {
			if (dy >= 0) {
				this.y += this.walkingSpeed*delta;
				this.direction = 0;
			} else {
				this.y -= this.walkingSpeed*delta;
				this.direction = 1;
			}
		}
		// Find if already close enough.
		if (Math.abs(dx) < scottScaledWidth/2 && Math.abs(dy) < scottScaledHeight/2) {
			this.state = 2;
		}

	} else if (this.state == 2) {
		if (this.currentFrame+1 == this.attackColumn*this.attackRow) {
			this.state = 0;
			this.lastTime = Date.now();
			this.currentFrame = 0;
			this.myFrame = 0;

			// apply damage.
			Game.GetScott().TakeDamage(this.attackDamage);
		}
	}
};

// framesToSkip is optional, it's 0 by default.
MeleeGrunt.prototype.Animate = function(ctx, columns, rows, image, animationFPS, framesToSkip) {
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

MeleeGrunt.prototype.Init = function() {
	// Load Walking Animations.
	let img = new Image();
	img.src = "Resources/Sprites/GruntForwardWalk.png";
	this.ForwardWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntBackwardWalk.png"
	this.BackwardWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntLeftWalk.png"
	this.LeftWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntRightWalk.png"
	this.RightWalkMap = img;


	// Load Attack Animations.
	img = new Image();
	img.src = "Resources/Sprites/GruntForwardStab.png"
	this.ForwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntBackwardStab.png"
	this.BackwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntLeftStab.png"
	this.LeftAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntRightStab.png"
	this.RightAttackMap = img;
};


MeleeGrunt.prototype.GetAlive = function() {
	return this.alive;
};

MeleeGrunt.prototype.GetSpriteWidth = function() {
	return this.spriteWidth;
};

MeleeGrunt.prototype.GetSpriteHeight = function() {
	return this.spriteHeight;
};

MeleeGrunt.prototype.GetScale = function() {
	return this.scale;
};