// # Meteor.startup ->
// #   AdminDashboard.addSidebarItem 'Settings',
// #     icon: 'gear'
// #     AdminDashboard.path '/settings'
//     # urls: [
//     #   title: 'New'
//     #   url: AdminDashboard.path '/settings/create'
//     # ,
//     #   title: 'View all'
//     #   url: AdminDashboard.path '/settings'
//     # ]
Meteor.startup(function() {
  AdminDashboard.addSidebarItem('Settings', AdminDashboard.path('/settings'), { icon: 'gear' });
});
