jQuery(document).ready(function ($) {
	var socket = io();
	$('form').submit(function () {
		socket.emit('chat_message', $('#m').val());
		$('#m').val('');
		return false;
	});
	socket.on('chat_message', function (msg) {
		$('#messages').append($('<li>').text(msg));
	});

	//$.ajax({
	//	url    : '/get',
	//	method : 'GET',
	//	success: function (data) {
	//		for (var i = 0; i < data.length; i++) {
	//			$('#messages').append($('<li>').text(data[i].msg));
	//		}
	//	},
	//	error  : function (html) {
	//		console.log(html);
	//	}
	//});
});