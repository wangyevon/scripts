var act = require("./act.js");
var wechat = require("./wechat.js");
var yxAct = {};


var taskRE; //正则表达式
var taskDetails = []; //任务数组
var mainApp = "云享社区"

//-------------------- 变量分界-------------------------------
/**
 * 
 * @param {当前页名称} currentA 
 */
function waitPage15s(currentA) {
    for (var i = 0; i < 5; i++) {
        if (yxAct.currentA() === currentA) {
            break;
        } else {
            sleep(3000);
            toastLog("等待" + currentA + "。。。。。");
        }
    }
}

yxAct.toTaskType = function (iMax) {//{imax} 反复查找控件次数
    // waitPage30s("首页"  )
    if (iMax === undefined) { iMax = 1 }
    if (!act.isInteger(iMax)) { iMax = 1; }
    var i = 0;
    if (yxAct.currentA() === "任务状态") {
        log(2)
        act.clickKj(text("完成悬赏").depth(17).findOne());
        sleep(2000);
    }

    if (yxAct.currentA() === "任务详情") {
        return true;
    }
    while (yxAct.currentA() === "首页" || yxAct.currentA() === "个人主页") {

        if (i > iMax) { toastLog("打不开任务页"); return false; }
        if (text("开始赚").exists()) {
            act.clickKj(text("开始赚").findOne());
            sleep(3 * 1000);
        }
        if (text("互助悬赏").exists()) {
            act.clickKj(text("互助悬赏").findOne());
            sleep(1 * 1000);
        }
        i++;
        sleep(1000);
    }
    if (yxAct.currentA() != "任务类型") {
        sleep(3000);
    }

    if (yxAct.currentA() === "任务类型") {

        toastLog("当前任务类型页");
        return true;
    } else {
        // yxAct.toTaskType();
        return false;
    }
}

yxAct.toTaskDetail = function (taskName, iMax) {
    if (iMax === undefined) { iMax = 1 }
    if (act.isInteger(iMax)) { iMax = 1; }

    var i = 0;


    while (yxAct.currentA() === "任务类型") {
        if (i > iMax) { toastLog("打不开任务页"); return false; }
        if (!isNaN(taskName)) {
            act.click(text(taskName));
            sleep(3000);
        }
        i++;

    }

    i = 0;
    while (yxAct.currentA() === "任务状态") {
        if (i > iMax) { toastLog("打不开任务页"); return false; }
        act.click(text("完成悬赏").depth(17));
        sleep(2000);
        i++;
    }
    sleep(220);

    if (yxAct.currentA() === "任务详情") {
        return true;
    } else {
        // yxAct.toTaskDetail(taskName)
        return false;
    }

}

yxAct.nowMoney = function () {

    if (yxAct.currentA() === "个人主页") {
        var money = className("TextView").depth(17).findOnce(2).text();
        log(money);
        return money;
    }

}

yxAct.getMoney = function () {

    back();
    sleep(2000);
    back();
    sleep(2000);
    back();
    sleep(2000);
    act.launchApp_(mainApp);
    if (yxAct.currentA() === "首页") {
        act.clickKj(text("我的").findOne())
    }

    if (yxAct.currentA() === "个人主页") {
        log("算钱 ")
        if (parseFloat(nowMoney()) > 1) {
            log("余额大于1元，提现")
            act.clickKj(text("提现").depth(18).findOne()); //提现按钮，打开提现设置页面
        }


        sleep(3000);

        log("提现")
        if (yxAct.currentA() === "提现设置") {
            if (!text("微信已绑定").exists()) {
                log("提现账号未绑定或有错误，提现中断");
                return;
            } else {
                act.clickKj(text("提现").depth(16).findOne()); //提现按钮，打开提现页面
                sleep(3000);
                if (yxAct.currentA() != "提现") {
                    log("提现窗口卡死，重新提现");
                    getMoney();
                } else {
                    act.clickKj(text("全部提现").depth(16).findOne()); //最大金额
                    sleep(2000);
                    act.clickKj(text("确认提现").depth(16).findOne()); //提现

                }


            }

        }

    }
}

