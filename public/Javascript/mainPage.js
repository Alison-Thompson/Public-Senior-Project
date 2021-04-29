// Needed to make divs scrollable without scrollbar. Only work with google chrome! Maybe other stuff.
// Orignial unmodified function https://stackoverflow.com/questions/11700927/horizontal-scrolling-with-mouse-wheel-in-a-div

function scrollHorizontally(e) {
	e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	document.getElementById('schedule').scrollLeft -= (delta * 20); // Modify scroll speed here.
	e.preventDefault();
}

getSession = function() {
	return fetch("http://localhost:8080/session", {
		credentials: "include"
	});
};


MainPage = new Vue({
	el: '#MainPage',
	data: {
		v_isDisplayed: false,
		v_classes: [
			{imageSource: "Resources/Sprites/MathProf.png", imageAlt: "Testing Image",
			 name: "Math", grade: "A", gradeNum: 10},
			 {imageSource: "Resources/Sprites/BiologyProf.png", imageAlt: "Testing Image",
			 name: "Biology", grade: "A", gradeNum: 10},
			 {imageSource: "Resources/Sprites/HistoryProf.png", imageAlt: "Testing Image",
			 name: "History", grade: "A", gradeNum: 10},
			 {imageSource: "Resources/Sprites/MontologyProf.png", imageAlt: "Testing Image",
			 name: "Montology", grade: "A", gradeNum: 10},
			 {imageSource: "Resources/Sprites/EnglishProf.png", imageAlt: "Testing Image",
			 name: "English", grade: "A", gradeNum: 10}
		],

		v_schedule: [
			{name: "Math Homework.", impact: "Low", level: 1, classIndex: 0, bossLevel: false}
		],

		// v_schedule: [
			// {name: "Math Quiz.", impact: "Low", level: 21, classIndex: 0, bossLevel: false},
			// {name: "English: Short Essay.", impact: "Low", level: 22, classIndex: 4, bossLevel: false},
			// {name: "Biology Drawing Assignment.", impact: "Low", level: 23, classIndex: 1, bossLevel: false},
			// {name: "History Paper.", impact: "Low", level: 24, classIndex: 2, bossLevel: false},
			// {name: "Montology: Hike up the mountain.", impact: "High", level: 25, classIndex: 3, bossLevel: true},
		// ],

		v_friends: [
			{name: "Test Friend1", imageSource: "Resources/Sprites/Testing.png", imageAlt: "Testing Image", blurb:"TestingBlurb", style: "friend"},
			{name: "Test Friend2", imageSource: "Resources/Sprites/Testing.png", imageAlt: "Testing Image", blurb:"TestingBlurb", style: "friend"},
			{name: "Test Friend3", imageSource: "Resources/Sprites/Testing.png", imageAlt: "Testing Image", blurb:"TestingBlurb", style: "friend"},
			{name: "Test Friend4", imageSource: "Resources/Sprites/Testing.png", imageAlt: "Testing Image", blurb:"TestingBlurb", style: "friend"},
			{name: "Test Friend5", imageSource: "Resources/Sprites/Testing.png", imageAlt: "Testing Image", blurb:"TestingBlurb", style: "friend"},
		],

		v_friends: [],

		v_week: 0,

		v_gameOver: false,

		v_currentFriend: null,
		v_currentFriendIndex: -1,
		v_currentScheduleItem: null,
		v_activeClassIndex: -1,
		v_activeScheduleIndex: -1,

		v_server: new Server(),
		v_userID: null
	},
	methods: {

		ViewFriend: function (currentFriend, currentFriendIndex) {
			if (!this.v_currentFriend) { // Select friend if one isn't already selected.
				currentFriend.style = "highlightedFriend";
				this.v_currentFriend = currentFriend;
				this.v_currentFriendIndex = currentFriendIndex;
			} else if (this.v_currentFriend == currentFriend) { // Unselect currently selected friend.
				currentFriend.style = "friend";
				this.v_currentFriend = null;
				this.v_currentFriendIndex = -1;
			} else { // Change selected friend.
				currentFriend.style = "highlightedFriend";
				this.v_currentFriend.style = "friend";
				this.v_currentFriend = currentFriend;
				this.v_currentFriendIndex = currentFriendIndex;
			}
		}, 

		StartLevel: function (level, classIndex, scheduleIndex) {
			if (this.v_currentFriend == null) { // if isn't friend is selected.

				Dialog.DialogPrinter("(Picking up his pencil, Scott allows his thoughts to come forward.)", () => {
					Dialog.ShowDialog(false);
					this.ShowPreLevelDialog(level, () => {
						this.v_activeClassIndex = classIndex;
						this.v_activeScheduleIndex = scheduleIndex;
						Game.SetLevel(level);

						this.ShowMainPage(false);
						Game.ShowGame(true);
					});
				}, "none");
				
			} else if (this.v_currentFriend != null && this.v_schedule[scheduleIndex].bossLevel) {
				Dialog.DialogPrinter("I'm afraid you can't handoff an assignment of this much importance.", () => {
					Dialog.ShowDialog(false);
				}, "Resources/Sprites/Linda.png");
			} else { // if friend is selected.
				this.ShowFriendDialog(this.v_currentFriend);
				var temp = this.v_currentFriendIndex;
				this.ViewFriend(this.v_currentFriend, this.v_currentFriendIndex);
				this.v_friends.splice(temp, 1);
				this.v_schedule.splice(scheduleIndex, 1);
				if (this.v_schedule.length == 0) {
					this.EndOfWeekDialog();
				} else {
					this.UpdateServer();
				}
			}
			
		},

		FinishLevel: function(passed, level) {
			Dialog.DialogPrinter("(Slowly, Scott's mind comes back to reality.)", () => {
				Dialog.ShowDialog(false);
					if (passed) {
						this.v_schedule.splice(this.v_activeScheduleIndex, 1);
						this.v_activeScheduleIndex = -1;
						this.v_activeClassIndex = -1;
					} else {
						if (this.v_schedule[this.v_activeScheduleIndex].bossLevel) {
							this.DeductGrade(this.v_activeClassIndex, 2);
						} else {
							this.DeductGrade(this.v_activeClassIndex, 1);
						}

						this.v_schedule.splice(this.v_activeScheduleIndex, 1);
						this.v_activeScheduleIndex = -1;
						this.v_activeClassIndex = -1;
					}

					if (!this.v_gameOver) {
						this.ShowPostLevelDialog(level, () => {
							if (this.v_schedule.length == 0) {
								this.EndOfWeekDialog();
							} else {
								this.UpdateServer();
							}
						});
					}
					
				}, "none", "Resources/Images/blackBackground.jpg");
		},

		DeductGrade: function(classIndex, amount) {
			this.v_classes[classIndex].gradeNum -= amount;
			if (this.v_classes[classIndex].gradeNum <= 0) {
				this.v_classes[classIndex].gradeNum = 0;

				// handle game over.
				this.v_gameOver = true;
				Dialog.DialogPrinter("Scott... I'm afraid your grades have fallen too low to continue." +
					" As of now, I have no other choice then to ask you to leave the school." +
					" I'm sorry it had to end this way.", () => {
						Dialog.DialogPrinter("Game Over...", () => {
							Dialog.ShowDialog(false);
							this.ResetGame();
						}, "none", "Resources/Images/blackBackground.jpg");
				}, "Resources/Sprites/Testing.png", "Resources/Images/blackBackground.jpg");
			}

			switch(this.v_classes[classIndex].gradeNum) {
				case 0:
					this.v_classes[classIndex].grade = "F";
					break;
				case 1:
					this.v_classes[classIndex].grade = "D-";
					break;
				case 2:
					this.v_classes[classIndex].grade = "D";
					break;
				case 3:
					this.v_classes[classIndex].grade = "D+";
					break;
				case 4:
					this.v_classes[classIndex].grade = "C-";
					break;
				case 5:
					this.v_classes[classIndex].grade = "C";
					break;
				case 6:
					this.v_classes[classIndex].grade = "C+";
					break;
				case 7:
					this.v_classes[classIndex].grade = "B-";
					break;
				case 8: 
					this.v_classes[classIndex].grade = "B";
					break;
				case 9:
					this.v_classes[classIndex].grade = "B+";
					break;
				case 10:
					this.v_classes[classIndex].grade = "A";
					break;
			}
		},

		ShowMainPage: function (bool) {
			this.v_isDisplayed = bool;
		},

		ShowPreLevelDialog: function (level, callback, dialogPart) {
			// Show some dialog before the level starts.
			if (typeof dialogPart == 'undefined') {
				var dialogPart = 0;
			}

			if (level == -2) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("my testing string is kinda long", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Testing.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("my testing string is kinda long 2", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/Scott.png");
				}
			} else if (level == 1) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("What? Where am I? Who are those guys?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("...", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Grunt.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("You're in your mind Scott. Anyone you see is a personification of your thoughts.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Linda.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("Really? Ninjas?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("(Linda laughs.)", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "none", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("Everyone's mind interprets them differently. Defeat the ones that are aggressive, or you see as evil. This will allow kinder, good thoughts to come forth during your daily life.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Linda.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("Defeat them how?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("It's your mind. You're the only one in control there.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Linda.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 8) {
					Dialog.DialogPrinter("(Use wasd to move, left click to attack, and left shift to teleport toward your mouse.)", () => {
						this.v_schedule = [
							{name: "Math Homework.", impact: "Low", level: 1, classIndex: 0, bossLevel: false},
							{name: "Biology Quiz.", impact: "Low", level: 2, classIndex: 1, bossLevel: false},
							{name: "History Homework.", impact: "Low", level: 3, classIndex: 2, bossLevel: false},
							{name: "Montology Homework.", impact: "Low", level: 4, classIndex: 3, bossLevel: false},
							{name: "Write an essay about yourself.", impact: "High", level: 5, classIndex: 4, bossLevel: true}
						];
						Dialog.ShowDialog(false);
						callback();
					}, "none", "Resources/Images/blackBackground.jpg");
				}
			}

			else if (level == 5) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("...", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("W-Who are you?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Aren't you just adorable? I'm you Scott.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("What does that even mean? (He does look like me...)", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("Isn't it obvious? I'm the part of you that comes out in our darkest moments. I'm our anger, our vengence.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("You're... I... I need to destroy you.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("Hah! Good luck with that.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else if (level == 7) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Hey, I'm Kayne. I guess we've got to work on this poster together. Let's get started.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/Kayne.png");
				}
			}

			else if (level == 10) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("(A hike up Celeste mountain, huh? How hard could it be? Nothing could possibly go wrong.)", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("(Scott begins making his way farther up Celeste mountain.)", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "none");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("You again?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("As I said last time. You can't get rid of me so easily. I'm not some errant thought. I'm a core part of your being.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("Your the problem with me. You're why I can't be happy. Why won't you just go away!", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("YOU THINK I'M THE PROBLEM! I THINK IT'S TIME FOR SOME SELF-REFLECTION!", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else if (level == 11) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Um... Hi Scott. I'm in your math class and I was wondering if you'd like to study together before the test.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Emily.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Yeah, sure. I'd love that.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("(Scott and Emily study together for a long time until they both feel confidant in taking the test.)", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			}

			else if (level == 15) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Hey man. You ready to present?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Kayne.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Heck yeah I am.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("...", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("You're here again?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("...", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else if (level == 18) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Sup dude, I'm Teven. We got a Bio test soon and you're going to help me get ready. No, you don't have a choice.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/Teven.png");
				}
			}

			else if (level == 20) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Wait! Let's not fight. Can we just talk for a second?", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Hmph. With you being so determined to \"destroy\" me, I thought this was your favorite part.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else if (level == 25) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("I think I understand now.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("I think you do as well.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("You told me to forgive myself for dad's death. Because... somehow you knew it was my fault.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("I was created from those dark thoughts, and they are why I still exist. Only when you accept that dad's " + 
										 "death wasn't your fault, will I ever fade.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("But it was my fault! I should have reacted faster! I should've known! If I had called an ambulance just a little faster, " + 
										 "maybe he'd still be here today. Instead I just stared like an idiot.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("Or maybe it was the fault of the doctors who tried to save him. Or his own fault for not taking better care of himself. " + 
										 "Maybe you could have saved him. Maybe not. Whatever the case, you have to let it go.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("I'm not sure that I can.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("Mom said that the best things in life don't come easy. And she's right. Overcoming grief is not an easy thing to do, " +
										 "but we can do it together.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 8) {
					Dialog.DialogPrinter("You're me. That doesn't even make any sense.", () => {
						this.ShowPreLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 9) {
					Dialog.DialogPrinter("Come. Let's tackle your dark thoughts. Together.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else { // if no dialog needs to be played.
				callback();
			}
		},

		ShowPostLevelDialog: function (level, callback, dialogPart) {
			// Show some dialog after a level.
			if (typeof dialogPart == 'undefined') {
				var dialogPart = 0;
			}

			if (typeof callback == 'undefined') {
				callback = function () {};
			}

			if (level == -2) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Post level dialog test", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Testing.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Post level dialog test 2", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/Testing.png");
				}
			} else if (level == 1) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Well done. Now that you see how things will be here. What do you think?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Linda.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("I-I think I'm willing to give this a try.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Good. Well, get started on your other assignments for the week, and don't worry too much. If you need me, I'll be there.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Linda.png");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("(With a comforting smile, Linda leaves the dorm.)", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			} else if (level == 4) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Uh, hi! My name's Sera. You're in Montology with me.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Sera.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Um, hey... I'm Scott. This place is pretty crazy, huh?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Yeah, it really is. I think it's starting to help me though. My thoughts when I'm not... you know... are really clear.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Sera.png");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("I can kinda feel it too. It's pretty cool.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("True. Well, I've got to run. It's been nice to meet you Scott.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Sera.png");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("(Sera has become your friend.)", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
						this.v_friends.push({name: "Sera", imageSource: "Resources/Sprites/Sera.png", imageAlt: "Testing Image", blurb:"Sera is a nice girl that shares a Montology class with Scott. She's extremely shy.", style: "friend"});
					}, "none");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("(Friends can be selected from the list on the top right. If a friend is selected when you try to start a level, you'll be asking them to do it for you. " + 
										 "Each friend will only do one assignment for you, and they won't do high impact assignments.)", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			} else if (level == 5) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Hmph, you can't get rid of me so easily Scott. I'm a part of you. You can't survive without me.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			} else if (level == 7) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Man, that was hard. Nice working with you Scott.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Kayne.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Yeah, you too Kayne.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("(Kayne has become your friend.)", () => {
						this.v_friends.push({name: "Kayne", imageSource: "Resources/Sprites/Kayne.png", imageAlt: "Testing Image", blurb:"Kayne is a big guy with a strong work ethic. He became good friends with Scott after working on a History project together.", style: "friend"});
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			} else if (level == 10) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("H-He... He's gone... Thank God...", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/Scott.png");
				}
			} else if (level == 11) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Wow, that test was hard. I'm so glad we prepared. Anyway, see you around.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Emily.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("(Emily has become your friend.)", () => {
						this.v_friends.push({name: "Emily", imageSource: "Resources/Sprites/Emily.png", imageAlt: "Testing Image", blurb:"Emily is a small girl who is a natural at normal class work. She might just be something of a genius.", style: "friend"});
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			} else if (level == 15) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("When are you going to stay gone?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("I can never leave you alone; even if I wanted to. We are one and the same.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			} else if (level == 18) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Man that test was so easy! I probably didn't even need to study. Anyway, it's a good thing we did cause you needed my genius. See you around, dude.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Teven.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("(Teven has become your friend.)", () => {
						this.v_friends.push({name: "Teven", imageSource: "Resources/Sprites/Teven.png", imageAlt: "Testing Image", blurb:"Teven shares a Biology class with Scott. While he can be kind of rude, he's a loyal friend.", style: "friend"});
						Dialog.ShowDialog(false);
						callback();
					}, "none");
				}
			} else if (level == 20) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Wait up! Don't go yet. Let's just talk. Please forgive me for saying I want to destroy you. I didn't mean that.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("I am you, Scott. I can only forgive you when you forgive yourself.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Forgive myself for what?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("I think you already know the answer to that. We both know it isn't what dad would want. I'll see you soon.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			} else if (level == 25) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Are they really gone?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("For now, but... not forever.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Then how do we beat them?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg")
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("You can never beat them permanently. This is a constant battle. Whether it is made physical by the mountain or not.", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("So... we just fight them back forever?", () => {
						this.ShowPostLevelDialog(level, callback, dialogPart+1);
					}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg")
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("There are more of us then you can possibly know. With each good thought you have, you create and ally against the bad ones. " + 
										 "Goodbye for now Scott. I hope to see you next semester.", () => {
						Dialog.ShowDialog(false);
						callback();
					}, "Resources/Sprites/DarkScott.png", "Resources/Images/blackBackground.jpg");
				}
			}

			else {
				callback();
			}
		},

		ShowFriendDialog: function (friend, dialogPart) {
			if (typeof dialogPart == 'undefined') {
				var dialogPart = 0;
			}

			if (friend.name == "Sera") {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Uh... Yeah, I'd be happy to help.", () => {
						Dialog.ShowDialog(false);
					}, friend.imageSource);
				}
			} else if (friend.name == "Kayne") {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Consider it done.", () => {
						Dialog.ShowDialog(false);
					}, friend.imageSource);
				}
			} else if (friend.name == "Emily") {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Not a problem. You can count on me.", () => {
						Dialog.ShowDialog(false);
					}, friend.imageSource);
				}
			} else if (friend.name == "Teven") {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Pfff, you need help with that easy thing? It's a wonder you ever get anything done without me.", () => {
						Dialog.ShowDialog(false);
					}, friend.imageSource);
				}
			}
		},

		ShowBeginningDialog: function(dialogPart) {
			if (typeof dialogPart == 'undefined') {
				var dialogPart = 0;
			}

			// Mom and Scott. Black Background.
			if (dialogPart == 0) {
				Dialog.DialogPrinter("Are you sure about this Scott?", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/mom.png", "Resources/Images/blackBackground.jpg");
			} else if (dialogPart == 1) {
				Dialog.DialogPrinter("I'm only going for one semester mom. It'll be fine. Besides, this is something I need to do.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
			} else if (dialogPart == 2) {
				Dialog.DialogPrinter("I know honey, I just worry is all. This college though. I've never even heard of it before they sent you that letter. Just... make sure you call often so I know you're okay.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/mom.png", "Resources/Images/blackBackground.jpg");
			} else if (dialogPart == 3) {
				Dialog.DialogPrinter("Of course.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png", "Resources/Images/blackBackground.jpg");
			} else if (dialogPart == 4) {
				Dialog.DialogPrinter("(The car stops in the parking lot.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none", "Resources/Images/blackBackground.jpg")
			} else if (dialogPart == 5) {
				Dialog.DialogPrinter("Well, we're here. Talk to you soon honey.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/mom.png", "Resources/Images/blackBackground.jpg");
			}


			// Scott and Owen. Office Background.
			else if (dialogPart == 6) {
				Dialog.DialogPrinter("(Later that night.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none", "Resources/Images/office.jpg")
			} else if (dialogPart == 7) {
				Dialog.DialogPrinter("Welcome to Blackwood, Scott. My name is Owen. I'm the headmaster here. I must say that we're excited to have you at our school.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Testing.png", "Resources/Images/office.jpg");
			} else if (dialogPart == 8) {
				Dialog.DialogPrinter("Uh... hi. (Is it normal to be greeted by the headmaster on my first day?)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png", "Resources/Images/office.jpg");
			} else if (dialogPart == 9) {
				Dialog.DialogPrinter("I've already assigned you your schedule for the semester.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Testing.png", "Resources/Images/office.jpg");
			} else if (dialogPart == 10) {
				Dialog.DialogPrinter("(Headmaster Owen hands Scott some papers and a key.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none", "Resources/Images/office.jpg")
			} else if (dialogPart == 11) {
				Dialog.DialogPrinter("That's the key to your dorm room. Our adviser will meet you tomorrow morning and go over everything with you.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Testing.png", "Resources/Images/office.jpg");
			} else if (dialogPart == 12) {
				Dialog.DialogPrinter("Sounds good.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png", "Resources/Images/office.jpg");
			} else if (dialogPart == 13) {
				Dialog.DialogPrinter("Only the best for our students... Anyhow, it's late and you should head to your dorm and to bed. Have a nice night Scott.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Testing.png", "Resources/Images/office.jpg");
			}

			// Background Dorm Room. Scott alone.
			else if (dialogPart == 14) {
				Dialog.DialogPrinter("Wow, this is already super weird. I wonder if it's too late to call mom and go home...", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
			}

			// Background main page. Scott and Linda.
			else if (dialogPart == 15) {
				Dialog.DialogPrinter("(Knock, knock, knock.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none")
			} else if (dialogPart == 16) {
				Dialog.DialogPrinter("Who could be here so early in the morning?", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 17) {
				Dialog.DialogPrinter("Good morning, my name is Linda. I'm going to be your advisor here at Blackwood.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 18) {
				Dialog.DialogPrinter("Nice to meet you.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 19) {
				Dialog.DialogPrinter("Sorry for coming so early. I've got a lot of students to get around to before classes begin so I have to get an early start.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 20) {
				Dialog.DialogPrinter("That's fine. Do you want to come in?", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 21) {
				Dialog.DialogPrinter("(You both take a seat at the kitchen counter.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none")
			} else if (dialogPart == 22) {
				Dialog.DialogPrinter("So, you should already have your schedule and a map of campus. Make sure you make it to your classes on time just as you would in any other school.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 23) {
				Dialog.DialogPrinter("Of course. (Is that all she wanted to tell me?)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 24) {
				Dialog.DialogPrinter("Now, for the... stranger aspects of the school.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 25) {
				Dialog.DialogPrinter("Wait, what do you mean stranger?", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 26) {
				Dialog.DialogPrinter("You don't know? It was all in the letter we sent to you when offering you admittance.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 27) {
				Dialog.DialogPrinter("Oh, yeah... Uh, could you just go over it with me again? (Probably should have read that entire thing. Oops.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 28) {
				Dialog.DialogPrinter("I can. So, as the letter explained, the mountain this school was built on is quite special.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 29) {
				Dialog.DialogPrinter("Celeste mountain. I've heard stories but I never thought they were true.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 30) {
				Dialog.DialogPrinter("They're frighteningly true. As the folk lore says, this mountain gives form to your inner self. At least, higher up it does. Down here at the base the mountain should only help bring forward thoughts.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 31) {
				Dialog.DialogPrinter("So... my thoughts will come to life? That's crazy! Why would you build a school here!", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 32) {
				Dialog.DialogPrinter("To help people. Scott... we wanted you to come here because we thought we could help you. Tell me, when's the last time you were happy?", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 33) {
				Dialog.DialogPrinter("I... I-I don't know.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 34) {
				Dialog.DialogPrinter("Please just give this a shot. The reason I'm here is to walk you through a homework assignment.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 35) {
				Dialog.DialogPrinter("I... Okay.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 36) {
				Dialog.DialogPrinter("(Linda pulls out a piece of paper. It looks like basic arithmetic.)", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "none")
			} else if (dialogPart == 37) {
				Dialog.DialogPrinter("That's just normal math homework.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Scott.png");
			} else if (dialogPart == 38) {
				Dialog.DialogPrinter("Start doing the work Scott. Let your thoughts come forward.", () => {
					this.ShowBeginningDialog(dialogPart+1);
				}, "Resources/Sprites/Linda.png");
			} else if (dialogPart == 39) {
				Dialog.DialogPrinter("(To start doing the homework, select it on the bottom of the screen.)", () => {
					Dialog.ShowDialog(false);
				}, "none")
			}
		},

		EndOfWeekDialog: function (dialogPart) {
			if (typeof dialogPart == 'undefined') {
				var dialogPart = 0;
			}

			if (this.v_week == 0) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("(Ring, ring, ring.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Hey honey, how are you doing?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("I-I... I don't know if I can do this mom...", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("Are you sure? It's only been a week. You were so determined when I dropped you off.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("It's... it's just hard. I saw something that really rattled me.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("Scott... I believe in you, and after rereading that letter they sent you. I think they can really help you.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("I think they can too... I'm just not sure if I can survive it.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("The best things in life Scott... they don't come easy. You have to try and try until you're ready to give up. " +
										 "But once you're done, you'll be very happy you did it. It's going to be hard, but you can finish.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 8) {
					Dialog.DialogPrinter("Okay... I'll keep trying.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 9) {
					Dialog.DialogPrinter("Good. It's late hun, try and get some sleep. Next week will treat you better.", () => {
						Dialog.ShowDialog(false);
						this.v_schedule = [
						{name: "Mathematical Drawing.", impact: "Low", level: 6, classIndex: 0, bossLevel: false},
						{name: "History Poster.", impact: "Low", level: 7, classIndex: 2, bossLevel: false},
						{name: "English Vocab.", impact: "Low", level: 8, classIndex: 4, bossLevel: false},
						{name: "Biology Homework.", impact: "Low", level: 9, classIndex: 1, bossLevel: false},
						{name: "Montology: A lone hike up the mountain.", impact: "High", level: 10, classIndex: 3, bossLevel: true}]
						this.v_week = 1;
						this.UpdateServer();
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				}
			} else if (this.v_week == 1) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("(Ring, ring, ring.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Hi Scott. How's your night going.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("To be honest, I'm having a pretty good night. I feel... lighter.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("That's amazing. You sound like your handling the school much better now.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("I suppose I am. It's still weird here, but... I think I can do it.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("That's great sweetie. I'm so proud of you, and I hope you know your father would be proud as well.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("I... I guess. Uh, I'm going to head to bed. Goodnight mom!", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("Goodnight Scott. I love you hun.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 8) {
					Dialog.DialogPrinter("I love you too, mom.", () => {
						this.v_schedule = [
						{name: "Math Test.", impact: "High", level: 11, classIndex: 0, bossLevel: true},
						{name: "Montology Homework.", impact: "Low", level: 12, classIndex: 3, bossLevel: false},
						{name: "English: Short Paper.", impact: "Low", level: 13, classIndex: 4, bossLevel: false},
						{name: "Biology Homework.", impact: "Low", level: 14, classIndex: 1, bossLevel: false},
						{name: "History Presentation.", impact: "High", level: 15, classIndex: 2, bossLevel: true}]
						this.v_week = 2;

						Dialog.ShowDialog(false);
						this.UpdateServer();
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				}
			}

			else if (this.v_week == 2) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("(Ring, ring, ring.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Mom?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("What is it sweetheart?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("There's this... guy. He won't leave me alone. I don't know what to do.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("I assume this \"guy\" isn't someone you can talk to your headmaster about?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("Yeah. I don't know what to do about him.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("If this person won't leave you alone, then he probably wants your attention. You should try and understand him. " +
										 "Try to see things from his point of view.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("I... Okay mom. I'll try.", () => {

						this.v_schedule = [
							{name: "Math Homework.", impact: "Low", level: 16, classIndex: 0, bossLevel: false},
							{name: "Montology: Meditation.", impact: "Low", level: 17, classIndex: 3, bossLevel: false},
							{name: "English: Start a Journal.", impact: "High", level: 20, classIndex: 4, bossLevel: true},
							{name: "Biology Test.", impact: "High", level: 18, classIndex: 1, bossLevel: true},
							{name: "History Homework.", impact: "Low", level: 19, classIndex: 2, bossLevel: false}
						];

						this.v_week = 3;
						Dialog.ShowDialog(false);
						this.UpdateServer();
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				}
			}

			else if (this.v_week == 3) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("(Ring, ring, ring.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("Hey Scott. Did you talk to your guy?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Yeah... I did. He mentioned dad. He said I had to forgive myself. I'm starting to understand what he's talking about.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("Sweetie, I can't say I understand exactly what he's talking about. But... you're father's death hurt us both in ways that " +
										 "can't be fixed. If he says you need to forgive yourself, then that's what you should try to do.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("Okay mom... I'll try.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png", "Resources/Images/dormNight.jpg");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("Greetings students, this is headmaster Owen. This is the last week of the semester, so I just want you all to make sure " + 
										 "you all finish up with the \"assignments\" you're dealing with. I wish you all a wonderful summer break.", () => {
						
						this.v_schedule = [
							{name: "Math Quiz.", impact: "Low", level: 21, classIndex: 0, bossLevel: false},
							{name: "English: Short Essay.", impact: "Low", level: 22, classIndex: 4, bossLevel: false},
							{name: "Biology Drawing Assignment.", impact: "Low", level: 23, classIndex: 1, bossLevel: false},
							{name: "History Paper.", impact: "Low", level: 24, classIndex: 2, bossLevel: false},
							{name: "Montology: Hike up the mountain.", impact: "High", level: 25, classIndex: 3, bossLevel: true},
						];

						this.v_week = 4;
						Dialog.ShowDialog(false);
						this.UpdateServer();
					}, "Resources/Sprites/Testing.png");
				}
			} else if (this.v_week = 4) {
				if (dialogPart == 0) {
					Dialog.DialogPrinter("Hey. Are you ready to go?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png");
				} else if (dialogPart == 1) {
					Dialog.DialogPrinter("(Scott gazes lovingly out at the school grounds.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none");
				} else if (dialogPart == 2) {
					Dialog.DialogPrinter("Yeah... I think I am ready.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 3) {
					Dialog.DialogPrinter("Did you ever decide whether you're going to come back after summer?", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/mom.png");
				} else if (dialogPart == 4) {
					Dialog.DialogPrinter("I'm definitely coming back. I have unfinished business here.", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "Resources/Sprites/Scott.png");
				} else if (dialogPart == 5) {
					Dialog.DialogPrinter("(Thank you for playing The Battle Though Blackwood.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none");
				} else if (dialogPart == 6) {
					Dialog.DialogPrinter("(Coded by Logan Thompson.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none");
				} else if (dialogPart == 7) {
					Dialog.DialogPrinter("(Written by Logan Thompson.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none");
				} else if (dialogPart == 8) {
					Dialog.DialogPrinter("(Animated by Logan Thompson.)", () => {
						this.EndOfWeekDialog(dialogPart+1)
					}, "none");
				} else if (dialogPart == 9) {
					Dialog.DialogPrinter("(The End. Click to play again.)", () => {
						Dialog.ShowDialog(false);
						this.ResetGame();
					}, "none", "Resources/Images/blackBackground.jpg");
				}
			}
		},

		ResetGame: function() {
			this.v_friends = [];

			this.v_gameOver = false;

			for (var i = 0; i < this.v_classes.length; i++) {
				this.v_classes.gradeNum = 10;
				this.v_classes.grade = "A";
			}

			this.v_schedule = [
				{name: "Math Homework.", impact: "Low", level: 1, classIndex: 0, bossLevel: false}
			];

			this.ShowBeginningDialog();

			// load start game data to the server.
			getSession().then(response => {
				response.text().then(text => {
					this.v_userID = JSON.parse(text)._id;
					this.UpdateServer();
				});
			});
		},

		LoadGame: function() {
			getSession().then(response => {
				response.text().then(text => {
					var data = JSON.parse(text);
					this.v_userID = data._id;
					this.v_schedule = JSON.parse(data.scheduleData);
					this.v_classes = JSON.parse(data.classData);
					this.v_week = parseInt(JSON.parse(data.weekData));
					this.v_friends = JSON.parse(data.friendData);
				});
			});
		},

		UpdateServer: function() {
			userData = "scheduleData=" + encodeURIComponent(JSON.stringify(this.v_schedule)) +
				"&classData=" + encodeURIComponent(JSON.stringify(this.v_classes)) +
				"&weekData=" + encodeURIComponent(JSON.stringify(this.v_week)) +
				"&friendData=" + encodeURIComponent(JSON.stringify(this.v_friends));
			this.v_server.put("/user/"+this.v_userID, userData);
		}


	},
	created: function () {
		// Called when the Vue app is loaded and ready.
		document.getElementById('schedule').addEventListener('mousewheel', scrollHorizontally, false);
		// this.ShowBeginningDialog();
	}
});