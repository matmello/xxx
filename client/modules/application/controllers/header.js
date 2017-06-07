Template.header.helpers({
  firstName() {
    return Meteor.user().profile.name.match('[a-zA-Z]+');
  },
  isSuperAdmin() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  },
});

Template.header.events({
  'click .logout': function(event, template) {
    event.preventDefault();
    Meteor.logout(function(error){
      if (error) {
        console.log(error);
      } else {

      }
    });
  },
});
