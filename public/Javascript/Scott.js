/*
Todo

Fix bug where Scott continues walking when there are
no keys pressed if two keys go up at the same time.
I'm afraid this is just a limitation of javascript games
and cannot be fixed.
*/


function Scott(mainFPS) {

	// Sprite Sizing
	// Note: Don't change width and height here.
	// You can only change the scale.
	this.spriteWidth = 416;
	this.spriteHeight = 416;
	this.scale = 0.27;
	
	// Image Maps.
	this.ForwardWalkMap = null;
	this.BackwardWalkMap = null;
	this.LeftWalkMap = null;
	this.RightWalkMap = null;

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

	// Animation Stuff.
	// Note: myFrame and currentFrame must be set back to 0
	// if the animation changes.
	this.myFrame = 0;
	this.currentFrame = 0;
	this.mainFPS = mainFPS;

	// Animation presets.
	this.walkFPS = 7;
	this.walkColumn = 2;
	this.walkRow = 2;

	this.attackFPS = 13;
	this.attackColumn = 2;
	this.attackRow = 3;
	this.attackFramesToSkip = 1;

	this.teleportFPS = 18;
	this.teleportColumn = 2;
	this.teleportRow = 4;
	this.currentTeleportPhase = 0; // 0: Disapearing, 1: Reapearing somewhere else.

	// Gameplay and positioning.
	this.x = window.innerWidth/2 - (this.spriteWidth*this.scale/2);
	this.y = window.innerHeight/2 - (this.spriteHeight*this.scale/2);
	this.walkingSpeed = 200; // Pixels per second.
	this.projectileSpeed = 1000;
	this.projectileColor = "#53c8f0";
	this.lastTime = null;

	this.currentHealth = 100;
	this.maxHealth = 100;
	this.healthBarHeight = 20; // in pixels
	this.alive = true;

	this.attackDamage = 10;

	this.teleportDistance = 400;
	this.teleportLocationX = null;
	this.teleportLocationY = null;

	this.mouseX = 0;
	this.mouseY = 0;

	// User input stuff.
	this.nextInput = -1;
	this.currentInput = -1;

	// States
	// 0: Forward, 1: Backward, 2: Left, 3: Right
	this.direction = 0;

	// 0: Standing Still, 1: Walking, 2: Attacking, 3: Teleporting
	this.state = 0;
};


Scott.prototype.Draw = function(ctx) {
	if (this.direction == 0) { // Forward
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.ForwardWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Walking.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.ForwardWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.ForwardAttackMap, this.attackFPS, this.attackFramesToSkip);
		} else if (this.state == 3) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.ForwardTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.ForwardReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 1) { // Backward.
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.BackwardWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Walking.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.BackwardWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.BackwardAttackMap, this.attackFPS, this.attackFramesToSkip);
		} else if (this.state == 3) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.BackwardTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.BackwardReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 2) { // Left.
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.LeftWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Walking.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.LeftWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.LeftAttackMap, this.attackFPS, this.attackFramesToSkip);
		} else if (this.state == 3) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.LeftTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.LeftReappearMap, this.teleportFPS);
			}
		}
	} else if (this.direction == 3) { // Right.
		if (this.state == 0) { // Standing still.
			ctx.drawImage(this.RightWalkMap, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*this.scale, this.spriteHeight*this.scale);
		} else if (this.state == 1) { // Walking.
			this.Animate(ctx, this.walkColumn, this.walkRow, this.RightWalkMap, this.walkFPS);
		} else if (this.state == 2) { // Attacking.
			this.Animate(ctx, this.attackColumn, this.attackRow, this.RightAttackMap, this.attackFPS, this.attackFramesToSkip);
		} else if (this.state == 3) { // Teleporting.
			if (this.currentTeleportPhase == 0) {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.RightTeleportMap, this.teleportFPS);
			} else {
				this.Animate(ctx, this.teleportColumn, this.teleportRow, this.RightReappearMap, this.teleportFPS);
			}
		}
	} else {
		alert("Scott->Draw: Invalid character direction.");
	}

	this.DrawHealthBar(ctx);
};

