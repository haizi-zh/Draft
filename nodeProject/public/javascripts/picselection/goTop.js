//页面向上小箭头
//jQuery("<div class='ui_upward_wrapper' id='ui_gotop'><div class='ui_upward_icon'>回页顶</div></div>").prependTo("body");

jQuery(function($){
    var icon = $("#ui_gotop");
    var icon_h = icon.innerHeight(); //获取icon高度

    var doc = $(document);
    var win = $(window);

    var foot = $(".qyer_footer");
    var foot_h = foot.height();
    var isfoot = foot.length;
    var top = 600;
    win.on("scroll",function(){
        var doc_w = doc.width(); //document.width
        var doc_h = doc.height(); //document.height
        var win_w = win.width(); //window.width
        var win_h = win.height(); //window.height

        //var top = win_h - icon_h - 100; //定义当前icon应该所属的top值
        var left = (doc_w - 980) / 2 + 1010; //距离左侧距离
        var right = 10; //距离右侧距离


        // if(isfoot){
        //     var max_h = doc_h - foot_h - doc.scrollTop(); //当前浏览器可视区域
        //     if(win_h > max_h){
        //         top = max_h - icon_h - 30; //定义icon最大top值
        //     }
        // }
        //console.log(doc_w);

        if(doc.scrollTop() == 0) {
            icon.fadeOut(300);
        }
        else if(doc_w > 1200) {
            icon.css({"left":left,"right":"auto","top":top}).fadeIn(300);
        }
        else {
            icon.css({"left":"auto","right":right,"top":top}).fadeIn(300);
        }
    });

    icon.click(function(){
        $("body,html").animate({scrollTop:0});
    });
});