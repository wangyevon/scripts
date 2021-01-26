var act = require("./act.js");
var wechat = {};
//微信操作
//分享到文件传输助手

var commentTxt = ["好文章", "有点意思", "说的有道理", "看来我out了", "真的？", "推荐好文"];
wechat.shareToFileTransfer = function () {

    if (wechat.currentA() === "转发") {

        toastLog("转发界面 click搜索");
        sleep(1 * 1000)

        if (text("文件传输助手").exists()) {
            act.clickKj(className("TextView").text("文件传输助手").findOne());
        } else {
            act.clickKj(text("搜索").findOne())
            sleep(1 * 1000);
            act.clickKj(text("搜索").findOne())
            sleep(1 * 1000);
            toastLog("转发界面 文本框输入文件传输助手");
            className("EditText").findOnce().setText("文件传输助手");
            sleep(2000);
            toastLog("转发界面 点击文件传输助手");
            act.clickKj(className("TextView").text("文件传输助手").findOne());
        }
        sleep(2000);
        if (text("发送").exists() && text("发送给：").exists() && text("取消").exists()) {
            click("发送");
        }
        if (text("分享").exists() && text("发送给：").exists() && text("取消").exists()) {
            click("分享");
            sleep(1000);
            if (text("留在微信").exists()) {
                click("留在微信");

            }
        }
        sleep(1000);


        if ((wechat.currentA() === "聊天窗口" && !text("文件传输助手").boundsInside(10, 10, 1070, 220).exists()) | wechat.currentA() === "主页") {

            log("转发分享到文件助手成功,转往助手窗口");

            wechat.wechatBack();
            sleep(800);
            log("点击主页")
            act.clickKj(text("微信").boundsInside(0, 1848, 1080, 2202).findOne());
            sleep(800);
            var i = 0;
            while (!text("文件传输助手").boundsInside(10, 100, 1080, 800).exists()) {
                i++;
                swipe(200, 400, 300, 920, 130)
                sleep(600);
                if (i > 3) {
                    log("出现错误，滑动4次找不到文件传输助手");
                    break;
                }
            }
            act.clickKj(text("文件传输助手").findOne());

            return true;

        }
        if (wechat.currentA() === "文件传输助手聊天窗口") {

            log("转发分享到文件助手成功");
            return true;

        }
    } else {
        log("转发到文件助手失败")
        return false;
    }
}

//两个的区别在于参数，上一个是转发到文件助手，下一个自己定义
wechat.shareToFileTransfer_ = function (userName) {

    if (wechat.currentA() === "转发") {

        toastLog("转发界面 click搜索");
        sleep(1 * 1000)

        if (text(userName).exists()) {
            act.clickKj(className("TextView").text(userName).findOne());
        } else {
            act.clickKj(text("搜索").findOne())
            sleep(1 * 1000);
            act.clickKj(text("搜索").findOne())
            sleep(1 * 1000);
            toastLog("转发界面 文本框输入" + userName);
            className("EditText").findOnce().setText(userName);
            sleep(2000);
            toastLog("转发界面 点击" + userName);
            act.clickKj(className("TextView").text(userName).findOne());
        }
        sleep(2000);
        if (text("发送").exists() && text("发送给：").exists() && text("取消").exists()) {
            click("发送");
        }
        if (text("分享").exists() && text("发送给：").exists() && text("取消").exists()) {
            click("分享");
            sleep(1000);
            if (text("留在微信").exists()) {
                click("留在微信");

            }
        }
        sleep(1000);


        if (wechat.currentA() === "聊天窗口" || wechat.currentA() === "主页") {

            log("转发分享到" + userName);

            wechat.wechatBack();
            sleep(800);
            log("点击主页")
            act.clickKj(text("微信").boundsInside(0, 1848, 1080, 2202).findOne());
            sleep(800);
            var i = 0;
            while (!text(userName).boundsInside(10, 100, 1080, 800).exists()) {
                i++;
                swipe(200, 400, 300, 920, 130)
                sleep(600);
                if (i > 3) {
                    log("出现错误，滑动4次找不到文件传输助手");
                    break;
                }
            }
            act.clickKj(text(userName).findOne());

            return true;

        }
        if (wechat.currentA() === "聊天窗口" && text(userName).boundsInside(10, 10, 1070, 220).exists()) {

            log("转发分享到" + userName + "成功");
            return true;

        }
    } else {

    }
}

