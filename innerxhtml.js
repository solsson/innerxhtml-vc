/*
Written by Steve Tucker, 2006, http://www.stevetucker.co.uk
Full documentation can be found at http://www.stevetucker.co.uk/page-innerxhtml.php
Released under the Creative Commons Attribution-Share Alike 3.0  License, http://creativecommons.org/licenses/by-sa/3.0/

Change Log
----------
15/10/2006	v0.3	innerXHTML official release.
21/03/2007	v0.4	1. Third argument $appendage added (Steve Tucker & Stef Dawson, www.stefdawson.com)
			2. $source argument accepts string ID (Stef Dawson)
			3. IE6 'on' functions work (Stef Dawson & Steve Tucker)
16/03/2008  patch1  Kept only $source argument and html-to-string ("if (!$string) {...kept this...}")
16/03/2008  patch2  Right trim text contents, for identical behaviour in FF and IE6 (Staffan Olsson)
16/03/2008  patch3  Fix for jQuery's internal attribute jquery1234 in IE6 (Staffan Olsson)
16/03/2008  patch4  Fix for IE6 incorrect nodeValue for href attribute (Staffan Olsson)
17/03/2008  patch5  Always place id attribute first, for consistent ordering of id+class, id+style etc
10/04/2008  patch6  Handle empty elements as suggested in http://www.w3.org/TR/xhtml1/#C_2
*/
innerXHTML = function($source) {
	// (v0.4) Written 2006 by Steve Tucker, http://www.stevetucker.co.uk
	// (removed this line, ...getElementById($source);)
	if (!($source.nodeType == 1)) return false;
	var $children = $source.childNodes;
	var $xhtml = '';
	// cut the relevant from the original innerXHTML release, accept only $source argument
		for (var $i=0; $i<$children.length; $i++) {
			if ($children[$i].nodeType == 3) {
				var $text_content = $children[$i].nodeValue;
				$text_content = $text_content.replace(/</g,'&lt;');
				$text_content = $text_content.replace(/>/g,'&gt;');
				if (!(/^\s+$/).test($text_content))
				$text_content = $text_content.replace(/\s+$/,''); // trailing space not significant unless it is the only text content of the node
				$xhtml += $text_content;
			}
			else if ($children[$i].nodeType == 8) {
				$xhtml += '<!--'+$children[$i].nodeValue+'-->';
			}
			else {
				var $nodeName = $children[$i].nodeName.toLowerCase();
				$xhtml += '<'+$nodeName;
				var $attributes = $children[$i].attributes;
				var $att = '';
 				for (var $j=0; $j<$attributes.length; $j++) {
					var $attName = $attributes[$j].nodeName.toLowerCase();
					if (/^jquery\d+$/.test($attName)) continue; // fix for jQuery internals in IE
					var $attValue = $attName=='href' ? $children[$i].getAttribute('href',2) : $attributes[$j].nodeValue; // IE sucks : standard
					if ($attName == 'style' && $children[$i].style.cssText) {
						$att += ' style="'+$children[$i].style.cssText.toLowerCase()+'"';
					}
					else if ($attValue && $attName == 'id') {
						$att = ' id="'+$attValue+'"' + $att; // id always first
					}
					else if ($attValue && $attName != 'contenteditable') {
						$att += ' '+$attName+'="'+$attValue+'"';
					}
				}
				if (!$children[$i].hasChildNodes() && innerXHTML.dtdempty.indexOf(','+$nodeName+',')>=0) { // element empty both in DOM and in DTS
					$xhtml += $att+' />'; // http://www.w3.org/TR/xhtml1/#C_2
				} else {
					$xhtml += $att + '>'+innerXHTML($children[$i]);
					$xhtml += '</'+$nodeName+'>';
				}
			}
		}
	return $xhtml;
}
innerXHTML.dtdempty = ',base,br,hr,img,input,meta,link,param,area,'; // http://www.w3.org/TR/xhtml1/dtds.html
