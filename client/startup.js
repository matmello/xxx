Meteor.startup(function () {
    TAPi18n.setLanguage('pt')
      .done(function (res) {
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
