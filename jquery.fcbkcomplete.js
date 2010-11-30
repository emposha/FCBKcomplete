/*
 FCBKcomplete 2.7.6
 - Jquery version required: 1.2.x, 1.3.x, 1.4.x

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

- 2.7.3 event call fixed thanks to William Parry <williamparry!at!gmail.com>

- 2.7.4 standart event change call added on addItem, removeItem
        preSet also check if item have "selected" attribute
        addItem minor fix

- 2.7.5 added options "choose_on_enter,choose_on_tab,choose_on_comma" to control what keys trigger selection
        added option "keep_prompt_after_choose" to control if we stay selected/focused after choosing an option
        added options "force_width" and "auto_width" to control width setting (if both are null || false, no width is set in JS)

- 2.7.6 minor bug fixes
        added 'php_mode' option to append square brackets after the <select> tag's name attribute.
        added 'class_names' dictionnary to change the default CSS classes used by the plugin.

*/
/* Copyright: Guillermo Rauch <http://devthought.com/> - Distributed under MIT - Keep this message! */
/*
 * json_url         - url to fetch json object
 * cache            - use cache
 * height           - maximum number of element shown before scroll will apear
 * newel            - show typed text like a element
 * firstselected    - automaticly select first element from dropdown
 * filter_case      - case sensitive filter
 * filter_selected  - filter selected items from list
 * complete_text    - text for complete page
 * maxshownitems    - maximum numbers that will be shown at dropdown list (less better performance)
 * onselect         - fire event on item remove, expects function(data){}, data is a javascript object with the attributes _value, _selected, _class.
 *                    this within the function is the select element in question.
 * onremove         - same as select but data lacks the _selected property
 * maxitimes        - maximum items that can be added
 * delay            - delay between ajax request (bigger delay, lower server time request)
 * default_search   - For a default search seacrh string. '.*?' is used to show all by default
 * preset_update    - to make converted selects skip selected items
 * used_vals        - for connected select elements that have a pre-selected values, this is used to filter out selected elements
 * connect_with     - other autocompletes to connect the selected autocomplete with, for linked selects initialized together, using the 'Array' is recommended
 *                    so as to use less memory. Not like there will be much memory used up to begin with.
 * force_width      - Uses the width provided for the combo
 * auto_width       - Calculates width automatically for the combo
 * choose_on_comma  - Makes a selection when the comma button is hit
 * choose_on_tab    - Makes a selection when the tab is hit
 * choose_on_enter  - Makes a selection when the enter is hit
 * keep_prompt_after_choose - keeps the combo box open even after selection
 * php_mode         - append [] to the tag input field name when converting it to a <select>
 * zIndex           - The z-index of the feed.
 * class_names      - CSS classes used by the plugin
 *                     + holder (default value: holder): CSS class for the <ul> tag.
 *                     + complete (default value: facebook-auto): CSS class for the autocomplete div.
 *                     + closebutton (default value: closebutton): CSS class for the button to remove an item.
 *                     + item_default (default value: bit-box): CSS class for the selected values.
 *                     + item_locked (default value: locked): CSS class for locked items.
 */
