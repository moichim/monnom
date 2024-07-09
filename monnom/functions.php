<?php
/**
 * Monnom Theme functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package monnom
 */

add_action( 'wp_enqueue_scripts', 'twentytwentyfour_parent_theme_enqueue_styles' );

/**
 * Enqueue scripts and styles.
 */
function twentytwentyfour_parent_theme_enqueue_styles() {
	wp_enqueue_style( 'twentytwentyfour-style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'monnom-style',
		get_stylesheet_directory_uri() . '/style.css',
		[ 'twentytwentyfour-style' ]
	);
}
