<?php

namespace Functions\htmlemail;

/**
 * Filters the WP HTML Email header
 *
 * The following works with a graphic sized at 1200x300px. The
 * final display is shown @2X pixel density as the image is
 * scaled down to 600x150px.
 *
 * @param      string  $headertext  The headertext
 *
 * @return     string  Filtered email header
 */
function email_header( $headertext ){
  $haet_mail_options = get_option('haet_mail_theme_options');
  if (!empty($haet_mail_options)) {
    foreach ($haet_mail_options as $key => $option)
      $options[$key] = $option;
  }

  if( !empty( $options['headerimg'] ) )
    $headertext = '<a href="' . get_home_url() . '"><img src="' . $options['headerimg'] . '" width="600" height="150" style="width: 600px; height: 150px;" alt="' . get_bloginfo( 'name' ) . '"></a>';
  return $headertext;
}
add_filter( 'haet_mail_header', __NAMESPACE__ . '\\email_header' );