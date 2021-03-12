let EpisodesHandler = { 

    // Persistent data
    data: [],

    // Setup all the events
    Setup: function() {
        document.getElementById('backButton')
            .addEventListener('click', () => ShowsHandler.ShowPage());

        document.getElementById('episodesSelect')
            .addEventListener('change', (e) => this.OnEpisodeSelect(e));

        document.getElementById('episodeSearch')
            .addEventListener('input', () => this.OnEpisodeSearch());
    },


    // Shows the episode page
    ShowEpisodes: function(showId) {

        // Clear any previous values
        document.getElementById('episodes').innerHTML = '';
        document.getElementById('episodesSelect').innerHTML = '';
        document.getElementById('episodeSearch').value = '';

        // Show the episodes page and hide shows page
        document.getElementById('showsPage').classList.add('hidden');
        document.getElementById('episodesPage').classList.remove('hidden');
        
        // get the data for the episodes
        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
            .then((response) => response.json())
            .then((data) => {
                this.data = data;
                this.DrawSelectBox();
                this.DrawEpisodes();
            });

    },


    // Draws the episodes select box
    DrawSelectBox: function() {
        let selectBox = document.getElementById('episodesSelect');

        // Clear contents
        selectBox.innerHTML = '';

        let optionsHtml = '<option value="">All Episodes</option>';
        this.data.forEach(episode => {
            optionsHtml += 
                `<option value="${episode.id}">${this.GetSeasonCode(episode)} ${episode.name}</option>\n`;
        });

        selectBox.innerHTML = optionsHtml;        
    },


    // Draws all the episodes
    DrawEpisodes: function() {
        let container = document.getElementById('episodes');

        container.innerHTML = '';
        let contentsHtml = '';

        this.data.forEach(episode => {

            // if it doesn't have an image, show no image picture
            let image = episode.image ? 
            episode.image.medium : 
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png';

            contentsHtml += 
                `<li id="${episode.id}">
                    <h3>${this.GetSeasonCode(episode)} ${episode.name}</h3>
                    <img src="${image}"/>
                    <p>${episode.summary ? episode.summary : ''}</p>
                </li>`;
        });

        container.innerHTML = contentsHtml;
    },


    // Handles the select box changed event
    OnEpisodeSelect: function(evt) {

        let episodeId = evt.target.value;
        let container = document.getElementById('episodes');
        
        for(let li of container.childNodes) {
            if (!episodeId || li.id === episodeId) {
                li.classList.remove('hidden');
            } else {
                li.classList.add('hidden');
            }
        }
    },


    // handles the input event of the search box
    OnEpisodeSearch: function() {
        let value = document.getElementById('episodeSearch').value;

        if (value) {

            // Hide episodes that don't match search criteria
            let searchtxt = value.toLowerCase();

            for (let episode of this.data) {

                // Need case insensitive comparison
                let title = episode.title ? episode.title.toLowerCase() : '';
                let summary = episode.summary ? episode.summary.toLowerCase() : ''
                
                if (title.includes(searchtxt) || summary.includes(searchtxt)) {
                    document.getElementById(episode.id).classList.remove('hidden');
                } else {
                    document.getElementById(episode.id).classList.add('hidden');
                }

            }

        } else {

            // search box has nothing in it so show all episodes
            this.data.forEach(
                episode => document.getElementById(episode.id).classList.remove('hidden'));    
        }
    },


    // Returns a Formatted Season Code like S01E02
    GetSeasonCode: function(episode) {
        let season = "0" + episode.season.toString();
        let num = "0" + episode.number.toString();

        return `S${season.substr(-2)}E${num.substr(-2)}`;
    }
};