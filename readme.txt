=== Transient Page Flush ===
Contributors: andyphillips
Tags: 
Tested up to: 4.5
Stable tag: 0.1.0
Requires at least: 3.1

Flush transient cache for a specific page.  Works in conjunction with Debug Bar.  Good for high traffic sites where flushing all transients isn’t ideal.

== Description ==

Adds a button to the debug bar - object cache tab to flush the page specific transients.  Inserts a piece of javascript which reads the object cache stats, aggregates the transients and fires a WP API call with the transients attached as the query string.

A WPI API end point is added which ingests the query variables (transients) and loops through firing delete_transient for each item. 

= 0.1 =
Initial Release

== Installation ==

Use automatic installer.
