$(()=>{

    if(worldfluff!='') {
        $('#newhomeworld').html(worldfluff)
        $('#newspecies').show();
        if(speciesfluff!='') {
            $('#newspecies').html(speciesfluff);
            $('#newgovernment').show();
        }
    }

    $('#submithomeworld').on('click', () => {
        let worldname = $('#homeworldname').val();
        let worldclimate = $('#climate').val();
        let surplus = $('#surplus').val();
        let scarcity = $('#scarcity').val();
        let problems = '';
        if(worldname=='') problems += 'Your homeworld needs a name. ';
        if(worldname=='Planet') problems += "Don't name your homeworld 'Planet.' ";
        if(scarcity==surplus) problems += "You can't have both a scarcity AND a surplus of "+surplus+". ";
        if((worldclimate=='desert') && surplus=='Water') problems += "A hot planet with a water surplus does not have a dry climate.";
        if((worldclimate=='tropical' || worldclimate == 'winter')&&scarcity=='Water') problems += "Planets with a scarcity of water don't have wet climates.";
        if(problems=='') {
            let newworld = {
                name: worldname,
                climate: worldclimate,
                moreof: surplus,
                lessof: scarcity};
            console.log(newworld);
            $.ajax({
                url: '/game/newhomeworld',
                type: 'POST',
                data: newworld,
                success: (data) => {
                    if(data=='_ERROR_') {
                        alert('Something went wrong.  Try refreshing the page.');
                    }
                    else {
                        $('#newhomeworld').html(data);
                        $('#newspecies').show();
                    }
                }
            });
        }
        else alert('There are some problems with your home world to fix! '+problems);
    });

    $('#submitspecies').on('click', () => {
        let ns = $('#noun_singular').val();
        let np = $('#noun_plural').val();
        let adj = $('#adjective').val();
        let problems = '';
        // TODO: Species validation.
        if (problems=='') {
            let newspecies = {
                noun_singular: ns,
                noun_plural: np,
                adjective: adj
            };
            console.log(newspecies)
            console.log(newspecies);
            $.ajax({
                url: '/game/newspecies',
                type: 'POST',
                data: newspecies,
                success: (data) => {
                    if(data=='_ERROR_') alert('Something went wrong!');
                    else {
                        $('#newspecies').html(data);
                        $('#newgovernment').show();
                    }
                }
            });
        }
        else alert('There were some problems wtih this species. '+problems);
    });

    $('#submitgovernment').on('click', () => {
        let newgovernment = {
            full: $('#fullgovname').val(),
            short: $('#shortgovname').val()
        }
        $.ajax({
            url: '/game/newgovernment',
            type: 'POST',
            data: newgovernment,
            success: (data) => {
                if(data=='_ERROR_') alert('Something went wrong!');
                else {
                    $('#newgovernment').html(data);
                    $('#finalize').show();
                }
            }
        });
    });
})