yxAct.getTaskTxt = function () {
    
    if (text("资金已托管，过审立结").exists()) {

        var taskTxt = text("资金已托管，过审立结").findOne().parent().child(3).text();
        if (taskTxt === undefined) {
            log("没有取到任务要求，请检查控件条件，当前为函数:" + yxAct.getTaskTxt);
            sleep(2000);
            return false;
        } else {
            log("任务要求：" + taskTxt)
            return taskTxt;
        }

    } else {
        return false;
    }
}

yxAct.getTaskName = function () {
    if (text("资金已托管，过审立结").exists()) {
        var taskTxt = textContains("赏金").textContains("元").findOne().parent().child(4).child(0).text();
        log(taskTxt)
        return taskTxt;
    } else {
        return ""
    }


}

yxAct.isCurrentTaskPage = function (taskName) {
    //取当前进行任务的类型，辅助判断是否选错了任务
    if (textContains("赏金").textContains("元").exists()) {
        var bounds_ = textContains("赏金").textContains("元").findOne().bounds();
        if (text(taskName).boundsInside(0, bounds_.top, 380, bounds_.bottom).exists()) {
            log("任务与页面相符")
            return true;
        } else {
            log("任务领取错误");
            return false;
        }
    }
}
yxAct.getTaskDeatil = function () {
    var total = textContains('步骤').find().length;
    log("步骤有" + total + "步")
    var taskDeatil = "";
    if (!total) {
        log("取任务详情失败");
        return false
    }
    for (var i = 1; i < (total - 1); i++) {
        taskDeatil = taskDeatil + textContains("步骤" + (i + 1)).findOne().parent().child(1).text();
        log(taskDeatil);
    }

    log("任务要求" + taskDeatil);
    return taskDeatil;
}

yxAct.getPicRequestText = function () {
    /**
     * 返回 添加图片 要求的文本数组
     */

    var addPickArr = text("添加图片").find();
    var taskPicRequestArr = [];
    //    var taskPicRequesttext;
    addPickArr.forEach(function (element) {
        taskPicRequestArr.push(element.parent().parent().parent().child(1).text());
    })

    return taskPicRequestArr;

}

//正则匹配任务要求，返回Array:[图片数,文字]
yxAct.taskStepDetailReg = function (reg) {
    var shareImgSum = 0;
    var shareText;
    // reg=/||/;

    copyTaskText();
    downTaskPic();
    function copyTaskText() {
        var total = text('复制上方文字').find().length;
        var taskDeatil;
        if (!total) {
            log("取任务详情失败");
            return false
        }

        for (var i = 1; i < total; i++) {

            if (taskDeatil.match(reg)) {
                shareText = text('复制上方内容').findOnce(i).parent().parent().parent().child(2).child(0).text();
            }
        }
    }
    function downTaskPic() {
        var total = text('分享上方图片到微信').find().length;
        var taskDeatil;
        if (!total) {
            log("取任务详情失败");
            return false
        }

        for (var i = 1; i < total; i++) {
            taskDeatil = text('分享上方图片到微信').findOne(i).parent().parent().parent().child(1).text();

            //如果任务要求分享图片，分享到微信下载图片
            if (taskDeatil.match(reg)) {
                shareImgSum++;
                act.clickKj(text('分享上方图片到微信').findOnce(i));
                sleep(2000);
                wechat.waitWechat();
                wechat.shareToFileTransfer();
                wechat.explorLinkFromTalkActivety("图片");
                if (wechat.currentA() === "查看图片") {
                    desc("下载").findOne().click();
                    sleep(300);
                }
                //从微信返回云享社区
                act.launch_multi(mainApp);
                sleep(3000);
                if (!act.isAppA(mainApp)) {
                    act.launch_multi(mainApp);
                    sleep(2000);
                }

                yxAct.toTaskType();//可带参数 ，不出现界面重复执行次数
                sleep(2000);
                yxAct.toTaskDetail();//可带参数 ，不出现界面重复执行次数
                sleep(2000);
            }
        }
    }
    return [shareImgSum, shareText]

}
yxAct.cancelTask = function () {

    act.launch_multi(mainApp);
    sleep(2000);

    yxAct.toTaskType();
    // yxAct.toTaskDetail();
    //取消任务后，界面跳回任务类型界面
    if (yxAct.currentA() != "任务详情") {
        app.launchApp(mainApp);
        sleep(3000);
        yxAct.toTaskDetail();
    }
    log("取消任务")
    // var taskTxt = yxAct.getTaskTxt();
    act.click_(text("取消任务"));
    sleep(4000);
    if (text('是否取消当前悬赏?').exists()) {
        log("取消悬赏提示")
        act.clickKj(text("是").findOne());
        sleep(2000);
    }
    if (yxAct.currentA() === "任务详情") {
        log("取消任务失败");
        return false;
    } else {
        return true;
    }

}
//匹配成功，开始
yxAct.taskMatchFailedCancel = function (taskName) {
  
    if (!yxAct.isCurrentTaskPage(taskName)) {

        if (yxAct.cancelTask()) {
            log("取消" + taskName + "任务成功");
            return true;
        };
        return false;
    } else {
        log("任务匹配,开始任务");
        return false;
    }
}


