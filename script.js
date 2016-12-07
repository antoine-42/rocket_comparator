//parse the strings into numbers in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].height = parseFloat(json_rockets.rockets[i].height);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].payload_leo = parseInt(json_rockets.rockets[i].payload_leo);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].payload_gto = parseInt(json_rockets.rockets[i].payload_gto);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].cost = parseInt(json_rockets.rockets[i].cost);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].status = parseInt(json_rockets.rockets[i].status);
}
//parse the strings into bools in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].high_res = json_rockets.rockets[i].high_res === '1';
}
//parse the strings into dates in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].date = new Date(json_rockets.rockets[i].date);
}

//var initialisation
var selected_rockets = JSON.parse('{"rockets" :[]}');

var comp_wrap = document.getElementById('comp_wrap');
var rocket_comp_background = document.getElementById('rocket_comp_background');
var rocket_comp_window = document.getElementById('rocket_comp_window');


var settings_window = document.getElementById('settings_window');
var settings_wrap = document.getElementById('settings_wrap');
var settings_form = document.getElementById('settings_form');

var collapse_button = document.getElementById('collapse_button');
var expand_button = document.getElementById('expand_button');
var back_to_top_button = document.getElementById('back_to_top_button');

var sorting_method_dropdown = document.getElementById('sorting_method_dropdown');
var object_selection_window = document.getElementById('object_selection');

//height, family, date, payload, cost
var sorting_args = [['height', 'country', 'family', 'manufacturer', 'name', 'payload_leo', 'payload_gto', 'version'],
    ['country', 'manufacturer', 'family', 'name', 'payload_leo', 'payload_gto', 'version'],
    ['date', 'country', 'family', 'manufacturer', 'name', 'payload_leo', 'payload_gto', 'version'],
    ['payload_leo', 'payload_gto', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['cost', 'country', 'family', 'manufacturer', 'name', 'payload_leo', 'payload_gto', 'version']];

//rockets that are selected by default
var selected_list = ['soyuz2', 'proton-m', 'ariane5eca',
    'sts-atlantis', 'atlas-v551', 'vulcan501', 'n1',
    'delta-iv-heavy', 'falcon-heavy1.2', 'its', 'saturn-v',
    'block1crew', 'new-glenn3stages', 'ariane64'];

var init = true;
var stupid_unit_system = false;
var rocket_comp_height = 85;
var enable_dark_theme = false;


//removes overflow
function remove_overflow()
{
    var comp_desc = document.getElementsByClassName('comp_desc');
    var max_height = 0;

    for (var i = 0; i < comp_desc.length; i++) {
        curr_rect = comp_desc[i].getBoundingClientRect();
        if(curr_rect.height > max_height){
            max_height = curr_rect.height;
        }
    }
    max_height = max_height + 10;

    rocket_comp_height = Math.round(100 - max_height *(100/document.body.clientHeight));

    rocket_comp_window.style.height = rocket_comp_height + '%';

    update_background_dimensions_2();
}


//checks if elem can be viewed in doc
function isScrolledIntoView(elem, doc)
{
    var doc_rect = doc.getBoundingClientRect();
    var doc_top = doc_rect.top;
    var doc_bottom = doc_rect.bottom;

    var elem_rect = elem.getBoundingClientRect();
    var elem_top = elem_rect.top;
    var elem_bottom = elem_rect.bottom;

    return (elem_bottom > 0);
}
function check_if_display_back_to_top(){
    var style_settings = window.getComputedStyle(settings_window);
    if(style_settings.display != 'none'){
        if(!isScrolledIntoView(static_settings, settings_wrap)){
            back_to_top_button.style.display = 'inline-block';
        }
        else {
            back_to_top_button.style.display = 'none';
        }
    }
}
//checks if the node is a child of the settings_window node
function check_if_settings_is_parent(node){
    if(node.id === 'settings_window'){
        return true;
    }
    else if(node.nodeName === 'BODY'){
        return false;
    }
    else{
        return check_if_settings_is_parent(node.parentElement);
    }
}
//makes the scrolling horizontal
var static_settings = document.getElementById('static_settings');
function horizontal_scroll(e){
    if(!check_if_settings_is_parent(e.target)){
        var scroll = e.deltaY;
        if (scroll > -10 && scroll < 10) {
            scroll = scroll * 100/3
        }
        window.scrollBy(scroll, 0);
    }
    else {
        check_if_display_back_to_top();
    }
}
//makes the event handler passive
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {}
document.body.addEventListener('wheel', horizontal_scroll, supportsPassive ? { passive: true } : false);

settings_form.addEventListener('scroll', check_if_display_back_to_top);


//scroll settings to top
function settings_scroll_to_top(){
    settings_form.scrollTop = 0;
}
back_to_top_button.addEventListener('click', settings_scroll_to_top);


//basic functions
//creates a text node at level with text
function create_text_node(text, level){
    var curr_header;
    if(level > 0){
        curr_header = document.createElement('h' + level);
    }
    else {
        curr_header = document.createElement('p');
    }
    curr_header.appendChild(document.createTextNode(text));
    return curr_header;
}
//creates a link with text
function create_link(text, link){
    var link_p = document.createElement('p');

    var link_text = document.createElement('a');
    link_text.href = link;
    link_text.appendChild(document.createTextNode(text));

    link_p.appendChild(link_text);
    return link_p;
}
//takes a path, returns an id
function get_id(rocket){
    var path = rocket.path;
    var path_array = path.split('/');
    return path_array[path_array.length - 1].split('.png')[0];
}

//finds_biggest_rocket
function find_biggest_rocket(){
    var biggest_rocket_height = 1;
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        if(selected_rockets.rockets[i].height > biggest_rocket_height){
            biggest_rocket_height = selected_rockets.rockets[i].height;
        }
    }
    return biggest_rocket_height;
}

