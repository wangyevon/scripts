//前路漫漫，唯有奋斗
var act = require("./act.js");
var taskList = require("./taskList.js");
var wechat = require("./wechat.js");
var weiwei = {};

// images.requestScreenCapture()
// sleep(366)
//微信环境 v7.0.21 7.0.22
//收藏与关注的覆盖图层

//视频页面按钮id
// var idSC = text("收藏").findOnce(0).id()
// var kjZF = text("收藏").findOnce(0).parent().parent().child(1) //转发
// var kjDZ = text("收藏").findOnce(0).parent().parent().child(2)//点赞
// var kjPL = text("收藏").findOnce(0).parent().parent().child(3) //评论



weiwei.launchWxToWwPage = function () {

    try {

        if (act.isRoot()) {

            // shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d http://aa.sph.xfeixfei.com/pages/ucenter/ucenter', true);
            shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d http://a2126532154.slot.dxptai.com/?sid=1346375375041564673', true);
            sleep(6000);


            var t = 0;
            while (weiwei.currentA() != "主页") {
                if (t > 5) { log("超时"); break; };
                sleep(3000);
                log("等待页面打开。。。。")
                t++;
            }

            if (weiwei.currentA() === "主页") {
                sleep(3000);
                return true;
            }
        }

        wechat.turnToPage("收藏");
        sleep(5000);
        wechat.微信授权();
        sleep(2200);
        var i = 0;
        while (weiwei.currentA() != "主页") {
            if (i > 10) {
                log("等待超时，退出");
                return false;
            }
            sleep(3000);
            log("微微主页未打开，等待。。。。")
            i++;

        }

        return true;
    } catch (err) {
        log("launchWxToWwPage:" + err);
        return false;
    }
}
weiwei.currentA = function () {
    if (textContains("微微视频").boundsInside(10, 10, 1070, 220).exists() && text('今日订单').exists()) {
        log("当前weiwei主页");
        return "主页";
    }

    if (textContains("金豆到账后会冻结24小时,解冻后可立即提现").exists()) {
        log("当前weiwei个人中心");
        return "个人中心"
    }

    if (id("text1").text("视频号").exists() && id("e3t").exists()) {
        log("视频号列表页");
        return "视频号列表"
    }

    if (id("text1").exists() && id("e3t").exists() && id("text1").findOne().text() === id("e3t").findOnce(0).text()) {

        log("个人视频号列表页");
        return "个人视频号列表"
    }


    if (desc('当前所在页面,活动订单').exists() && !text("提交截图").exists() && !text("提交").exists()) {
        log("当前大二维码");
        return "大二维码"
    }
    if (text("私信").exists() && text("关注").exists()) {
        log("当前做任务页");
        return "视频主主页"
    }
    if (desc('当前所在页面,活动订单').exists() && text("提交截图").exists()) {
        log("当前订单页");
        return "订单页"
    }
    if (desc('当前所在页面,活动订单').exists() && text("提交").exists()) {
        log("当前交任务");
        return "提交页"
    }

}
weiwei.做任务 = function () {
    try {
        var taskOwner;

        //返回主页
        返回("主页");
        if (weiwei.currentA() === "主页") {
            act.click_(text('开启活动订单'));
            sleep(5000);
        }

        //长时间不动点击后会重新登录，再次点击
        if (weiwei.currentA() === "主页") {
            act.click_(text('开启活动订单'));
            sleep(1000)
            if (text('暂无订单').exists()) {

                return "无订单";
            }

            sleep(5000);
        }
        sleep(5000);

        var num = 0;//控制以下while循环，直到取到任务要求值;
        while (getTask() === undefined) {
            log("取不到任务,刷新");
            wechat.refreshArticle();
            sleep(4000);
            num++;
            if (num > 3) {
                log("获取任务要求失败")
                return false;
            }
        }
        var taskRequest = getTask();
        log("任务要求request：" + taskRequest)


        //三种打开任务要求页面方式；1、打开视频 2、二维码打开视频 3、搜索任务主名称打开
        //1、打开视频     
        if (text("打开视频").exists()) {
            // taskOwner = text('打开视频').findOne(2000).parent().parent().child(1).text();
            taskText = textContains("点击下面的“提交截图”，上传截图，即完成该订单").findOne(2000).text();
            log("任务主：" + taskOwner + "\n任务要求：" + taskText);

            act.click_(text("打开视频"));
            sleep(5800);

            //异常处理
            if (text("该内容已被发布者删除").exists() || text("对方已放弃认证").exists()) {
                放弃任务();
                return false;

            }
            if (!text("视频号").exists()) {//整页空白
                放弃任务();
                return false;
            }
            if (weiwei.currentA() === "大二维码") {//视频号窗口空白
                var channelsBounds = text("视频号").findOne().parent().parent().bounds();
                var imgChannel = images.captureScreen();
                if (images.pixel(imgChannel, channelsBounds.left + 200, channelsBounds.top + 300) === images.pixel(imgChannel, channelsBounds.right - 200, channelsBounds.top + 500)) {
                    log("视频已被删除，放弃任务");
                    放弃任务();
                    return false;
                }

            }
            //转发页做图解决，不需要点击视频号跳转
            if (taskRequest != "转发") {
                act.click_(text("视频号"));
                sleep(3000);
            }
        }
        //2、二维码打开视频
        if (textContains("二维码").exists()) {

            if (textContains("点击下面的“提交截图”，上传截图，即完成该订单").exists()) {
                var taskText = textContains("点击下面的“提交截图”，上传截图，即完成该订单").findOne(2000).text();
            }

            if (text("参考样图").exists()) {
                var rectQR = text('参考样图').findOne(2000).parent().child(2).bounds();
                log("\n任务要求：" + taskText);
                //识别二维码
                press(rectQR.centerX(), rectQR.centerY(), 800);
                sleep(800);
            }
            if (text('识别图中的二维码').exists()) {
                act.click_(text('识别图中的二维码'));
                sleep(5800);
                // return true;
            } else {

                if (text('发送给朋友').exists()) {

                    act.click_(text('取消'));
                    sleep(1000);
                }
                click(rectQR.centerX(), rectQR.centerY());
                sleep(2800);

                if (!text('fwidth').exists()) {
                    log("二维码打开错误");
                    放弃任务();
                    return false;
                }
                var rect = text('fwidth').findOne(1000).bounds();
                log("1")
                if (rect.width() > 800) {
                    press(rect.centerX(), rect.centerY(), 800);
                    log("2")
                    sleep(1000);
                    act.click_(text('识别图中的二维码'));
                    sleep(3000);
                    // return true;
                }
                // return false;
            }
            //开始任务 



            if (weiwei.currentA() === "订单页") {
                log("二维码打开错误");

                放弃任务();
                return false;
            }
            if (text("该内容已被发布者删除").exists() || text("对方已放弃认证").exists()) {

                放弃任务();
                return false;
            }

        }
        if (text("发送上面的文字，打开并进入作者主页").exists()) {
            var t = textContains("#视频号:").findOne(3000).text();

            var taskOwner = act.getStringBetweenTwoChar(t, "#视频号:")

            搜索打开视频号主页(taskOwner);
        }

        sleep(2800);
        if (分析要求完成任务(taskRequest)) {
            if (提交任务(taskRequest)) {
                log("成功完成任务");
                return true;
            }
        } else {
            return false;
        }
    }
    catch (err) {
        log(err)
        return false;
    }
    function getTask() {
        if (textContains("-------").exists()) {
            var tasktext = textContains("-------").findOne().text()
            tasktext = tasktext.substring(0, tasktext.indexOf("-")).trim();
            return tasktext;
        }
    }
}
function 搜索打开视频号主页(context) {
    wechat.turnToPage("搜索");

    className("EditText").findOne().setText(context + "视频号");
    sleep(500);


    textContains("搜一搜  " + context).findOne().parent().parent().click();
    sleep(3800);
    if (text("无法连接网络").exists()) {
        log("网络错误");
        return false;
    }

    text("视频号").clickable(true).findOne(4000).click();
    sleep(2000);
    if (textContains(context).exists()) {
        var t = textContains(context).clickable(true).find();
        var left, right, temp;
        for (var i = 0; i < t.length; i++) {
            temp = t[i].text();
            left = temp.indexOf(context), right = str.indexOf(" ");
            temp.substring(left, right);
            if (temp.substring(left, right) === context) {
                t[i].click();
                break;
            };
        }
    }



    if (wechat.currentA() === "视频主主页") {
        log("打开视频主主页")
        return true;
    } else {
        log("打开视频主主页失败")
        return false;
    }

}

