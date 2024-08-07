<?php
/**
 * This snippet has been updated to reflect the official supporting of options pages by CMB2
 * in version 2.2.5.
 *
 * If you are using the old version of the options-page registration,
 * it is recommended you swtich to this method.
 */
add_action( 'cmb2_admin_init', 'monnom_options_page' );
/**
 * Hook in and register a metabox to handle a theme options page and adds a menu item.
 */
function monnom_options_page() {

	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box( array(
		'id'           => 'myprefix_option_metabox',
		'title'        => esc_html__( 'Site Options', 'myprefix' ),
		'object_types' => array( 'options-page' ),

		/*
		 * The following parameters are specific to the options-page box
		 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
		 */

		'option_key'      => 'myprefix_options', // The option key and admin menu page slug.
		// 'icon_url'        => 'dashicons-palmtree', // Menu icon. Only applicable if 'parent_slug' is left empty.
		// 'menu_title'      => esc_html__( 'Options', 'myprefix' ), // Falls back to 'title' (above).
		// 'parent_slug'     => 'themes.php', // Make options page a submenu item of the themes menu.
		// 'capability'      => 'manage_options', // Cap required to view options-page.
		// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
		// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
		// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
		// 'save_button'     => esc_html__( 'Save Theme Options', 'myprefix' ), // The text for the options-page save button. Defaults to 'Save'.
	) );

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

    $cmb_options->add_field([
        "name" => "Portfolio file",
        "desc" => "Upload the portfolio PDF",
        "id" => "portfolio",
        "type" => "file",
        'options' => array(
            'url' => false, // Hide the text input for the url
        ),
        'text'    => array(
            'add_upload_file_text' => 'Add File' // Change upload button text. Default: "Add or Upload File"
        ),
        // query_args are passed to wp.media's library query.
        'query_args' => array(
            'type' => 'application/pdf', // Make library only display PDFs.
            // Or only allow gif, jpg, or png images
            // 'type' => array(
            //     'image/gif',
            //     'image/jpeg',
            //     'image/png',
            // ),
        ),
            'preview_size' => 'large', // Image size to use when previewing in the admin.
        ]);

	$cmb_options->add_field( array(
		'name' => "Facebook URL",
		'id'   => 'facebook',
		'type' => 'text_url'
	) );

    $cmb_options->add_field( array(
		'name' => "Instagram URL",
		'id'   => 'instagram',
		'type' => 'text_url'
	) );

    $cmb_options->add_field( array(
		'name' => "Linkedin URL",
		'id'   => 'linkedin',
		'type' => 'text_url',
	) );

}

/**
 * Wrapper function around cmb2_get_option
 * @since  0.1.0
 * @param  string $key     Options array key
 * @param  mixed  $default Optional default value
 * @return mixed           Option value
 */
function myprefix_get_option( $key = '', $default = false ) {
	if ( function_exists( 'cmb2_get_option' ) ) {
		// Use cmb2_get_option as it passes through some key filters.
		return cmb2_get_option( 'myprefix_options', $key, $default );
	}

	// Fallback to get_option if CMB2 is not loaded yet.
	$opts = get_option( 'myprefix_options', $default );

	$val = $default;

	if ( 'all' == $key ) {
		$val = $opts;
	} elseif ( is_array( $opts ) && array_key_exists( $key, $opts ) && false !== $opts[ $key ] ) {
		$val = $opts[ $key ];
	}

	return $val;
}


// inline script via wp_print_scripts
function shapeSpace_print_scripts() { 
	
	?>

    <!-- Prevent automatic rotation on mobile -->
    <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
	
	<script id="monnom-portfolio-link">

        /** These links are asigned to <a>'s by JS code */

        window.monnomPortfolio = <?php 
            $value = myprefix_get_option( "portfolio" );
            print( $value ? "\"" . $value . "\"" : "undefined" );
        ?>;

        window.monnomFacebook = <?php 
            $value = myprefix_get_option( "facebook" );
            print( $value ? "\"" . $value . "\"" : "undefined" );
        ?>;

        window.monnomInstagram = <?php 
            $value = myprefix_get_option( "instagram" );
            print( $value ? "\"" . $value . "\"" : "undefined" );
        ?>;

        window.monnomLinkedin = <?php 
            $value = myprefix_get_option( "linkedin" );
            print( $value ? "\"" . $value . "\"" : "undefined" );
        ?>;

	</script>
	
	<?php
	
}
add_action('wp_print_scripts', 'shapeSpace_print_scripts');