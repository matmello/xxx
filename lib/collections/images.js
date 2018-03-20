Logos = new FS.Collection("logos",
{ stores: [new FS.Store.FileSystem("logos",
{
  path: '~/uploads',
})] }
);

Logos.allow({
insert: function(userId, doc) {
  return true;
},
download: function(userId, doc) {
  return true;
},
update: function(userId, doc) {
  return true;
},
remove: function(userId, doc) {
  return true;
},
});

Capas = new FS.Collection("capas",
{ stores: [new FS.Store.FileSystem("capas",
{
  path: '~/uploads',
})] }
);

Capas.allow({
insert: function(userId, doc) {
  return true;
},
download: function(userId, doc) {
  return true;
},
update: function(userId, doc) {
  return true;
},
remove: function(userId, doc) {
  return true;
},
});

Images = new FS.Collection("images",
{ stores: [new FS.Store.FileSystem("images",
{
  path: '~/uploads',
})] }
);

Images.allow({
insert: function(userId, doc) {
  return true;
},
download: function(userId, doc) {
  return true;
},
update: function(userId, doc) {
  return true;
},
remove: function(userId, doc) {
  return true;
},
});