function 分析要求完成任务(taskDeatil) {
    try {
        var reg = /关注|点赞|收藏/;
        if (taskDeatil.indexOf("关注") != -1) {
            log("关注任务");
            if (关注()) {
                // act.captureScr("关注成功");
                sleep(2000);
                return true;
            } else {
            }

        }

        if (taskDeatil.indexOf("点赞") != -1) {
            if (点赞()) {

                act.captureScr("点赞成功");
                sleep(2000);

                return true;
            } else {
                return false;
            }
        }

        if (taskDeatil.indexOf("收藏") != -1) {
            if (收藏()) {
                // act.captureScr("收藏成功");
                sleep(2000);
                return true;
            } else {
                return false;
            }

        }

        if (taskDeatil.indexOf("评论") != -1) {
            if (评论()) {

                sleep(300);
                act.captureScr("评论成功");
                sleep(2000);

                return true;
            } else {
                return false;
            }
        }

        if (taskDeatil.indexOf("转发") != -1) {
            if (转发()) {
                sleep(2000);
                log("转发成功")
                return true;
            } else {
                return false;
            }

        }

        if (taskDeatil.indexOf("播放") != -1) {
            if (播放()) {

                sleep(300);
                act.captureScr("播放成功");
                sleep(2000);

                return true;
            } else {
                return false;
            }

        }
    } catch (err) {
        log("分析任务：" + err)
        return false;
    }
}

function 提交任务(taskDeatil) {
    try {
        for (var i = 0; i < 3; i++) {
            if (返回("截图页")) {
                break;
            }
        }
        var reg = /关注|点赞|收藏/;
        if (taskDeatil.indexOf("关注") != -1) {
            log("关注任务");
            提交截图("关注成功");
            sleep(2000);
            return true;
        }

        if (taskDeatil.indexOf("点赞") != -1) {

            提交截图("点赞成功");
            sleep(2000);
            return true;

        }
        if (taskDeatil.indexOf("转发") != -1) {

            提交截图("转发成功");
            sleep(2000);
            return true;

        }

        if (taskDeatil.indexOf("收藏") != -1) {

            提交截图("收藏成功");
            sleep(2000);

            return true;
        }

        if (taskDeatil.indexOf("评论") != -1) {

            提交截图("评论成功");
            sleep(2000);

            return true;
        }


        if (taskDeatil.indexOf("播放") != -1) {

            提交截图("播放成功");
            sleep(2000);

            return true;
        }
        return false;
    } catch (err) {
        log("提交任务" + err)
        return false;
    }
}