//分3种情况,1-图片 2-文字 3-指定连接
wechat.explorLinkFromTalkActivety = function (type, linkTxt) {
    if (type === "图片") {
        var imageCount = className("FrameLayout").clickable(true).depth(15).find().length;
        //点击图片
        log("打开最后一张图")
        className("FrameLayout").clickable(true).depth(15).findOnce(imageCount - 1).click();

    }
    if (type === "文字") {
        var count = className("android.view.View").depth(16).clickable(true).find().length;
        var linkDetailKj = className("android.view.View").depth(16).clickable(true).findOnce(count - 1);
        log("打开文本内容");
        act.doubleClickKj(linkDetailKj)
    }
    if (type === "指定") {

        if (text(linkTxt).find().length == 1) {
            act.clickKj(text(linkTxt).findOne());
            log("打开指定连接：" + linkTxt.substring(0, 8));
        }
        if (text(linkTxt).find().length != 1) {
            var txtCount = text(linkTxt).find().length;
            act.clickKj(text(linkTxt).findOnce(txtCount - 1));
        }
    }
}

// //窗口切换
wechat.wechatBack = function () {
    if (desc("返回").exists()) {
        desc("返回").findOne().parent().click();
        
        desc("返回").findOne().click();
    }

    if (text("返回").exists()) {
        text("返回").findOne().parent().click();
        text("返回").findOne().click();
    }
    log("返回上一页");
    sleep(1000);

}

/**
 * 如有多个相同sign，点击最后一个
 * @param {点击标志} sign 
 */
wechat.返回微信重新打开链接 = function (sign) {
    act.click_(desc("返回"));
    act.click_(text(''));
    launchApp("微信");
    sleep(3000);
    try {
        act.clickKj(text(sign).findOnce(text(sign).find().length - 1));
    } catch (err) {

    }

    sleep(5000);
}

wechat.currentA = function () {

    if (id("text1").textContains("微信(").exists()) {
        log("当前微信主页");
        return "主页";
    }

    if (id("text1").text("通讯录").exists()) {
        log("当前通讯录页");
        return "通讯录"
    }
    if (id("text1").text("发现").exists()) {
        log("当前发现页");
        return "发现"
    }

    if (id("text1").textContains("朋友圈").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前朋友圈");
        return "朋友圈"
    }

    if (text('同步到QQ空间').exists() && text("发表").exists()) {

        log("朋友圈编辑页");
        return "朋友圈编辑页"
    }

    if ( id("text1").text('我的相册').exists()) {

        log("我的相册");
        return "我的朋友圈"
    }

    if (textContains("微信号").boundsInside(10, 260, 1070, 430).exists() || (textContains("微信号").exists() && text("设置").exists())) {
        log("当前个人主页");
        return "个人主页"
    }


    if (text("我的收藏").boundsInside(10, 90, 1070, 430).exists()) {
        log("当前收藏页");
        return "收藏"
    }


    if (text("关注").boundsInside(0, 70, 1080, 300).exists() && text("朋友").boundsInside(0, 70, 1080, 300).exists()) {
        log("视频号");
        return "视频号"
    }

    if (text("朋友在看").boundsInside(0, 70, 1080, 300).exists() && text("热点广场").boundsInside(0, 70, 1080, 300).exists()) {
        log("看一看");
        return "看一看"
    }
    if (id("tm").exists() && id("cne").exists() && !text("朋友").boundsInside(0, 70, 1080, 300).exists()) {
        log("当前视频清单");
        return "视频清单"
    }

    if (text("私信").exists() && id("c1i").exists()) {
        log("视频主主页");
        return "视频主主页"
    }
    if (id("readTxt").exists()) {
        log("公众号文章页");
        return "公众号文章"
    }

    if (textContains("选择").boundsInside(10, 10, 1070, 220).exists()) {
        log("当前转发页");
        return "转发"
    }

    if (desc("切换到按住说话").boundsInside(0, 1848, 1080, 2202).exists() && text("文件传输助手").exists()) {
        log("当前文件传输助手");
        return "文件传输助手聊天窗口"
    }
    if (desc("切换到按住说话").boundsInside(0, 1848, 1080, 2202).exists()) {
        log("当前聊天窗口");
        return "聊天窗口"
    }

    if (className("ImageView").desc("下载").exists() && className("ImageView").desc("图片及视频").exists()) {
        log("当前图片查看窗口");
        return "查看图片"
    }

    if (text("小程序码").exists()) {
        log("转往小程序");
        return "二维码识别转小程序"
    }


    if (text("识别图中二维码").exists()) {
        log("转往小程序");
        return "识别二维码"
    }

    if (text('搜索指定内容').exists() || textContains("搜一搜  ").exists()) {
        log("搜索");
        return "搜索";
    }

    if (id("text1").text("公众号").exists()) {
        log("公众号列表");
        return "公众号列表";
    }



}

