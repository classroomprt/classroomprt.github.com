$(function() {

  Parse.$ = jQuery;
  Parse.initialize("E6Nv5lx2b0RfVTEyB4hbr4k04VBG5zasJQGpzwS3", "0jmzt4FSlEQrBQ1J4gKs1gOjMsPdwgcDfYL3bmwl");

  var fileObject = Parse.Object.extend("fileUpload");

  var fileList = Parse.Collection.extend({
    model: fileObject
  });

  var fileView = Parse.View.extend({

    tagName: "div", 

    template: _.template($('#item-template').html()),

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
    },

    // Re-render the contents of the todo item.
    render: function() {

      $(this.el).html(this.template(this.model.toJSON()));
      
      return this;
    },

  })


  // The main view that lets a user manage their todo items
  var ManageTodosView = Parse.View.extend({

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      
    },

    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to Parse.
    initialize: function() {
      var self = this;

      _.bindAll(this,  'render', 'addOne', 'addAll');

      this.$el.html(_.template($("#manage-todos-template").html()));
    
// Create our collection of Todos
      this.flist = new fileList;

      // Setup the query for the collection to look for todos from the current user
      
      this.flist.query = new Parse.Query(fileObject);

      // this.flist.query.equalTo("user", Parse.User.current());
        
      this.flist.bind('add',     this.addOne);
      this.flist.bind('reset',   this.addAll);
      this.flist.bind('all',     this.render);

      // Fetch all the todo items for this user
      this.flist.fetch();

      console.log(this.flist.length);

      this.render();
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(fileobj) {

      
      var view = new fileView({model: fileobj});
      this.$("#filelist").append(view.render().el);
    },

    // Add all items in the Todos collection at once.
    addAll: function(collection, filter) {
      this.$("#filelist").html("");
      this.flist.each(this.addOne);
    },


    render: function() {
    
      this.delegateEvents();

    }
  });

  var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });

  var AppView = Parse.View.extend({
    
    el: $("#todoapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current().get('userType') == 'cprtADMIN') {
        new ManageTodosView();
      } else {
        window.location = '/';
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
