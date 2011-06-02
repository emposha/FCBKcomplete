
FCBKcomplete
============
  FCBKcomplete is fancy facebook-like dynamic inputs with auto complete & pre added values.

  FCBKcomplete v2.8.5 is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>

  FCBKcomplete based on TextboxList by Guillermo Rauch http://devthought.com/

Requirements
------------
Jquery version required: 1.6.x

FCBKcomplete forks
------------------
  https://github.com/partoa/FCBKcomplete

Usage
-----
To activate FCBKcomplete:
$("elem").fcbkcomplete({json_url: "fetched.txt", cache: true, filter_case: true, filter_hide: true, newel: true});

Trigger to add new element:
$("elem").trigger("addItem",[{"title": "test", "value": "test"}]);

Trigger to remove element:
$("elem").trigger("removeItem",[{"value": "test"}]);

Changelog
---------

 - 2.8.5 cache object fix (case sensitive) by @ketwaroo

 - 2.8.4 cache object fix by @tedberg
  
 - 2.8.3 no more eval use
  public function addItem and removeItem fix (thanks to Yaron)
  
 - 2.8.2  json_cache bug fix
  new option added "bricket"
  newel bug fix thanks to Matt
 
 - 2.8.1  some minor bug fixes
  added selected attribute to preselected option thanks to @musketyr
  fixed cache entry with space thanks to Matt
  
 - 2.8.0  bug fixes
 added jquery 1.6 support please note that old versions of jquery not supported
 cache mechanizm updated

 - 2.7.5  event call removeItem fixed
 new public method destroy added needed to remove fcbkcomplete element from dome

 - 2.7.4 standart event change call added on addItem, removeItem
 preSet also check if item have "selected" attribute
 addItem minor fix

 - 2.7.3 event call fixed thanks to William Parry <williamparry!at!gmail.com>
 
 - 2.7.2 some minor bug fixed
 minified version recompacted due some problems

 - 2.7.1 bug fixed
 ajax delay added thanks to http://github.com/dolorian

 - 2.7   jquery 1.4 compability
 item lock possability added by adding locked class to preadded option <option value="value" class="selected locked">text</option>
 maximum item that can be added

Options
-------

 * json_url         - url to fetch json object
 * cache            - use cache
 * height           - maximum number of element shown before scroll will apear
 * newel            - show typed text like a element
 * firstselected    - automaticly select first element from dropdown
 * filter_case      - case sensitive filter
 * filter_selected  - filter selected items from list
 * complete_text    - text for complete page
 * maxshownitems    - maximum numbers that will be shown at dropdown list (less better performance)
 * onselect         - fire event on item select
 * onremove         - fire event on item remove
 * maxitimes        - maximum items that can be added
 * delay            - delay between ajax request (bigger delay, lower server time request)
 * addontab         - add first visible element on tab or enter hit
 * attachto         - after this element fcbkcomplete insert own elements
 * bricket          - use square bricket with select (needed for asp or php) enabled by default
