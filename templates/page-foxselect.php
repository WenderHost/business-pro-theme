<?php
/**
 * Template Name: FoxSelect
 */

namespace Fox\foxselect;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}
/*
function enqueue_scripts(){

}
*/
//\add_action( 'wp_enqueue_scripts', $function_to_add, $priority = 10, $accepted_args = 1 )

/**
 * Add full-width page body class to the head.
 *
 * @since  1.0.0
 *
 * @param  array $classes Array of body classes.
 * @return array $classes Array of body classes.
 */
function add_body_class( $classes ) {

    $classes[] = 'full-width-content';

    return $classes;

}
\add_filter( 'body_class', __NAMESPACE__ . '\\add_body_class' );


/**
 * Removes page header
 */
function genesis_after_header(){
    $genesis_after_header = [
        'business_page_header_open' => 20,
        'genesis_do_posts_page_heading' => 24,
        'genesis_do_date_archive_title' => 24,
        'genesis_do_blog_template_heading' => 24,
        'genesis_do_taxonomy_title_description' => 24,
        'genesis_do_author_title_description' => 24,
        'genesis_do_cpt_archive_title_description' => 24,
        'business_page_header_title' => 24,
        'business_page_header_close' => 28,
    ];
    foreach ($genesis_after_header as $function => $priority) {
        remove_action( 'genesis_after_header', $function, $priority );
    }
}
\add_action( 'genesis_after_header', __NAMESPACE__ . '\\genesis_after_header', 11 );


function genesis_footer(){
    $genesis_footer = [
        'business_before_footer_widget_area' => 5,
        //'genesis_footer_widget_areas' => 6,
    ];
    foreach ($genesis_footer as $function => $priority) {
        remove_action( 'genesis_footer', $function, $priority );
    }
}
//\add_action( 'genesis_after_content', __NAMESPACE__ . '\\genesis_footer', 10 );

// Run the Genesis loop.
\genesis();