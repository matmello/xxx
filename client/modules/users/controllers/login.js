Template.login.events({
  'submit form': function(event, template){
    event.preventDefault();
  },
});

Template.login.onRendered(()=>{
  const self = Template.instance();

  const recoverValidator = $('#reg').validate({
    submitHandler() {
      let email = self.find('[name=recoverEmail]').value;
      let btn = Ladda.create(document.querySelector('.recoverBtn'));
      btn.start();

      Accounts.forgotPassword({email: email}, function(error, result){
      if (error) {
        console.log(error);
        btn.stop();
        if(error.error==403){
          return recoverValidator.showErrors({recoverEmail: 'Usuário nāo encontrado'});
        }
      } else {
        console.log(result);
        // sAlert.success('E-mail enviado, clique no link que enviamos para redefinir sua senha.', {effect:"genie", position:"bottom", onRouteClose: false});
        btn.stop();
        toastr.success("E-mail enviado, clique no link que enviamos para redefinir sua senha.");
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('[name=recoverEmail]').val('');
        // Router.go("login");
      }
      });

    }
  });

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
              let userRestaurant = Restaurants.findOne({userId: Meteor.userId()});

              if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Router.go('adminDashboard');
              } else {
                if (userRestaurant) {
                  Session.set('restaurantId', userRestaurant._id);
                  Router.go('dashboard');
                } else {
                  Router.go('registerRestaurant');
                }
              }
          }
        }
      });

    }
  });
});

Template.login.onRendered(()=>{
  const self = Template.instance();

  $('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

});