yxAct.currentA = function () {

    if (text("可提现余额：").exists()) {
        log("提现窗口页");
        return "提现"
    }

    if (text("首页").exists() && !text("淘口令").exists() && !text("开始任务").exists() && !text("完成悬赏").exists() && !text("充值").exists()) {
        log("首页");
        text("首页").boundsInside(0, 1848, 1080, 2202).findOne().click();
        return "首页";
    }
    if (text("淘口令").exists() && text('《悬赏接取协议》').exists() && !text("开始任务").exists()) {
        log("任务类型页");
        return "任务类型";
    }
    if (text("完成悬赏").exists() && text("取消悬赏").exists() && !text("开始任务").exists()) {
        log("任务状态页");
        return "任务状态"
    }
    if (text("充值").exists() && text("提现").exists() && !text("开始任务").exists() && !text("可提现余额").exists() && !text("提现号解绑").exists()) {
        log("个人主页");
        return "个人主页"
    }

    if (text("提现号解绑").exists()) {
        log("提现号设置页");
        return "提现设置"
    }

    if (text("开始任务").exists()) {
        log("任务详情页");
        return "任务详情"
    }

}

yxAct.分享二维码 = function () {
    if (yxAct.currentA() === "任务详情" && text("分享上方图片到微信").exists()) {

        log("开始任务")
        for (var i = 1; i < 8; i++) {

            if (text("分享上方图片到微信").boundsInside(0, text('步骤1：').findOne().bounds().bottom, 1080, text("举报屏蔽").findOne().parent().bounds().top - 300).exists()) {
                log("出现任务按钮，停止滑动")
                sleep(3000);
                break;
            }
            swipe(300, 820, 200, 400, 130)
            sleep(1000);
        }
        act.clickKj(text("分享上方图片到微信").boundsInside(0, text('步骤1：').findOne().bounds().bottom, 1080, text("举报屏蔽").findOne().parent().bounds().top).findOne());
        sleep(4000);
        if (wechat.waitWechat()) {
            if (wechat.shareToFileTransfer()) {
                识别二维码跳转()
            };
        }
    }

    function 识别二维码跳转() {
        sleep(2000);
        var count = text("云享社区").find().length;
        if (text("云享社区").findOnce(count - 1).parent().parent().child(0).child(0).child(0).className() === "android.widget.ImageView") {
            click(text("云享社区").findOnce(count - 1).bounds().right, text("云享社区").findOnce(count - 1).bounds().top - 400)
            sleep(1000);
        }
        sleep(1000);
        wechat.识别二维码();

    }


}
yxAct.二维码微信转链接 = function () {


    if (textContains('请长按网址复制后使用浏览器访问').exists()) {
        log("内容被屏蔽,取消任务");
        var url = textContains('请长按网址复制后使用浏览器访问').findOne().parent().child(1).text();
        log(url);
        app.openUrl(url);
        // return;
    }
}

