<?php
/*
Plugin Name: PatreonBox - WebComponent
Plugin URI:  https://github.com/ptkdev-components/webcomponent-patreon-box
Description: My Patreon Tier Box with avatars and link from rest/json api. (Unofficial PatreonBox)
Version:     1.0.0
Author:      Patryk Rzucidło (@PTKDev)
Author URI:  https://ptk.dev
License:     MIT
License URI: https://github.com/ptkdev-components/webcomponent-patreon-box/blob/nightly/LICENSE.md
*/

add_action('wp_enqueue_scripts', 'patreon_widget_load');
function patreon_widget_load(){
	$lang = "";
	switch (strtolower(substr(get_bloginfo("language"), 0, 2))) {
		case "en":
			$lang = "en";
			break;
		case "it":
			$lang = "it";
			break;
		case "pl":
			$lang = "pl";
			break;
		default:
			$lang = "en";
	}

	wp_enqueue_script('patreon-box', 'https://cdn.jsdelivr.net/npm/@ptkdev/webcomponent-patreon-box@latest/dist/lib/'.$lang.'/patreon-box.min.js', array(), false, true);
}

?>