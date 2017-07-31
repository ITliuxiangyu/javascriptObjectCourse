function Ajax() {

}

function $() {
    return new Ajax();
}

$.ajax = function (obj) {

    if (typeof obj !== "object") return;

    var reg = /^get$/i;
    if (obj.type || reg.test(obj.type) ) {
        requestGet(obj.url, obj.success, obj.error);
    }
    var regP = /^post$/i;
    if (regP.test(obj.type)) {
        requestPost(obj.url, obj.data, obj.success, obj.error);
    }

};

function requestGet(url, successCallback, errorCallback) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                successCallback(this.responseText);
            } else {
                errorCallback("请求失败");
            }
        }
    };
    xhr.open("GET", url);
    xhr.send();

}

function requestPost(url, data, successCallback, errorCallback) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                successCallback(this.responseText);
            } else {
                errorCallback("请求失败");
            }
        }
    };
    xhr.open("POST", url);
    var body = stringify(data);
    xhr.send(body);

}

function stringify(obj) {

    var str = "";
    for (key in obj) {
        str += "&" + key + "=" + obj[key];
    }
    str.replace(/^&/, "");
    return str;
}