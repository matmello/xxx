UI.registerHelper("admin_collections", function() {
  var collections = {};
  if (typeof AdminConfig !== 'undefined' && typeof AdminConfig.collections === 'object')
    collections = AdminConfig.collections;
  // remove Meteor.users collection (see above)
  delete collections.Users;
  return _.map(collections, function(obj, key) {
    obj = _.extend(obj, { name: key });
    obj = _.defaults(obj, { label: key, icon: 'plus', color: 'blue' });
    return obj = _.extend(obj, {
      viewPath: Router.path("adminDashboard" + key + "View"),
      newPath: Router.path("adminDashboard" + key + "New")
    });
  });
});