(function ($) {

    $.fn.extend({
        fcbkcomplete: function (options) {
            options = $.extend({}, $.FCBKCompleter.defaults, options);

            // If a 'options.class_names' dictionary was passed, still use defaults
            // for undefined classes.
            if (options.class_names !== $.FCBKCompleter.default_class_names) {
                options.class_names = $.extend({}, $.FCBKCompleter.default_class_names, options.class_names);
            }

            return this.each(function () {
                new $.FCBKCompleter(this, options);
            });
        }
    });

    $.FCBKCompleter = function(input, options) {

        var KEY = {
            UP: 38,
            DOWN: 40,
            DEL: 46,
            TAB: 9,
            RETURN: 13,
            ESC: 27,
            COMMA: 188,
            PAGEUP: 33,
            PAGEDOWN: 34,
            BACKSPACE: 8,
            FORWARD_SLASH: 191
        };

        //========= FCBK variable ===========//

        var holder = null;
        var feed = null;
        var complete = null;
        var counter = 0;
        var cache = new Array();
        var json_cache = false;
        var search_string = '';
        var focuson = null;
        var deleting = 0;
        var browser_msie = "\v" == "v";
        var browser_msie_frame;
        var element = $(input);
        var elemid = element.attr("id") || 'fcbkselect_ '+ Math.floor(Math.random() * 100000);
        var li_annon = null;
        var input = null;
        var elm_selected = new Array();
        var used_vals = (options.used_vals != undefined && $.isArray(options.used_vals)) ? options.used_vals : [];


        //=========== Setup plugin ============//

        createFCBK();
        preSet();
        fcbkPosition();
        addInput(false);
        moveToTop();
        element.data('setSelected', function(val, disable) {
            var pos = $.inArray(val, elm_selected);
            if (disable && pos < 0) {
                elm_selected.push(val);
            }
            else if (!disable && pos > -1) {
                elm_selected.splice(pos, 1);
            }
        });

        $(this).bind("addItem", function(event, data) {
            if ($.isArray(data)) {
                for (var i = 0 ; i<data.length; i++) {
                    addItem(data[i].title, data[i].value, 0, 0, 0);
                }
            }
            else {
                addItem(data.title, data.value, 0, 0, 0);
            }
        });



        //========= Method declarations ===========//

        function createFCBK() {
            if (element.context.tagName.toUpperCase() != "SELECT") {
                //element is no select tag, need to replace
                // it with one
                var elementId = element[0].id;
                var newElement = $(document.createElement("select"));
                newElement.attr("name", element[0].name);
                element.replaceWith(newElement);
                element = newElement;
                element.attr("id", elementId);
            }

            element.hide();
            if (options.maxitems > 1) {
                element.attr("multiple", "multiple");
            }

            if (options.php_mode && element.attr("name").indexOf("[]") == -1) {
                element.attr("name", element.attr("name") + "[]");
            }

            holder = $(document.createElement("ul"));
            holder.attr("class", options.class_names.holder);
            element.after(holder);

            complete = $(document.createElement("div"));
            complete.addClass(options.class_names.complete);
            if (options.complete_text) {
                complete.append('<div class="default">' + options.complete_text + "</div>");
            }

            if (browser_msie) {
                complete.append('<iframe class="ie6fix" scrolling="no" frameborder="0"></iframe>');
                browser_msie_frame = complete.children('.ie6fix');
            }

            feed = $(document.createElement("ul"));
            feed.attr("id", elemid + "_feed");

            complete.prepend(feed);
            holder.after(complete);
            if (options.force_width) {
                feed.css("width", options.width);
            } else if (options.auto_width) {
                feed.css("width", complete.width());
            }
        }

        function preSet() {
            if (options.data && $.isArray(options.data)) {
                $.each(options.data, function(index, value){
                    cache.push({
                        caption: value.name,
                        value: value.id
                    });
                    used_vals.push(value.id);
                });
            }
            else {
                element.children("option").each(function(i, option) {
                    option = $(option);
                    if (options.maxitems > 1) {
                        if (option.hasClass("selected") || option.is(':selected')) {
                            addItem(option.text(), option.val(), true, option.hasClass(options.class_names.item_locked));
                            option.attr("selected", "selected");
                            used_vals.push(option.val());
                        }
                    } else {
                        option.removeAttr("selected");
                    }

                    cache.push({
                        caption: option.text(),
                        value: option.val()
                    });
                    search_string += "" + (cache.length - 1) + ":" + option.text() + ";";
                });
            }
        }


        function fcbkPosition() {
            setTimeout(function() {
                var prev = complete.prev();
                var offset = prev.position();

                complete.css({
                    'top': offset.top + prev.outerHeight(true),
                    'position': 'absolute',
                    'z-index': options.zIndex,
                    'left': offset.left
                });
            }, 0);
        }


        function setSelecton(val, disable) {
            if (options.connect_with) {
                $(options.connect_with).each(function() {
                    if (this != element[0]) {
                        var fun = $(this).data('setSelected');
                        if (typeof fun == 'function') {
                            fun(val, disable);
                        }
                    }
                });
            }
        }


        function addItem(title, value, preadded, locked, focusme) {
            if (!maxItems()) {
                return false;
            }

            var li = $(document.createElement("li"));
            var aclose = $(document.createElement("a"));
            var liclass = "bit-box" + (locked ? " locked" : "");
            var txt = $('<div style="float:left;">' + title+ '</div>')
            li.attr({
                "class": liclass,
                "rel": value,
                'style':'position:static'
            });
            holder.append(li);
            li.prepend(txt);
            li.append(aclose)
            var parent_width = li.parent().width();
            var li_width = li.width();
            li_width = options.width?options.width:li_width;
            if(parent_width > (li_width + 17) && !options.width){
                li_width = li_width + 17;
            }
            li.width((li_width) + 'px');

            txt.css({
                'width':Math.abs(li_width -17) + 'px',
                'overflow':'hidden',
                'height':'auto',
                'white-space':'normal'
            });

            var margin = Math.abs(Math.ceil((li.height() - 7)/2));
            aclose.attr({
                "class": "closebutton",
                "href": "#",
                'style':';width:7px;float:right;margin:' + margin + 'px 3px 0px 3px;'
            });
            aclose.click(function(){
                removeItem($(this).parent("li"));
                return false;
            });

            if (locked) {
                $(li).addClass(options.class_names.item_locked);
            }

            if (!preadded) {
                var _item;
                addInput(focusme);
                if (element.children("option[value=" + value + "]").length) {
                    _item = element.children("option[value=" + value + "]");
                    _item.get(0).setAttribute("selected", "selected");
                    if (!_item.hasClass("selected")) {
                        _item.addClass("selected");
                    }
                }
                else {
                    var _item = $(document.createElement("option"));
                    _item.attr("value", value).get(0).setAttribute("selected", "selected");
                    _item.attr("value", value).addClass("selected");
                    _item.text(title);
                    element.append(_item);
                }

                if (options.connect_with == 'Array' && $.inArray(value, used_vals) < 0) {
                    used_vals.push(value.toString());
                }
                else if (options.connect_with && options.connect_with != 'Array' ) {
                    setSelecton(value.toString(), true)
                }
                if (typeof options.onselect == 'function') {
                    funCall(options.onselect, _item)
                }
                element.change();
            }
            holder.children("li." + options.class_names.item_default + ".deleted").removeClass("deleted");
            feed.hide();
            browser_msie ? browser_msie_frame.hide() : '';
        }


        function removeItem (item) {
            if (!item.hasClass(options.class_names.item_locked)) {
                item.fadeOut("fast");
                var value = item.attr("rel");
                if (options.connect_with == 'Array') {
                    var pos = $.inArray(value, used_vals);
                    if (pos > -1) {
                        used_vals.splice(pos, 1);
                    }
                }
                else if (options.connect_with && options.connect_with != 'Array') {
                    setSelecton(value, false)
                }

                if (typeof options.onremove == 'function') {
                    var _item = element.children("option[value=" + value + "]");
                    funCall(options.onremove, _item)
                }
                element.children('option[value="' + item.attr("rel") + '"]').removeAttr("selected").removeClass("selected");
                item.remove();
                element.change();
                deleting = 0;
            }
        }


        function addInput (focusme) {
            if(li_annon && li_annon.remove){
                li_annon.remove();
            }
            li_annon = $(document.createElement("li"));
            input = $(document.createElement("input"));

            li_annon.attr({
                'class': 'bit-input', 
                'id': elemid + '_annoninput'
            });
            input.attr({
                'type': 'text', 
                'class': 'maininput', 
                'size': '1', 
                'autocomplete': 'off'
            });
            holder.append(li_annon.append(input));

            var getBoxTimeout = 0;

            input.focus(function() {
                complete.fadeIn("fast");
            });
            input.blur(function() {
                complete.fadeOut("fast");
            });

            holder.click(function() {
                fcbkPosition();
                input.focus();
                if (feed.length && (input.val().length || options.default_search.length)) {
                    if (options.default_search.length && !input.val().length) {
                        input.keyup();
                    }
                    feed.show();
                }
                else {
                    feed.hide();
                    browser_msie ? browser_msie_frame.hide() : '';
                    complete.children(".default").show();
                }
            });

            input.keypress(function(event) {
                if (event.keyCode == KEY.RETURN || event.keyCode == KEY.TAB) {
                    return true;
                }
                //auto expand input
                input.attr("size", input.val().length + 1);
            });

            input.keydown(function(event) {
                //prevent to enter some bad chars when input is empty
                if (event.keyCode == KEY.FORWARD_SLASH) {
                    event.preventDefault();
                    return false;
                }
            });

            input.keyup(function(event) {
                var inp_val = input.val();
                var etext = xssPrevent(inp_val == '' ? options.default_search : inp_val);

                if (event.keyCode == KEY.BACKSPACE && etext == options.default_search) {
                    feed.hide();
                    browser_msie ? browser_msie_frame.hide() : '';
                    if (!holder.children("li." + options.class_names.item_default + ":last").hasClass(options.class_names.item_locked)) {
                        if (holder.children("li." + options.class_names.item_default + ".deleted").length == 0) {
                            holder.children("li." + options.class_names.item_default + ":last").addClass("deleted");
                            return false;
                        }
                        else {
                            if (deleting) {
                                return;
                            }
                            deleting = 1;
                            holder.children("li." + options.class_names.item_default + ".deleted").fadeOut("fast", function() {
                                removeItem($(this));
                                return false;
                            });
                        }
                    }
                }

                if (event.keyCode != KEY.DOWN && event.keyCode != KEY.UP && etext.length != 0) {
                    counter = 0;

                    if (options.json_url) {
                        if (options.cache && json_cache) {
                            addMembers(etext);
                            bindEvents();
                        }
                        else {
                            getBoxTimeout++;
                            var getBoxTimeoutValue = getBoxTimeout;
                            setTimeout (function() {
                                if (getBoxTimeoutValue != getBoxTimeout) return;
                                $.getJSON(options.json_url + ( options.json_url.indexOf("?") > -1 ? "&" : "?" ) + "tag=" + etext, null,
                                    function (data) {
                                        addMembers(etext, data);
                                        json_cache = true;
                                        bindEvents();
                                    });
                            }, options.delay);
                        }
                    }
                    else {
                        var data = undefined
                        if (options.preset_update) {
                            data = new Array();
                            element.children("option").each(function(i, option) {
                                option = $(option);
                                if (option.is(':selected') || option.is('.selected')) {
                                    return undefined;
                                }
                                data.push({
                                    caption: option.text(),
                                    value: option.val()
                                });
                            });
                        }
                        addMembers(etext, data);
                        bindEvents();
                    }
                    fcbkPosition();
                    complete.children(".default").hide();
                    feed.show();
                }
            });
            if (focusme) {
                setTimeout(function() {
                    input.focus();
                    fcbkPosition();
                    complete.children(".default").show();
                }, 1);
            }
        }


        function addMembers(etext, data) {
            feed.html('');
            etext = etext == '' ? options.default_search : etext;

            if (!options.cache && data != null) {
                cache = new Array();
                search_string = "";
            }

            if (options.default_search != etext) {
                addTextItem(etext);
            }

            if (data != null && data.length) {
                $.each(data, function(i, val) {
                    cache.push({
                        caption: val.caption,
                        value: val.value
                    });
                    search_string += "" + (cache.length - 1) + ":" + val.caption + ";";
                });
            }

            var maximum = options.maxshownitems < cache.length ? options.maxshownitems : cache.length;
            var filter = "i";
            if (options.filter_case) {
                filter = "";
            }

            var myregexp, match;
            try {
                myregexp = new RegExp('(?:^|;)\\s*(\\d+)\\s*:[^;]*?' + etext + '[^;]*', 'g' + filter);
                match = myregexp.exec(search_string);
            }
            catch (ex) {
            };

            var content = '';
            while (match != null && maximum > 0) {
                var id = match[1];
                var object = cache[id];
                var op_selected = $.inArray(object.value.toString(), elm_selected);
                if (op_selected < 0 && options.connect_with == 'Array') {
                    op_selected = $.inArray(object.value.toString(), used_vals);
                }
                if (op_selected < 0) {
                    var elm = element.children("option[value=" + object.value + "]");
                    if (elm.length == 0) {
                        elm = element.children(":contains('" + object.value + "')");
                    }
                    op_selected = (elm.length > 0 && options.filter_selected && (elm.is(".selected") || elm.is(":selected")));
                }
                else {
                    op_selected = true;
                }

                if (!op_selected) {
                    content += '<li rel="' + object.value + '">' + itemIllumination(object.caption, etext) + '</li>';
                    counter++;
                    maximum--;
                }
                match = myregexp.exec(search_string);
            }

            feed.append(content);
            if (options.firstselected) {
                focuson = feed.children("li:first");
                focuson.addClass("auto-focus");
            }

            if (counter > options.height) {
                feed.css({
                    "height": (options.height * 24) + "px",
                    "overflow": "auto"
                });
                if (browser_msie) {
                    if (options.auto_width) {
                        browser_msie_frame.css({
                            "width": feed.width() + "px"
                        });
                    }
                    browser_msie_frame.css({
                        "height": (options.height * 24) + "px"
                    }).show();
                }
            }
            else {
                feed.css("height", "auto");
                if (browser_msie) {
                    if (options.auto_width) {
                        browser_msie_frame.css({
                            "width": feed.width() + "px"
                        });
                    }
                    browser_msie_frame.css({
                        "height": feed.height() + "px"
                    }).show();
                }
            }
        }


        function moveToTop(id) {
            var sel = $(options.layer_selector);

            if (sel != null && sel.length > 0) {
                var max_index = 0;
                var elm = $(id);

                $(options.layer_selector).each(function() {
                    var temp_index = parseInt($(this).css("z-index"));

                    if (elm [0] != this && temp_index > max_index) {
                        max_index = temp_index;
                    }
                });

                elm.css({
                    'z-index':(max_index + 1)
                });
            }
        }


        function itemIllumination(text, etext) {
            if (options.filter_case) {
                try {
                    var text = text.replace(new RegExp('(.*)("' + etext + '")(.*)', 'gi'), '$1<em>$2</em>$3');;
                }
                catch (ex) {
                };
            }
            else {
                try {
                    var text = text.replace(new RegExp('(.*)("' + etext.toLowerCase() + '")(.*)', 'gi'), '$1<em>$2</em>$3');;
                }
                catch (ex) {
                };
            }
            return text;
        }


        function bindFeedEvent(){
            feed.children("li").mouseover(function() {
                feed.children("li").removeClass("auto-focus");
                $(this).addClass("auto-focus");
                focuson = $(this);
            });

            feed.children("li").mouseout(function(){
                $(this).removeClass("auto-focus");
                focuson = null;
            });
        }


        function removeFeedEvent(){
            feed.children("li").unbind("mouseover");
            feed.children("li").unbind("mouseout");
            feed.mousemove(function() {
                bindFeedEvent();
                feed.unbind("mousemove");
            });
        }


        function bindEvents() {
            var maininput = li_annon.children(".maininput");
            bindFeedEvent();
            feed.children("li").unbind("mousedown");
            feed.children("li").mousedown(function() {
                var option = $(this);
                addItem(option.text(), option.attr("rel"));
                feed.hide();
                browser_msie ? browser_msie_frame.hide() : '';
                complete.hide();
            });

            maininput.unbind("keydown");
            maininput.keydown(function(event) {
                if (event.keyCode == KEY.FORWARD_SLASH) {
                    event.preventDefault();
                    return false;
                }

                if (event.keyCode != KEY.BACKSPACE) {
                    holder.children("li." + options.class_names.item_default + ".deleted").removeClass("deleted");
                }

                /* Triggers an "submit" event */
                if ((event.keyCode == KEY.RETURN && options.choose_on_enter) ||
                    (event.keyCode == KEY.TAB && options.choose_on_tab) ||
                    (event.keyCode == KEY.COMMA && options.choose_on_comma)) {
                    if (checkFocusOn()) {
                        var option = focuson;
                        addItem(option.text(), option.attr("rel"));
                        complete.hide();
                        event.preventDefault();
                        focuson = null;
                        if (options.keep_prompt_after_choose) {
                            holder.trigger("click");
                        }
                        return false;
                    } else {
                        if (options.newel) {
                            var value = xssPrevent($(this).val());
                            if (value) {
                                addItem(value, value);
                                event.preventDefault();
                                input.focus();
                            } else {
                                complete.hide();
                            }
                            focuson = null;
                        }
                        if (options.keep_prompt_after_choose) {
                            holder.trigger("click");
                        }
                        return false;
                    }
                }

                if (event.keyCode == KEY.DOWN) {
                    removeFeedEvent();
                    if (focuson == null || focuson.length == 0) {
                        focuson = feed.children("li:first");
                        feed.get(0).scrollTop = 0;
                    }
                    else {
                        focuson.removeClass("auto-focus");
                        focuson = focuson.next();
                        var prev = parseInt(focuson.prevAll("li").length);
                        var next = parseInt(focuson.nextAll("li").length);
                        if ((prev > Math.round(options.height / 2) || next <= Math.round(options.height / 2)) && typeof(focuson.get(0)) != "undefined") {
                            feed.get(0).scrollTop = parseInt(focuson.get(0).scrollHeight, 10) * (prev - Math.round(options.height / 2));
                        }
                    }
                    feed.children("li").removeClass("auto-focus");
                    focuson.addClass("auto-focus");
                }

                if (event.keyCode == KEY.UP) {
                    removeFeedEvent();
                    if (focuson == null || focuson.length == 0) {
                        focuson = feed.children("li:last");
                        feed.get(0).scrollTop = parseInt(focuson.get(0).scrollHeight) * (parseInt(feed.children("li").length) - Math.round(options.height / 2));
                    }
                    else {
                        focuson.removeClass("auto-focus");
                        focuson = focuson.prev();
                        var prev = parseInt(focuson.prevAll("li").length);
                        var next = parseInt(focuson.nextAll("li").length);
                        if ((next > Math.round(options.height / 2) || prev <= Math.round(options.height / 2)) && typeof(focuson.get(0)) != "undefined") {
                            feed.get(0).scrollTop = parseInt(focuson.get(0).scrollHeight) * (prev - Math.round(options.height / 2));
                        }
                    }
                    feed.children("li").removeClass("auto-focus");
                    focuson.addClass("auto-focus");
                }
            });
        }


        function maxItems() {
            return (options.maxitems > 0
                && holder.children("li." + options.class_names.item_default).length < options.maxitems);
        }


        function addTextItem(value) {
            if (options.newel && maxItems()) {
                feed.children("li[fckb=1]").remove();
                if (value.length == 0) {
                    return;
                }
                var li = $(document.createElement("li"));
                li.attr({
                    'rel': value, 
                    'fckb': '1'
                }).html(value);
                feed.prepend(li);
                counter++;
            }
        }


        function funCall(func, item) {
            var _object = {};
            for (var i = 0; i < item.get(0).attributes.length; i++) {
                if (item.get(0).attributes[i].nodeValue != null) {
                    _object['_' + item.get(0).attributes[i].nodeName] =  item.get(0).attributes[i].nodeValue;
                }
            }
            func.call(element[0], _object);
        }


        function checkFocusOn() {
            return !(focuson == null || focuson.length == 0);
        }


        function xssPrevent(string) {
            string = string.replace(/[\"\'][\s]*javascript:(.*)[\"\']/g, "\"\"");
            string = string.replace(/script(.*)/g, "");
            string = string.replace(/eval\((.*)\)/g, "");
            string = string.replace('/([\x00-\x08,\x0b-\x0c,\x0e-\x19])/', '');
            return string;
        }

    }

    $.FCBKCompleter.default_class_names = {
        holder: 'holder',
        complete: 'facebook-auto',
        closebutton: 'closebutton',
        item_default: 'bit-box',
        item_locked: 'locked'
    };

    $.FCBKCompleter.defaults = {
        json_url: null,
        cache: false,
        height: "10",
        newel: false,
        firstselected: false,
        filter_case: false,
        filter_hide: false,
        complete_text: "Start to type...",
        default_search:'.*?',
        maxshownitems: 30,
        preset_update: true,
        maxitems:10,
        data: false,
        connect_with: false,
        onselect: null,
        onremove: null,
        delay: 10,
        zIndex: 1,
        used_vals: new Array(),
        force_width: null,
        auto_width: true,
        choose_on_comma: true,
        choose_on_tab: true,
        choose_on_enter: true,
        keep_prompt_after_choose: true,
        layer_selector: '',
        php_mode: true,
        class_names: $.FCBKCompleter.default_class_names
    }
})(jQuery)