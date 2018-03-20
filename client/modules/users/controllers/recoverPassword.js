Template.recoverPassword.events({
    'submit #rec'(e, t) {
      e.preventDefault();
    }
  });

  Template.recoverPassword.onRendered(()=>{
    const self = Template.instance();

    const validator = $('#rec').validate({
      submitHandler() {
        let password = self.find('[name=senha]').value;

        Accounts.resetPassword(
       Session.get('resetPasswordToken'),
       password,
       function (error) {
         if (error) {
           console.log(error);
           if(error.error==403){
             Session.set('resetPasswordToken', null);
            //  sAlert.error('Token expirado, solicite um novo token.', {effect:"genie", position:"bottom", onRouteClose: false});
             toastr.error("Token expirado, solicite um novo token.");
            //  Router.go('resetPassword');
           }
           else {
            //  sAlert.error(error.reason, {effect:"genie", position:"bottom", onRouteClose: false});
             toastr.error(error.reason);
           }
         } else {
           // Get rid of the token so the forms render properly when they come back.
           Session.set('resetPasswordToken', null);
          //  sAlert.success('Senha alterada com sucesso.', {effect:"genie", position:"bottom", onRouteClose: false});
          toastr.success("Senha alterada com sucesso.");
          Router.go('adminDashboard');
         }
       });

      }
    });

  });
