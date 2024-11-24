<?php


add_filter( 'lazyblock/frontpage-menu/frontend_allow_wrapper', '__return_false' );


add_action( 'lzb/init', function() {

    lazyblocks()->add_block( array(
        'id' => 65,
        'title' => 'Frontpage menu block',
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>',
        'keywords' => array(
            0 => 'template',
            1 => 'monnom',
        ),
        'slug' => 'lazyblock/frontpage-menu',
        'description' => 'Hardcoded frontpage menu list defined by the monnom theme.',
        'category' => 'theme',
        'category_label' => 'theme',
        'supports' => array(
            'customClassName' => false,
            'anchor' => false,
            'html' => false,
            'multiple' => false,
            'inserter' => true,
            'reusable' => false,
            'lock' => false,
            'align' => array(
            ),
            'ghostkit' => array(
                'effects' => false,
                'position' => false,
                'spacings' => false,
                'frame' => false,
                'transform' => false,
                'customCSS' => false,
                'display' => false,
                'attributes' => false,
            ),
        ),
        'controls' => array(
        ),
        'code' => array(
            'output_method' => 'php',
            'editor_html' => '',
            'editor_callback' => '',
            'editor_css' => '',
            'frontend_html' => '<?php 
    
    if (function_exists("print_monnom_frontpage_menu")) {
        
        print_monnom_frontpage_menu();
        
    }
    
    ?>',
            'frontend_callback' => "",
            'frontend_css' => '',
            'show_preview' => 'always',
            'single_output' => true,
        ),
        'styles' => array(
        ),
        'condition' => array(
        ),
    ) );
    
} );