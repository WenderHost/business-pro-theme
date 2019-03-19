<?php
/**
 * Template Name: FoxSelect
 */

namespace Fox\foxselect;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Removes default theme styles and loads FOXSelect React app
 */
function enqueue_scripts(){
  wp_dequeue_style( 'business-pro-min' );
  wp_enqueue_style( 'foxselect-theme', get_stylesheet_directory_uri() . '/assets/css/foxselect.css', [], filemtime( get_stylesheet_directory() . '/assets/css/foxselect.css') );

  /**
   * Load FOXSelect React app JS
   */
  $scripts = glob( get_stylesheet_directory() . '/assets/scripts/foxselect/static/js/main.*' );
  foreach ($scripts as $script) {
    if( '.js' == substr( $script, -3 ) ){
      wp_enqueue_script( 'foxselect', get_stylesheet_directory_uri() . '/assets/scripts/foxselect/static/js/' . basename( $script ), null, null, true );
      /*
      // 12/14/2018 (14:27) - moved the AUTH_ROOT inside api-config.js in the React app
      wp_localize_script( 'foxselect', 'wpvars', [
        'root' => esc_url_raw( rest_url() ),
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'authroute' => 'jwt-auth/v1/token',
      ]);
      */
    }
  }

  /**
   * Load FOXSelect React app CSS
   */
  $styles = glob( get_stylesheet_directory() . '/assets/scripts/foxselect/static/css/main.*' );
  foreach ($styles as $style) {
    if( '.css' == substr( $style, -4 ) )
      wp_enqueue_style( 'foxselect', get_stylesheet_directory_uri() . '/assets/scripts/foxselect/static/css/' . basename( $style ) );
  }
}
\add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts', 100 );

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


function genesis_entry_content(){
    ?>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div class="foxselect twbs" id="root"></div>
    <?php
}
\add_action( 'genesis_entry_content', __NAMESPACE__ . '\\genesis_entry_content', 5 );

/**
 * Removes footer CTA row
 */
function genesis_footer(){
    $genesis_footer = [
        'business_before_footer_widget_area' => 5,
    ];
    foreach ($genesis_footer as $function => $priority) {
        remove_action( 'genesis_footer', $function, $priority );
    }
}
\add_action( 'genesis_after_content', __NAMESPACE__ . '\\genesis_footer', 10 );

// Run the Genesis loop.
\genesis();