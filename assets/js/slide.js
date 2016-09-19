/**
 * Created by dandan.wu on 16/9/18.
 */
var slideShow = function () {
    var bxs, bxe, fxs, fxe, ys, ye, xp,  ci,  tar, tarl;
    var ta = document.getElementById('thumbs');
    var t = ta.getElementsByTagName('li');
    var ia = document.getElementById('image');
    var ie = document.all ? true : false;
    var st = 3;
    var ss = 3;
    var fs = 5;
    var yp = 0;
    var imgdir = 'assets/images/fullsize';
    var imgext = '.jpg';
    var videoext = '.ogg';
    var auto = true;
    var autodelay = 5;
    var showvalue = 0;
    return {
        init: function () {
            document.onmousemove = this.pos;
            window.onresize = function () {
                setTimeout("slideShow.lim()", 500)
            };
            ys = this.toppos(ta);
            ye = ys + ta.offsetHeight;
            len = t.length;
            tar = [];
            for (i = 0; i < len; i++) {
                var id = t[i].value;
                var isMovie = t[i].getAttribute('isMovie') == "true";
                tar[i] = id;
                t[i].onclick = new Function("slideShow.getimg(" + id + ","+isMovie+")");
                if (i == 0) {
                    this.getimg(id,isMovie)
                }
            }
            tarl = tar.length;
        },
        scrl: function (d) {
            clearInterval(ta.timer);
            var l = (d == -1) ? 0 : (t[tarl - 1].offsetLeft - (ta.parentNode.offsetWidth - t[tarl - 1].offsetWidth) + 10)
            ta.timer = setInterval(function () {
                slideShow.mv(d, l)
            }, st);
        },
        mv: function (d, l) {
            // ta.style.left = ta.style.left || '0px';
            // var left = ta.style.left.replace('px', '');
            // if (d == 1) {
            //     if (l - Math.abs(left) <= ss) {
            //         this.cncl(ta.id);
            //         ta.style.left = '-' + l + 'px';
            //     } else {
            //         ta.style.left = left - ss + 'px'
            //     }
            // } else {
            //     if (Math.abs(left) - l <= ss) {
            //         this.cncl(ta.id);
            //         ta.style.left = l + 'px';
            //     } else {
            //         ta.style.left = parseInt(left) + ss + 'px'
            //     }
            // }
        },
        cncl: function () {
            clearTimeout(ta.timer)
        },
        getimg: function (id,isMovie) {
            if (auto) {
                clearTimeout(ia.timer)
            }
            if (ci != null) {
                var ts, tsl, x;
                ts = ia.getElementsByTagName('img');
                ts = ts.length > 0 ? ts : ia.getElementsByTagName('video');
                tsl = ts.length;
                x = 0;
                for (x; x < tsl; x++) {
                    if (ci.id != id) {
                        var o = ts[x];
                        clearInterval(o.timer);
                        o.timer = setInterval(function () {
                            slideShow.fdout(o)
                        }, fs)
                    }
                }
            }
            if (!document.getElementById(id)) {
                var i = document.createElement(isMovie ? 'video' : 'img');
                ia.appendChild(i);
                i.id = id;
                i.av = 0;
                i.style.opacity = 0;
                i.style.filter = 'alpha(opacity=0)';
                i.src = imgdir + '/' + id + (isMovie ? videoext : imgext);
                if(isMovie){
                    i.onclick = function(){
                        if(i.paused){
                            i.play();
                        } else {
                            i.pause();
                        }
                    }
                }
            } else {
                i = document.getElementById(id);
                clearInterval(i.timer);
            }
            i.timer = setInterval(function () {
                slideShow.fdin(i,isMovie);
            }, fs);

            for(var d = 0 ;d<t.length;d++){
                var node = t[d].getElementsByTagName('img')[0];
                if(node){
                    if(t[d].value == id){
                        showvalue = id;
                        node.style.border = '1px #ccc solid';
                    } else {
                        node.style.border = '';
                    }
                }
            }
            slideShow.scorllthumbNav();
        },
        scorllthumbNav:function(){
            var length = t.length;
            if(length <= 7){
                return;
            }
            var width = 132 * length;
            // var currentLeft = ta.style.marginLeft;
            // currentLeft = Number(currentLeft == "" ? 0 : currentLeft.slice(0,-2));
            var beforeLength = (showvalue - 1) * 132;
            var margin =  396 - beforeLength;
            var max = 5;
            var min = 924 - width + 5;
            margin = margin <min ? min : (margin > max ? max : margin);
            ta.style.marginLeft = margin + 'px';
        },
        thumbNav:function(d){
            var length = t.length;
            if(length <= 7){
                return;
            }
            var width = 132 * length;
            var currentLeft = ta.style.marginLeft;
            currentLeft = Number(currentLeft == "" ? 0 : currentLeft.slice(0,-2));
            var step = 924;
            var margin = currentLeft - 924 * d;
            var max = 5;
            var min = 924 - width + 5;
            margin = margin <min ? min : (margin > max ? max : margin);
            ta.style.marginLeft = margin + 'px';
        },
        nav: function (d) {
            var c = 0;
            for (key in tar) {
                if (tar[key] == ci.id) {
                    c = key
                }
            }
            if (tar[parseInt(c) + d]) {
                this.getimg(tar[parseInt(c) + d]);
            } else {
                if (d == 1) {
                    this.getimg(tar[0]);
                } else {
                    this.getimg(tar[tarl - 1])
                }
            }
        },
        auto: function () {
            ia.timer = setInterval(function () {
                slideShow.nav(1)
            }, autodelay * 1000)
        },
        fdin: function (i,isMovie) {
            console.log(isMovie);
            if(!isMovie) {
                if (i.complete) {
                    i.av = i.av + fs;
                    i.style.opacity = i.av / 100;
                    i.style.filter = 'alpha(opacity=' + i.av + ')'
                }
                if (i.av >= 100) {
                    if (auto) {
                        this.auto()
                    }
                    clearInterval(i.timer);
                    ci = i
                }
            } else {
                i.style.opacity = 1;
                i.style.filter = 'alpha(opacity=1)';
                clearInterval(i.timer);
                ci = i;
                i.play();
            }
        },
        fdout: function (i) {
            i.av = i.av - fs;
            i.style.opacity = i.av / 100;
            i.style.filter = 'alpha(opacity=' + i.av + ')';
            if (i.av <= 0) {
                clearInterval(i.timer);
                if (i.parentNode) {
                    i.parentNode.removeChild(i)
                }
            }
        },
        lim: function () {
            var taw, taa, len;
            taw = ta.parentNode.offsetWidth;
            taa = taw / 4;
            bxs = slideShow.leftpos(ta);
            bxe = bxs + taa;
            fxe = bxs + taw;
            fxs = fxe - taa;
        },
        pos: function (e) {
            xp = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
            yp = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
            if (xp > bxs && xp < bxe && yp > ys && yp < ye) {
                slideShow.scrl(-1);
            } else if (xp > fxs && xp < fxe && yp > ys && yp < ye) {
                slideShow.scrl(1);
            } else {
                slideShow.cncl()
            }
        },
        leftpos: function (t) {
            var l = 0;
            if (t.offsetParent) {
                while (1) {
                    l += t.offsetLeft;
                    if (!t.offsetParent) {
                        break
                    }
                    t = t.offsetParent
                }
            } else if (t.x) {
                l += t.x
            }
            return l;
        },
        toppos: function (t) {
            var p = 0;
            if (t.offsetParent) {
                while (1) {
                    p += t.offsetTop;
                    if (!t.offsetParent) {
                        break
                    }
                    t = t.offsetParent
                }
            } else if (t.y) {
                p += t.y
            }
            return p;
        }
    };
}();

window.onload = function () {
    slideShow.init();
    slideShow.lim()
};