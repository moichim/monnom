<?php

/**
 * Monnom Theme functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package monnom
 */
require_once( "lib/tgmpa.php" );
require_once( "lib/options.php" );


function is_monnom()
{

	if ( is_page() ) {

		$slug = get_page_template_slug();

		return $slug === "game";

	} else {
		return false;
	}

	return true;
}

add_action('wp_enqueue_scripts', 'monnom_enqueue_styles');

/**
 * Enqueue scripts and styles.
 */
function monnom_enqueue_styles()
{

	wp_enqueue_style(
		'twentytwentyfour-style',
		get_template_directory_uri() . '/style.css'
	);

	wp_enqueue_style(
		'monnom-style',
		get_stylesheet_directory_uri() . '/style.css',
		['twentytwentyfour-style']
	);

	if (is_monnom()) {

		wp_enqueue_script(
			"monnom-game-script",
			get_stylesheet_directory_uri() . "/game/index.js",
			[],
			time(),
			[
				"in_footer" => true
			]
		);

		wp_enqueue_style(
			"monnom-game-style",
			get_stylesheet_directory_uri() . "/game/index.css",
			[],
			time()
		);
	}
}

function monnom_body_classes($classes)
{
	if (is_monnom()) {
		$classes[] = 'monnom-app';
	}
	return $classes;
}

add_filter('body_class', 'monnom_body_classes');

function monnom_post_type()
{

	register_post_type("composition", [
		'labels'      => array(
			'name'          => "Compositions",
			'singular_name' => "Composition",
		),
		'public'      => true,
		'has_archive' => false,
	]);
}

add_action("init", "monnom_post_type");

add_filter('use_block_editor_for_post_type', 'prefix_disable_gutenberg', 10, 2);
function prefix_disable_gutenberg($current_status, $post_type)
{
	// Use your post type key instead of 'product'
	if ($post_type === 'composition') return false;
	return $current_status;
}

function store_composition(WP_REST_Request $data)
{

	$serialized_json = $data->get_body();
	$object = json_decode($serialized_json, true);


	$post = [
		"post_title" => $object["name"],
		"post_content" => $data->get_body(),
		"post_status" => "publish",
		"post_author" => 1,
		"post_type" => "composition"
	];

	$post_id = wp_insert_post($post);

	if ($post_id) {
		return new WP_REST_RESPONSE([
			"message" => "Composition was stored successfully",
			"data" => $post
		], 201);
	} else {
		return new WP_REST_RESPONSE([
			"message" => "There was an error savig the post"
		], 500);
	}
}


function list_compositions(WP_REST_Request $data)
{

	$compositions = get_posts( [
		"post_type" => "composition",
		"post_status" => "publish",
		"orderby" => "date",
		"order" => "DESC",
		"posts_per_page" => 30
	] );

	if ( $compositions ) {

		$result = [];

		foreach ( $compositions as $composition ) {
			$result[] = json_decode( $composition->post_content );
		}

		return new WP_REST_RESPONSE([
			"message" => "The following compositions were found",
			"data" => $result
		], 200);

	} else {

		return new WP_REST_RESPONSE([
			"message" => "No compositions found",
			"data" => []
		], 200);

	}

}

add_action('rest_api_init', function () {

	register_rest_route('monnom/v1', '/store', array(
		'methods' => 'POST',
		'callback' => 'store_composition',
	));

	register_rest_route('monnom/v1', '/all', array(
		'methods' => 'GET',
		'callback' => 'list_compositions',
	));
});
