<?php
//header("Content-Type: text/html; charset=utf-8");

/**
* Defines the default width for a thin space
*
* Définit la largeur par défaut d'une espace fine
* (par défaut : 0.25em, pour un quart de cadratin)
* Pour utiliser le caractère d'espace fine Unicode,
* remplacer "0.25em" par true *en enlevant les guillemets*
*/

define("DEFAULT_THINSP_WIDTH", "0.25em");

/**
* A PHP function that automatically inserts non-breakable thin spaces before
* punctuation in French texts.
*
* Une fonction PHP qui transforme automatiquement le texte dans une chaine HTML
* (excluant les attributs des balises) pour y ajouter des espaces fines
* avant les signes doubles.
*
* PHP port of the jQuery thinsp plugin
*
* @param  	string	$string	HTML input to modify
* @param	mixed	$spaceWidth		Custom width (defaults to DEFAULT_THINSP_WIDTH)
* @return 	string	Parsed output corrected
* @author 	DeadPx <hey@victorloux.fr>
* @copyright	Victor Loux 2012
* @version	1.0-pre
* @link		https://github.com/DeadPx/ThinSpace
* @package	ThinSpace
*/

function thinsp($string, $spaceWidth = DEFAULT_THINSP_WIDTH) {		
		// If argument $spaceWidth equals boolean true, use the proper Unicode nbsp narrow space
		// but this entity is not supported by all browsers/OSes
		// see:	http://fvsch.com/code/espaces-unicode/
		//		http://dascritch.net/post/2011/05/09/Les-espacements-unicodes
		//		http://typographisme.net/post/Les-espaces-typographiques-et-le-web
		
		if($spaceWidth === true) $space = "&#8239;";
		
		// Otherwise use the &nbsp; entity wrapped into a span that reduces its size
		else $space = "<span style=\"font-size: " . $spaceWidth . "\">&nbsp;</span>";
		
		/*
			-- Regular expression --
			
			Before first pipe:
				catches either a left-pointing guillemet (U+00AB) or an em dash (U+2014)
				(\p{xx} is the PHP PCRE syntax for Unicode)
				
				followed by one or more spaces (optional) (?:\s+)?
				\s = any whitespace character
			(OR) After first pipe:
				catches one or mores space (optional)
				then either one of those ? ! : ; or a right-pointing guillemet (U+00BB).
			
			Backreference $1 is either a left-pointing guillemet
			or em dash if there's one and it is placed before the thin non-breakable space.
			Backreference $2 does the same with the other signs and places it back after the space.
			
			Modifier /g means that it'll catch all occurrences, not only the first one.
		*/
		
		$spRegex = '/(«|—)(?:\s+)?|(?:\s+)?([\?!:;»])/u';
		$spReplace = "$1" . $space . "$2"; // Replacement
		
		// Convert the replacement to Unicode,
		// otherwise it will return an error due to the &nbsp; entity
		$spReplace = mb_convert_encoding($spReplace, 'UTF-8', "HTML-ENTITIES");
		
		
		// For each of the elements, go through the HTML and replace it
		
		$dom = new DOMDocument();
		// loadXml needs properly formatted documents,
		// so it's better to use loadHtml, but it needs a hack to properly handle UTF-8 encoding
				
		$dom->loadHtml(mb_convert_encoding($string, 'HTML-ENTITIES', "UTF-8"));
		
		$xpath = new DOMXPath($dom);
		
		// To exclude correction happening inside certain tags:
		// query->(//text()[not(ancestor::a)]
		// (replace a with the desired tag, use commas to add several exceptions)
		
		foreach($xpath->query("//text()") as $node)
		{
			// Replace 
			//$replaced = str_replace("&", "_", $node->wholeText);
			$replaced = preg_replace($spRegex, $spReplace, $node->wholeText);
			
			$newNode  = $dom->createDocumentFragment();
			$newNode->appendXml($replaced);
			$node->parentNode->replaceChild($newNode, $node);
		}
		
		return mb_substr($dom->saveXML($xpath->query('//body')->item(0)), 6, -7, "UTF-8");
}