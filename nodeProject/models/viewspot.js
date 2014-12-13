var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var config = require('../config');

var db = mongoose.createConnection(config.dbpoi, function (err) {
  console.log(config.dbpoi);
  if (err) {
    console.error('connect to %s error: ', config.dbgeo, err.message);
    process.exit(1);
  }
});
// var db = mongoose.createConnection();
// db.open(config.dbgeo, 'geo');

var ViewspotScheme = new Schema({
    _id: {type: ObjectId, index: true},
    zhName: {type: String},
    rating: {type: Number},
    images: {type: Array},
    isDone: {type: Boolean, index: true},
    doing: {type: Boolean, default: false, index: true}
});


// 获得一个满足要求的数据
ViewspotScheme.statics.getTargetData = function(callback) {

    var conditions = {
            isDone: null,
            doing: null,
            images: {$ne: null},
            $where: 'this.images.length >= 0',
        },
        update = {
            $set: {doing: true}
        },
        fields = ['_id', 'zhName'].join(' '),
        options = {
            select: fields,
        };
    console.log('in getTargetData');

    this.findOneAndUpdate(conditions, update, options)
        .sort({rating: -1})
        .exec(function(err, data){
        if(err) {
	    console.log('ERROR in "find target city"');
            console.log(err);
	    return;
        }
        callback && callback(data)
    })
};

// 更新数据，标记完成的数据
ViewspotScheme.statics.setDoneTag = function(id, images, callback){
    // 测试是否可以直接传id？
    console.log(id);
    this.findByIdAndUpdate(id, { $set:{isDone: true, images: images, doing: null}}, function(err, data){
        if(err) {
            return;
        }
        var state = true;
        if (err) {
            state = false;
        }
        callback && callback(state)
    })
};

// 通过中文名字查询数据
ViewspotScheme.statics.searchByZhname = function(name, callback){
    if( !((typeof name == 'string') && name.constructor == String)) {
        return ;
    }
    //console.log("--"+name);
    var conditions = {
            zhName: name,
        },
        update = {
        },
        fields = ['_id', 'zhName'].join(' '),
        options = {
            select: fields,
        };
    console.log('in search certain spot');

    this.findOneAndUpdate(conditions, update, options)
        .exec(function(err, data){
        if(err) {
	    console.log('search data error');
            return;
        }
        console.log("输出查询结果：");
        //console.log(data);
        callback && callback(data)
    })
};

// 总的数据
ViewspotScheme.statics.countAll = function(callback){
    this.find().count({}, function(err, count){
        callback && callback(count)
    });
};

// 完成的数据
ViewspotScheme.statics.countDone = function(callback){
    this.find().count({isDone: true}, function(err, count){
        callback && callback(count)
    });
};

db.model('ViewSpot', ViewspotScheme, "ViewSpot");

exports.ViewSpot = db.model('ViewSpot');