wechat.写笔记 = function (note) {

    if (wechat.currentA() === "我的收藏") {

        sleep(2000);
        act.click_(desc("添加收藏"));
        sleep(2000);
        if (desc('当前所在页面,笔记').exists()) {
            className("EditText").findOne().setText(note);
            sleep(2000);
            act.click_(desc("返回"));
            sleep(1000);
        }
    }
}

//聊天窗口发送信息
wechat.发送聊天信息 = function (infoTxt) {
    if (wechat.currentA() === "文件传输助手聊天窗口") {
        if (className("Button").text("发送").exists()) {

            className("Button").desc("发送").findOne().parent().parent().parent().child(1).child(0).child(0).child(0).child(0).setText(infoTxt);
        }
        if (desc("更多功能按钮，已折叠").exists()) {
            desc("更多功能按钮，已折叠").findOne().parent().parent().parent().child(1).child(0).child(0).child(0).child(0).setText(infoTxt);
        }
        sleep(1000);
        className("Button").text("发送").findOne().click();
    }
}

wechat.launchWechatToCollectPage = function () {
    if (act.isRoot()) {
        var activity = "com.tencent.mm.plugin.fav.ui.FavoriteIndexUI"
        shell("am start -n " + "com.tencent.mm/" + activity, true);
        sleep(3800);

    } else {

        // act.强行关闭("微信");
        sleep(3000);
        act.launch_multi("微信");
        wechat.waitWechat()
        sleep(2000);
        act.click_(text("我"));
        sleep(3000);
        if (this.currentA() === "个人主页") {
            act.click_(text("收藏"));
            sleep(3000);
        }
    }
    if (wechat.currentA() === "我的收藏") {
        return true;
    } else {
        return false;
    }


}

wechat.refreshArticle = function () {
    if (id("cj").exists() && desc("返回").exists()) {
        act.click_(id("cj"));
        sleep(1000);
        act.click_(id("gam").text("刷新"));
        sleep(3000);
    }

}
wechat.waitWechat = function () {
    for (var i = 0; i < 8; i++) {
        if (currentPackage() === "com.tencent.mm") {
            sleep(1 * 1000);
            if (wechat.currentA() === "主页" || wechat.currentA() === "朋友圈" || wechat.currentA() === "转发") {
                return true;
            }
            sleep(5 * 1000);

        } else {
            sleep(5 * 1000);
        }
    }

    log("打开微信超时");
    return false;

}