function 返回(pageName) {
    try {
        for (var i = 0; i < 3; i++) {

            if (text("私信").boundsInside(500, 0, 1080, 500).exists()) {
                act.click_(desc("返回"));
                sleep(2000);
            }
            sleep(300);
            if (id("tm").exists()) {
                act.click_(desc("返回"));
                sleep(2000);
            }
            sleep(300);
            if (desc('当前所在页面,aa.sph.xfeixfei.com/preview-image').exists()) {
                sleep(1000);
                back();
                sleep(2000);
            }
            sleep(300);

            if (weiwei.currentA() === "大二维码") {
                sleep(2000);
                back();
                sleep(2000);
            }
            if (id("readTxt").exists()) {
                sleep(2000);
                back();
                sleep(2000);
            }
            sleep(300);
            if (desc('当前所在页面,微微视频').exists()) {
                if (weiwei.currentA() === "个人中心") {
                    click("首页");
                    sleep(2000);
                }
                if (pageName === "主页") {
                    log("返回主页成功");
                    return true;
                }
                act.click_(text("开启活动订单"));
                sleep(2000);
            }
            sleep(300);
            if (desc('当前所在页面,活动订单').exists() && text("提交截图").exists()) {
                if (pageName === "订单页") {
                    log("返回订单页成功");
                    return true;
                }

                if (pageName === "截图页") {
                    act.click_(text("提交截图"));
                    sleep(2000);
                }

            }
            sleep(300);


            if (desc('当前所在页面,活动订单').exists() && text("提交").exists()) {

                if (pageName === "截图页") {
                    log("返回截图页成功");
                    return true;
                }

            }

            return false;

        }
    } catch (err) {
        log("返回错误：" + err)
        return false;
    }
}

function 提交截图(imageName) {
    try {
        log("准备提交截图")
        act.click_(text("提交截图"), 2)
        sleep(800);
        act.click_(text("截图"), 1);
        sleep(1000);
        for (var i = 0; i < 3; i++) {
            if (text('选择操作').exists() && text("文件").exists()) {
                log("选择图片")
                act.clickKj(text("文件").findOne());
                sleep(800);
            }

            if (desc("显示根目录").exists()) {
                toastLog("选择图片")
                act.clickKj(text(imageName + ".png").findOne());

                sleep(3000);
            }



            if (text("×").exists()) {
                for (var ii = 0; ii < 10; ii++) {
                    if (text("截图已添加").exists()) {
                        sleep(800);
                        break;
                    }
                }
            }


        }
        if (!text("×").exists()) {
            return false;
        }


        for (i = 0; i < 3; i++) {
            if (!(weiwei.currentA() === "主页" || weiwei.currentA() === "视频主主页")) {

                act.click_(text("提交"));
                sleep(3000);
                log("图片提交成功");
                return true;
            }
        }
        return false;
    } catch (err) {
        log("提交截图:" + err)
        return false;
    }
}

function 播放() {
    try {
        if (wechat.currentA() === "视频主主页") {
            act.click_(id("ej3"));
            sleep(500);
            act.click_(id("c1r"));
            sleep(5000);
        }
        if (拉动播放进度条()) {
            console.hide()
            sleep(300);
            act.captureScr("播放成功");

            return true;
        } else {
            return false;
        }
    } catch (err) {
        log("播放" + err)
        return false;
    }
}
function 拉动播放进度条() {
    //控件定位根据“全屏”或者“进度条”这些定位条件找出父控件，根据父控件定位子控件 

    if (id("bzq").boundsInside(0, 100, 1080, 2100).exists()) {
        var videoArr = id("bzq").boundsInside(0, 200, 1080, 2100).find();
        if (videoArr === undefined) {
            return false;
        }
        if (videoArr.length === 1) {
            var rect = id("bzq").boundsInside(0, 0, 1080, 2100).findOnce().bounds();
        }

        if (videoArr.length > 1) {
            for (var i = 0; i < videoArr.length; i++) {
                var rect_ = videoArr[i].bounds();
                if (rect_.top > 200 && rect.bottom < 2100 && rect_.left > 0 && rect_.right < 1080) {
                    rect = rect_;
                    break;
                }
            }
        }

        log(rect)
        click(rect.centerX(), rect.centerY());
        sleep(1800);
        if (text("视频已暂停").exists()) {
            log("拉动")
            swipe(100, rect.centerY(), 550, rect.centerY(), 580);
            sleep(500);
            log("播放")
            click(rect.centerX(), rect.centerY());
            sleep(1000);
        }
        if (!text("视频已暂停").exists()) {
            return true;
        }
    } else {
        log("无视频窗");
        return false;
    }
}

