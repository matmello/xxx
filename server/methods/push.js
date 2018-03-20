Meteor.methods({
    sendPush: function(push) {

        Meteor.users.find({'profile.token': { $exists: true }}).fetch().forEach((user)=> {

            let salesCount = Sales.find({userId: user._id}).count();

            if ((push.type == 'all' || (push.type == 'never' && salesCount == 0) || (push.type == 'already' && salesCount > 0)) && user.profile.token && user.profile.token.ios) {


                console.log(`sending push notification to ${user.profile.name}`);
                HTTP.call('post', 'https://fcm.googleapis.com/fcm/send', {
                  data: {
                    to: user.profile.token.ios,
                    notification: {
                        title: push.title,
                        body:  push.body,
                    }
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: Meteor.settings.private.fcm.ios,
                  },
                }, function(error, response) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(response);
                  }
                });
            }

        });

        return 1;
    }
});
