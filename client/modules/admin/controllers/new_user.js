Template.newUser.events({
    'submit form': function(event, template) {
      event.preventDefault();
    },
  });

  Template.newUser.onRendered(function(){
    let self = this;
    var validator = $('form#reg').validate({
      submitHandler: function(event) {

        var params = {
            password: $('[name="senha"]').val(),
            email: $('[name="email"]').val(),
            profile: {
                name: $('[name="nome"]').val(),
                type: $('[name="tipo"]').val(),
            }
        };



        Meteor.call('createUserAdminDashboard', params, function(error) {
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
              toastr.success('Usuário criado com sucesso');
              Router.go(AdminDashboard.path('/Meteor.users'));
            // $('html, body').animate({ scrollTop: 0 }, 'slow');
          }
        });

      },
    });
  });
