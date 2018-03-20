// Global API configuration
Api = new Restivus({
    useDefaultAuth: false,
    // auth: {
    //   token: 'services.resume.loginTokens.hashedToken',
    //   user: function() {
    //     return {
    //         userId: this.request.headers['x-user-id'],
    //         token: Accounts._hashLoginToken(this.request.headers['x-auth-token'])
    //       };
    //   },
    // },
    prettyJson: true,
    onLoggedIn: function() {
      // console.log(this.bodyParams);
    }
  });
