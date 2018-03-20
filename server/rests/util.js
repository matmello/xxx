Api.addRoute('contact', {authRequired: false}, {
    post: {
      action() {
             /**
             * @api {post} /contact Send Contact
             * @apiVersion 0.1.0
             * @apiName SendContact
             * @apiGroup Util
             * @apiPermission logged user
             *
             * @apiParam (body) {String} text
             */
        // let telefone = this.bodyParams.phone;
        let text = this.bodyParams.text;

        let userId = this.request.headers['user-id'];
        let authToken = this.request.headers['auth-token'];

        let user = Meteor.users.findOne(userId);

        if (!user) {
          return {
             statusCode: 400,
             body: {status: 'fail', message: 'Usuário não existe'}
           };
        }

        if (!text) {
            return {
                statusCode: 400,
                body: {status: 'fail', message: 'Parâmetros inválidos'}
              };
        }

        Contacts.insert({
            userId: user._id,
            text: text
        });

        return {
            status: 'success',
            message: `Valeu ${user.profile.name} pela sua mensagem! Retornaremos em breve! 😉`
         }
      }
    }
  });
