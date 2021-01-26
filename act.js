var act = {};
// var appName="云享社区"


act.launch_multi = function (appName, i) {

    if (i === undefined) {
        i = 0;

    } else {

        if (!act.isInteger(i)) {
            log("启动多应用分身序号参数错误");
            return false;
        }
    }

    app.launchApp(appName);
    sleep(1000);
    obj = id("name").text(appName).find(); //检索分身数量。确定脚本主循环次数
    if (!obj.empty()) {
        if (i < obj.length) {
            click(obj[i].bounds().centerX(), obj[i].bounds().centerY());
            log("第" + (i + 1) + "个应用分身已启动，请检查程序");
            return obj.length;
        } else {
            log("第" + (i + 1) + "个应用分身不存在，请检查程序");
            return i - obj.length;
        }
    } else {
        // log("没有分身界面");
        return null;
    }
};

act.isRoot = function () {

    try {
        var r = shell("ls /system/bin", true).result.toString();
        // log(r)
        if (r.length > 50) {
            return true
        } else {
            return false
        }

    } catch (err) {
        // log(err);
        return false;
    }
}
act.无障碍状态 = function () {
    var re = auto.service;
    if (re === null) {
        return false;
    } else {
        re = re.toString();
        if (re.indexOf("com.stardust.autojs.core.accessibility.AccessibilityService") != -1) {
            return true;
        } else {
            log("检查无障碍出错");
            return false;

        }
    }
}
//清后台
act.clearBack = function () {
    app.launchApp("时钟");
    sleep(350);
    back();
    sleep(1000);

    recents();
    sleep(1000);
    while (id("recents_cleanup").exists() || id("clear_button").exists()) {
        if (id("recents_cleanup").exists()) {
            log("清理后台");
            shareFun.clickKj(id("recents_cleanup").findOne());
            sleep(500);
        }

        if (id("clear_button").exists()) {
            // click(id("memory_info").findOne().parent().bounds().centerX(), id("memory_info").findOne().parent().bounds().centerY()-100); if (id("clear_button").exists()) {
            log("清理后台");
            id("clear_button").click();
            sleep(2000);
        }
        sleep(1000);
    }
};
act.runReady = function () {
    //点亮屏幕，设置屏幕为常亮。
    if (device.isScreenOn()) {
        log("亮屏OK");
        device.keepScreenOn();
    } else {
        log("唤醒屏幕");
        device.wakeUpIfNeeded();
        sleep(1200);
        swipe(300, 1500, 200, 400, 400);
        device.keepScreenOn();
    }
    if (device.getBrightnessMode() === 1) {
        device.setBrightnessMode(0), toastLog("亮度模式改为手动")
    } //亮度模式改为手动
    device.setBrightness(2); //设置亮度为0
    // auto().waitFor();//检查无障碍是否打开  
    //检查线缆是否插好，手机是否有电  
    if (!device.isCharging()) {
        toastLog("usb线未连接，请先连接数据线");
        sleep(2 * 1000);
    } else {
        if (device.getBattery() < 20) {
            toastLog("电量小于20%，本脚本耗电，请插充电器");
        }
    }
    if (device.getNotificationVolume() != 0) {
        device.setNotificationVolume(0)
    }; //提示音量为0
    // if (shareFun.netState()==="网络断开") { log("网络端看"); shareFun.exe2_setting("WIFI"); sleep(300); click("WIFI") }
    device.setMusicVolume(0); //媒体音量0
    device.setAlarmVolume(0); //闹铃为0 声音范围0-15
    device.cancelVibration(); //取消震动
};
act.captureScr = function (fileName) {
    var img
    var path = path || files.getSdcardPath() + "/yxCapture/" + fileName + ".png";
    if (act.isRoot()) {
        files.ensureDir(path)
        var dd = shell("screencap -p " + path, true)
        if (dd.code == 0) {
            log("root截图：" + fileName + ".png");
            return true;
        } else {
            log("错误信息:")
            log(dd.error)
            return false;
        }

    } else {
        var img = captureScreen();
        files.ensureDir(path)
        images.saveImage(img, path);//保存图片            
        media.scanFile(path); //加入图库 
        sleep(300);
        log("正常截图：" + fileName + ".png");
        return true;
    }
};

