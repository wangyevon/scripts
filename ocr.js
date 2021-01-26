var act = require("./act.js");
var ocr = {}
function BaiDu_ocr(img, is位置) {
    var imag64 = images.toBase64(img, "png", 100);
    //本代码。key值，属于，大维万，所有。每天可用1000次。
    var API_Key = "IMi7uTlPbISgrYCkBnUZxREn";
    var Secret_Key = "NRE9cT0SA9qeEyadk7e0wzHH2LHiQTeS";

    var getTokenUrl = "https://aip.baidubce.com/oauth/2.0/token";
    //token获取地址。
    var token_Res = http.post(getTokenUrl, {
        grant_type: "client_credentials",
        client_id: API_Key,
        client_secret: Secret_Key,
    });

    var token = token_Res.body.json().access_token;
    //log(token);
    var ocrUrl1 = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"; //每天可用5000次。
    //文字识别。
    var ocrUrl2 = "https://aip.baidubce.com/rest/2.0/ocr/v1/general"; //每天可用500次。
    //含位置信息。
    var ocrUrl = ocrUrl1;
    if (is位置) {
        ocrUrl = ocrUrl2;
    };
    var ocr_Res = http.post(ocrUrl, {
        headers: {
            "Content - Type": "application/x-www-form-urlencoded"
        },
        access_token: token,
        image: imag64,
    });

    var json = ocr_Res.body.json();
    // log(json.words_result);
    return json;
};

function WX_ocr(path) {
    if (files.isFile(path)) {
        var url = http.postMultipart("http://d.aroot.cn/addons/yidu_tupian/core/index.php?mch_id=340&s=/api/user/uploadFile&path_name=flower_plant_mygj", {
            "file_upload": open(path)
        }, {
            "headers": {
                "Connection": "Keep-Alive",
                "referer": "https://servicewechat.com/wx552b87a99d56e00a/6/page-frame.html",
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android ' + device.release + '; zh-cn; ' + device.model + ' Build/' + device.buildId + ') AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                "Content-Type": "multipart/form-data; boundary=1561019505328",
                "Content-Length": "15713",
                "Host": "d.aroot.cn"
            }
        }).body.json();
        if (url.code == 0) {
            var result = http.get("http://d.aroot.cn/addons/yidu_tupian/core/index.php?mch_id=340&s=/api/Vision/get_word&path_url=" + url.info + "&scene=3", {
                "headers": {
                    "charset": "utf-8",
                    "referer": "https://servicewechat.com/wx552b87a99d56e00a/6/page-frame.html",
                    'User-Agent': 'Mozilla/5.0 (Linux; U; Android ' + device.release + '; zh-cn; ' + device.model + ' Build/' + device.buildId + ') AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                    "content-type": "application/x-www-form-urlencoded",
                    "Host": "d.aroot.cn",
                    "Connection": "Keep-Alive"
                }
            }).body.json();
            return result;
        } else {
            return url;
        }
    } else {
        return "文件路径错误！";
    }
}

function OCR(i) {

    var img = captureScreen();

    if (i % 2 == 0) {
        var rec = BaiDu_ocr(img, true);
        rec = 转换百度到统一格式(rec.words_result);
        // log(rec);
    } else {
        img = images.save(img, "/sdcard/1/1.jpg", "jpg", 80);
        rec = WX_ocr("/sdcard/1/1.jpg");
        rec = rec.info;
        // log(rec);
    }
    return rec;
}

function 转换百度到统一格式(arr) {
    var arr0 = [];
    arr.forEach(function (element) {
        var temp = {};

        temp = {
            source_text: element.words,
            x: element.location.left,
            y: element.location.top
        }
        arr0.push(temp);
        temp = {};
    })
    return arr0;
}
function gettxt() {
    var tt = [{ source_text: '6:56', x: 49, y: 30 },
    { source_text: '令824', x: 825, y: 26 },
    { source_text: ' ee https: //m.vaotngquz.c', x: 78, y: 137 },
    { source_text: '百元现金,人人可领', x: 218, y: 842 },
    { source_text: '開', x: 466, y: 1340 },
    { source_text: '三', x: 774, y: 2157 }];

    var tt2 = tt.some((item, index) => {
        return item.source_text === '百元现金,人人可领'
    })
    log(tt[3].source_text)
    log(tt2)

}
//1,2参数为识别字符串关键字,避免有空格或识别错误
// num为同类按键序号
ocr.getTextPoint = function (textKey1, textKey2, num) {

    if (num === undefined) { num = 1; }
    var arr = OCR(2);
    log(arr)
    var arr2 = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].source_text.indexOf(textKey1) != -1 && arr[i].source_text.indexOf(textKey2) != -1) {
            arr2.push([arr[i].x, arr[i].y]);
        }
        if (arr2.length === num) {
            break;
        }
    }
    log(arr2)

    if (arr2.length < num) {
        log("不存在第" + num + "个" + textKey1 + ",错误");
        return false;
    }
    if (arr2.length >= num) {
        log("第" + num + "个" + textKey1 + "坐标:" + arr2[num - 1]);
        return arr2[num - 1]
    }
}

ocr.textExists = function (text) {
    var arr = OCR(2);
    var arr2 = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].source_text === text) {
            arr2.push([arr[i].x, arr[i].y]);
        }
    }
    log(arr2)
    if (arr2.length > 0) {
        return true;
    }
}
function ocrTextContains(text) {

}


//点击第i个文本
ocr.click = function (text1, text2, num) {
    if (!act.isString(arguments[0])) {
        log("参数错误");
        return false;
    }
    if (!act.isString(arguments[1])) {
        if (act.isNumber(arguments[1])) {
            num = text2;
            text2 = "";
        } else {
            log("参数错误")
            return false;
        }
    }

    if (!act.isNumber(arguments[2])) {
            num =1
    }


    var point = ocr.getTextPoint(text1, text2, num);
    log(point[0]+","+point[1])  
        click(point[0], point[1]);
   
}
ocr.启动无障碍 = function (text1, text2) {
    console.hide();
    app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS"
    });
    sleep(1000);
    ocr.click(text, text2, num);
    sleep(1000);
    ocr.click("已关闭");
    sleep(1000);
    ocr.click("确定");
    sleep(1000);
    if (text("已开启").exists()) {
        toastLog("无障碍服务已启动");
        console.show()
        return ture;
    } else {
        console.show()
        toastLog("无障碍启动失败");

        return false;
    }


}
module.exports = ocr;