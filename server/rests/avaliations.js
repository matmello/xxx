Api.addRoute('avaliation/:id', {authRequired: false}, {
    post: {
        action() {
             /**
             * @api {post} /avaliation/:id Avaliate
             * @apiVersion 0.1.0
             * @apiName Avaliate
             * @apiGroup Restaurants
             * @apiPermission logged user
             *
             * @apiParam (url) {String} id Restaurant Id
             * @apiParam (query) {Integer} rate Restaurant rate in range 1-5
             */
            let id = this.urlParams.id;
            let rate = parseInt(this.queryParams.rate);
            let message = this.queryParams.message;

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if ( rate < 0 || rate > 5 ) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Avaliação inválida, envie um inteiro de 1 a 5'}
                  };
            }

            if(!id||!rate||!userId) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Parâmetros inválidos'}
                 };
              }

            if(!user) {
              return {
                 statusCode: 400,
                 body: {status: 'fail', message: 'Usuário não existe'}
               };
            }

            if(!Restaurants.findOne(id)) {
            return {
                statusCode: 400,
                body: {status: 'fail', message: 'Restaurante não encontrado'}
                };
            }

            // let previousAvaliation = Avaliations.findOne({restaurantId: id});
            let set = {
                $set: {
                    restaurantId: id,
                    userId: userId,
                    rate: rate,
                }
            };

            if (message) {
                set.$set.message = message;
            }

            Avaliations.upsert({restaurantId: id, userId: userId}, set);

            return {
                status: 'success',
                message: 'Restaurante avaliado com sucesso'
             }
        }
    }
});
