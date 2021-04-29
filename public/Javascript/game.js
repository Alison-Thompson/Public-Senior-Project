/*
Todo

*/

Game = new Vue({
	el: '#Game',
	data: {
		v_isDisplayed: false, // Is the Game being shown?

		// Canvas stuff.
		v_canvas: null,
		v_screenWidth: 0,
		v_screenHeight: 0,
		v_ctx: null,

		// Game loop stuff.
		v_lastTick: null,
		v_currentTick: null,
		v_fps: 60,
		v_gameOver: false,

		// Objects.
		v_Scott: null,
		v_Enemies: [],
		v_Projectiles: [],

		// Level.
		v_level: 1,
		v_LevelHandler: null

	},
	methods: {

		ShowGame: function (bool) {
			this.v_isDisplayed = bool;

			if (bool) {
				this.Init();
			}
		},

		SetLevel: function (level) {
			this.v_level = level;
		},

		GetScott: function () {
			return this.v_Scott;
		},

		IsBeingDisplayed: function () {
			return this.v_isDisplayed;
		},

		AddProjectile: function (p) {
			this.v_Projectiles.push(p);
		},

		SpawnRangedGrunt: function(x, y, maxHealth, attackDamage, attackCooldown, direction) {
			let rg = new RangedGrunt(this.v_fps, x, y, maxHealth, attackDamage, attackCooldown, direction);
			rg.Init();
			this.v_Enemies.push(rg);
		},

		SpawnMeleeGrunt: function(x, y, maxHealth, attackDamage, walkingSpeed) {
			let mg = new MeleeGrunt(this.v_fps, x, y, maxHealth, attackDamage, walkingSpeed);
			mg.Init();
			this.v_Enemies.push(mg);
		},

		SpawnDarkScott: function(maxHealth, attackDamage, attackCooldown, teleportCooldown, friendly) {
			if (typeof friendly == 'undefined') {
				var friendly = false;
			}
			let ds = new DarkScott(this.v_fps, maxHealth, attackDamage, attackCooldown, teleportCooldown, friendly);
			ds.Init();
			this.v_Enemies.push(ds);
		},

		Tick: function () {
			if (this.v_isDisplayed && !this.v_gameOver) {
				window.requestAnimationFrame(this.Tick);

				this.v_currentTick = Date.now();
				var delta = this.v_currentTick-this.v_lastTick;
				var interval = 1000/this.v_fps;

				if (delta > interval) {
					this.v_lastTick = this.v_currentTick - (delta%interval)
					// Draw the frame
					this.Draw();
					this.Update();
				}
			}
		},

		Draw: function() {
			this.v_ctx.clearRect(0, 0, this.v_screenWidth, this.v_screenHeight)

			// Draw Scott
			this.v_Scott.Draw(this.v_ctx);

			// Draw Enemies
			for (var i = 0; i < this.v_Enemies.length; i++) {
				this.v_Enemies[i].Draw(this.v_ctx);
			}

			// Draw All Projectiles
			for (var i = 0; i < this.v_Projectiles.length; i++) {
				this.v_Projectiles[i].Draw(this.v_ctx);
			}
		},

		Update: function () {
			// Decide if level is beaten.
			if (this.v_LevelHandler.IsLevelComplete() && this.v_Enemies.length == 0) {
				this.GameOver();
				MainPage.FinishLevel(true, this.v_level);
				return;
			}
			if (!this.v_Scott.IsAlive()) {
				this.GameOver();
				MainPage.FinishLevel(false, this.v_level);
				return;
			}

			// Update Scott
			this.v_Scott.Update();

			// Update Level
			this.v_LevelHandler.Update();

			// Update Enemies
			for (var i = 0; i < this.v_Enemies.length; i++) {
				if (!this.v_Enemies[i].GetAlive()) {
					// If dead, clean from array.
					this.v_Enemies.splice(i, 1);
				} else {
					// Otherwise update.
					this.v_Enemies[i].Update();
				}
			}

			// Update All Projectiles
			for (var i = 0; i < this.v_Projectiles.length; i++) {
				this.v_Projectiles[i].Update();
				this.v_Scott.CollisionHandler(this.v_Projectiles[i]);

				for (var j = 0; j < this.v_Enemies.length; j++) {
					this.v_Enemies[j].CollisionHandler(this.v_Projectiles[i]);
				}

				if (this.v_Projectiles[i].ShouldClean()) {
					// Clean from array.
					this.v_Projectiles.splice(i, 1);
				}
			}
		},

		GameOver: function() {
			this.v_gameOver = true;
			this.v_Scott = null;
			this.v_Enemies = [];
			this.v_Projectiles = [];
			this.v_LevelHandler = null;

			this.v_isDisplayed = false;
			MainPage.ShowMainPage(true);
		},

		Init: function() {
			// Get the canvas.
			this.v_canvas = document.getElementById("gameCanvas");

			// Set up the canvas width and height to be the same as the screen.
			this.v_screenWidth = window.innerWidth;
			this.v_screenHeight = window.innerHeight;
			this.v_canvas.width = this.v_screenWidth;
			this.v_canvas.height = this.v_screenHeight;

			// Update canvas size if screen size changes.
			window.addEventListener('resize', function (e) {
				if (Game.IsBeingDisplayed()) { // Only if game is being displayed.
					canvas = document.getElementById("gameCanvas");
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;
				}
			});

			// Set up the context.
			this.v_ctx = this.v_canvas.getContext("2d");

			// Set up objects.
			this.v_Scott = new Scott(this.v_fps);
			this.v_Scott.Init();

			this.v_LevelHandler = new LevelHandler(this.v_fps, this.v_level);

			// Get game ready to start.
			this.v_gameOver = false;

			// Set up complete. Begin game loop.
			this.v_lastTick = Date.now();
			this.Tick();
		}

	},
	mounted: function () {
		if (this.v_isDisplayed) {
			this.Init();
		}
	},

	created: function () {
		// init
	}
});