function 点赞() {
    var imgRedHeart64 = "iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAABHNCSVQICAgIfAhkiAAAAytJREFUeJzt2jtT4lAYh/HHsAyasMugMNuZOi3SSsvW1NhCC629ln6A1Nhiqy011LENLcwwrgZlGWArnXVHcj25MORfkuTMm1+4nPMeDjabzYY9jxR3AUlIikCKAKQIQIoApAhAigCkCECKAKQIQIoApAhAigDAt6ADrCYTFo+PvA6HLE2T1XT6cUxSFLKnpxxWqxxVKmTKZc/jL02T19GIP4bBcjxmbVkfx7KqSlZVyWkah5UKkqL4uocDv0vp1WTC77s75oOB62tymkah2SSrqo7nLgyD536fhWG4GltSFJR6nXy97hnDF8J8MGCm614v+0j+1y8KzeaXx9aWxUzXeRuNfI0tKQrFVovDszPX13hGmOm6p6e/LTlN47jT+fTUlqbJTNdZmmbg8QsXF+TrdVfnekIQBfCerKpSurxEUhSWpsn0+vrTZz5ovjca/Gg0HM9zjfByf89Trxe4sP+TVVXy9TpPt7dCAd5z0u06fjRcISwMg+nVlbDCooykKPy8ubH9snQ1T3ju94UVFXXWluVYvyPCwjBc/0wlNS8PD6wmk63HHRHehkOhBcUVuwfpiPDq8/c6abG7D1uEtWV9mgbvcuwmX7YIy/FYeDFJzF6tIrfNRPcKIVMqffn6XiFsmzDZIuQ0LZRi4si2dwG4eCe4WfvvQuweqCOCl3V5knNUrW495oignJ8LLSaOZEol24fpiJApl5F3HMKpp+Dq16HQbCLJspCCok5WVZFrNdtzXCFIisJxtyukqCgjyTInnY7zeW4HzGkaxVYrUFFRp9huu2rze5osybXazkB46Th7njHuAkSx1XL8Hvg3vqbNSYbwCgAB1g5JhPADAAEXUEmC8AsAAlaRSYAIAgCCltJxQgQFAIH9hDggRACA4KZKlBCiACCEzlIUECIBIKT2WpgQogEgxB5jGBBhAEDIjVaREGEBQATdZhEQYQJARC33IBBhA0CE+w5+IKIAgIg3X7xARAUAMexAuYGIEgBi2oazg4gaAAT8rddv3m/0qddjPZ8jyTLFdjuWzR7ff+sVmYVhxLrvmQiEuLNXW/PbkiKQIgApApAiAPAXWjoHAM4acwAAAAAASUVORK5CYII="
    try {
        log("开始点赞");
        //如果在视频主主页，跳往第一个视频
        if (wechat.currentA() === "视频主主页") {
            act.click_(id("ej3"));
            sleep(500);
            act.click_(id("c1r"));
            sleep(5000);
        }

        if (wechat.currentA() === "视频清单") {
            act.拖动控件至纵坐标(id("u1"), 1900);
            sleep(1000);
            var img = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAABHNCSVQICAgIfAhkiAAAAytJREFUeJzt2jtT4lAYh/HHsAyasMugMNuZOi3SSsvW1NhCC629ln6A1Nhiqy011LENLcwwrgZlGWArnXVHcj25MORfkuTMm1+4nPMeDjabzYY9jxR3AUlIikCKAKQIQIoApAhAigCkCECKAKQIQIoApAhAigDAt6ADrCYTFo+PvA6HLE2T1XT6cUxSFLKnpxxWqxxVKmTKZc/jL02T19GIP4bBcjxmbVkfx7KqSlZVyWkah5UKkqL4uocDv0vp1WTC77s75oOB62tymkah2SSrqo7nLgyD536fhWG4GltSFJR6nXy97hnDF8J8MGCm614v+0j+1y8KzeaXx9aWxUzXeRuNfI0tKQrFVovDszPX13hGmOm6p6e/LTlN47jT+fTUlqbJTNdZmmbg8QsXF+TrdVfnekIQBfCerKpSurxEUhSWpsn0+vrTZz5ovjca/Gg0HM9zjfByf89Trxe4sP+TVVXy9TpPt7dCAd5z0u06fjRcISwMg+nVlbDCooykKPy8ubH9snQ1T3ju94UVFXXWluVYvyPCwjBc/0wlNS8PD6wmk63HHRHehkOhBcUVuwfpiPDq8/c6abG7D1uEtWV9mgbvcuwmX7YIy/FYeDFJzF6tIrfNRPcKIVMqffn6XiFsmzDZIuQ0LZRi4si2dwG4eCe4WfvvQuweqCOCl3V5knNUrW495oignJ8LLSaOZEol24fpiJApl5F3HMKpp+Dq16HQbCLJspCCok5WVZFrNdtzXCFIisJxtyukqCgjyTInnY7zeW4HzGkaxVYrUFFRp9huu2rze5osybXazkB46Th7njHuAkSx1XL8Hvg3vqbNSYbwCgAB1g5JhPADAAEXUEmC8AsAAlaRSYAIAgCCltJxQgQFAIH9hDggRACA4KZKlBCiACCEzlIUECIBIKT2WpgQogEgxB5jGBBhAEDIjVaREGEBQATdZhEQYQJARC33IBBhA0CE+w5+IKIAgIg3X7xARAUAMexAuYGIEgBi2oazg4gaAAT8rddv3m/0qddjPZ8jyTLFdjuWzR7ff+sVmYVhxLrvmQiEuLNXW/PbkiKQIgApApAiAPAXWjoHAM4acwAAAAAASUVORK5CYII=")
            if (!isExistsImgAtWidget(img, id("u1"))) {
                act.click_(id("u1"));
                sleep(1000);
            }
        }

        if (isExistsImgAtWidget(img, id("u1"))) {
            img.recycle()
            log("已点赞");
            return true;
        } else {
            log("点赞失败");
            img.recycle()
            return false;
        }

    } catch (err) {
        log("点赞：" + err)
        return false;
    }
}
function 关注() {
    try {
        log("开始关注");
        if (weiwei.currentA() === "视频号列表" || weiwei.currentA() === "") {
            id("tm").boundsInside(0, 200, 500, 1000).findOne().click();
            sleep(5000);
        }
        if (text("私信").boundsInside(500, 0, 1080, 500).exists()) {
            act.click_(text("关注"));
            sleep(3000);
            if (!text("关注").exists()) {
                act.captureScr("关注成功");
                sleep(300);
                return true;
            } else {
                restart();
                return false;
            }
            //关注仿图

            // 仿关注图片(id("hzk").findOne().parent());
            // return true;
        }

    } catch (err) {
        log("关注：" + err)
        return false;
    }

}

