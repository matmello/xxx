//Router Configuration
Router.configure({
  layoutTemplate:   'layout',
  loadingTemplate:  'loading',
  // notFoundTemplate: 'notFound',
});

// Controller that will be requested in many normal routes
MainController = RouteController.extend({
  yieldTemplates: {
    header: { to: 'header' },
    footer:     { to: 'footer' },
  },
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

Router.route('/register', {
  name:       'register',
  template:   'register',
  controller: MainController,
});

Router.route('/perfil', {
  name:       'perfil',
  template:   'perfil',
  controller: MainController,
});
