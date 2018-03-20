Meteor.startup(function () {
    var login = encodeURIComponent(Meteor.settings.private.email.login);
    var password = encodeURIComponent(Meteor.settings.private.email.password);
    var domain = Meteor.settings.private.email.domain;
    var port = Meteor.settings.private.email.port;
    process.env.MAIL_URL = 'smtp://' + login + ':' + password + '@' + domain + ':' + port;
  });

  // Password Reset Configuration

  Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('recuperarsenha/'+token);
  };

  Accounts.emailTemplates.from = 'IS2EAT';

  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return 'Solicitação de mudança de senha em IS2EAT';
  };

  Accounts.emailTemplates.resetPassword.html = function (user, url) {
    return `Olá ${user.profile.name}<br><br>Para resetar sua senha, basta clicar no link abaixo.<br>${url}<br><br>Obrigado.`;
  };
