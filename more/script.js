var individual_rocket_source_links = document.getElementsByClassName('rocket_source');

var image_display = document.getElementById('image_display');



function create_source_table(){
    var source_table_body = document.getElementById('source_table_body');
    var curr_row_is_color = false;
    var i = 0;

    while (i < json_rockets.rockets.length) {
        var curr_source = json_rockets.rockets[i].source_text;
        curr_row_is_color = !curr_row_is_color;

        var curr_line = document.createElement('tr');
        if(curr_row_is_color){
            curr_line.className = 'color_row';
        }

        var source_name_cell = document.createElement('td');
        source_name_cell.className = 'source_name';
        if(json_rockets.rockets[i].source_text != 'zzzunknown'){
            source_name_cell.appendChild(create_text_node(json_rockets.rockets[i].source_text, 0))
        }

        var source_links_cell = document.createElement('td');
        source_links_cell.className = 'source_links';

        while (i < json_rockets.rockets.length && json_rockets.rockets[i].source_text === curr_source) {
            var curr_source_link = create_link(json_rockets.rockets[i].name + ' ' + json_rockets.rockets[i].version, json_rockets.rockets[i].source)
            curr_source_link.className = 'rocket_source';
            curr_source_link.id = get_id(json_rockets.rockets[i]);

            source_links_cell.appendChild(curr_source_link);

            i++;
        }

        curr_line.appendChild(source_name_cell);
        curr_line.appendChild(source_links_cell);
        source_table_body.appendChild(curr_line);
    }
}

function show_rocket_display(){
    image_display.src = '../' + find_rocket(this.id).path;
    image_display.style.display = 'block';
}
function hide_rocket_display(){
    image_display.style.display = 'none';
}
function assign_mouseover_to_source_links(){
    for (var i = 0; i < individual_rocket_source_links.length; i++) {
        individual_rocket_source_links[i].addEventListener('mouseover', show_rocket_display)
        individual_rocket_source_links[i].addEventListener('mouseout', hide_rocket_display)
    }
}



function start(){
    json_rockets.rockets.sort(sort_rockets(['source_text', 'country', 'manufacturer', 'family', 'name', 'payload_leo', 'payload_gto', 'version'], false));
    create_source_table();

    assign_mouseover_to_source_links();
}
start();
