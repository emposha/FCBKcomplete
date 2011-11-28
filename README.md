
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
  https://github.com/CatoTH/FCBKcomplete

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

Json format:

    [{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}]

Options
-------

 * width            - element width (by default 512px)
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
 * oncreate         - fire event on item create
 * maxitimes        - maximum items that can be added
 * delay            - delay between ajax request (bigger delay, lower server time request)
 * addontab         - add first visible element on tab or enter hit
 * addoncomma       - add first visible element when pressing the comma key
 * attachto         - after this element fcbkcomplete insert own elements
 * bricket          - use square bricket with select (needed for asp or php) enabled by default
 * input_tabindex   - the tabindex of the input element
 * input_min_size   - minimum size of the input element (default: 1)
 * input_name       - value of the input element's 'name'-attribute (no 'name'-attribute set if empty)
 * select_all_text  - text for select all link

Changelog
---------
 - 2.8.9.3 input auto expand fixed, font-size dependency added

 - 2.8.9.2 Merge pull request #94 from mysmallidea, Merge pull request #98 from musketyr, firefox undefined name fixed (by xavierp)

 - 2.8.9.1 new options added input_min_size, select_all_text. The input_min_size added by  @meteozond and @Александр, and select_all_text option added by @musketyr. feed clear fix added

 - 2.8.9 cache mechanizm changed (ported from @CatoTH fork with minor changes), new event added "oncreate" by @jrencz
 
 - 2.8.8 added "width" paramater, added 109fd92, 5f4f529, ee59f2a fixes from @CatoTH fork 

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