function 评论() {

    log("开始评论")
    try {
        var comment = ["这个视频就像今年的生肖一样，牛牛牛！", "就在此刻，-位三年后的亿万富翁给我点了一个赞", "果然是才华横溢。新的一年祝牛气冲天！[爱心][666][666]", "让我朋友圈的男土狗们都看看", "有才华的人，总是低调的，也是务实进取的", "我想有个人能牵着我的手，平平淡淡也好，轰轰烈烈也好，我们一起走。", "老板，钱对你来说真的就那么重要吗？讲了这么床时间了一分钱都不降？", "小时候，男孩子喜欢电动玩具，女孩子喜欢娃娃。长大了就反过来了。"]
        if (wechat.currentA() === "视频主主页") {
            act.click_(id("ej3"));
            sleep(500);
            act.click_(id("c1r"));
            sleep(5000);
        }
        sleep(2000);

        act.拖动控件至纵坐标(id("cnd"), 1900);
        sleep(1000);

        act.click_(id("cnd"))//评论图标

        if (textContains("条评论").exists()) {
            var creator = id("e3t").findOne(3000).text();
            if (creator != undefined) {
                id("ax8").findOne().setText("我就一直在想你会怎么剪呢？这个配乐真有趣！哈哈[调皮] 祝愿" + creator + "：\n年年岁岁添福\n衣渐丰\n食更锦\n集才德\n汇江海" +
                    "\n[爱心][666][红包][憨笑]");
            } else {
                id("ax8").findOne().setText(comment[random(0, comment.length - 1)])
            }
            act.click_(text("回复"));

        }
        sleep(3000);
        if (text("1分钟前").exists()) {
            log("评论成功");
            console.hide()
            sleep(300);
            act.captureScr("评论成功");

            return true;
        }
        return false;
    } catch (err) {
        log("评论：" + err)
        return false;
    }
}

function 转发() {
    try {
        if (text("视频号").boundsInside(200, 1400, 900, 1600).exists()) {
            仿转发图片();
            return true;
        }

    } catch (err) {
        log("转发:" + err)
        return false;
    }
    return false;
}
function 正常转发() {
    try {
        if (weiwei.currentA() === "视频主主页") {

            act.click_(id("ej3"));
            sleep(500);
            act.click_(id("c1r"));
            sleep(5000);
        }


        if (!text('转发给朋友').exists()) {
            if (id("hg6").exists()) {
                act.拖动控件至纵坐标(id("hg6"), 1900);
                sleep(1000);
                act.click_(id("hg6"));//转发图标
                sleep(1000);
            }
        }

        act.click_(text('转发给朋友'));

        sleep(2000);
        if (wechat.currentA() === "转发") {
            wechat.shareToFileTransfer_("信息公报");
        }  // wechat.返回聊天窗口("信息公报");

        wechat.turnToPage("主页");



        click("信息公报");



        if (textContains("信息公报").exists() && wechat.currentA() === "聊天窗口") {

            sleep(300);
            act.captureScr("转发成功");

        }
        if (act.isRoot()) {

            // shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d http://aa.sph.xfeixfei.com/pages/ucenter/ucenter', true);
            shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d http://aa.sph.xfeixfei.com/pages/earth/task', true);
            sleep(4800);
        } else {

            wechat.turnToPage("收藏");

            if (text("微微视频").exists()) {
                click("微微视频");
                sleep(3800);
            }

            if (weiwei.currentA() === "主页") {
                act.click_(text('开启活动订单'));
                sleep(3000);
            }
            //长时间不动点击后会重新登录，再次点击
            if (weiwei.currentA() === "主页") {
                act.click_(text('开启活动订单'));
                sleep(5000);
            }
        }

        if (weiwei.currentA() === "订单页") {
            return true;
        }

        return false;
    } catch (err) {
        log("转发:" + err)
        return false;
    }
}

function 收藏() {

    try {

        log("开始收藏");
        if (wechat.currentA() === "视频主主页") {
            act.click_(id("ej3"));
            sleep(500);
            act.click_(id("c1r"));
            sleep(5000);
        }
        if (id("hc9").exists()) {
            act.拖动控件至纵坐标(id("hc9"), 1900);
            sleep(1000);
            var rect = id("hc9").findOne(3000).bounds()
            // --画图模拟收藏图=======================================

            仿收藏图片(id("hc9").findOne());

            return true;
            // ========================================================
            //-----点击控件收藏
            var x = rect.centerX();
            var y = rect.centerY();
            // log("存在")
            var img = images.captureScreen();
            sleep(200);
            var color = img.pixel(x, y);
            if (color === -1) { //"#ffffffff"
                // log(colors.toString(color))
                id("hca").findOne().click();
                sleep(2000);
            }
            sleep(2000);
            if (color === -352965) {//"#fffa9d3b"
                log("已收藏");
                return true;
            }


        }
    } catch (err) {
        log("收藏：" + err)
        return false;
    }
}

function 放弃任务() {
    log("放弃任务");
    try {
        if (!返回("订单页")) {
            log("返回订单页失败");
            return false;
        };
        sleep(3000);
        act.click_(text("放弃该订单?"));
        sleep(1000);
        act.click_(text("确定"));
        sleep(2000);
        if (weiwei.currentA() === "主页") {
            log("放弃任务成功");
            return true;
        }
    } catch (err) {
        log("放弃任务：" + err)
        return false;
    }
}
function restart() {
    act.强行关闭("微信");
    sleep(2000);
    weiwei.launchWxToWwPage();
    sleep(2000)
    weiwei.做任务();
}
function 注册() {
    try {
        var url = "http://s.xxfeixx.com/?sid=1346375375041564673";
        if (wechat.currentA() === "我的收藏") {
            if (!text("微微视频").exists()) {
                log("注册");
                act.click_(desc("返回"));
            }
        }

        if (wechat.currentA() === "个人主页") {
            act.clickKj(text("微信").findOne())
            sleep(3000);
        }
        if (text("文件传输助手").exists()) {
            act.click_(text("文件传输助手"));
            sleep(2000);
        }

        wechat.发送聊天信息(url)
        sleep(3000);

        //点击去收藏

        var rect = id("ala").find()[id("ala").find().length - 1].bounds();
        // log(rect.centerX()+","+ Math.floor(rect.centerY() / 2));
        click(rect.centerX(), Math.floor(rect.centerY() - rect.height() / 3));

        sleep(5000);
        wechat.微信授权();
        sleep(2000);

        if (text("微微视频").exists()) {
            act.click_(id("cj"));
            sleep(2000);
            //['发送给朋友',  '分享到朋友圈',  '在看',  '收藏',  '在浏览器打开',  '在浏览器打开',  '浮窗',    '复制链接',   '取消' ]
            act.click_(text('收藏'));
            sleep(2000);
            act.click_(text("我知道了"))
        }
    } catch (err) {
        log("注册：" + err)
        return false;
    }
}