//删除图片
// @Parm   图片路径:{string}
act.delImg = function (imageName) {

    var path = files.getSdcardPath() + "/yxCapture/" + imageName + ".png"
    if (files.remove(path)) {
        log("截图已删除");
        media.scanFile(path);
        sleep(680)
    };
};


act.getStrSum = function (str) {
    /*
@思路
/1.首先遍历字符串每一数据
/2.把找到的数据放进对象中
/3.if判断是否有重复数据,如果有就+1,没有就等于1
/4.str.charAt(i) 返回当前下标对应的字符 列如let str=abc; str.charAt(1)获取的是b
/5.把保存对象遍历,进行比对,取最大的值出来打印
*/
    let obj = {};
    for (let i = 0; i < str.length; i++) {
        if (obj[str.charAt(i)]) {
            obj[str.charAt(i)]++;
        } else {
            obj[str.charAt(i)] = 1;
        }
    }
    let sum = 0;
    let number;
    for (let key in obj) {
        if (obj[key] > sum) {
            sum = obj[key]
            number = key
        }
    }
    log(obj);
    console.log(number + '出现了=====' + sum + '次');
    return number;
};
/**
 * 基本控件操作改写
 *  auto.js  控件条件变量在每一次链式调用后条件变量变化为调用串值。引起错误
 * 解决方法是在函数开始时将控件条件变量转换为控件固定下来。
 * 比如：var a=text("txt"), 在调用 a.id("").depth(3)以后 a值就变为a+id..后面那一串字符的值。
 * 猜测 a在被调用后被当做一个整体，或者说a就是一个地址指针，只要涉及调用，指针就指向新的数值。
 * 解决办法：a=a.findOne()将a转变为控件。
 *  绝对不要在控件条件变量与findOne()等控件函数之间加多属性 比如:a.className().id()调用后a值会变化。
 */
//由于控件点击很常用,我们做个函数,参数为寻找控件字符串

act.click = function (kj) {
    // log(kj);
    if (kj.exists()) {
        log("控件有")
        log(kj.findOne().text());
        if (kj.findOne().clickable()) {
            kj.findOne().click();
            log("clickable为ture");
            return true;
        }
        log("2")
        // log(kj)
        // var kj1 = kj.findOne();
        if (click_(kj)) { return true }

        if (upSwipeClick(kj)) { return true }
        if (downSwipeClick(kj)) { return true }
        return false;
    }
    function click_(kj_) {
        // log(kj_);
        kj_ = kj_.findOne()
        if (kj_.bounds().top > 200 && kj_.bounds().bottom < device.height - 300 && kj_.bounds().bottom > 0) {
            // log(kj_.bounds())
            act.clickKj(kj_);
            return true;
        }
    }


    function upSwipeClick(kj_) {

        if (kj_.findOne().bounds().bottom > (device.height - 300)) {
            log("上划");
            for (var i = 1; i < 10; i++) {

                if (kj_.findOne().bounds().top > 200 && kj_.findOne().bounds().top < device.height - 300 && kj_.findOne().bounds().bottom > 0) {

                    log(kj_.findOne().bounds())
                    log("控件出现，停止滑动")
                    sleep(1000);

                }
                swipe(300, 820, 200, 400, 130)
                sleep(1000);

            }
            act.clickKj(kj_.findOne());
            return true;

        }
    }

    function downSwipeClick(kj_) {
        if (kj_.findOne().bounds().bottom < 300) {
            log("下划");
            for (var i = 1; i < 10; i++) {
                if (kj_.findOne().bounds().top > 200 && kj_.findOne().bounds().top < device.height - 300 && kj.findOne().bounds().bottom > 0) {

                    log(kj_.findOne().bounds())
                    log("控件出现，停止滑动")
                    sleep(1000);
                    break;
                }
                swipe(200, 400, 300, 820, 130)
                sleep(1000);
            }
            act.clickKj(kj_.findOne());
            return true;
        }
        sleep(888);
    }
}

