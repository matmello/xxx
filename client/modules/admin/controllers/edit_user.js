Template.editUser.helpers({
    'btnClass'(type) {
        return this.user().profile.type == type ? 'btn-primary' : 'btn-default';
    }
});

Template.editUser.events({
    'click .btn-role'(e) {
        e.preventDefault();
        Meteor.call('changeProfileType', this.user()._id, $(e.target).data('role'), (err, res) => {
            if (err) {
                toastr.error('Erro inesperado, tente novamente');
            } else {
                toastr.success('Tipo de usuário alterado com sucesso');
            }
        });
    },
    'click .btn-change-pass'(e) {
        e.preventDefault();
        $('#changePass').submit();
    },
    'click #sendReset'(e) {
        e.preventDefault();
        let btn = Ladda.create(document.querySelector('#sendReset'));
        btn.start();
        Accounts.forgotPassword({email: this.user().emails[0].address}, function(error, result){
            if (error) {
              if(error.error==403){
                btn.stop();
                return toastr.error('Usuário não encontrado');
              }
            } else {
              btn.stop();
              toastr.success("E-mail enviado com sucesso");
            }
            });
    },
});

Template.editUser.events({
    'click #confirm-editUser'(e) {
        e.preventDefault();
        const self = this;
        console.log('Ok');

         Meteor.call('setPasswordByAdmin', self.user()._id, $('[name=senha]').val(), $('[name=senhaAdmin]').val(), (err, res) => {
                if (err) {
                    toastr.error('Acesso negado');
                    $('.editUserModal').modal('hide');
                    $('[name=senhaAdmin]').val('');
                    $('[name=senha]').val('');
                    console.log(err);
                } else {
                    toastr.success('Senha alterada com sucesso');
                    $('.editUserModal').modal('hide');
                    $('[name=senhaAdmin]').val('');
                    $('[name=senha]').val('');
                }
            });
    }
});

Template.editUser.onRendered(()=>{
    const self = Template.instance();

    $('#changePass').validate({
        submitHandler() {
            // let btn = Ladda.create(document.querySelector('.btn-change-pass'));
            // btn.start();
            $('.editUserModal').modal('show');
            // Meteor.call('setPassword', self.data.user()._id, $('[name=senha]').val(), (err, res) => {
            //     btn.stop();
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         toastr.success('Senha alterada com sucesso');
            //         $('[name=senha]').val('');
            //     }
            // });
        }
    });
});
