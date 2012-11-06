// An example Parse.js Backbone application based on the todo app by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses Parse to persist
// the todo items and provide user authentication and sessions.

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("E6Nv5lx2b0RfVTEyB4hbr4k04VBG5zasJQGpzwS3", "0jmzt4FSlEQrBQ1J4gKs1gOjMsPdwgcDfYL3bmwl");


  // // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });


  // The main view that lets a user manage their todo items
  var ManageTodosView = Parse.View.extend({

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click .log-out": "logOut",
    },

    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to Parse.
    initialize: function() {
      var self = this;

      _.bindAll(this,  'render',  'logOut');

      this.$el.html(_.template($("#manage-todos-template").html()));
    
      this.render();
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      

      var file;

      // Set an event listener on the Choose File field.
      $('#fileselect').bind("change", function(e) {
        var files = e.target.files || e.dataTransfer.files;
        // Our file var now holds the selected file
        file = files[0];
      });

      // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
      $('#uploadbutton').click(function() {
        var serverUrl = 'https://api.parse.com/1/files/' + file.name;

        $.ajax({
          type: "POST",
          beforeSend: function(request) {
            request.setRequestHeader("X-Parse-Application-Id", 'E6Nv5lx2b0RfVTEyB4hbr4k04VBG5zasJQGpzwS3');
            request.setRequestHeader("X-Parse-REST-API-Key", 'hdm5zC7c9mdGXGbSYaJFbi7IPoRtNSJCj2KWXLlx');
            request.setRequestHeader("Content-Type", file.type);


          },
          url: serverUrl,
          data: file,
          processData: false,
          contentType: false,
          success: function(data) {

            var UploadObject = Parse.Object.extend("fileUpload");

            var uploadObject = new UploadObject();

            uploadObject.set('uploadFile', file.name);
            uploadObject.set('uploadURL', data.url);
            uploadObject.set('uploadType', file.type);
            uploadObject.set('uploadUserEmail', Parse.User.current().get("email"));
            uploadObject.set('uploadUser', Parse.User.current().get("username"));

            uploadObject.save(null, {
              success: function(obj) {
                console.log('object saved successfully');

                // alert("File available at: " + data.url);
                $("#uploadMessage").html('Upload success. File available at <a target="_blank" href="' + data.url + '" >this link</a>');
                $("#uploadMessage").fadeIn(500);

              },
              error: function(obj, error) {
                
                // alert("File available at: " + data.url);
                $("#uploadMessage").html('<b>Upload failure with error ' + error.description + ' </b>');
                $("#uploadMessage").fadeIn(500);

                // error is a Parse.Error with an error code and description.
              }
            });


          },
          error: function(data) {
            var obj = jQuery.parseJSON(data);
            alert(obj.error);
          }
        });
      });

      

      this.delegateEvents();

     
    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
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

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      var _email = this.$("#signup-email").val();
      
      var coursecode = this.$("#signup-coursecode").val();

      if(coursecode.length > 0)
      {
        console.log(coursecode);

        if (coursecode == 'cprt2013')
        {
          console.log('User will be a CPRT 20123 enrollee')

          Parse.User.signUp(username, password, { ACL: new Parse.ACL(), userType:coursecode, email: _email }, {
            success: function(user) {
              new ManageTodosView();
              self.undelegateEvents();
              delete self;
            },

            error: function(user, error) {
              self.$(".signup-form .error").html(error.message).show();
              this.$(".signup-form button").removeAttr("disabled");
            }
          });
        }
        else if (coursecode == 'cprt2014')
        {
          console.log('User will be a CPRT 2014 enrollee')

          Parse.User.signUp(username, password, { ACL: new Parse.ACL(), userType:coursecode, email: _email }, {
            success: function(user) {
              new ManageTodosView();
              self.undelegateEvents();
              delete self;
            },

            error: function(user, error) {
              self.$(".signup-form .error").html(error.message).show();
              this.$(".signup-form button").removeAttr("disabled");
            }
          });
        }
        else if (coursecode == 'cprtADMIN')
        {
          console.log('User will be a CPRT ADMIN enrollee')

          Parse.User.signUp(username, password, { ACL: new Parse.ACL(), userType:coursecode, email: _email }, {
            success: function(user) {
              new ManageTodosView();
              self.undelegateEvents();
              delete self;
            },

            error: function(user, error) {
              self.$(".signup-form .error").html(error.message).show();
              this.$(".signup-form button").removeAttr("disabled");
            }
          });
        }
        else if (coursecode == 'cprt2015')
        {
          console.log('User will be a CPRT 2015 enrollee')

          Parse.User.signUp(username, password, { ACL: new Parse.ACL(), userType:coursecode, email: _email }, {
            success: function(user) {
              new ManageTodosView();
              self.undelegateEvents();
              delete self;
            },

            error: function(user, error) {
              self.$(".signup-form .error").html(error.message).show();
              this.$(".signup-form button").removeAttr("disabled");
            }
          });
        }
        else
        {
          self.$(".signup-form .error").html('Invalid course code').show();
          this.$(".signup-form button").removeAttr("disabled");
        }

      }

      

      // this.$(".signup-form button").attr("disabled", "disabled");

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
