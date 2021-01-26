var act = require("./act.js");
var wechat = require("./wechat.js");
var yxAct = require("./yxAct.js");

var wxTask = {}

// images.requestScreenCapture();
// sleep(355);
/**
 * 关注任务task
 * 1、选年级 
 * 2、落叶打卡  1、微信授权 2 关闭打开广告 3 点击打卡观看30s视频广告 4关闭广告返回 5、重复三次  截图提交
 * 3、赞丽打卡  
 * 4、开心卡卡
 * 任务中出现打卡x次，直接打卡，如果出现点击广告% 截这个图；
 */
var mainApp = "云享社区"


function closePop() {


    if (text('该地址使用了非标准端口，无法评估其安全性，请谨慎访问。').exists()) {
        text('继续访问').findOne().click();
    }




    if (text("确定").exists()) {
        act.clickKj(text("确定").findOne());
        sleep(1000);

    }
    if (text("制作不易看完广告即可播放，同时系统为您自动切换到独享高速线路").exists()) {
        act.clickKj(text("确定").findOne());
        sleep(1000);

    }

    if (text("阅读全文").exists()) {
        act.clickKj(text("阅读全文").findOne());
        toastLog("点击展开全文");
    }

    if (text("关闭").boundsInside(10, 10, 1080, 320).exists() && text("广告").boundsInside(10, 10, 1080, 320).exists()) {
        关闭数秒视频广告()
    }



    wechat.微信授权()


    sleep(5000);
}


function 关闭数秒视频广告() {
    if (currentA() === "30s视频广告") {
        log("视频广告")
        for (var i = 0; i < 40; i++) {
            if (text("已获得奖励").exists()) {
                act.clickKj(text("关闭").findOne());
                sleep(1000);
                break;
            }
            sleep(1000);
        }
    }

    act.captureScr("30s广告截图");

}

wxTask.打卡 = function (count) {

    for (i = 0; i < count; i++) {
        log("循环" + i + "次")

        sleep(3 * 1000);
        for (var t = 0; t < 10; t++) {

            if (!textContains("秒后").exists()) {
                break;
            }

            toastLog(" 等待倒计时");
            sleep(3200);
        }

        closePop();

        if (text("点击打卡").exists()) {
            act.clickKj(text("点击打卡").findOne());
        }

        sleep(1500);
        closePop()
        if (text("点击打卡").exists()) {
            act.clickKj(text("点击打卡").findOne());
        }
        closePop()

        if (text('总是保持以上选择，不再询问').exists()) {
            act.clickKj(className("CheckBox").findOnce(1));
            sleep(2 * 1000);
            act.clickKj(text("允许").findOne());
            sleep(3000)
        }
        closePop()
        关闭数秒视频广告()
        act.captureScr("30s视频广告");
        closePop()
        function 点击广告() {

            if (text("立即下载").exists() || text("立即下载").exists()) {
                click();
            }

            sleep(3000);
            act.captureScr("打开或下载广告截图");

        }

        sleep(5 * 1000);
        if (text("确定").exists()) {
            act.clickKj(text("确定").findOne());
            sleep(1000);

        }
        sleep(5 * 1000);
    }

    act.captureScr("打卡次数截图")
}



function currentA() {

    if (text("关闭").boundsInside(10, 10, 1080, 320).exists() && text("广告").boundsInside(10, 10, 1080, 320).exists()) {
        log("30s视频广告页");
        return "30s视频广告";
    }

    if (text("通讯录").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前通讯录页");
        return "通讯录"
    }
    if (text("发现").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前发现页");
        return "发现"
    }

    if (textContains("朋友圈").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前朋友圈");
        return "朋友圈"
    }
    if (textContains("微信号").boundsInside(10, 260, 1070, 430).exists()) {
        log("当前个人主页");
        return "个人主页"
    }
    if (textContains("选择").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前转发页");
        return "转发"
    }
    if (desc("切换到按住说话").boundsInside(0, 1848, 1080, 2202).exists()) {
        log("当前聊天窗口");
        return "聊天窗口"
    }

}