Scott.prototype.DrawHealthBar = function(ctx) {
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
Scott.prototype.CollisionHandler = function(p) {
	if (!p.IsFriendly()) {
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

Scott.prototype.Update = function() {

	if (this.state == 1) { // If we're walking.

		// Make sure walking speed is in pixels per second.
		if (this.lastTime == null) {
			this.lastTime = Date.now();
		}
		var currentTime = Date.now();
		var delta = (currentTime-this.lastTime)/1000;
		this.lastTime = currentTime;

		if (this.direction == 0) { // Forward.
			this.y += this.walkingSpeed*delta; 
		} else if (this.direction == 1) { // Backword.
			this.y -= this.walkingSpeed*delta;
		} else if (this.direction == 2) { // Left.
			this.x -= this.walkingSpeed*delta;
		} else if (this.direction == 3) { // Right.
			this.x += this.walkingSpeed*delta;
		} else {
			alert("Scott->Update: Invalid character direction.");
		}
	} else if (this.state == 2) { // If we're attacking.
		if (this.currentFrame+1 == this.attackColumn*this.attackRow - this.attackFramesToSkip) {
			this.state = 0;
		}
	} else if (this.state == 3) { // If we're teleporting.
		if (this.currentFrame+1 == this.teleportColumn*this.teleportRow && this.currentTeleportPhase == 0) {
			this.currentTeleportPhase = 1;
			this.x = this.teleportLocationX;
			this.y = this.teleportLocationY;
			this.currentFrame = 0;
		} else if (this.currentFrame+1 == this.teleportColumn*this.teleportRow && this.currentTeleportPhase == 1) {
			this.state = 0;
			this.currentTeleportPhase = 0;
		}
	}

	// Bounds Detection.
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;

	var scaledWidth = this.spriteWidth*this.scale;
	var scaledHeight = this.spriteHeight*this.scale;

	if (this.x < 0) {
		this.x = 0;
	}
	if (this.y < 0) {
		this.y = 0;
	}
	if (this.x+scaledWidth > screenWidth) {
		this.x = screenWidth-scaledWidth;
	}
	if (this.y+scaledHeight > screenHeight) {
		this.y = screenHeight-scaledHeight;
	}

	// Aid in smooth character controls.
	// console.log("Current: ", this.currentInput, "Next: ", this.nextInput);
	if (this.nextInput != -1 && this.currentInput == -1) {
		var eventObj = document.createEventObject ?
			document.createEventObject() : document.createEvent("Events");

		if(eventObj.initEvent){
			eventObj.initEvent("keydown", true, true);
		}

		eventObj.keyCode = this.nextInput;
		eventObj.which = this.nextInput;

		document.body.dispatchEvent ? document.body.dispatchEvent(eventObj) : document.body.fireEvent("onkeydown", eventObj);
	}
	
};

// framesToSkip is optional, it's 0 by default.
Scott.prototype.Animate = function(ctx, columns, rows, image, animationFPS, framesToSkip) {
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

Scott.prototype.Init = function() {
	// Set up listeners to get user input.

	// track mouse position.

	document.addEventListener('mousemove', function(event) {
		if (Game.IsBeingDisplayed()) {
			var mousePosX = event.clientX
			var mousePosY = event.clientY
			Game.GetScott().SetMousePosition(mousePosX, mousePosY);
		}
	}, false);

	document.addEventListener('keydown', function(event) {
		if (Game.IsBeingDisplayed()) {

			// Walking code.
			if (Game.GetScott().GetState() == 0) {
				var flag = false;
				if (event.keyCode == 87 && !flag) { // w
					Game.GetScott().ChangeDirection(1);
					Game.GetScott().ChangeState(1);
					Game.GetScott().SetCurrentInput(event.keyCode);
					flag = true;
				} else if (event.keyCode == 65 && !flag) { // a
					Game.GetScott().ChangeDirection(2);
					Game.GetScott().ChangeState(1);
					Game.GetScott().SetCurrentInput(event.keyCode);
					flag = true;
				} else if (event.keyCode == 83 && !flag) { // s
					Game.GetScott().ChangeDirection(0);
					Game.GetScott().ChangeState(1);
					Game.GetScott().SetCurrentInput(event.keyCode);
					flag = true;
				} else if (event.keyCode == 68 && !flag) { // d
					Game.GetScott().ChangeDirection(3);
					Game.GetScott().ChangeState(1);
					Game.GetScott().SetCurrentInput(event.keyCode);
					flag = true;
				}
			}

			if (Game.GetScott().GetCurrentInput() == Game.GetScott().GetNextInput()) {
				Game.GetScott().SetNextInput(-1);
			}
			if (Game.GetScott().GetState() == 1 && event.keyCode != Game.GetScott().GetCurrentInput() && Game.GetScott().GetCurrentInput() != -1) {
				Game.GetScott().SetNextInput(event.keyCode);
			}
			// console.log("Next: ", Game.GetScott().GetNextInput(), "Current: ", Game.GetScott().GetCurrentInput())

			// Teleport Code.
			if (event.keyCode == 16 && Game.GetScott().GetState() != 3) { // Add teleport cooldown here.
				Game.GetScott().SetCurrentInput(-1);
				Game.GetScott().SetNextInput(-1);
				Game.GetScott().SetLastTime(null);
				Game.GetScott().ChangeState(3);

				// Determine teleport position.
				var teleportDistance = Game.GetScott().GetTeleportDistance();

				var scaledWidth = Game.GetScott().GetSpriteWidth()*Game.GetScott().GetScale();
				var scaledHeight = Game.GetScott().GetSpriteHeight()*Game.GetScott().GetScale();
				var teleportX = Game.GetScott().GetMouseX()-(scaledWidth/2);
				var teleportY = Game.GetScott().GetMouseY()-(scaledHeight/2);

				var dx = teleportX - Game.GetScott().GetX();
				var dy = teleportY - Game.GetScott().GetY();

				if (dx*dx + dy*dy > teleportDistance*teleportDistance) { // Need to scale teleport distance.
					var scaledDX = (dx/Math.sqrt(dx*dx + dy*dy))*teleportDistance;
					var scaledDY = (dy/Math.sqrt(dx*dx + dy*dy))*teleportDistance;
					teleportX = Game.GetScott().GetX() + scaledDX;
					teleportY = Game.GetScott().GetY() + scaledDY;
				}
				

				Game.GetScott().SetTeleportLocation(teleportX, teleportY);
			}

		}
	});

	document.addEventListener('keyup', function(event) {
		if (Game.IsBeingDisplayed()) {
			if (Game.GetScott().GetState() == 1) {
				if (event.keyCode == Game.GetScott().GetNextInput()) {
					Game.GetScott().SetNextInput(-1);
				}

				// console.log(event)
				// console.log("KeyUpCode: ", event.keyCode);
				// console.log("Next: ", Game.GetScott().GetNextInput(), "Current: ", Game.GetScott().GetCurrentInput())

				event.preventDefault();
				if (event.keyCode == 87 && Game.GetScott().GetDirection() == 1) {        // w and state = Backward
					Game.GetScott().ChangeState(0);
					Game.GetScott().SetCurrentInput(-1);
				} else if (event.keyCode == 65 && Game.GetScott().GetDirection() == 2) { // a and state = Left 
					Game.GetScott().ChangeState(0);
					Game.GetScott().SetCurrentInput(-1);
				} else if (event.keyCode == 83 && Game.GetScott().GetDirection() == 0) { // s and state = Forward 
					Game.GetScott().ChangeState(0);
					Game.GetScott().SetCurrentInput(-1);
				} else if (event.keyCode == 68 && Game.GetScott().GetDirection() == 3) { // d and state = Right 
					Game.GetScott().ChangeState(0);
					Game.GetScott().SetCurrentInput(-1);
				}
			}
		}
	});

	document.addEventListener("click", function(event) {
		if (Game.IsBeingDisplayed() && Game.GetScott().GetState() != 3) {
			var flag = false;
			if (Game.GetScott().GetState() != 2) { // add cooldown check here.
				Game.GetScott().SetCurrentInput(-1);
				Game.GetScott().SetNextInput(-1);
				Game.GetScott().SetLastTime(null);
				Game.GetScott().ChangeState(2);

				var scaledWidth = Game.GetScott().GetSpriteWidth()*Game.GetScott().GetScale();
				var scaledHeight = Game.GetScott().GetSpriteHeight()*Game.GetScott().GetScale();
				var midX = Math.floor(Game.GetScott().GetX() + (scaledWidth/2));
				var midY = Math.floor(Game.GetScott().GetY() + (scaledHeight/2));

				var dx = event.clientX - midX;
				var dy = event.clientY - midY;
				var scaledDX = (dx/Math.sqrt(dx*dx + dy*dy))*Game.GetScott().GetProjectileSpeed();
				var scaledDY = (dy/Math.sqrt(dx*dx + dy*dy))*Game.GetScott().GetProjectileSpeed();

				if (scaledDX >= 0 && scaledDY >= 0) {
					if (Math.abs(scaledDX) >= Math.abs(scaledDY)) { // right
						Game.GetScott().ChangeDirection(3);
					} else { // down
						Game.GetScott().ChangeDirection(0);
						flag = true;
					}
				} else if (scaledDX >= 0 && scaledDY <= 0) {
					if (Math.abs(scaledDX) >= Math.abs(scaledDY)) { // right
						Game.GetScott().ChangeDirection(3);
					} else { // up
						Game.GetScott().ChangeDirection(1);
						flag = true;
					}
				} else if (scaledDX <= 0 && scaledDY >= 0) {
					if (Math.abs(scaledDX) >= Math.abs(scaledDY)) { // left
						Game.GetScott().ChangeDirection(2);
					} else { // down
						Game.GetScott().ChangeDirection(0);
						flag = true;
					}
				} else if (scaledDX <= 0 && scaledDY <= 0) {
					if (Math.abs(scaledDX) >= Math.abs(scaledDY)) { // left
						Game.GetScott().ChangeDirection(2);
					} else { // up
						Game.GetScott().ChangeDirection(1);
						flag = true;
					}
				}

				if (flag) {
					midX += 18;
				}
				midY += 20;

				dx = event.clientX - midX;
				dy = event.clientY - midY;
				scaledDX = (dx/Math.sqrt(dx*dx + dy*dy))*Game.GetScott().GetProjectileSpeed();
				scaledDY = (dy/Math.sqrt(dx*dx + dy*dy))*Game.GetScott().GetProjectileSpeed();

				let p = new Projectile(midX, midY, scaledDX, scaledDY, 7, Game.GetScott().GetProjectileColor(), true, Game.GetScott().GetAttackDamage());
				Game.AddProjectile(p);
			}
		}
	});

	// Load Walking Animations.
	let img = new Image();
	img.src = "Resources/Sprites/ScottForwardWalk.png";
	this.ForwardWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottBackwardWalk.png"
	this.BackwardWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottLeftWalk.png"
	this.LeftWalkMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottRightWalk.png"
	this.RightWalkMap = img;


	// Load Attack Animations.
	img = new Image();
	img.src = "Resources/Sprites/ScottForwardAttack.png"
	this.ForwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottBackwardAttack.png"
	this.BackwardAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottLeftAttack.png"
	this.LeftAttackMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottRightAttack.png"
	this.RightAttackMap = img;


	// Load Teleport Animations.
	img = new Image();
	img.src = "Resources/Sprites/ScottForwardTeleport.png"
	this.ForwardTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottForwardReappear.png"
	this.ForwardReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottBackwardTeleport.png"
	this.BackwardTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottBackwardReappear.png"
	this.BackwardReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottLeftTeleport.png"
	this.LeftTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottLeftReappear.png"
	this.LeftReappearMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottRightTeleport.png"
	this.RightTeleportMap = img;
	img = new Image();
	img.src = "Resources/Sprites/ScottRightReappear.png"
	this.RightReappearMap = img;
};

Scott.prototype.ChangeDirection = function(n) {
	this.currentFrame = 0;
	this.myFrame = 0;
	this.direction = n;
	// console.log("Direction: ", n);
};

Scott.prototype.GetDirection = function() {
	return this.direction;
};

Scott.prototype.ChangeState = function(n) {
	if (n == 0) {
		this.lastTime = null;
		this.currentInput = -1;
	}

	this.currentFrame = 0;
	this.myFrame = 0;
	this.state = n;
	// console.log("State: ", n);
};

Scott.prototype.GetState = function() {
	return this.state;
};

Scott.prototype.GetNextInput = function() {
	return this.nextInput;
};

Scott.prototype.SetNextInput = function(n) {
	this.nextInput = n;
};

Scott.prototype.GetCurrentInput = function() {
	return this.currentInput;
};

Scott.prototype.SetCurrentInput = function(n) {
	this.currentInput = n;
};

Scott.prototype.GetX = function() {
	return this.x;
};

Scott.prototype.GetY = function() {
	return this.y;
};

Scott.prototype.GetSpriteWidth = function() {
	return this.spriteWidth;
};

Scott.prototype.GetSpriteHeight = function() {
	return this.spriteHeight;
};

Scott.prototype.SetLastTime = function(n) {
	this.lastTime = n;
};

Scott.prototype.GetScale = function() {
	return this.scale;
};

Scott.prototype.GetProjectileSpeed = function() {
	return this.projectileSpeed;
};

Scott.prototype.GetProjectileColor = function() {
	return this.projectileColor;
};

Scott.prototype.GetTeleportDistance = function() {
	return this.teleportDistance;
};

Scott.prototype.SetTeleportLocation = function(x, y) {
	this.teleportLocationX = x;
	this.teleportLocationY = y;
};

Scott.prototype.SetMousePosition = function(x, y) {
	this.mouseX = x;
	this.mouseY = y;
};

Scott.prototype.GetMouseX = function() {
	return this.mouseX;
};

Scott.prototype.GetMouseY = function() {
	return this.mouseY;
};

Scott.prototype.GetAttackDamage = function() {
	return this.attackDamage;
};

Scott.prototype.TakeDamage = function(n) {
	this.currentHealth -= n;

	if (this.currentHealth <= 0) {
		// Dead.
		this.alive = false;
	}
};

Scott.prototype.IsAlive = function() {
	return this.alive;
};