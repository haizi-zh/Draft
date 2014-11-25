var express = require('express');
var router = express.Router();
var Locality = require('../models').Locality;

/* GET users listing. */
router.get('/', function(req, res) {
    console.log('----get----');
    Locality.getTargetData(function(data) {
        if (!data) {
            res.json({code: 1})
        }

        var poiId = data._id,
            images = data.images,
            name = data.zhName;

        Locality.countAll(function(total){
            var totalDoc = total;
            Locality.countDone(function(doneDocNum){
                var done = doneDocNum,
                    rest = totalDoc - done;
                    result = {
                        code: 0,
                        poiId: poiId,
                        images: images,
                        name: name,
                        done: done,
                        rest: rest
                    };
                res.json(result);
            })
        })
    });
});

router.post('/', function(req, res) {
    console.log('----post----');
    var postData = req.body,
        id = postData.poiId,
        images = postData.images;
    console.log(postData);
    Locality.setDoneTag(id, function(state) {
        if (!state) {
            // update failure
            res.json({code: 1})
        }
        // TODO 写入新的数据库
        // ......
        res.json({code: 0});
    });
});

module.exports = router;
