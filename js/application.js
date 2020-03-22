var Shirn = {
	Views: {
		init: function(){
			// alles was überall gemacht werden soll, zb obere statusleiste
			Shirn.Basics.updateToolbar();
			
			
			$('a').on('click', function(e){
				e.preventDefault();
				if($(this).hasClass('cancelGame')){
					Shirn.Overlay.open('cancelGame');
				} else if($(this).attr('href') != '#'){
					window.location.replace($(this).attr('href'));
				}				
			});
			
			$('a.cancel').on('click', function(e){	
				Shirn.Overlay.close();
			});
		},
		start: function(){			
			Shirn.Storage.create();
			Shirn.Views.init();
			
			var levelQuote = Math.floor(parseInt(Shirn.Storage.get('exp', 'exp')) / parseInt(Shirn.Storage.get('exp', 'maxExp')) * 100);
			
			$('.game a').off().on('click', function(e){
				e.preventDefault();
				
				if (parseInt(Shirn.Storage.get('basic', 'energy')) < 30){
					Shirn.Overlay.open('openShop');
				} else {
					Shirn.Storage.set('game', 'colors', Shirn.Storage.get('config', 'colors'));
					Shirn.Storage.set('game', 'cells', Shirn.Storage.get('config', 'cells'));
					Shirn.Storage.set('game', 'exp', Shirn.Storage.get('config', 'exp'));
					window.location.replace('game.html');
				};
			});
			
			if(parseInt(Shirn.Storage.get('exp', 'exp')) == 0){
				levelQuote = 0;			
			}
			
			$(".selectCells option").each(function(){
			  if (parseInt($(this).val()) > parseInt(Shirn.Storage.get('basic', 'maxCells'))) {
				$(this).attr("disabled", "disabled");
			  }
			  if (parseInt($(this).val()) === parseInt(Shirn.Storage.get('config', 'cells'))) {
				$(this).attr("selected", "selected");
			  }
			});
			
			$(".selectColors option").each(function(){
			  if (parseInt($(this).val()) > parseInt(Shirn.Storage.get('basic', 'maxColors'))) {
				$(this).attr("disabled", "disabled");
			  }
			  if (parseInt($(this).val()) === parseInt(Shirn.Storage.get('config', 'colors'))) {
				$(this).attr("selected", "selected");
			  }
			});			
			
			$('select').on('change', function(){
				if(parseInt($('.selectCells').val()) > parseInt($('.selectColors').val())){
					var defaultValue = parseInt($(this).val());
					
					$('select:not(.'+ $(this).attr('class') +')').val(defaultValue);
					
					Shirn.Storage.set('config', 'cells', defaultValue);
					Shirn.Storage.set('config', 'colors', defaultValue);
				} else {
					Shirn.Storage.set('config', $(this).attr('data-keyname'), $(this).val());
				}
				
				Shirn.Basics.calcExp();
				
			});
			
			Shirn.Basics.calcExp();
			
			$('.level span').text(Shirn.Storage.get('basic', 'level'));
			$('.levelProgress span').text(levelQuote + '%');
			
						
			
			$('#openShop a.confirm').on('click', function(e){
				window.location.replace('shop.html');
			});	
			
			$('a.reset').on('click', function(e){				
				e.preventDefault();
				Shirn.Overlay.open('reset');
			});
			$('#reset a.confirm').on('click', function(e){
				Shirn.Storage.create(true);
				  Shirn.Basics.updateToolbar();
				  location.reload();
			});		
			
			$('.button a').on('click', function(){
				$(this).css({
						"opacity" : "0.3"
				});
			});
			// alles was auf der startseite gemacht werden soll
		},
		intro: function(){
			Shirn.Views.init();
			$('.intro-section:first').show();
			
			$('.intro-section .next').off().on('click', function(e){
				e.preventDefault();
				$(this).parent('div').hide();
				$('.intro-section.' + $(this).attr('data-attr')).show();
				$('html,body').scrollTop(0);
				
			});
			
		},
		stats: function(){
			Shirn.Views.init();
			
			var adQuote = Math.floor(parseInt(Shirn.Storage.get('statistik', 'statWon')) / parseInt(Shirn.Storage.get('statistik', 'statSum')) * 100),
				levelQuote = Math.floor(parseInt(Shirn.Storage.get('exp', 'exp')) / parseInt(Shirn.Storage.get('exp', 'maxExp')) * 100);
			
			if(parseInt(Shirn.Storage.get('statistik', 'statSum')) == 0){
				adQuote = 0;			
			}
			
			if(parseInt(Shirn.Storage.get('exp', 'exp')) == 0){
				levelQuote = 0;			
			}
			
			$('.level span').text(Shirn.Storage.get('basic', 'level'));
			$('.levelProgress span').text(Shirn.Storage.get('exp', 'exp') + '/' + Shirn.Storage.get('exp', 'maxExp') + ' (' + levelQuote + '%)');
			$('.levelNextFeature span').text(Shirn.Storage.get('exp', 'nextFeature'));
			
			$('.statWon span').text(Shirn.Storage.get('statistik', 'statWon'));
			$('.statSum span').text(Shirn.Storage.get('statistik', 'statSum'));
			$('.statPercent span').text(adQuote + '%');
			$('.pointsSum span').text(Shirn.Storage.get('statistik', 'pointsSum'));
			
		},
		impress: function(){
			Shirn.Views.init();
		},
		game: function(){
			Shirn.Views.init();
			Shirn.Storage.set('game', 'allColorsFound', 0);
			Shirn.Storage.set('items', 'bonusItemId', '');
			Shirn.Storage.set('game', 'pointsSum', Shirn.Storage.get('basic', 'points'));
			
			var basicHeight = $('.pileLines').height(),
				itemListHeight = $('.itemList').height(),
				itemListLinkHeight = $('.itemList a').height(),
				closedListLinkHeight = 0 - itemListHeight + basicHeight + itemListLinkHeight,
				maxGameCells = parseInt(Shirn.Storage.get('game', 'cells'));
			
			if(maxGameCells < 5){
				$('.row .cell.cell_5').addClass('locked');
			}
			if(maxGameCells < 6){
				$('.row .cell.cell_6').addClass('locked');
			}
			
			$('.check').hide();	
			$('.outsideCheck').removeClass('visible');
			
			$('.pileLines').css('height', basicHeight);
			$('body').css('padding-bottom', basicHeight);
			$('.outsideCheck').css('height', basicHeight - 2);
			$('.check').css('height', basicHeight + 'px');
			$('.itemList').css('bottom', closedListLinkHeight + 'px');
			
			$('.itemList a').on('click', function(e){
				if($(this).hasClass('closed')){
					$('.itemList').animate({bottom: basicHeight + 'px'}, 500);
					$(this).removeClass('closed');
				} else {
					$('.itemList').animate({bottom: closedListLinkHeight + 'px'}, 500);
					$(this).addClass('closed');
				}
			});
			
			setTimeout(function() {
				$("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
			}, 550);
			
			$('#gameLost a.confirm').on('click', function(e){
				window.location.replace('index.html');
			});
			$('#cancelGame a.confirm').on('click', function(e){
				window.location.replace('index.html');
			});
			
			Shirn.Combination.create();
			Shirn.Row.init();	
			Shirn.Item.initUse();
			Shirn.Storage.set('statistik', 'statSum', parseInt(Shirn.Storage.get('statistik', 'statSum')) + 1);			
		},
		shop: function(){
			Shirn.Views.init();
			Shirn.Item.checkBuy();
			
			$('.section:first').show();
			$('.tabs li').on('click', function(){
				$('.tabs li').removeClass('active');
				$(this).addClass('active');
				
				$('.section').hide();
				$('.' + $(this).attr('id')).show();
			});
			
			$('.section li a').on('click', function(e){
				if(!$(this).parents('.locked').length){
					
					$(this).animate({
						"color" : "#fff"
					}, 100, function(){
						$(this).animate({
							"color" : "#592C0E"
						}, 250);						
					});
					
					Shirn.Item.buy($(this).parents('li').attr('id'), parseInt($(this).find('span').text()));
				}				
			});
		},
	},
	Basics: {
		preloadImages: function(){
			var images = new Array()
			function preload() {
				for (i = 0; i < preload.arguments.length; i++) {
					images[i] = new Image()
					images[i].src = preload.arguments[i]
				}
			}
			preload(
				"img/energy-0.png",
				"img/energy-1.png",
				"img/energy-2.png",
				"img/energy-3.png",
				"img/energy-4.png",
				"img/energy-5.png",
				"img/energy-small-0.png",
				"img/energy-small-1.png",
				"img/energy-small-2.png",
				"img/energy-small-3.png",
				"img/energy-small-4.png",
				"img/energy-small-5.png",
				"img/shield-iconList-active.png",
				"img/button-back.png",
				"img/button-check-active.png"
			)
		
		},
		updateToolbar: function(){
			var maxEnergy = parseInt(Shirn.Storage.get('energy', 'maxEnergy')),
				currentEnergy = parseInt(Shirn.Storage.get('basic', 'energy')),
				newEnergyIcon = Math.floor(currentEnergy / maxEnergy * 100 / 20),
				newIdName = 'energy-' + newEnergyIcon;
			
			
				$('.toolbar .energy-bar').attr('id', newIdName);
			
			
			$('.toolbar .energy-bar span').text(currentEnergy + ' / ' + maxEnergy);
			
			$('.toolbar .points span').text(Shirn.Storage.get('basic', 'points'));
			//$('.toolbar .level span').text(Shirn.Storage.get('basic', 'level'));
		},
		calcExp: function(){
			var gameColors = parseInt(Shirn.Storage.get('config', 'colors')),
				gameCells = parseInt(Shirn.Storage.get('config', 'cells')),
				calcExp = (2*Math.pow(2, gameColors-2)) * (2*Math.pow(2, gameCells-1)) - 66;
			
			Shirn.Storage.set('config', 'exp', calcExp);
			$('.button.game span').text("(+ " + calcExp + " EXP)");
		},
		checkMaxEnergy: function(energy){
			if(energy <= 0){
				energy = 0;
				Shirn.Combination.lost('Du hast verloren, weil du keine Energie mehr hast.');
			}
			
			if(energy > parseInt(Shirn.Storage.get('energy', 'maxEnergy'))){
				energy = Shirn.Storage.get('energy', 'maxEnergy');
			}			
			
			return energy;
		},
		checkMaxPoints: function(points){
			if(points > 9999){
				points = 9999;
			}			
			
			return points;
		}
	},
	Storage: {
		create: function(reset){
			if (typeof localStorage.getItem("basic") != "string") {
				window.location.replace('intro.html');
			}
			  
			if (typeof localStorage.getItem("basic") != "string" || reset == true) {
			  localStorage.setItem("basic", "[level=1|points=100|maxColors=4|maxCells=4|energy=200|]");
			  localStorage.setItem("game", "[colors=4|cells=4|allColorsFound=0|modus=0|bonusItemId=0|pointsSum=0|exp=0|]");
			  localStorage.setItem("config", "[colors=4|cells=4|exp=0|]");
			  localStorage.setItem("items", "[item00=0|item01=0|item02=3|item03=0|item04=0|item05=0|]");			  
			  localStorage.setItem("combination", "[color1=0|color2=0|color3=0|color4=0|]");
			  localStorage.setItem("energy", "[maxEnergy=200|white=1|black=2|failed=5|row=25|bonus=50|]");
			  localStorage.setItem("statistik", "[statWon=0|statSum=0|pointsSum=0|]");
			  localStorage.setItem("exp", "[exp=0|maxExp=122|nextFeature=4|]");
			  
			  
			}		
		},
		set: function(keyName, name, wert) {
		  var keyContent = localStorage.getItem(keyName).replace('[', '').replace(']', '');
		// ausgeschaltet da game result negativ sein kann!
		  // if(wert < 0){
			// console.log('ERROR: Keyvalue was negativ! ' + name + ' was ' + wert + '.');
			// wert = 0;
		  // }
		  if(keyContent.indexOf(name) > -1){
			var replaceRegex = new RegExp(name + "=[^\|]*"),
			  newValue = name + '=' + wert;
			keyContent = keyContent.replace(replaceRegex, newValue);
			localStorage.setItem(keyName, '[' + keyContent + ']');
		  } else {
			localStorage.setItem(keyName, '[' + keyContent + name + '=' + wert + '|]');
		  }   
		},
		get: function(keyName, name) {
		  if(typeof (name) == 'undefined' || name == '' || typeof (keyName) == 'undefined' || keyName == ''){
			return 0;
		  } else {
			var keyWert,
			  keyContent = localStorage.getItem(keyName);
			if(keyContent.indexOf(name) > -1){
			  var matchTerm = new RegExp(name + '[^\|]*'),
				keyWert = keyContent.match(matchTerm).toString().replace(/.+?=/g, '');
			  return keyWert;
			} else {
			  return 0;
			}
		  }
		}
	},
	Combination: {
		create: function(){
			// create combination mit möglichen farben (zahlen) und speicher sie in der storage
			function generateNumber(){
				return Math.floor(Math.random() * (parseInt(Shirn.Storage.get('game', 'colors')))) + 1;
			}
			
			var i = 0,
				colors = [],
				generatedColor = generateNumber();
			
			// für jeden platz eine farbe erzeugen
			while (i < parseInt(Shirn.Storage.get('game', 'cells'))) {
				if($.inArray(generatedColor, colors) > -1){
					generatedColor = generateNumber();
					
				} else {
					colors.push(generatedColor);
					$('#pile' + generatedColor).attr('data-used', true);
					generatedColor = generateNumber();
					i++;
				}			
			}
			
			switch (parseInt(Shirn.Storage.get('game', 'cells'))) {
				case 4:
					localStorage.setItem("combination", "[color1="+colors[0]+"|color2="+colors[1]+"|color3="+colors[2]+"|color4="+colors[3]+"|]");
					break;
				case 5:
					localStorage.setItem("combination", "[color1="+colors[0]+"|color2="+colors[1]+"|color3="+colors[2]+"|color4="+colors[3]+"|color5="+colors[4]+"|]");
					break;
				case 6:
					localStorage.setItem("combination", "[color1="+colors[0]+"|color2="+colors[1]+"|color3="+colors[2]+"|color4="+colors[3]+"|color5="+colors[4]+"|color6="+colors[5]+"|]");
					break;
			}
		},
		
		check: function(guessValues){
			// überprüfe die kombination
			// returnt die values (anzahl weiße, anzahl schwarze)
			// sollten es genug schwarze sein, wird win ausgeführt
			// gibt den wert zur kalkulation an die bonus funktion
			var combinationArray = [],
				whiteItems = 0,
				blackItems = 0,
				failedItems = 0,
				energy = 0,
				points = 0,
				colorBonus = 0,
				bonusItem = Shirn.Storage.get('items', 'bonusItemId'),
				wonEnergy = 0,
				wonPoints = 0;
			
			for (i=0; i < parseInt(Shirn.Storage.get('game', 'colors')); i++) {
				combinationArray.push(parseInt(Shirn.Storage.get('combination', 'color' + (i + 1))));
			}
			
			$.each(guessValues, function(index, value) {
				if(value == parseInt(Shirn.Storage.get('combination', 'color' + (index + 1)))){
					//black
					blackItems++;	
					if(bonusItem == 'item02'){
						$('#pile'+value).parent().addClass('resultBlack');
					}
				} else if($.inArray(value, combinationArray) > -1){
					//white
					whiteItems++;
					if(bonusItem == 'item02'){
						$('#pile'+value).parent().addClass('resultWhite');
					}
				} else {
					//kein treffer
					failedItems++;
				}
			});
						
			// punkte eintragen	
			if(parseInt(Shirn.Storage.get('game', 'allColorsFound')) == 0 && (blackItems + whiteItems) == parseInt(Shirn.Storage.get('game', 'cells'))){
				// Farbbonus austeilen
				colorBonus = parseInt(Shirn.Storage.get('energy', 'bonus'));
				Shirn.Storage.set('game', 'allColorsFound', 1);
				Shirn.Combination.markUsedColors();				
			}
			
						
			wonPoints = blackItems * parseInt(Shirn.Storage.get('energy', 'black')) + whiteItems * parseInt(Shirn.Storage.get('energy', 'white'));
			wonEnergy = colorBonus - parseInt(Shirn.Storage.get('energy', 'row')) - failedItems * parseInt(Shirn.Storage.get('energy', 'failed'));
			
			points = wonPoints + parseInt(Shirn.Storage.get('basic', 'points'));
			points = Shirn.Basics.checkMaxPoints(points);
			
			energy = wonEnergy + parseInt(Shirn.Storage.get('basic', 'energy'));
			energy = Shirn.Basics.checkMaxEnergy(energy);
			
			if(Shirn.Storage.get('items', 'bonusItemId') == 'item00' && energy > parseInt(Shirn.Storage.get('basic', 'energy'))){
				// Wenn Energie Schild aktiv
				Shirn.Storage.set('basic', 'energy', energy);
			} else if(Shirn.Storage.get('items', 'bonusItemId') != 'item00') {
				Shirn.Storage.set('basic', 'energy', energy);
			}
			
			Shirn.Storage.set('basic', 'points', points);
			
			return [whiteItems, blackItems];
		},
		markUsedColors: function(){
			$('.pile').each(function(){
				if($(this).attr('data-used') == 'true'){
					$(this).addClass('used');
				} else {
					$(this).addClass('not-used');
				}
			});
		},
		won: function(){
			// addiere die gewonnen punkte zu den gesamt punkten und zeige gewinnerscreen, ggf. abenteuer update
			Shirn.Row.disable();
			
			var level = parseInt(Shirn.Storage.get('basic', 'level')),
				exp = parseInt(Shirn.Storage.get('exp', 'exp')),
				maxExp = parseInt(Shirn.Storage.get('exp', 'maxExp')),
				wonExp = parseInt(Shirn.Storage.get('game', 'exp')),
				points = parseInt(Shirn.Storage.get('basic', 'points')),
				colors = parseInt(Shirn.Storage.get('basic', 'maxColors')),
				cells = parseInt(Shirn.Storage.get('basic', 'maxCells')),
				gameColors = parseInt(Shirn.Storage.get('game', 'colors')),
				gameCells = parseInt(Shirn.Storage.get('game', 'cells')),
				rowBonus = Math.floor($('.row:not(.done)').length * gameCells * parseInt(Shirn.Storage.get('energy', 'black'))),
				wonPoints,
				statPoints,
				levelUp = 0,
				newLevel = level + 1;
			
			Shirn.Storage.set('basic', 'energy', Shirn.Storage.get('energy', 'maxEnergy'));
			Shirn.Storage.set('statistik', 'statWon', parseInt(Shirn.Storage.get('statistik', 'statWon')) + 1);
			Shirn.Storage.set('basic', 'points', Shirn.Basics.checkMaxPoints(points + rowBonus + 4 * gameColors * (gameCells - 3)));
			
			
			wonPoints = parseInt(Shirn.Storage.get('basic', 'points')) - parseInt(Shirn.Storage.get('game', 'pointsSum'));			
			statPoints = parseInt(Shirn.Storage.get('statistik', 'pointsSum')) + wonPoints;		
			Shirn.Storage.set('statistik', 'pointsSum', statPoints);
					
			if(exp + wonExp >= maxExp){
				levelUp = 1;
				Shirn.Storage.set('basic', 'level', level+1);
				Shirn.Storage.set('exp', 'exp', 0);
				Shirn.Storage.set('exp', 'maxExp', Math.pow(newLevel+1,2) + 18*newLevel + 100);
			} else {
				Shirn.Storage.set('exp', 'exp', exp + wonExp);
			}
			
			// beim levelup neues Feature checken
			if(levelUp){				
				switch(newLevel){				
					case 4:
						Shirn.Storage.set('exp', 'nextFeature', '8');
						Shirn.Combination.newColor(colors);
						break;
					case 8:
						Shirn.Storage.set('exp', 'nextFeature', '15');
						Shirn.Combination.newColor(colors);
						break;
					case 15:
						Shirn.Storage.set('exp', 'nextFeature', '24');
						Shirn.Combination.newCell(cells);
						break;
					case 24:
						Shirn.Storage.set('exp', 'nextFeature', '38');
						Shirn.Combination.newColor(colors);
						break;
					case 38:
						Shirn.Storage.set('exp', 'nextFeature', '60');
						Shirn.Combination.newColor(colors);
						break;
					case 60:
						Shirn.Storage.set('exp', 'nextFeature', '-');
						Shirn.Combination.newCell(cells);
						break;				
				}	
				$('#wonGame .content p.levelUp').show();
			}	else {
				$('#wonGame .content p.levelUp').hide();
			}	
			
			$('#wonGame .content p.wonPoints span').text(wonPoints);
			$('#wonGame .content p.wonExp span').text(wonExp);
			
			Shirn.Overlay.open('wonGame');
			
			$('#wonGame a.confirm').on('click', function(e){
				window.location.href ="index.html";
				Shirn.Basics.updateToolbar();
			});		
		},
		lost: function(lostMessage){
			$('#gameLost .content p').text(lostMessage);
			Shirn.Overlay.open('gameLost');			
		},
		newColor: function(colors){
			Shirn.Storage.set('basic', 'maxColors', colors+1);	
			Shirn.Storage.set('config', 'colors', colors+1);
			$('#wonGame .content p.newColor').show();			
		},
		newCell: function(cells){
			Shirn.Storage.set('basic', 'maxCells', cells+1);			
			Shirn.Storage.set('config', 'cells', cells+1);	
			$('#wonGame .content p.newCell').show();
		}
	},
	Row: {
		init: function(){
			$('.row a').hide().on('click', function(e){
				e.preventDefault();
			});
			
			//$('.row[data-status="free"]:first').find('.sell').show();
			
			for (i=$('.outsideBox').length; i > parseInt(Shirn.Storage.get('game', 'colors')); i--) {
				$('.outsideBox[data-value="active"]:last').attr('data-value', 'locked').addClass('locked');
			}
		
			$('.check').on('click', function(e){
				Shirn.Row.check();
			});
			
			$('.outsideBox[data-value="active"] .pile').draggable({ 
				distance: 6,
				revert: 'invalid',
				zIndex: 100
			});
			
			$('.outsideBox[data-value="active"] .pile').on('click', function(){
				if($(this).parent().hasClass('outsideBox') && $('.active .cell:not(:has(*), .locked):first').length){
					Shirn.Row.droped($(this), $('.active .cell:not(:has(*)):first'));
				} else if($(this).parent().hasClass('cell')){
					Shirn.Row.droped($(this), $('.outsideBox[data-value="active"]:not(:has(*)):first'));
				}	
			});
			
			Shirn.Row.enable();
			
		},
		droped: function (srcElement, targetElement){
			var srcParent = $(srcElement).parent(),
				targetPile = $(targetElement).find('.pile');
			
			if(($(targetElement).hasClass('cell') || $(targetElement).hasClass('outsideBox')) && $(targetElement).find('*').length){
				$(srcParent).prepend($(targetPile));
			}
			
			$(targetElement).prepend($(srcElement));		
			$('.pile').css({left:0,top:0});
			
			Shirn.Row.update();
		},
		update: function(){
			// eine änderung wurde vorgenommen, überürpfen der rows
			// schauen ob alle cells gefüllt sind
			var cellsFull = true;
			$('.row.active').children('.cell:not(.locked)').each(function(){
				if(!$(this).children().length){
					cellsFull = false;
				}
			});
			if(cellsFull){
				$('.check').show();
				$('.outsideCheck').addClass('visible');
			}	else {
				$('.check').hide();
				$('.outsideCheck').removeClass('visible');
			}
		},
		check: function(){
			// verarbeitet die rückgabe: wenn nicht gewonnen wird next ausgeführt
			// wenn gewonnen wird die anzeige noch ausgeführt an der row, mehr aber nicht
			var guessValues = [],
				guessResult = [],
				newEnergyWidth;
			$('.row.active .pile').each(function(){
				guessValues.push(parseInt($(this).attr('data-value')));
			});
			
			guessResult = Shirn.Combination.check(guessValues);			
			$('.row.active .result div').css('display', 'inline-block'); 
			$('.row.active .result .whiteResult').text(guessResult[0]); 
			$('.row.active .result .blackResult').text(guessResult[1]); 
			//$('.row.active .result .whiteResult').css('background-image', 'url(img/guessWhiteResult' + guessResult[0] + '.png)'); 
			//$('.row.active .result .blackResult').css('background-image', 'url(img/guessBlackResult' + guessResult[1] + '.png)'); 
			
			
			
			if(guessResult[1] === parseInt(Shirn.Storage.get('game', 'cells'))){
				Shirn.Combination.won();
			} else {
				Shirn.Basics.updateToolbar();
				Shirn.Row.next();				
			}
		},
		next: function(){			
			Shirn.Row.disable();					
			
			if($('.row.next').length){
				$('.row.next').removeClass('next').addClass('active').attr('data-status', 'active');
				Shirn.Row.enable();
				
				if($('.row.active').prev('.row[data-status="free"]').length){
					$('.row.active').prev('.row').addClass('next').attr('data-status', 'next');
				}
			
			} else {
				Shirn.Combination.lost('Du hast keine Zeilen mehr frei und deshalb verloren.');
			}
		},
		enable: function(){
			
			$('.active .cell:not(.locked), .outsideBox[data-value="active"]').droppable({
				accept: ".pile",
				drop: function(event,ui){
					Shirn.Row.droped($(ui.helper), $(event.target))
				}
			});
		},
		disable: function(){
			var currentPile;
			
			$('.check').hide();	
			$('.outsideCheck').removeClass('visible');			
			$('.active .cell:not(.locked)').droppable("destroy");
			
			$('.row.active .cell:not(.locked)').each(function(){
				currentPile = $(this).find('.pile');
				$(this).addClass('donePile' + currentPile.attr('data-value'));
				$('.outsideBox#pos' + currentPile.attr('data-value')).prepend($(currentPile));
			});
			
			$('.outsideBox:not(.locked) .pile').each(function(){
				$('.outsideBox#pos' + $(this).attr('data-value')).prepend($($(this)));
			});
			
			$('.row.active').removeClass('active').addClass('done').attr('data-status', 'done');
		},
		sell: function(){
			// wenn verkaufen geklickt wurde
			// setzt die zeile auf verkauft
			// addiert den wert zum möglichen gewinn (bonus funktion)
			//
		}
	},
	Item : {
		checkBuy: function(){
			// checken welche gegenstände gekauft werden können
			var currentPoints = parseInt(Shirn.Storage.get('basic', 'points')),
				currentEnergy = parseInt(Shirn.Storage.get('basic', 'energy')),
				maxEnergy = parseInt(Shirn.Storage.get('energy', 'maxEnergy')),
				itemId,
				costs,
				benefit;
			
			$('.section li').removeClass('locked');	
			
			$('.section-1 li').each(function(){
				itemId = $(this).attr('id');
				costs = parseInt($(this).find('a span').text());
				benefit = parseInt($(this).attr('data-value'));
								
				if(itemId == 'swap00' && currentEnergy < costs){
					$(this).addClass('locked');
				};
				
				if(itemId == 'instant00' && (currentPoints < costs || maxEnergy <= currentEnergy)){
					$(this).addClass('locked');
				};
				
				if(itemId == 'instant05' && (currentEnergy > 40 || currentPoints > 40)){
					$(this).addClass('locked');
				};
				
			});
			
			$('.section-2 li, .section-3 li').each(function(){
				itemId = $(this).attr('id');
				costs = parseInt($(this).find('a span').text());
				
				if(currentPoints < costs){
					$(this).addClass('locked');
				};
				
				// Max energy von 9999 nicht übersteigen
				if(itemId == 'instant01' && maxEnergy >= 9000){
					$(this).addClass('locked');
				}
					
				$(this).find('.stock span').text(Shirn.Storage.get('items', itemId));
				$(this).find('.currentBonus span').text(Shirn.Storage.get($('#'+itemId).attr('data-keyname'), $('#'+itemId).attr('data-key')));
			});
		},
		buy: function(itemId, costs){
			var points = parseInt(Shirn.Storage.get('basic', 'points')),
				energy = parseInt(Shirn.Storage.get('basic', 'energy')),
				pointsAfter = points - costs,
				energyAfter = energy - costs,
				items = parseInt(Shirn.Storage.get('items', itemId)),
				itemsAfter = items + 1,
				keyname,
				key,
				value;
			
			if(itemId == 'swap00'){
				Shirn.Storage.set('basic', 'energy', energyAfter);
				// item fähigkeit ausführen
				value = parseInt($('#swap00').attr('data-value'))  + points;
				
				Shirn.Storage.set('basic', 'points', Shirn.Basics.checkMaxPoints(value));
			} else if(itemId.indexOf('instant') != -1){				
				Shirn.Storage.set('basic', 'points', pointsAfter);
				// item fähigkeit ausführen
							
				keyname = $('#'+itemId).attr('data-keyname');
				key = $('#'+itemId).attr('data-key');
				value = parseInt($('#'+itemId).attr('data-value')) + parseInt(Shirn.Storage.get(keyname, key));
				
				if(itemId == 'instant00' || itemId == 'instant05'){
					value = Shirn.Basics.checkMaxEnergy(value);
				}
				
				Shirn.Storage.set(keyname, key, value);
			} else {
				Shirn.Storage.set('basic', 'points', pointsAfter);
				Shirn.Storage.set('items', itemId, itemsAfter);
			}
			
			
			Shirn.Basics.updateToolbar();
			Shirn.Item.checkBuy();			
		},
		initUse: function(){
			var tempId,
				tempItemAmount,
				shildId;
			$('.itemList li').on('click', function(){
				$('#buyShild .content p').text('Willst du dich mit dem Schild "' + $(this).attr('data-name') + '" für das restliche Spiel ausrüsten?');
				Shirn.Overlay.open('buyShild');
				shildId = $(this).attr('id');
			}).each(function(){
				tempId = $(this).attr('id');
				tempItemAmount = parseInt(Shirn.Storage.get('items', tempId));
				$(this).find('.stock span').text(tempItemAmount);
				
				if(tempItemAmount == 0){
					$(this).addClass('locked').off();
				}
			});
			$('#buyShild a.confirm').on('click', function(e){
				Shirn.Item.use(shildId);
				Shirn.Overlay.close();
			});
		},
		use: function(itemId){
			// item im spiel benutzen und aktion ausführen
			Shirn.Storage.set('items', itemId, (parseInt(Shirn.Storage.get('items', itemId)) - 1));
			Shirn.Storage.set('items', 'bonusItemId', itemId);
			Shirn.Item.updateItemList();
			$('.itemList a').addClass('used');
			
			switch (itemId) {
				case 'item00':
					//keine energie verlieren
					break;
				case 'item01':
					// alle farben anzeigen
					Shirn.Combination.markUsedColors();	
					break;					
				case 'item02':
					// Erzähl Modus: bewertung an der farbe anzeigen
					break;
			}
		},
		updateItemList: function(){
			$('.itemList li').off().each(function(){
				tempId = $(this).attr('id');
				tempItemAmount = parseInt(Shirn.Storage.get('items', tempId));
				$(this).find('.stock span').text(tempItemAmount);
					$(this).addClass('locked').off().on('click', function(e){
						e.preventDefault;
					});
			});
			
			setTimeout(function() {
				$('.itemList a').trigger('click').off().on('click', function(e){
				e.preventDefault();
				});
			}, 400);
			
			
		}
	},
	Overlay: {
		open: function(overlayId){
			var viewHeight = $('html').height() > $(window).height() ? $('html').height() : $(window).height();
			$('.overlay-background').css({
				'height': viewHeight
			}).show();
			$('.overlay#' + overlayId).show();
		},
		close: function(){
			$('.overlay-background').hide();
			$('.overlay').hide();
		}
	}
};