//returns i where json_rockets.rockets[i] === rocket
function find_rocket_num(rocket){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if(json_rockets.rockets[i] === rocket){
            return i;
        }
    }
}

//returns the rocket with the id rocket_id
function find_rocket(rocket_id){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        var curr_rocket_id = get_id(json_rockets.rockets[i]);

        if(curr_rocket_id === rocket_id){
            return json_rockets.rockets[i];
        }
    }
}

//checks if rocket_id is active, if it is remove it if remove
function check_if_rocket_is_active(rocket_id, remove){
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var curr_rocket_id = get_id(selected_rockets.rockets[i]);

        if(curr_rocket_id === rocket_id){
            if(remove){
                selected_rockets.rockets.splice(i, 1);
            }
            return true;
        }
    }
    return false;
}
//switch the state of the checkbox of rocket_id
function switch_checkbox(rocket_id){
    var rocket_checkbox = document.getElementById(rocket_id + '_checkbox');
    rocket_checkbox.checked = !rocket_checkbox.checked;
}
//switch the state of rocket_id
function switch_rocket_status(id) {
    if(typeof id.altKey == 'undefined'){
        rocket_id = id;
    }
    else {
        rocket_id = this.id.split('_')[0];
    }

    if(!check_if_rocket_is_active(rocket_id, true)){
        selected_rockets.rockets.push(find_rocket(rocket_id));
    }
    if(init){
        switch_checkbox(rocket_id);
    }
    else {//don't want to call that during the automated loading, it is called at the end anyway
        update_rockets();
        update_background_dimensions();
    }
};

//force a checkbox to be at state
function force_checkbox(rocket_id, state){
    var rocket_checkbox = document.getElementById(rocket_id + '_checkbox');
    rocket_checkbox.checked = state;
}
//force a rocket to be active
function force_activate_rocket(rocket_id) {
    if(!check_if_rocket_is_active(rocket_id, false)){
        selected_rockets.rockets.push(find_rocket(rocket_id));
    }
    force_checkbox(rocket_id, true);
};
//force a rocket to be inactive
function force_deactivate_rocket(rocket_id) {
    check_if_rocket_is_active(rocket_id, true)
    force_checkbox(rocket_id, false);
};


//switch the display
function switch_display_settings () {
    var style_settings = window.getComputedStyle(settings_window);
    if (style_settings.getPropertyValue('display') == 'none') {
        settings_window.style.display = 'flex';
        expand_button.style.display = 'none';
        return true;
    }
    settings_window.style.display = 'none';
    expand_button.style.display = 'flex';
    return false;
}
collapse_button.addEventListener('click', switch_display_settings);
expand_button.addEventListener('click', switch_display_settings);


//this kills all the rockets
function remove_all_rocket(){
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var id = get_id(selected_rockets.rockets[i]);
        force_checkbox(id, false);
    }
    selected_rockets = JSON.parse('{"rockets" :[]}');
    update_rockets();
    update_background_dimensions();
}
var remove_all_rocket_button = document.getElementById('remove_all_rocket_button');
remove_all_rocket_button.addEventListener('click', remove_all_rocket);

//this adds all the rockets
function add_all_rocket(){
    remove_all_rocket();
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        var id = get_id(json_rockets.rockets[i]);
        selected_rockets.rockets.push(find_rocket(id));
        force_checkbox(id, true);
    }
    update_rockets();
    update_background_dimensions();
}
var add_all_rocket_button = document.getElementById('add_all_rocket_button');
add_all_rocket_button.addEventListener('click', add_all_rocket);