wxTask.关注 = function () {


    if (currentA() === "任务类型") {

        toastLog("领取关注任务")
        act.clickKj(text("关注").depth(15).findOne());
        sleep(2000);
    }



    sleep(2000);
    if (currentA() === "任务状态") {
        log(2)
        act.clickKj(text("完成悬赏").depth(17).findOne());
        sleep(2000);
    }

    sleep(2000);
    if (currentA() === "任务详情") {

        if (taskType() != "关注") {
            toastLog("未领取关注任务，跳出");
            return
        }
        log("开始任务")
        var taskTxt = yxAct.getTaskTxt();
        act.clickKj(text("分享上方链接到微信").findOne());
        sleep(4000);

        if (wechat.waitWechat()) {
            if (wechat.shareToFileTransfer()) {
                wechat.explorLinkFromTalkActivety("指定", taskTxt)
            };
            公众号阅读_();
            if (!taskStatus) {
                toastLog("任务取消，跳过此次循环");
                return;
            }
            sleep(2000);
            captureScr(yunshareCapture1);
            sleep(300);
            //关闭阅读窗口
            if (desc("返回").exists()) {
                toastLog("关闭阅读窗口")
                act.clickKj(desc("返回").findOnce());
            }

            if (currentA() != "任务详情") {
                launchApp(mainApp);
                sleep(3000);
                yxAct.toTaskDetail();
            }


            submitPic(0);



        } else {
            restartTask();

            公众号阅读();
            return;
        }



    } else {

        restartTask();
        公众号阅读();
    }
}


