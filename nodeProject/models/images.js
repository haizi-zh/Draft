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

var ImagesSchema = new Schema({
    _id: {type: ObjectId},
    key: {type: String},
    url: {type: String},
    cropHint: {type: Object},
    itemIds: {type: Array},
    h: {type: Number},
    w: {type: Number},
    size: {type: Number}
});

ImagesSchema.statics.findById = function(id, callback) {
    console.log("city Id to find images:  " + id);
    var conditions = {
            itemIds: id,
        },
        fields = ['key', 'h', 'w'].join(' ');
    console.log('find images BEGIN');
    this.find(conditions, fields)
        .sort({size: -1})
        .exec(function(err, docs){
	console.log('find images END, and show result:');
	console.log(docs);
        var images = [];
            if(err) {
                callback && callback(images);
                return ;
            }

            if ((typeof docs == 'object') && docs.constructor == Array) {
                for(var i in docs) {
                    var doc           = docs[i],
                        image         = {},
                        host          = "http://lvxingpai-img-store.qiniudn.com/";
                    console.log(doc);
                    image.url = host + doc.key;
                    image.key = doc.key;
                    image.h   = doc.h;
                    image.w   = doc.w;

                    images.push(image);
                }
            }
            console.log(images);
            callback && callback(images)
    })
};



ImagesSchema.statics.findByKeyAndUpdate = function(key, cropHint, callback) {
    console.log('update Images DB ...');
    var conditions = {
            key: key,
        },
        updates = {
            $set: {
                cropHint: cropHint,
            }
        };
    this.update(conditions, updates, function(err, doc) {
        if(err) {
            return ;
        }
        callback && callback(doc)
    })
};

db.model('Images', ImagesSchema, "Images");
exports.Images = db.model('Images');
