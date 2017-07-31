// 搭建整体框架
// 入口JQuery函数
// arg: 可以是原生dom, 可以是函数, 可以是选择器
function JQuery(arg) {
    // 定义数组, 存放可以添加元素的对象
    this.elements = [];

    if (typeof arg == "function") {
        // DOM加载完成以后执行回调
        ready(arg);
    } else if (typeof arg == "object") {
        // 如果是对象, 直接放到数组中
        this.elements.push(arg);
    } else {
        // 如果传入的是字符串选择器
        this.elements = getEle(arg);
    }
}

// 让外界直接使用$() 方法, 不用再通过new JQuery创建JQuery对象
function $(arg) {
    return new JQuery(arg);
}

// DOM加载完成以后执行函数
// DOM文档加载的步骤
/*
* 解析HTML结构
* 加载外部脚本和样式表文件
* 解析并执行脚本代码
* DOM树构建完成 // DOMContentLoaded
* 加载图片等外部文件
* 页面加载完毕. // load
*
* */
function ready(func) {
    // 兼容
    if (document.addEventListener) { // 高版本浏览器
        // ie8以后
        document.addEventListener("DOMContentLoaded", func, false);

    } else {
        // 手动创建script标签
        var scri = document.createElement('script');
        // 设置延迟, 目的是让浏览器先加载其他内容, 最后加载scri
        scri.defer = false;
        // 状态变化
        scri.onreadystatechange = function () {
            if (scri.readyState == "complete") {
                // 检测文档加载完成之后, 开始执行回调
                func();
            }
        };
        var oHead = document.getElementsByTagName("head")[0];
        // 拼接script标签
        oHead.appendChild(scri);
    }
}

function getEle(arg) {
    // div span, #div, .div   '   div    span    '
    // 去掉两边的空格
    var str = arg.replace(/^\s+|\s+$/g, "");
    // 去掉中间的空格
    str = str.replace(/\s+/g, " ");

    // 通过空格分开选择器 [div, span]
    var arr = str.split(" ");

    // 存储父元素的数组
    var parents = [document];

    // 存放子元素的数组
    var children = [];

    // 循环存储
    // ['#div', 'span']
    for (var i = 0; i < arr.length; i++) {
        // 初始化子标签
        children = [];

        // 获取当前的选择器
        // #div, span
        var nowQuery = arr[i];

        for (var j = 0; j < parents.length; j++) {
            // 获取第一个字符
            var flag = nowQuery.charAt(0);

            // 分情况
            switch (flag) {
                case "#":
                    nowQuery = nowQuery.replace("#", "");
                    // 通过id获取元素
                    var ele = document.getElementById(nowQuery);
                    // 存入到children数组中
                    children.push(ele);
                    break;
                case ".":
                    nowQuery = nowQuery.substring(1);
                    var eleArr = byClass(parents[j], nowQuery);
                    for (var k = 0; k < eleArr.length; k++) {
                        children.push(eleArr[k]);
                    }
                    break;
                default:

                    // div.test的情况
                    if (nowQuery.indexOf(".") != -1) {
                        // ['div', 'test']
                        var gloableArr = nowQuery.split(".");

                        // 先获取所有div
                        var elems = parents[j].getElementsByTagName(gloableArr[0]);

                        var reg = new RegExp("\\b" + gloableArr[1] + "\\b");

                        for (var k = 0; k < elems.length; k++) {
                            if (reg.test(elems[k].className)) {
                                children.push(elems[k]);
                            }
                        }

                    } else if (nowQuery.indexOf("[") != -1) {
                        // input[type=text] div[index] span[class^=3]
                        // 先拆开 input type=text]
                        var gloableArr = nowQuery.split("[");

                        // 存结果
                        var resArr = [];

                        // 先获取标签 input
                        var elems = parents[j].getElementsByTagName(gloableArr[0]);

                        var oAttr = gloableArr[1].substring(0, gloableArr[1].length - 1);

                        // 1. 纯属性 2. 有符号的属性(这里我们只写=号了)
                        if (oAttr.indexOf("=") != -1) {
                            // 第二种情况
                            // oAttr2 = ['type', 'text']
                            var oAttr2 = oAttr.split("=");
                            for (var k = 0; k < elems.length; k++) {
                                if (elems[k].getAttribute(oAttr2[0]) == oAttr2[1]) {
                                    children.push(elems[k]);
                                }
                            }
                        } else {
                            for (var k = 0; k < elems.length; k++) {
                                if (elems[k].hasAttribute(oAttr2[0])) {
                                    children.push(elems[k]);
                                }
                            }
                        }
                    } else {
                        // $('div')
                        if (!judge(parents[j], parents[j].tagName)) {
                            var elems = parents[j].getElementsByTagName(nowQuery);
                            for (var k = 0; k < elems.length; k++) {
                                children.push(elems[k]);
                            }
                        }
                    }


                    break;
            }
        }
        parents = children;
    }

    return children;
}

function byClass(parent, str) {
    // 兼容
    if (parent.getElementsByClassName) {
        return parent.getElementsByClassName(str);
    }
    // 获取父元素下的所有后代元素
    var eleArr = parent.getElementsByTagName("*");

    // 定义一个空数组, 存储结果元素
    var resultArr = [];

    // 循环比较className 把符合条件的元素装到空数组中
    for (var i = 0; i < eleArr.length; i++) {
        var reg = new RegExp("\\b" + str + "\\b");
        // 符合条件
        if (reg.test(eleArr[i].className)) {
            resultArr.push(eleArr[i]);
        }
    }
    return resultArr;
}


function judge(obj, tagName) {
    if (!obj.parentElement) return false;

    if (tagName == obj.parentElement.tagName) {
        return true;
    } else {
        return judge(obj.parentElement, tagName);
    }
}


