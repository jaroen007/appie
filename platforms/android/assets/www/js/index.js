var app = {
    initialize: function() {
        this.bindEvents();
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		//NOTE: the pot overview is already in the DOM. The splashscreen is just a layer that peels off.
		setTimeout(function() {   
		    $('.loadingScreen').fadeOut('slow', function() {
				$('.loadingScreen').remove();
				$('.main').removeClass('hide');
				$('.main').fadeIn('slow');
			});				

			if($('#row').children().length == 0){
				$('#row').prepend('<div class="col-xs-6 add"><i class="fa fa-plus fa-5x" aria-hidden="true"></i></div>');
			}
		}, 2000);
		
		$(document).on('click', '.add', function (e) {
			console.log("clicked on adddd");
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					if(result.cancelled != true){
						console.log("not canceled");
						//TODO: make a check to actually check it scanned a good qr code and not a random one.
						$('#row').append('<div class="col-xs-6 circle" id="'+result.text+'" data-thickness="3"><span class="imagePot"></span></div>');

						$('.circle').circleProgress({
							startAngle: -Math.PI / 2,
							value: 0.00,
							reverse: true,
							lineCap: 'round',
							fill: {gradient: ['#4CD2FF', '#006CD9']}
						});
						
						$("#row > .add").remove(); //remove previous plus sign
						$('#row').append('<div class="col-xs-6 add"><i class="fa fa-plus fa-5x" aria-hidden="true"></i></div>'); //add a new one
						
						// alert("We got a barcode\n" +
						// "Result: " + result.text + "\n" +
						// "Format: " + result.format + "\n" +
						// "Cancelled: " + result.cancelled);							
					}
				},
				function (error) {
					alert("Scanning failed: " + error);
				},
				{
					preferFrontCamera : false, // iOS and Android
					showFlipCameraButton : true, // iOS and Android
					showTorchButton : true, // iOS and Android
					torchOn: false, // Android, launch with the torch switched on (if available)
					prompt : "Place a barcode inside the scan area", // Android
					resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
					formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
					disableAnimations : true, // iOS
					disableSuccessBeep: false // iOS
				}
			);
		});
		
		$('.options').children().on('click', function (e) {
			e.preventDefault();		
			if($(this).html() == 'mqtt'){
				console.log("clicked on mqtt");
				$( ".pageView" ).empty();
				var client = mqtt.connect("wss://mqtt.inf1i.ga:8083", {rejectUnauthorized: false,
																	   username: 'inf1i-plantpot',
																	   password: 'password'})
				client.subscribe("#");
				 
				client.on("message", function (topic, payload) {
					$( ".pageView" ).append('Topic = '+topic+', Message = '+payload+'.<br>');
				})
			}
		});
    },
};

app.initialize();