//adds every rocket where parameter === value
function add_rocket(parameter, value){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if (json_rockets.rockets[i][parameter] === value) {
            var id = get_id(json_rockets.rockets[i]);
            force_activate_rocket(id);
        }
    }

    update_rockets();
    update_background_dimensions();
}
//removes every rocket where parameter === value
function remove_rocket(parameter, value){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if (json_rockets.rockets[i][parameter] === value) {
            var id = get_id(json_rockets.rockets[i]);
            force_deactivate_rocket(id);
        }
    }

    update_rockets();
    update_background_dimensions();
}
//this adds all the rockets according to their status
function add_rocket_status(){
    if(selected === 'none'){
        return;
    }
    var selected = this.options[this.selectedIndex].value.split('=');
    var parameter = selected[0];
    var value = parseInt(selected[1]);

    add_rocket(parameter, value)

    this.selectedIndex = 0;
}
var add_rockets_dropdown = document.getElementById('add_rockets_dropdown');
add_rockets_dropdown.addEventListener('change', add_rocket_status);


var use_descending_order = false;
//sorts the rockets according to the arguments in the array args starting from 0
function sort_rockets(args, descending){
    return function(a, b){
        var sort_order_mod = 1;
        if(descending){
            sort_order_mod = -1;
        }

        for (var i = 0; i < args.length; i++) {
            var curr_a_arg = a[args[i]];
            var curr_b_arg = b[args[i]];

            //sting comparison using > and < is fucked up, use this instead
            //also, FUCK YOU JAVASCRIPT
            if(isNaN(curr_a_arg)){
                var comp = curr_a_arg.localeCompare(curr_b_arg);
                if(comp != 0){
                    return comp * sort_order_mod;
                }
            }
            else {
                if(curr_a_arg != curr_b_arg){
                    //when no data, put last no matter the order
                    if(curr_a_arg === -1){
                        return 1;
                    }
                    else if(curr_b_arg === -1){
                        return -1;
                    }

                    if(curr_a_arg > curr_b_arg){
                        return 1 * sort_order_mod;
                    }
                    return -1 * sort_order_mod;
                }
            }
        }

        return 0;
    }
}
//sorts the rocket if the sorting method is changed
function sorting_method_change(){
    selected_sorting_args = sorting_args[sorting_method_dropdown.selectedIndex];
    update_rockets();
}
sorting_method_change();
sorting_method_dropdown.addEventListener('change', sorting_method_change);
//updates the sorting order
function on_sorting_order_change(){
    use_descending_order = !use_descending_order;
    update_rockets();
}
var descending_sort_checkbox = document.getElementById('descending_sort_checkbox');
descending_sort_checkbox.addEventListener('click', on_sorting_order_change);

json_rockets.rockets.sort(sort_rockets(sorting_args[1], false));



function dark_theme_switch(){
    enable_dark_theme = !enable_dark_theme;

    if(enable_dark_theme){
        load_stylesheet('dark-theme.css');
    }
    else {
        unload_stylesheet('dark-theme.css');
    }
    update_background_scale();
    set_rocket_background();
}
var dark_theme_checkbox = document.getElementById('dark_theme_checkbox');
dark_theme_checkbox.addEventListener('click', dark_theme_switch);

function load_stylesheet(source){
    var stylesheet_node = document.createElement('link');
    stylesheet_node.rel = 'stylesheet';
    stylesheet_node.type = 'text/css';
    stylesheet_node.href = source;

    var head_node = document.getElementsByTagName('head')[0];
    head_node.appendChild(stylesheet_node);
}
function unload_stylesheet(filename){
    var link_list = document.getElementsByTagName('link');

    for (var i = 0; i < link_list.length; i++) {
        if(link_list[i].getAttribute('href').indexOf(filename) != -1){
            link_list[i].parentNode.removeChild(link_list[i]);
            return;
        }
    }
}



