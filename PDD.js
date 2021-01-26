var act = require("./act.js");
var wechat = require("./wechat.js");
var yxAct = require("./yxAct.js");
var mainApp = "云享社区"
// images.requestScreenCapture();
// sleep(300); //请求截图权限必须加延时，否则会引起寻找识别控件错误

var PDD = {};
var type; //任务类型：1为微信 2为app
var clipCode = ""; //任务分享口令


function currentA() {

    if (text("首页").boundsInside(0, 1850, 1080, 2200).exists() && text("限时秒杀").boundsInside(0, 320, 1080, 800).exists()) {
        log("当前拼多多主页");
        return "主页";
    }

    if (text("推荐").boundsInside(0, 0, 1080, 400).exists()) {
        log("当前推荐页");
        return "推荐"
    }
    if (text("拼单返现").exists()) {
        log("个人中心");

        // text("个人中心").boundsInside(0,1850,1080,2200).findOne().parent().click();
        return "个人中心"
    }

    if (text('啊哦，今日帮砍次数上限啦').exists()) {
        log("砍价次数已达上限");

        return "砍价上限"
    }
    if (text("分享的多多口令").exists() && text("帮好友砍一刀").exists()) {
        log("PDD砍价口令弹窗");

        return "砍价口令弹窗"
    }

    if (text("分享的多多口令").exists() && text("去领现金").exists() || text("帮好友助力有机会直接提现").exists()) {
        log("PDD拆包口令弹窗");

        return "拆包口令弹窗"
    }

    if (text("砍价免费拿 包邮送到家").exists()) {
        log("砍价界面");

        return "砍价界面"
    }

    if (text('你的助力次数已达上限').exists()) {
        log("拆包次数已达上限");

        return "拆包上限"
    }


    if (text('我成功砍到0元啦，快来一起免费拿').exists() || text('我成功砍到0元啦，快来一起免费拿').exists()) {
        log("砍价成功");

        return "砍价成功"
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
PDD.多多帮砍 = function () {

    var 砍价上限 = yxAct.getTaskStorage("多多帮砍");
    var reg = /帮好友砍一刀|选商品再次帮好友|给你发红包，麻烦帮我砍一刀|选我/;
    //是否达上限
    if (act.isBoolean(砍价上限)) {
        if (!砍价上限) {
            return;
        }
    } else {
        砍价上限 = true;
    }
    sleep(2 * 1000);



    yxAct.领取任务("多多帮砍");
    if (!yxAct.currentA() === "任务详情") {
        log("领取任务失败");
        return false;
    }
    sleep(1500);

    if (任务跳转()) {
        log("准备砍价")
    } else if (任务跳转()) {
        log("准备砍价")
    } else {
        yxAct.cancelTask();
        return;
    }
    if (act.isAppA("微信") && desc("返回").exists()) {
        if (text('网页包含诱导分享、关注等诱导行为内容，被多人投诉，请长按网址复制后使用浏览器访问。').exists()) {
            log("网页包含诱导分享、关注等诱导行为内容被屏蔽,取消任务");
            yxAct.cancelTask();
            return;
        }
    }

    if (砍价(type)) {
        toastLog("砍价完成");
        提交图片();
    }
    sleep(2000);
    //跳转到app任务页方式

    function 任务跳转() {
        // 
        launchApp(mainApp);
        sleep(3000);
        log("转向任务");
        if (linkToKJ()) { return true };
        if (复制口令转app()) { return true };
        if (分享上方图片到微信()) { return true };
        return false;

    }
    function linkToKJ() {

        if (text("分享上方链接到微信").exists()) {

            log("分享上方链接到微信");
            var wxLink = yxAct.复制链接();
            if (wxLink.indexOf("http") === -1) {
                log("非法链接，跳往下一步");
                return;
            }

            sleep(1 * 1000);
            app.openUrl(wxLink); //打开砍价页，使用chrome浏览器可以直达页面

            sleep(8000);

            if (textMatches(reg).exists()) {
                toastLog("已打开砍价页");
                toTaskLink = true;

                type = 2;
                return true;
            } else if (linkToWx()) {
                type = 1;
                toTaskLink = true;
                return true;
            }
            toTaskLink = false;

            return false;
        }
    }
    function linkToWx() {
        act.launch_multi(mainApp);
        sleep(3000);
        if (text("分享上方链接到微信").exists()) {
            log("分享上方链接到微信")
            type = 1;
            yxAct.分享到微信打开链接();
            sleep(8 * 1000);
            if (textMatches(reg).exists()) {
                toastLog("已打开砍价页");
                toTaskLink = true;
                return true;
            } else {
                toTaskLink = false;
            }
        }
    }
    function 复制口令转app() {

        act.launch_multi("云享社区");
        sleep(2000);
        if (text("复制上方内容").exists() && textContains("复制口令").exists()) {
            sleep(300);
            clipCode = yxAct.复制口令();
            log("clipCode:" + clipCode)
            if (clipCode.indexOf("http") != -1) {
                log("非法口令，跳往下一步");
                return;
            }

            sleep(1000);
            sleep(2000);


            if (currentA() != "砍价口令弹窗") {
                setClip(clipCode);
                sleep(5000);
            }
            sleep(588);

            if (!textMatches(reg).exists()) {
                log("未见砍价页")
                act.强行关闭("拼多多");
                setClip(clipCode);
                sleep(1000);
                act.launch_multi("拼多多");
                sleep(5000);
            }
            sleep(1000);
            if (textMatches(reg).exists()) {
                toastLog("出现弹窗,砍价");
                type = 2;;
                act.click(textMatches(reg));
                sleep(2000);
                type = 2;
                return true;
            }
        }
        return false;
    }
    function 分享上方图片到微信() {
        if (text("分享上方图片到微信").exists()) {
            log("分享上方图片到微信")
            yxAct.分享二维码();
            sleep(3000);

            if (text('如需浏览，请长按网址复制后使用浏览器访问').exists() || text('已停止访问该网页').exists()) {
                yxAct.cancelTask();
                return false;
            }

            if (textMatches(reg).exists()) {
                toastLog("已打开砍价页");
                type = 1;
                return true;
            } else {
                return false;
            }
        }
    }
    function 砍价() {

        var 砍价 = true,
            个人中心 = false; //同为true ，说明图片截取成功，可以提交
        //微信帮砍         
        if (type === 1) {
            toastLog("微信帮砍");
            if (微信砍价()) {
                return true;
            }
        }
        //app帮砍
        if (type === 2) {
            toastLog("app帮砍");

            for (var iApp = 0; iApp < 3; iApp++) {
                if (app帮砍()) {

                    return true;
                }
                重新打开助力页面();

            }

        }
        return false;

    }
    function app帮砍() {

        // 第一步 ：找到砍价键，砍价
        regK = /点击抽签即可帮我砍价了|帮好友砍一刀|选商品再次帮好友|帮我砍价领奖励|领取红包|确认领取|选我|点击选择喜欢的商品/
        var itemp = 0;
        while (textMatches(regK).exists()) {

            if (itemp > 3) { log("循环三次找不到砍价页"); break; }

            var kJCount = textMatches(regK).find().length;
            log("符合条件按钮有" + textMatches(regK).find().length + "个")
            if (kJCount > 1) {
                for (var di = 0; di < kJCount; di++) {

                    log("顺序点击" + textMatches(regK) + "按钮第" + di + "个");

                    act.clickKj(textMatches(regK).findOnce(di));
                    sleep(168);

                }
            }


            if (currentA() === "砍价上限") {
                log("微信砍价已达上限")
                yxAct.setTaskStorage("多多帮砍", false)
                砍价上限 = false;
                act.强行关闭("拼多多")
                return false;
            }
            if (currentA() == "首次帮砍选红包" || textContains("砍掉金额可超越全国").exists() || (textContains("麻烦你挑一件商品免费拿").exists() && text("我有机会直接砍成").exists())) {
                app首次帮砍();
                sleep(1000);
            }

            itemp++;
        }
        sleep(2000);
        if (砍成截图()) {
            转个人中心截图();
            return true;
        }
        return false;
    }
    function 微信砍价() {

        log("微信帮砍第一步")
        微信首次帮砍();
        if ((text("帮好友砍一刀").exists() && desc("返回").exists()) || (text("帮好友砍一刀").exists() && text('').exists()) || text('快来帮我砍价 领惊喜奖励').exists()) {
            log("微信内砍价")
            log("砍价")
            act.click(text("帮好友砍一刀"))
            act.click(text('帮我砍价领奖励'));
            sleep(3 * 1000);
            click(device.width / 2, device.height / 2);//避免出现一些不知名窗口，随便点击一下，弹窗不对后面可以返回重来
            sleep(2000);

            if (currentA() === "砍价上限") {
                log("微信砍价已达上限")
                yxAct.setTaskStorage("多多帮砍", false)
                砍价上限 = false;
                act.强行关闭("拼多多")
                return false;
            }

            if (text('即将离开微信，打开“拼多多”').exists()) {

                log("从微信转往拼多多app")
                click('允许');
                sleep(5000);
                wx砍价状态 = false;
                app帮砍();
                return;
            }

        } else {
            if (砍成截图()) {
                转个人中心截图();
                return true;
            }
            返回微信重新打开助力页();
            sleep(2000);

        }
        微信首次帮砍();
        //第二步:检查是否首次砍价，是否砍价成功; 

        log("微信砍价第二步")
        sleep(2000);
        if (砍成截图()) {
            转个人中心截图();
            return true;
        }
        while (!(textContains("继续免费拿").exists() && text("砍价免费拿").exists())) {
            log("循环");
            sleep(2000);
            返回微信重新打开助力页();
            微信首次帮砍();
        }

        //第三步 截图

        log("第三步")
        if (砍成截图()) {
            转个人中心截图();
            return true;
        }

        function 返回微信重新打开助力页() {
            log("返回微信重新打开助力页")
            act.click(desc("返回"));
            act.click(text(''));
            launchApp("微信");
            sleep(3000);
            try {
                act.clickKj(text(mainApp).findOnce(text(mainApp).find().length - 1));
            } catch (err) {

            }

            sleep(5000);
        }

        return false;
    }
    function 砍成截图() {


        var regSuccess = /谢谢你帮我助力你也快砍成了，快去免费拿吧～|谢谢你帮我砍了一刀|谢谢你帮我，我马上成功了顺手帮你砍一刀，祝你也能免费拿～|谢谢你帮我砍了1刀|“谢谢你帮我砍价，你快砍成啦！继续免费拿吧”|我成功砍到0元啦，快来一起免费拿|我马上就快砍成啦，快来帮我助力吧～| 谢谢你帮我砍了0.01元|谢谢你帮我砍了0.01元，|谢谢你帮我助力|谢谢你帮我砍价，|送你超大红包/


        if (textMatches(regSuccess).exists()) {
            log("砍成截图")
            sleep(1000);
            act.captureScr("助力成功");
            砍价 = true;
            return true
        }

        if (textContains("商品啦，马上又要砍成啦").exists()) {
            log("砍成截图")
            sleep(1000);
            act.captureScr("助力成功");
            砍价 = true;
            return true
        }
        return false;

    }
    function 微信首次帮砍() {
        if (text('点击红包即可帮我砍价了').exists() || text('当前所在页面,砍价免费拿').exists() || textContains('已免费拿，送你一个砍成礼盒').exists()) {

            toastLog("开始微信首次帮砍")
            if (text('点击红包即可帮我砍价了').exists() && text("选我").exists()) {
                log("选红包")
                act.clickKj(text("选我").findOnce(1));
                sleep(5000);
            }

            if (text('点击选择喜欢的商品').exists()) {
                act.clickKj(text('点击选择喜欢的商品').findOnce(1));
                sleep(3 * 1000);
            }
            if (text('当前所在页面,砍价免费拿').exists() || (textContains('已免费拿，送你一个砍成礼盒').exists() && text('确认领取').exists())) {
                log("选商品")
                act.clickKj(textContains('已砍').boundsInside(10, 280, 1080, 1800).findOne());
                if (textContains('已砍').boundsInside(10, 280, 1080, 1800).findOne().checked()) {
                    log("选取成功");
                }
                sleep(3000);

                click("确认领取");
                sleep(3000);
            }
            if (text("确认收货地址").exists()) {
                click("已选择该商品，开始免费拿");
                sleep(3000);
            }
            log("首次免费拿流程完成");
        }

    }
    function app首次帮砍() {
        //需要确定是否首次帮砍
        // 重新打开助力页面();  
        log("首次帮砍")
        if (currentA() == "首次帮砍选红包") {
            log("选红包")
            text("选我").findOnce(1).click();
            sleep(2000);
        }
        log("1")
        if (textContains('选个商品免费拿，我们都有机会').exists()) {
            text('点击选择喜欢的商品').findOnce(1).click()
            sleep(3 * 1000);
        }
        log("2")

        function 选商品() {
            if (textContains("砍掉金额可超越全国").exists() || ((textContains("麻烦你挑一件商品免费拿").exists() && text("我有机会直接砍成").exists()))) {
                log("选商品")
                // var regs = /知道了|我知道了|确定|允许|关闭/;  
                // var name=text('￥0').findOne().parent().child(4).text().match(regs).toString();
                act.clickKj(textContains('已砍').boundsInside(10, 280, 1080, 1800).findOne());
                if (textContains('已砍').boundsInside(10, 280, 1080, 1800).findOne().checked()) {
                    log("选取成功");
                }
                sleep(3000);
                click("确认领取");
                sleep(3000);
            }
        }
        选商品();
        //如果出现第一步，说明需要选择商品参数，返回重新选择其他商品
        for (var ix = 0; ix < 4; ix++) {
            if (text('第一步：选商品').exists() && text('').exists()) {
                act.click(text(''));
                toastLog("重新选择商品");
                sleep(2000);
                选商品();
            }
            if (text("确认收货地址").exists()) {
                break;
            }
        }
        log("3")
        if (text("确认收货地址").exists()) {
            click("已选择该商品，开始免费拿");
            sleep(3000);
        }
        // '第三步：使用直接白拿卡'
        act.click(text('点击使用直接白拿卡，加速免费拿'));
        sleep(1000);
        act.click(text('再点一下，有机会多砍3元'));
        sleep(1000);
        act.click(text('知道了，继续加速免费拿'));
        sleep(1000)
        act.click(text('再点一下，有机会多砍3元'));
        sleep(1000);




    }
    function 重新打开助力页面() {
        act.强行关闭("拼多多");
        sleep(666);
        if (clipCode != undefined) {
            复制口令转app();
        } else {
            任务跳转();
        }

    }
    function 转个人中心截图() {
        log("转个人中心截图 ")
        sleep(1000);
        act.强行关闭("拼多多");
        sleep(666);
        act.强行关闭("拼多多");
        sleep(666);

        act.launch_multi("拼多多");
        sleep(1000);
        act.launch_multi("拼多多");
        sleep(2000);
        var i;
        while (!currentA() === "主页") {
            if (i > 10) {

                转个人中心截图();
            }
            sleep(2000);
            break;
        }
        text("个人中心").findOne().parent().click();
        sleep(5 * 1000);
        if (currentA() === "个人中心") {
            log("成功转到个人中心，开始截图");
            个人中心 = true;
            act.captureScr("个人中心");
        }
    }
    function 提交图片() {
        act.launch_multi("云享社区");
        yxAct.toTaskDetail();
        if (yxAct.currentA() === "任务详情") {
            yxAct.添加图片(1);
            yxAct.selectPic("助力成功");
            sleep(1000);
            yxAct.添加图片(1);
            yxAct.selectPic("个人中心");
            log("上传图片成功,开始提交任务");
            sleep(3000)
            act.clickKj(text("完成任务").boundsInside(0, 1848, 1080, 2202).findOne());
            sleep(2000);
        }
    }
}
// 多多帮砍()
PDD.多多帮拆 = function () {
   
   try{
    var 拆包上限 = yxAct.getTaskStorage("多多帮拆");
    var reg = /去领现金|点开红包，帮我助力|開|立即前往/
    if (act.isBoolean(拆包上限)) {
        if (!拆包上限) {
            return;
        }
    } else {
        拆包上限 = true;
    }

    var type; //任务类型：1为微信 2为app
    var clipCode = ""; //任务分享口令
    sleep(2 * 1000);

    yxAct.领取任务("多多帮拆");

    if (yxAct.currentA() != "任务详情") {
        log("领取任务失败");
        return false;
    }
    sleep(1500);

    for (var ij = 0; ij < 4; ij++) {
        if (任务跳转()) {
            log("准备帮拆");
            break;
        } else {
            if (ij > 2) {
                log("打开任务连续失败3次,退出任务");
                yxAct.cancelTask();
                return false;
            }
            任务跳转();
        }
    }
    sleep(5000);
    if (助力()) {
        提交图片();
    };
}catch(err){
    log(err)
    
}

    function 任务跳转() {
        // 
        launchApp(mainApp);
        sleep(2000);
        log("转向任务")

        if (linkToPDD()) { return true; }
        if (picToWx()) { return true; }
        log("3")

        sleep(3000);
        var PDDCode = yxAct.复制口令()
        sleep(366)
        if (复制口令转app(PDDCode)) {
            return true;
        };

        function picToWx() {
            if (text("分享上方图片到微信").exists()) {
                log("分享上方图片到微信")
                yxAct.分享二维码();
                if (textMatches(reg).exists()) {
                    toastLog("已打开帮拆页");
                    type = 1;
                    toTaskEwm = true;


                    toastLog("出现砍价跳转弹窗,转往app帮拆");
                    // type = 2;;
                    // act.click(text("去领现金"));
                    act.click(textMatches(reg));
                    sleep(10 * 1000);

                    return true;
                } else {
                    toTaskEwm = false;
                }
            }
        }

        return false;
    }

    function linkToPDD() {
        if (text("分享上方链接到微信").exists()) {
            log("分析链接")
            // type = 1;
            var shareLink = yxAct.复制链接();
            //过滤掉 链接前的无用字符

            var code = getCode(examLink(shareLink));
            log(code)
            if (code == "noCode") {
                log("返回值中无code信息，尝试用微信打开")
                return false;
            }

            if (code == "linkErr") {
                log("网址打开错误，")
                return false;
            }

            setClip(code)
            log("开始复制口令钻app")
            if (复制口令转app(code)) {
                return true;
            } else {
                return false;
            }
        }
        function examLink(url) {
            var index1 = url.indexOf("http");
            log("检查返回链接：" + url.substring(index1))
            return url.substring(index1);
        }
    }

    function 复制口令转app(clipCode) {

        var reg = /点击助力|開|确认收款并帮我助力|立即前往|去领现金|帮好友助力有机会直接提现|点开红包，帮我助力/
        log("拆包口令为" + clipCode)

        if (currentA() != "拆包口令弹窗") {
            setClip(clipCode);
            sleep(5 * 1000);
        }

        if (!textMatches(reg).exists()) {
            log("未见拆包页")
            act.强行关闭("拼多多");
            sleep(1000);
            setClip(clipCode);
            sleep(1000);
            act.launch_multi("拼多多");
            sleep(5000);
        }

        if (textMatches(reg).exists()) {

            toastLog("出现口令弹窗,转往app帮拆");
            // type = 2;;
            // act.click(text("去领现金"));
            act.click(textMatches(reg));
            sleep(10 * 1000);
            return true;
        }

        return false;
    }

    function 助力() {
        開并点击助力()
        if (帮好友助力有机会直接提现()) {
            return true;
        }     
        
        if (合成图片()) {
            return true;
        } else {
            return false;
        }


    }
    function 開并点击助力() {
        if (text('点开红包，帮我助力').exists()) {
            act.click_(text("開"));
            act.click_(text('点击助力'));
            log("点开红包，帮我助力");
            sleep(3000);
        }
    }
    function 帮好友助力有机会直接提现() {
        // 1、点击开红包图片 
        // 转到 帮好友助力有机会直接提现[点击]{跳往下一页，}----立即邀请好友助力--（分享口令已复制)[去微信粘贴]{抵达微信界面直接返回}---（你已经帮我砍了0.01元）[截图返回]{后续没必要点击，直接截图关闭pdd}

        reg = /帮好友助力有机会直接提现|立即邀请好友助力|立即邀请|立即分享/
        for (var i = 0; i < 10; i++) {
            act.click_(textMatches(reg));
            sleep(1300);

            act.click_(text(''))
            sleep(1200);
            act.click_(desc("返回"));

            if (助力成功截图()) {

                转个人中心截图();
                return true;
            }
            sleep(366);
            if (act.isAppA("微信")) {
                back();
                sleep(3000);
            }


        }

        if (text("帮好友助力有机会直接提现").exists()) {
            act.clickKj(text("帮好友助力有机会直接提现").findOne());
            log("帮好友助力有机会直接提现");
            sleep(3000);
        }
        if (text("立即邀请好友助力").exists()) {
            act.clickKj(text("立即邀请好友助力").findOne());
            log("立即邀请好友助力");
            sleep(3000);
        }
        if (text("分享口令已复制").exists() && text("去微信粘贴").exists()) {
            //出现这个其实已不能助力了
            // act.clickKj(text("去微信粘贴").findOne());
            log("去微信粘贴");
            sleep(5000);
        }

        for (i = 0; i < 5; i++) {
            sleep(3000);
            if (wechat.currentA() === "主页") {
                break;
            }
        }


        sleep(1000);
        if (text("选择").exists()) {
            wechat.wechatBack();
            sleep(5000)
        };
        sleep(1000);

        if (text('天天领现金 打款秒到账').exists() && textContains("今日已送出现金").exists()) {

            log("失败");
            return false;
        }
    }
    function 助力成功截图() {
        var reg = /谢谢，你已经帮我助力过了|谢谢你帮我助力|恭喜你又获得0.01元现金/
        if (textMatches(reg).exists()) {
            log("砍成截图")
            sleep(1000);
            act.captureScr("助力成功");
            砍价 = true;
            return true
        }

        if (textContains("商品啦，马上又要砍成啦").exists()) {
            log("砍成截图")
            sleep(1000);
            act.captureScr("助力成功");
            砍价 = true;
            return true
        }
        return false;

    }


    function 转个人中心截图() {
        log("转往个人中心，截图");
        log("close PDD")
        act.强行关闭("拼多多");
        sleep(666);


        log("launch PDD")
        act.launch_multi("拼多多");
        while (!currentA() === "主页") {
            sleep(2000);
        }
        text("个人中心").findOne().parent().click();
        if (currentA() === "个人中心") {
            log("成功转到个人中心，开始截图");
            个人中心 = true;
            act.captureScr("个人中心");
        }
    }
    function 提交图片() {
        act.launch_multi("云享社区");
        yxAct.toTaskDetail();
        if (yxAct.currentA() === "任务详情") {
            yxAct.添加图片(1);

            if (text("拆包成功").exists()) {
                yxAct.selectPic("拆包成功");
            } else {
                yxAct.selectPic("助力成功");
            }

            sleep(1000);
            yxAct.添加图片(1);
            yxAct.selectPic("个人中心");
            log("上传图片成功,开始提交任务");
            // act.clickKj(text("完成任务").boundsInside(0, 1848, 1080, 2202).findOne());
            sleep(2000);
        }
    }
    function getCode(url) {
        // url = ' https://m.ishangtong.com/?_wv=4172&rue_dilatory_privy=OsD3sE&group_bargain_id=201226-BFBE1C130301B01C2140';

        try {
            var res = http.get(url);
            var rec_ = res.body.string();
            if (res.statusCode === 200) {
                // log(rec_)
                var t1 = rec_.indexOf("mq_code\":");
                var t2 = rec_.indexOf("host_scene_id");
                if (t1 == -1 || t2 === -1) {

                    log("返回值中无code信息");
                    return "noCode";
                }
                recc = rec_.substring(t1 + 10, t2);
                var t11 = recc.indexOf("\"");
                recc = recc.substring(0, t11)
                // log(recc) 
                return recc;
            } else {
                log("网址错误");
                return "linkErr";
            }
        } catch (err) {
            log(err)
        }
    }

    function 合成图片() {
        log("尝试合成图片");
        if (textContains('今日已送出现金').exists() && text('直接提现100元').exists()) {
            if (天天领现金页()) {
                var imgCb = act.captureScr();
                images.saveTo(imgCb, "./pdd拆包背景.png");
                canvasCommon.Layeroverlay("./img/pdd拆包背景.png", "./img/拆包成功.png", ["./img/黑色蒙版.png", 0, 0], ["./img/99.79.png", 115, 475])
                //检验图片是否正确,取两个点，一个背景图上部的黄色区域，一个99.。。png的微信图标颜色
                sleep(333);
                var imgSucess = images.read("./img/拆包成功.png");
                if (images.detectsColor(imgSucess, "#ff64d77b", 323, 1354, 30) && images.detectsColor(imgSucess, "#ff2d1b09", 501, 77, 30)) {

                    log("截图合并正确");
                    转个人中心截图();
                }

                return true;
            }

        }
    }
    function 天天领现金页() {

        var regExists = /确认并邀请好友加速提现|立即邀请好友助力|分享口令已复制|去微信粘贴|立即邀请好友/
        if (textMatches(regExists).exists()) {
            act.click_(text(""));
            sleep(2000);
        }
        var x = text("直接提现100元").findOne(2000).bounds().left + 30;
        var y = text("直接提现100元").findOne(2000).bounds().top + 30;
        log(x + "," + y)
        var imgTT = images.captureScreen()
        var colorTT = images.pixel(imgTT, x, y);
        log(colors.toString(colorTT));
        if (images.detectsColor(imgTT, "#ffffde69", x, y, 16)) {
            log("天天领现金，打款秒到账页面")
            return true;
        } else {
            return false;
        }
    }
}

function 多多其他() {
    /**
     * 1、领取任务。2、提取判断任务条件 3、做任务
     * 4、提取判断不了条件的 打开任务页2次判断。
     */
    log("--------1.领取任务-------------")
    yxAct.领取任务("多多其他");
    log("--------2、提取判断任务条件-------------")


    function switchTask(taskTxt) {
        var regShopFlow = /关注店铺|店铺|百亿补贴/;
        var reg
        switch (taskTxt) {
            case taskTxt.test(regShopFlow): 关注店铺(); return true;
            //  case taskTxt.match
            default: log("无匹配任务执行"); 二次匹配任务(); return false;
        }
    }

    function 二次匹配任务() {

    }
    //拼多多刮卡
    function 刮卡() {
        //这玩意等待约10s 直接就出结果
        if (text("谢谢你帮我助力！").exists() && text("微信零钱").exists()) {
            log("助力成功");
            act.captureScr("助力成功");
        }
    }



}
// 多多帮砍()
function 百亿补贴() {
    if (text('“我正在拼多多百亿补贴').exists()) {
        click('点击助力');
    }
    while (true) {

        sleep(140);
        log("等。")
        if (text("助力成功").exists() || text("“感谢助力，这件补贴神价商品快去看看吧~”").exists()) {
            log("助力成功");

            act.captureScr("助力成功");

        }

    }
}

// 百亿补贴()
// 
// 店铺关注()
function 店铺关注() {
    /**
     * keyWord="店铺关注"
     * 1、appUrl打开链接，直达店铺页面，点关注
     * 2、
     */
    if (!任务跳转()) { yxAct.cancelTask(); return }
    ;
    if (text("关注").exists()) {
        act.click_(text("关注"));
        sleep(2000);

    }
    if (text("已关注").exists()) {
        log("关注成功")
    }

    截图我的关注()
    // act.click_(text(""))
    function 截图我的关注() {
        log("转个人中心截图 ")
        sleep(1000);
        act.强行关闭("拼多多");
        sleep(666);
        act.强行关闭("拼多多");
        sleep(666);

        act.launch_multi("拼多多");
        sleep(1000);
        act.launch_multi("拼多多");
        sleep(2000);
        var i;
        while (!currentA() === "主页") {
            if (i > 10) {

                截图我的关注();
            }
            sleep(2000);
            break;
        }
        text("关注").boundsInside(0, device.height * 8 / 10, 504, device.height).findOne().parent().click();
        sleep(5 * 1000);
        if (currentA() === "我的关注") {

            act.click_(text('查看全部'));
            sleep(3000);
            log("成功转到我的关注，开始截图");
            act.captureScr("全部关注");
            sleep(2000);

        }

        //提交图片

    }



}

module.exports = PDD;

// linkToPDD()