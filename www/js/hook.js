/**
 * Hook
 * Version: 2.0
 * Author: Jordan Singer, Brandon Jacoby, Adam Girton
 * Copyright (c) 2016 Hook. All rights reserved.
 * https://github.com/jordansinger/Hook
 */
 var startY=0;
 var endY=0;
 
(function($, window, document, undefined) {
    var win = $(this),
        st = win.scrollTop() || window.pageYOffset,
        called = false;

    var methods = {
        init: function(options) {
            return this.each(function() {
                var $this = $(this),
                    settings = $this.data("hook");
                if (typeof(settings) === "undefined") {
                    var defaults = {
                        refresh: true, // refresh the page
                        callback: function() {}
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("hook", settings);
                } else {
                    settings = $.extend({}, settings, options);
                }
                $(window).on('touchstart', function(e) {
//                    alert("touchStart:");
                    if($(window).scrollTop()>=0){
                        startY = e.originalEvent.touches[0].pageY;
//                        alert("touchStart:"+startY);
                    }
                });
//                $(window).scroll(function(event) {
                $(window).on('touchend', function(e) {
//                    alert('touchEnd:'+startY);

                    endY = e.changedTouches[0].pageY;
                    
                    alert("touchEnd:"+endY);
                    if (startY>endY){
//                    var st = $(window).scrollTop();
//                    if (st <= 0) {
                        if (!settings.refresh) {
                            settings.callback();
                        } else {
                            $this.addClass("fadeIn");
                            alert("reload");
                        }
                    }
                });
            });
        }
    };

    $.fn.hook = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method " + method + " does not exist on jQuery.pluginName");
            return this;
        }
        return method.apply(this, arguments);
    };
})(jQuery, window, document);