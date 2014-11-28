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
    itemIds: {type: Array, index: true},
    image: {type: Object}
});

// 获取images
AlbumSchema.statics.findById = function(id, callback) {
    console.log('in.......');
    var conditions = {
            itemIds: id,
        },
        fields = ['_id', 'image'].join(' ');

    this.find(conditions, fields, function(err, docs){
        var images = [];
        if(err) {
            callback && callback(images);
            return ;
        }

        if ((typeof docs=='object') && docs.constructor==Array) {
            for(var i in docs) {
                var doc = docs[i],
                    _id = doc._id;
                doc.image && (doc.image._id = _id);
                images.push(docs[i].image);
            }
        }
        callback && callback(images)
    })
};

AlbumSchema.statics.updateImage = function(id, image, callback) {
    console.log('updateImage...');
    var update = {
        $set: {image: image}
    };

    this.findByIdAndUpdate(id, update, function(err, doc){
        if(err) {
            return ;
        }
        callback && callback(doc)
    })
};

db.model('Album', AlbumSchema, "Album");
exports.Album = db.model('Album');