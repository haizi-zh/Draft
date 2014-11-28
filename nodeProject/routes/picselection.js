var express = require('express');
var router = express.Router();
var util = require('util')
var Locality = require('../models/locality').Locality;
var Album = require('../models/album').Album;
var Images = require('../models/images').Images;

router.get('/', function(req, res) {
    res.render('picselection');
});

/* GET users listing. */
router.get('/ajax', function(req, res) {
    console.log('----get----');

    Locality.getTargetData(function(data) {
        if (!data) {
            res.json({code: 1})
        }
        var poiId = data._id,
            //images = data.images,
            name = data.zhName;

        // 通过ID查询数据库，返回images数组！
        Images.findById(poiId, function(images) {
            var images = images;

            Locality.countAll(function(total){
                var totalDoc = total;
                Locality.countDone(function(doneDocNum){
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

router.post('/ajax', function(req, res) {
    console.log('----post----');

    var postData = req.body,
        id = postData.poiId,
        images = postData.images;
        console.log(postData);
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
        Locality.setDoneTag(id, images, function(state) {
            if (!state) {
                res.json({code: 1})
            }
            // TODO update Album
            var count = 0;
            images.forEach(function(elem) {
                var key = elem.key;
                if(elem.cropHint != undefined && elem.cropHint != null) {
                    var cropHint = elem.cropHint;
                    Images.findByKeyAndUpdate(key, cropHint, function(doc){
                        if(doc) {
                            console.log(doc);
                            count = count + 1;
                            console.log(count);
                        }
                    })
                }
            });
            console.log('更新成功');
            res.json({code: 0});
        });
    } else {
        res.json({code: 1});
    }
});

function isArray(obj){
    return (typeof obj=='object') && obj.constructor==Array;
}

module.exports = router;
