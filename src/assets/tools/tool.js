class Tool {
    //不为空
    isNotBlank(val) {
        if (typeof(val) == "undefined" || val == null || val == "") {
            return false;
        }
        return true;
    }
    //为空
    isBlank(val) {
        if (typeof(val) == "undefined" || val == null || val == "")
            return true;
        return false;
    }
    //是空对象
    isEmptyObject(obj) {
        for (let key in obj) {
            return false
        };
        return true
    }
    //
    debounce(callback, time) {
        let timeOut = null;
        return function() {
            if (timeOut) clearTimeout(timeOut);
            timeOut = setTimeout(callback, time)
        }
    }
    //
    urlquery() {
        let o = {}
        decodeURIComponent(window.location.search).split('&').forEach(i => i ? o[i.split(/=/)[0].replace(/\?/, '')] = i.split(/=/)[1] : null)
        return o;
    }
}

export default new Tool()