wxTask.微文阅读 = function () {

    yxAct.restartTask();

    for (var i = 0; i < 30; i++) {
         
        if (yxAct.currentA() === "任务类型") {

            toastLog("开始微文阅读任务")
            act.clickKj(text("微文阅读").findOne());
            sleep(2000);
        }

        sleep(2000);
        if (yxAct.currentA() === "任务状态") {
            log(2)
            act.clickKj(text("完成悬赏").findOne());
            sleep(2000);
        }

        sleep(2000);
        if (yxAct.currentA() === "任务详情") {
            // log("阅读第"+i+"次赏金："+yxAct.赏金())
            log("开始任务")
            var taskTxt = yxAct.getTaskTxt();


            yxAct.赏金();
            yxAct.taskMatchFailedCancel("微文阅读");
            act.clickKj(text("开始任务").findOne());
            sleep(500);
            // if (id("name").text("微信").exists()) {
            //     act.click_(id("name").text("微信"));
            //     sleep(1000);
            // }
            // sleep(4000);


            if (wechat.waitWechat()) {
                if (wechat.shareToFileTransfer()) {
                    wechat.explorLinkFromTalkActivety("指定", taskTxt)
                };
                var switch_ = 公众号阅读_();

                if (switch_ === "OK") {
                    log("阅读完成")
                    yxAct.cancelTask();
                    return;
                }

                if (switch_ === "err") {
                    yxAct.cancelTask();
                    continue;
                }
                if (switch_ === false) {
                    yxAct.cancelTask();
                    return;
                }
                sleep(2000);

                var imgName = "wxRead" + random(10, 1000);
                act.captureScr(imgName);
                sleep(300);
                //关闭阅读窗口
                if (desc("返回").exists()) {
                    toastLog("关闭阅读窗口")
                    act.clickKj(desc("返回").findOnce());
                }

                if (yxAct.currentA() != "任务详情") {
                    act.launch_multi(mainApp);
                    sleep(3000);
                    yxAct.toTaskDetail();
                }

                if (yxAct.currentA() === "任务详情") {
                    yxAct.上传截图单(imgName);
                }
                if (yxAct.currentA() === "任务详情") {
                    act.clickKj(text("完成任务").findOne());
                }


            } else {
                yxAct.restartTask(mainApp);

                wxTask.微文阅读();
                return;
            }



        } else {

            yxAct.restartTask(mainApp);
            wxTask.微文阅读();
        }
    }
    function 公众号阅读_() {

        log("开始阅读")
        sleep(5 * 1000);




        for (var i = 0; i < 3; i++) {

            //阅读检测不通过
            if (text('错误原因：阅读量不涨,未通过检测\n处理结果：本次阅读已取消\n解决方案：请明天再阅读,可先做其他习').exists()) {

                log("错误原因：阅读量不涨,未通过检测\n");
                // yxAct.cancelTask();
                taskList.setTaskStorage("微文阅读", false);
                return "false"
            }
            //当前小时已达最大阅读次数
            if (textContains("当前小时已达最大阅读次数").exists()) {

                className("android.view.View").text("继续操作").findOne().click()
                sleep(2 * 1000);

                toastLog("当前时间内任务完成，停止执行")

                taskList.setTaskStorage("微文阅读", new Date().getTime());
                return "OK";

            }


            if (textContains("本微信号今日尚未检测,按如下操作").exists()) {
                log("我知道")
                act.click_(text("我知道了"), 3);
                sleep(10 * 1000);
                toastLog("今日检测");
                if (id("activity-name").findOne(1000) != null) {
                    if (act.strSimilarity2Percent(taskTxt, id("activity-name").findOne(1000).text()) <= 0.6) {
                        back();
                        sleep(5000);
                        back();
                        sleep(5000);
                    }
                    if (act.strSimilarity2Percent(taskTxt, id("activity-name").findOne(1000).text()) > 0.6) {
                        sleep(5000);
                    }
                } else {
                    return "err"
                }

            }

            closePop();

            if (text("该内容已被发布者删除").exists()) {
                toastLog("阅读内容已被删除");
                sleep(1 * 1000);
                return "err"
            }
            // swipe(300, 920, 200, 400, 130); //恰好滚动一页

            if (!id("readTxt").exists()) {

                wechat.refreshArticle();
            } else {//刷新页面

                act.滑动屏外控件至可视区(id("readTxt"));
                act.拖动控件至纵坐标(id("readTxt"), 800);
                toastLog("翻页阅读");
                sleep(500);
            }
            if (id("readTxt").boundsInside(0, 0, 1080, 2000).visibleToUser(true).exists()) {

                toastLog("阅读结束")
                return "ok";

            }
        }
    }
}
wxTask.其他阅读 = function () {
    var imgName1 = "第一张"
    var imgName2 = "第二张"
    var imgName3 = "第三张"
    sleep(2000);
    try {
        yxAct.restartTask(mainApp);
        for (var i = 0; i < 10; i++) {
            if (yxAct.currentA() === "任务类型") {
                sleep(300);
                toastLog("开始其他阅读任务")
                act.clickKj(text("其他阅读").findOne());
                sleep(1000);

                if (text('当前类别无任务或者你已屏蔽，请从其它类别接任务到屏蔽页面解除屏蔽').exists()) {
                    log("没有任务或已被屏蔽");
                    yxAct.setTaskStorage("其他阅读", new Date().getTime());
                    return false;
                }
            }


            sleep(2000);
            if (yxAct.currentA() === "任务详情") {



                if (yxAct.taskMatchFailedCancel("其他阅读")) {
                    continue;
                }

                var taskTxt = yxAct.getTaskTxt();
                if (!taskTxt) {
                    continue;
                }

                log("赏金为：" + yxAct.赏金());
                if (text("添加图片").find().length > 2) { yxAct.cancelTask(); continue; }
                log("开始任务")

                log(yxAct.getTaskDeatil())

                if (act.isRoot()) {
                    log("已root设备，shell打开网址")
                    var link = yxAct.复制链接();
                    if (link) {
                        shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d ' + link, true);
                        sleep(5000);
                    }
                }

                if (yxAct.currentA() === "任务详情") {
                    act.click_(text("开始任务"), 2);
                    sleep(500);
                    if (id("name").text("微信").exists()) {
                        act.click_(id("name").text("微信"));
                        sleep(1000);
                    }
                    sleep(4000);

                    if (wechat.waitWechat()) {
                        if (wechat.shareToFileTransfer()) {
                            wechat.explorLinkFromTalkActivety("指定", taskTxt)
                        }
                    }
                }

                if (!wechat.currentA() === "公众号文章") {
                    sleep(3 * 1000)
                } else {
                    公众号阅读_();
                }
                sleep(1300);
                //关闭阅读窗口
                if (desc("返回").exists()) {
                    toastLog("关闭阅读窗口")
                    act.clickKj(desc("返回").findOnce());
                }

                if (yxAct.currentA() != "任务详情") {
                    act.launch_multi(mainApp);
                    sleep(3000);
                    yxAct.toTaskDetail();
                }

                提交图片()

            } else {
                yxAct.restartTask(mainApp);
                continue;
            }



        }
    } catch (err) { log(err) }

    function 公众号阅读_() {
        try {
            var reg = /全部展开|展开全部|查看全文|显示全文|全文查看|展开查看全文|展开显示全文|展开阅读全文|展开阅读全文>>|展开显示全文>>|展开查看全文>>|点击展开全文|点击展开全文>>|点击显示全文>>|点击阅读全文|点击阅读全文>>|继续阅读|阅读|展开|全文|阅读全文|点击查看全文/
            sleep(8 * 1000);
            closePop();
            act.captureScr(imgName1);

            for (var i = 0; i < 6; i++) {

                sleep(888);
                closePop();
                // log("1");
                
                act.click_(text("继续阅读"));

                if (i < 2) {
                    if (!textContains("58本地").exists()) {

                        
                        if (textMatches(reg).boundsInside(0, 0, 1080, 2000).visibleToUser(true).exists() || 点击可疑图片()) {
                            log("2")
                            log(textMatches(reg).boundsInside(0, 0, 1080, 2000).visibleToUser(true).findOne().text());
                            act.clickKj(textMatches(reg).boundsInside(0, 0, 1080, 2000).visibleToUser(true).findOne());
                            sleep(3000);
                            log("3")
                            act.captureScr(imgName2);
                        }

                    }
                }



                if (text("该内容已被发布者删除").exists()) {

                    toastLog("阅读内容已被删除");
                    sleep(1 * 1000);
                    // cancelTask()
                    // taskStatus=false;
                    // return false;
                }

                if (i < 2) {
                    swipe(300, 920, 200, 400, 110);
                } else {
                    swipe(300, 1620, 200, 600, 110);
                }

                log("翻页阅读");
                sleep(500);

            }

            act.captureScr(imgName3);
        } catch (err) {
        }

    }
}