function 仿收藏图片(KjTX) {
    var wwStoreRed64 = "iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAABHNCSVQICAgIfAhkiAAAA5BJREFUeJztmy2X00AUhp9JShEEswi2BgxRNRSzqvitp57FLx40/AAWy+IBgSo/YBVmg1kVDCpFbE2DIIfOILI5LOw2zcfdSXvIe05NkjNz58k7k/m4VcYYw38up+kA1kEtBFoIQAsBaCEALQSghQC0EADoNFZzErP4/AodTqDr4fTHuIO9RkJpzAmL4E0KACCJ0cEh+ttRI7E0AsHEEfrk/YXr+vOrBqJpCII+eXfpdRNHf9xhUfYhJDE6/LT0tg7eWgwmlXUIi5N3kMRL7zfhBrsQknhpVzgv226wCmGVCzLZdoM9CAVdkMmmG6xBKOqCTDbdYAdCSRdksuUGKxDKuiCTLTdcPYSKLsikvy6fU0jpyiFUdUEmEwWYKBCM6KLUVWy5m+kXTDLHnIapC2pAAFBbPuruEKf3ALo3UFu+UKRn5VeFYGYhJD/Q0TEkMWYWYk7D2g0uKuX14OZ2CqTrpYC82+n1smWthJDE6G9HaSNnIcynmDiqGrsVqS0frnuo7QHqlo9zZ5j/fC6EJObXx8dr3+hVUr0Bnd2DpfdzB0YdTjYeAKweXHMhGEv924bMLFx6LxeCsz0QD6YRdT3U3eXjQi4E1Rvg7uyLx2Rb7s5+7lej0CdShxMWRy9FA7Mld/gMxx/lPlNoyz0rZKNAdD3cnf2VAKDEucNGgeh6dEYHhWeWpdYOjj/CHT6rFJc1lQQAFRZQaw2iAgCouIpcSxAVAUCNpfRagagBAGruJ6wFiJoAQGBTpVEQAgBAaGfJ8Uc4/UcSRZWSO3wussEit7320/5iK29RVEZiEMzsq1RRxTWXWeYLQpB5K6XqFNrrEIHQBABIN3QlJANhPpUoplrdAm7YaCcAIPACZMaE0+Yg6Gn9gxkZJ8TNdQeJF7Dx3UHiBdSGUBtA10t/TdWPQEarqWrHLIu1PwbOkjsvyW0sFMMsrDV9rg+hrB3PN/6cA9ydpzj9Mfr4sPRxvJlPm11Fmui4eGX9R1wbf0hzmC/pAsrr4T58Tmf8HufebvEYanaJ+gne8feVjzj3dnEe7BU+Mc5gOP6IRfBm9cyw5hdCIMt9+bFF2cb/K9Ub0Om9xkRBMRgVVTtJYxEcooPDvwvdvo87eILqyR7jmShgcfTiwjjU2T2oVZdIpooOJ+hwgurexOmPxRt/WX3m7G8Byh/h5JwzFtGVpOtsmtq//9BCAFoIQAsBaCEALQQAfgMyYYvHE8fEiAAAAABJRU5ErkJggg=="
    imgTx = images.fromBase64(wwStoreRed64);
    sleep(300);
    var imgCB = images.captureScreen();
    sleep(300);

    var canvasBg = new Canvas(imgCB);
    var paint = new Paint;
    var rect2 = KjTX.bounds();
    log(rect2.left + "," + rect2.top)
    canvasBg.drawImage(imgTx, rect2.left, rect2.top, rect2.width(), rect2.height(), paint);
    images.save(canvasBg.toImage(), "/sdcard/收藏成功.png");
    media.scanFile("/sdcard/收藏成功.png");
    // app.viewFile("/sdcard/收藏成功.png")
    imgTx.recycle();

}
function 仿关注图片(KjTX) {
    var wwGz64 = "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4403Yj5fZ91BR/vzzz9jfgw478cff7SVo+0amTlzpu1uli+//JLA0UMEDgAxKygoUCAQUE5OjnJycjRkyBDl5uYqOztbTz75pLXf+PHjbU3SXenYYuLxeDRp0qS46/nVV1/p559/tsojR47UyJEj4z4v0s/mzZtt5Wjn18jPz5fX67XGcvz222+O1y3TETgAxOyGG27QDTfcELa94x/3nmhqatKvv/5qlUeMGKGcnJyY69furbfesnXTnHfeecrLy0vIOIyTTz7Z+GMgep0NYI5GUVGRvvzySwdr07sQOACkjA0bNujQoUNWubCwMO5zNjQ02P5I9O3bV5dddpmGDRumM888M+7zA4gOa6kASBnt8120O+200+I+58qVK22TTvl8vh7NMgrAGbRwAIjZQw89FPHW1ubmZlu5pqZGGzdujHiOuXPnauLEiZJkW8ciKytLU6ZMiat+e/bs6XaSpvXr1+uee+6J63GONn36dN17772OnhNIdwQOADGrr6/X9u3bu90vEAh0eldHY2OjpLaJw9pnGJWk448/Pu6WiJdeesk2U2Qkra2tPZ4/pDusGJGZuruW0DW6VACkhC+++EKHDx+2yieddFJc56uvr1dNTU281UKGOXqyt54MIu3YAsekXz1HCweAmA0fPlwtLS1h2/fu3Wtbp2Tw4ME65phjIp6jffs333xj2x7vdObPPvus/vvvv273Kyws1E033RTXY0U6J1KT1+u1lWtra1VSUtLtcR3DhuTc/DC9CYEDQMwWL14cti0QCOjqq6+2bZs6daouvfTSLm8R7fiG7vF4dO6551rl9evXa926dfL5fN2u7ipJb775ZtS3L+bn52v27NlR7Yv0V1JSokWLFlnlmpqaqAKH3++3ladNm+Z43TIdgQOAo1577bWwpcjfffddffbZZ3rkkUd06qmnhh1z8OBB/fLLL1Z51KhRGjhwoCTptttuswac5uTk6Oabb1afPn06ffzt27erqqrKts3j8YQNZG3322+/6cMPP4zul4vSCSecEPeAV5iRn5+vvLw87dq1S1JbkFiwYEGXXSTBYFCrVq2yyl6vN+Iqx+gagQOAY/bs2aMPPvggbHtra6v27dune+65Rw8//HBYd8lHH31kCykd38zHjh1rBY7Gxka9//77uuSSSzqtw9KlS2398rm5uRo5cmTYSrHttm3bpmXLlkX3C0ZpxowZBI4UVl5ervnz51vlRYsWRWyta1dRUWG7plgbJzYMGgXgmOeee842cdfR/vrrL917771h821s2LDBVu44nfn06dNti6R9/PHHXdahvWVEaru19sYbb5THw2cr/L+SkhLbWA6/3x/WZdKutrZWy5cvt8per1dz5swxXsdMROAA4IiNGzdq7dq1EX/Wt29f6/vGxkbdd999tjEWmzZtsr4/9thjNXXqVKs8evRonXjiiVb5m2++0f79+zutx5133qnjjz9eUtsflosuuqjLervdbnk8Hkf/ud3uLh8TyeXz+bRkyRLbtkWLFoUNDA0EApo7d65tW3l5OXeoxIjYD8ARzz33XMQ7ViTp8ssv1+eff66dO3dKausTX7BggR544AH5fD7t2bPH2reoqChsjMbkyZOtVT4PHz6s9957r9PF4Hw+n+6++25VVFTo9ttv77beU6dO1SeffBLV74jMUVJSomnTplm3TgeDQS1atEgrVqyw9pk/f76tK2XSpEkqKytLeF0zBS0cAOL28ssv2z4d5ubm2n6enZ2txYsX21bmPHjwoB588EG98sortn0nTJgQdv7p06fbQsinn37aZX3Gjx+vZcuW6dhjj+3R74HeZcmSJcrLy7PKtbW11nUcCARUW1tr/SwvL0/PP/98wuuYSWjhABCXrVu36tVXX7XKWVlZmj17tpYuXWrbb8SIEXriiSd0xx13WC0affr0UX19vbWPy+XSeeedF/YYw4YN07hx4/Ttt99KauuC2b17t4YPH95pvfr16xdV/f/++2/bAEIn3HjjjTrjjDMcPSec19610rG1rKamRkVFRaqurrbtS1dK/AgcAOKydOlS20DRCy64IOKtr5JUUFCgxx57TPPnz1dzc7PuuusuLViwwPr5qFGjNGrUqIjHTpkyxQocTU1NWr16ta6//vq463/kyJGwvvt4dTXGBKmluLg44nafz2cbvNzZfogegQNAzJ566ikrBEhtXSnl5eX6448/Oj3mxBNP1COPPKKmpiZt2rTJNj9Gxzf4o02fPl0vvviijhw5Ikn67LPPHAkc6N06dpt0VFpaqtLS0gTXJrMROADE5J133tHbb79tlbOysnTLLbdo4MCBXQYOSVYLSMcJulwuV5ezNw4cOFCnn366dQvtli1b9NNPP8W95srRjjvuOBUUFPTomIaGBu3Y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"
    imgTX = images.fromBase64(wwGz64);

    sleep(300);
    var imgCB = images.captureScreen();
    sleep(300);

    var canvasBg = new Canvas(imgCB);
    var paint = new Paint;
    var rect2 = KjTX.bounds();
    log(rect2.left + "," + rect2.top)
    canvasBg.drawImage(imgTX, device.width / 2, rect2.top, rect2.width() / 2, rect2.height(), paint);
    images.save(canvasBg.toImage(), "/sdcard/关注成功.png");
    media.scanFile("/sdcard/关注成功.png");
    imgTx.recycle();

}

