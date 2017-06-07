Template.createdAt.helpers({
  createdAt() {
    return moment(this.value).format('DD-MM-YYYY');
  }
});
