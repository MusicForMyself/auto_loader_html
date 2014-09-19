<?php

	function get_posts_by_letter_rendered($first_letter = NULL, $limit = NULL){
		global $wp_query;
		
		/** Validating parameters **/
		$first_letter = (!$first_letter AND isset($_POST['letter'])) ? $_POST['letter'] : $first_letter;
		$first_letter = (!$first_letter AND !isset($_POST['letter'])) ? 'A' : $first_letter;
		$limit = ($limit === NULL AND isset($_POST['limit'])) ? $_POST['limit'] : $limit;
		$limit = ($limit === NULL AND !isset($_POST['limit'])) ? -1 : $limit;
		
		// $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		$paged = detect_page_from_url();
		
		$args	= array(
					  'post_type' 		=> 'realizadores',
					  'post_status' 	=> 'publish',
					  'posts_per_page' 	=> $limit,
					  'paged' 			=> $paged,
					  'tax_query' 		=> array(
												array(
													'taxonomy' => 'letters',
													'field'    => 'name',
													'terms'    => $first_letter
												),
										),
					);
		
		$query_to_render = new WP_Query($args);
		//Start recording echoed values
		$echoed = '';
		ob_start();
		global $post;
		ob_start();
			echo "<h2>$first_letter</h2>";
			if($query_to_render->have_posts()): while($query_to_render->have_posts()): $query_to_render->the_post();
				setup_postdata($post);

				
			  		get_template_part('templates/feed', 'small-item');

			endwhile; endif; wp_reset_postdata();
			echo "<div class='end_of_letter' data-letter='$first_letter'></div>";
		$echoed = ob_get_contents();
		ob_end_clean();
		if($echoed !== '') wp_send_json_success(json_encode($echoed));
		wp_send_json_error();
	}
	add_action('wp_ajax_get_posts_by_letter_rendered', 'get_posts_by_letter_rendered');
	add_action('wp_ajax_nopriv_get_posts_by_letter_rendered', 'get_posts_by_letter_rendered');