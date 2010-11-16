/**
 FCBKcomplete 2.7.5
 - Jquery version required: 1.2.x, 1.3.x, 1.4.x
 
 Based on TextboxList by Guillermo Rauch http://devthought.com/
  
 Changelog:
 - 2.00 new version of fcbkcomplete
 
 - 2.01 fixed bugs & added features
    fixed filter bug for preadded items
    focus on the input after selecting tag
    the element removed pressing backspace when the element is selected
    input tag in the control has a border in IE7
    added iterate over each match and apply the plugin separately
    set focus on the input after selecting tag
 
 - 2.02 fixed fist element selected bug
    fixed defaultfilter error bug
 
 - 2.5  removed selected="selected" attribute due ie bug
    element search algorithm changed
    better performance fix added
    fixed many small bugs
    onselect event added
    onremove event added
 
 - 2.6  ie6/7 support fix added
    added new public method addItem due request
    added new options "firstselected" that you can set true/false to select first element on dropdown list
    autoexpand input element added
    removeItem bug fixed
    and many more bug fixed
    fixed public method to use it $("elem").trigger("addItem",[{"title": "test", "value": "test"}]);
    
- 2.7   jquery 1.4 compability
    item lock possability added by adding locked class to preadded option <option value="value" class="selected locked">text</option>
    maximum item that can be added

- 2.7.1 bug fixed
    ajax delay added thanks to http://github.com/dolorian

- 2.7.2 some minor bug fixed
    minified version recompacted due some problems
    
- 2.7.3 event call fixed thanks to William Parry williamparry!at!gmail.com

- 2.7.4 standart event change call added on addItem, removeItem
    preSet also check if item have "selected" attribute
    addItem minor fix
    
- 2.7.5  event call removeItem fixed
         new public method destroy added needed to remove fcbkcomplete element from dome

 */
/* Coded by: emposha admin@emposha.com */
/* Copyright: Emposha.com http://www.emposha.com - Distributed under MIT - Keep this message! */

/**
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
 * addontab         - add first show element on tab or enter hit
 * attachto         - after this element fcbkcomplete insert own elements
 */