// 点击可疑图片()
function 点击可疑图片() {
    var imgWidget = className("Image").boundsInside(300, 300, 800, 1200).find();
    if (imgWidget.length === 0) { log("无图片"); return false; }

    imgWidget.forEach(function (element) {
        if (element.bounds().height() < 100 && element.bounds().width() < 580) {
            log("点击可以图片"+element);
            act.clickKj(element);
            
            return true;
        }
        sleep(100);
    });
    return false
}

function 提交图片() {
    log("开始提交图片")
    act.launch_multi(mainApp);
    sleep(2000);
    yxAct.toTaskDetail();
    if (yxAct.currentA() === "任务详情") {

        log("start commit")
        if (text("添加图片").find().length === 1) {
            yxAct.添加图片(1);
            sleep(1000);
            yxAct.selectPic("第三张");
            return;
        }
        if (text("添加图片").find().length === 2) {

            yxAct.添加图片(1);
            sleep(2000);
            if (text("第二张.png").exists()) {
                yxAct.selectPic("第二张");
                sleep(2000);
            } else {
                yxAct.selectPic("第一张");
                sleep(2000);
            }
            yxAct.添加图片(1);
            sleep(1000);
            yxAct.selectPic("第三张");
        }
        for (var t = 0; t < 3; t++) {
            if (yxAct.currentA() === "任务详情") {
                break;
            }
            sleep(2000)
        }

        while (yxAct.currentA() === "任务详情") {

            // act.clickKj(text(taskName).findOne());
            if (yxAct.currentA() === "任务类型") {
                break;
            }

            act.clickKj(text("完成任务").findOne());


            sleep(3000);
        }
        // act.delImg("第一张");
        // sleep(400);
        act.delImg("第二张");
        // sleep(400);
        // act.delImg("第三张");
        // sleep(400);
    }
}

