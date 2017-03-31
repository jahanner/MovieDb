var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {

  root: "https://api.themoviedb.org/3",
  token: "8e888fa39ec243e662e1fb738c42ae99", // TODO 0 (DONE) add your api key

  /**
   * Given a movie object, return the url to its poster image
   */
  posterUrl: function(movie) {
    // TODO (DONE)
    // implement this function
    var baseImageUrl = "http://image.tmdb.org/t/p/";
    return baseImageUrl + "w300/" + movie.poster_path;
  }
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      console.log(response);
    }
  });
}


/**
 * Makes an AJAX request to the /search endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {

    var title = $("<h4></h4>").text(movie.original_title);

    // TODO (DONE)
    // add an "I watched it" button
    var button = $("<button>")
      .text("I watched it")
      .attr("class", "btn btn-danger")
      .click(function() {
        var idx = model.watchlistItems.indexOf(movie);
        model.watchlistItems.splice(idx, 1);
        render();
      });

    var poster = $("<img></img>")
      .attr("src", api.posterUrl(movie))
      .attr("class", "img-responsive");


    var panelHeading = $("<div></div>")
      .attr("class", "panel-heading")
      .append(title);

    var panelBody = $("<div></div>")
      .attr("class", "panel-body")
      .append(poster)
      .append(button);

    var itemView = $("<li></li>")
      .attr("class", "panel panel-default")
      .append(panelHeading)
      .append(panelBody);

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    var title = $("<h6></h6>").text(movie.original_title);

    var button = $("<button></button>")
      .text("Add to Watchlist")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1)
      .attr("class", "btn btn-primary");

    var overview = $("<p></p>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li></li>")
      .append(title)
      .append(overview)
      .append(button)
      .attr("class", "list-group-item");

    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });

}



$(document).ready(function() {
  $("#form-search").submit(function(evt) {
    evt.preventDefault();
    var query = $("#form-search input[name=query]").val();
    searchMovies(query, render);
  });

  discoverMovies(render);
});
