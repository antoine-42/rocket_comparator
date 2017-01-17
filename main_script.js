//main_script.js
//functions only used on the main page

//var initialisation
var selected_rockets = JSON.parse('{"rockets" :[]}');

var comp_wrap = document.getElementById('comp_wrap');
var rocket_comp_background = document.getElementById('rocket_comp_background');
var rocket_comp_table = document.getElementById('rocket_comp_table');

var placeholder_img_cell = document.getElementById('placeholder_img_cell');


var settings_window = document.getElementById('settings_window');
var settings_wrap = document.getElementById('settings_wrap');
var settings_form = document.getElementById('settings_form');

var collapse_button = document.getElementById('collapse_button');
var expand_button = document.getElementById('expand_button');
var back_to_top_button = document.getElementById('back_to_top_button');

var sorting_method_dropdown = document.getElementById('sorting_method_dropdown');
var object_selection_window = document.getElementById('object_selection');

//rockets that are selected by default
var selected_list = ['human', 'soyuz2', 'proton-m', 'n1',
    'long-march5', 'sts-atlantis', 'saturn-v', 'block1crew',
    'atlas-v551', 'delta-iv-heavy', 'falcon-heavy1.2', 'its',
    'new-sheppard', 'ariane64', 'ariane5eca'];



//Scroll stuff
//checks if the back to top button should be displayed
function check_if_display_back_to_top_button(){
    if(!detect_small_browser()){
        return;
    }

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
        check_if_display_back_to_top_button();
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

settings_form.addEventListener('scroll', check_if_display_back_to_top_button);


//scroll settings to top
function settings_scroll_to_top(){
    settings_form.scrollTop = 0;
}
back_to_top_button.addEventListener('click', settings_scroll_to_top);



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
function switch_rocket_status(id, set_box) {
    if(typeof id.altKey == 'undefined'){
        rocket_id = id;
    }
    else {
        rocket_id = this.id.split('_')[0];
    }

    if(!check_if_rocket_is_active(rocket_id, true)){
        selected_rockets.rockets.push(find_rocket(rocket_id));
    }
    if(init || set_box === true){
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


//switch settings
var settings_out = true;
function show_settings(){
    settings_window.style.right = '0';
    settings_out = true;

    set_cookie('show_settings', 'true');
}
function hide_settings(){
    settings_window_rect = settings_window.getBoundingClientRect();
    settings_window.style.right = '-' + (settings_window_rect.width +30) + 'px';
    settings_out = false;

    set_cookie('show_settings', 'false');
}
collapse_button.addEventListener('click', hide_settings);
expand_button.addEventListener('click', show_settings);


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
var remove_all_button = document.getElementById('remove_all_button');
remove_all_button.addEventListener('click', remove_all_rocket);

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
var add_all_button = document.getElementById('add_all_button');
add_all_button.addEventListener('click', add_all_rocket);

//add all rockets in json_array to selected_rockets
function add_to_selected_rocket(json_array, add){
    for (var i = 0; i < json_array.rockets.length; i++) {
        var curr_rocket = json_array.rockets[i];

        if(add){
            selected_rockets.rockets.push(curr_rocket);
        }
        else {
            var index = selected_rockets.rockets.indexOf(curr_rocket);
            if (index > -1) {
                selected_rockets.rockets.splice(index, 1);
            }
        }

        force_checkbox(get_id(curr_rocket), add);
    }
    update_rockets();
}



//handles the add/remove button
var add_remove_box = document.getElementById('add_remove_box');
var add_remove_box_title = document.getElementById('add_remove_box_title');
var add_remove_condition_block = document.getElementById('add_remove_condition_block');
var add_remove_condition_dropdown = document.getElementById('add_remove_condition_dropdown');
var add_remove_confirm_button = document.getElementById('add_remove_confirm_button');
var add_remove_list = document.getElementById('add_remove_list');

var add_remove_box_open = false;
var add_remove_function_is_add = true; //true = add, false = remove
var button_word_list = ['Add', 0, 'rocket'];
var active_conditions_list = [];
var temp_selected_objects = JSON.parse('{"rockets" :[]}');
var selected_conditions = [];


function add_remove_open(){
    add_remove_box.style.display = 'inline-block';
    add_remove_box_open = true;

    hide_share();
    close_zoom_image();
}
function add_remove_close(){
    add_remove_box.style.display = 'none';
    add_remove_box_open = false;
}
var close_add_remove_button = document.getElementById('close_add_remove_button');
close_add_remove_button.addEventListener('click', add_remove_close);

function add_remove_switch(){
    if(add_remove_box_open){
        add_remove_close();
    }
    else {
        add_remove_open();
    }
}
var add_remove_button = document.getElementById('add_remove_button');
add_remove_button.addEventListener('click', add_remove_switch);


function set_add_remove_function_add(){
    add_remove_function_is_add = true;
    add_remove_box_title.innerHTML = 'Add';

    button_word_list[0] = 'Add';
    on_condition_change();
}
add_remove_radio_add = document.getElementById('add_remove_radio_add');
add_remove_radio_add.addEventListener('click', set_add_remove_function_add);
function set_add_remove_function_remove(){
    add_remove_function_is_add = false;
    add_remove_box_title.innerHTML = 'Remove';

    button_word_list[0] = 'Remove';
    on_condition_change();
}
add_remove_radio_remove = document.getElementById('add_remove_radio_remove');
add_remove_radio_remove.addEventListener('click', set_add_remove_function_remove);

function switch_add_remove_function(){
    if(add_remove_function_is_add){
        set_add_remove_function_remove();
    }
    else {
        set_add_remove_function_add();
    }
}


var invalid_date = false;
function on_condition_change(){
    condition_comp_min_array = document.getElementsByClassName('condition_comp_min');
    condition_comp_max_array = document.getElementsByClassName('condition_comp_max');
    condition_dropdown_array = document.getElementsByClassName('condition_dropdown');

    conditions = [[]];
    //conditions = [[param1, value1], [param2, min2, max2]];

    //extract conditions
    for (var i = 0; i < condition_dropdown_array.length; i++) {
        curr_dropdown = condition_dropdown_array[i];
        curr_parameter = curr_dropdown.id.split('|')[1]
        curr_value = curr_dropdown.options[curr_dropdown.selectedIndex].value;

        var curr_conditions = [curr_parameter, curr_value];

        conditions.push(curr_conditions)
    }

    for (var i = 0; i < condition_comp_min_array.length; i++) {
        curr_min = condition_comp_min_array[i];
        curr_max = condition_comp_max_array[i];

        curr_parameter = curr_min.id.split('|')[0]

        curr_min_value = curr_min.value;
        curr_max_value = curr_max.value;

        invalid_date = false;
        if(curr_parameter === 'date'){
            curr_min_value = new Date(curr_min_value);
            curr_max_value = new Date(curr_max_value);

            if(isNaN(curr_min_value.getTime()) || isNaN(curr_max_value.getTime())){
                invalid_date = true;
                //SHOW ERROR SOMEWHERE
            }
        }
        if(curr_parameter === 'cost'){
            curr_min_value = curr_min_value * 1000000;
            curr_max_value = curr_max_value * 1000000;
        }
        if(curr_parameter === 'payload_leo' || curr_parameter === 'payload_gto'){
            curr_min_value = curr_min_value * 1000;
            curr_max_value = curr_max_value * 1000;
        }

        if(!invalid_date){
            var curr_conditions = [curr_parameter, curr_min_value, curr_max_value];
            conditions.push(curr_conditions)
        }
    }

    //don't need the first empty list
    conditions.shift();
    //call the function that will add all the rockets that fit that into a new array
    temp_selected_objects = get_rockets_multiple_param(conditions, add_remove_function_is_add);

    //display this shit
    button_word_list[1] = temp_selected_objects.rockets.length;
    button_word_list[2] = (temp_selected_objects.rockets.length > 1)? 'rockets': 'rocket';
    button_words_change();
}


function condition_remove(){
    var condition = this.id.split('|')[0];
    var condition_div = document.getElementById(condition + '|add_remove_condition');
    condition_div.remove();

    on_condition_change();
}


function get_all_values_of_parameter(parameter, search_only_in_rockets = true){
    var values = [];
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if(!search_only_in_rockets || (search_only_in_rockets && json_rockets.rockets[i].type === 'Rockets')){
            var curr_value = json_rockets.rockets[i][parameter];
            if(values.indexOf(curr_value) < 0){
                values.push(curr_value);
            }
        }
    }
    return values;
}
function add_remove_add_condition(){
    var condition = add_remove_condition_dropdown.options[add_remove_condition_dropdown.selectedIndex].value;

    if(selected_conditions.indexOf(condition) >= 0){
        return;
        //SHOW ERROR SOMEWHERE
    }
    selected_conditions.push(condition);

    var condition_div = document.createElement('div');
    condition_div.id = condition + '|add_remove_condition';
    condition_div.className = 'selec_div';

    var comp = false;
    switch (condition) {
        case 'status':
        case 'payload_type':
        case 'type':
            var values = get_all_values_of_parameter(condition, false);
            break;

        case 'country':
        case 'manufacturer':
        case 'family':
            var values = get_all_values_of_parameter(condition);
            break;

        case 'date':
        case 'height':
        case 'payload_leo':
        case 'payload_gto':
        case 'cost':
            comp = true;
            break;

        default:
            break;
    }
    condition_div.appendChild(create_text_node(add_remove_condition_dropdown.options[add_remove_condition_dropdown.selectedIndex].innerHTML, 0, 'add_remove_condition_first_col'))
    if(comp){
        condition_div.appendChild(create_text_node(' between', 0))

        var input_type = (condition === 'date')? 'date': 'number';

        var condition_comp_min = document.createElement('input');
        condition_comp_min.type = input_type;
        if(condition != 'date'){
            condition_comp_min.min = 0;
            condition_comp_min.value = 0;
        }
        condition_comp_min.id = condition + '|min';
        condition_comp_min.className = 'condition_comp_min';
        condition_comp_min.addEventListener('change', on_condition_change)
        condition_div.appendChild(condition_comp_min);

        condition_div.appendChild(create_text_node('and', 0))

        var condition_comp_max = document.createElement('input');
        condition_comp_max.type = input_type;
        if(condition != 'date'){
            condition_comp_max.min = 0;
            condition_comp_max.value = 0;
        }
        condition_comp_max.id = condition + '|max';
        condition_comp_max.className = 'condition_comp_max';
        condition_comp_max.addEventListener('change', on_condition_change)
        condition_div.appendChild(condition_comp_max);


    }
    else {
        var condition_dropdown = document.createElement('select');
        condition_dropdown.id = 'add_remove_dropdown|' + condition;
        condition_dropdown.className = 'condition_dropdown';
        condition_dropdown.addEventListener('change', on_condition_change)

        for (var i = 0; i < values.length; i++) {
            var curr_value = values[i];
            var curr_value_option = document.createElement('option');

            curr_value_option.value = curr_value;
            curr_value_option.innerHTML = curr_value;

            condition_dropdown.appendChild(curr_value_option);
        }
        condition_div.appendChild(condition_dropdown)
    }

    var close_condition_button = document.createElement('i');
    close_condition_button.id = condition + '|remove_add_remove_condition';
    close_condition_button.className = 'material-icons remove_condition';
    close_condition_button.innerHTML = 'close';
    close_condition_button.addEventListener('click', condition_remove);
    condition_div.appendChild(close_condition_button)

    add_remove_condition_block.appendChild(condition_div);
    on_condition_change();
}
var confirm_add_condition_button = document.getElementById('confirm_add_condition_button');
confirm_add_condition_button.addEventListener('click', add_remove_add_condition);


function button_words_change(){
    add_remove_confirm_button.innerHTML = button_word_list.join(' ');
}

function on_add_remove_confirm(){
    add_to_selected_rocket(temp_selected_objects, add_remove_function_is_add);
}
add_remove_confirm_button.addEventListener('click', on_add_remove_confirm)



//sorting stuff
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



//dark theme switch
function dark_theme_switch(){
    enable_dark_theme = !enable_dark_theme;

    if(enable_dark_theme){
        load_stylesheet('dark-theme.css');
        set_cookie('theme', 'dark');
    }
    else {
        unload_stylesheet('dark-theme.css');
        set_cookie('theme', 'light');
    }
    update_background_scale();
    set_rocket_background();
}
var dark_theme_checkbox = document.getElementById('dark_theme_checkbox');
dark_theme_checkbox.addEventListener('click', dark_theme_switch);



var imperial_checkbox = document.getElementById('imperial_checkbox');
imperial_checkbox.addEventListener('click', unit_system_check);
function unit_system_check(){
    stupid_unit_system = imperial_checkbox.checked;
    set_cookie('imp', stupid_unit_system + '')
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
    window_height = window.innerHeight/100 * rocket_comp_height;

    rocket_comp_background.width = window_width;
    rocket_comp_background.height = window_height + 1;

    update_background_scale();
}
function update_background_dimensions(){
    window_width = document.body.clientWidth;
    window_height = window.innerHeight/100 * rocket_comp_height;

    rocket_comp_background.width = window_width;
    rocket_comp_background.height = window_height + 1;

    update_background_scale();
    if(!init){
        update_rockets();

        if(!settings_out){
            hide_settings();
        }
    }
}
window.onresize = update_background_dimensions;

var hide_legend = false;
var selected_background = 'default';
var background_dropdown = document.getElementById('background_dropdown');
function on_background_change(){
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

    var status_legend_checkbox_wrap = document.getElementById('status_legend_checkbox_wrap');
    status_legend_checkbox_wrap.style.display = 'none';


    unload_stylesheet('background_status_dark.css');
    unload_stylesheet('background_status_light.css');
}
//sets the background to rocket status
function set_background_status(){
    if(!hide_legend){
        var background_legend = document.getElementById('background_legend');
        background_legend.style.display = 'block';
    }

    var status_legend_checkbox_wrap = document.getElementById('status_legend_checkbox_wrap');
    status_legend_checkbox_wrap.style.display = 'inline-block';


    if(enable_dark_theme){
        load_stylesheet('background_status_dark.css');
    }
    else {
        load_stylesheet('background_status_light.css');
    }
}
background_dropdown.addEventListener('change', on_background_change);

var status_legend_checkbox = document.getElementById('status_legend_checkbox');
//switch legend status
function switch_status_legend(){
    hide_legend = !hide_legend;
    status_legend_checkbox.checked = hide_legend;

    set_cookie('hide_legend', 'true');

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


var selected_description = 'basic';
var description_dropdown = document.getElementById('description_dropdown');
function on_description_change(){
    selected_description = description_dropdown.options[description_dropdown.selectedIndex].value;

    set_cookie('description', description_dropdown.selectedIndex);
    set_description(true)
}
//updates the background of the rocket comparison
function set_description(update){
    switch (selected_description) {
        case 'basic':
            rocket_manufacturer_row.style.display = 'table-row';
            rocket_name_row.style.display = 'table-row';
            rocket_date_row.style.display = 'none';
            rocket_payload_leo_row.style.display = 'none';
            rocket_payload_gto_row.style.display = 'none';
            rocket_cost_row.style.display = 'none';
            basic_row.style.display = 'table-row';

            rocket_comp_height = 91.70302 + (36.07096 - 91.70302)/(1 + Math.pow((window.innerHeight/529.4911), 2.370563));
            /*data points used for the above equation, thanks to www.mycurvefit.com
            if(window.innerHeight > 1300){
                rocket_comp_height = 86;
            }
            else if(window.innerHeight > 1100){
                rocket_comp_height = 83;
            }
            else if(window.innerHeight > 750){
                rocket_comp_height = 75;
            }
            else if(window.innerHeight > 550){
                rocket_comp_height = 65;
            }
            else if(window.innerHeight > 400){
                rocket_comp_height = 55;
            }
            else if(window.innerHeight > 0){
                rocket_comp_height = 40;
            }*/
            var rocket_comp_cell_array = document.getElementsByClassName('rocket_comp_cell');
            for(i = 0; i < rocket_comp_cell_array.length; i++) {
                rocket_comp_cell_array[i].style.height = rocket_comp_height + 'vh';
            }
            break;
        case 'full':
            rocket_manufacturer_row.style.display = 'table-row';
            rocket_name_row.style.display = 'table-row';
            rocket_date_row.style.display = 'table-row';
            rocket_payload_leo_row.style.display = 'table-row';
            rocket_payload_gto_row.style.display = 'table-row';
            rocket_cost_row.style.display = 'table-row';
            basic_row.style.display = 'none';

            rocket_comp_height = 80.78716 + (-3.626785 - 80.78716)/(1 + Math.pow((window.innerHeight/516.6534), 2.746105));
            /*
            if(window.innerHeight > 1300){
                rocket_comp_height = 75;
            }
            else if(window.innerHeight > 1050){
                rocket_comp_height = 70;
            }
            else if(window.innerHeight > 900){
                rocket_comp_height = 65;
            }
            else if(window.innerHeight > 775){
                rocket_comp_height = 60;
            }
            else if(window.innerHeight > 690){
                rocket_comp_height = 55;
            }
            else if(window.innerHeight > 525){
                rocket_comp_height = 40;
            }
            else if(window.innerHeight > 450){
                rocket_comp_height = 30;
            }
            else if(window.innerHeight > 300){
                rocket_comp_height = 12;
            }
            else if(window.innerHeight > 0){
                rocket_comp_height = 0;
            }*/
            var rocket_comp_cell_array = document.getElementsByClassName('rocket_comp_cell');
            for(i = 0; i < rocket_comp_cell_array.length; i++) {
                rocket_comp_cell_array[i].style.height = rocket_comp_height + 'vh';
            }
            placeholder_img_cell.style.height = rocket_comp_height + 'vh';
            break;
        case 'none':
            rocket_manufacturer_row.style.display = 'none';
            rocket_name_row.style.display = 'none';
            rocket_date_row.style.display = 'none';
            rocket_payload_leo_row.style.display = 'none';
            rocket_payload_gto_row.style.display = 'none';
            rocket_cost_row.style.display = 'none';
            basic_row.style.display = 'none';

            rocket_comp_height = 97;
            var rocket_comp_cell_array = document.getElementsByClassName('rocket_comp_cell');
            for(i = 0; i < rocket_comp_cell_array.length; i++) {
                rocket_comp_cell_array[i].style.height = rocket_comp_height + 'vh';
            }
            break;
        default:
            break;
    }
    if(update){
        update_background_dimensions();
    }
    else {
        update_background_dimensions_2();
    }
}
description_dropdown.addEventListener('change', on_description_change);


//resets the rocket selection to the default, also reset sort and background
function reset_everything(){
    remove_all_rocket();

    for (var i = 0; i < selected_list.length; i++) {
        switch_rocket_status(selected_list[i], true);
    }

    sorting_method_dropdown.selectedIndex = 0;
    sorting_method_change();

    background_dropdown.selectedIndex = 0;
    on_background_change();

    if(use_descending_order){
        on_sorting_order_change();
        descending_sort_checkbox.checked = use_descending_order;
    }
}
var reset_button = document.getElementById('reset_button');
reset_button.addEventListener('click', reset_everything);



function on_picture_res_change(){
    use_high_res = !use_high_res;
    set_cookie('high_res', use_high_res + '')
    update_rockets();
}
var high_res_checkbox = document.getElementById('high_res_checkbox');
high_res_checkbox.addEventListener('click', on_picture_res_change);

function clear_img_table(){

    rocket_img_row.innerHTML = '<th id="placeholder_img_cell" class="rocket_comp_cell"></th>';
    rocket_manufacturer_row.innerHTML = '<th></th>';
    rocket_name_row.innerHTML = '<th></th>';
    rocket_date_row.innerHTML = '<th>First launch date</th>';
    rocket_payload_leo_row.innerHTML = '<th>Payload to <a href="https://en.wikipedia.org/wiki/Low_Earth_orbit">LEO</a>';
    rocket_payload_gto_row.innerHTML = '<th>Payload to <a href="https://en.wikipedia.org/wiki/Geostationary_transfer_orbit">GTO</a>';
    rocket_cost_row.innerHTML = '<th>Launch cost</th>';
    basic_row.innerHTML = '<th>Payload</th>';
}
//place the rockets, resize them and add their description
function update_rockets(){
    clear_img_table();

    var biggest_rocket_height = find_biggest_rocket();
    var rocket_ratio = biggest_rocket_height/100;

    //sorts the rockets
    selected_rockets.rockets.sort(sort_rockets(selected_sorting_args, use_descending_order));

    var curr_decade = 194;

    var curr_manufacturer_cell_number = 1;
    var curr_manufacturer_cell;
    var curr_manufacturer = 'NONE';

    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        var curr_rocket = selected_rockets.rockets[i];
        var path = curr_rocket.path;
        var id = get_id(curr_rocket);

        var rocket_img_cell = document.createElement('td');
        rocket_img_cell.id = id + '_img_cell';
        rocket_img_cell.className = 'rocket_comp_cell';
        switch (curr_rocket.status) {
            case 'Active':
                rocket_img_cell.className += ' active_rocket_cell';
                break;
            case 'Retired':
                rocket_img_cell.className += ' retired_rocket_cell';
                break;
            case 'In Development':
                rocket_img_cell.className += ' dev_rocket_cell';
                break;
            case 'Cancelled':
                rocket_img_cell.className += ' cancelled_rocket_cell';
                break;
            default:
                break;
        }

        //creates the image and tags
        var curr_img = new Image();
        curr_img.style.height = curr_rocket.height / rocket_ratio + '%';
        curr_img.className = 'comp_img';
        curr_img.id = id;
        curr_img.alt = get_full_name(curr_rocket);
        curr_img.addEventListener('click', open_zoom_image);

        //adds the image in the correct resolution
        var image_path = get_correct_res_path(curr_rocket);
        curr_img.src = image_path;

        if (selected_sorting_args[0] === 'date') {
            var decade = Math.floor(curr_rocket.date.getFullYear()/10);
            if(decade != curr_decade && decade > 194){
                curr_decade = decade;
                rocket_img_cell.className += ' new_decade';

                var curr_decade_block = document.createElement('p');
                curr_decade_block.appendChild(document.createTextNode(curr_decade * 10));
                curr_decade_block.id = id + '_decade';
                curr_decade_block.className = 'decade_block';
                curr_decade_block.left = curr_img.offsetLeft;

                rocket_img_cell.appendChild(curr_decade_block);
            }
        }

        rocket_img_cell.appendChild(curr_img);
        rocket_img_row.appendChild(rocket_img_cell);

        //creates the description
        //manufacturer

        var last_manufacturer = curr_manufacturer;
        curr_manufacturer = get_manufacturer(curr_rocket);

        if(curr_manufacturer != last_manufacturer){
            var manufacturer_cell = document.createElement('td');
            manufacturer_cell.id = id + '_manufacturer_cell';
            manufacturer_cell.appendChild(create_text_node(curr_manufacturer, 4));
            rocket_manufacturer_row.appendChild(manufacturer_cell);

            curr_manufacturer_cell = manufacturer_cell;
            curr_manufacturer_cell_number = 1;
        }
        else {
            curr_manufacturer_cell_number++;
            curr_manufacturer_cell.colSpan = "" + curr_manufacturer_cell_number;
        }

        //name
        var name_cell = document.createElement('td');
        name_cell.id = id + '_manufacturer_cell';
        name_cell.appendChild(create_link(get_full_name(curr_rocket), curr_rocket.wikipedia));
        rocket_name_row.appendChild(name_cell);

        //date
        var date_cell = document.createElement('td');
        date_cell.id = id + '_date_cell';
        date_cell.appendChild(document.createTextNode(get_date_string(curr_rocket)));
        rocket_date_row.appendChild(date_cell);

        //payload to LEO
        var payload_leo_cell = document.createElement('td');
        payload_leo_cell.id = id + '_payload_leo_cell';
        payload_leo_cell.appendChild(document.createTextNode(get_payload_cell(curr_rocket, 'leo')));
        rocket_payload_leo_row.appendChild(payload_leo_cell);

        //payload to GTO
        var payload_gto_cell = document.createElement('td');
        payload_gto_cell.id = id + '_payload_gto_cell';
        payload_gto_cell.appendChild(document.createTextNode(get_payload_cell(curr_rocket, 'gto')));
        rocket_payload_gto_row.appendChild(payload_gto_cell);

        //cost
        var cost_cell = document.createElement('td');
        cost_cell.id = id + '_cost_cell';
        cost_cell.appendChild(document.createTextNode(get_cost_string(curr_rocket)));
        rocket_cost_row.appendChild(cost_cell);

        //basic description
        var basic_cell = document.createElement('td');
        basic_cell.id = id + '_basic_cell';
        basic_cell.appendChild(document.createTextNode(get_payload_cell(curr_rocket, 'basic')));
        basic_row.appendChild(basic_cell);
    }

    set_description(false);

    //if the add/remove box is open, the selected rockets need to be updated
    if(add_remove_box_open){
        on_condition_change();
    }
}


var image_zoom_box = document.getElementById('image_zoom_box');
var image_zoom = document.getElementById('image_zoom');
var image_zoom_open = false;
function open_zoom_image(e){
    var id;
    if(e === undefined || e.target){
        id = this.id;
    }
    else {
        id = e;
    }

    if(image_zoom_open && image_zoom.alt.split(' ')[0] === id){
        image_zoom.alt = 'rocket image zoom';
        close_zoom_image();
        return;
    }

    var rocket = find_rocket(id);

    image_zoom.alt = id + ' image zoom';
    image_zoom.src = get_correct_res_path(rocket);
    rocket_zoom_name.innerHTML = get_full_name(rocket);
    image_zoom_box.style.display = 'inline-block';

    //we want the true size, not the viewport for this
    var ratio = window.devicePixelRatio || 1;
    var device_width = document.body.clientWidth * ratio;
    alert('viewport: ' + document.body.clientWidth + ' ratio: ' + ratio + ' device: ' + device_width)

    if(image_zoom_box.clientWidth > device_width){
        image_zoom_box.style.height = 'auto';
        image_zoom_box.style.width = '100%';

        image_zoom.style.height = 'auto';
        image_zoom.style.width = '100%';
    }
    else {
        image_zoom_box.style.height = '';
        image_zoom_box.style.width = '';

        image_zoom.style.height = '';
        image_zoom.style.width = '';
    }

    if(image_zoom_box.clientWidth + rocket_zoom_name.clientWidth > device_width){
        rocket_zoom_name.style.top = '10px';
        rocket_zoom_name.style.left = '0';
    }
    else {
        rocket_zoom_name.style.top = '';
        rocket_zoom_name.style.left = '';
    }

    image_zoom_open = true;
    add_remove_close();
    hide_share();
}
function close_zoom_image(){
    image_zoom_box.style.display = 'none';
    image_zoom_open = false;
}
image_zoom_box.addEventListener('click', close_zoom_image);



//creates add/remove/hide buttons
function create_title_header(type, value, show_buttons){
    var level = 4;
    switch (type) {
        case 'type':
            level = 2;
            break;
        case 'country':
            level = 3;
            break;
        case 'manufacturer':
            level = 4;
            break;
        default:
            break;
    }

    var curr_header = document.createElement('div');
    curr_header.className = 'selec_header';
    curr_header.appendChild(create_text_node(value, level));

    if(show_buttons){
        var title_button_group = document.createElement('div');
        title_button_group.className = 'title_button_group selec_header_' + type;

        var buttons = ['add', 'remove', 'expand_less'];
        for (var i = 0; i < buttons.length; i++) {
            title_button_group.appendChild(create_title_button(type, value, buttons[i]));
        }

        curr_header.appendChild(title_button_group);
    }

    return curr_header;
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

    if(action = 'expand_less'){
        curr_button.style.transform = 'rotate(180deg)';
    }
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
            if(this.title === 'Show'){
                this.style.transform = 'rotate(90deg)';
            }
            else {
                this.style.transform = 'rotate(180deg)';
            }

            break;
        default:
            break;
    }
}
//hide the checkboxes associed to this
function hide_rocket_param(obj){

    var selec = obj.parentElement.parentElement.nextSibling;
    var selec_display = window.getComputedStyle(selec).getPropertyValue('display');

    if(selec_display != 'none'){
        selec.style.display = 'none';
        obj.title = 'Show';
    }
    else {
        selec.style.display = 'block';
        obj.title = 'Hide';
    }
}
//creates the rockets checkbox and separator
function create_rocket_checkboxes(){
    var i = 0;

    while (i < json_rockets.rockets.length) {
        var curr_type = json_rockets.rockets[i].type;
        var curr_type_div = document.createElement('div');
        curr_type_div.className = 'selec_type';
        curr_type_div.id = curr_type + '_selec_type';

        var curr_type_content = document.createElement('div');
        curr_type_content.id = curr_type + '_type_content';
        if(curr_type != 'Rockets'){
            curr_type_content.className = 'not_Rockets_type_content';
        }

        curr_type_div.appendChild(create_title_header('type', curr_type, true));


        if(curr_type != 'Rockets'){
            while (i < json_rockets.rockets.length && json_rockets.rockets[i].type === curr_type) {
                var curr_rocket = json_rockets.rockets[i]
                var curr_id = get_id(curr_rocket);

                var curr_checkbox = document.createElement('input');
                curr_checkbox.type = 'checkbox';
                curr_checkbox.name = curr_id + '_checkbox';
                curr_checkbox.value = curr_id + '_checkbox';
                curr_checkbox.id = curr_id + '_checkbox';
                curr_checkbox.addEventListener('click', switch_rocket_status );

                var curr_label = document.createElement('label');
                curr_label.appendChild(curr_checkbox);
                curr_label.appendChild(document.createTextNode(get_full_name(curr_rocket)));

                var curr_checkbox_wrap = document.createElement('div');
                curr_checkbox_wrap.className = 'rocket_checkbox';
                curr_checkbox_wrap.appendChild(curr_label);

                curr_type_content.appendChild(curr_checkbox_wrap);

                i++;
            }
        }


        while (i < json_rockets.rockets.length && json_rockets.rockets[i].type === curr_type) {

            var curr_country = json_rockets.rockets[i].country;
            var curr_country_div = document.createElement('div');
            curr_country_div.className = 'selec_country';
            curr_country_div.id = curr_country + '_selec_country';

            var curr_country_content = document.createElement('div');
            curr_country_content.id = curr_country + '_country_content';

            curr_country_div.appendChild(create_title_header('country', curr_country, true));

            while (i < json_rockets.rockets.length && json_rockets.rockets[i].country === curr_country) {

                var curr_manufacturer = json_rockets.rockets[i].manufacturer;
                var curr_manufacturer_div = document.createElement('div');
                curr_manufacturer_div.className = 'selec_manufacturer';

                var curr_manufacturer_content = document.createElement('div');
                curr_manufacturer_content.id = curr_manufacturer + '_manufacturer_content';
                curr_manufacturer_content.className = 'selec_manufacturer_content';

                if(curr_country === 'USA' || curr_country === 'USSR / Russia' || curr_country === 'Europe' || curr_country === 'Other'){
                    var show_buttons = false;
                    if(curr_country === 'USA' || curr_country === 'USSR / Russia' || curr_manufacturer === 'ESA'){
                        show_buttons = true;
                    }

                    curr_manufacturer_div.appendChild(create_title_header('manufacturer', curr_manufacturer, show_buttons));
                }

                while (i < json_rockets.rockets.length && json_rockets.rockets[i].manufacturer === curr_manufacturer){

                    var curr_family = json_rockets.rockets[i].family;
                    var curr_family_div = document.createElement('div');
                    curr_family_div.className = 'selec_family';

                    if(elements_in_category(i, 1) > 0){
                        curr_family_div.appendChild(create_text_node(curr_family, 5));
                    }

                    while (i < json_rockets.rockets.length && json_rockets.rockets[i].family === curr_family){

                        var curr_name = json_rockets.rockets[i].name;
                        var curr_name_div = document.createElement('div');
                        curr_name_div.className = 'selec_name';

                        while (i < json_rockets.rockets.length && json_rockets.rockets[i].name === curr_name){
                            var curr_rocket = json_rockets.rockets[i]
                            var curr_id = get_id(curr_rocket);

                            var curr_checkbox = document.createElement('input');
                            curr_checkbox.type = 'checkbox';
                            curr_checkbox.name = curr_id + '_checkbox';
                            curr_checkbox.value = curr_id + '_checkbox';
                            curr_checkbox.id = curr_id + '_checkbox';
                            curr_checkbox.addEventListener('click', switch_rocket_status);

                            var curr_label = document.createElement('label');
                            curr_label.appendChild(curr_checkbox);
                            curr_label.appendChild(document.createTextNode(get_full_name(curr_rocket)));

                            var curr_checkbox_wrap = document.createElement('div');
                            curr_checkbox_wrap.className = 'rocket_checkbox';
                            curr_checkbox_wrap.appendChild(curr_label);

                            curr_name_div.appendChild(curr_checkbox_wrap);

                            i++;
                        }
                        curr_family_div.appendChild(curr_name_div);
                    }
                    curr_manufacturer_content.appendChild(curr_family_div);
                }
                curr_manufacturer_div.appendChild(curr_manufacturer_content);

                curr_country_content.appendChild(curr_manufacturer_div);
            }
            curr_country_div.appendChild(curr_country_content);

            curr_type_content.appendChild(curr_country_div);
        }
        curr_type_div.appendChild(curr_type_content);

        object_selection_window.appendChild(curr_type_div);
    }
}
create_rocket_checkboxes();



var custom_rockets = false;
//handles the parameter
function handle_parameter(name, value){
    var int_value = parseInt(value);
    switch (name) {
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

        case 'show_settings':
            if(value === 'true'){
                show_settings();
            }
            else if(value === 'false'){
                hide_settings();
            }
            break;

        case 'sort':
            if(!isNaN(int_value) && int_value < sorting_method_dropdown.options.length){
                sorting_method_dropdown.selectedIndex = int_value;
                sorting_method_change();
            }
            break;
        case 'desc':
            if(value === 'true'){
                on_sorting_order_change();
                descending_sort_checkbox.checked = use_descending_order;
            }
            break;

        case 'back':
            if(!isNaN(int_value) && int_value < background_dropdown.options.length){
                background_dropdown.selectedIndex = int_value;
                on_background_change();
            }
            break;
        case 'hide_legend':
            if(value === 'true'){
                switch_status_legend();
            }
            break;

        case 'description':
            if(!isNaN(int_value) && int_value < description_dropdown.options.length){
                description_dropdown.selectedIndex = int_value;
                on_description_change();
            }
            break;

        case 'imp':
            if(value === 'true'){
                imperial_checkbox.checked = true;
                stupid_unit_system = true
            }
            break;

        case 'theme':
            if(value === 'dark'){
                dark_theme_switch();
                dark_theme_checkbox.checked = true;
            }
            break;

        case 'high_res':
            if(value === 'true'){
                on_picture_res_change();
                high_res_checkbox.checked = true;
            }
            break;

        default:
            break;
    }
}
//get the parameters name and value il list and apply handle_parameter to them
function process_parameter_list(list){
    for (var i = 0; i < list.length; i++) {
        var curr_parameters = list[i].split('=');
        var parameter = curr_parameters[0].split(' ').join('');
        var value = curr_parameters[1];

        handle_parameter(parameter, value);
    }
}
//loads and handles cookies and GET arg
function load_settings(){
    //GET args processing
    var parameters_rawr = window.location.search;
    var parameters = parameters_rawr.substr(1).split('&');
    process_parameter_list(parameters);

    //cookies processing
    var cookies = document.cookie.split(';');
    process_parameter_list(cookies);

    //if no rocket ara loaded during loading, load the default ones.
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

    add_remove_close();
    close_zoom_image();

    share_box.style.display = 'inline-block';
    share_open = true;

    var link = window.location.href.split('?')[0];

    var args = '';
    if(sorting_method_dropdown.selectedIndex != 0){
        args += 'sort=' + sorting_method_dropdown.selectedIndex + '&';
    }
    if(descending_sort_checkbox.checked){
        args += 'desc=true&';
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



function on_keypress(e){
    e = e || window.event;

    var escape = false;
    if ("key" in e) {
        escape = (e.key === "Escape" || e.key === "Esc");
    } else {
        escape = (e.keyCode === 27);
    }

    if (escape){
        if(share_open){
            hide_share();
        }
        else if(add_remove_box_open) {
            add_remove_close();
        }
        else if(image_zoom_open) {
            close_zoom_image();
        }
        else if(settings_out) {
            hide_settings();
        }
    }
}
window.addEventListener('keydown', on_keypress);



function init(){
    load_settings();
    update_rockets();
    update_background_dimensions();

    console.log('Rocket Comparator, made by Antoine Dujardin.\nGithub: https://github.com/antoine-42/rocket_scale');
}
init();

init = false;
