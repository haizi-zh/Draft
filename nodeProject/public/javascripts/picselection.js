$(function(){
    var requestUrl = '/picselection/ajax';
    $("#submit").on('click',function(){
        /*count*/
        var images = [],
            pics = document.forms[0].pic,
            sum = 0;
        for (var i = 0;i < pics.length; ++i){
            if (pics[i].checked){
                images.push(pics[i].value);
                sum++;
            }
        }

        if (sum > 0){
            if(confirm("当前选中了" + sum + "张图片。是否确认提交？")){
                /*get poiId*/
                var poiId = $('.city').attr("data-id"),
                    postData = {
                        poiId: poiId,
                        images: images
                    };
                /*post data*/
                $.ajax({
                    url : requestUrl,
                    type: "POST",
                    data: postData,
                    dataType: "json",
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
                    if (data.code == 0){
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
                        for(var i in data.images){
                            imgBlock =
                            '<div class="pics">' +
                                '<img src="' + data.images[i].url + '?imageView2/1/w/300/h/200" width="300px" height="200px"/>' +
                                '<input class="pic" name="pic" type="checkbox" value="' + data.images[i].url + '"/>' +
                            '</div>';
                            $('form').append(imgBlock);
                        }
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
    })
})