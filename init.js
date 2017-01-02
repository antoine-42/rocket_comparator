//init.js
//basic functions and variables that are used in the whole site

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

//height, family, date, payload, cost
var sorting_args = [['height', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['type', 'country', 'manufacturer', 'family', 'name', 'version'],
    ['date', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['payload_leo', 'payload_gto', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['cost', 'type', 'country', 'family', 'manufacturer', 'name', 'version']];

//other stuff
var init = true;
var stupid_unit_system = false;
var enable_dark_theme = false;
var use_high_res = false;
var rocket_comp_height = 86;



//basic functions
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

//detects mobile browsers
function detect_small_browser(){
    if(window.innerWidth <= 900) {
        return true;
    }
    return false;
}

//set cookie name to value
function set_cookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));

    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}
function get_cookie(name) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i <cookies.length; i++) {
        var curr_cookie = cookies[i].split('=');
        var curr_name = curr_cookie[0].split(' ').join('');

        if (curr_name === name) {
            return curr_cookie[1];
        }
    }
    return "";
}
//delete cookie with name
function delete_cookie(name) {
    var d = new Date();
    d.setTime(0);

    document.cookie = name + "=;expires=" + d.toUTCString() + ";path=/";
}

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

    if(link != ''){
        var link_text = document.createElement('a');
        link_text.href = link;
        link_text.appendChild(document.createTextNode(text));

        link_p.appendChild(link_text);
    }
    else {
        link_p.appendChild(document.createTextNode(text));
    }
    return link_p;
}
//takes a rocket, returns an id
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

//sorting stuff
//compare 2 objects
function compare_args(arg1, arg2){
    //string comparison using > and < is fucked up, use this instead
    if(isNaN(arg1)){
        var comp = arg1.localeCompare(arg2);
        return comp;
    }
    if(arg1 != arg2){
        //put -1 last
        if(arg1 === -1){
            return 1;
        }
        else if(arg2 === -1){
            return -1;
        }

        if(arg1 > arg2){
            return 1;
        }
        return -1;
    }
    return 0
}
var use_descending_order = false;
//sorts the rockets according to the arguments in the array args, ascending or descending
function sort_rockets(args, descending){
    return function(a, b){
        var sort_order_mod = 1;
        if(descending){
            sort_order_mod = -1;
        }

        for (var i = 0; i < args.length; i++) {
            var curr_a_arg = a[args[i]];
            var curr_b_arg = b[args[i]];

            curr_comp = compare_args(curr_a_arg, curr_b_arg);
            if(curr_comp != 0){
                return curr_comp * sort_order_mod;
            }
        }

        //if completely equal
        return 0;
    }
}



//loads the stylesheet
function load_stylesheet(source){
    var stylesheet_node = document.createElement('link');
    stylesheet_node.rel = 'stylesheet';
    stylesheet_node.type = 'text/css';
    stylesheet_node.href = source;

    var head_node = document.getElementsByTagName('head')[0];
    head_node.appendChild(stylesheet_node);
}
//unloads the stylesheet
function unload_stylesheet(filename){
    var link_list = document.getElementsByTagName('link');

    for (var i = 0; i < link_list.length; i++) {
        if(link_list[i].getAttribute('href').indexOf(filename) != -1){
            link_list[i].parentNode.removeChild(link_list[i]);
            return;
        }
    }
}



//returns the path to the image with the right resolution
function get_correct_res_path(rocket){
    if(!use_high_res && rocket.high_res){
        var low_res_path_table = rocket.path.split('/');
        low_res_path_table[low_res_path_table.length -1] = 'l-' + low_res_path_table[low_res_path_table.length -1];
        return low_res_path_table.join('/');
    }
    return rocket.path;
}


function get_manufacturer(rocket){
    if(rocket.type === 'Other' || rocket.type === 'Stations' || rocket.country === 'USA' || rocket.country === 'USSR / Russia' || rocket.country === 'Europe' || rocket.country === 'Other'){
        return rocket.manufacturer
    }

    return rocket.country;
}

//obvious, also adds commas because you're going to get huge numbers with this stupid system
function kg_to_pounds(good_unit){
    var bad_unit = good_unit*2.2046;
    return Math.round(bad_unit).toLocaleString();
}
//raw_payload: payload in kg. outputs a shorter number or a longer one if you like stupid unit systems.
function get_payload_string(raw_payload, show_suborbital = false, crew_capsule = false){
    if(raw_payload < 1){
        if(raw_payload === 0 && show_suborbital)
        {
            return 'Suborbital rocket';
        }
        return '';
    }

    if(crew_capsule){
        return 'Crew: ' + raw_payload;
    }

    if(stupid_unit_system){
        return kg_to_pounds(raw_payload) + 'lb';
    }

    if(raw_payload > 1000){
        return Math.round(raw_payload/1000 * 10) / 10 + 't';
    }
    return raw_payload + 'kg';
}

//returns a useable date strings
function get_date_string(rocket){
    var date = rocket.date;
    var date_year = date.getFullYear();

    //default year for very old stuff, date should not be displayed
    if(date_year === 100){
        return '';
    }

    var today = new Date();
    var current_year = today.getFullYear();

    var date_day = date.getDate();
    var date_month = date.getMonth();
    //if date is in future or is january 1st, it is unknown and only year should be displayed
    if(date_year > current_year || (date_day === 1 && date_month === 0)){
        if(rocket.status === 3){
            return 'Never launched';
        }
        return date_year;
    }

    var months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    return months[date_month] + ' ' + date_day + ' ' + date_year;
}

//returns the cost in K/M/B
function get_cost_string(rocket){
    var cost = rocket.cost;
    if(cost === -1){
        return '';
    }

    var mult_array = ['', 'K', ' million', ' billion'];
    var n = 0;

    while (cost > 1000) {
        cost /= 1000;
        n++;
    }

    var cost_string = '$' + cost + mult_array[n];
    return cost_string
}

//returns either the payload to LEO, GTO, or nothing
function get_basic_desc(rocket){
    var payload_to_leo = get_payload_string(rocket.payload_leo);
    if(payload_to_leo != ''){
        return payload_to_leo + ' (LEO)';
    }

    var payload_to_gto = get_payload_string(rocket.payload_gto);
    if(payload_to_gto != ''){
        return payload_to_gto + ' (GTO)';
    }
    return '';
}


//retun the number of sub-categories present in the category
function sub_categories_in_category(rocket_num, level) {
    var categories = ['manufacturer', 'family', 'name', 'version'];
    var curr_category = json_rockets.rockets[rocket_num][categories[level]];
    var sub_categories = 1;
    var curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]

    while (rocket_num < json_rockets.rockets.length && json_rockets.rockets[rocket_num][categories[level]] === curr_category) {
        if(curr_sub != json_rockets.rockets[rocket_num][categories[level + 1]]){
            curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]
            sub_categories++;
        }
        rocket_num++;
    }
    return sub_categories;
}
//retun the number of elements present in the category
function elements_in_category(rocket_num, level) {
    var categories = ['manufacturer', 'family', 'name', 'version'];
    var curr_category = json_rockets.rockets[rocket_num][categories[level]];
    var elements = 1;

    while (rocket_num < json_rockets.rockets.length && json_rockets.rockets[rocket_num][categories[level]] === curr_category) {
        elements++;
        rocket_num++;
    }
    return elements;
}
