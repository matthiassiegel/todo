//
// Initialise the Yoda library
//
if (typeof Yoda == 'undefined') {
	Yoda = {
		
		//
		// Create a random string (default length 10 characters)
		//
		randomString: function(length) {
			var chars = '0123456789abcdefghiklmnopqrstuvwxyz',
					randomstring = '',
					length = length || 10;

			for (var i = 0; i < length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}

			return randomstring;
		},


		//
		// Extract the URL fragment from the current URL (ex. http://path/to#fragment)
		//
		getUrlFragment: function() {
			var parts = $(location.href.split('#'));

			return parts.last()[0] !== parts.first()[0] ? parts.last()[0] : '';
		},
		
		
		//
		// Change the URL in the browser address bar
		//
		setUrl: function(url) {
			location.href = url;
		},
		
		
		//
		// Get the URL from the browser address bar
		//
		getUrl: function() {
			return location.href;
		},
		
		
		//
		// Convenience alias for jQuery UI's keycode object
		//
		keyCode: $.ui.keyCode
		
		
	};
}