yxAct.分享到微信打开链接 = function () {
    var taskTxt;
    sleep(2000);
    if (yxAct.currentA() === "任务详情") {
        taskTxt = yxAct.getTaskTxt();
        for (var i = 1; i < 8; i++) {

            if (text("分享上方链接到微信").boundsInside(0, text('步骤1：').findOne().bounds().bottom, 1080, text("举报屏蔽").findOne().parent().bounds().top - 300).exists()) {
                log("出现任务按钮，停止滑动")
                sleep(3000);
                break;

            }
            swipe(300, 820, 200, 400, 130)
            sleep(1000);
        }


        sleep(500);
        if (text("分享上方链接到微信").exists()) {
            act.clickKj(text("分享上方链接到微信").findOne());
            sleep(2000);
        }
        log("领取任务")
    }

    sleep(4000);

    if (wechat.waitWechat()) {
        if (wechat.shareToFileTransfer()) {

            sleep(2000);
            wechat.explorLinkFromTalkActivety("指定", taskTxt)

        };
    }
}



yxAct.selectPic = function (imageName) {


    if (text("Pick an image").exists()) {
        log("选择图片")
        clickKj(text("文件").findOne());
        sleep(2000);
    }

    if (desc("显示根目录").exists()) {
        toastLog("选择图片")
        act.clickKj(text(imageName + ".png").findOne());
    }

    sleep(4000);

}

/**
 * 添加第num张图片
 * @param {添加图片按钮序号} num 
 */
yxAct.添加图片 = function (num, imgName) {
    sleep(500);
    var count = text("添加图片").find().length
    log("上传凭证需添加" + count + "张图片");
    if (isNaN(num)) {
        toastLog("参数不合法");
        return false;
    }
    if (num > count) {
        toastLog("添加图片按钮不存在，失败")
        return;
    }
    for (var ii = 0; ii < 10; ii++) {
        //上拉窗口确保需要的控件处在屏幕范围内        
        if (!text("添加图片").boundsInside(10, 280, 1080, 1800).findOnce(num - 1)) {
            swipe(300, 1120, 200, 600, 130)
            sleep(1600);
            if (ii > 8) {
                log("出现错误，滑动8次找不到添加图片按钮");
                return;
            }
        } else {
            act.clickKj(text("添加图片").findOnce(num - 1));
            sleep(2000);
            if (imgName != undefined) {
                yxAct.selectPic(imgName);
                sleep(3000)
            }

            return true;
        }
    }
    log("错误，找不到添加图片按钮")
    return false;


}
//num为上传截图数量，此时为解决微信帮投传图
yxAct.上传截图单 = function (imageName) {

    if (yxAct.currentA() === "任务详情") {

        var w = text("上传截图").findOne().bounds().width()

        var x = text("上传截图").findOne().bounds().centerX()
        var y = text("上传截图").findOne().bounds().centerY() + 200
        click(x, y);
        sleep(3020);
    }

    yxAct.selectPic(imageName);


    sleep(2000);
    // selectedSign 为选择图片后出现的“红色×”控件 
    var selectedSign = className("ImageView").depth(17).boundsInside(0, text("上传截图").findOne().bounds().bottom, 600, text("上传截图").findOne().bounds().bottom + 300).findOne();
    if (selectedSign) {
        log("上传图片成功,开始提交任务");
        act.clickKj(text("完成任务").boundsInside(0, 1848, 1080, 2202).findOne());
        sleep(2000);
    }

}
yxAct.上传截图两张 = function (imageName1, imageName2) {
    log("1")
    if (yxAct.currentA() === "任务详情") {

        if (text("上传截图").exists()) {
            var x = text("上传截图").findOne().bounds().centerX()
            var y = text("上传截图").findOne().bounds().centerY() + 200
            click(x, y);
            sleep(3020);
        }
    }
    yxAct.selectPic(imageName1);
    log("2")
    if (yxAct.currentA() === "任务详情") {

        if (text("上传截图").exists()) {
            var w = text("上传截图").findOne().bounds().width()

            var x = text("上传截图").findOne().bounds().centerX() + w
            var y = text("上传截图").findOne().bounds().centerY() + 200
            click(x, y);
            sleep(3020);
        }
    }
    yxAct.selectPic(imageName2);


    sleep(2000);
    // selectedSign 为选择图片后出现的“红色×”控件 
    if (className("ImageView").depth(17).boundsInside(0, text("上传截图").findOne().bounds().bottom, 600, text("上传截图").findOne().bounds().bottom + 300).exists()) {
        var selectedSign = className("ImageView").depth(17).boundsInside(0, text("上传截图").findOne().bounds().bottom, 600, text("上传截图").findOne().bounds().bottom + 300).findOne();
        if (selectedSign) {
            log("上传图片成功,开始提交任务");
            act.clickKj(text("完成任务").boundsInside(0, 1848, 1080, 2202).findOne());
            sleep(2000);
        }
    }

}