wechat.识别二维码 = function () {
    if (currentActivity() === "com.tencent.mm.ui.chatting.gallery.ImageGalleryUI" && wechat.currentA() != "二维码识别转小程序") {
        press(500, 1000, 2000);
        sleep(2 * 1000);
    }
    sleep(1000);
    if (wechat.currentA() === "二维码识别转小程序") {
        toastLog("打开小程序");
        act.clickKj(text("小程序码").findOne());
    }

    if (wechat.currentA() === "识别二维码") {
        toastLog("打开小程序");
        act.click(text("识别图中的二维码"));
        sleep(888)
        act.click(text("识别图中二维码"));
        sleep(5 * 1000);
    }
}
wechat.微信授权 = function () {
    if (text("您的信息和数据将受到保护").exists()) {

        act.clickKj(text("授权并登录").findOne());
        sleep(2 * 1000)
    }
    if (text('您暂未获取微信授权，将无法正常使用小程序的功能~如需要正常使用，请点击“授权登录”按钮，打开头像、昵称等信息的授权。').exists() && text('授权登录').exists()) {

        text('授权登录').clickable(true).findOne().click();
        sleep(2 * 1000)
    }



    sleep(200);
    if (textContains("申请获").exists() && text("允许").exists()) {
        toastLog("允许获取权限");
        act.clickKj(text("允许").findOne());
        sleep(3000);
    }

    if (textContains("申请获").exists() && text("同意").exists()) {
        toastLog("同意获取权限");
        act.clickKj(text("同意").findOne());
        sleep(3000);
    }

    sleep(200)
    if (textContains("获取你的昵称、头像、地区及性别").exists() && text("允许").exists()) {
        toastLog("允许获取权限");
        act.clickKj(text("允许").findOne());
        sleep(3000);
    }


    sleep(200)
    if (textContains("获取你的位置信息").exists() && text("允许").exists()) {
        toastLog("允许获取权限");
        act.clickKj(text("允许").findOne());
        sleep(3000);
    }
    sleep(200)
    if (textContains("获取你的微信运动步数").exists() && text("允许").exists()) {
        toastLog("允许获取权限");
        act.clickKj(text("允许").findOne());
        sleep(3000);
    }
}
wechat.返回文件传输助手 = function () {

    if (wechat.currentA() != "聊天窗口") {

        if (act.isRoot()) {
            var activity = "com.tencent.mm.plugin.fav.ui.FavoriteIndexUI"
            shell("am start -n " + "com.tencent.mm/" + activity, true);
            sleep(3800);

        } else {
            act.强行关闭("微信");
            sleep(366);
            launchApp("微信");
        }
        if (wechat.waitWechat()) {
            sleep(2000);
            click("文件传输助手");
        }
    }
}
wechat.返回聊天窗口 = function (userName) {

    if (act.isRoot()) {
        var activity = "com.tencent.mm.ui.LauncherUI"
        shell("am start -n " + "com.tencent.mm/" + activity, true);
        sleep(3800);
        if (wechat.waitWechat()) {
            sleep(2000);
            click(userName);
        }
        sleep(2000);


    } else {
        act.launch_multi("微信");
        if (wechat.currentA() != "聊天窗口") {
            act.强行关闭("微信");
            sleep(366);
            launchApp("微信");
            if (wechat.waitWechat()) {
                sleep(2000);
                click(userName);
            }
        }
    }
    if (id(textContains(userName)).exists()) {
        return true;
    } else {
        return false;
    }

}

//分享公众号文章到朋友圈
wechat.shareArticleToFriendCircle = function () {
    //点击右上角的三个点，利用desc("返回")找到点击控件
    if (desc("返回").exists()) {
        act.clickKj(desc("返回").findOne().parent().parent().parent().child(1))
        sleep(2000)
    }

    if (text('分享到朋友圈').exists() && text('在浏览器打开').exists()) {
        text('分享到朋友圈').findOne().parent().click();
        sleep(5000);
        // text('复制链接').findOne().parent().click();
        // text('收藏').findOne().parent().click();
    }

    if (text('这一刻的想法...').exists()) {
        // text('这一刻的想法...').findOne()


        setText(commentTxt[random(0, commentTxt.length - 1)])
    }
    // }
    act.click(text("发表"));
    sleep(3000);
}

/**
 * 从公众号文章阅读页转往朋友圈
 */
wechat.fromReadToFriendCircle = function () {
    // if(wechat.currentA()==="")
    wechat.wechatBack();//从阅读页返回
    sleep(2000);
    for (var i = 0; i < 3; i++) {
        if (wechat.currentA() === "文件传输助手聊天窗口") {
            wechat.wechatBack();
            sleep(2000);
        }
        sleep(1000);
        if (wechat.currentA() === "主页") {
            act.click_(text("发现"));
            sleep(2000);
        }
        sleep(1000);

        if (wechat.currentA() === "发现") {
            act.click_(text("朋友圈"));
        }

        if (wechat.currentA() === "朋友圈") {
            return true;
        }

    }
}

