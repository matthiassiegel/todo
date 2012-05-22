//
// Send csrf token in header with Ajax requests
//
var token = $('meta[name="csrf-token"]').attr('content');

if (token.length > 0) {
	$.ajaxSetup({
	  headers: {'X-CSRF-Token': token}
	});
}


function setup() {
  $("a[rel=popover]").popover();
  $(".tooltip").tooltip();
  $("a[rel=tooltip]").tooltip();

	var a = function() {
		$('.alert').fadeOut(500, function() {
			$(this).remove();
		});
	}
	setTimeout(a, 5000);
}

$(document).on('click', '.col-name .name', function() {
	$(this).next().slideToggle();
});


//
// Whenever an Ajax call finishes, run setup again, in case of new DOM elements
//
$(document).on('ajaxComplete', function() {
	setup();
});


function flash(type, title, message) {
	return "<div class=\"alert alert-" + type + "\">" + 
		"<a class=\"close\">×</a>" + 
		"<table>" + 
			"<tr>" + 
				"<td><strong>" + title + "</strong>&nbsp;&mdash;&nbsp;</td>" + 
				"<td>" + message + "</td>" + 
			"</tr>" + 
		"</table>" + 
	"</div>";
}


//
// Add a new task
//
$(document).on('click', '#add-task', function() {
	var button = $(this);
	
	new Yoda.Dialog({
		'get_url'			: '/tasks/new',
		'success_url'	: '/tasks',
		'container'		: '#task-list'
	});
});


//
// Delete a task
//
$(document).on('click', '.task-delete', function() {
	var button = $(this),
			task = button.attr('data-task'),
			row = button.closest('tr');
	
	button.addClass('disabled');
	
	$.ajax('/tasks/' + task, { 'type': 'DELETE' }).success(function(result) {
		
		if (result == 'true') {
			row.addClass('red');
			row.fadeOut(500, function() {
				row.remove();
				
				$('#task-list').prepend(flash('success', 'Success', 'Task successfully deleted'));
			});
			
		} else {
			$('#task-list').html(result);
		}
	});	
});


//
// Mark a task as completed
//
$(document).on('click', '.task-done', function() {
	var button = $(this),
			task = button.attr('data-task'),
			row = button.closest('tr'),
			new_row = row.clone(),
			completed_table = $('#complete table tbody');
			
	button.addClass('disabled');
	
	$.get('/tasks/' + task + '/done').success(function(result) {
		
		if (result == 'true') {
			row.fadeOut(500, function() {
				row.remove();
				
				$('#task-list').prepend(flash('success', 'Success', 'Task marked as complete'));
			});
			
			new_row.find('.col-date,.task-move-up,.task-move-down,.task-done').remove();
			completed_table.prepend(new_row);
			
		} else {
			$('#task-list').html(result);
		}
	});	
});


//
// Move up task
//
$(document).on('click', '.task-move-up', function() {
	var button = $(this),
			task = button.attr('data-task'),
			row = button.closest('tr'),
			rows = row.parent().children();
	
	if (row[0] != rows.first()[0]) {
		$.get('/tasks/' + task + '/up').success(function(result) {
			if (result == 'true') {
				row.prev().before(row);
				
			} else {
				$('#task-list').html(result);
			}
		});
	}
});


//
// Move down task
//
$(document).on('click', '.task-move-down', function() {
	var button = $(this),
			task = button.attr('data-task'),
			row = button.closest('tr'),
			rows = row.parent().children();
	
	if (row[0] != rows.last()[0]) {
		$.get('/tasks/' + task + '/down').success(function(result) {
			if (result == 'true') {
				row.next().after(row);
				
			} else {
				$('#task-list').html(result);
			}
		});
	}
});


//
// Edit description
//
$(document).on('click', '.col-name .description', function() {
	var desc = $(this),
			pre = desc.find('pre'),
			content = pre.html();
	
	if (pre.length > 0) {
		desc.html('<textarea>' + content + '</textarea>');
		desc.children().focus();
	}
	
});


//
// Save description
//
$(document).on('blur', '.col-name .description', function() {
	var desc = $(this),
			task = desc.closest('tr').attr('data-task'),
			textarea = desc.find('textarea');
	
	if (textarea.length > 0) {
		var content = textarea.val();
		
		desc.html('<pre>' + content + '</pre>');
		
		$.post('/tasks/' + task + '/description', { 'description': content }).success(function(result) {
			if (result == 'false') {
				$('#task-list').prepend(flash('error', 'Error', 'Task dscription could not be saved'));
			}
		});
	}
});