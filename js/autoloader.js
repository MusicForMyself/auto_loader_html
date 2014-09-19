/** Is there a loading 'hook'? **/
if( $('.end_of_letter').length > 0 ){

	/** Init of lazy block loading **/
	end_position = $('.end_of_letter').last().offset();
	current_scroll_position = $(window).scrollTop()+$(window).height();
	/** Context variables **/ 
	$end_letter_div = $('.end_of_letter').last();
	current_rendered_letter = $end_letter_div.data('letter');
	current_letter_position = $.inArray( current_rendered_letter, letters );
	current_letter 			= letters[current_letter_position];
	next_letter 			= letters[current_letter_position+1];

	/** Scrolling event **/
	$(document).scroll(function(e){
		/** Exit if already executed **/
		current_scroll_position = $(window).scrollTop()+$(window).height();
		end_position = $('.end_of_letter').last().offset().top;
		$where_to_render = $('.end_of_letter').parent();
		
		if( current_scroll_position >= end_position // Reached the 'bottom'
			&& current_scroll_position > $(window).height() // Not negative scrolling
			&& current_rendered_letter != last_render_intent ) // Stop multiple execution
		{
			current_letter_position = $.inArray( current_rendered_letter, letters );
			current_letter 			= letters[current_letter_position];
			next_letter 			= letters[current_letter_position+1];
			//Register loading intent
			last_render_intent 		= next_letter;

				/** Exit if already executed **/
				$.post(ajax_url,{
					letter  : next_letter,
					limit 	: -1,
					action  : 'get_posts_by_letter_rendered'
				})
				.done(function (response){
					var json_response = JSON.parse(response.data)
					$where_to_render.append(json_response);
					current_rendered_letter = next_letter;
					$end_letter_div = $('.end_of_letter').last();
					current_rendered_letter = $end_letter_div.data('letter');
					current_letter_position = $.inArray( current_rendered_letter, letters );
					current_letter 			= letters[current_letter_position];
					next_letter 			= letters[current_letter_position+1];
				})
				.fail(function(a,b,c){
					console.log(a);
					console.log(b);
					console.log(c);
				});

		}
		e.stopPropagation();
	});
}