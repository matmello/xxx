Meteor.methods({
    'registerPreLaunch' (item) {
        return PreLaunch.insert(item);
    }
});
