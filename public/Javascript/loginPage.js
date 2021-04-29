getSession = function() {
	return fetch("https://limitless-hollows-74371.herokuapp.com/session", {
		credentials: "include"
	});
};

authenticateUser = function(email, password) {
	let data = "email=" + encodeURIComponent(email);
	data += "&plainPassword=" + encodeURIComponent(password);
	return fetch("https://limitless-hollows-74371.herokuapp.com/session", {
		credentials: "include",
		body: data,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
};

LoginPage = new Vue({
	el: '#LoginPage',
	data: {
		v_isDisplayed: true,
		v_mode: 0, // 0: Login, 1: Sign Up

		v_emailInput: "",
		v_passwordInput: "",

		v_server: new Server()

	},
	methods: {

		ShowLoginPage: function (bool) {
			this.v_isDisplayed = bool;
		},

		ChangeMode: function () {
			this.v_emailInput = "";
			this.v_passwordInput = "";
			if (this.v_mode == 0) {
				this.v_mode = 1;
			} else {
				this.v_mode = 0;
			}
		},

		AttemptLogin: function () {
			if (this.v_emailInput == "" && this.v_passwordInput == "") {
				alert("You must provide an email and a password.");
			} else if (this.v_emailInput == "") {
				alert("You must provide an email.");
			} else if (this.v_passwordInput == "") {
				alert("You must provide a password.");
			} else {
				authenticateUser(this.v_emailInput, this.v_passwordInput).then(response => {
					if (response.status == 401) {
						alert("Invalid Username or password.");
					} else if (response.status == 201) {
						this.CheckedLoggedIn();
					}
				});
			}
		},

		AttemptSignUp: function () {
			if (this.v_emailInput == "" && this.v_passwordInput == "") {
				alert("You must provide an email and a password.");
			} else if (this.v_emailInput == "") {
				alert("You must provide an email.");
			} else if (this.v_passwordInput == "") {
				alert("You must provide a password.");
			} else {
				// Create a new user.

				userData = "email=" + encodeURIComponent(this.v_emailInput) +
				"&plainPassword=" + encodeURIComponent(this.v_passwordInput) +
				"&scheduleData=" + encodeURIComponent(JSON.stringify([])) +
				"&classData=" + encodeURIComponent(JSON.stringify([])) +
				"&weekData=" + encodeURIComponent(JSON.stringify(1)) +
				"&friendData=" + encodeURIComponent(JSON.stringify([]));

				this.v_server.post("/user", userData, (res) => {
					if (res.status == 422) {
						alert("This email address is already in use.")
					} else {
						authenticateUser(this.v_emailInput, this.v_passwordInput).then(response => {
							// this.CheckedLoggedIn();
							this.v_isDisplayed = false;
							MainPage.ShowMainPage(true);
							MainPage.ResetGame();
						});
					}
				});
			}
		},

		CheckedLoggedIn: function () {
			getSession().then(response => {
				if (response.status == 401) {
					// not logged in
					// console.log("user is not logged in");
					// Show user login screen... do nothing.
				} else if (response.status == 200) {
					// logged in
					// console.log("user is logged in");
					// Load the users data and move them to the MainPage.
					this.v_isDisplayed = false;
					MainPage.ShowMainPage(true);
					MainPage.LoadGame();
				}
			});
		}

	},

	created: function () {
		// init
		this.CheckedLoggedIn();
	}
});