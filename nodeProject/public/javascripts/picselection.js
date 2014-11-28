$(function(){
    var requestUrl = '/picselection/ajax',
        originData = null;
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
            console.log(index);
            // 获取数据
            for(var i in index){
                var index_i = index[i];
                console.log(index_i);
                images.push(JSON.stringify(originData[index_i]));
            }
        }else{
            if(pics.checked){
                images.push(JSON.stringify(originData[0]));
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
                        originData = data.images;
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
                                '<a href="' + data.images[i].url + '" target=_blank >' +
                                    '<img src="' + data.images[i].url + '?imageView2/1/w/225/h/150" width="225px" height="150px"/>' +
                                '</a>' +
                                '<input class="pic" name="pic" type="checkbox" value="' + data.images[i].url + '"/>' +
                            '</div>';
                            $('form').append(imgBlock);
                        }
                        // $('#submit').attr('data-submit','false');
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
    });
})
