var model = {
  watchlistItems: [],
  browseItems: [],
  ratedItems: [],
  // add a new field, browseActiveIndex, initially set to 0
  browseActiveIndex: 0
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "8e888fa39ec243e662e1fb738c42ae99",
  imageBaseUrl: "http://image.tmdb.org/t/p/",

    posterUrl: function(movie) {
    var baseImageUrl = "http://image.tmdb.org/t/p/w300/";
    return baseImageUrl + movie.poster_path;
  }

}

$(document).ready(function() {
  $("#section-watched").addClass('hidden');
  $("#section-watchlist").addClass('hidden');
  $("#form-search").submit(function(evt) {
    evt.preventDefault();
    var query = $("#form-search input[name=query]").val();
    searchMovies(query, render);
    if(TypeError){
      window.alert("Hum...something went wrong")
    }
  });

  $("#browse-carousel").bind("slid.bs.carousel", function() {
      console.log("slid")
      var newIndex = $("#browse-carousel").find(".active").index();
      console.log(newIndex);
      model.browseActiveIndex = newIndex;
      render2();
  });
  // initial fetch
  searchMovies("", render);
  $("#section-watched").addClass('hidden');
  $("#section-watchlist").addClass('hidden');
});
/**
 * Makes an AJAX request to the /discover endpoint of the API, using the
 * keyword ID that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function discoverMovies(data, callback) {
  // DONE
  $.ajax({
    url: api.root + "/discover/movie",
    data: data,
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    },
    fail: function() {
      console.log("discover failed");
    }
  });
}


function searchMovies(query, callback) {
  fetchKeywords(
    query,
    function(keywordsResponse) {
      console.log("fetch succeeded");
      var firstKeywordID = keywordsResponse.results[0].id;
      var data = {
        api_key: api.token,
        with_keywords: firstKeywordID
      };
      discoverMovies(data, callback);
    },
    function() {
      //user failed prompt
      console.log("fetchkeywords failed")
      var data = {
        api_key: api.token
      };
      discoverMovies(data, callback);
    }
  );
}

/**
 * Makes an AJAX request to the /search/keyword endpoint of the API,
 * using the query string that was passed in
 *
 * if successful, invokes the supplied callback function, passing in
 * the API's response.
 */
function fetchKeywords(query, cbSuccess, cbError) {
  // DONE
  $.ajax({
    url: api.root + "/search/keyword",
    data: {
      api_key: api.token,
      query: query,
    },
    success: cbSuccess,
    error: cbError,
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
  var watchlistElement = $("#section-watchlist ul");
  var carouselInner = $("#section-browse .carousel-inner");
  var browseInfo = $("#browse-info");
  var watchedElement = $("#section-watched ul");

  // clear everything
  watchlistElement.empty();
  carouselInner.empty();
  browseInfo.empty();
  watchedElement.empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {

    // panel heading
    var title = $("<h4></h4>").text(movie.original_title);
    var rating = movie.vote_average;
    var vote = $("<h6></h6>").text("Average rating " + rating + " out of 10.");
    var panelHeading = $("<div></div>")
      .attr("class", "panel-heading")
      .append(title)
      .append(vote);

    // panel body
    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var panelBody = $("<div></div>")
      .attr("class", "panel-body")
      .append(poster)
      .append(button);

    // panel
    var panel = $("<div></div>")
      .attr("class", "panel panel-default")
      .append(panelHeading)
      .append(panelBody);

    //button
    var button = $("<button></button>")
      .text("I watched it")
      .attr("class", "btn")
      .hide();

    var itemView = $("<li></li>")
      .append(panel)
      .append(button)
      .mouseover(function() {
        button.show();
      })
      .mouseleave(function() {
        button.hide();
      });

    watchlistElement.append(itemView)
  });

  // insert browse items
  model.browseItems.forEach(function(movie, index) {
    // DONE
    // replace the old ul code with new carousel implementation:
    // create an image with the movie poster
    // wrap the image inside a div
    // append the item into the carousel-inner element

    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var carouselItem = $("<div></div>")
      .attr("class", "item")
      .append(poster);

    carouselInner.append(carouselItem);

    // DONE
    // if this index is the current active index,
    // give this item a class attribute of "active"
    if (index === model.browseActiveIndex) {
      carouselItem.attr("class", "item active");
    }

  });

  // display info for the currently active movie
  var activeMovie = model.browseItems[model.browseActiveIndex];
  var title = $("<h2></h2>").text(activeMovie.original_title);
  var overview = $("<h4></h4>").text(activeMovie.overview);
  browseInfo
    .append(title)
    .append($("<hr/>"))
    .append(overview);


  // disable or enable the Add to Watchlist button depending on
  // whether the current active movie is already on the user's watchlist
  var alreadyOnWatchlist = model.watchlistItems.indexOf(activeMovie) !== -1
  $("#add-to-watchlist").prop("disabled", alreadyOnWatchlist);
}

function render2() {
  var watchlistElement = $("#section-watchlist ul");
  var carouselInner = $("#section-browse .carousel-inner");
  var browseInfo = $("#browse-info");

  // clear everything
  carouselInner.empty();
  browseInfo.empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {

    // panel heading
    var title = $("<h4></h4>").text(movie.original_title);
    var rating = movie.vote_average;
    var vote = $("<h6></h6>").text("Average rating " + rating + " out of 10.");
    var panelHeading = $("<div></div>")
      .attr("class", "panel-heading")
      .append(title)
      .append(vote);

    // panel body
    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var panelBody = $("<div></div>")
      .attr("class", "panel-body")
      .append(poster)
      .append(button);

    // panel
    var panel = $("<div></div>")
      .attr("class", "panel panel-default")
      .append(panelHeading)
      .append(panelBody);

    var button = $("<button></button>")
      .text("I watched it")
      .attr("class", "btn")
      .hide();

    var itemView = $("<li></li>")
      .append(panel)
      .append(button)
      .mouseover(function() {
        button.show();
      })
      .mouseleave(function() {
        button.hide();
      });

    watchlistElement.append(itemView)
  });

  // insert browse items
  model.browseItems.forEach(function(movie, index) {

    // replace the old ul code with new carousel implementation:
    // create an image with the movie poster
    // wrap the image inside a div
    // append the item into the carousel-inner element

    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var carouselItem = $("<div></div>")
      .attr("class", "item")
      .append(poster);

    carouselInner.append(carouselItem);


    // if this index is the current active index,
    // give this item a class attribute of "active"
    if (index === model.browseActiveIndex) {
      carouselItem.attr("class", "item active");
    }

  });

  // display info for the currently active movie
  var activeMovie = model.browseItems[model.browseActiveIndex];
  var title = $("<h2></h2>").text(activeMovie.original_title);
  var overview = $("<h4></h4>").text(activeMovie.overview);
  browseInfo
    .append(title)
    .append($("<hr/>"))
    .append(overview);

  // disable or enable the Add to Watchlist button depending on
  // whether the current active movie is already on the user's watchlist
  var alreadyOnWatchlist = model.watchlistItems.indexOf(activeMovie) !== -1
  $("#add-to-watchlist").prop("disabled", alreadyOnWatchlist);
}

