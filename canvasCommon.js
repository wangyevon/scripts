
var canvasCommon = {}


/**
/**
 * 截图上加文字
 * @param {起始横坐标} x 
 * @param {起始纵坐标} y 
 * @param {添加的文本} text 
 * @param {存储路径} path 
 * @param {字号} textSize 
 * @param {字体颜色} color  "#007700" 
 * 后三个参数可以不加
 */
canvasCommon.imageCaptrueAddText = function (x, y, text, path, textSize, color) {

    if (arguments.length === 4) {
        textSize = 80;
        color = "#FF0000"
    }
    if (arguments.length === 3) {
        path = "./image/" + random(100, 1000) + ".png";
        textSize = 50;
        color = "#FF0000";
    }

    log("" + x + y + text + path + textSize + color)
    var img = captureScreen();
    var p = new Paint();
    var canvas = new Canvas(img);

    p.setStrokeWidth(10)//设置画笔宽度 
    p.setAntiAlias(false)//设置是否使用抗锯齿功能，如果使用，会导致绘图速度变慢 
    p.setStyle(Paint.Style.FILL);
    p.setTextSize(textSize)
    p.setColor(colors.parseColor(color))
    canvas.drawText(text, x, y, p);
    images.save(canvas.toImage(), path);
    media.scanFile(path); //加入图库
    img.recycle();

    // app.viewFile(path)
}

canvasCommon.Layeroverlay=function(imgBackgroudPath,savePath, img1Arry, img2Arry, img3Arry) {
    /**
     * 叠加图层生成新图,加背景最多4个图层，一般来说够用了。
     * 参数除背景图用来确定canvas尺寸，是路径字符串外，
     * 图层按参数顺序依次描绘
     * example: layeroverlay("/sdcard/背景.png",["/sdcard/图层1.png",x1,y1])
     * @param {背景图路径字符串} imgBackgroud 
     * @param {生成图片存储路径} savePath 
     * @param {背景图上一层，数组[路径,描绘起点x,描绘起点y]} img1Arry 
     * @param {背景图上二层} img2Arry 
     * @param {最上层} img3Arry 
     */

    //画笔
    var paint = new Paint();
    var imgBackGroud = images.read(imgBackgroudPath);
    sleep(100);
    var canvas = new Canvas(imgBackGroud);//这里踩了个坑，没加参数，一直报null;
    // var w = canvas.getWidth();
    // var h = canvas.getHeight();  

    for (var i = 2; i < arguments.length; i++) {
        sleep(222);
        img=images.read(arguments[i][0]);
        canvas.drawImage(img, arguments[i][1],arguments[i][2], paint);
        sleep(111)    ;   
       
    }
    // var path = "/sdcard/拆包成功.png"
    images.save(canvas.toImage(), savePath);
    media.scanFile(savePath); //加入图库
    app.viewFile(savePath);

}




/**
 * 
 * @param {参数为控件bounds()} rect_ 
 * 需强制结束
 */
//需用新线程打开，并运行一段时间关闭
canvasCommon.画正方形控件边界 = function (rect_) {


    var window = floaty.rawWindow(
        <canvas id="board"
            h="{{device.height}}"
            w="{{device.width}}"
        />
    );
    window.setTouchable(false);


    画正方形控件边界_(rect_)
    function 画正方形控件边界_(rect_) {
        setInterval(() => { }, 15000)

        // setTimeout(()=>{
        paint = new Paint()
        paint.setStrokeWidth(5);
        paint.setColor(-28707)
        paint.setStyle(Paint.Style.STROKE);

        window.board.on("draw", function (canvas) {
            canvas.drawRect(rect_.left, rect_.top, rect_.right, rect_.bottom, paint);
        });
        // }, 4000);

    }
} // 画出控件形状



module.exports = canvasCommon;