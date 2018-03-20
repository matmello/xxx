Meteor.methods({
    'setPassword'(id, password) {
        Accounts.setPassword(id, password);
        return true;
    },
    'setPasswordByAdmin'(id, password, adminPassword) {
        if (ApiPassword.validate({email: Meteor.user().emails[0].address, password: adminPassword})) {
            Accounts.setPassword(id, password);
            return true;
        } else {
            throw new Meteor.Error('password-doesnt-match', "Admin password not validated");
        }
    },
    'changeProfileType'(id, type) {

        if (type == 'ADMIN') {
            Roles.addUsersToRoles(id, 'admin');
        } else {
            Roles.removeUsersFromRoles(id, 'admin');
        }

        Meteor.users.update({_id: id}, {
            $set: {
                'profile.type': type
            }
        });

        return true;
    },
    'createUserAdminDashboard'(params) {
        return Accounts.createUser(params);
    }
});
