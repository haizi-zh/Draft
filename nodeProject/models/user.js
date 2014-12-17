var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId,
    bcrypt      = require('bcrypt'),
    config      = require('../config'),
    SALT_WORK_FACTOR = 10;

var db = mongoose.createConnection(config.user, function (err) {
  console.log(config.user);
  if (err) {
    console.error('connect to %s error: ', config.user, err.message);
    process.exit(1);
  }
});

var UserSchema = new Schema({
    username    : {type: String},
    password    : {type: String},
    admin       : {type: Boolean, default: false},
    workload    : {type: Number, default: 0}
});

UserSchema.statics.findByName = function(username, callback) {
    this.findOne({username: username}, function(err, data) {
        callback && callback(err, data)
    });
};

// 获取工作量
UserSchema.statics.calulate = function(username, callback) {
    this.findOne({username: username}, function(err, user) {
        callback && callback(err, data)
    });
};

// 工作量＋1
UserSchema.statics.addOne = function(username, callback) {
    this.findOneAndUpdate({username: username}, {$inc:{workload:1}},
        function(err, user){
            callback && callback(err, user)
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();
    // 生成一个hash key
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // 利用hash key来加密密码
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // 数据库存放的是hash值
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        console.log(isMatch);
        cb(null, isMatch);
    });
};


db.model('User', UserSchema, "User");

exports.User = db.model('User');