/*
 * ThinSpace - A jQuery plugin that automatically inserts non-breakable thin spaces before
 * punctuation in French texts.

 *
 * Copyright (c) 2012 Victor Loux
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 *
 * 
 * 
 * @params:
 *   spaceWidth - set a string value to define the width of the space (defaults to 0.25em)
 *				  or set to true to use the narrow non-breaking space entity
 *				  (not supported by all OSes and browsers!)
 *
 * @version: 1.0-pre
*/


(function($){
  $.fn.thinsp = function(spaceWidth) {
  	// Set default space width (1/4th of em)
  	if(!spaceWidth) spaceWidth= "0.25em";
  	
  	// If argument spaceWidth equals true, use the proper Unicode nbsp narrow space
  	// but this entity is not supported by all browsers/OSes
  	// see:	http://fvsch.com/code/espaces-unicode/
  	//		http://dascritch.net/post/2011/05/09/Les-espacements-unicodes
  	//		http://typographisme.net/post/Les-espaces-typographiques-et-le-web
  	
  	if(spaceWidth == true) space = "&#8239;";
  	// Otherwise use the &nbsp; entity wrapped into a span that reduces its size
  	else space = "<span style=\"font-size: " + spaceWidth + "\">&nbsp;</span>";
  	
  	// For each of the elements, go through the HTML and replace it
    return this.each(function() {
    
    	 /*
			-- Regular expression --
			
			Before first pipe:
				catches either a left-pointing guillemet (U+00AB) or an em dash (U+2014)
				followed by one or more spaces (optional) (?: +)?
			(OR) After first pipe:
				catches one or mores space (optional)
				then either one of those ? ! : ; or a right-pointing guillemet (U+00BB).
			
			Backreference $1 is either a left-pointing guillemet
			or em dash if there's one and it is placed before the thin non-breakable space.
			Backreference $2 does the same with the other signs and places it back after the space.
			
			Modifier /g means that it'll catch all occurrences, not only the first one.
		*/
    
    	$(this).html($(this).html().replace(
    		/(\u00AB|\u2014)(?: +)?|(?: +)?([\?|!|:|;|\u00BB])/g, // Regexp
    		"$1" + space + "$2")); // Replacement
    });
  };
})(jQuery);

// Shorthand to apply thinspace to all the body

jQuery.thinsp = function(spaceWidth) {
	jQuery("body").thinsp(spaceWidth);
}