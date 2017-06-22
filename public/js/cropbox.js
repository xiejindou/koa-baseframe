/**
 * Created by ezgoing on 14/9/2014.
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox = function (options, el) {
        var el = el || $(options.imageBox),
            obj =
                {
                    state: {},
                    ratio: 1,
                    options: options,
                    imageBox: el,
                    thumbBox: el.find(options.thumbBox),
                    spinner: el.find(options.spinner),
                    image: new Image(),
                    onimg: true,
                    getDataURL: function () {
                        var width = this.thumbBox.width(),
                            height = this.thumbBox.height(),
                            canvas = document.createElement("canvas"),
                            dim = el.css('background-position').split(' '),
                            size = el.css('background-size').split(' '),
                            dx = parseInt(dim[0]) - el.width() / 2 + width / 2,
                            dy = parseInt(dim[1]) - el.height() / 2 + height / 2,
                            dw = parseInt(size[0]),
                            dh = parseInt(size[1]),
                            sh = parseInt(this.image.height),
                            sw = parseInt(this.image.width);
                        canvas.width = width;
                        canvas.height = height;
                        var context = canvas.getContext("2d");
                        context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                        var imageData = canvas.toDataURL('image/png');
                        return imageData;
                    },
                    getBlob: function () {
                        var imageData = this.getDataURL();
                        var b64 = imageData.replace('data:image/png;base64,', '');
                        var binary = atob(b64);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        return new Blob([new Uint8Array(array)], { type: 'image/png' });
                    },
                    zoomIn: function () {
                        this.ratio = 1.1;
                        setBackground();
                    },
                    zoomOut: function () {
                        this.ratio = 0.9;
                        setBackground();
                    }
                },
            setBackground = function () {
                var w = parseInt(obj.image.width) * obj.ratio;
                var h = parseInt(obj.image.height) * obj.ratio;
                var scale = w / h;
                if (scale < 1) {
                    if (w < 163) {
                        w = 165;
                        h = 165 / scale;

                        obj.onimg = false;
                    } else {
                        obj.onimg = true;
                    }
                    if (h < 120) {
                        h = h * 1.4;
                        w = w * 1.4;
                        obj.onimg = false;
                    } else {
                        obj.onimg = true;
                    }
                } else {
                    if (h < 120) {
                        w = 120 * scale;
                        h = 120;

                        obj.onimg = false;
                    } else {
                        obj.onimg = true;
                    }
                    if (w < 165) {
                        w = w * 1.4;
                        h = h * 1.4;
                        obj.onimg = false;
                    } else {
                        obj.onimg = true;
                    }
                }

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;
                el.css({
                    'background-image': 'url(' + options.imgSrc + ')',
                    'background-size': w + 'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'
                });
            },
            imgMouseDown = function (e) {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function (e) {
                e.stopImmediatePropagation();

                if (obj.state.dragable) {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');
                    var size = el.css('background-size').split(' ');
                    var w = parseInt(size[0]);;
                    var h = parseInt(size[1]);;
                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    if (bgX > 132.5 || (bgX + w) < 296) {
                        return;
                    }
                    if (bgY > 140 || (bgY + h) < 259) {
                        return;
                    }
                    el.css('background-position', bgX + 'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function (e) {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function (e) {
                if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail) {

                } else {
                    if (!obj.onimg) {
                        return;
                    }
                }
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio *= 1.1 : obj.ratio *= 0.9;
                setBackground();
            }

        obj.spinner.show();
        obj.image.onload = function () {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function () { $(window).unbind('mouseup', imgMouseUp) });

        return obj;
    };

    jQuery.fn.cropbox = function (options) {
        return new cropbox(options, this);
    };
}));


