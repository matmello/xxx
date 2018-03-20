//Router Configuration
Router.configure({
  layoutTemplate:   'layout',
  loadingTemplate:  'loading',
  // notFoundTemplate: 'notFound',
});

// Controller that will be requested in many normal routes
MainController = RouteController.extend({
  // yieldTemplates: {
  //   header: { to: 'header' },
  //   footer:     { to: 'footer' },
  // },
});

Router.route('/', {
  name:       'home',
  template:   'home',
  controller: MainController,
});

Router.route('/login', {
  name:       'login',
  template:   'login',
  controller: MainController,
});

Router.route('/dashboard', {
  name:       'dashboard',
  template:   'dashboard',
  controller: MainController,
});

Router.route('/register', {
  name:       'register',
  template:   'register',
  controller: MainController,
});

Router.route('/register/restaurant', {
  name:       'registerRestaurant',
  template:   'registerRestaurant',
  controller: MainController,
});

Router.route('/perfil', {
  name:       'perfil',
  template:   'perfil',
  controller: MainController,
});

Router.route('/recuperarsenha/:token', {
  name: 'recoverPassword',
  template: 'recoverPassword',
  action:     function () {
  if (this.params.token) {
    Session.set('resetPasswordToken', this.params.token);
  }
  this.render();
  },
});

Router.configure({
  waitOn: function () {
      // console.log('####OOOOOO#####');
       if(Router.current().route.getName().indexOf('adminDashboard')>-1){
        $("link[href='/light/demo.css']").remove();
        $("link[href='/light/light.css']").remove();
        $("link[href='/theme_css/main.css']").remove();
       }
       if(Router.current().route.getName().indexOf('home')>-1){
        // console.log('####fffff#####');
        var elem = '<link rel="stylesheet" href="/theme_css/main.css"></link>';
        $('head').append(elem);
       }
  }
});
