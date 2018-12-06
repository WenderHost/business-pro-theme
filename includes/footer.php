<?php
namespace Fox\footer;

/**
 * Filters the footer credits
 *
 * @param      string  $creds  The credits
 *
 * @return     string  Filtered credits
 */
function footer_creds_filter( $creds ) {
  $args = [
      'theme_location'  => 'footer-copyright',
      /*'menu'            => '',*/
      'container'       => '',
      'menu_class'      => 'menu',
      'menu_id'         => '',
      'echo'            => false,
      'before'          => ' &middot; ',
      'after'           => '',
      'link_before'     => '',
      'link_after'      => '',
      'items_wrap'      => '<span id="footer-nav">%3$s</span>',
      'depth'           => 1,
  ];
  $nav = wp_nav_menu( $args );
  $footer_nav = ( $nav )? strip_tags( $nav, '<a>') : '';
  $creds = '&copy '. date('Y') . '  ' . get_bloginfo( 'name' ) . '. All rights reserved.' . $footer_nav;
  return $creds;
}
add_filter('genesis_footer_creds_text', __NAMESPACE__ . '\\footer_creds_filter');

function footer_nav_menu(){
    register_nav_menu( 'footer-copyright', 'Footer Copyright Menu - Links to appear in the footer copyright.' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\\footer_nav_menu' );