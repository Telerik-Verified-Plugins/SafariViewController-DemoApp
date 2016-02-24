(function (global) {
  var DemoViewModel,
      url = "https://en.wikipedia.org/wiki/Safari",
      app = global.app = global.app || {};
  
  DemoViewModel = kendo.data.ObservableObject.extend({
    
    isAvailable: function () {
      if (!this.checkSimulator()) {
        SafariViewController.isAvailable(this.onSuccessWithAlert);
      }
    },
    
    _showSafariViewController: function (transition) {
      if (!this.checkSimulator()) {
        SafariViewController.show({
          url: url,
          animated: transition !== undefined, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
          transition: transition, // unless animated is false you can choose from: curl, flip, fade, slide (default)
        });
      }
    },
    
    noAnimation: function () {
      this._showSafariViewController();
    },

    curlAnimation: function () {
      this._showSafariViewController('curl');
    },

    flipAnimation: function () {
      this._showSafariViewController('flip');
    },

    fadeAnimation: function () {
      this._showSafariViewController('fade');
    },

    slideAnimation: function () {
      this._showSafariViewController('slide');
    },

    readerMode: function () {
      SafariViewController.show({
        url: url,
        enterReaderModeIfAvailable: true
      });      
    },

    _showSafariViewControllerWithEvents: function (hidden) {
      SafariViewController.show({
	        url: url,
  	      hidden: hidden
    	  },
      	// this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
	      function(result) {
  	      if (result.event === 'opened') {
    	      alert('SVC opened');
      	  } else if (result.event === 'loaded') {
        	  alert('SVC loaded');
	        } else if (result.event === 'closed') {
  	        alert('SVC closed');
    	    }
     	  },
      	this.onError
      );
    },
                                
    showEvents: function () {
      this._showSafariViewControllerWithEvents(false);
    },

    stealthMode: function () {
      this._showSafariViewControllerWithEvents(true);
      // auto-hide after a few seconds
      setTimeout(function() {
      	SafariViewController.hide();
      }, 3000);
    },
      
    withFallback: function () {
			SafariViewController.isAvailable(function (available) {
        if (available) {
          SafariViewController.show({
            url: url
          });
        } else {
          // if  the InAppBrowser plugin is installed it will use that since it (currently) clobbers window.open
          window.open(url, '_blank', 'location=yes');
        }
      });
  	},

    checkSimulator: function() {
      if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
      } else if (window.SafariViewController === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
      } else {
        return false;
      }
    },

    // callbacks
    onSuccess: function(msg) {
      console.log('SafariViewController success: ' + msg);
    },

    onSuccessWithAlert: function(msg) {
      alert(JSON.stringify(msg));
    },

    onError: function(msg) {
      alert('SafariViewController error: ' + msg);
    }
  });

  app.demoService = {
    viewModel: new DemoViewModel()
  };
})(window);