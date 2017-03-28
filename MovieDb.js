$(document).ready(function() {
  discoverMovies(render);
});



var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "5a241eb53c9b2f7ab1af6c29865624e6" // TODO 0 add your api key
}


/**
 * Makes an AJAX request to /discover/movie endpoint of the API
 *
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
      callback();
    }
  });
}


/**
 * Makes an AJAX request to the /search/movie endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(searchTerm, callback) {
  console.log("searching for movies with '" + searchTerm + "' in their title...");
  $.ajax({
    url: api.root + "/search/movie?query=" + searchTerm,
    data: {
      api_key: api.token,
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
  // TODO 9
  // implement this function as described in the comment above
  // you can use the body of discoverMovies as a jumping off point


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
    var title = $("<h3></h3>").text(movie.original_title);
    title.css('text-decoration', 'underline');
    // var image = $("<img>");
    // image.src = movie.poster_path;
    var text = $("<p>"+ movie.overview + "</p>");
    var itemView = $("<li></li>")
      .append(title)
      .append(text)
    //   .append(image)
      // TODO 3
      // give itemView a class attribute of "item-watchlist"
      .attr('class',"item-watchlist")
    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {
    var title = $("<h3></h3>").text(movie.original_title);
    title.css('text-decoration', 'underline');
    var button = $("<button></button>")
      .text("Add to Watchlist")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      });
      // TODO 2
      // the button should be disabled if this movie is already in
    //   the user's watchlist
    button.prop('disabled', model.watchlistItems.indexOf(movie) != -1);

    // TODO 1
    // create a paragraph containing the movie object's .overview value
    // then, in the code block below,
    // append the paragraph in between the title and the button
    var overview = $("<p>" + movie.overview + "</p>");


    // append everything to itemView, along with an <hr/>
    var itemView = $("<li></li>")
      .append($("<hr/>"))
      .append(title)
      .append(overview)
      .append(button);

    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });

}
