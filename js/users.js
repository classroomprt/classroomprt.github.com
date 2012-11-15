
$(function() {

  Parse.$ = jQuery;
  
  Parse.initialize("E6Nv5lx2b0RfVTEyB4hbr4k04VBG5zasJQGpzwS3", "0jmzt4FSlEQrBQ1J4gKs1gOjMsPdwgcDfYL3bmwl");
  

  var LogInView = Parse.View.extend({
    events: {
      "click #create-button": "signUp"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "signUp");
      this.render();
    },


    signUp: function(e) {
      var self = this;
      var username = this.$("#create-username").val();
      var fullname = this.$("#create-fullname").val();      
      var password = this.$("#create-password").val();
      var classyear = this.$("#create-class").val();      
      // var email    = this.$("#create-email").val();
      var location = this.$("#create-location").val();
      var schedule = this.$("#create-schedule").val();
      var trainer = this.$("#create-trainer").val();
      var traineremail = this.$("#create-traineremail").val();
      var trainerx = this.$("#create-trainerx").val();

      
      var user = new Parse.User();
      user.setUsername(username);
      user.setPassword(password);

      // user.set("email", email);
      user.set("fullName", fullname);
      user.set("location", location);
      user.set("class", classyear)
      user.set("schedule", parseInt(schedule));
      user.set("trainer", trainer);
      user.set("trainerEmail", traineremail);
      user.set("trainerX", trainerx);
      user.set("ACL", new Parse.ACL(user.id));

      console.log(user.toJSON());

      user.signUp(null, {
        success: function(user) {

          console.log(user);
          $("#lastcreated").text(JSON.stringify(user.toJSON()));
          Parse.User.logOut();
        },

        error: function(user, error) {
          self.$("#error").html(error.message).show();
        }
      });

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
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

      // if (Parse.User.current()) {
        Parse.User.logOut();
        new LogInView();

      // }

    }
  });

  new AppView;
});