var imperial_checkbox = document.getElementById('imperial_checkbox');
imperial_checkbox.addEventListener('click', unit_system_check);
function unit_system_check(){
    stupid_unit_system = imperial_checkbox.checked;
    update_background_dimensions();
}
var window_width = 0;
var window_height = 0;
//updates the scale of the background (line position and stuff)
function update_background_scale(){
    var biggest_rocket_height = find_biggest_rocket();
    var rocket_ratio = biggest_rocket_height/100;

    var step = 10
    var pixel_per_m = Math.round(step / rocket_ratio / 100 * window_height)/10;

    rocket_comp_window_rect = rocket_comp_window.getBoundingClientRect();
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var curr_id = get_id(selected_rockets.rockets[i]);
        var wrap = document.getElementById(curr_id + '_rocket_wrap');
        wrap.style.height = rocket_comp_window_rect.height;
    }

    var unit = '';
    if(stupid_unit_system){
        var pixel_per_unit = pixel_per_m / 3.28084;
        var biggest_rocket_height = biggest_rocket_height * 3.28084;
        unit = 'ft';
    }
    else {
        var pixel_per_unit = pixel_per_m;
        unit = 'm';
    }


    var big_line_color = '#202020';
    var small_line_color = '#888888';
    if(enable_dark_theme){
        big_line_color = '#DDDDDD';
    }

    var ctx = rocket_comp_background.getContext('2d');
    ctx.clearRect(0, 0, rocket_comp_background.width, rocket_comp_background.height);
    for (var i = 0; i < biggest_rocket_height; i++) {
        if((pixel_per_unit > 3.9 && i % 10 === 0) || (pixel_per_unit <= 3.9 && i % 50 === 0)){
            //draws the line
            var pos_x_line = 15 + 10 * ((i + '').length)
            ctx.beginPath();
            ctx.moveTo(pos_x_line, rocket_comp_background.height - (Math.round(i * pixel_per_unit) +0.5));
            ctx.lineTo(window_width, rocket_comp_background.height - (Math.round(i * pixel_per_unit) +0.5));
            ctx.strokeStyle = big_line_color;
            ctx.stroke();
            ctx.closePath();

            //draws the text
            ctx.font = '15px Arial';
            ctx.fillStyle = big_line_color;
            ctx.fillText(i + unit, 3 , rocket_comp_background.height - (Math.round(i * pixel_per_unit)));
        }
        else if (pixel_per_unit > 20 && i % 2 === 0) {
            //secondary line, no text
            var pos_x_line = 15 + 10 * ((i + '').length)
            ctx.beginPath();
            ctx.moveTo(pos_x_line, rocket_comp_background.height - (Math.round(i * pixel_per_unit) +0.5));
            ctx.lineTo(window_width, rocket_comp_background.height - (Math.round(i * pixel_per_unit) +0.5));
            ctx.strokeStyle = small_line_color;
            ctx.stroke();
            ctx.closePath();
        }
    }
}
//updates the size of the background
function update_background_dimensions_2(){//fuck it i need to sleep
    window_width = document.body.clientWidth;
    window_height = rocket_comp_height * (document.body.clientHeight) / 100;

    rocket_comp_background.width = window_width;
    rocket_comp_background.height = window_height + 1;

    comp_wrap.style.height = document.body.clientHeight + 'px';

    update_background_scale();
}
function update_background_dimensions(){
    window_width = document.body.clientWidth;
    window_height = rocket_comp_height * (document.body.clientHeight) / 100;

    rocket_comp_background.width = window_width;
    rocket_comp_background.height = window_height + 1;

    comp_wrap.style.height = document.body.clientHeight + 'px';

    update_background_scale();
    if(!init){
        update_rockets();
    }
}
window.onresize = update_background_dimensions;

var hide_legend = false;
var selected_background = 'default';
function on_background_change(){
    var background_dropdown = document.getElementById('background_dropdown');
    selected_background = background_dropdown.options[background_dropdown.selectedIndex].value;

    set_rocket_background()
}
//updates the background of the rocket comparison
function set_rocket_background(){
    reset_background();

    switch (selected_background) {
        case 'status':
            set_background_status();
            break;
        case 'none':
            rocket_comp_background.style.display = 'none';
            break;
        default:
            reset_background();
            break;
    }
}
//resets the background
function reset_background(){
    var background_legend = document.getElementById('background_legend');
    background_legend.style.display = 'none';
    rocket_comp_background.style.display = 'block';

    var status_legend_checkbox_div = document.getElementById('status_legend_checkbox_div');
    status_legend_checkbox_div.style.display = 'none';

    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var curr_id = get_id(selected_rockets.rockets[i]);
        var curr_background = document.getElementById(curr_id + '_rocket_wrap');
        curr_background.style.backgroundColor = 'transparent';
    }
}
//sets the background to rocket status
function set_background_status(){
    if(!hide_legend){
        var background_legend = document.getElementById('background_legend');
        background_legend.style.display = 'block';
    }

    var status_legend_checkbox_div = document.getElementById('status_legend_checkbox_div');
    status_legend_checkbox_div.style.display = 'inline-block';

    var div_retired = document.getElementById('legend_retired');
    var style_retired = window.getComputedStyle(div_retired);
    var color_retired = style_retired.getPropertyValue('background-color');

    var div_dev = document.getElementById('legend_dev');
    var style_dev = window.getComputedStyle(div_dev);
    var color_dev = style_dev.getPropertyValue('background-color');

    var div_cancelled = document.getElementById('legend_cancelled');
    var style_cancelled = window.getComputedStyle(div_cancelled);
    var color_cancelled = style_cancelled.getPropertyValue('background-color');

    if(enable_dark_theme){
        color_cancelled = 'rgba(255, 255, 255, 0.3)'
    }

    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var curr_id = get_id(selected_rockets.rockets[i]);
        var curr_background = document.getElementById(curr_id + '_rocket_wrap');

        switch (selected_rockets.rockets[i].status) {
            case 1:
                curr_background.style.backgroundColor = color_retired;
                break;
            case 2:
                curr_background.style.backgroundColor = color_dev;
                break;
            case 3:
                curr_background.style.backgroundColor = color_cancelled;
                break;
            default:
                break;
        }
    }
}
var background_dropdown = document.getElementById('background_dropdown');
background_dropdown.addEventListener('change', on_background_change);

