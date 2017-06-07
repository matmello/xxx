var requireLogin = function () {
  if (!Meteor.user()) {
    // if(Meteor.loggingIn()){
    //   this.render('loading');
    // } else {
      this.render('login');
      this.render('header', {to: 'header'});
      this.render('footer', {to: 'footer'});
    // }
  } else {
    this.next();
  }
};

var selectNavbar = function() {
  var selector = '.nav a[href="/' + Router.current().route.getName() + '"]'; // the nav item for the active route (if any)
  if (Router.current().route.getName()=='home'){
    selector = '.nav a[href="/"]';
  }
  setTimeout(function(){
    $('.nav .active').removeClass('active'); // unhighlight any previously highlighted nav
    $(selector).parent().addClass('active'); // highlight the current nav (if it exists, many routes don't have a nav)
  }, 200);
}

Router.onAfterAction(selectNavbar, {except: []});
