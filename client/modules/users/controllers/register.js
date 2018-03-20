Template.register.events({
  'submit form': function(event, template) {
    event.preventDefault();
  },
});

Template.register.onRendered(function(){
  let self = this;
  var validator = $('form#reg').validate({
    submitHandler: function(event) {

      var user = {
        password: $('[name="senha"]').val(),
        email: $('[name="email"]').val(),
      };

      var profile = {
        name: $('[name="nome"]').val()
      };

      Accounts.createUser({
        password: user.password,
        email: user.email,
        profile: {
          name: profile.name,
          sexo: "",
          nascimento: "",
          telefone: "",
          vinculados: [],
        }
      }, function(error) {
        if(error) {
          if(error.reason=='Username already exists.'){
            validator.showErrors({
              'siape': 'E-mail já cadastrado',
            });
          } else if (error.reason=='Email already exists.'){
            validator.showErrors({
              'email': 'E-mail já cadastrado',
            });
          }
        } else {
          Router.go('registerRestaurant');
          // $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
      });

    },
  });
});
