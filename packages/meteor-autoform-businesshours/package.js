Package.describe({
  name: 'matmello:autoform-businesshours',
  summary: 'JQuery Business Hours for autoform.',
  version: '0.1.0',
  git: 'https://github.com/matmello/businesshours'
});


Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.3');

  api.use('ecmascript');
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@4.0.0 || 5.0.0');
  api.addFiles([
    'lib/jquery-businesshours.css',
    'lib/jquery-businesshours.js',
    'lib/jquery-timepicker.js',
    'autoform-businesshours.html',
    'autoform-businesshours.js',
    'autoform-businesshours.css'
  ], 'client');
});
