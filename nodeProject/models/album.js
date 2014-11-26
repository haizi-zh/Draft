var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var config = require('../config');

var db = mongoose.createConnection(config.dbimagestore, function (err) {
    console.log(config.dbimagestore);
  if (err) {
    console.error('connect to %s error: ', config.dbimagestore, err.message);
    process.exit(1);
  }
});
// // imagestore
// var db = mongoose.createConnection();
// db.open(config.imagestore, 'imagestore');

var AlbumSchema = new Schema({
    _id: {type: ObjectId},
    itemIds: {type: Array},
    image: {type: Object}
});

// 获取images
AlbumSchema.statics.findById = function(id, callback) {
    console.log('in.......');
    var conditions = {
            itemIds: id,
        },
        fields = ['image'].join(' ');

    this.find(conditions, fields, function(err, docs){
        if(err) {
            return ;
        }
        var images = [];
        for(var i in docs) {
            images.push(docs[i].image);
        }
        callback && callback(images)
    })
};

db.model('Album', AlbumSchema, "Album");
exports.Album = db.model('Album');