act.click_ = function (kj, num) {
    if (num === undefined) { num = 1 };
    for (var i = 0; i < num; i++) {
        if (kj.exists()) {
            log(kj)
            act.clickKj(kj.findOne());
            sleep(2500);
        }

    }
}
act.clickKj = function (kj) {
    // log(kj)
    if (kj) {
        var x = kj.bounds().centerX()
        var y = kj.bounds().centerY()
        log('将要点击的坐标 %s,%s', x, y)
        press(x, y, 1)
    } else {
        log('没有找到控件')
    }
}
act.doubleClickKj = function (kj) {
    act.clickKj(kj);
    sleep(100);
    act.clickKj(kj);
}
act.doubleClick = function (x, y) {
    click(x, y);
    sleep(100);
    click(x, y);
}
//未免点击失败，多次点击
act.textClick = function (txt) {
    var i = 0;

    if (desc(txt).exists()) {
        do {
            i++;
            if (i > 6) {
                log("连续6次点击失败，跳过点击" + txt + "按钮")
                return false;
            }
            this.clickKj(desc(txt).findOne());
            sleep(1500);
        } while (desc(txt).exists())
        return true;
    }
    if (text(txt).exists()) {
        this.clickKj(text(txt).findOne());
        do {
            i++;
            if (i > 6) {
                log("连续6次点击失败，跳过点击" + txt + "按钮")
                return false;
            }
            this.clickKj(text(txt).findOne());
            sleep(1500);
        } while (text(txt).exists())

        return true;
    }
}
act.textClickSeveral = function (txt, num) {
    if (desc(txt).exists()) {
        for (var i = 0; i < num; i++) {
            this.clickKj(desc(txt).findOne());
            sleep(500);
        }
    }
    if (text(txt).exists()) {
        this.clickKj(text(txt).findOne());
        for (var i = 0; i < num; i++) {
            this.clickKj(text(txt).findOne());
            sleep(500);
        }
    }
}