wechat.turnToPage = function (page) {

    if(wechat.currentA()===page){
        log("已在此页面");
        return true;
    }


    if (act.isRoot()) {
        log("root直达")
        var activity;
        switch (page) {
            case "收藏": activity = "com.tencent.mm.plugin.fav.ui.FavoriteIndexUI"; break;
            case "朋友圈": activity = "com.tencent.mm.plugin.sns.ui.SnsUploadUI"; break;
            case "朋友圈编辑页": activity = "com.tencent.mm/com.tencent.mm.plugin.sns.ui.SnsTimeLineUI"; break;
            case "我的朋友圈": activity = "com.tencent.mm.plugin.sns.ui.SnsTimeLineUserPagerUI"; break;
            case "视频号": activity = "com.tencent.mm.plugin.finder.ui.FinderHomeUI"; break;
            case "看一看": activity = "com.tencent.mm.plugin.topstory.ui.home.TopStoryHomeUI"; break;
            case "搜索": activity = "com.tencent.mm.plugin.fts.ui.FTSMainUI"; break;
            case "公众号列表": activity = "com.tencent.mm.ui.chatting.ChattingUI"; break;
        }

        if (activity != undefined) {
            shell("am start -n " + "com.tencent.mm/" + activity, true);
            sleep(3000);
            if (wechat.currentA() === page) {
                return true;
            }
        }
    }

    while (true) {
        wechat.wechatBack();
        if (!act.isAppA("微信")) {
            app.launchApp("微信");
            sleep(3000);
        }
        var currentA = wechat.currentA();
        if (currentA === "搜索") {
            if (page === "搜索") {
                log("打开" + page + "成功");
                return true;
            } else {
                back();
                sleep(2000);

            }
        }

        if (currentA === "主页" || currentA === "个人主页" || currentA === "通讯录" || currentA === "发现") {
            break;
        }
    }

    if (currentA === page) {
        log("打开" + page + "成功");
        return true;
    }
    if (page === "主页") {
        act.click_(text("微信").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
    }
    if (page === "通讯录") {
        act.click_(text("通讯录").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
    }
    if (page === "个人主页") {
        act.click_(text("我").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
    }
    if (page === "收藏") {
        act.click_(text("我").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(text("收藏"));
        sleep(1800);
    }
    if (page === "我的朋友圈") {
        act.click_(text("我").boundsInside(0, 1848, 1080, 2202));
        sleep(2000);
        act.click_(text("朋友圈"));
        sleep(1900);
        if (id("text1").text("相册").exists()) {
            text("我的朋友圈").findOne().click();
            sleep(2000);
        }
    }

    if (page === "发现") {
        act.click_(text("发现").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
    }
    if (page === "搜索") {
        act.click_(text("发现").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(desc("搜索"));
       sleep(2000);
    }

    if (page === "视频号") {
        act.click_(text("发现").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(text("视频号"));
       sleep(2000);
    }

    if (page === "朋友圈") {
        act.click_(text("发现").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(text("朋友圈"));
       sleep(2000);
    }

 

    if (page === "看一看") {
        act.click_(text("发现").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(text("看一看"));
       sleep(2000);
    }



    if (page === "通讯录") {
        act.click_(text("通讯录").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
    }
    if (page === "公众号列表") {
        act.click_(text("通讯录").boundsInside(0, 1848, 1080, 2202));
       sleep(2000);
        act.click_(text("公众号"));
       sleep(2000);
    }

    if (wechat.currentA() === page) {
        log("打开" + page + "成功");
        return true;
    } else {
        log("失败" + wechat.currentA());
        return false;
    }

}

wechat.shareImgTextToFriendCircle = function (imgCount, text) {

    /**
  * 分享图文到朋友圈
  * @param {分享图片数量} imgCount 
  * @param {分享文本} text 
  */
    if (wechat.currentA() === "朋友圈") {
        desc("拍照分享").findOne().click();
        sleep(random(10, 20) * 200);
    }

    if (text('拍摄').exists() && text('从相册选择').exists()) {
        act.click_(text('从相册选择'));
        sleep(random(10, 20) * 100);
    }

    if (text('拍照，记录生活').exists()) {
        act.click_(text('我知道了'));
        sleep(random(10, 20) * 100);
    }

    if (text('图片和视频').exists() && text('图片和视频').exists()) {
        for (i = 0; i < imgCount; i++) {
            if (!className("CheckBox").findOnce(i).checked()) {
                className("CheckBox").findOnce(i).click();
                sleep(500);
            }
        }

        textContains("完成").findOne().click()
        sleep(3000);
    }
    if (text('提醒谁看').exists()) {
        className("EditText").findOne().setText(text);
        sleep(2000);
    }
    if (text('提醒谁看').exists()) {
        text("发表").findOne().click();
        sleep(2000);
    }
}

module.exports = wechat;