function 仿转发图片() {

    log("开始仿转发")

    // sleep(500)
    // log(files.cwd())
    // sleep(900);

    var imgVideoFrame = 截取控件位置图片(text("视频号").findOne().parent().parent());
    var img = images.read("./img/视频号转发.png");
    var img2 = images.read("./img/转发外框.png");
    //如头像文件不存在，先创建
    if (!files.exists("/sdcard/avatarWx.png")) {
        getAvatar();
    } else {
        var imgAvatar = images.read("/sdcard/avatarWx.png");
    }


    log("读取到image.....");
    sleep(300);

    var imgCB = images.captureScreen();
    sleep(300);

    var canvasBg = new Canvas(imgCB);
    var paint = new Paint;
    // log("3");

    if (device.model === "XT1943-1" || device.model === "Lenovo L78011") {
        canvasBg.drawImage(img, 0, 90, 1080, 2102 - 90, paint); //p30
    }
    if (device.model === "Lenovo L38041") {
        canvasBg.drawImage(img, 0, 90, 1080, 2016 - 90, paint); //k5pro
    }
    sleep(350);


    //已画好背景，开始寻找控件图片

    if (device.model === "XT1943-1" || device.model === "Lenovo L78011") {
        canvasBg.drawImage(imgVideoFrame, 402, 343, 515, 1095 - 345, paint); //p30
        sleep(200)
        canvasBg.drawImage(img2, 402, 343, 515, 1095 - 345, paint); //p30
        sleep(200);
        canvasBg.drawImage(imgAvatar, 925, 327, 1064 - 926, 467 - 329, paint); //p30

    }
    if (device.model === "Lenovo L38041") {
        canvasBg.drawImage(imgVideoFrame, 402, 344, 511, 712, paint);//k5pro
        sleep(200);
        canvasBg.drawImage(img2, 402, 344, 511 , 712, paint);
        sleep(200);
        canvasBg.drawImage(imgAvatar, 924, 327, 1064 - 926, 467 - 329, paint);
    }

    // log("2")
    var txtTime = new java.text.SimpleDateFormat("HH:mm").format(new Date().getTime());
    var path = files.getSdcardPath() + "/yxCapture/转发成功.png"
    paint.setStrokeWidth(200)//设置画笔宽度 
    paint.setAntiAlias(false)//设置是否使用抗锯齿功能，如果使用，会导致绘图速度变慢 
    paint.setStyle(Paint.Style.FILL);
    paint.setTextSize(50)
    paint.setColor(colors.parseColor("#eeeeee"))
    // if (device.model === "XT1943-1") {
    //     canvasBg.drawText("████████████", 400, 982 + 120, paint); //p30
    // }
    // if (device.model === "Lenovo L38041") {
    //     canvasBg.drawText("████████████", 450, 982 + 35, paint);//k5pro
    // }


    paint.setColor(colors.parseColor("#e1e1e1"))
    if (device.model === "XT1943-1" || device.model === "Lenovo L78011") {

        paint.setTextSize(31)
        paint.setFakeBoldText(true);
        paint.setColor(colors.parseColor("#999999"))
        canvasBg.drawText(txtTime, 464, 282, paint); //p30
    }
    if (device.model === "Lenovo L38041") {
        paint.setStrokeWidth(9)
        paint.setTextSize(32)
        paint.setColor(colors.parseColor("#999999"))
        canvasBg.drawText(txtTime, 432, 282, paint);//k5pro
    }


    images.save(canvasBg.toImage(), path);

    media.scanFile(path); //加入图库
    imgVideoFrame.recycle();
    img.recycle();
    img2.recycle();
    app.viewFile(path)

    function 取图() {
        var imgVideoFrame1 = 截取控件位置图片(id("al4").findOne());
        images.save(imgVideoFrame1, "/sdcard/视频号转发.png");
        app.viewFile("/sdcard/视频号转发.png")
    }
    function 截取控件位置图片(kj) {
        var rectImg = kj.bounds();
        sleep(300);
        var imgO = images.captureScreen()
        sleep(300);
        var w = imgO.getWidth();
        sleep(200)
        var imgTX = images.clip(imgO, rectImg.left, rectImg.top, rectImg.width(), rectImg.height());

        return imgTX;
    }

    function getAvatar() {
        if (!files.exists("/sdcard/avatarWx.png")) {
            wechat.turnToPage("个人主页");
            var img = 截取控件位置图片(id("tm").clickable(true).findOne());
            images.save(img, "/sdcard/avatarWx.png");
            img.recycle();
        }
    }
}

