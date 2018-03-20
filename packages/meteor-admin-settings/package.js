Package.describe({
  name: 'yogiben:admin-settings',
  summary: 'Key value store for yogiben:admin',
  version: '1.1.0',
  git: 'https://github.com/yogiben/meteor-admin-settings'
});


Package.onUse(function (api) {
  api.versionsFrom('1.0.1');

  api.use([
    'coffeescript',
    'underscore',
    'templating',
    'iron:router@1.0.9',
    'aldeed:autoform@5.5.1'
  ]);

  api.addFiles([
    'lib/both/collections.coffee',
    'lib/both/types.coffee'
  ]);

  api.addFiles([
    'lib/client/router.coffee',
    'lib/client/views/admin-settings.html',
    'lib/client/views/admin-settings-table.html',
    'lib/client/views/admin-settings-edit.html',
    'lib/client/views/admin-settings-new.html',
    'lib/client/views/admin-settings-edit.coffee',
    'lib/client/views/admin-settings-new.coffee',
    'lib/client/admin.js',
    'lib/client/helpers.coffee',
    'lib/client/helpers.js'
  ], 'client');

  api.addFiles([
    'lib/server/allow.coffee',
    'lib/server/publish.coffee'
  ], 'server');
});


Package.onTest(function (api) {
  api.use([
    'tinytest',
    'yogiben:admin-settings'
  ]);
  api.addFiles('yogiben:admin-settings-tests.js');
});
