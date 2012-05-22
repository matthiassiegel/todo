Yoda.Dialog = function(params) {
	
	var _d = this;
	
	
	//
	// Adjust position and size of dialog window to current content
	//
	_d.reposition = function() {
		
		// Get spanX class to determine the width of the current content
		var cls = /span[0-9]{1}/.exec($(_d.div.content).find('.modal-wrap').attr('class'))[0];
		
		
		// Set new dialog dimensions
		switch(cls) {
			case "span4":
				_d.instance.dialog('option', 'width', 370);
				_d.instance.dialog('option', 'minHeight', 150);
				break;
			
			case "span5":
				_d.instance.dialog('option', 'width', 470);
				_d.instance.dialog('option', 'minHeight', 200);
				break;

			case "span6":
				_d.instance.dialog('option', 'width', 570);
				_d.instance.dialog('option', 'minHeight', 200);
				break;

			case "span7":
				_d.instance.dialog('option', 'width', 670);
				_d.instance.dialog('option', 'minHeight', 200);
				break;
		}
		
		
		// Center dialog
		_d.instance.dialog('option', 'position', 'center');
		
	};
	
	
	//
	// Fade out and destroy dialog instance
	//
	_d.leave = function() {

		_d.div.overlay.fadeOut(200);
		_d.div.dialog.fadeOut(200, function() {
			_d.div.overlay.remove();
			_d.div.content.remove();
			_d.div.dialog.remove();
			_d.instance = null;
		});
		
		// Remove ESCAPE key event
		$(document).off('keydown.dialog-' + _d.options.id);

	};
	
	
	//
	// Define situations in which to close the dialog
	//
	_d.setupLeave = function() {
		
		// Close dialog when cancel button is clicked
		$(document).on('click', '#dialog-' + _d.options.id + ' button.btn-cancel', function() {
			_d.leave();
		});
		
		
		// Close dialog when background overlay is clicked
		$(document).on('click', '#overlay-' + _d.options.id, function() {
			_d.leave();
		});
		
		
		// Close dialog when 'close' icon is clicked
		$(document).on('click', '#dialog-' + _d.options.id + ' .modal-header .close', function() {
			_d.leave();
		});
		
		
		// Close dialog when ESCAPE key is pressed
		$(document).on('keydown.dialog-' + _d.options.id, function(event) {
			if (event.keyCode && event.keyCode === Yoda.keyCode.ESCAPE) {
				_d.leave();
			}
		});
		
	};
	
	
	//
	// Define functionality for going back one step on multi-step dialogs
	//
	_d.setupBack = function() {
		
		// Close dialog when cancel button is clicked
		$(document).on('click', '#dialog-' + _d.options.id + ' button.btn-back', function() {
			var button = $(this),
					url = $('#back_url').val(),
					method = $('#back_method').val(),
					params = $.parseJSON($('#back_params').val());
					
			if (method == 'get') {
								
				button.parent().find('.spinner').fadeIn(200);
				
				$.get(url).success(function(data) {
					_d.div.content.html(data);
					_d.reposition();
				});
				
			} else {
				
				button.parent().find('.spinner').fadeIn(200);
				
				$.post(url, { back: params }).success(function(data) {
					_d.div.content.html(data);
					_d.reposition();
				});
				
			}
			
		});
		
	};
	
	
	//
	// When clicking the submit button or pressing 'ENTER', submit the action
	//
	_d.go = function(action) {
		
		// Submit when clicking the submit button
		$(document).on('click', '#dialog-' + _d.options.id + ' button.btn-submit', function(event) {
			event.preventDefault();
			
			// Disable submit button to prevent double-submitting
			$('#dialog-' + _d.options.id + ' button.btn-submit').attr('disabled', 'disabled').addClass('disabled');

			// Execute the supplied action
			action();
		});
		
		
		// Submit when pressing 'ENTER', but only if we're not inside a textarea field (to allow linebreaks)
		$(document).on('keydown.dialog-' + _d.options.id, function(event) {
			if (event.keyCode 
				&& (event.keyCode === Yoda.keyCode.ENTER || event.keyCode === Yoda.keyCode.NUMPAD_ENTER) 
				&& document.activeElement.type !== "textarea") {
				
				event.preventDefault();

				// Disable submit button to prevent double-submitting
				$('#dialog-' + _d.options.id + ' button.btn-submit').attr('disabled', 'disabled').addClass('disabled');

				// Execute the supplied action
				action();
			}
		});
		
	};
	
		
	//
	// Create and return the jQuery UI dialog instance
	//
	_d.setupDialog = function() {

		var $d = $('<div data-id="' + _d.options.id + '"></div>').html(_d.options.content).dialog({
			title: _d.options.title,
			modal: true,
			draggable: false,
			dialogClass: 'modal',
			resizable: false,
			show: 'fade',
			width: _d.options.width,
			minHeight: _d.options.minHeight,
			zIndex: 1045,
			open: function() {
				var dia = $('.ui-dialog:has(div[data-id="' + _d.options.id + '"])'),
				
						// jQuery UI is caching old overlay instances in $.ui.dialog.overlay.oldInstances
						ovl = dia.next('.ui-widget-overlay');
						ovl = ovl.length == 0 ? dia.next('.modal-backdrop') : ovl;

				// Add unique identifiers to the container and the overlay and cleanup unused classes and attributes				
				dia.attr('id', 'dialog-' + _d.options.id);
				dia.removeAttr('tabindex')
					 .removeAttr('role')
					 .removeAttr('aria-labelledby');
				ovl.attr('class', 'modal-backdrop')
					 .attr('id', 'overlay-' + _d.options.id)
					 .attr('style', 'display:none;')
					 .fadeIn(200);
				
				// Delete the title bar container, we're going to build our own
				dia.find('.ui-dialog-titlebar').remove();
			}
		});
		
		return $d;
		
	};
	
	
	//
	// Additional setting up
	//
	_d.prepareDialog = function() {
		
		//
		// The jQuery UI instance object
		//
		_d.instance = _d.setupDialog();


		//
		// Dialog container shortcuts
		//
		_d.div = {
			overlay: $('#overlay-' + _d.options.id),
			dialog: $('#dialog-' + _d.options.id),
			content: $('#dialog-' + _d.options.id + ' div[data-id="' + _d.options.id + '"]')
		}


		//
		// Set up functionality for closing the dialog and for going back on multi-step dialogs
		//
		_d.setupLeave();
		_d.setupBack();
		
	};
	
	
	var default_options = {
		'id'					: Yoda.randomString(),
		'width'				: 370,
		'minHeight'		: 150
	}
	
	//
	// Merge params into options (params can overwrite options)
	//
	_d.options = $.extend(default_options, params);
	
	//
	// Display loading message until real content has been loaded via Ajax
	//
	_d.options.content = '<div class="modal-wrap span4">' + 
			'<div class="modal-body">' + 
				'<h3>Loading...</h3>' + 
			'</div>' + 
		'</div>';

	//
	// Finish setup
	//
	_d.prepareDialog();
	
	//
	// If parameters were defined, submit them along with the GET request
	//
	if (typeof _d.options.params != 'undefined') {
		$.get(_d.options.get_url, _d.options.params).success(function(data) {
			_d.div.content.html(data);
			_d.reposition();
			_d.div.dialog.draggable({ handle: '.modal-header' });
		});

	} else {
		$.get(_d.options.get_url).success(function(data) {
			_d.div.content.html(data);
			_d.reposition();
			_d.div.dialog.draggable({ handle: '.modal-header' });
		});
	}

	//
	// Stuff that should happen when the dialog is submitted
	//
	var action = function() {

		var button = $('#dialog-' + _d.options.id + ' button.btn-submit'),
				spinner = button.parent().find('.spinner'),
				form = _d.div.dialog.find('form'),
				method = form.find('input[type="hidden"][name="_method"]').length > 0 ? form.find('input[type="hidden"][name="_method"]').val().toUpperCase() : 'post';

		//
		// TO DO: basic form validation before submitting
		//

		spinner.fadeIn(200);

		$.ajax(form.attr('action'), {
			data: form.serializeArray(),
			type: method
		}).success(function(result) {

			// If nothing is returned, assume success
			if (result == '') {
				$.get(_d.options.success_url, _d.options.params).success(function(data) {

					// Update content in main browser window area before closing the dialog
					$(_d.options.container).html(data);

					_d.leave();
				});

			} else {
				// If validation or something else fails, display returned content
				_d.div.content.html(result);
				_d.reposition();
			}

		});

	}

	_d.go(action);

		
}