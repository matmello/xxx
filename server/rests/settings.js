Api.addRoute('settings/terms', {authRequired: false}, {
    get: {
         /**
         * @api {get} /settings/terms Get Terms
         * @apiVersion 0.1.0
         * @apiName GetTerms
         * @apiGroup Settings
         * @apiPermission none
         *
         */
      action() {
          return {
              status: 'success',
              data: AdminSettings.get('termos')
          }
      }
    }
  });