weiwei.start = function () {
    // threads.start(function () {
    try {
        log("开始微微任务")
        restart();
        for (var i = 0; i < 50; i++) {

            if (weiwei.做任务() === "无订单") {
                log("当前无任务");
                taskList.setTaskStorage("微微视频", new Date().getTime())
                // threads.shutDownAll();
                return false;
            }
            if (weiwei.做任务() === false) {
                restart();
            };
        }
    } catch (err) {
        log(err)
        return false;
    }
    // })
}


weiwei.获取时间 = function () {

    var timeDate = new Date().getHours()
    log(timeDate)
    if (timeDate >= 0 && timeDate < 12) {
        return "上午 " + new java.text.SimpleDateFormat("HH:mm").format(new Date().getTime());
    }
    if (timeDate >= 12) {
        return "下午 " + new java.text.SimpleDateFormat("HH:mm").format(new Date().getTime());
    }
}


function 截取控件位置图片(kj) {

    if (!kj.exists()) {
        log("控件不存在")
        return false;
    }
    var rectImg = kj.findOne().bounds();
    // log(rectImg)
    var imgO = images.captureScreen()
    var w = imgO.getWidth();
    sleep(200)

    var imgTX = images.clip(imgO, rectImg.left, rectImg.top, rectImg.width(), rectImg.height());

    // images.save(imgTX, "/sdcard/new.png");
    // app.viewFile("/sdcard/new.png");
    sleep(500);
    return imgTX;
}

function isExistsImgAtWidget(img, Kj) {
    if (!Kj.exists()) {
        log("未寻到控件")
        return false;
    }

    var bounds_WK = Kj.findOne().bounds();
    var rec = images.findImage(images.captureScreen(), img, { region: [bounds_WK.left, bounds_WK.top, bounds_WK.width(), bounds_WK.height()] })
    if (rec) {
        log("找到图片")
        return true;
    } else {
        log("没有找到图片")
        return false;
    }
}

// weiwei.start()




module.exports = weiwei;

