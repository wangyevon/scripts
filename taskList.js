var act = require("./act.js");
// var PDD = require("./PDD.js")
var weiwei = require("./weiwei.js");
var wxTask = require("./wxTask.js");
// var cloudScan = require("./cloudScan.js");
var byteJump = require("./byteJump.js");
// var jd = require("./jd.js");
var taskList = {};

//任务清单,新的任务变化，可以在这里增减。
var taskListAll = [ '微文帮投', '信息关注',  
    '信息求赞_', '信息求关注_', '其他求助_', '信息求赞', '信息求关注', '其他求助', '小红书其他', "微微视频", "云扫码"]

    // var taskListAll = [ '微文帮投', '信息关注',  '其他阅读',
    // '信息求赞_', '信息求关注_', '其他求助_', '信息求赞', '信息求关注', '其他求助', '小红书其他', "微微视频", "云扫码"]

taskList.doTask = function (taskList) {
    switch (taskList) {
        case '微文阅读':
            toastLog("开始微文阅读");
             wxTask.微文阅读();
            break;
        // case '信息关注':
        //     toastLog("开始信息关注");
        //     wxTask.微文阅读();
        //     break;
        case '微文帮投':
            toastLog("开始'微文帮投'");
            wxTask.微文帮投();
            break;

        case '分享朋友圈':
            toastLog("开始分享朋友圈");
            wxTask.分享朋友圈();
            break;
        case '其他阅读':
            toastLog("开始其他阅读");
            wxTask.其他阅读();
            break;

        // case '多多帮砍':
        //     // toastLog("开始多多帮砍");
        //     // PDD.多多帮砍();
        //     break;

        // case '头条信息':
        //     toastLog("开始头条信息");
        //     byteJump.头条信息();
        //     break;

        case '信息求赞_':
            toastLog("开始DY点赞");
            byteJump.信息求赞_();
            break;
        case '信息求关注':
            toastLog("开始Ks求关注");
            byteJump.信息求关注();
            break;
        case '信息求关注_':
            toastLog("开始抖音求关注");
            byteJump.信息求关注_();
            break;

        case '信息求赞':
            toastLog("开始快手赞");
            byteJump.信息求赞();
            break;

        case '微微视频':
            toastLog("开始微微视频");
            weiwei.start();
            break;

        case '云扫码':
            toastLog("开始云扫码");
            cloudScan.start();
            break;

    }


}


// 初始化任务状态
taskList.initTaskStorage = function () {

    log("初始化任务状态")
    var taskStorage = storages.create("任务类型状态");

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
taskList.getTaskList = function () {

    var nowT = new Date().getTime();
    var taskStorage = storages.create("任务类型状态");
    var taskListArr = [];

    for (var i in taskListAll) {

        if (act.isBoolean(taskStorage.get(taskListAll[i]))) {
            if (taskStorage.get(taskListAll[i])) {
                taskListArr.push(taskListAll[i])
            }
        }

        if (act.isNumber(taskStorage.get(taskListAll[i]))) {
            if ((nowT - taskStorage.get(taskListAll[i])) / 1000 > 3600) {
                taskListArr.push(taskListAll[i]);
            }
        }
    }

    return taskListArr;
}

/**
 * 设置任务状态
 */
taskList.setTaskStorage = function (key, value) {

    var taskStorage = storages.create("任务类型状态");
    taskStorage.put(key, value);
    log("任务 " + key + "当前状态为 " + taskStorage.get(key));

}

/**
 * 设置任务状态
 */
taskList.getTaskStorage = function (key) {

    var taskStorage = storages.create("任务类型状态");
    log("任务 " + key + "当前状态为 " + taskStorage.get(key));
    return taskStorage.get(key);

}


module.exports = taskList;