yxAct.examPic = function () {
    // selectedSign 为选择图片后出现的“红色×”控件 
    var selectedSign = className("ImageView").depth(17).boundsInside(0, text("上传截图").findOne().bounds().bottom, 600, text("上传截图").findOne().bounds().bottom + 300).findOne();
    if (selectedSign) {
        log("上传图片成功,开始提交任务");
        act.clickKj(text("完成任务").boundsInside(0, 1848, 1080, 2202).findOne());
        sleep(2000);
    }
}
yxAct.领取任务 = function (taskName) {

    act.launchApp_(mainApp);
    sleep(5000);

    if (!yxAct.toTaskType()) { log("未能到达任务类型页"); };
    sleep(2000)



    for (var t = 0; t < 3; t++) {
        if (yxAct.currentA() === "任务状态") {
            act.click(text("完成悬赏").depth(17));
            sleep(3000);
        }
    }
    sleep(300);


    if (yxAct.currentA() === "任务详情") {

        sleep(1000);
        if (!yxAct.isCurrentTaskPage(taskName)) {
            yxAct.cancelTask();
        }
    }



    if (yxAct.currentA() === "任务类型") {
        if (text(taskName).findOne().bounds().top > device.height - 300) {
            scrollDown();
            sleep(2222);
        }
        act.clickKj(text(taskName).findOne().parent().child(0));
        sleep(1000);

    }

    for (var t = 0; t < 3; t++) {

        if (text('当前类别无任务或者你已屏蔽，请从其它类别接任务到屏蔽页面解除屏蔽').exists() ||
            text('当前类别无作业请接其他类别，或请稍等片刻！如果遇到问题加群咨询QQ群号:786070187').exists()) {
            log("无任务或被屏蔽");
            yxAct.setTaskStorage(taskName, new Date().getTime());
            return false;
        }
        sleep(1000)
    }
    sleep(300);

    if (yxAct.currentA() === "任务详情") {

        if (!yxAct.isCurrentTaskPage(taskName) ) {

            yxAct.cancelTask();
            sleep(3000);
            if (text(taskName).exists()) {

                act.clickKj(text(taskName).findOne());
                return true;

            } else {
                yxAct.领取任务(taskName);

            }

        }
        yxAct.赏金();
        return true;
    }
    return false;

}



yxAct.复制口令 = function () {
    if (text('复制上方内容').exists()) {
        var textCode = text('复制上方内容').findOne().parent().parent().parent().child(2).child(0).text();
        log(textCode);

        return textCode;
    }
}

yxAct.复制链接 = function () {
    if (text('分享上方链接到微信').exists() && textContains("http").exists()) {
        var textCode = textContains("http").findOne().text();
        log("分享链接为：" + textCode);
        return textCode;
    } else {
        log("复制链接失败");//+yxAct.复制链接)
        return false;
    }
}

