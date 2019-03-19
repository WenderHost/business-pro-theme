<?php

namespace Functions\acf;

/**
 * Saves changes to ACF field groups to keep different
 * environments in sync. `Sync available` will show
 * above the Field Groups under Custom Fields > Field
 * Groups whenever an update is available. This comes
 * in handy whenever in situations when you add a
 * field in development and upload a new version of
 * the theme on production.
 */
function acf_json_save_point( $path ) {
    // update path
    $path = get_stylesheet_directory() . '/assets/acf-json';

    // return
    return $path;
}
add_filter('acf/settings/save_json', __NAMESPACE__ . '\\acf_json_save_point');

/**
 * Loads our ACF Field Group settings saved by
 * `acf_json_save_point`.
 */
function acf_json_load_point( $paths ) {
    // remove original path (optional)
    unset($paths[0]);

    // append path
    $paths[] = get_stylesheet_directory() . '/assets/acf-json';

    // return
    return $paths;
}
add_filter('acf/settings/load_json', __NAMESPACE__ . '\\acf_json_load_point');