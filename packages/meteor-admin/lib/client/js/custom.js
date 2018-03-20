Template.pushWidget.events({
  'click #confirm-push'(e, t) {
    e.preventDefault();

    let push = {
      type: $("[name=pushRadio]:checked").val(),
      title: $("[name=pushTitle]").val(),
      body: $("[name=pushBody]").val(),
    };

    if (!push.type || !push.title || !push.body) {
      return toastr.error("Por favor, preencha todos os campos");
    }

    Meteor.call('sendPush', push, (err, res) => {
      if (err) {
        toastr.error("Erro inesperado");
      } else {
        toastr.success("Notificações enviadas com sucesso");
        $('#pushModal').modal('hide');
      }
    })

  }
});

Template.AdminSidebar.events({
    'click .br-flag'(e) {
        e.preventDefault();
        TAPi18n.setLanguage('pt')
        .done(function (res) {
          })
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });
    },
    'click .gb-flag'(e) {
        e.preventDefault();
        TAPi18n.setLanguage('en')
        .done(function (res) {
          })
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });
    }
});

Template.AdminDashboardView.helpers({
  collectionLabel() {
    return AdminDashboard.collectionLabel(this.admin_table.name).slice(0, -1);;
  },
});