var status_legend_checkbox = document.getElementById('status_legend_checkbox');
function switch_status_legend(){
    hide_legend = !hide_legend;
    status_legend_checkbox.checked = hide_legend;

    var background_legend = document.getElementById('background_legend');
    if(hide_legend){
        background_legend.style.display = 'none';
    }
    else {
        background_legend.style.display = 'block';
    }
}
status_legend_checkbox.addEventListener('click', switch_status_legend)
var close_legend_button = document.getElementById('close_legend_button');
close_legend_button.addEventListener('click', switch_status_legend)


//resets the rocket selection to the default, also reset sort and background
function reset_everything(){
    remove_all_rocket();

    for (var i = 0; i < selected_list.length; i++) {
        switch_rocket_status(selected_list[i]);
    }

    sorting_method_dropdown.selectedIndex = 0;
    sorting_method_change();

    background_dropdown.selectedIndex = 0;
    on_background_change();
}
var reset_button = document.getElementById('reset_button');
reset_button.addEventListener('click', reset_everything);



var use_high_res = false;
function on_picture_res_change(){
    use_high_res = !use_high_res;
    update_rockets();
}
var high_res_checkbox = document.getElementById('high_res_checkbox');
high_res_checkbox.addEventListener('click', on_picture_res_change);

//obvious, also adds commas because you're going to get huge numbers with this stupid system
function kg_to_pounds(good_unit){
    var bad_unit = good_unit*2.2046;
    return Math.round(bad_unit).toLocaleString();
}
//raw_payload: payload in kg. outputs a shorter number or a longer one if you like stupid unit systems.
function get_payload(raw_payload){
    if(stupid_unit_system){
        return kg_to_pounds(raw_payload) + 'lb';
    }

    if(raw_payload > 1000){
        return Math.round(raw_payload/1000 * 10) / 10 + 't'
    }
    return raw_payload + 'kg'
}

//returns a useable date strings
function get_date(rocket){
    var date = rocket.date;
    var today = new Date();
    var current_year = today.getFullYear();

    if(date.getFullYear > current_year){
        return date.getFullYear;
    }
    return date.toDateString()
}


