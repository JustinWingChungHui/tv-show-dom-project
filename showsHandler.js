let ShowsHandler = {
    
    // Shows Data
    data: [],

    // Setup code for shows
    Setup: function() {
        this.data = getAllShows()
                                .sort(this.SortShows);

        document.getElementById('showsSelect')
            .addEventListener("change", e => this.OnShowSelect(e.target.value));

        document.getElementById('showSearch')
            .addEventListener("input", e => this.SearchShows());     
            
            this.ShowPage();
    },

    // Shows Shows page and hides episode page
    ShowPage: function() {

        document.getElementById('showsPage').classList.remove('hidden');
        document.getElementById('episodesPage').classList.add('hidden');
        document.getElementById('showSearch').value = '';

        this.DrawSelectBox();
        this.DrawShows();
    },

    // Draws the select box and populates the options
    DrawSelectBox: function() {
        let selectBox = document.getElementById('showsSelect');

        // Clear contents
        selectBox.innerHTML = '';

        let optionsHtml = '<option value="0">All Shows</option>';
        ShowsHandler.data.forEach(show => {
            optionsHtml += 
                `<option value="${show.id}">${show.name}</option>\n`;
        });

        selectBox.innerHTML = optionsHtml;        
    },


    // Draws all the show on the page
    DrawShows: function() {
        let container = document.getElementById('shows');

        container.innerHTML = '';

        this.data.forEach(show => {

            // if it doesn't have an image, show no image picture
            let image = show.image ? 
                        show.image.medium : 
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png';

            const li = document.createElement('li');
            li.value = show.id;
            li.innerHTML = `<h3>${show.name}</h3>
                            <img src="${image}"/>
                            <p>${show.summary}</p>`;

            li.addEventListener('click', () => this.OnShowSelect(li.value));

            container.appendChild(li);
        });

    },

    // Function to sort the shows by name
    SortShows: function(a, b) {
        return a.name > b.name ? 1: -1       
    },

    // Event handler called when someone types into search box
    SearchShows: function() {

        let value = document.getElementById('showSearch').value;

        if (value) {
            this.data = getAllShows()
                                    .filter(s => this.FilterShows(s, value))
                                    .sort(this.SortShows);   

        } else {
            this.data = getAllShows()
                                    .sort(this.SortShows);      
        }

        this.DrawShows();
    },


    // Function to ilter shows by name and summary
    FilterShows: function(show, searchText) {

        // case insensitive search
        let name = show.name ? show.name.toLowerCase() : '';
        let summary = show.summary ? show.summary.toLowerCase() : '';

        return name.includes(searchText.toLowerCase())
                    || summary.includes(searchText.toLowerCase());
    },



    // Eventhandler when a show is selected
    OnShowSelect: function (showId) {
        
        if (showId) {
            EpisodesHandler.ShowEpisodes(Number(showId));
        }
    },


}