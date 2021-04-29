function Projectile(x, y, dx, dy, radius, color, isFriendly, damage) {
	// Projectile coords.
	this.x = x;
	this.y = y;

	// Drawing stuff.
	this.radius = radius;
	this.drawColor = color;

	// Speeds in pixels per second.
	this.dx = dx;
	this.dy = dy;

	this.projectileType = 0; // 0: Friendly, 1: Hostile

	// Timing stuff.
	this.lastTime = null;

	this.readyToBeCleaned = false; // When this is true, projectile is ready to be deleted.

	// Projectile Type
	this.isFriendly = isFriendly;

	// Projectile Damage
	this.damage = damage;
};

Projectile.prototype.Draw = function(ctx) {
	ctx.fillStyle = this.drawColor;
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
	ctx.fill();
};

Projectile.prototype.Update = function() {
	// Make sure speed is in pixels per second.
	if (this.lastTime == null) {
		this.lastTime = Date.now();
	}
	var currentTime = Date.now();
	var delta = (currentTime-this.lastTime)/1000;
	this.lastTime = currentTime;

	// Update location.
	this.x += this.dx*delta;
	this.y += this.dy*delta;

	// Bounds detection.
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;

	var scaledWidth = this.spriteWidth*this.scale;
	var scaledHeight = this.spriteHeight*this.scale;

	if (this.x+this.radius < 0) {
		this.readyToBeCleaned = true;
	} else if (this.y+this.radius < 0) {
		this.readyToBeCleaned = true;
	} else if (this.x-this.radius > screenWidth) {
		this.readyToBeCleaned = true;
	} else if (this.y-this.radius > screenHeight) {
		this.readyToBeCleaned = true;
	}
};

Projectile.prototype.ShouldClean = function() {
	return this.readyToBeCleaned;
};

Projectile.prototype.SetShouldClean = function(bool) {
	this.readyToBeCleaned = bool;
};

Projectile.prototype.IsFriendly = function() {
	return this.isFriendly;
};

Projectile.prototype.GetX = function() {
	return this.x;
};

Projectile.prototype.GetY = function() {
	return this.y;
};

Projectile.prototype.GetRadius = function() {
	return this.radius;
};

Projectile.prototype.GetDamage = function() {
	return this.damage;
};