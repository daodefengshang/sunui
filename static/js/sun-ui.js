(function (window, document) {
    if (window.sunui) {return;}
    var sunui = {}, undef = typeof undf, lteIE8 = (function () {return !+"\v1";})();

    sunui.oninput = function (node, callback){
        if(document.addEventListener){
            node.addEventListener('input',callback, false);
            if(/MSIE 9\.0/.test(window.navigator.userAgent)){
                var selectionchange = function(){
                    callback.call(node);
                };
                node.addEventListener('focus',function(){
                    document.addEventListener('selectionchange',selectionchange,false);
                },false);
                node.addEventListener('blur',function(){
                    document.removeEventListener('selectionchange',selectionchange,false);
                },false);
            }
        } else {
            node.attachEvent('onpropertychange',function(e){
                if(e.propertyName === 'value'){
                    callback.call(node, node);
                }
            });
        }
    };

    sunui.addEventListener = function (dom, event, func) {
        if(window.addEventListener) {
            dom.addEventListener(event, func, false);
        } else if(window.attachEvent) {
            dom.attachEvent('on' + event, func);
        } else {
            dom['on' + event] = func;
        }
    };

    sunui.removeEventListener = function (dom, event, func) {
        if(window.removeEventListener) {
            dom.removeEventListener(event, func, false);
        } else if(window.detachEvent) {
            dom.detachEvent('on' + event, func);
        }
    };

    sunui.isArray = function (data) {
        return Object.prototype.toString.call(data) === '[object Array]';
    };

    sunui.trim = function (str) {
        if(typeof str !== 'string') {
            return str;
        }
        if(String.prototype.trim) {
            return str.trim();
        } else {
            return str.replace(/^\s*/g, '').replace(/\s*$/g, '');
        }
    };

    sunui.indexOf = function (arr, item) {
        if (typeof arr.indexOf === 'function') {
            return arr.indexOf(item);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (item === arr[i]) {
                    return i;
                }
            }
            return -1;
        }
    };

    sunui.hasClass = function (el, cls) {
        cls = cls || '';
        if ((cls = cls.replace(/\s/g, '')).length === 0) return false;
        return new window.RegExp(' ' + cls + ' ').test(' ' + (el.className || '').replace(/[\t\r\n]/g, '') + ' ');
    };
    sunui.addClass = function (el, cls) {
        if (typeof cls === 'function') {
            cls = cls();
        }
        if (!cls) {return el}
        cls = sunui.trim(cls);
        if (!cls) {return el}
        var clss = cls.split(/\s+/g),
            clazz = sunui.trim(el.className || '').replace(/[\t\r\n]/g, '').split(/\s+/g);
        for (var i = 0; i < clss.length; i++) {
            if (!sunui.hasClass(el, clss[i])) {
                clazz.push(clss[i])
            }
        }
        el.className = clazz.join(' ');
        return el;
    };
    sunui.removeClass = function (el, cls) {
        if (typeof cls === 'function') {
            cls = cls();
        }
        if (!cls) {return el}
        cls = sunui.trim(cls);
        if (!cls) {return el}
        var clss = cls.split(/\s+/g),
            clazz = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' ';
        for (var i = 0; i < clss.length; i++) {
            if (sunui.hasClass(el, clss[i])) {
                while (clazz.indexOf(' ' + clss[i] + ' ') >= 0) {
                    clazz = clazz.replace(' ' + clss[i] + ' ', ' ');
                }
            }
        }
        clazz = sunui.trim(clazz).replace(/\s+/g, ' ');
        el.className = clazz;
        return el;
    };
    
    sunui.deepClone = (function deepClone (values) {
    	var copy = null;
    	if(values == null || typeof values != "object") {
    		return values;
    	}
    	if(values instanceof Date) {
    		copy = new Date();
    		copy.setTime(values.getTime());
    		return copy;
    	}
    	if(values instanceof Array) { 
    		copy = [];
    		for(var i = 0, len = values.length; i < len; i++ ) {
    			copy[i] = deepClone(values[i]);
    		}
    		return copy;
    	}
    	if(values instanceof Object) {
    		copy = {};
    		for (var attr in values) {
    			if(values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]); 
    		}
    		return copy;
    	}
    	return values;
    });

    var guid = function() {
        function S4() {
            return (((1 + window.Math.random()) * 0x10000)|0).toString(16).substring(1);
        }
        return ('sun-' + S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    };

    function isWindow ( obj ) {
        return obj != null && obj == obj.window;
    }
    function getWindow( elem ) {
        return isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }
    function getAbsPoint (el){
        var docElem, win,
            box = { top: 0, left: 0 },
            elem = el,
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        if ( typeof elem.getBoundingClientRect !== undef ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            x: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 ),
            y: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 )
        };
    }
    
    function getWindowSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
    }

    function findParentNode(node, nodeName, root) {
        if(!root) {
            root = document.body;
        }
        if(node.nodeName === nodeName) {
            return node;
        } else {
            if(!node.parentNode || node === root) {
                return null;
            }
            return arguments.callee(node.parentNode, nodeName, root);
        }
    }

    function hover(node, enter, leave) {
        if ('onmouseenter' in node) {
            node.onmouseenter = function () {
                enter(window.event);
            };
            node.onmouseleave = function () {
                leave ? leave(window.event) : enter(window.event);
            };
        } else {
            node.onmouseover = function (e) {
                var that = this, t = e.relatedTarget, t2 = e.target;
                if (!(that === t || (that.compareDocumentPosition(t) & 16))
                    && !!(that === t2 || (that.compareDocumentPosition(t2) & 16))) {
                    enter(e);
                }
            };
            node.onmouseout = function (e) {
                var that = this, t = e.relatedTarget, t2 = e.target;
                if (!(that === t || (that.compareDocumentPosition(t) & 16))
                    && !!(that === t2 || (that.compareDocumentPosition(t2) & 16))) {
                    leave ? leave(e) : enter(e);
                }
            };
        }
    }

    function unhover(node) {
        if ('onmouseenter' in node) {
            node.onmouseenter = null;
            node.onmouseleave = null;
        } else {
            node.onmouseover = null;
            node.onmouseout = null;
        }
    }

    (function(){
        if (!lteIE8 || sunui.vml) {return;}
        sunui.vml = function(name){
            return new SunuiVml().create(name || "rect");
        };
        if (!document.namespaces["sunui-vml"]){
            document.createStyleSheet().addRule(".sunui-vml", "behavior:url(#default#VML);display:inline-block;");
            document.namespaces.add("sunui-vml", "urn:schemas-microsoft-com:vml");
        }
        function SunuiVml () {}
        SunuiVml.prototype = {
            create : function(name){
                this.node = document.createElement('<sunui-vml:' + name + ' class="sunui-vml">');
                return this;
            },
            appendTo: function(parent){
                if(this.node && parent.nodeType === 1){
                    parent.appendChild(this.node);
                }
                return this;
            },
            remove: function () {
                if (this.node.parentNode) {
                    this.node.parentNode.removeChild(this.node);
                }
            },
            attr : function(bag){
                for(var i in bag){
                    if(bag.hasOwnProperty(i)){
                        this.node.setAttribute(i,bag[i])
                    }
                }
                return this;
            },
            html : function (h) {
                this.node.innerHTML = h;
                return this;
            },
            text : function (text) {
                this.node.innerText = text;
                return this;
            },
            css: function(bag){
                for(var i in bag){
                    if(bag.hasOwnProperty(i)) {
                        if (i === 'opacity') {
                            this.node.style.filter = 'alpha(opacity='+ bag[i] * 100 + ')';
                        } else {
                            this.node.style[i] = bag[i];
                        }
                    }
                }
                return this;
            },
            hasClass: function (cls) {
                return sunui.hasClass(this.node, cls);
            },
            addClass: function (cls) {
                sunui.addClass(this.node, cls);
                return this;
            },
            removeClass: function (cls) {
                sunui.removeClass(this.node, cls);
                return this;
            }
        }
    })();

    (function () {
        var getToastContainer = (function () {
            var i = false, baseEl = document.createElement('div');
            baseEl.className = 'sun-toast-container';
            return function () {
                if (i) {
                    return baseEl;
                } else {
                    i = true;
                    document.body.appendChild(baseEl);
                    return baseEl;
                }
            }
        })();
        sunui.toast = function(msg, level, delay) {
            msg = msg || '';
            level = level || 'warning';
            if (level === 'warn') {level = 'warning';}
            delay = (typeof delay === 'number' && delay >= 0 ? delay : 3000);
            var toastNode = new ToastNode(msg, level, delay);
            toastNode.init();
            toastNode.show();
        };

        function ToastNode(msg, level, delay) {
            this.msg = msg;
            this.level = level;
            this.delay = delay;
            this.toastContainer = getToastContainer();
            this.toastItem = null;
            this.hideTimeout = null;
            this.interval = 0;
            this.showInterval = null;
            this.hideInterval = null;
        }

        ToastNode.prototype.init = function () {
            var that = this, div = document.createElement('div');
            that.toastItem = div.cloneNode();
            that.toastItem.className = 'sun-toast-item sun-toast-' + that.level;
            var toastItemInner = div.cloneNode();
            toastItemInner.className = 'sun-toast-item-inner';
            var toastPlaceholder = div.cloneNode();
            toastPlaceholder.className = 'sun-toast-placeholder';
            var toastIcon = div.cloneNode();
            toastIcon.className = 'sun-toast-icon';
            var toastContent = div.cloneNode();
            toastContent.className = 'sun-toast-content';
            toastContent.innerHTML = that.msg;

            toastItemInner.appendChild(toastPlaceholder);
            toastItemInner.appendChild(toastIcon);
            toastItemInner.appendChild(toastContent);
            that.toastItem.appendChild(toastItemInner);
        };

        ToastNode.prototype.show = function () {
            var that = this; that.interval = 100;
            that.toastItem.style.zIndex = -1;
            that.toastItem.style.opacity = '0.01';
            that.toastItem.style.filter = 'Alpha(opacity = 1)';
            that.toastItem.style.top = 0 - that.interval + 'px';
            that.toastContainer.appendChild(that.toastItem);
            that.showInterval = window.setInterval(function () {
                that.interval -= 10;
                if (that.interval < 0) {
                    that.interval = 0;
                }
                that.toastItem.style.opacity = (100 - that.interval) / 100;
                that.toastItem.style.filter = 'Alpha(opacity = ' + (100 - that.interval) + ')';
                that.toastItem.style.top = 0 - that.interval + 'px';
                if (that.interval <= 0) {
                    window.clearInterval(that.showInterval);
                    that.toastItem.style.zIndex = 0;
                    that.hideTimeout = window.setTimeout(function () {
                        that._hideInterval();
                    }, that.delay);
                    hover(that.toastItem, function (e) {
                        window.clearTimeout(that.hideTimeout);
                        window.clearInterval(that.hideInterval);
                    }, function (e) {
                        window.clearTimeout(that.hideTimeout);
                        that.hideTimeout = window.setTimeout(function () {
                            that._hideInterval();
                        }, 600);
                    });
                }
            }, 30);
        };

        ToastNode.prototype._hideInterval = function () {
            var that = this;
            that.hideInterval = window.setInterval(function () {
                unhover(that.toastItem);
                that.interval += 10;
                if (that.interval > 100) {
                    that.interval = 100;
                }
                that.toastItem.style.zIndex = -1;
                that.toastItem.style.opacity = (100 - that.interval) / 100;
                that.toastItem.style.filter = 'Alpha(opacity = ' + (100 - that.interval) + ')';
                that.toastItem.style.top = 0 - that.interval + 'px';
                that.toastItem.style.height = (100 - that.interval) / 2 + 'px';
                if (that.interval >= 100) {
                    window.clearInterval(that.hideInterval);
                    that.toastContainer.removeChild(that.toastItem);
                }
            }, 30);
        };
    })();

    (function () {
        var vmlBtn = {width: 90, height: 36, sureBg: '#6187D2', sureBgHover: '#5177C2', cancelBg: '#B6B9C2', cancelBgHover: '#A6A9B2'};
        sunui.messager = [];
        sunui.alert = function(title, msg, level, handler) {
            var dialogNode = new DialogNode(), json = null;
            if (typeof title === 'string') {
                json = {title: title, msg: msg, level: (function () {
                    if (typeof level === 'string') {return level;} else if (typeof handler === 'string') {return handler;} else {return null;}
                })(), handler: (function () {
                    if (typeof handler === 'function') {return handler;} else if (typeof level === 'function') {return level;} else {return null;}
                })()};
            } else {json = title;}
            dialogNode.init('alert', json);
            sunui.messager.push(dialogNode);
            if(sunui.messager.length === 1) {dialogNode.show();}
        };

        sunui.confirm = function(title, msg, level, handler) {
            var dialogNode = new DialogNode(), json = null;
            if (typeof title === 'string') {
                json = {title: title, msg: msg, level: (function () {
                    if (typeof level === 'string') {return level;} else if (typeof handler === 'string') {return handler;} else {return null;}
                })(), handler: (function () {
                    if (typeof handler === 'function') {return handler;} else if (typeof level === 'function') {return level;} else {return null;}
                })()};
            } else {json = title;}
            dialogNode.init('confirm', json);
            sunui.messager.push(dialogNode);
            if(sunui.messager.length === 1) {dialogNode.show();}
        };

        function DialogNode() {
            this.dialogModal = null;
            this.dialogContainer = null;
            this.dialogMask = null;
            this.dialogBtnSure = null;
            this.dialogBtnCancel = null;
            this.dialogClose = null;
            this.json = null;
            this.showInterval = null;
        }

        DialogNode.prototype.init = function (type, json) {
            if (!json || typeof json !== 'object') {throw new Error('参数必须为一个对象');}
            var that = this, div = document.createElement('div');
            json.title = json.title || '提示';
            json.level = json.level || (type === 'confirm' ? 'help' : 'info');
            if (json.level === 'warn') {json.level = 'warning';}
            json.msg = json.msg || '';
            json.yes  = json.yes || '确定';
            json.no  = json.no || '取消';
            that.json = json;

            that.dialogModal = div.cloneNode();
            that.dialogModal.className = 'sun-dialog-layer';
            var dialogModalMask = div.cloneNode();
            dialogModalMask.className = 'sun-dialog-layer-mask';
            that.dialogContainer = div.cloneNode();
            that.dialogContainer.className = 'sun-dialog-container';

            if (lteIE8) {
                (function () {
                    var upShadow = div.cloneNode();
                    upShadow.className = 'sun-up-shadow';
                    var downShadow = div.cloneNode();
                    downShadow.className = 'sun-down-shadow';
                    var leftShadow = div.cloneNode();
                    leftShadow.className = 'sun-left-shadow';
                    var rightShadow = div.cloneNode();
                    rightShadow.className = 'sun-right-shadow';
                    that.dialogContainer.appendChild(upShadow);
                    that.dialogContainer.appendChild(downShadow);
                    that.dialogContainer.appendChild(leftShadow);
                    that.dialogContainer.appendChild(rightShadow);
                })();
            }

            that.dialogModal.appendChild(dialogModalMask);
            that.dialogModal.appendChild(that.dialogContainer);

            var dialogHeader = div.cloneNode();
            dialogHeader.className = 'sun-dialog-header';
            dialogHeader.innerHTML = json.title;

            var dialogBody = div.cloneNode();
            dialogBody.className = 'sun-dialog-body';
            var dialogPlaceholder = div.cloneNode();
            dialogPlaceholder.className = 'sun-dialog-placeholder';
            var dialogIcon = div.cloneNode();
            dialogIcon.className = 'sun-dialog-icon sun-dialog-' + json.level;
            var dialogContent = div.cloneNode();
            dialogContent.className = 'sun-dialog-content';
            dialogContent.innerHTML = json.msg;
            dialogBody.appendChild(dialogPlaceholder);
            dialogBody.appendChild(dialogIcon);
            dialogBody.appendChild(dialogContent);

            var dialogFooter = div.cloneNode();
            dialogFooter.className = 'sun-dialog-footer';

            var dialogMoveLayer = div.cloneNode();
            dialogMoveLayer.className = 'sun-dialog-move-layer';
            that.dialogMask = div.cloneNode();
            that.dialogMask.className = 'sun-dialog-mask';
            that.dialogBtnSure = div.cloneNode();
            that.dialogBtnSure.className = 'sun-dialog-btn sun-dialog-btn-sure';
            if (sunui.vml) {
                (function () {
                    var sure = sunui.vml('roundrect')
                        .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.6px 0 0 -1.5px'})
                        .attr({fillcolor: vmlBtn.sureBg, filled: true, stroked: false, arcsize: 0.5})
                        .html(json.yes)
                        .appendTo(that.dialogBtnSure);
                    hover(that.dialogBtnSure, function (e) {
                        sure.remove();
                        sure = sunui.vml('roundrect')
                            .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.6px 0 0 -1.5px'})
                            .attr({fillcolor: vmlBtn.sureBgHover, filled: true, stroked: false, arcsize: 0.5})
                            .html(json.yes)
                            .appendTo(that.dialogBtnSure);
                    }, function (e) {
                        sure.remove();
                        sure = sunui.vml('roundrect')
                            .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.6px 0 0 -1.5px'})
                            .attr({fillcolor: vmlBtn.sureBg, filled: true, stroked: false, arcsize: 0.5})
                            .html(json.yes)
                            .appendTo(that.dialogBtnSure);
                    });
                })();
            } else {
                that.dialogBtnSure.innerHTML = json.yes;
            }
            if (type === 'alert') {
                that.dialogBtnSure.style.left = '155px';
            } else {
                that.dialogBtnCancel = div.cloneNode();
                that.dialogBtnCancel.className = 'sun-dialog-btn sun-dialog-btn-cancel';
                if (sunui.vml) {
                    (function () {
                        var cancel = sunui.vml('roundrect')
                            .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.5px 0 0 -1.5px'})
                            .attr({fillcolor: vmlBtn.cancelBg, filled: true, stroked: false, arcsize: 0.5})
                            .html(json.no)
                            .appendTo(that.dialogBtnCancel);
                        hover(that.dialogBtnCancel, function (e) {
                            cancel.remove();
                            cancel = sunui.vml('roundrect')
                                .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.5px 0 0 -1.5px'})
                                .attr({fillcolor: vmlBtn.cancelBgHover, filled: true, stroked: false, arcsize: 0.5})
                                .html(json.no)
                                .appendTo(that.dialogBtnCancel);
                        }, function (e) {
                            cancel.remove();
                            cancel = sunui.vml('roundrect')
                                .css({width: vmlBtn.width, height: vmlBtn.height, margin: '-0.5px 0 0 -1.5px'})
                                .attr({fillcolor: vmlBtn.cancelBg, filled: true, stroked: false, arcsize: 0.5})
                                .html(json.no)
                                .appendTo(that.dialogBtnCancel);
                        });
                    })();
                } else {
                    that.dialogBtnCancel.innerHTML = json.no;
                }
            }
            that.dialogClose = div.cloneNode();
            that.dialogClose.className = 'sun-dialog-close';
            that.dialogClose.innerHTML = '&times;';
            dialogMoveLayer.appendChild(that.dialogMask);
            dialogMoveLayer.appendChild(that.dialogBtnSure);
            if (type !== 'alert') {
                dialogMoveLayer.appendChild(that.dialogBtnCancel);
            }
            dialogMoveLayer.appendChild(that.dialogClose);
            that.dialogContainer.appendChild(dialogHeader);
            that.dialogContainer.appendChild(dialogBody);
            that.dialogContainer.appendChild(dialogFooter);
            that.dialogContainer.appendChild(dialogMoveLayer);
        };

        DialogNode.prototype.show = function () {
            var that = this, dialogContainer = that.dialogContainer, interval = 0;
            dialogContainer.style.opacity = '0.01';
            dialogContainer.style.filter = 'Alpha(opacity = 1)';
            document.body.appendChild(that.dialogModal);
            that.showInterval = window.setInterval(function () {
                interval += 10;
                if (interval > 100) {
                    interval = 100;
                }
                dialogContainer.style.opacity = '' + (interval / 100);
                dialogContainer.style.filter = 'Alpha(opacity = ' + interval + ')';
                if (interval >= 100) {
                    window.clearInterval(that.showInterval);
                    that.dialogBtnSure.onclick = function (e) {
                        var ev = e || window.event;
                        if(ev.stopPropagation) {ev.stopPropagation();} else {ev.cancelBubble = true;}
                        if(ev.preventDefault) {ev.preventDefault();} else {ev.returnValue = false;}
                        that.dialogModal.parentNode.removeChild(that.dialogModal);
                        if(typeof that.json.handler === 'function') {that.json.handler(true);}
                        sunui.messager.shift(that);
                        that.showNext();
                        return false;
                    };
                    that.dialogClose.onclick = function (e) {
                        var ev = e || window.event;
                        if(ev.stopPropagation) {ev.stopPropagation();} else {ev.cancelBubble = true;}
                        if(ev.preventDefault) {ev.preventDefault();} else {ev.returnValue = false;}
                        that.dialogModal.parentNode.removeChild(that.dialogModal);
                        if(typeof that.json.handler === 'function') {that.json.handler(false);}
                        sunui.messager.shift(that);
                        that.showNext();
                        return false;
                    };
                    if (that.dialogBtnCancel) {
                        that.dialogBtnCancel.onclick = that.dialogClose.onclick;
                    }
                    that.dialogModal.onselectstart = function (e) {
                        var ev = e || window.event;
                        if(ev.stopPropagation) {ev.stopPropagation();} else {ev.cancelBubble = true;}
                        if(ev.preventDefault) {ev.preventDefault();} else {ev.returnValue = false;}
                    };
                    that._moveListener();
                }
            }, 30);
        };

        DialogNode.prototype.showNext = function () {
            var that = this;
            if(sunui.messager.length) {sunui.messager[0].show();}
            that = null;
        };

        DialogNode.prototype._moveListener = function () {
            var disX = 0, disY = 0,
                that = this, dialogModal = that.dialogModal, container = that.dialogContainer, el = that.dialogMask,
                doel = el.setCapture ? el : document,
                dialogWidth = undef, dialogHeight = undef;
            el.onmousedown = function (ev) {
                var oEvent = ev || event;
                dialogWidth = dialogWidth || container.offsetWidth;
                dialogHeight = dialogHeight || container.offsetHeight;
                disX = oEvent.clientX - container.offsetLeft;
                disY = oEvent.clientY - container.offsetTop;
                doel.onmousemove = function (ev) {
                    var oEvent = ev || event, l = oEvent.clientX - disX, t = oEvent.clientY - disY;
                    if (l < 1) {l = 1;} else if (l > dialogModal.clientWidth - container.offsetWidth - 1) {l = dialogModal.clientWidth - container.offsetWidth - 1;if (l < 1) {l = 1;}}
                    if (t < 1) {t = 1;} else if (t > dialogModal.clientHeight - container.offsetHeight - 1) {t = dialogModal.clientHeight - container.offsetHeight - 1;if (t < 1) {t = 1;}}
                    container.style.left = l + dialogWidth / 2 + 'px';
                    container.style.top = t + dialogHeight / 2 + 'px';
                    return false;
                };
                doel.onmouseup = function () {doel.onmousemove = null; doel.onmouseup = null; if(el.releaseCapture) {el.releaseCapture();}};
                if(el.setCapture) {el.setCapture();}
                return false;
            };
        };
    })();

    var combos = [];
    
    var getBasePointer = (function () {
    	var i = false, baseEl = document.createElement('div');
    	baseEl.style.cssText = 'position: absolute;top: 0;left: 0;width: 0;height: 0;overflow: hidden;z-index: -1;';
    	return function () {
    		if (i) {
    			return baseEl;
    		} else {
    			i = true;
    			document.body.appendChild(baseEl);
    			return baseEl;
    		}
    	}
    })();

    sunui.addEventListener(document.body, 'click', function () {
        for(var i = 0; i < combos.length; i++) {
            (function (i) {
                var existNode = combos[i];
                if (existNode.selectPanel && typeof existNode.isPanelShow === 'function' && existNode.isPanelShow()) {
                    existNode.hidePanel();
                }
            })(i);
        }
    });

    window.setTimeout((function () {
        return function setPanelPosition () {
            for(var i = 0; i < combos.length; i++) {
                (function (i) {
                    var existNode = combos[i];
                    if (existNode.selectPanel && typeof existNode.isPanelShow === 'function' && existNode.isPanelShow()) {
                        existNode.setPanelPosition();
                    }
                })(i);
            }
            window.setTimeout(setPanelPosition, 300);
        }
    })(), 300);

    (function () {
        sunui.combobox = function (node, json) {
            if(!node) {
                return null;
            }
            var el = typeof node === 'string' ? document.getElementById(node) : (node.length ? node[0] : node);
            var comboboxNode = null, existNode = null;
            if(el && combos.length) {
                for(var i = 0; i < combos.length; i++) {
                    existNode = combos[i];
                    if(existNode.el === el || (existNode.el.getAttribute('data-sunui-guid') && existNode.el.getAttribute('data-sunui-guid') === el.getAttribute('data-sunui-guid'))) {
                        return existNode;
                    }
                }
            }
            if(el && json) {
                comboboxNode = new ComboboxNode();
                comboboxNode.init(el, json);
                combos.push(comboboxNode);
            }
            return comboboxNode;
        };

        function ComboboxNode() {
            this.el = null;
            this.json = null;
            this.selectContainer = null;
            this.inp = null;
            this.selectPanel = null;
            this.isPanelHide = true;

            this.datas = null;
            this.usedValues = {};
            this.valueIndexs = [];
        }

        ComboboxNode.prototype.init = function (el, json) {
            var that = this;
            el.setAttribute('data-sunui-guid', guid());
            that.el = el;
            (function () {
                json.panelDisplay = json.panelDisplay || 'none';
                json.display = (json.display === 'inline-block' ? 'display: inline-block;*display: inline;*zoom: 1;' : 'display: block;');
                json.verticalAlign = (json.verticalAlign ? 'vertical-align: ' + json.verticalAlign + ';' : '');
                json.width = json.width || window.parseInt(el.style.width || 0, 10) || 180;
                json.height = json.height || window.parseInt(el.style.height || 0, 10) || 22;
                json.borderWidth = window.parseInt(json.borderWidth || 0, 10) || 2;
                if (el.style.position === 'absolute' || el.style.position === 'relative') {
                    json.position = el.style.position;
                } else {
                    json.position = 'relative';
                }
                json.top = window.parseInt(el.style.top || 0, 10);
                json.left = window.parseInt(el.style.left || 0, 10);
                if (typeof json.readOnly !== typeof false) {
                    json.readOnly = el.readOnly;
                }
                if (typeof json.disabled !== typeof false) {
                    json.disabled = el.disabled;
                }
                json.separator = json.separator || ',';
                if (typeof json.singleSelect !== typeof false) {
                    json.singleSelect = true;
                }
                if (typeof json.panelWidth !== typeof 1) {
                    json.panelWidth = json.width;
                }
                json.panelHeight = window.parseInt(json.panelHeight || 0, 10) || 200;
                json.panelAlign = (json.panelAlign === 'right' ? 'right' : 'left');
                json.stripe = !!json.stripe;
                json.valueField = json.valueField || 'value';
                json.textField = json.textField || 'text';
                json.value = (function () {
                    var val = {};
                    if (!json.value && json.value !== 0 || sunui.isArray(json.value) && json.value.length < 1) {
                        return val;
                    }
                    if (sunui.isArray(json.value)) {
                        if (json.singleSelect) {
                            val[json.value[0]] = json.value[0];
                            return val;
                        } else {
                            for (var i = 0; i < json.value.length; i++) {
                                val[json.value[i]] = json.value[i];
                            }
                            return val;
                        }
                    } else {
                        val[json.value] = json.value;
                        return val;
                    }
                })();
                that.json = json;
            })();

            var div = document.createElement('div');
            var selectContainer = div.cloneNode();
            selectContainer.className = 'sun-select-container';
            selectContainer.style.cssText = json.display + json.verticalAlign + 'position: ' + json.position + ';top: ' + json.top + 'px;left: '
                + json.left + 'px;width: ' + json.width + 'px;height: '
                + json.height + 'px;_width: ' + (json.width - json.borderWidth) + 'px;';
            el.disabled = json.disabled;
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.readOnly = true;
            inp.disabled = json.disabled;
            inp.className = 'sun-select-input';
            inp.style.cssText = 'padding: 0 ' + json.height + 'px 0 4px;width: ' + (json.width - 4 - json.height - 2 * json.borderWidth)
                + 'px;height: ' + (json.height - 2 * json.borderWidth) + 'px;line-height: ' + (json.height - 2 * json.borderWidth)
                + 'px;color: #' + (json.disabled ? '808080' : '404040')
                + ';font-size: ' + window.Math.min(((json.height - 2 * json.borderWidth) / 4 + 1) * 2, json.height - 2 * json.borderWidth)
                + 'px;_width: ' + (json.width - json.borderWidth) + 'px;_height: ' + json.height + 'px;border: ' + json.borderWidth + 'px solid #CCCCCC;';
            var iconLeftBorder = div.cloneNode();
            iconLeftBorder.className = 'sun-select-icon-left-border';
            iconLeftBorder.style.cssText = 'top: ' + json.borderWidth + 'px;right: ' + (json.height - json.borderWidth)
                + 'px;width: ' + (2 * json.borderWidth) + 'px;height: ' + (json.height - 2 * json.borderWidth) + 'px;';
            var selectIcon = div.cloneNode();
            selectIcon.className = 'sun-select-icon';
            selectIcon.style.cssText = 'top: ' + json.borderWidth + 'px;right: ' + json.borderWidth
                + 'px;width: ' + (json.height - 2 * json.borderWidth) + 'px;height: ' + (json.height - 2 * json.borderWidth) + 'px;';

            selectContainer.appendChild(inp);
            selectContainer.appendChild(iconLeftBorder);
            selectContainer.appendChild(selectIcon);
            el.parentNode.insertBefore(selectContainer, el);
            el.style.display = 'none';
            selectContainer.appendChild(el);
            that.selectContainer = selectContainer;
            that.inp = inp;
            that.createPanel();
        };

        ComboboxNode.prototype.createPanel = function () {
            var that = this, selectContainer = that.selectContainer, div = document.createElement('div'), json = that.json;
            var selectPanel = div.cloneNode();
            selectPanel.className = 'sun-select-panel';
            selectPanel.style.cssText = 'width: ' + (json.panelWidth - 2) + 'px;height: ' + (json.panelHeight - 2)
                + 'px;display: ' + json.panelDisplay + ';' + (typeof json.zIndex === typeof 1 ? 'z-index: ' + json.zIndex + ';' : '')
                + 'font-size: ' + window.Math.min(((json.height - 2 * json.borderWidth) / 5 + 2) * 2, json.height - 2 * json.borderWidth - 2) + 'px;';
            that.selectPanel = selectPanel;
            document.body.appendChild(selectPanel);
            if (selectContainer) {
                selectContainer.onclick = function (e) {
                    var ev = e || window.event;
                    if(ev.stopPropagation) {
                        ev.stopPropagation();
                    } else {
                        ev.cancelBubble = true;
                    }
                    if(!that.isPanelShow()) {
                        for(var i = 0; i < combos.length; i++) {
                            (function (i) {
                                var existNode = combos[i];
                                if (existNode.selectPanel && typeof existNode.isPanelShow === 'function' && existNode.isPanelShow()) {
                                    existNode.hidePanel();
                                }
                            })(i);
                        }
                        if(json.readOnly) {
                            return false;
                        }
                        that.setPanelPosition();
                        that.showPanel();
                    } else {
                        that.hidePanel();
                    }
                    return false;
                };
            }
            selectPanel.onclick = function (e) {
                var ev = e || window.event;
                if(ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
                if (json.readOnly || json.disabled) {
                    return false;
                }
                var target = ev.target || ev.srcElement;
                var node = findParentNode(target, 'TR', selectPanel);
                if (!node) {
                    return false;
                }
                var index = sunui.indexOf(that.valueIndexs, node.sectionRowIndex);
                if (index < 0) {
                    if (json.singleSelect) {
                        if (that.valueIndexs.length > 0) {
                            var idx = that.valueIndexs.shift();
                            sunui.removeClass(selectPanel.getElementsByTagName('tr')[idx], 'sun-select-selected');
                        }
                        that.valueIndexs.length = 0;
                        that.valueIndexs.push(node.sectionRowIndex);
                        sunui.addClass(node, 'sun-select-selected');
                    } else {
                        that.valueIndexs.push(node.sectionRowIndex);
                        sunui.addClass(node, 'sun-select-selected');
                    }
                } else {
                    that.valueIndexs.splice(index, 1);
                    sunui.removeClass(node, 'sun-select-selected');
                }
                that._setValue();
                return false;
            };
            typeof json.onInit === 'function' && json.onInit(that);
        };

        ComboboxNode.prototype.setPanelPosition = function () {
            var that = this, json = that.json, selectPanel = that.selectPanel, basePoiner = getBasePointer();
            var pos = getAbsPoint(that.selectContainer), bpos = getAbsPoint(basePoiner), windowSize = getWindowSize();
            var isLeft = json.panelWidth === json.width;
            if (!isLeft) {
                if (json.panelWidth < json.width) {
                    isLeft = json.panelAlign === 'left';
                } else if (json.panelAlign === 'left') {
                    isLeft = (windowSize.width - pos.x >= json.panelWidth) || (pos.x + json.width < json.panelWidth);
                } else {
                    isLeft = (pos.x + json.width < json.panelWidth) && (windowSize.width - pos.x >= json.panelWidth);
                }
            }
            var isBottom = (windowSize.height - pos.y - json.height >= json.panelHeight) || (pos.y < json.panelHeight);

            if (isLeft) {
                selectPanel.style.left = pos.x - bpos.x + 'px';
            } else {
                selectPanel.style.left = json.width + pos.x - json.panelWidth - bpos.x + 'px';
            }
            if (isBottom) {
                selectPanel.style.top = json.height + pos.y - bpos.y + 'px';
            } else {
                selectPanel.style.top = pos.y - json.panelHeight - bpos.y + 'px';
            }
            return that;
        };
        ComboboxNode.prototype.isPanelShow = function () {
            return !this.isPanelHide;
        };
        ComboboxNode.prototype.hidePanel = function () {
            var that = this, json = that.json;
            if(typeof json.onBeforeHidePanel === 'function' && json.onBeforeHidePanel(that) === false) {
                return that;
            }
            that.isPanelHide = true;
            that.selectPanel.style.display = 'none';
            that.inp.style.border = json.borderWidth + 'px solid #CCCCCC';
            typeof json.onHidePanel === 'function' && json.onHidePanel(that);
            return that;
        };
        ComboboxNode.prototype.showPanel = function () {
            var that = this, json = that.json;
            if (json.readOnly || json.disabled) {
                return that;
            }
            if(typeof json.onBeforeShowPanel === 'function' && json.onBeforeShowPanel(that) === false) {
                return that;
            }
            that.selectPanel.parentNode.appendChild(that.selectPanel);
            that.isPanelHide = false;
            that.selectPanel.style.display = 'block';
            that.inp.style.border = json.borderWidth + 'px solid #90B0FD';
            typeof json.onShowPanel === 'function' && json.onShowPanel(that);
            return that;
        };
        ComboboxNode.prototype.clearDatas = function () {
            var that = this;
            that.el.value = '';
            that.inp.value = '';
            that.selectPanel.innerHTML = '';
            that.datas = null;
            that.usedValues = {};
            that.valueIndexs = [];
            return that;
        };
        ComboboxNode.prototype.fillDatas = function (datas, copy, onComplete) {
            var that = this;
            if (typeof copy === 'function') {
            	onComplete = copy;
            	copy = false;
            }
            that.clearDatas();
            that.datas = (copy ? sunui.deepClone(datas) : datas);
            if (!that.datas || !sunui.isArray(that.datas) || that.datas.length < 1) {
                return that;
            }
            var html = '<table><tbody>';
            for (var i = 0; i < that.datas.length; i++) {
                html += that._fillItem(that.datas[i], i);
            }
            html += '</tbody></table>';
            that.selectPanel.innerHTML = html;
            that.usedValues = {};
            that._setValue();
            typeof onComplete === 'function' && onComplete(that);
            return that;
        };
        ComboboxNode.prototype.fillDatasSync = function (datasWrapper, copy, onComplete) {
        	var that = this;
        	var initTime = +new Date(), nowTime = null, time = 3 * 60 * 1000;
        	var fillVailDatas = function () {
        		if (datasWrapper.datas) {
        			that.fillDatas(datasWrapper.datas, copy, onComplete);
        		} else {
        			nowTime = +new Date();
        			if (nowTime - initTime < time) {
        				window.setTimeout(fillVailDatas, 1000);
        			}
        		}
        	}
        	window.setTimeout(fillVailDatas, 1000);
        }
        ComboboxNode.prototype._fillItem = function (data, index) {
            var that = this, json = that.json;
            var stripe = '', selected = '';
            var value = data[json.valueField], text = data[json.textField] || value;
            if (json.stripe && index % 2 === 0) {
                stripe = ' sun-stripe';
            }
            if (value === json.value[value] && that.usedValues[value] == undef) {
                that.usedValues[value] = value;
                selected = ' sun-select-selected';
                that.valueIndexs.push(index);
            }
            var clazz = sunui.trim(stripe + selected);
            if (clazz.length > 0) {
                clazz = ' class="' + clazz + '"';
            }
            return '<tr' + clazz + '><td><span class="sun-select-content">' + text + '</span></td></tr>';
        };
        ComboboxNode.prototype.getValue = function () {
            var that = this, json = that.json, valueIndexs = that.valueIndexs, datas = that.datas;
            var values = [];
            if (json.singleSelect) {
                values.push(valueIndexs.length < 1 ? undef : datas[valueIndexs[0]][json.valueField]);
            } else {
                for (var i = 0; i < valueIndexs.length; i++) {
                    values.push(datas[valueIndexs[i]][json.valueField]);
                }
            }
            return values;
        };
        ComboboxNode.prototype.getText = function () {
            var that = this, json = that.json, valueIndexs = that.valueIndexs, datas = that.datas;
            var texts = [];
            if (json.singleSelect) {
                texts.push(valueIndexs.length < 1 ? undef : (datas[valueIndexs[0]][json.textField] || datas[valueIndexs[0]][json.valueField]));
            } else {
                for (var i = 0; i < valueIndexs.length; i++) {
                    texts.push(datas[valueIndexs[i]][json.textField] || datas[valueIndexs[i]][json.valueField]);
                }
            }
            return texts;
        };
        ComboboxNode.prototype._setValue = function () {
            var that = this, json = that.json;
            var value = that.getValue();
            var text = that.getText();
            that.el.value = (value == undef ? '' : (sunui.isArray(value) ? value.join(json.separator) : value));
            that.inp.value = (text == undef ? '' : (sunui.isArray(text) ? text.join(json.separator) : text));
            return that;
        };
        ComboboxNode.prototype.setValue = function (value) {
            var that = this, json = that.json, datas = that.datas, selectPanel = that.selectPanel;
            if (!datas) {
                return that;
            }
            var val = (function () {
                var val = {};
                if (!value && value !== 0 || sunui.isArray(value) && value.length < 1) {
                    return val;
                }
                if (sunui.isArray(value)) {
                    if (json.singleSelect) {
                        val[value[0]] = value[0];
                        return val;
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            val[value[i]] = value[i];
                        }
                        return val;
                    }
                } else {
                    val[value] = value;
                    return val;
                }
            })();
            var trs = selectPanel.getElementsByTagName('tr');
            for (var i = 0; i < that.valueIndexs.length; i++) {
                sunui.removeClass(trs[that.valueIndexs[i]], 'sun-select-selected');
            }
            that.valueIndexs.length = 0;
            var value = undef;
            for (var i = 0; i < datas.length; i++) {
                value = datas[i][json.valueField];
                if (value === val[value] && that.usedValues[value] == undef) {
                    that.usedValues[value] = value;
                    that.valueIndexs.push(i);
                    sunui.addClass(trs[i], 'sun-select-selected');
                }
            }
            that.usedValues = {};
            that._setValue();
            trs = null;
            return that;
        };
        ComboboxNode.prototype.readOnly = function (flag) {
            var that = this, json = that.json;
            if (typeof flag !== typeof false) {
                return json.readOnly;
            }
            json.readOnly = flag;
            if (that.isPanelShow()) {
                that.hidePanel();
            }
            return that;
        };
        ComboboxNode.prototype.disabled = function (flag) {
            var that = this, json = that.json;
            if (typeof flag !== typeof false) {
                return json.disabled;
            }
            json.disabled = flag;
            that.el.disabled = flag;
            that.inp.disabled = flag;
            if (flag) {
                that.inp.style.color = '#808080';
            } else {
                that.inp.style.color = '#404040';
            }
            if (that.isPanelShow()) {
                that.hidePanel();
            }
            return that;
        };
    })();

    window.sunui = sunui;
})(window, document);