/**
 * Created by dandan.wu on 16/9/18.
 */
var slideShow = function () {
    var curtLi, valueArray, valueArrayLength;
    var thumbs = document.getElementById('thumbs');
    var mediaNodes = thumbs ? thumbs.getElementsByClassName('thumbImgCon') : [];
    console.info(mediaNodes);
    var imgNode = document.getElementById('mediaContainer');
    var imgDir = 'assets/images/fullsize';
    var imgExt = '.jpg',videoExt = '.ogg';
    var auto = false,autoDelay = 5,fadeSpeed = 5;
    var liItemWidth = 132,thumbsWidth = 924,liDisplayLength = 7;
    var showValue = 0;

    return {
        init: function () {//初始化
            valueArray = [];
            for (i = 0; i < mediaNodes.length; i++) {
                var id = parseInt(mediaNodes[i].getAttribute('value'));
                var isMovie = mediaNodes[i].getAttribute('isMovie') == "true";
                valueArray[i] = id;
                mediaNodes[i].onclick = new Function("slideShow.getImg(" + id + "," + isMovie + ")");
                if (i == 0) {
                    this.getImg(id, isMovie)
                }
            }
            valueArrayLength = valueArray.length;
        },
        getImg: function (id, isMovie) {//获取媒体资源,进行切换显示
            if (auto) {
                clearTimeout(imgNode.timer)
            }
            if (curtLi != null) {
                var nodes = imgNode.getElementsByTagName('img');
                nodes = nodes.length > 0 ? nodes : imgNode.getElementsByTagName('video');
                var x = 0;
                console.info(nodes);
                for (x; x < nodes.length; x++) {
                    if (curtLi.id != id) {
                        var nodeItem = nodes[x];
                        clearInterval(nodeItem.timer);
                        nodeItem.timer = setInterval(function () {
                            slideShow.fadeOut(nodeItem)
                        }, fadeSpeed);
                    }
                }
            }
            var mediaNode;
            if (!document.getElementById(id)) {
                mediaNode = document.createElement(isMovie ? 'video' : 'img');
                imgNode.appendChild(mediaNode);
                if (isMovie) {
                    mediaNode.className = 'video-js vjs-default-skin';
                }
                mediaNode.id = id;
                mediaNode.av = 0;
                mediaNode.style.opacity = 0;
                mediaNode.style.filter = 'alpha(opacity=0)';
                mediaNode.src = imgDir + '/' + id + (isMovie ? videoExt : imgExt);
                if (isMovie) {
                    mediaNode.onclick = function () {
                        if (mediaNode.paused) {
                            mediaNode.play();
                        } else {
                            mediaNode.pause();
                        }
                    }
                }
            } else {
                mediaNode = document.getElementById(id);
                clearInterval(mediaNode.timer);
            }
            mediaNode.timer = setInterval(function () {
                slideShow.fadeIn(mediaNode, isMovie);
            }, fadeSpeed);
            slideShow.scrollThumbNav(id);
        },
        scrollThumbNav: function (id) {//切换媒体资源的显示后,调整底下缩略图的位置
            for (var d = 0; d < mediaNodes.length; d++) {
                var node = mediaNodes[d].getElementsByTagName('img')[0];
                if (node) {
                    if (parseInt(mediaNodes[d].getAttribute('value')) == id) {
                        showValue = id;
                        node.style.border = '1px #ccc solid';
                        mediaNodes[d].style.padding = '1px';
                    } else {
                        node.style.border = '';
                        mediaNodes[d].style.padding = '2px';
                    }
                }
            }
            if (mediaNodes.length > liDisplayLength) {
                console.info(showValue);
                var beforeLength = (showValue - 1) * liItemWidth;
                var margin = liItemWidth * Math.floor(liDisplayLength /2)  - beforeLength;
                var max = 0,min = thumbsWidth - mediaNodes.length * liItemWidth;
                console.info(margin,max,min);
                margin = margin < min ? min : (margin > max ? max : margin);
                thumbs.style.marginLeft = margin + 'px';
            }
        },
        thumbNav: function (d) {//点击按钮后调整缩略图的位置
            if (mediaNodes.length > liDisplayLength) {
                var currentLeft = thumbs.style.marginLeft;
                currentLeft = Number(currentLeft == "" ? 0 : currentLeft.slice(0, -2));
                var margin = currentLeft - thumbsWidth * d;
                var max = 0,min = thumbsWidth - liItemWidth * mediaNodes.length;
                margin = margin < min ? min : (margin > max ? max : margin);
                thumbs.style.marginLeft = margin + 'px';
            }
        },
        nav: function (d) {//点击导航按钮,切换媒体资源
            var c = valueArray.indexOf(parseInt(curtLi.id));
            if(c != -1){
                var index = valueArray[c + d] ? c + d : (d == 1 ? 0 : valueArrayLength - 1);
                var isMovie = mediaNodes[index].getAttribute('isMovie') == "true";
                this.getImg(valueArray[index], isMovie);
            }
        },
        auto: function () {//自动播放
            imgNode.timer = setInterval(function () {
                slideShow.nav(1)
            }, autoDelay * 1000)
        },
        fadeIn: function (item, isMovie) {//淡入媒体资源
            curtLi = item;
            if (!isMovie) {
                if (item.complete) {
                    item.av = item.av + fadeSpeed;
                    item.style.opacity = item.av / 100;
                    item.style.filter = 'alpha(opacity=' + item.av + ')'
                }
                if (item.av >= 100) {
                    if (auto) {
                        this.auto()
                    }
                    clearInterval(item.timer);
                }
                return 0;
            }
            item.style.opacity = 1;
            item.style.filter = 'alpha(opacity=1)';
            item.play();
            clearInterval(item.timer);
        },
        fadeOut: function (item) {//淡出媒体资源
            item.av = item.av - fadeSpeed;
            item.style.opacity = item.av / 100;
            item.style.filter = 'alpha(opacity=' + item.av + ')';
            if (item.av <= 0) {
                if (item.parentNode) {
                    item.parentNode.removeChild(item)
                }
                clearInterval(item.timer);
            }
        }
    };
}();

window.onload = function () {
    slideShow.init();
};