//update the description position for all rockets each time a rocket is loaded
//this is because cached rockets finish loading before the position and size of uncached rockets is computed
var loaded_rockets = [];
function on_rocket_load(){
    var curr_id = this.id;
    loaded_rockets.push(curr_id);

    for (var i = 0; i < loaded_rockets.length; i++) {
        var curr_id = loaded_rockets[i];
        var curr_rocket_img = document.getElementById(curr_id);
        var curr_rocket_desc = document.getElementById(curr_id + '_desc');
        var curr_rocket_rect = curr_rocket_img.getBoundingClientRect();

        //rect.left accounts for the scrolling, not element.offsetLeft
        curr_rocket_desc.style.left = curr_rocket_img.offsetLeft + 'px';

        curr_rocket_desc.style.top = curr_rocket_rect.bottom + 'px';
        curr_rocket_desc.style.width = curr_rocket_rect.width + 'px';

        curr_rocket_desc.style.display = 'block';

        if (selected_sorting_args[0] === 'date') {
            var curr_rocket_wrap = document.getElementById(curr_id + '_rocket_wrap');
            if(curr_rocket_wrap.classList.contains('new_decade')){
                var curr_decade_block = document.getElementById(curr_id + '_decade');
                curr_decade_block.style.top = 0;
                curr_decade_block.style.left = curr_rocket_img.offsetLeft + 'px';
                curr_decade_block.style.display = 'block';
            }
        }
        remove_overflow();
    }

    if(loaded_rockets.length === selected_rockets.rockets.length){
        loaded_rockets = [];
    }
}
//place the rockets, resize them and add their description
function update_rockets(){
    var biggest_rocket_height = find_biggest_rocket();
    var rocket_ratio = biggest_rocket_height/100;

    rocket_comp_window.innerHTML = '';

    //sorts the rockets
    selected_rockets.rockets.sort(sort_rockets(selected_sorting_args, use_descending_order));

    var curr_decade = 194;

    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var path = selected_rockets.rockets[i].path;
        var id = get_id(selected_rockets.rockets[i]);

        //creates the image and tags
        var curr_img = new Image()
        curr_img.style.height = selected_rockets.rockets[i].height / rocket_ratio + '%';
        curr_img.className = 'comp_img';
        curr_img.id = id;
        curr_img.alt = selected_rockets.rockets[i].name + ' ' + selected_rockets.rockets[i].version;
        curr_img.title = get_date(selected_rockets.rockets[i]) + ' ' + selected_rockets.rockets[i].cost/1000000 + ' m$';

        //puts the description at the right place
        curr_img.addEventListener('load', on_rocket_load);

        //adds the image in the correct resolution
        var image_path = path;
        if(!use_high_res && selected_rockets.rockets[i].high_res){
            var low_res_path_table = path.split('/');
            low_res_path_table[low_res_path_table.length -1] = 'l-' + low_res_path_table[low_res_path_table.length -1];
            image_path = low_res_path_table.join('/');
        }
        curr_img.src = image_path;

        //places it in the document
        var wrap = document.createElement('div');
        wrap.id = id + '_rocket_wrap';
        wrap.className = 'rocket_wrap';

        //fuck you firefox
        rocket_comp_window_rect = rocket_comp_window.getBoundingClientRect();

        wrap.appendChild(curr_img);

        if (selected_sorting_args[0] === 'date') {
            var decade = Math.floor(selected_rockets.rockets[i].date.getFullYear()/10);
            if(decade > curr_decade){
                curr_decade = decade;
                wrap.className += ' new_decade';
                var curr_decade_block = document.createElement('p');
                curr_decade_block.appendChild(document.createTextNode(curr_decade * 10));
                curr_decade_block.id = id + '_decade';
                curr_decade_block.className = 'decade_block';

                wrap.appendChild(curr_decade_block);
            }
        }

        rocket_comp_window.appendChild(wrap);

        //creates the description
        var desc = document.createElement('div');
        desc.id = id + '_desc';
        desc.className = 'comp_desc';

        if (selected_rockets.rockets[i].country !== 'not_rocket' ) {

            //if USA or Russia, display manufacturer
            if(selected_rockets.rockets[i].country === 'USA' || selected_rockets.rockets[i].country === 'USSR/Russia' || selected_rockets.rockets[i].country === 'Europe' || selected_rockets.rockets[i].country === 'Other'){
                if (i === 0 || selected_rockets.rockets[i].manufacturer !== selected_rockets.rockets[i - 1].manufacturer){
                    desc.appendChild(create_text_node(selected_rockets.rockets[i].manufacturer, 4))
                }
                else {
                    desc.innerHTML += '<h4>&nbsp;</h4>'
                }
            }
            else if (i === 0 || selected_rockets.rockets[i].country !== selected_rockets.rockets[i - 1].country){
                desc.appendChild(create_text_node(selected_rockets.rockets[i].country, 4))
            }
            else {
                desc.innerHTML += '<h4>&nbsp;</h4>'
            }

            desc.appendChild(create_link(selected_rockets.rockets[i].name + ' ' + selected_rockets.rockets[i].version, selected_rockets.rockets[i].wikipedia));

            if(selected_rockets.rockets[i].payload_leo > 0){
                desc.appendChild(create_text_node(get_payload(selected_rockets.rockets[i].payload_leo) + ' (LEO)', 0))
            }
            if(selected_rockets.rockets[i].payload_gto > 0) {
                desc.appendChild(create_text_node(get_payload(selected_rockets.rockets[i].payload_gto) + ' (GTO)', 0))
            }
        }
        else {
            desc.appendChild(create_link(selected_rockets.rockets[i].name, selected_rockets.rockets[i].wikipedia));
        }
        rocket_comp_window.appendChild(desc);
    }

    set_rocket_background();
}