function posterUrl(movie, width) {
  return api.imageBaseUrl + width + "/" + movie.poster_path;
}


/**
 * removes the given movie from model.watchlistItems
 */
function removeFromWatchlist(movie) {

  model.watchlistItems = model.watchlistItems.filter(function(item) {
    return item !== movie;
  });

}

// makes any kind of email acceptable for firebase
function escapeEmailAddress(email) {

  if (!email) return false

  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email;
}

//function to add a movie to the watchlist
function addActiveMovie() {

  var watchlistElement = $("#section-watchlist ul");
  var user_email = firebase.auth().currentUser.email;
  var activeMovie = model.browseItems[model.browseActiveIndex];
  var movie = activeMovie.title;
  window.alert("Nice, you added " + movie + " to your watchlist!")
  var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/movies/').push();
  ref.set(activeMovie);
  watchlistElement.append(activeMovie);
  ref.on("value", function(snapshot) {
    console.log(activeMovie.title);
  });

}
//function to add a movie from the watchlist to alreadywatched
function addwatchedMovie() {

  var watchlistElement = $("#section-watched ul");
  var user_email = firebase.auth().currentUser.email;
  var activeMovie = model.browseItems[model.browseActiveIndex];
  var movie = activeMovie.title;
  var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/alreadywatched/').push();
  ref.set(activeMovie);
  watchlistElement.append(activeMovie);

}

//function to display movies in watchlist
function displayMovies() {
  var user_email = firebase.auth().currentUser.email;
  var watchlistElement = $("#section-watchlist ul");
  var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/movies/');

  ref.once("value", function(snapshot) {
    snapshot.forEach(function(movie) {

      var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.themoviedb.org/3/movie/" + movie.val().id + "?language=en-US&api_key=8e888fa39ec243e662e1fb738c42ae99",
      "method": "GET",
      "headers": {},
      "data": "{}"
    }
    //call to get revenue information
    $.ajax(settings).done(function (response) {

      console.log(movie.val());
      console.log(movie.key);
      var rev = response.revenue;
      var nf = Intl.NumberFormat();
      var release_date = '';
      for (var i = 0; i < 4; i ++){
        release_date += response.release_date[i];
      }
      if (rev === 0){
        var revenue = $("<h6></h6>").text("Revenue information unavailable.");
      }
      else {
        var revenue = $("<h6></h6>").text("Total revenue: $" + nf.format(rev));
      }
      var stars = $("<div> <select id='stars'> <option value='*'>*</option> <option value='**'>**</option> <option value='***'>***</option> <option value='****'>****</option> <option value='*****'>*****</option> </select> </div>");
      var myrating = $("<h5></h5>").text("My rating");
      var title = $("<h4></h4>").text(movie.val().original_title + " (" + release_date + ")");
      movie.val().certification_country === 'US';
      var rated = movie.val().certification;
      var rating = movie.val().vote_average;
      console.log(rated);
      var vote = $("<h5></h5>").text(rating + " (TheMovieDB)");
      var panelHeading = $("<div></div>")
        .attr("class", "panel-heading")
        .css("background-color", "#33cc33")
        .css("color", "black")
        .append(title)
        .append(vote)
        .append(rated)
        .append(revenue);
        // .append(myrating, stars);

      // panel body
      var poster = $("<img></img>")
        .attr("src", "http://image.tmdb.org/t/p/w300/" + movie.val().poster_path);
      var panelBody = $("<div></div>")
        .attr("class", "panel-body")
        .append(poster)
        .append(button);


      // panel
      var panel = $("<div></div>")
        .attr("class", "panel panel-default")
        .append(panelHeading)
        .append(panelBody);
      //button to remove movie from watchlist
      var button = $("<button></button>")
        .text("I watched it")
        .attr("class", "btn")
        .click(function() {
          var delete_movie = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/movies/' + movie.key);
          var del = model.ratedItems;
          del.push(movie);
          addwatchedMovie();
          delete_movie.remove();
          model.ratedItems.append(delete_movie);
          $("#section-watched").append(delete_movie);
          window.alert("You removed " + movie.val().original_title + " from your watchlist.");
        })
        .hide();

      var itemView = $("<li></li>")
        .append(panel)
        .append(button)
        .mouseover(function() {
          button.show();
        })
        .mouseleave(function() {
          button.hide();
        });

      watchlistElement.append(itemView)

    });
  });
  });
  $("#section-watchlist").removeClass('hidden');
  $("#section-watched").addClass('hidden');
}


