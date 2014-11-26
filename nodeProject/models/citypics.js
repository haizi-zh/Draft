// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;
// var config = require('../config');

// // mongoose.connect(config.dbgeo, function (err) {
// //   console.log(config.dbgeo);
// //   if (err) {
// //     console.error('connect to %s error: ', config.dbgeo, err.message);
// //     process.exit(1);
// //   }
// // });

// var CityPicsSchema = new Schema({
//     _id: {type: ObjectId},
//     itemId: {type: String},
//     images: {type: Array}
// });

// CityPicsSchema.statics.findByIdAndUpdate = function(id, images, callback) {
//     console.log('in.......');
//     var conditions = {
//             itemId: id,
//         },
//         updates = {
//             $set: {
//                 images: images,
//                 itemId: id,
//             }
//         },
//         options = {
//             upsert: true,
//             new: true
//         };
//     this.update(conditions, updates, options, function(err, doc){
//         if(err) {
//             return ;
//         }
//         callback && callback(doc)
//     })
// };

// mongoose.model('CityPics', CityPicsSchema, "CityPics");
// exports.CityPics = mongoose.model('CityPics');