//retun the number of sub-categories present in the category
function sub_categories_in_category(rocket_num, level) {
    var categories = ['manufacturer', 'family', 'name', 'version'];
    var curr_category = json_rockets.rockets[rocket_num][categories[level]];
    var sub_cat_num = 1;
    var curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]

    while (rocket_num < json_rockets.rockets.length && json_rockets.rockets[rocket_num][categories[level]] === curr_category) {
        if(curr_sub != json_rockets.rockets[rocket_num][categories[level + 1]]){
            curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]
            sub_cat_num++;
        }
        rocket_num++;
    }
    return sub_cat_num;
}
//creates add/remove/hide buttons
function create_title_button_group(type, value){
    var title_button_group = document.createElement('div');
    title_button_group.className = 'title_button_group';

    var buttons = ['add', 'remove', 'expand_less'];
    for (var i = 0; i < buttons.length; i++) {
        title_button_group.appendChild(create_title_button(type, value, buttons[i]));
    }

    return title_button_group;
}
//creates a single button
function create_title_button(type, value, action){
    var title_text = '';
    switch (action) {
        case 'add':
            title_text = 'Add all';
            break;
        case 'remove':
            title_text = 'Remove all';
            break;
        case 'expand_less':
            title_text = 'Hide';
            break;
        default:
            break;
    }

    var curr_button = document.createElement('i');
    curr_button.innerHTML = action;
    curr_button.className = 'material-icons';
    curr_button.id = value + '-' + type + '-' + action;
    curr_button.title = title_text;
    curr_button.addEventListener('click', apply_all_rocket_param);
    return curr_button;
}
function apply_all_rocket_param(){
    var table = this.id.split('-');
    var value = table[0];
    var parameter = table[1];
    var action = table[2];

    switch (action) {
        case 'add':
            add_rocket(parameter, value);
            break;
        case 'remove':
            remove_rocket(parameter, value);
            break;
        case 'expand_less':
            hide_rocket_param(this);
            break;
        default:
            break;
    }
}
function hide_rocket_param(obj){
    var selec = obj.parentElement.parentElement.nextSibling;
    var selec_display = window.getComputedStyle(selec).getPropertyValue('display');

    if(selec_display != 'none'){
        selec.style.display = 'none';
        obj.innerHTML = 'expand_more';
        obj.title = 'Show';
    }
    else {
        selec.style.display = 'block';
        obj.innerHTML = 'expand_less';
        obj.title = 'Hide';
    }
}
//creates the rockets checkbox and separator
function create_rocket_checkboxes(){
    object_selection_window.appendChild(create_text_node('Rockets', 2));
    var rockets_selec_div = document.createElement('div');
    rockets_selec_div.id = 'rocket_selection';


    var i = 0;
    while (i < json_rockets.rockets.length) {

        var curr_country = json_rockets.rockets[i].country;
        var curr_country_div = document.createElement('div');
        curr_country_div.className = 'selec_country';
        curr_country_div.id = curr_country + '_selec_country';

        var curr_country_content = document.createElement('div');
        curr_country_content.id = curr_country + '_country_content';


        var curr_country_header = document.createElement('div');
        curr_country_header.className = 'selec_header';

        curr_country_header.appendChild(create_text_node(curr_country, 3));
        curr_country_header.appendChild(create_title_button_group('country', curr_country));

        curr_country_div.appendChild(curr_country_header);


        while (i < json_rockets.rockets.length && json_rockets.rockets[i].country === curr_country) {

            var curr_manufacturer = json_rockets.rockets[i].manufacturer;
            var curr_manufacturer_div = document.createElement('div');
            curr_manufacturer_div.className = 'selec_manufacturer';

            var curr_manufacturer_content = document.createElement('div');
            curr_manufacturer_content.id = curr_manufacturer + '_manufacturer_content';

            if(curr_country === 'USA' || curr_country === 'USSR/Russia' || curr_country === 'Europe' || curr_country === 'Other'){
                var curr_manufacturer_header = document.createElement('div');
                curr_manufacturer_header.className = 'selec_header';

                curr_manufacturer_header.appendChild(create_text_node(curr_manufacturer, 4));
                if(curr_country === 'USA' || curr_country === 'USSR/Russia' || curr_manufacturer === 'ESA'){
                    curr_manufacturer_header.appendChild(create_title_button_group('manufacturer', curr_manufacturer));
                }

                curr_manufacturer_div.appendChild(curr_manufacturer_header);
            }

            while (i < json_rockets.rockets.length && json_rockets.rockets[i].manufacturer === curr_manufacturer){

                var curr_family = json_rockets.rockets[i].family;
                var curr_family_div = document.createElement('div');
                curr_family_div.className = 'selec_family';

                if(sub_categories_in_category(i, 1) > 1){
                    curr_family_div.appendChild(create_text_node(curr_family, 5));
                }

                while (i < json_rockets.rockets.length && json_rockets.rockets[i].family === curr_family){

                    var curr_name = json_rockets.rockets[i].name;
                    var curr_name_div = document.createElement('div');
                    curr_name_div.className = 'selec_name';

                    if(sub_categories_in_category(i, 2) > 1){
                        curr_name_div.appendChild(create_text_node(curr_name, 6));
                    }

                    var curr_checkbox_container = document.createElement('div');
                    curr_checkbox_container.className = 'checkbox_container';

                    while (i < json_rockets.rockets.length && json_rockets.rockets[i].name === curr_name){
                        var curr_id = get_id(json_rockets.rockets[i]);

                        var curr_checkbox = document.createElement('input');
                        curr_checkbox.type = 'checkbox';
                        curr_checkbox.name = curr_id + '_checkbox';
                        curr_checkbox.value = curr_id + '_checkbox';
                        curr_checkbox.id = curr_id + '_checkbox';
                        curr_checkbox.addEventListener('click', switch_rocket_status );

                        var curr_label = document.createElement('label');
                        curr_label.setAttribute('for', curr_id + '_checkbox');
                        curr_label.appendChild(document.createTextNode(json_rockets.rockets[i].name + ' ' + json_rockets.rockets[i].version))

                        var curr_checkbox_wrap = document.createElement('div');
                        curr_checkbox_wrap.className = 'rocket_checkbox';
                        curr_checkbox_wrap.appendChild(curr_checkbox);
                        curr_checkbox_wrap.appendChild(curr_label);

                        curr_checkbox_container.appendChild(curr_checkbox_wrap);

                        i++;
                    }
                    curr_name_div.appendChild(curr_checkbox_container);
                    curr_family_div.appendChild(curr_name_div);
                }
                curr_manufacturer_content.appendChild(curr_family_div);
            }
            curr_manufacturer_div.appendChild(curr_manufacturer_content);

            curr_country_content.appendChild(curr_manufacturer_div);
        }
        curr_country_div.appendChild(curr_country_content);

        rockets_selec_div.appendChild(curr_country_div);
    }

    object_selection_window.appendChild(rockets_selec_div);
}
create_rocket_checkboxes();


