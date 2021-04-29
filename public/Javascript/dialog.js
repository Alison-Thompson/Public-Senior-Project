Dialog = new Vue({
	el: '#Dialog',
	data: {
		v_isDisplayed: false, // Is Dialog being shown?
		v_dialog: "No dialog has been printed yet. Print before" +
		"showing dialog screen or clear v_dialog beforehand.", // What the dialog box should display.
		v_dialogSpriteSource: "Resources/Sprites/Testing.png",
		v_dialogSpriteAlt: "Testing Image", // What's said if image can't be found.
		v_backgroundImage: null,
		v_showBackgroundImage: false,
		v_dialogPrinterSpeed: 40, // Set Dialog Printer Speed Here!
		v_callback: null,
		v_donePrinting: false
	},
	methods: {

		SetSprite: function (filePath) {
			v_dialogSpriteSource = filePath;
		},

		BoxClicked: function () {
			if (this.v_callback != null && this.v_donePrinting) {
				this.v_callback();
			}
		},

		DialogPrinter: function (str, callback, sprite, backgroundImage) {
			if (typeof backgroundImage !== 'undefined') {
				this.v_backgroundImage = backgroundImage;
				this.v_showBackgroundImage = true;
			} else {
				this.v_showBackgroundImage = false;
			}

			this.v_dialogSpriteSource = sprite;

			if (sprite == "none") {
				this.v_dialogSpriteSource = "";
			}

			this.v_donePrinting = false;
			this.v_callback = callback;
			this.v_isDisplayed = true;
			this.v_dialog = "";
			for (var i = 0; i < str.length; i++) {
				this.DialogPrinterHelper(str, i)
			}
		},

		DialogPrinterHelper: function (str, n) {
			setTimeout(() => {
				this.v_dialog += str.charAt(n);
				if (n == str.length - 1) {
					this.v_donePrinting = true;
				}
			}, this.v_dialogPrinterSpeed*n);
		},

		ShowDialog: function (bool, callback) {
			this.v_isDisplayed = bool;
			this.v_showBackgroundImage = false;	
		}


	},
	created: function () {
		// Called when the Vue app is loaded and ready.
		// this.DialogPrinter("Testing sfgfdsgfdsgdfsgfdsg");
	}
});

// function testing () {
// 	Dialog.ShowDialog(false); // Can call function like this 
// 	// from other file so long as we're sure that Dialog is done loading.
// 	// If Dialog is undefined consider using setTimeout.
// }