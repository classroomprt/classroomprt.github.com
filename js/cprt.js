$(function() {

  Parse.$ = jQuery;
  Parse.initialize("E6Nv5lx2b0RfVTEyB4hbr4k04VBG5zasJQGpzwS3", "0jmzt4FSlEQrBQ1J4gKs1gOjMsPdwgcDfYL3bmwl");

  // // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });

  var ManageTodosView = Parse.View.extend({

    events: {
      "click .log-out": "logOut",
    },

    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to Parse.
    initialize: function() {
      var self = this;

      _.bindAll(this,  'render',  'logOut', 'importTest');

      this.$el.html(_.template($("#manage-todos-template").html()));
    
      this.render();

      this.importTest();
    },


    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    importTest: function() {

     // console.log('uncomment this code to add users from parts.csv')

    // $.ajax({
    //   url: '/parts.csv',
    //   success: function(data) {
    //     // $('.result').html(data);
    //     // alert('Load was performed.');
    //     var fields = data.split(/\r/);
    //     // var dat = data.split(',')
        
    //     var t_vec = []
    //     var x_vec = []
    //     var y_vec = []
    //     var v_vec = []

    //     console.log(fields.length);

    //     var range = fields.length;
    //     // // var resamp = 100;

    //     for (var i=1;  i < range; i++)
    //     {

    //       csarray = fields[(i)].split(',')

    //       // console.log(csarray)

    //       var _fullname = csarray[0];
    //       var _username = csarray[1];
    //       var _location = csarray[2];
    //       var _password = _username + 'CASRC';
    //       var _schedule = parseInt(csarray[3]);

    //       // console.log(schedule)
    //       // console.log(password)

    //       Parse.User.signUp(_username, _password, 
    //         { 
    //           ACL: new Parse.ACL(), 
    //           schedule:_schedule,
    //           fullName: _fullname,
    //           location: _location,
    //         }, {
    //         success: function(user) {

    //           console.log('username created successfully: ' + _username);
    //           // new ManageTodosView();
    //           // self.undelegateEvents();
    //           // delete self;
    //         },

    //         error: function(user, error) {
    //           // self.$(".signup-form .error").html(error.message).show();
    //           // this.$(".signup-form button").removeAttr("disabled");
    //           console.log('error creating user');
    //           console.log(error);
    //         }
    //       });

    //     }
    //   },
    //   error: function(error) {
    //     console.log('error');
    //   }

    // });

    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      
      this.delegateEvents();

    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn"
      
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new ManageTodosView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          this.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      $('#myTab a').tab('show');
      
      this.delegateEvents();
    }
  });

  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new ManageTodosView();
      } else {
        new LogInView();
      }
    }
  });




  var AppRouter = Parse.Router.extend({
    routes: {
      "all": "all",
      "active": "active",
      "completed": "completed"
    },

    initialize: function(options) {
    },

    all: function() {
      state.set({ filter: "all" });
    },

    active: function() {
      state.set({ filter: "active" });
    },

    completed: function() {
      state.set({ filter: "completed" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  Parse.history.start();
});
