/***************************************************************************************************
SlideToggler - A jQuery Plugin to turn an element into a collapsible sliding panel with a title
    Author          : Gaspare Sganga
    Version         : 1.1
    Licens          : MIT
    Documentation   : http://gasparesganga.com/labs/jquery-slide-toggler/
***************************************************************************************************/
(function($, undefined){
    // Default Settings
    var _defaults = {
        autoHide        : true,
        speed           : 400,
        statusHide      : "▲",
        statusPosition  : "left",
        statusShow      : "▼",
        title           : "Slide Toggler",
        titleAlign      : "center",
        toggler         : true,
        toolTipHide     : "Hide",
        toolTipShow     : "Show"
    };

    $.SlideTogglerSetup = function(options){
        $.extend(true, _defaults, options);
    };

    $.fn.SlideToggler = function(options, customSpeed){
        if (typeof options == "string") {
            var action = options.toLowerCase();
            
            // Status
            if (action == "status") {
                var $this = $(this).first();
                return $this.hasClass("slidetoggler") && $this.is(":visible");
            }
            
            // Show/Hide/Remove
            return this.each(function(){
                var $this = $(this);
                if (!$this.hasClass("slidetoggler")) return true;
                var toggler = $this.prev(".slidetoggler_top");
                if (action == "hide" && $this.is(":visible"))   toggler.trigger("click", customSpeed);
                if (action == "show" && !$this.is(":visible"))  toggler.trigger("click", customSpeed);
                if (action == "remove") {
                    var bottom = $this.next(".slidetoggler_bottom");
                    $this
                        .removeClass("slidetoggler")
                        .removeData("SlideTogglerSettings")
                        .css("margin-top",      toggler.css("margin-top"))
                        .css("margin-bottom",   bottom.css("margin-bottom"))
                        .show();
                    toggler.remove();
                    bottom.remove();
                }
            });
        }
        
        // Create
        if (typeof options != "object") options = {};
        var settings = $.extend(true, {}, _defaults, options);
        settings.titleAlign     = settings.titleAlign.toLowerCase();
        settings.statusPosition = settings.statusPosition.toLowerCase();
        return this.each(function(){
            var $this = $(this);
            if ($this.hasClass("slidetoggler")) return true;
            $this.addClass("slidetoggler").data("SlideTogglerSettings", settings).show();
            
            // Temporarly show $this and its wrappers if hidden to perform width calculations
            var hiddenWrappers = $this.parents().filter(function(){
                return $(this).css("display") == "none";
            }).add($this.filter(function(){
                return $(this).css("display") == "none";
            }));
            hiddenWrappers.each(function(){
                $(this).show();
            });
            
            // Top
            var toggler = $("<div>", {
                class : "slidetoggler_top"
            })
            .css("margin-top", $this.css("margin-top"))
            .insertBefore($this);
            if (settings.toggler) toggler.addClass("slidetoggler_top_toggler").on("click", _SlideToggler_Click);
            
            // Hide hiddenWrappers again
            hiddenWrappers.each(function(){
                $(this).hide();
            });
            
            // Title
            $("<div>", {
                class   : "slidetoggler_top_title",
                css     : {
                    "text-align" : settings.titleAlign
                },
                html    : settings.title
            }).appendTo(toggler);
            
            // Status
            if (settings.toggler) {
                var status = {
                    left    : $("<div>", {
                        class : "slidetoggler_top_status slidetoggler_top_status_left"
                    }).prependTo(toggler),
                    right   : $("<div>", {
                        class : "slidetoggler_top_status slidetoggler_top_status_right"
                    }).appendTo(toggler)
                };
                var cssProps = (settings.titleAlign == "center") ? {"visibility" : "hidden"} : {"display" : "none"};
                if (settings.statusPosition == "left")  status.right.css(cssProps);
                if (settings.statusPosition == "right") status.left.css(cssProps);
            }
            
            // Bottom
            $("<div>", {
                class   : "slidetoggler_bottom"
            })
            .css("margin-bottom", $this.css("margin-bottom"))
            .insertAfter($this);
            
            // Adjust left and right margins
            if (parseInt($this.css("margin-left")))     toggler.css("margin-left",  $this.css("margin-left"));
            if (parseInt($this.css("margin-right")))    toggler.css("margin-right", $this.css("margin-right"));
            
            // Remove top and bottom margins and init slide toggler
            $this.css("margin-top", 0).css("margin-bottom", 0);
            toggler.trigger("click", 0);
            if (!settings.autoHide) toggler.trigger("click", 0);
        });
    };


    // ******************************
    //  EVENTS
    // ******************************
    function _SlideToggler_Click(event, customSpeed){
        var toggler         = $(event.currentTarget);
        var originalTarget  = toggler.next(".slidetoggler");
        var settings        = originalTarget.data("SlideTogglerSettings");
        var status          = toggler.children(".slidetoggler_top_status");
        var speed           = (customSpeed === undefined) ? settings.speed : customSpeed;
        var eventName       = "";
        if (!originalTarget.is(":animated")) {
            if (originalTarget.is(":visible")) {
                status.html(settings.statusShow);
                toggler.attr("title", settings.toolTipShow);
                eventName = "hide";
            } else {
                status.html(settings.statusHide);
                toggler.attr("title", settings.toolTipHide);
                eventName = "show";
            }
            originalTarget.trigger("before"+eventName+".slidetoggler", {
                speed   : speed,
                title   : settings.title
            }).slideToggle(speed, function(){
                originalTarget.trigger("after"+eventName+".slidetoggler", {
                    title   : settings.title
                });
            });
        }
    }

}(jQuery));