yxAct.赏金 = function () {
    if (text('资金已托管，过审立结').exists()) {

        var textCode = textContains('赏金').textContains("元").findOne().text();


        log(textCode)
        var money = act.getStringBetweenTwoChar(textCode, "金", "元");
        log("此次赏金：" + Number(money) + "元")
        return Number(money);
    }
}
yxAct.restartTask = function (mainName) {
    app.launchApp(mainName);
    yxAct.toTaskType();
}
// 初始化任务状态
yxAct.initTaskStorage = function () {
    log("初始化任务状态")
    var taskStorage = storages.create("任务类型状态");
    //保存
    var dateNow = new Date().getDate();
    var monthNow = new Date().getMonth();
    var timeNow = new Date().getTime();
    if (taskStorage.contains("月") && taskStorage.contains("日")) {

        var month0 = taskStorage.get("月")
        var date0 = taskStorage.get("日");


        if (date0 != dateNow && month0 != monthNow) {
            log("今天第一次更新任务列表");
            taskStorage.put("日", dateNow);
            taskStorage.put("月", monthNow);
        } else {
            log("今天已做过任务，列表无需初始化");
            return false;
        }

    } else {
        taskStorage.put("日", dateNow);
        taskStorage.put("月", monthNow);
    }

    var taskListAll = ['微文阅读', '微文帮投', '其他帮投', '信息关注', '扫码浏览', '京东帮砍', '高价悬赏', '分享朋友圈', '其他阅读',
        '淘口令', '多多帮砍', '多多帮拆', '多多其他', '艺龙帮砍', '头条信息', '信息求赞_', '信息求关注_', '其他求助_', '评论信息',
        '信息求赞', '信息求关注', '其他求助', '知乎信息', '火山', '美团帮砍', '京喜口令', '微视信息', '小红书其他', "微微视频", "云扫码"]
    for (var i in taskListAll) {
        taskStorage.put(taskListAll[i], true);
    }
    log("初始化可做任务列表成功，详情：" + taskStorage.get("其他求助_"))
    return taskStorage;

}

/**
 *每做完一个类型任务更新一次任务数组 
 *每次任务失败将状态存储在任务storage中
 * 经过比较
 * 返回 当前可做任务数组 
 */
yxAct.getTaskList = function () {
    var nowT = new Date().getTime();
    var taskStorage = storages.create("任务类型状态");
    var taskList = [];
    // if ((nowT - taskStorage.get()) / 1000 > 3600) {
    //     taskList.push('微文阅读');
    // }
    // if ((nowT - taskStorage.get()) / 1000 > 3600) {
    //     taskList.push('其他阅读');
    // }
    var taskListAll = ['微文阅读', '微文帮投', '信息关注', '京东帮砍', '分享朋友圈', '其他阅读',
        '多多帮砍', '多多帮拆', '多多其他', '头条信息', '信息求赞_', '信息求关注_', '其他求助_', '评论信息',
        '信息求赞', '信息求关注', '其他求助', '知乎信息', '小红书其他', "微微视频", "点点金"]
    for (var i in taskListAll) {

        if (act.isBoolean(taskStorage.get(taskListAll[i]))) {
            if (taskStorage.get(taskListAll[i])) {
                taskList.push(taskListAll[i])
            }
        }

        if (act.isNumber(taskStorage.get(taskListAll[i]))) {
            if ((nowT - taskStorage.get(taskListAll[i])) / 1000 > 3600) {
                taskList.push(taskListAll[i]);
            }
        }
    }

    return taskList;
}

/**
 * 设置任务状态
 */
yxAct.setTaskStorage = function (key, value) {
    var taskStorage = storages.create("任务类型状态");
    taskStorage.put(key, value);
    log("任务 " + key + "当前状态为 " + taskStorage.get(key));
}

/**
 * 设置任务状态
 */
yxAct.getTaskStorage = function (key) {
    var taskStorage = storages.create("任务类型状态");
    log("任务 " + key + "当前状态为 " + taskStorage.get(key));
    return taskStorage.get(key);
}

module.exports = yxAct;

