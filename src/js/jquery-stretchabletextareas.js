;(function($, window, undefined){
	$.fn.stretchabletextareas = function(){
		if(this.length == 0){return this;}
		var isLegacyIE = (navigator.userAgent.toLowerCase().indexOf('msie') != -1);
		//Spartan/~IE12 hides its true identity so we have to sniff a bit deeper!
		if(typeof(window.msIndexedDB) != 'undefined'){
			isLegacyIE = true;
		}
		if(!isLegacyIE){
			return this;//bail ASAP!
		} else {
			var SCROLLBAR_GRIPPY_SIZE = 17;
			var syncWrapperPosition = function(textarea, initCall){
				var textareaWidth = textarea.width();
				if(initCall){
					//force the width to a pixel dimension (overcomes glitch if it was originally percentage based)
					textarea.width(textareaWidth + 'px');
				}
				//we are going to presume that all 4 padding/borders are the same width
				var textareaPadding = parseFloat(textarea.css('padding-top'));
				var textareaBorder = parseFloat(textarea.css('border-top-width'));
				var wrapper = textarea.parent();
				var newWidth = textareaWidth + (textareaPadding * 2) + (textareaBorder * 2);
				wrapper.width(newWidth + 'px');
			};
			var syncGrippyPosition = function(textarea){
				var wrapper = textarea.parent();
				var wrapperOffset = wrapper.offset();
				var wrapperLeft = wrapperOffset.left;
				var wrapperTop = wrapperOffset.top;
				var wrapperWidth = wrapper.width();
				var wrapperHeight = wrapper.height();
				var grippy = wrapper.find('div.textareaGrippy');
				grippy.css({'left':((wrapperLeft + wrapperWidth) - SCROLLBAR_GRIPPY_SIZE) + 'px','top':((wrapperTop + wrapperHeight) - SCROLLBAR_GRIPPY_SIZE) + 'px'});
			};
			return this.each(function(){
				//ensure we have a textarea
				if($(this).is('textarea')){
					var thisTextarea = $(this);
					thisTextarea.css('overflow','auto');//set the CSS overflow to auto if not already set (hides ugly IE grayed out scrollbars when not needed)

					//wrap the textarea
					$(this).wrap('<div class="textareaWrapper"></div>');
					syncWrapperPosition(thisTextarea, true);
					
					//add a grippy!
					var wrapper = $(this).parent();
					wrapper.append('<div class="textareaGrippy"></div>');
					syncGrippyPosition(thisTextarea);
					
					var grippy = wrapper.find('div.textareaGrippy');
					
					//propogate the hover styles
					grippy.hover(function(){
						thisTextarea.addClass('activeDrag');
					},
					function(){
						thisTextarea.removeClass('activeDrag');
					});
					//make it draggable
					grippy.mousedown(function(){
						thisTextarea.addClass('activeDrag');
						$(window).bind('mousemove.textarearesize', function(event){
							var textareaLeft = thisTextarea.offset()['left'];
							var textareaTop = thisTextarea.offset()['top'];
							var eventX = event.pageX;
							var eventY = event.pageY;
							var newWidth = (eventX - textareaLeft);
							var newHeight = (eventY - textareaTop);
							if(newWidth < 30){
								newWidth = 30;
							}
							if(newHeight < 30){
								newHeight = 30;
							}
							thisTextarea.width(newWidth);
							thisTextarea.height(newHeight);
							//adjust *every* textarea wrapper & grippy!
							$('textarea').each(function(){
								syncWrapperPosition($(this));
							});
							$('textarea').each(function(){
								syncGrippyPosition($(this));
							});
						});
					});
					grippy.mouseup(function(){
						$(window).unbind('mousemove.textarearesize');
						thisTextarea.removeClass('activeDrag');
					});
					//also stop resizing when mouse leaves the screen
					$(document).mouseup(function(){
						$(window).unbind('mousemove.textarearesize');
						thisTextarea.removeClass('activeDrag');
					});
				}
			});
		}
	};
}(jQuery, window));
