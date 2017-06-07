Template.login.events({
  'submit form': function(event, template){
    event.preventDefault();
  },
});

Template.login.onRendered(function(){
  var validator = $('form#log').validate({
    submitHandler: function(event) {
      var user = {
        email: $('[name=email]').val(),
        password: $('[name=senha]').val(),
      };

      Meteor.loginWithPassword(user.email, user.password, function(error){
        if (error){
          if(error.reason=='Incorrect password'){
            validator.showErrors({
              'senha': 'Senha inválida',
            });
          } else if (error.reason=='User not found'){
            validator.showErrors({
              'email': 'Usuário nāo encontrado',
            });
          }
        } else {
          if (Router.current().route.getName()=='login'){
              // Router.go('adminDashboard');
              Router.go('perfil');

          }
        }
      });

    }
  });
});
