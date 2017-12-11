undex.UI = function() {
    var LABELS = {
        'atm':               'ATMs',
        'bar':               'Bars',
        'electronics_store': 'Electronics Stores',
        'place_of_worship':  'Places of Worship',
        'point_of_interest': 'Landmarks',
        'bank':              'Banks',
        'food':              'Food',
        'store':             'Stores',
        'establishment':     'Hotels',
        'restaurant':        'Restaurant',
        'movie_theater':     'Theatres',
        'museum':            'Museums',
        'park':              'Parks',
        'university':        'University Buildings',
    };
    var results = 0;
    var cursor = 0;

    $('#prev').click(() => {
        if (results == 0 || cursor == 0) return;
        cursor = (cursor - 1) % results;
        $('#cursor').text(cursor+1);
        undex.globals.map.centerAtSolution(cursor);
    });

    $('#next').click(() => {
        if (results == 0) return;
        cursor = (cursor + 1) % results;
        $('#cursor').text(cursor+1);
        undex.globals.map.centerAtSolution(cursor);
    });

    function updateCursor(places) {
        cursor = 0;
        results = places.length;
        $('#cursor').text(1);
        $('#num-results').text(places.length);
        undex.globals.map.centerAtSolution(0);
    }

    function getAvailableIds() {
        return Object.keys(LABELS)
            .filter(id => ($('input[data-attr='+id+']').length == 0));
    }

    function addInputRow() {
        var availableIds = getAvailableIds();
        if (availableIds.length == 0) {
            return;
        }

        var first = availableIds[0];
        var input = $('<input>', {type: 'number', step: 'any', 'data-attr': first, 'data-confirmed': 0});
        var select = $('<select>');
        availableIds.forEach(function(id) {
            select.append($('<option>', {'data-attr': id})
                .text(LABELS[id]));
        });

        select.change(function(e) {
            var id = $(e.target.options[e.target.selectedIndex]).attr('data-attr');
            input.attr('data-attr', id);
            undex.globals.map.show(id);
        });

        var view = $('<input>', {type: 'checkbox'});
        view.change(function(e) {
            var id = input.attr('data-attr');
            e.target.checked
                ? undex.globals.map.show(id)
                : undex.globals.map.hide(id);
        });

        var addBtn = $('<button>').text('+');
        addBtn.one('click', function() {
            var id = input.attr('data-attr');
            select.children('option').each(function() {
                var $op = $(this);
                if ($op.attr('data-attr') !== id) {
                    $op.remove();
                }
            });
            input.attr('data-confirmed', '1');
            addBtn.text('-');
            addBtn.one('click', function() {
                var select = $('#constraints').last().find('select');
                select.append($('<option>', {'data-attr': id}).text(LABELS[id]));
                div.remove();
            });
            addInputRow();
        });

        var div = $('<div>')
            .append(input)
            .append(select)
            .append(view)
            .append(addBtn);
        $('#constraints').append(div);
    }

    addInputRow();

    $('#submit').click(() => {
        var query = {};
        $('input[data-confirmed=1]').each(function() {
            var $el = $(this);
            query[$el.attr('data-attr')] = parseFloat($el.val());
        });
        $.ajax({
            type: 'POST',
            url:  '/query',
            data: JSON.stringify(query),
            contentType: 'application/json',
            })
         .then(data => {
            var places = data.solution;
            var radii  = data.radii;
            Object.keys(radii).forEach(key => {
                $('input[data-attr='+key+']').val(radii[key]);
                undex.globals.map.plotConstraint(key, radii[key]);
            });
            undex.globals.map.removeSolutions();
            undex.globals.map.plotSolutions(places);
            updateCursor(places);
        });
    });
};
