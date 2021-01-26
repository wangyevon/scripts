//前路漫漫，唯有奋斗
var act = require("./act.js");
var wechat = require("./wechat.js");
var taskList=require("./taskList.js");
var cloudScan = {}; //云扫码

//微信环境 v7.0.21 7.0.22
//收藏与关注的覆盖图层

cloudScan.launchWxToTaskPage = function () {

    try {

        if (act.isRoot()) {

            var link = "https://api.yunsaoma.mobi/yunonline/v1/auth/20136be91d8f60ec4b34e974aea65fea";

            log(link)
            shell('am start -n com.tencent.mm/com.tencent.mm.plugin.webview.ui.tools.WebViewUI -d ' + link, true);
            sleep(2000);
            wechat.微信授权();
            sleep(3000)

            if (id("text1").text("云扫码").exists()) {
                sleep(3000);
                log("等待页面打开。。。。");
                if (text("开始阅读").exists()) {
                    click("开始阅读");
                    sleep(4000);
                }

            } else {
                sleep(3000);
            }
        } else {

            for (var i = 0; i < 3; i++) {
                if (wechat.turnToPage("收藏")) {

                    if (textContains("https://api.yunsaoma.mobi/yunonline").exists()) {
                        act.click_(textContains("https://api.yunsaoma.mobi/yunonline"));
                        sleep(2000);
                        act.click_(textContains("https://api.yunsaoma.mobi/yunonline"));
                        sleep(3800);
                        break;
                    }

                }
                sleep(500);
            }
        }
    } catch (err) {
        log("launchWxToTaskPage:" + err);
        return false;
    }
}

function doTask() {

 if(   !id("text1").text("云扫码").exists()){
    cloudScan.launchWxToTaskPage();
 }
        readLoop();

}

function readLoop() {

    for (var i = 0; i < 35; i++) {
      
        

        if (id("text1").text("云扫码").exists()) {
            log("云扫码主页");
        }
        if (text("开始阅读").exists()) {
            click("开始阅读");
            sleep(3000);
            if(id("task_none").exists()){
                log("此时段阅读已完成");

                taskList.setTaskStorage("云扫码" ,new Date().getTime())
                return;
            }
        }
        act.waitWidget12s(id("readTxt"));
        sleep(6 * 1000);
        if (id("readTxt").exists()||text('{"errcode":405,"msg":"openid is empty"}').exists()) {
           back();
            sleep(3000);
        }else{
           launchWechatToCollectPage();
           sleep(3000);
        }
        

    }
}




cloudScan.start = function () {
    // threads.start(function () {
        try {
            log("云扫码开始")
            // for (var i = 0; i < 50; i++) {
                doTask();
            // }

        } catch (err) {
            log(err)
            return false;
        }
//     })
}



module.exports = cloudScan;
 



