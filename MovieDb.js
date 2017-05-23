
    var model = {
      watchlistItems: [],
      browseItems: [],
      // DONE
      // add a new field, browseActiveIndex, initially set to 0
      browseActiveIndex: 0
    }


    var api = {
      root: "https://api.themoviedb.org/3",
      token: "8e888fa39ec243e662e1fb738c42ae99",
      imageBaseUrl: "http://image.tmdb.org/t/p/"
    }


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
          var firstKeywordID = keywordsResponse.results[0].id
          var data = {
            api_key: api.token,
            with_keywords: firstKeywordID
          };
          discoverMovies(data, callback);
        },
        function() {
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
        error: cbError
      });
    }


    /**
     * re-renders the page with new content, based on the current state of the model
     */
    function render() {
      var watchlistElement = $("#section-watchlist ul");
      var carouselInner = $("#section-browse .carousel-inner");
      var browseInfo = $("#browse-info");

      // clear everything
      watchlistElement.empty();
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
          .click(function() {
            removeFromWatchlist(movie);
            render();
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

      // DONE display info for the currently active movie
      var activeMovie = model.browseItems[model.browseActiveIndex];
      var title = $("<h2></h2>").text(activeMovie.original_title);
      var overview = $("<p></p>").text(activeMovie.overview);
      browseInfo
        .append(title)
        .append($("<hr/>"))
        .append(overview);

      // DONE
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
      // DONE
      model.watchlistItems = model.watchlistItems.filter(function(item) {
        return item !== movie;
      });
    }

    function escapeEmailAddress(email) {
      if (!email) return false

      email = email.toLowerCase();
      email = email.replace(/\./g, ',');
      return email;
    }

    function addActiveMovie() {
      // DONE
      var watchlistElement = $("#section-watchlist ul");
      var user_email = firebase.auth().currentUser.email;
      var activeMovie = model.browseItems[model.browseActiveIndex];
      var movie = activeMovie.title;
      var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + '/movies/' + escapeEmailAddress(movie));
      ref.set(activeMovie);
      watchlistElement.append(activeMovie);
      ref.on("child_added", function(snapshot) {
        console.log(snapshot.key);
      });

    }

    $(".mywatchlist").click(function(){
      var watch_list = $("#section-watchlist ul");
      var user = firebase.auth().currentUser;
      var user_email = firebase.auth().currentUser.email;
      var ref = firebase.database().ref("Users/" + escapeEmailAddress(user_email) + "/movies/");

      firebase.auth().onAuthStateChanged(firebaseUser => {
          if(firebaseUser) {
              watch_list.removeClass('hide');
              render();
              watch_list.append(ref);
              console.log(ref);

          }
          else {
              window.alert("You can't view watchlist unless you are logged in yo.");
              watch_list.addClass('hide');
          }
      });
    })


    $("#add-to-watchlist").click(function() {
        var user = firebase.auth().currentUser;
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
                btnLogout.removeClass('hide');
                addActiveMovie();
                render();
            }
            else {
                window.alert("You can't add movies unless you are logged in yo.");
                btnLogout.addClass('hide');
            }
        });

    });

    var config = {
      apiKey: "AIzaSyC62ckmk8cuoWd71_jhKtlEdoJRBPLZ2ro",
      authDomain: "movie-watchlist-app.firebaseapp.com",
      databaseURL: "https://movie-watchlist-app.firebaseio.com",
      projectId: "movie-watchlist-app",
      storageBucket: "movie-watchlist-app.appspot.com",
      messagingSenderId: "576360931179"
    };

    firebase.initializeApp(config);
    $("#section-watchlist").addClass('hide');

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