function alreadywatched() {
  var user_email = firebase.auth().currentUser.email;
  var watchlistElement = $("#section-watched ul");
  var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/alreadywatched/');
  var stars = $( "#stars option:selected" ).text();

  ref.once("value", function(snapshot) {
    snapshot.forEach(function(movie) {

      console.log(movie.val());
      console.log(movie.key);

      var title = $("<h3></h3>").text(movie.val().original_title);
      var rating = movie.val().vote_average;
      var vote = $("<h5></h5>").text(rating + " (TheMovieDB)");
      var panelHeading = $("<div></div>")
        .attr("class", "panel-heading")
        .css("background-color", "#33cc33")
        .css("color", "black")
        .append(title)
        .append(vote);

      // panel body
      var poster = $("<img></img>")
        .attr("src", "http://image.tmdb.org/t/p/w300/" + movie.val().poster_path);
      var panelBody = $("<div></div>")
        .attr("class", "panel-body")
        .append(poster);


      // panel
      var panel = $("<div></div>")
        .attr("class", "panel panel-default")
        .append(panelHeading)
        .append(panelBody);

      var itemView = $("<li></li>")
        .append(panel);

      watchlistElement.append(itemView)

    });
  });
  $("#section-watchlist").addClass('hidden');
  $("#section-watched").removeClass('hidden');
}

//to be displayed when mywatchlist is clicked
$(".mywatchlist").click(function(){
  firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
      var user_email = firebase.auth().currentUser.email;
      displayMovies();
      render();
    }
  else {
      window.alert('You have to be logged in to view this yo.');
    }
    $(".mywatchlist").click(function(){
      $("#section-watchlist").addClass('hidden');
    })
 })
})
//to be displayed when alreadywatched is clicked
$(".myratings").click(function(){
  firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
      var user_email = firebase.auth().currentUser.email;
      alreadywatched();
      render();
    }
  else {
      window.alert('You have to be logged in to view this yo.');
    }
    $(".myratings").click(function(){
      $("#section-watched").addClass('hidden');
    })
 })
})


$("#add-to-watchlist").click(function() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            btnLogout.removeClass('hide');
            addActiveMovie();
        }
        else {
            window.alert("You can't add movies unless you are logged in yo.");
            btnLogout.addClass('hide');
        }
    });

});
//info for firebase
var config = {
  apiKey: "AIzaSyC62ckmk8cuoWd71_jhKtlEdoJRBPLZ2ro",
  authDomain: "movie-watchlist-app.firebaseapp.com",
  databaseURL: "https://movie-watchlist-app.firebaseio.com",
  projectId: "movie-watchlist-app",
  storageBucket: "movie-watchlist-app.appspot.com",
  messagingSenderId: "576360931179"
};

firebase.initializeApp(config);

//Get elements
var txtEmail = $("#txtEmail");
var txtPassword = $("#txtPassword");
var btnLogin = $("#btnLogin");
var btnSignUp = $("#btnSignUp");
var btnLogout = $("#btnLogout");


//Login event
btnLogin.on('click', function(){
    var email = txtEmail.val();
    var pass = txtPassword.val();
    var auth = firebase.auth();
    var promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => window.alert(e.message));
})

//Signup event
btnSignUp.on('click', function(){
    var email = txtEmail.val();
    var pass = txtPassword.val();
    var auth = firebase.auth();
    var promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => window.alert(e.message));
})
//Logout event
btnLogout.on('click', function(){
    firebase.auth().signOut();
});

//Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
        btnLogout.removeClass('hide');
    }
    else {
        console.log('not logged in');
        btnLogout.addClass('hide');
    }
});