act.滑动屏外控件至可视区 = function (kj) {
    /**
     * 
     * @param {条件 比如：text("控件属性")} kj 
     */
    //条件属性转换为控件对象，防止条件字符串变化
    kj_ = kj.findOne()
    log(kj_.bounds());
    //
    if (kj_.bounds().top > 500 && kj_.bounds().bottom < device.height - 500) {
        log("找到控件")
        return true;
    }
    //控件在屏幕下方，上划
    if (kj_.bounds().bottom > (device.height - 500)) {
        log("上划");
        for (var i = 1; i < 10; i++) {
            kj_ = kj.findOne()
            // log(kj)
            if (kj_.bounds().top > 500 && kj_.bounds().top < device.height - 500) {

                log(kj_.bounds())
                log("控件出现，停止滑动")
                sleep(1000);
                return true;
            }

            if (Math.abs(kj_.bounds().top / device.height) > 4) {
                log("快划")
                swipe(300, 1450, 200, 400, 120)
                continue;
            }


            if (Math.abs(kj_.bounds().top / device.height) >= 2) {
                swipe(300, 935, 200, 400, 120)
                continue;
            }
            if (Math.abs(kj_.bounds().top / device.height) < 2 && Math.abs(kj_.bounds().top / device.height) >= 1) {
                swipe(300, 920, 200, 400, 130);

            }
            if (Math.abs(kj_.bounds().top / device.height) < 1 && Math.abs(kj_.bounds().top / device.height) > 0.6) {
                swipe(500, 1600, 560, 1160, 137)
            }
            if (Math.abs(kj_.bounds().top / device.height) <= 0.6 && Math.abs(kj_.bounds().top / device.height) > 0.3) {
                swipe(500, 1600, 560, 1180, 137)
            }
            if (Math.abs(kj_.bounds().top / device.height) < 0.6 && Math.abs(kj_.bounds().top / device.height) <= 0.3) {
                swipe(300, 635, 200, 400, 120)
            }

            sleep(1000);
            return false;
        }
    }



    //控件在屏幕下方，下划
    if (kj_.bounds().bottom < 500) {
        log("下划");
        for (var i = 1; i < 10; i++) {
            kj_ = kj.findOne()
            // log(kj)
            if (kj_.bounds().top > 500 && kj_.bounds().top < device.height - 500 && kj_.bounds().bottom > 0) {

                log(kj_.bounds())
                log("控件出现，停止滑动")
                sleep(1000);
                return true;
            }
            if (Math.abs(kj_.bounds().top / device.height) > 4) {

                log("快画")
                swipe(200, 400, 300, 1450, 120)
                continue;
            }


            if (Math.abs(kj_.bounds().top / device.height) >= 2) {
                swipe(200, 400, 300, 935, 120)
                continue;
            }
            if (Math.abs(kj_.bounds().top / device.height) < 2 && Math.abs(kj_.bounds().top / device.height) >= 1) {
                swipe(200, 400, 300, 920, 130);

            }
            if (Math.abs(kj_.bounds().top / device.height) < 1) {
                swipe(200, 400, 300, 835, 120)

            }
            sleep(1000);
        }
        return false;

    }


    sleep(888);
}

act.拖动控件至纵坐标 = function (kj, top) {
    /**
     * @param {条件 比如：text("控件属性")} kj 
     * @param {拖动目的地纵坐标} top 
     */

    //条件属性转换为控件对象，防止条件字符串变化
    kj_ = kj.findOne()
    // log(kj_);
    //
    // if(kj_.bounds().top>device.height)
    var height_;
    if (kj_.bounds().top > top && kj_.bounds().top < device.height) {

        height_ = kj_.bounds().top - top;
        log("上拉控件" + height_ + "个像素");



        swipe(550, 1500, 666, 1500 - height_, 1688);
        return true;
    }

    if (kj_.bounds().top < top && kj_.bounds().top > 0) {

        height_ = top - kj_.bounds().top;
        log("下拉控件" + height_ + "个像素");
        swipe(668, 500, 550, 500 + height_, 320);
        return true;
    }


}

act.kjBounds = function (Kj) {
    /** rect转为四角坐标数组
     * {控件}@param 比如:text("搜索").findOne()
     * 返回值数组形式的 bounds 
     */

    if (Kj) {

        log(Kj.bounds().left + "," + Kj.bounds().top + "," + Kj.bounds().right + "," + Kj.bounds().bottom)
        return [Kj.bounds().left, Kj.bounds().top, Kj.bounds().right, Kj.bounds().bottom]
    }
}

act.isAppA = function (appName) {


    if (enabled(true).exists() && enabled(true).findOnce().packageName() === app.getPackageName(appName)) {
        return true
    } else {
        return false;
    }
}
act.launchApp_ = function (appName) {

    act.launch_multi(appName);
    // toastLog("主程序开始运行");
    for (var i = 0; i < 10; i++) {
        if (act.isAppA(appName)) {
            log("打开应用成功");
            return true;
        }
        sleep(1000);

    }

    return false;
}
/**
* 参数不能为等式 等可以得出具体值的对象
* 用来解决等待一个或者两个如 widget.exists()控件出现的状况
 */
