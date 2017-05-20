<?php
/*
 Plugin Name: Transient Page Flush
*Plugin URI: https://wordpress.org/plugins/debug-bar/
 Description: Adds a page specific transient flush button to Debug Bar.
 Author: andy.phillips
 Version: 0.1.0
 Author URI: https://wordpress.org/
 */


class TransientPageFlush {

	function __construct() {
		add_action( 'rest_api_init', array( &$this, 'register_api' ) );
		add_action( 'admin_bar_init', array( &$this, 'init' ) );
	}

	function Transient_Page_Flush() {
		Transient_Page_Flush::__construct();
	}

	function init() {
		if ( ! is_super_admin() || ! is_admin_bar_showing() || $this->is_wp_login() )
			return;

		add_action('wp_enqueue_scripts', array( &$this, 'enqueue' )); 
		//$this->enqueue();
	}

	/* Are we on the wp-login.php page?
	 * We can get here while logged in and break the page as the admin bar isn't shown and otherthings the js relies on aren't available.
	 */
	function is_wp_login() {
		return 'wp-login.php' == basename( $_SERVER['SCRIPT_NAME'] );
	}

	public static function delete_transients() {
		$request_body = file_get_contents('php://input');		
		$transients = json_decode ($request_body);
		$results = new stdClass();

		foreach ($transients as $value) {
    		$itemize = explode(':', $value);
    		$key = array_pop( $itemize );
    		$group = implode(":", $itemize);

    		if ($group == 'transient') {
				$result = delete_transient( $key );
    		} else {
    			$result = wp_cache_delete( $key, $group );
    		}
			$results->$value = $result;
		}
		return $results;
	}

	public static function register_api() {
	     register_rest_route (                
	        "snapi/v.01", "/transients/delete", array(
	            'methods' => 'POST', 
	            'callback' => array( 'TransientPageFlush', 'delete_transients'),                     
	        )
		); 
	}


	function enqueue() {
		wp_enqueue_script( 'transient-page-flush', plugins_url( "js/flush_transients.js", __FILE__ ), array( 'debug-bar' ), '20121228.2', true );
	}

}

new TransientPageFlush();