wxTask.分享朋友圈 = function () {


    if (!yxAct.领取任务("分享朋友圈")) {
        toastLog("朋友圈任务领取失败")
        return;
    }
    sleep(5000);
    if (yxAct.currentA() === "任务详情") {

        if (!yxAct.isCurrentTaskPage("分享朋友圈")) {
            log("任务领取错误，取消");
            yxAct.cancelTask();
        }

        log(yxAct.赏金());
    }


    var regTaskKey = /复制文字|带上图片|图片|带图片/g
    // var taskDeatial = "复制2文字带我图片分享朋友圈上传正确的图片"
    if (yxAct.getTaskTxt() === '1、打开链接点击右上角3个点 选择分享到朋友圈，2，分享时记得带任务要求的评论  3、截图参考样图。') {

        log("分享文章")
        if (yxAct.getTaskTxt().match(regTaskKey)) {
            // picText();
            yxAct.cancelTask();
            return false;
        } else {
            shareArticle();
        }
    } else {
        yxAct.cancelTask();
        return false;
    }




    if (wechat.currentA() === "朋友圈") {

        act.captureScr("朋友圈");
        sleep(2000);
    }

    //添加图片

    act.launch_multi(mainApp);
    sleep(3000);

    yxAct.添加图片(1);
    sleep(1000);
    yxAct.selectPic("朋友圈")

    sleep(2000);

    act.click_(text("完成任务"));

    log("朋友圈完成");

    function shareArticle() {
        if (text("分享上方链接到微信").exists()) {

            log("分享上方链接到微信")
            var wxLink = yxAct.复制链接();
            if (wxLink && wxLink.indexOf("http") === -1) {
                log("非法链接，跳往下一步");
                return;
            }

        }
        yxAct.分享到微信打开链接();
        sleep(5000);
        wechat.shareArticleToFriendCircle();
        sleep(2000);
        wechat.fromReadToFriendCircle();
        sleep(2000);
    }

    function picText() {
        //yxAct.getTaskDeatil();

        var taskRequire = yxAct.taskStepDetailReg(regTaskKey);
        if (Array.isArray(taskRequire)) {
            wechat.shareImgTextToFriendCircle(taskRequire[0], taskRequire[1]);
            sleep(3000);
        }
    }
}

wxTask.星月追剧 = function () {

    closePop();

    if (currentA() === "剧场首页") {
        act.clickKj(className("ListView").depth(20).findOne())
        sleep(5000);
    }
    closePop()
    if (currentA() === "影片详情") {
        var video = [];
        act.clickKj(text("开始播放").findOne());
        sleep(5000);
    }
    closePop()
    if (currentA() === "播放页") {
        if (!text("播放").exists()) {
            closePop()
            act.clickKj(className("Button").text("进度条").depth(22).findOne())
        }
        closePop()
        拉动播放进度条()
        sleep(5000);
    }



    // 拉动播放进度条()


    function 拉动播放进度条() {
        //控件定位根据“全屏”或者“进度条”这些定位条件找出父控件，根据父控件定位子控件 
        //parent()唯一，而children()不唯一为对象数组，所以要用child(num)来定位
        if (text("").exists()) {
            var 进度圆点rect = className("Button").text("进度条").depth(22).findOne().child(0).child(2).bounds();
            var 进度条长度 = (className("Button").text("进度条").depth(22).findOne().child(0).bounds().right - className("Button").text("进度条").depth(22).findOne().child(0).bounds().left)
            log("进度条长度" + 进度条长度)
            var timeS = text("全屏").findOne().parent().child(0).text(); //时间进度
            timeS = timeS.substring(0, timeS.indexOf(":"));
            timeS = parseInt(timeS);
            log("当前进度：" + timeS + "分")
            if (timeS > 30) {
                toastLog("播放进度已超30分");
                return true;
            }

            var timeE = text("全屏").findOne().parent().child(2).text()
            timeE = timeE.substring(0, timeE.indexOf(":"));
            timeE = parseInt(timeE);
            log("视频时长为：" + timeE + "分")

            var tempC = ((35 - timeS) / timeE).toFixed(1) //计算剩余分钟占总时长比例
            log("比例" + tempC)

            //计算拉动长度

            var x1 = 进度圆点rect.centerX();
            var y = className("Button").text("进度条").depth(22).findOne().child(0).child(2).bounds().centerY();
            var x2 = x1 + 进度条长度 * tempC
            log("从坐标", x1 + "," + y + "拉到" + x2 + "," + y)
            swipe(x1, y, x2, y, 3000)
        }

    }

    function currentA() {

        if (text("关闭").boundsInside(10, 10, 1080, 320).exists() && text("广告").boundsInside(10, 10, 1080, 320).exists()) {
            log("30s视频广告页");
            return "30s视频广告";
        }
        if (text("首页").boundsInside(10, 1900, 1080, 2200).exists() && text("专题").boundsInside(10, 1900, 1080, 2200).exists() &&
            !text("开始播放").exists()) {
            log("剧场首页");
            return "剧场首页";
        }
        if (text("开始播放").exists() && !text("分享提速").exists()) {
            log("影片详情");
            return "影片详情";

        }
        if (text("分享提速").exists()) {
            log("播放页面");
            return "播放页";
        }
    }
}
/**
 * 答对3道题
 */
