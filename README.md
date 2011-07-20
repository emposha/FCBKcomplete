
FCBKcomplete
============
FCBKcomplete is fancy facebook-like dynamic inputs with auto complete & pre added values.

FCBKcomplete is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>

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

Trigger to remove fcbkcomplete:

    $("elem").trigger("destroy");

Options
-------

 * json_url         - url to fetch json object
 * cache            - use cache
 * height           - maximum number of element shown before scroll will apear
 * newel            - show typed text like a element
 * firstselected    - automaticly select first element from dropdown
 * filter_case      - case sensitive filter
 * filter_selected  - filter selected items from list
 * filter_begin     - filter only from begin
 * complete_text    - text for complete page
 * maxshownitems    - maximum numbers that will be shown at dropdown list (less better performance)
 * onselect         - fire event on item select
 * onremove         - fire event on item remove
 * maxitimes        - maximum items that can be added
 * delay            - delay between ajax request (bigger delay, lower server time request)
 * addontab         - add first visible element on tab or enter hit
 * attachto         - after this element fcbkcomplete insert own elements
 * bricket          - use square bricket with select (needed for asp or php) enabled by default
 * input_tabindex   - the tabindex of the input element
 * input_min_size   - minimum size of the input element (default: 1)
 * input_name       - value of the input element's 'name'-attribute (no 'name'-attribute set if empty)
 * tab_leaves_input - if set to true, then the tab key leaves the fcbkcomplete-input and goes to the next form element. If addontab==true, a new element will be created before leaving.
 * comma_separator  - if set to true, the comma will separate different elements
 * prevent_empty_elements [boolean]
 * prevent_duplicate_elements [boolean]


Changelog
---------
 - ?????
   json_cache and cache object rewritten, to allow keys with special characters (like '-')
   new options: input_tabindex, input_min_size, input_name, tab_leaves_input, comma_separator, prevent_empty_elements, prevent_duplicate_elements
   xssPrevent() does NOT escape the comma character anymore.
   
 - 2.8.7 addItem fix when value is not a string by @meltix
         new option added (filter_begin) enable filtration from begining

 - 2.8.6 illumination function fix by @ketwaroo
  addontab new item insertion fix
  funcall object fix by @fduch2k
  unique identifier per added element (support element with same value)
  added support for specail characters (',\,/,")

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