act.waitWidget12s = function (a, b) {
    log(a + "/" + b)
    for (var i = 0; i < 3; i++) {
        if (b === undefined) {
            log("单参数")
            if (!a.exists()) {
                sleep(3800);
                log(a + "/" + b)
                toastLog("条件" + a + "不存在,等待。。。。。");
            } else {
                return true;
            }
        } else if (!(a.exists() && b.exists())) {
            log(a + "/" + b);
            sleep(5000);
            toastLog("条件  " + a + "===" + b + " 不存在,等待。。。。。")
        } else {
            return true;
        }
    }
    return false;
}
act.获取本机号码 = function () {
    var mTelephonyManager = context.getSystemService(context.TELEPHONY_SERVICE);
    var phoneNumber = mTelephonyManager.getLine1Number();
    return phoneNumber;
};

act.slowSwipe = function () {
    var x1 = random(255, 870);
    var y1 = random(500, 600);
    var x2 = random(255, 870);
    var y2 = random(900, 1000);
    var time1 = random(3000, 5000);
    var time2 = random(1000, 2000);
    sml_move(x1, y1, x2, y2, time2);
    sleep(time1);
}

function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    };
    log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    log(xxy);
    gesture.apply(null, xxy);
};

function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;



    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};

act.closePop = function () {
    var str = "我知道了确定允许是的关闭"
    var regs = /知道了|我知道了|确定|允许|关闭/g;
    log(regs.test(str))
    // act.clickKj(text(kjName).findOne());
}

//用正则表达式判断关闭窗口控件，循环等待关闭窗口控件出现
act.readAd = function () {
    var reg = /tt_video_ad_close_layout/g;
    while (!id("tt_video_ad_close_layout").exists()) {
        sleep(3000);

    }
    act.clickKj(id("tt_video_ad_close_layout").findOne());


}

function upImg(task_txt) {
    rs_i = 0;
    while (isCurrentPage("dyPage")) {
        sleep(200);
        log("返回攒攒提交任务")
        sleep(200);
        shareFun.exchangeApp("攒攒");
        sleep(random(1, 2) * 1000);
        timeoutRestart(rs_i);
    }
    if (isCurrentPage("mainPage")) {
        if (mainPageTo("getTaskPage") != "") {
            getTaskPageTo("doTaskPage")
        }
    }
    rs_i = 0;
    if (dyVideoMiss) {
        giveUpTask();
        return;
    }
    while (text("打开D音 直接做任务").exists() && !text("×").exists()) {
        log("打开选图页");
        text("任务截图").findOne().click();
        sleep(random(888, 999));
        if (text("文件").exists()) {
            shareFun.clickKj(text("文件").findOne())
        };
        sleep(888);
        if (text("选择图片").exists() && text("所有图片").exists()) {
            log("开始选图");
            if (task_txt.indexOf("评论") != -1) {
                selectImg(2);
            } else {
                selectImg(1);
            }
            sleep(600);
        }
        sleep(6 * 1000);
        timeoutRestart(rs_i);
        imgCan = images.captureScreen();
        sleep(100);
        if (images.detectsColor(imgCan, "#EFEFF4", 653, 794, 5) && images.detectsColor(imgCan, "#EFEFF4", 832, 937, 5) && images.detectsColor(imgCan, "#EFEFF4", 732, 846, 5)) {
            log("截图框不是橘黄色，任务未刷新或者图片提交卡死,重传");
            shareFun.clickKj(className("android.view.View").text("×").findOne());
            sleep(300);
            continue;
        }
        log("截图已选，核查选图");
        sleep(300);
        if (!images.detectsColor(imgCan, "#F84F78", 850, 829, 20) && task_txt.indexOf("点赞") != -1) {
            log("点赞截图错误，重做任务");
            shareFun.clickKj(className("android.view.View").text("×").findOne());
            sleep(200);
            reDoMark = true;
            return;
        }

    }


}
act.selectImg = function (path_) {
    sleep(800);
    if (path_ === 1) {
        log("选择图1");
        if (device.model.search(/XT|L78011/g) != -1) {
            log("点击坐标" + Math.floor(device.width / 4) + "," + Math.floor(device.height / 3))
            click(Math.floor(device.width / 4), Math.floor(device.height / 3));
        } else {
            log("点击坐标" + Math.floor(device.width / 6) + "," + Math.floor(device.height / 10))
            click(Math.floor(device.width / 6), Math.floor(device.height / 10));

        }
        sleep(600);
        // id("done").findOne().click();
    }
    if (path_ === 2) {
        log("选择图2");
        if (device.model.search(/XT|L78011/g) != -1) {
            click(Math.floor(device.width / 6), Math.floor(device.height / 5));
        } else {
            click(Math.floor(device.width / 6), Math.floor(device.height / 10));

        }
        sleep(600);
        // id("done").findOne().click();
    }
};
act.强行关闭 = function (appName) {

    if (act.isRoot()) {
        shell('am force-stop ' + getPackageName(appName), true);
        return true;

    }

    openAppSetting(getPackageName(appName));
    sleep(870);

    if (text("强行停止").exists()) {
        click("强行停止");
        sleep(1000)
        click("强行停止");
        sleep(200);
    }
    if (text("要强行停止吗？").exists()) {
        click("确定");
        sleep(500)
        click("确定");
        sleep(200)
    }
    if (desc("向上导航").exists()) {
        desc("向上导航").findOne().click();
        sleep(366)
    }
}
act.停止appRoot = function (appName) {
    var packageName = getPackageName(appName);
    shell('am force-stop ' + packageName, true);
}
//浅层数组去重
// filter：
act.unique = function (arr) {
    return arr.filter(function (elem, index, arr) {
        return arr.indexOf(elem) === index;
    });
}

