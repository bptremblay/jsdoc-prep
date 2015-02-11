
function process(){
    $.getJSON('json/data.json', function(json){
        processSource(json).then(function(json){
            generateDoc(json).then(
                    function(json){
                        update(json);
                    }
            )
        });
    });
}

function update(json){
    $('#input').html(json.input);
    $('#output').html(json.output);
    $('#results').html(json.results);
}

function processSource(json){
    var when = new Promise(function(resolve, reject){
        json.output = json.input.trim().toLowerCase();
        resolve(json);
    });
    return when;
}

function generateDoc(json){
    var when = new Promise(function(resolve, reject){
        json.results ='<h1>dummy</h1>';
        resolve(json);
    });
    return when;
}