wxTask.答题 = function () {
    closePop()
}

wxTask.京喜助力 = function () {
    if (className("android.widget.TextView").text("口令有误，立即反馈").exists()) {
        id("jingkouling_goto_detail").findOne().click();
    }

    sleep(2000);

    if (className("android.view.View").text("“你已经帮我助力过啦，谢谢你的一番好意”").exists()) {
        log("已助力过，取消任务");
        cancelTask();

    }

    if (className("android.view.View").text("“你今天已用完3次助力机会，不能帮我助力啦”").exists()) {
        log("助力3次已满");

    }

    if (className("android.view.View").text("“谢谢你帮我助力，我离领红包更近一步啦”").exists()) {
        log("助力领红包成功");
        截图();
        提交任务();

    }




    function cancelTask() { }


}




wxTask.微文帮投 = function () {


    if (yxAct.currentA() != "任务详情") {

        if (!yxAct.领取任务("微文帮投")) {
            log("领取任务失败")
            taskList.setTaskStorage("微文帮投", new Date().getTime());
            return;
        };

    }
    // 领取任务
    gettask();

    // yxAct.setTaskStorage("投票任务","投票任务当前状态为 【投:威海幸福店】【投:菏泽人民路店】【投:菏泽黄河路店】【投:威海幸福店】找到候选人选勾截图---和向下拉点击投票按钮后返回找到候选人已选露出票数两张截图")
    var taskTxt = yxAct.getTaskStorage("投票任务")

    //获取候选人数组

    var voteArr = getTaskArry(taskTxt);
    toastLog("投票给:" + voteArr);
    //去重
    voteArr = act.unique(voteArr);
    toastLog("投票给2:" + voteArr);

    /**
     *  投票方式有单表单单选，单表单多选，多表单单选，多表单多选；
     * 1、任务分析是多候选人，还是单候选人。
     * 解决问题的折中方法：先点击选定候选人，再随机选择不能为空的list，完成任务
    */

    //转到微信投票页
    // 转微信投票页();
    sleep(10 * 1000);
    //候选人数组转为控件ID数组    
    var voteIdArr = [];
    voteArr.forEach(function (element) {
        log(element);
        var tempId = getCheckBoxId(element);
        log("tempID:" + tempId);

        if (tempId.length == 1) {

            voteIdArr.push(tempId[0]);
        }

        if (tempId.length > 1) {
            voteIdArr = voteIdArr.concat(tempId);
        }

    })
    log("候选人ID数组：" + voteIdArr)

    //判断是否取到Id，如果失败，return
    if (Array.isArray(voteIdArr)) {
        if (voteIdArr.length === 0) {

            return false;
        }
    } else {
        log("取不到ID，退出")
        return false;
    }



    //循环选择候选人 执行两次，防止错选，漏选
    selectCandidateLoop()
    selectCandidateLoop()
    function selectCandidateLoop() {
        voteIdArr.forEach((element) => {
            if (!id(element).findOne().checked()) {
                selectCandidate(element);
                sleep(3000);
            }
        })
    }
    sleep(2000);

    //填充空白list
    if (voteArr.length > 1) {
        log("填充空表")
        填充空List();
    }

    //滑动漏出候选人
    act.滑动屏外控件至可视区(id(voteIdArr[0]));
    sleep(1000)
    act.拖动控件至纵坐标(id(voteIdArr[0]), 500)
    sleep(2000);
    //截图
    act.captureScr("已选");
    sleep(2000)

    //投票
    vote();
    sleep(4 * 1000);
    while (!id(voteIdArr[0]).exists()) {
        sleep(2000);
    }
    //滑动漏出已选候选人
    if (id(voteIdArr[0]).exists() && id(voteIdArr[0]).findOne().text().indexOf("已选") != -1) {
        act.滑动屏外控件至可视区(id(voteIdArr[0]));
        sleep(1000)
        act.拖动控件至纵坐标(id(voteIdArr[0]), 500)
        sleep(2000);
    }

    //截图前应检查是否在已投页面，后补
    if (id(voteIdArr[0]).findOnce().text().indexOf("已选") != -1) {
        sleep(2000);
        act.captureScr("已投");
    }
    //关闭页面
    wechat.wechatBack();
    // 返回提交图片
    commitPic();

    // 选择
    function selectCandidate(idtxt) {
        log("选择候选人");
        var i = 0;
        if (id(idtxt).exists()) {
            while (!id(idtxt).findOne().checked()) {
                id(idtxt).findOne().click();
                sleep(1000);
                i++;
                if (i > 3) {
                    taskStatus = false;
                    return false;
                }
            }
        }
        sleep(1000);
        return true;
    }
    //投票
    function vote() {
        log("vote")
        act.click(className("Button").text("投票"));
        sleep(2000)
        if (text("请先完成所有问题").exists()) {
            act.click_(text("确定"));
            sleep(1000);
        }
        填充空List();
        log("vote")
        act.click(className("Button").text("投票"));
    }
    // } else {

    // yxAct.restartTask(mainApp);

    function 转微信投票页() {
        launchApp("云享社区");
        sleep(2000);
        if (yxAct.currentA() === "任务详情") {
            taskDeatilTxt = yxAct.getTaskTxt();
            log(taskDeatilTxt);
            log("开始任务")
            act.clickKj(text("开始任务").findOne());
            sleep(4000);
        }
        if (wechat.waitWechat()) {
            if (wechat.shareToFileTransfer()) {
                wechat.explorLinkFromTalkActivety("指定", taskDeatilTxt)
            };
        }

        if (!act.isAppA("微信")) { 转微信打开任务() };
        if (!desc("返回").exists()) { wechat.返回微信重新打开助力页() }
        return true;
    };
    //取任务要求转往投票页面
    function gettask() {
        var taskTxt = text("任务简介").findOne().parent().child(6).text();
        yxAct.setTaskStorage("投票任务", taskTxt);
        转微信投票页()

        log(taskTxt);
    }
    //候选人数组转ID数组
    function getCheckBoxId(voteTxt) {
        log("取候选人")
        var reg_delSignSpace = /[\ |\（|\￥|\）|\、|\《|\》|\，|\。|\：|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g
        // log(voteTxt.replace(reg_delSignSpace,""));
        var idtxtArr = [];
        var allArr = [];
        var allArr1 = [], allArr2 = []

        voteTxt = voteTxt.replace(reg_delSignSpace, "");
        sleep(200)
        log(voteTxt)
        sleep(200);
        //判断是CheckBOx还是Radio 

        try {
            if (className("CheckBox").find().length > 0) {
                log("CheckBox")
                var allArr1 = className("CheckBox").find();
            }
            if (className("RadioButton").find().length > 0) {
                log("Radio");
                var allArr2 = className("RadioButton").find();
            }


            log("1:" + allArr1 + "2" + allArr2 + "allArr:" + allArr);

            if (allArr1.length === 0 && allArr2.length === 0) { log("找不到checek 与 radio"); return false }
            if (allArr1.length > 0 && allArr2.length === 0) { allArr = allArr1 }
            if (allArr1.length === 0 && allArr2.length > 0) { allArr = allArr2 }
            if (allArr1.length > 0 && allArr2.length > 0) { allArr = allArr1.concat(allArr2) }


        } catch (err) {
            log("找不到checek 与 radio");
            yxAct.cancelTask();
            return false;
        }


        // log(allArr )


        //相似度差别特小，会发生匹配错误。如果太大，会发生找不到的情况
        //笨办法就是逐步缩小匹配度，多次匹配。
        var i_PP = 10 //匹配初始值 代表100% 匹配
        for (i_PP; i_PP > 7; i_PP--) {
            // log(" 匹配度")
            for (var i = 0; i < allArr.length; i++) {//每次降低10%的匹配度
                //    log(i_PP+"..."+i)
                var arrTxt = allArr[i].text()
                arrTxt = arrTxt.replace(reg_delSignSpace, "");
                // log("--:" + arrTxt)
                if (act.strSimilarity2Percent(voteTxt, arrTxt) >= i_PP / 10) {
                    idtxtArr.push(allArr[i].id());
                    log(idtxtArr)
                }
            }
            //第一次使用了字符串，疏忽了多个表单有同一个候选人的情况
            if (idtxtArr.length != 0) {
                return idtxtArr;
            }
        }

        return false;

    }
    //候选人数组
    function getTaskArry(taskText) {
        reg = /\【(\S*?)\】/g
        var voteTxtArry = taskText.match(reg);
        log("正则匹配:   " + voteTxtArry)

        //循环去掉数组元素上的方括号与:
        for (i = 0; i < voteTxtArry.length; i++) {

            voteTxtArry[i] = act.getStringBetweenTwoChar(voteTxtArry[i], "投", "】");

        }
        return voteTxtArry;
    }
    //提交任务图
    function commitPic() {
        var i = 0;
        while (!act.isAppA(mainApp)) {
            act.launch_multi(mainApp);
            sleep(3000);
            i++;
            log(i)
        }

        yxAct.toTaskType()
        yxAct.toTaskDetail();
        yxAct.上传截图两张("已选", "已投")

    }
    //填充多余未选List
    function 填充空List() {
        var arr = filterArr();//找出子控件有checkbox 和radioButton 的list数组
        log(arr.length);
        for (var i = 0; i < arr.length; i++) {
            //   isEmptyList(arr[i])
            if (!isEmptyList(arr[i])) {//list非空
                var t = random(0, arr[i].childCount() - 1)
                log(arr[i].childCount())
                arr[i].child(t).child(0).click();
                sleep(3000);

            }
        }


        //寻找有效List数组
        function filterArr() {
            var listArr = className("ListView").find();
            var listVote = [];
            listArr.forEach(function (element) {
                try {

                    if (element.child(0).child(0).className() === "android.widget.CheckBox" || element.child(0).child(0).className() === "android.widget.RadioButton") {

                        listVote.push(element);

                    }
                } catch (err) {
                    log(err);
                }
            });

            return listVote;//返回有check 和radio的数组
        }
        //遍历list下radio或checkBox数组的check属性，如果全部为空，返回true;
        function isEmptyList(list) {
            try {
                list.children().forEach(function (child) {

                    if (child.child(0).checked()) {
                        log("含有" + child.child(0).text() + "ListView非空")
                        return false
                    }
                })

            } catch (err) {
                log(err)
            }
            return true;
        }


    }

}
wxTask.互步 = function () {

    currentA()
    closePop()

    function currentA() { }
    if (text("授权登录").exists()) {
        log("授权页");
        text("授权登录").findOne().click();
        closePop()

        return "授权页"
    }
}
//放弃的小程序= 开心互联| 

// 打卡(3)
// currentA()
// 星月追剧() 
// 互步()
// 答题()

module.exports = wxTask;
// wxTask.微文阅读()

// wxTask.微文帮投()