//判断数据类型
// 判断数字
act.isNumber = function (obj) {
    return obj === +obj
}
// 判断字符串
act.isString = function (obj) {
    return obj === obj + ''
}
// 判断布尔类型
act.isBoolean = function (obj) {
    return obj === !!obj
}
//判断整数
act.isInteger = function (obj) {
    return Math.floor(obj) === obj
}



/**
 * 字符串操作函数
 * @param {*} str 
 * @param {*} char1 
 * @param {*} char2 
 */
//返回两个指定字符之间的字符串
act.getStringBetweenTwoChar = function (str, char1, char2) {

    var left = str.indexOf(char1), right = str.indexOf(char2);
    // log(left+"/"+right)
    if (char2 === undefined) { right = str.length }
    return str.substring(left + char1.length, right);
}

//两个字符串的相似程度，并返回相似度百分比
act.strSimilarity2Percent = function (s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(s, t);
    return (1 - d / l).toFixed(4);
    function strSimilarity2Number(s, t) {
        var n = s.length, m = t.length, d = [];
        var i, j, s_i, t_j, cost;
        if (n == 0) return m;
        if (m == 0) return n;
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        for (i = 1; i <= n; i++) {
            s_i = s.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                t_j = t.charAt(j - 1);
                if (s_i == t_j) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        return d[n][m];
    }
    function Minimum(a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    }
}


//--------------------------------------------------------------------//
/**
 * 返回网络状态,true为通，flase为断。log包括以下信息。
 * [type: WIFI[],     state: CONNECTED/CONNECTED,  extra: "sweethome"]
 * [type: MOBILE[LTE], state: CONNECTED/CONNECTED,  extra: 3gnet]
*/
act.getNetStatus = function () {

    importClass(android.net.ConnectivityManager);
    var cm = context.getSystemService(context.CONNECTIVITY_SERVICE);
    var net = cm.getActiveNetworkInfo();
    log(net);
    if (net == null || !net.isAvailable()) {

        toastLog("网络连接不可用!");
        return false;
    } else {
        toastLog("网络连接可用!");
        return true;
    }
}
module.exports = act;