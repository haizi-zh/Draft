$(function(){
    var requestUrl = '/picselection/ajax',
        imgBox = null,
        cropHints = [];
    $("#submit").on('click',function(){
        /*count*/
        var images = [],
            pics = document.forms[0].pic,
            sum = 0,
            index = []
        
	// 筛选索引
        if(!(pics[0] == null || pics[0] == undefined)) {
            for (var i = 0;i < pics.length; ++i){
                if (pics[i].checked){
                    index.push(i);
                    sum++;
                }
            }
            // 获取数据
            var imgTemp;
            for(var i in index){
                var index_i = index[i];
                imgTemp = imgBox[index_i];
                if ((cropHints[index_i].bottom != 0) && (cropHints[index_i].right != 0)){
                    imgTemp.cropHint = cropHints[index_i];
                }
                images.push(JSON.stringify(imgTemp));
            }
        }else{
            if(pics.checked){
                imgBox[0].cropHint = cropHints[0];
                images.push(JSON.stringify(imgBox[0]));
                sum = 1;
            }
        }
        if (sum > 0){
            if(confirm("当前选中了" + sum + "张图片。是否确认提交？")){
                /*get poiId*/
                var poiId = $('.city').attr("data-id"),
                    postData = {
                        poiId: poiId,
                        images : images
                    };
                console.log(postData);
                /*post data*/
                $.ajax({
                    url : requestUrl,
                    type: "post",
                    data: postData,
                    dataType: "json",
                    traditional: true,
                    dataProcess: false,
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success : function (msg) {
                        if (msg.code == 0){
                            alert('提交成功.');
                            $(this).attr('data-submit','true');
                        }
                        else{
                            alert('Failed to submit!');
                        }
                    },
                    error : function () {
                        alert('Error!!!');
                    }
                })
            }
        }else{
            alert('当前并未选中任何图片，请先选择符合合适的图片！');
        }
    })


    $("#next").on('click',function(){
        if ($('#submit').attr('data-submit') == "true"){
            $.ajax({
                url : requestUrl,
                type: "GET",
                data: {},
                success : function (data) {
                    console.log(data);

                    if (data.code == 0){
                        imgBox = data.images;
                        /*modify the DOM*/
                        $('form').remove();
                        $('.city').children('b').text(data.name);
                        $('.city').attr('data-id' , data.poiId);
                        $('.imgCnt').children('b').text(data.images.length);
                        $('.restCity').children('b').text(data.rest);
                        $('.doneCity').children('b').text(data.done);

                        /*add the DOM*/
                        $('.hd').after('<form></form>');
                        var imgBlock;
                        for(var i in imgBox){
                            imgBlock =
                                '<div class="pics">' +
                                    '<a class="img" data-id="' + i + '">' +
                                        '<img src="' + imgBox[i].url + '?imageView2/1/w/225/h/150" width="225px" height="150px"/>' +
                                    '</a>' +
                                    '<input class="pic" name="pic" type="checkbox" value="' + i + '"/>' +
                                '</div>';
                            $('form').append(imgBlock);
                            cropHints[i] = {
                                "top": 0,
                                "left": 0,
                                "bottom": 0,
                                "right": 0
                            };
                        }

                        /*add the imgLayer*/
                        $('a.img').on('click', function(){
                            $('.sd_layer').css("display","block");
                            var index = $(this).attr("data-id");
                                img = '<img id="imageCrop" src="' + imgBox[index].url + '?imageView2/2/w/800/h/600/interlace/1"/>';
                            $('.img_layer .img_can').append(img);
                            $('.img_layer').css("display","block");
                            $('#ow').val(imgBox[index].w);
                            $('#oh').val(imgBox[index].h);

                            var selectFlag = false;//if cut ,the flag change to true
                            function showCoords(c){
                                selectFlag = true;
                                $('#x1').val(c.x);
                                $('#y1').val(c.y);
                                $('#x2').val(c.x2);
                                $('#y2').val(c.y2);
                                $('#w').val(c.w);
                                $('#h').val(c.h);
                                $('#cw').val(jcrop_api.getBounds()[0]);
                                $('#ch').val(jcrop_api.getBounds()[1]);
                            };

                            function clearCoords(){
                                $('#x1').val('');
                                $('#y1').val('');
                                $('#x2').val('');
                                $('#y2').val('');
                                $('#w').val('');
                                $('#h').val('');
                            };

                            $('#imageCrop').Jcrop({
                                onChange: showCoords,
                                onSelect: showCoords,
                                onRelease: clearCoords
                            },function(){
                                jcrop_api = this;
                            });

                            $('#coords').on('change','input',function(e){
                                var x1 = $('#x1').val(),
                                    x2 = $('#x2').val(),
                                    y1 = $('#y1').val(),
                                    y2 = $('#y2').val();
                                jcrop_api.setSelect([x1,y1,x2,y2]);
                            });

                            /*close sdLayer*/
                            $('.sd_layer').on('click', function(){
                                $(this).css("display","none");
                                $('.img_layer').css("display","none");
                                $('#coords input').val('');
                                $('.img_layer .img_can').empty();
                            });
                            $('#close').on('click',function(){
                                $('.sd_layer').trigger('click');
                            })

                            $('#imgSubmit').off('click');
                            $('#imgSubmit').on('click',function(){
                                if (!selectFlag){
                                    if(confirm("并未对该图进行裁剪,是否保持当前尺寸?")){
                                        var ow = $('#ow').val(),
                                            oh = $('#oh').val(),
                                            cropHint;
                                        ow = (ow % 2) ? (ow - 1) : ow;
                                        oh = (oh % 2) ? (oh - 1) : oh;
                                        cropHint = {
                                            "top": 0,
                                            "left": 0,
                                            "bottom": oh,
                                            "right": ow
                                        };
                                        cropHints[index] = cropHint;
                                        alert("裁剪成功!");
                                        $('.sd_layer').trigger('click');
                                    }else{

                                    }
                                }else{
                                    var x1 = $('#x1').val(),
                                        x2 = $('#x2').val(),
                                        y1 = $('#y1').val(),
                                        y2 = $('#y2').val(),
                                        cw = $('#cw').val(),
                                        ch = $('#ch').val(),
                                        ow = $('#ow').val(),
                                        oh = $('#oh').val(),
                                        left = x1 * ow / cw,
                                        top = y1 * oh / ch,
                                        right = x2 * ow / cw,
                                        bottom = y2 * oh / ch,
                                        cropHint= {};
                                    
                                    left = parseInt(left);
                                    left = (left % 2) ? (left + 1) : left;
                                    right = parseInt(right);
                                    right = (right % 2) ? (right - 1) : right;
                                    top = parseInt(top);
                                    top = (top % 2) ? (top + 1) : top;
                                    bottom = parseInt(bottom);
                                    bottom = (bottom % 2) ? (bottom - 1) : bottom;

                                    cropHint = {
                                        "top": top,
                                        "left": left,
                                        "bottom": bottom,
                                        "right": right
                                    };
                                    cropHints[index] = cropHint;
                                    alert("裁剪成功!");
                                    $('.sd_layer').trigger('click');   
                                }
                            });
                        });                        
                    }else{
                        alert('Failed to get data!');
                    }
                },
                error : function () {
                    alert('Error!!!');
                }
            })
        }else{
            alert('请先提交改动!');
        }
    });
    $(window).load(function(){
        $("#next").trigger('click');
        var wHeight = $(window).height(),
            wWidth = $(window).width(),
            imgBoxHeight = 634,
            imgBoxWidth = 1034,
            top = (wHeight - imgBoxHeight)/2,
            left = (wWidth - imgBoxWidth)/2;
        $('.img_layer').css('top' , top);
        $('.img_layer').css('left' , left);
    });
})
