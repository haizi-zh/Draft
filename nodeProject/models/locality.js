var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var LocalitySchema = new Schema({
    _id: {type: ObjectId},
    zhName: {type: String},
    images: {type: Array},
    isDone: {type: Boolean}
});

LocalitySchema.virtual('hasImage').get(function () {
    console.log('--------------');
    // 判断该document的images字段的数组长度不为0
    return this.images.length ? true : false;
});

LocalitySchema.statics.sayHello = function(){
    console.log('Hello World');
};

// 获得一个满足要求的数据
LocalitySchema.statics.getTargetData = function(callback) {
    var conditions = {
            isDone: null,
            $where: 'this.images.length > 0'
        },
        fields = ['_id', 'zhName', 'images'].join(' '),
        options = {
            hotness: -1,
        };

    this.findOne(conditions, fields, options, function(err, data){
        //console.log(data);
        callback && callback(data)
    })
};

// 更新数据，标记完成的数据
LocalitySchema.statics.setDoneTag = function(id, callback){
    // 测试是否可以直接传id？
    console.log(id);
    this.findByIdAndUpdate(id, { $set:{isDone: true}}, function(err, data){
        console.log(data.isDone);
        var state = true;
        if (err) {
            state = false
        }
        console.log(state);
        callback && callback(state)
    })
};

// 总的数据
LocalitySchema.statics.countAll = function(callback){
    this.find().count({}, function(err, count){
        callback && callback(count)
    });
};

// 完成的数据
LocalitySchema.statics.countDone = function(callback){
    this.find().count({isDone: true}, function(err, count){
        callback && callback(count)
    });
};

mongoose.model('Locality', LocalitySchema, "Locality");