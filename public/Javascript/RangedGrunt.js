
function RangedGrunt(mainFPS, x, y, maxHealth, attackDamage, attackCooldown, direction) {
	this.spriteWidth = 416;
	this.spriteHeight = 416;
	this.scale = 0.27;

	this.x = x;
	this.y = y;

	this.ForwardAttackMap = null;
	this.BackwardAttackMap = null;
	this.LeftAttackMap = null;
	this.RightAttackMap = null;

	this.attackFPS = 7;
	this.attackColumn = 2;
	this.attackRow = 2;
	this.attackDamage = attackDamage; // 10

	this.myFrame = 0;
	this.currentFrame = 0;
	this.mainFPS = mainFPS;

	this.currentHealth = maxHealth;
	this.maxHealth = maxHealth; // 100
	this.healthBarHeight = 20; // in pixels
	this.alive = true;

	this.attackTime = null;

	this.timeBetweenAttacks = attackCooldown; // 1000 == 1 second.

	this.projectileSpeed = 1000;
	this.projectileColor = "#e52323";

	// States
	// 0: Forward, 1: Backward, 2: Left, 3: Right
	this.direction = direction; // 0

	// 0: Standing Still, 1: Attacking.
	this.state = 0;
}


RangedGrunt.prototype.Draw = function(ctx) {
	if (this.direction == 0) { // Forward.
		if (this.state == 0) { // Standing still
			ctx.drawImage(this.ForwardAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.ForwardAttackMap, this.attackFPS);
		}
	} else if (this.direction == 1) { // Backward.
		if (this.state == 0) { // Standing still
			ctx.drawImage(this.BackwardAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.BackwardAttackMap, this.attackFPS);
		}
	} else if (this.direction == 2) { // Left.
		if (this.state == 0) { // Standing still
			ctx.drawImage(this.LeftAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.LeftAttackMap, this.attackFPS);
		}
	} else if (this.direction == 3) { // Right.
		if (this.state == 0) { // Standing still
			ctx.drawImage(this.RightAttackMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.RightAttackMap, this.attackFPS);
		}
	}

	this.DrawHealthBar(ctx);
};

RangedGrunt.prototype.DrawHealthBar = function(ctx) {
	if (this.currentHealth > 0) {
		var barWidth = this.spriteWidth*this.scale;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y-this.healthBarHeight, barWidth, this.healthBarHeight);
		ctx.fillStyle = "green";
		var healthPercent = this.currentHealth/this.maxHealth
		ctx.fillRect(this.x, this.y-this.healthBarHeight, Math.floor(barWidth*healthPercent), this.healthBarHeight);
	}
};

RangedGrunt.prototype.CollisionHandler = function(p) {
	if (p.IsFriendly()) {
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

RangedGrunt.prototype.Update = function() {
	var currentTime = Date.now();

	// Decide when to attack.
	var attackDelta = currentTime - this.attackTime;
	if (this.state == 0 && attackDelta > this.timeBetweenAttacks) {
		this.state = 1;
	}

	// What to do if we're attacking.
	if (this.state == 1) {
		if (this.currentFrame+1 == this.attackColumn*this.attackRow) {
			this.state = 0;
			this.attackTime = Date.now();
			this.currentFrame = 0;

			// Attack.
			// Find out where Scott is.
			var scottX = Game.GetScott().GetX();
			var scottY = Game.GetScott().GetY();

			var scottSpriteWidth = Game.GetScott().GetSpriteWidth();
			var scottSpriteHeight = Game.GetScott().GetSpriteHeight();
			var scottSpriteScale = Game.GetScott().GetScale();

			var scottScaledWidth = scottSpriteWidth*scottSpriteScale;
			var scottScaledHeight = scottSpriteHeight*scottSpriteScale;

			var scottMidX = Math.floor(scottX + (scottScaledWidth/2));
			var scottMidY = Math.floor(scottY + (scottScaledHeight/2));

			// Find out where to shoot from.
			var scaledWidth = this.spriteWidth*this.scale;
			var scaledHeight = this.spriteHeight*this.scale;
			var midX = Math.floor(this.x + (scaledWidth/2));
			var midY = Math.floor(this.y + (scaledHeight/2));

			// Find direction vector.
			var dx = scottMidX - midX;
			var dy = scottMidY - midY;

			// Properly scale vector magnitude.
			scaledDX = (dx/Math.sqrt(dx*dx + dy*dy))*this.projectileSpeed;
			scaledDY = (dy/Math.sqrt(dx*dx + dy*dy))*this.projectileSpeed;

			// Fire Projectile at Scott.
			let p = new Projectile(midX, midY, scaledDX, scaledDY, 7, this.projectileColor, false, this.attackDamage);
			Game.AddProjectile(p);
		}
	}


};

RangedGrunt.prototype.Init = function() {
	// Load Attack Animations.
	img = new Image();
	img.src = "Resources/Sprites/GruntForwardAttack.png"
	this.ForwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntBackwardAttack.png"
	this.BackwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntLeftAttack.png"
	this.LeftAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/GruntRightAttack.png"
	this.RightAttackMap = img;

	// Start attack timer.
	this.attackTime = Date.now();
};

// framesToSkip is optional, it's 0 by default.
RangedGrunt.prototype.Animate = function(ctx, columns, rows, image, animationFPS, framesToSkip) {
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

RangedGrunt.prototype.GetAlive = function() {
	return this.alive;
};

RangedGrunt.prototype.GetSpriteWidth = function() {
	return this.spriteWidth;
};

RangedGrunt.prototype.GetSpriteHeight = function() {
	return this.spriteHeight;
};

RangedGrunt.prototype.GetScale = function() {
	return this.scale;
};