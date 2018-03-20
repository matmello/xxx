Template.registerHelper('newPath', function() {
    return AdminDashboard.path('/settings/create');
});

Template.registerHelper('formatValue', function(value) {
    if (value.length <= 200) {
        return value;
    } else {
        return value.substring(0,197)+'...';
    }
});
