define(function(require) {
	return {
		init: function() {
		},
		show: function() {
			var positionOffset = $(this.model.lens('positionTarget').get()).offset(),
				scrollTop = $(window).scrollTop();
			$('#'+ this.model.lens('modalId').get()).show()
					.find('.dialog').css({'margin-top': Math.max(positionOffset.top - scrollTop, 0),
											'margin-left': positionOffset.left
										});
			$('body').css('overflow', 'hidden');
		},
		hide: function(){
			// TODO - Call destroyView.
			// Right now destroyView is emptying parent container so not using it.
			$('#'+ this.model.lens('modalId').get()).hide()
				.find('.content').empty();

			$('body').css('overflow', 'auto');
		}
	};
});

