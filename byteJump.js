var act = require("./act.js");
var yxAct = require("./yxAct.js");
// var canvasCommon = require("./canvasCommon.js");
var mainAPP = "云享社区"
var byteJump={}


var ksDzId="like_layout",ksChannelGzId="text_top",ksScId="collect_layout"



byteJump.信息求关注_=function() {

    if (!yxAct.领取任务("信息求关注_")) {
        return false;
    };

    if (text('打开链接并前往APP').exists()) {

        var code = text('打开链接并前往APP').findOne().parent().parent().parent().child(2).child(0).text();
        log(code)
        setClip(code);
        sleep(1000);
    }
   



    act.launch_multi("抖音短视频");
    sleep(4000);

    while (!act.isAppA("抖音短视频")) {

        log("等待抖音打开")
        act.launch_multi("抖音短视频");
        sleep(4000);
    }

    if (text('这不是我复制的口令，我要举报').exists() || text('检测到链接，是否要打开').exists()) {
        act.click_(text('前往'));
        sleep(500);
        act.click_(text("打开看看"));
        sleep(3000);
    }

    if (textContains("作品").exists() && textContains("动态").exists()) {
        act.click_(text('#  关注'));
        log("关注")
        act.click_(text("抖一下"));

    }


    dyAction("attention");

    sleep(1000);

    act.captureScr("抖音关注");

    sleep(1000);

    act.launch_multi(mainAPP)
    sleep(3300)
    yxAct.添加图片(1, "抖音关注");
    sleep(2000);
    act.click_(text("完成任务"))
}
byteJump.信息求赞_=function() {

    if (!yxAct.领取任务("信息求赞_")) {
        return false;
    };

    if (text('打开链接并前往APP').exists()) {

        var code = text('打开链接并前往APP').findOne().parent().parent().parent().child(2).child(0).text();
        log(code)
        setClip(code);
        sleep(1000);
    }


    act.launch_multi("抖音短视频");
    sleep(4000);

    while (!act.isAppA("抖音短视频")) {
       
        log("等待抖音打开")
        act.launch_multi("抖音短视频");
        
        sleep(4000);
        closeDyOutWindow(); 
    }
   
  
    if (text('这不是我复制的口令，我要举报').exists() || text('检测到链接，是否要打开').exists()) {
        act.click_(text('前往'));
        sleep(500);
        act.click_(text("打开看看"));
        sleep(3000);
    }



    dyAction("like");

    sleep(2000);

    act.captureScr("抖音点赞");
    
    sleep(1000);
    back();
    act.launch_multi(mainAPP)
    sleep(3300)
    yxAct.添加图片(1, "抖音点赞");
    sleep(2000);
    act.click_(text("完成任务"))
}
byteJump.其他求助_=function() {

    if (!yxAct.领取任务("其他求助_")) {
        return false;
    };

    if (text('打开链接并前往APP').exists()) {

        var code = text('打开链接并前往APP').findOne().parent().parent().parent().child(2).child(0).text();
        log(code)
        setClip(code);
        sleep(1000);
    }


    act.launch_multi("抖音短视频");
    sleep(4000);

    while (!act.isAppA("抖音短视频")) {

        log("等待抖音打开")
        act.launch_multi("抖音短视频");
        sleep(4000);
    }

    if (text('这不是我复制的口令，我要举报').exists() || text('检测到链接，是否要打开').exists()) {
        act.click_(text('打开看看'));
        sleep(3000);
    }



    dyAction("like");

    sleep(2000);

    act.captureScr("抖音点赞");

    sleep(1000);

    act.launch_multi(mainAPP)
    sleep(3300)
    yxAct.添加图片(1, "抖音点赞");
    sleep(2000);
    act.click_(text("完成任务"))
}
byteJump.信息求赞=function() {

    if (!yxAct.领取任务("信息求赞")) {
        return false;
    };

    if (text('打开链接并前往APP').exists()) {

        var code = text('打开链接并前往APP').findOne().parent().parent().parent().child(2).child(0).text();
        log(code)
        setClip(code);
        sleep(1000);
    }


    act.launch_multi("快手");
    sleep(4000);

    while (!act.isAppA("快手")) {

        log("等待快手打开")
        act.launch_multi("快手");
        sleep(4000);
    }

    if (textContains("分享者").exists()) {
        act.click_(text('去看看'));
        sleep(3000);
    }


    while (!(id(ksDzId).desc("喜欢").exists() && id(ksScId).desc("收藏").exists())) {
        sleep(2000);
    }


    if (id(ksDzId).desc("喜欢").exists() && id(ksScId).desc("收藏").exists()) {

        id(ksDzId).desc("喜欢").findOne().click();
    }





    sleep(2000);

    act.captureScr("快手点赞");

    sleep(1000);

    act.launch_multi(mainAPP)
    sleep(3300)
    yxAct.添加图片(1, "快手点赞");
    sleep(2000);
    act.click_(text("完成任务"))
}
byteJump.信息求关注=function() {

    if (!yxAct.领取任务("信息求关注")) {
        return false;
    };

    if (text('打开链接并前往APP').exists()) {

        var code = text('打开链接并前往APP').findOne().parent().parent().parent().child(2).child(0).text();
        log(code)
        setClip(code);
        sleep(1000);
    }


    act.launch_multi("快手");
    sleep(4000);

    while (!act.isAppA("快手")) {

        log("等待快手打开")
        act.launch_multi("快手");
        sleep(4000);
    }
    sleep(2000);
    closeKSPop();
    sleep(500);
    act.click_(text('去看看'));
    sleep(3000);
    if (textContains("作品").exists() && textContains("动态").exists()) {


        while (!text("取消关注").exists()) {
            act.click_(text('i 关注'));
            sleep(2000);
            log("关注")

        }

        sleep(1000);

        act.captureScr("快手关注");

        sleep(1000);

        act.launch_multi(mainAPP)
        sleep(3300)
        yxAct.添加图片(1, "快手关注");
        sleep(2000);
        act.click_(text("完成任务"))
    }
}
function dyAction(action) {

    closeDyOutWindow();
    var pointDy = diffrentDevPoint();
    if (action === "like") {
        log("图色判断点赞否");
        sleep(100);
        var imgCan = images.captureScreen();
        if (Math.abs(colors.green(images.pixel(imgCan, pointDy.Xz, pointDy.Yz))) - 72 > 10) {
            log("点赞图色为白")
            log("开始点赞点击：" + pointDy.Xz + "," + pointDy.Yz);
            closeDyOutWindow();
            click(pointDy.Xz, pointDy.Yz);

        } //赞 

    }
    if (action === "attention") {

        log("关注")
        sleep(200);
        imgCan = images.captureScreen();
        if (images.detectsColor(imgCan, pointDy.colorGz, pointDy.Xg, pointDy.Yg, 30)) {
            log("开始关注点击：" + pointDy.Xg + "," + pointDy.Yg);
            closeDyOutWindow();
            click(pointDy.Xg, pointDy.Yg);
            sleep(random(1, 2) * 600);
        }
    }


    // return { "点赞": isDzClick, "关注": isGzClick, "无视频": isVideoMiss };
}
function closeDyOutWindow() {

  reg=/下次再说|以后再说|我知道了|关闭页面|稍后再说|暂时不要/

      act.click_(textMatches(reg));
      sleep(150);
      act.click_(descMatches(reg));

    if(text("邀请你体验快手新版大屏模式").exists()||text("立即下载").exists()){act.click_(text("取消"));sleep(2000);}
    
    if (text("进入儿童/青少年模式").exists()) { click("我知道了"); log("不进入儿童/青少年模式"); sleep(500); }
    if (text("个人信息保护指引").exists()) { click("好的"); log(("个人信息保护指引")); sleep(1000); }
    if (text("通知，是件很重要的事情").exists()) { click("稍后"); log("通知，是件很重要的事情"); sleep(1000); }
    if (text("抖音视频提醒您").exists()) {
        id("diamond_qi_immediate_dialog_close").findOne().click();
        log("关闭抖音视频提醒您");
        sleep(1000);
    }
    if (id("diamond_btn_redpackage_close").exists()) {
        id("diamond_btn_redpackage_close").findOne().click();
        sleep(1000);
    }
    if (text("不再提醒").exists()) {
        click("不再提醒");
        sleep(1000);
    }

}
function diffrentDevPoint() {
    if (Math.abs(device.width - 1080) < 50 && Math.abs(device.height - 2160) < 50) {
        log("使用k5pro坐标");
        return {
            Xz: 990, Yz: 1000, colorDz: "#F94873",//红
            Xg: 979, Yg: 822, colorGz: "#FE2D54",//红
            Xp1: 992, Yp2: 1218,
            colorTjZx: 850, colorTjZy: 829
        } //点开右侧评论按钮  
    }
    if (Math.abs(device.width - 1080) < 30 && Math.abs(device.height - 2246) < 30) {
        log("使用z5.xtMoto坐标");
        return {
            Xz: 988, Yz: 1080, colorDz: "#F94D78",//红
            Xg: 979, Yg: 797, colorGz: "#FE2D54",//红
            Xp1: 992, Yp2: 1186,
            colorTjZx: 853, colorTjZy: 855
        } //点开右侧评论按钮  
    }

    if (Math.abs(device.width - 720) < 50 && Math.abs(device.height - 1440) < 50) {
        //抖音坐标；
        log("使用oppo坐标");
        return {
            Xz: 658, Yz: 698, //点赞 
            Xg: 655, Yg: 585,
            Xp1: 657, Yp2: 848 //点开右侧评论按钮  
        }
    }
    if (Math.abs(device.width - 1440) < 60 && Math.abs(device.height - 2560) < 50) {
        //抖音坐标；
        log("使用moto坐标");
        return {
            Xz: 1317, Yz: 990, //点赞 
            Xg: 1317, Yg: 822,
            Xp1: 992, Yp2: 1300 //点开右侧评论按钮  
        }
    }

}
byteJump.头条信息=function() {

    var captureType;//截图方式 =1.只截一张图。2.截两张图

    if (!yxAct.领取任务("头条信息")) {

        log("领取任务失败")
        return false;

    };

    var taskDeatil_ = yxAct.getTaskDeatil();

    reg = /点赞|关注|收藏|评论/;
    if (!reg.test(taskDeatil_)) {
        log("任务目标不明确，取消任务");
        yxAct.cancelTask();
        return false;
    }
    toTaskPage();

    //从这里进入今日头条APP，完成要求并截图；
    分析要求完成任务(taskDeatil_);
    提交图片();
    function 提交图片() {
        //返回云享，并退回任务详情页
        launchApp(mainAPP);
        sleep(3000)
        while (text('今日头条 打开').exists()) {
            back();
            sleep(2000);
        };
        if (!yxAct.currentA() === "任务详情") {
            yxAct.toTaskDetail();
        }


        if (captureType === 1) {
            yxAct.添加图片(1, "头条截图");
        }

        if (captureType === 20) {                 //关注与个人主页截图
            yxAct.添加图片(1, "头条关注");
            sleep(2000);
            yxAct.添加图片(1, "头条个人主页");
            sleep(1500);
        }
        if (captureType === 21) {  //头条评论与个人主页截图
            yxAct.添加图片(1, "头条评论");
            sleep(2000);
            yxAct.添加图片(1, "头条个人主页");
            sleep(1500);
        }
        if (captureType === 22) {  //头条评论与关注截图
            yxAct.添加图片(1, "头条评论");
            sleep(2000);
            yxAct.添加图片(1, "头条关注");
            sleep(1500);
        }



    }

    function tTCurrent() {

        if (text("放映厅").exists() && text("西瓜视频").exists()) {
            log("当前头条主页");
            return "主页";
        }

        if (text("私信").exists() && text("微头条").exists()) {
            log("作者主页");
            return "作者主页"
        }
        if (text("个人主页").exists() && text("浏览历史").exists()) {
            log("我的主页");
            return "个人中心"
        }

        if (text('找不到你想要的页面...').exists() || text('别担心，马上下载今日头条App\n热门新闻随时看').exists()) {
            log("找不到页面");

            return "链接无效";
        }

        if (text('点击红包即可帮我砍价了').exists() && text('有机会获得大奖').exists()) {
            log("第一次砍价选红包");

            return "首次帮砍选红包"
        }
        if (text('来晚啦，我的砍价已过期').exists() || text('啊哦～我的砍价已过期').exists()) {
            log("砍价过期");

            return "砍价过期"
        }
        if (text('我的关注').exists() || text('查看全部').exists()) {
            log("砍价过期");

            return "我的关注"
        }

    }

    function 头条评论() {
        var 评论数 = className("TextView").descContains("评论").findOne().text()
        log("评论数为：" + 评论数);

        if (评论数 > 15) {

            var selectdPl = act.commitArr[random(0, act.commitArr.length)];

        }


        if (评论数 > 15) {

            act.click_(descContains("评论"));
            sleep(2000)
            swipe(300, 1620, 200, 900, 120);
            sleep(2000)

            var commitArr = descContains("赞").boundsInside(900, 400, 1030, device.height).find();


            for (i = 0; i < commitArr.length; i++) {
                if (commitArr[i].parent().parent().parent().parent().child(2).child(0).text().length > 15 && commitArr[i].parent().parent().parent().parent().child(2).child(0).text().length < 100) {
                    var selectdPl = commitArr[i].parent().parent().parent().parent().child(2).child(0).text();
                    break;
                };
            }
        }
        // sleep(2000)



        log(selectdPl);
        sleep(2000)
        log("开始评论")
        act.click_(text('写评论…'));
        sleep(2000);

        if (text(' 优质评论将会被优先展示').exists()) {
            text(' 优质评论将会被优先展示').findOne().setText(selectdPl);
        }
        sleep(2000);
        act.click_(text("发布"));

    }

    function 分析截图任务要求() {

        if (text("添加图片").find().length == 1) {
            captureType = 1
            return;
        }
        var getPicRequestArr = yxAct.getPicRequestText();
        if (getPicRequestArr[0].indexOf("关注")) {

        }
    }

    function toTaskPage() {

        if (text('打开链接并前往APP').exists()) {
            act.滑动屏外控件至可视区(text('打开链接并前往APP'));
            sleep(1000);
            act.click_(text('打开链接并前往APP'))
            sleep(2860);

        }


        // var 关注量 = text("关注").clickable(false).boundsInside(300, 200, 1080, 430).findOne().parent().child(0).text();
        // log("关注量：" + 关注量);
        // var 获赞数 = text("获赞").boundsInside(300, 200, 1080, 430).findOne().parent().child(0).text();
        // log("获赞:" + 获赞数);
        sleep(2000);

        log("step2")
        sleep(300);
        act.click_(text('今日头条 打开'), 3);


        sleep(300);
        // 微信二维码打开的页面
        act.click_(text("安全打开"));

        sleep(2000);
        act.click_(text("允许"))
        // 从微信跳转到今日头条
        while (!(act.isAppA("今日头条") && text("关注").exists())) {
            sleep(2000);
        }

    }



    function 头条关注() {
        act.click_(text("关注").clickable(true));
        sleep(2000);
        if (text("已关注").exists()) {
            act.captureScr("头条关注");

        }

        log("成功")

    }

    function 分析要求完成任务(taskDeatil) {
        // var taskDeatil = yxAct.getTaskDeatil();

        //分析截图要求


        if (taskDeatil.indexOf("搜索") != -1 && text("复制上方内容").exists()) {

            var seachName = act.getStringBetweenTwoChar(taskDeatil, "搜索", "关注")

            act.强行关闭("今日头条");
            sleep(2000);
            act.launch_multi("今日头条");
            while (!(act.isAppA("今日头条") && text("关注").exists())) {
                sleep(2000);
            }
            captureType = 1;
        }


        if (taskDeatil.indexOf("个人主页") != -1 && taskDeatil.indexOf("关注") != -1) {
            log("截一张个人主页图");

            captureType = 20;

        }

        if (taskDeatil.indexOf("任意") != -1 || taskDeatil.indexOf("随便") != -1) {
            log("任意打开一个页面");
            任选一篇();
            
        }

        if (taskDeatil.indexOf("点赞") != -1) {

            log("点赞")
            act.click_(desc("赞"))
            if (desc("已赞").exists()) {
                log("点赞成功")
            }

        }
        if (taskDeatil.indexOf("关注") != -1) {
            log("关注")
            act.click_(desc("关注").clickable(true));
            sleep(2000);
            if (text("已关注").exists()) {
                act.captureScr("头条关注");
            }

        }


        if (taskDeatil.indexOf("收藏") != -1) {
            log("收藏")
            log("收藏"); log("收藏成功" + desc("收藏").findOne().selected())
            act.click_(desc("收藏"))
            sleep(1000);
            if (desc("收藏").exists() && desc("收藏").findOne().selected()) {

                log("收藏成功" + desc("收藏").findOne().selected())
            }

        }

        if (taskDeatil.indexOf("评论") != -1) { log("评论"); 头条评论(); }

        act.captureScr("头条任务");

        sleep(1000)

        if (taskDeatil.indexOf("个人主页") != -1) { log("个人主页"); 个人主页截图(); }

    }

    function 个人主页截图() {

        //  act.强行关闭("今日头条");
        act.launch_multi("今日头条");
        sleep(2000);
        while (desc("返回").exists()) {
            sleep(1000);
            act.click_(desc("返回"));
            sleep(2000);
        }

        while (!(text("放映厅").exists() && text("西瓜视频").exists())) {

            if (text("浏览历史").exists() && text("系统设置").exists()) {
                break;
            }

            sleep(2000);
        }
        act.click_(text("我的"));


        if ((!text("个人主页").exists() && text("浏览历史").exists())) {
            sleep(3000);
        }
        act.captureScr("头条个人主页");


    };

    function 任选一篇() {

        act.click_(text("文章"));
        sleep(1000);
        var titleArr_ = className("TextView").boundsInside(0, 900, 1080, device.height - 300).find();
        var titleArr = [];
        for (var i = 0; i < titleArr_.length; i++) {
            if (titleArr_[i].text().length > 15) {
                titleArr.push(titleArr_[i].text())
            }
        }
        log(titleArr)
        act.click_(text(titleArr[0]))

    }
}
function closeKSPop() {
    if (text("设置青少年模式").findOne(1000) != null) {
        console.log("设置青少年模式");
        sleep(1000);
        我知道了.findOne().click();
    }
    //立即邀请
    if (text("立即邀请").findOne(1000) != null) {
        console.log("立即邀请");
        sleep(1000);
        back();
    }
    act.click_(id("close_btn"));
    sleep(300);
}
module.exports = byteJump;

// 分析任务()

// 头条关注()
// 个人主页截图()

// 头条评论()
// 头条信息()
// click(912,996)

// log(act.获取本机号码())

// act.click_(text("文章"));
// act.clickKj(className("TextView").boundsInside(0,900,1080,device.height-300).findOnce())






/**
 * 分析任务 1、任务要求，2提交图片要求3、如何组织
 * 任务要求关键词：点赞、评论、收藏、关注
 * 添加图片1张 单任务
 * 添加图片两张 关注 个人主页  任务关键词只有关注
 * 添加图片超过两张，直接放弃任务。
 * 
 */

// function 分析截图任务要求() {

//     if (text("添加图片").find().length == 1) {
//         captureType = 1
//         return ;
//     }
//     var getPicRequestArr=yxAct.getPicRequestText();
//     if (getPicRequestArr[0].indexOf("关注")){

//     }
// }

// log(yxAct.getPicRequestText())
// 信息求赞_()
    // 信息求关注_()
    // 信息求赞()


    // 信息求关注()