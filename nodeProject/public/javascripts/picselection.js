$(function(){
    var requestUrl = '/picselection/ajax';
    $("#submit").on('click',function(){
        if(confirm("是否确认提交？")){
            /*count*/
            var images = [],
                pics = document.forms[0].pic;
            for (var i = 0;i < pics.length; ++i){
                if (pics[i].checked){
                    images.push(pics[i].value);
                }
            }
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
                        alert('提交成功');
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
    })
    $("#next").on('click',function(){
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
    })
})