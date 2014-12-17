var express = require('express');
var router = express.Router();
var util = require('util')
var ViewSpot = require('../models/viewspot').ViewSpot;
var Images = require('../models/images').Images;
var User = require('../models/user').User;
var pass   = require('../auth/pass');

router.get('/', pass.ensureAuthenticated, function(req, res) {
    res.render('picselection',{
        user: req.user
    });
});

router.get('/search', pass.ensureAuthenticated, function(req, res) {
    var seachText = req.query.search_text;
    console.log('开始查询:');
    console.log(seachText);

    ViewSpot.searchByZhname(seachText, function(data){
        if(!data) {
            res.json({code: 1});
        }
        var poiId = data._id,
            name = data.zhName;
        console.log(poiId);
        // 通过ID查询数据库，返回images数组！
        Images.findById(poiId, function(images) {
            var images = images;

            ViewSpot.countAll(function(total){
                var totalDoc = total;
                ViewSpot.countDone(function(doneDocNum){
                    var done = doneDocNum,
                        rest = totalDoc - done,
                        result = {
                            code: 0,
                            poiId: poiId,
                            images: images,
                            name: name,
                            done: done,
                            rest: rest
                        };
                    res.json(result);
                });
            });
        });
    })
});

/* GET users listing. */
router.get('/ajax', pass.ensureAuthenticated, function(req, res) {
    console.log('----get----');

    ViewSpot.getTargetData(function(data) {
        if (!data) {
            res.json({code: 1});
        }
        var poiId = data._id,
            //images = data.images,
            name = data.zhName;
        console.log(poiId);
        // 通过ID查询数据库，返回images数组！
        Images.findById(poiId, function(images) {
            var images = images;

            ViewSpot.countAll(function(total){
                var totalDoc = total;
                ViewSpot.countDone(function(doneDocNum){
                    var done = doneDocNum,
                        rest = totalDoc - done,
                        result = {
                            code: 0,
                            poiId: poiId,
                            images: images,
                            name: name,
                            done: done,
                            rest: rest
                        };
                    res.json(result);
                });
            });
        });
    });
});

router.post('/ajax', pass.ensureAuthenticated, function(req, res) {
    console.log('----post----');

    var postData = req.body,
        id = postData.poiId,
        images = postData.images;
    if(isArray(images)) {
        for(var i in images) {
            images[i] = JSON.parse(images[i]);
        }
    }else{
        var temp = JSON.parse(images);
        images = [];
        images.push(temp);
    }

    if(id && images && images.length) {
      var workload = '';
      ViewSpot.findById(id, 'isDone', function(err, doc){
        if(doc.isDone == true) {
          workload = 'keep';

          ViewSpot.setDoneTag(id, images, function(data, state) {
              if (!state) {
                  res.json({code: 1})
              }

              var count = 0;
              images.forEach(function(elem) {
                var key = elem.key;
                if(elem.cropHint != undefined && elem.cropHint != null) {
                  var cropHint = elem.cropHint;
                  Images.findByKeyAndUpdate(key, cropHint, function(doc){
                    if(doc) {
                        count = count + 1;
                    }
                  });
                }
              });

              res.json({
                code: 0,
                workload: workload
              });

              console.log(count);
              console.log('更新成功');
          });

        }else {
          User.addOne(req.user.username, function(err, data){
            workload = parseInt(data.workload);

            ViewSpot.setDoneTag(id, images, function(data, state) {
              if (!state) {
                  res.json({code: 1})
              }

              var count = 0;
              images.forEach(function(elem) {
                var key = elem.key;
                if(elem.cropHint != undefined && elem.cropHint != null) {
                  var cropHint = elem.cropHint;
                  Images.findByKeyAndUpdate(key, cropHint, function(doc){
                    if(doc) {
                        count = count + 1;
                    }
                  });
                }
              });

              res.json({
                code: 0,
                workload: workload
              });

              console.log('更新成功');
            });
          });
        }
      });
    } else {
        res.json({code: 1});
    }
});

function isArray(obj){
    return (typeof obj=='object') && obj.constructor==Array;
}

module.exports = router;