function process_parameters(){
    var parameters_rawr = window.location.search;
    var parameters = parameters_rawr.substr(1).split('&');

    var custom_rockets = false;

    for (var i = 0; i < parameters.length; i++) {
        var curr_parameters = parameters[i].split('=')
        var parameter = curr_parameters[0];
        var value = curr_parameters[1];

        var int_value = parseInt(value);

        switch (parameter) {
            case 'sort':
                if(!isNaN(int_value) && int_value < sorting_method_dropdown.options.length){
                    sorting_method_dropdown.selectedIndex = int_value;
                    sorting_method_change();
                }
                break;

            case 'back':
                var background_dropdown = document.getElementById('background_dropdown');
                if(!isNaN(int_value) && int_value < background_dropdown.options.length){
                    background_dropdown.selectedIndex = int_value;
                    on_background_change();
                }
                break;

            case 'imp':
                if(value === '1'){
                    stupid_unit_system = true;
                    imperial_checkbox.checked = true;
                }
                break;

            case 'r':
                var rocket_nums = value.split('+');
                for (var i = 0; i < rocket_nums.length; i++) {
                    if(!isNaN(rocket_nums[i])){
                        custom_rockets = true;
                        var id = get_id(json_rockets.rockets[rocket_nums[i]]);
                        switch_rocket_status(id);
                    }
                }
                break;

            default:
                break;
        }
    }

    if(!custom_rockets){
        for (var i = 0; i < selected_list.length; i++) {
            switch_rocket_status(selected_list[i]);
        }
        return;
    }

    window.history.pushState('object or string', 'Rocket Scale', window.location.href.split('?')[0]);
}


var share_box = document.getElementById('share_box');
var share_link = document.getElementById('share_link');
var share_open = false;

function hide_share(){
    share_box.style.display = 'none';
    share_open = false;
}
var close_share_button = document.getElementById('close_share_button');
close_share_button.addEventListener('click', hide_share)

function copy_share_link(){
    if(document.queryCommandSupported('copy')){
        share_link.focus();
        share_link.select();
        document.execCommand('copy')
        return true;
    }
    return false;
}
var copy_share_button = document.getElementById('copy_share_button');
copy_share_button.addEventListener('click', copy_share_link)

function share(){
    if(share_open){
        hide_share();
        return;
    }

    share_box.style.display = 'inline-block';
    share_open = true;

    var link = window.location.href.split('?')[0];

    var args = '';
    if(sorting_method_dropdown.selectedIndex != 0){
        args += 'sort=' + sorting_method_dropdown.selectedIndex + '&';
    }
    if(background_dropdown.selectedIndex != 0){
        args += 'back=' + background_dropdown.selectedIndex + '&';
    }

    if(selected_rockets.rockets.length > 0){
        args += 'r=';
    }
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        args += find_rocket_num(selected_rockets.rockets[i]) + '+';
    }
    args = args.substring(0, args.length - 1);

    share_link.value = link + '?' + args;
    share_link.focus();
    share_link.select();
}
var share_button = document.getElementById('share_button');
share_button.addEventListener('click', share)



process_parameters();
update_rockets();
update_background_dimensions();

init = false;
