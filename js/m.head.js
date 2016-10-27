//var parentPopup = document.getElementById('parent_popup');

function hidePopup (id) {
    id = document.getElementById(id) || this;
    id.style.display='none';
}
function productInModal() {
    var productModal = $(".visual"),
        //parentPopup = $("#parent_popup"),
        popup = $("#popup"),
        modal = $("#pic_modal"),
        productName = popup.find(".cpt_product_name");
    
    productModal.click(function () {
        //$("div#loader").removeClass('display_none');
        var picId = $(this).attr("data-id");
        //var picNums = Number($(this).attr("data-pics"));
        var element = $("#pic" + picId);
        var picNums = Number(element.attr("data-pics"));
        var currPic = Number(element.attr("data-current"));
        var title = "<h1>" + element.attr("alt") + "</h1>";
        var startOfSrc = "/published/publicdata/MULTITOYS/attachments/SC/products_pictures/";
        var img = startOfSrc + picId;
        var srcBig = img + ((currPic > 0)?"-"+currPic:"") + "_enl.jpg";
        var data = "<img id=img-current_picture src=" + srcBig + ">";
        
        if (picNums > 0) {
            var href = img + "_enl.jpg";
            var src = img + "_thm.jpg";
            data += "<div id=box_product_thumbnails>" +
                "<a class=dop_pics data-current=0 href=" + href +">" +
                "<img src=" + src +"></a>";
            
            for (var i = 1; i <= picNums; i++) {
                href = img + "-" + i + "_enl.jpg";
                src = img + "-" + i + "_thm.jpg";
                data += "<a class=dop_pics data-current=" + i + " href=" + href +">" +
                    "<img src=" + src +"></a>";
            }

            data += "</div>";
        }
        productName.html(title);
        modal.html(data);
        
        $(".dop_pics").click(function () {
            var newSrc = $(this).attr("href"),
                curPic = $("#img-current_picture"),
                dopPic = Number($(this).attr("data-current")),
                level;

            level = dopPic - currPic;
            //level = (dopPic > currPic)?+1:-1;
            curPic.attr("src", newSrc);
            
            return changePic(picId, level);
        });
        document.getElementById('parent_popup').style.display = 'block';
        //$("div#loader").addClass('display_none');

        return false;
    });
}

$(document).ready(function () {

    var content = $("#content");
    //,
    // scrollPane = $(".scroll-pane1"), 
    // controls = $(".controls"), 
    // quantity = $(".cart_product_quantity"), 
    // cuttedPath, slideMenuNull;

    if (inLog) {
        $("#slidemenu1").multiSlideMenu({
            scrollToTopSpeed: 300,
            backOnTop: false,
            slideSpeed: 300,
            autoHeightMenu: true,
            backLinkContent: "Назад",
            loadContainer: "#center",
            loadOnlyLatest: true,
            afterLoadDone: function () {
                updateEvents();
            }
        });
    }

    //slideMenuNull = $("#slidemenu0");
    //if (slideMenuNull) {
    //    slideMenuNull.multiSlideMenu({
    //        autoHeightMenu: true,
    //        backOnTop: false,
    //        scrollToTopSpeed: 200,
    //        slideSpeed: 300,
    //        backLinkContent: "Назад",
    //        loadContainer: "html",
    //    });
    //}
    loadCart();
    // resizeCatalog();
    if (window.location.pathname == "/") {
        realMarginLi();
    } else {
        $("a.page-link").click(navigation);
        productInModal();
    }
    
    $.scrollUp({
        scrollName: "scrollUp",
        topDistance: "200",
        topSpeed: 1000,
        animation: "fade",
        animationInSpeed: 1000,
        animationOutSpeed: 1000,
        //scrollText: '⇑',
        scrollText: '↑',
        activeOverlay: false
    });
    $(".js_login_block .js_btn_close").on("click", function () {
        $(this).parents(".js_login_block").hide(200);
    });
    $("#link_login").click(function () {
        var login_block = $("#log2div");
        if (login_block.css("display") === "none") {
            login_block.show(200);
        } else {
            login_block.hide(200);
        }
        return false;
    });
    
    var left = $("#left");
    //var center = $("#center");
    //$(".show-hidden-menu").find('a').on("click", function () {
    //    if (left.css("transform") == "translate3d(256px, 0px, 0px)") {
    //        left.css({transform: "translate3d(0px, 0px, 0px)"});
    //    } else {
    //        left.css({transform: "translate3d(256px, 0px, 0px)"});
    //    }
    //    return false;
    //});
    left.on("click", function () {
        if (left.css("left") == "0") {
            left.css({left: "-100%"});
        }
        return false;
    });
    
    
    $(window).resize(function () {
        if (window.location.pathname == "/") {
            if (inLog) {
                setTimeout(realMarginLi, 100);
            }
        }
    });

    $(".dop_pics").click(function () {
        var newSrc = $(this).attr("href"),
            curPic = $("#img-current_picture");

        curPic.attr("src", newSrc);

        return false;
    });


    $(window).bind("popstate", function () {
        $("div#loader").removeClass('display_none');  
        $.ajax({
            url: location.pathname + location.search +"&ajax=1", 
            success: contentToPage
        });
        function contentToPage(data) {
            $("#center").html(data);
            updateEvents();
        }

        //var data = window.history.state;
        //$("#center").html(data);
        //return false;
    });

    function realMarginLi() {
        var idCenter = $("#center").find(".product_topview_area"), productTopviewAreaWidth = idCenter.width(), centerLi = idCenter.find("ul li"), liWidth = centerLi.width() + 6, liNum = Math.floor(productTopviewAreaWidth / liWidth), margin = Math.round((productTopviewAreaWidth - liWidth * liNum) / (liNum + 1));
        centerLi.css({"margin-left": margin, "margin-bottom": margin});
    }

    // function resizeCatalog() {
    //     var scrollPane = $(".scroll-pane1"), productLists = $(".cpt_product_lists");
    //     cuttedPath = window.location.pathname.split("/");
    //     if (cuttedPath[1] !== "" && cuttedPath[1] !== "cart") {
    //         scrollPane.height(1);
    //         $("#content").height(1);
    //     }
    //     $("#columns").height(1);
    //     productLists.height(1);
    //     setTimeout(realResizeCatalog, 100);
    // }
    //
    // function realResizeCatalog() {
    //     var headerHeight = $("#header").height() + $(".header").height() + 8, maincontentHeight = $(window).height() - headerHeight, delta = $(".product_brief_head").height() + $(".navigator").height(), baronFree = $("#content").next(), scrollPane = $(".scroll-pane1"), mainColumnsHeight = $(".cpt_maincolumns").height(), docHeight = $(document).height() - headerHeight, centerHeight = $("#center").height(), columns = $("#columns"), columnsHeight;
    //     cuttedPath = window.location.pathname.split("/");
    //     switch (cuttedPath[1]) {
    //         case "category":
    //         case "auxpage_new_items":
    //         case "auxpage_divoland":
    //         case "auxpage_mixtoys":
    //         case "auxpage_dreamtoys":
    //         case "auxpage_grandtoys":
    //         case "auxpage_kindermarket":
    //             scrollPane.height(maincontentHeight - delta);
    //             $("#content").height(maincontentHeight - delta);
    //             baronFree.css({top: delta, height: maincontentHeight - delta});
    //             try {
    //                 mainScroll.update();
    //             } catch (e) {
    //                 console.log(e.stack);
    //             }
    //         default:
    //             break;
    //     }
    //     // if (cuttedPath[1] == "category" 
    //     //     || cuttedPath[1] == "auxpage_new_items" 
    //     //     || cuttedPath[1] == "auxpage_divoland" 
    //     //     || cuttedPath[1] == "auxpage_mixtoys" 
    //     //     || cuttedPath[1] == "auxpage_dreamtoys" 
    //     //     || cuttedPath[1] == "auxpage_grandtoys" 
    //     //     || cuttedPath[1] == "search") {
    //     //     scrollPane.height(maincontentHeight - delta);
    //     //     $("#content").height(maincontentHeight - delta);
    //     //     baronFree.css({top: delta, height: maincontentHeight - delta});
    //     //     try {
    //     //         mainScroll.update();
    //     //     } catch (e) {
    //     //         console.log(e.stack);
    //     //     }
    //     // }
    //     if (scrollPane.length) {
    //         columns.height((mainColumnsHeight > docHeight) ? mainColumnsHeight : docHeight);
    //     } else {
    //         centerHeight = ((maincontentHeight - delta) > centerHeight) ? (maincontentHeight - delta) : centerHeight;
    //         columns.height((mainColumnsHeight > centerHeight) ? mainColumnsHeight : centerHeight);
    //     }
    //     columnsHeight = columns.height();
    //     if (cuttedPath[1] != "cart") {
    //         $(".cpt_product_lists").height(columnsHeight);
    //         listScroll.update();
    //     }
    // }

    function strpos(haystack, needle, offset) {
        var i = haystack.indexOf(needle, offset);
        return i >= 0 ? i : false;
    }

    function navigation() {
        var url = $(this).attr("href"),
            glue = "?";
        if (strpos(url, "?") !== false) {
            glue = "&";
        }
        $("div#loader").removeClass('display_none');
        $.ajax({
            url: url + glue + "ajax=1",
            success: contentToPage
        });
        function contentToPage(data) {
            $("#center").html(data);
            updateEvents();
            if (url != location.pathname) {
                window.history.pushState(null, null, url);
                //window.history.pushState($("#center").html(), null, url);
            }
        }

        return false;
    }

    function updateEvents() {
        $("div#loader").addClass('display_none');
        $("a.page-link").click(navigation);
        productInModal();
        $("html, body").animate({scrollTop: 0}, 1000);
    }
});
function strpos(haystack, needle, offset) {
    var i = haystack.indexOf(needle, offset);
    return i >= 0 ? i : false;
}
function explode(delimiter, string) {
    var emptyArray = {0: ""};
    if (arguments.length != 2 || typeof arguments[0] == "undefined" || typeof arguments[1] == "undefined") {
        return null;
    }
    if (delimiter === "" || delimiter === false || delimiter === null) {
        return false;
    }
    if (typeof delimiter == "function" || typeof delimiter == "object" || typeof string == "function" || typeof string == "object") {
        return emptyArray;
    }
    if (delimiter === true) {
        delimiter = "1";
    }
    return string.toString().split(delimiter.toString());
}
function zakcia(seconds) {
    var startDate = new Date();
    startDate.setSeconds(seconds);
    $("#z_counter").countdown({image: "/img/_digits.png", startTime: startDate});
}
function loadCart() {
    $("#my__cart").load("/popup/show_cart.php");
}
function updateClientInfo(id, qt) {
    var zpid = $("#zpid_" + id);
    var cartIcon = zpid.prev();
    var oldVal = parseInt(zpid.text());
    var newVal = ((oldVal) ? oldVal : 0) + parseInt(qt);

    if (!oldVal) {
        cartIcon.removeClass('glyphicons-203-shopping-cart').addClass('glyphicons-540-cart-tick');
        zpid.closest('button.z_add_cart').removeClass('cart_empty');
    }

    //zpid.html('<div class="animated fadeInDownBig">' + newVal + "</div>");
    zpid.html(newVal);
}
function increaseNumber(id) {
    var value = $('#qty' + id),
        nCol = value.val();
    nCol++;
    if (nCol < 1) {
        nCol = 1;
    }
    value.val(nCol);
    return false;
}
function decreaseNumber(id) {
    var value = $('#qty' + id),
        nCol = value.val();
    nCol--;
    if (nCol < 1) {
        nCol = 1;
    }
    value.val(nCol);
    return false;
}
//function addAll2Cart() {
//    var myCart = $("#my__cart");
//    myCart.html('<div style="float:right"><p style="font-size:14px;line-height:37px;color:white">Загрузка товаров...</p></div>');
//    $("[name=product_qty]").each(function () {
//        var id = $(this).attr("data-id");
//        var qt = $(this).val();
//        var query = "?ukey=cart&view=noframe&action=add_product&force=yes&productID=" + id + "&product_qty=" + qt;
//        if (qt > 0) {
//            $.ajax({
//                type: "GET", url: query, dataType: "html", async: true, success: function () {
//                    updateClientInfo(id, qt);
//                }
//            });
//            $(this).val("");
//        }
//    });
//    setTimeout(loadCart, 300);
//}
function add2Cart(who) {
    //var myCart = $("#my__cart");
    // myCart.html('<div style="float:right"><p style="font-size:14px;line-height:37px;color:white">Загрузка товаров...</p></div>');
    $(who).each(function () {
        var id = $(this).attr("data-id");
        var qt = $(this).val();
        if (qt == "") {
            qt = 1;
        }
        var query = "?ukey=cart&view=noframe&action=add_product&force=yes&productID=" + id + "&product_qty=" + qt;
        if (qt > 0) {
            $.ajax({
                type: "GET", url: query, dataType: "html", async: true, success: function () {
                    updateClientInfo(id, qt);
                }
            });
        }
    });
    $(who).val("");
    setTimeout(loadCart, 250);
}
function Recard() {
    var sOut = "";

    sOut += '$.post("/index.php?ukey=cart&did=37&ajax=1",{"update":1,"shopping_cart":1';
    for (var i = 0; i < aID.length; i++) {
        var id = aID[i];
        if (id > 0) {
            var val = $('#count_' + id).val();
            if (parseInt(val) < 1 || val == "") {
                val = 0;
                $('#count_' + id).val(val);
                aID[i] = 0;
                $('#' + id).remove();
            }
            sOut += ',"count_' + id + '":' + val;
        }
    }
    sOut += '}, function(data) {; }  );';

    eval(sOut);
}
function Reprise(oldVal) {

    var all = 0;
    var allB = 0;
    var units = (currensy == 9) ? "&nbsp;&#8372;" : "&nbsp;у.е.";
    var curs = (currensy == 10) ? usd : 1;
//        aID;
    for (var i = 0; i < aID.length; i++) {
        var id = aID[i];

        if (id > 0) {
            var price = parseFloat($('#price_' + id).val());
            var val = $('#count_' + id).val();
            if (parseInt(val) < 1 || val == "") {
                //aID[i] = 0;
                if (confirm("Удалить этот товар из корзины?")) {
                    val = 0;
                    $('#count_' + id).val(val);
                } else {
                    val = oldVal || 1;
                    $('#count_' + id).val(val);
                    //return;
                }
            }
            //else {
            var sum = (price * val).toFixed(2);
            var bonus = 0;
            if (bID[id] > 0) {
                bonus = parseInt(sum / curs) * bID[id];
            }
            //console.log(id + " " + price + " " + val);
            $('#sum_' + id).html(sum.replace(".", ",") + units);
            $('#bonus_' + id).html(bonus + "&nbsp;бал.");
            all += parseFloat(sum);
            allB += bonus;
            //}
        }
    }
    all = all.toFixed(2);
    $('#cart_total').html(/*"<b>" + */all + units/* + "</b>"*/);
    $('#bonus_total').html(/*"<b>" + */allB + "&nbspбаллов");
    Recard();
    setTimeout(loadCart, 250);
}
function CountDOWN(id, removeItem) {
    removeItem = removeItem || false;
    if (!removeItem) {
        var val = parseInt($('#count_' + id).val());
        val--;
        if (val > 0 && val < mID[id]) {
            if ($('#min_' + id).hasClass('display_none')) {
                $('#min_' + id).removeClass('display_none');
            }
        }
        $('#count_' + id).val(val);
        Reprise();
    } else {
        var oldVal = parseInt($('#count_' + id).val());
        $('#count_' + id).val(0);
        Reprise(oldVal);
    }
}
function CountUP(id) {
    var val = parseInt($('#count_' + id).val());
    val++;
    if (val >= mID[id]) {
        if (!$('#min_' + id).hasClass('display_none')) {
            $('#min_' + id).addClass('display_none');
        }
    }
    $('#count_' + id).val(val);

    Reprise();
}
function _changeCurrency() {
    document.ChangeCurrencyForm.submit();
}

function changePic(id, direction) {
    event.preventDefault();
    event.stopPropagation();

    var size = "_thm";
    var pic = "pic";

    // if (id < 10000) {
    //     id = "0" + id;
    // }
    var element = document.getElementById(pic + id);
    var picNums = Number(element.getAttribute("data-pics"));
    var currPic = Number(element.getAttribute("data-current"));
    var startOfSrc = "/published/publicdata/MULTITOYS/attachments/SC/products_pictures/";
    var newPic;
    var endOfSrc;
    //var ext = "_thm.jpg";
    var extDiv = ".jpg";

    if (direction === 0) {
        newPic = 0;
        endOfSrc = "";
    } else if (direction > 0) {
        if (currPic < picNums) {
            newPic = currPic + direction;
            endOfSrc = "-" + newPic;
        } else {
            newPic = 0;
            endOfSrc = "";
        }
    } else {
        if (currPic > 1) {
            newPic = currPic + direction;
            endOfSrc = "-" + newPic;
        } else {
            if (currPic == 1) {
                newPic = 0;
                endOfSrc = "";
            } else {
                newPic = picNums;
                endOfSrc = "-" + newPic;
            }
        }
    }
    element.setAttribute("src", startOfSrc + id + endOfSrc + size + extDiv);
    element.setAttribute("data-current", newPic);
    // var cotrolDiv = element.previousElementSibling;
    element.setAttribute("data-pid", startOfSrc + id + endOfSrc + extDiv);
    // event.stopPropagation();
}

//function throttle(func, ms) {
//    var isThrottled = false, savedArgs, savedThis;
//
//    function wrapper() {
//        if (isThrottled) {
//            savedArgs = arguments;
//            savedThis = this;
//            return;
//        }
//        func.apply(this, arguments);
//        isThrottled = true;
//        setTimeout(function () {
//            isThrottled = false;
//            if (savedArgs) {
//                wrapper.apply(savedThis, savedArgs);
//                savedArgs = savedThis = null;
//            }
//        }, ms);
//    }
//
//    return wrapper;
//}
//$(function () {
//    var searchOk = $("#search_ok"), liveSearch = $(".container"), searchString = $("#searchstring");
//    searchString.keyup(throttle(function () {
//        var search = searchString.val();
//        searchOk.addClass("search_loader");
//        if (search.length > 2) {
//            if (searchCache[search]) {
//                liveSearch.html(searchCache[search]);
//            } else {
//                $.ajax({
//                    type: "POST",
//                    url: "/popup/search.php",
//                    data: {search: search},
//                    cache: true,
//                    success: function (response) {
//                        liveSearch.html(response);
//                        searchCache[search] = response;
//                    }
//                });
//            }
//            return searchOk.removeClass("search_loader");
//        } else {
//            liveSearch.html("");
//            if (!search.length) {
//                searchOk.removeClass("search_loader");
//            }
//        }
//    }, 1500));
//});
(function ($) {
    $.scrollUp = function (options) {
        var defaults = {
            scrollName: "scrollUp",
            topDistance: 300,
            topSpeed: 300,
            animation: "fade",
            animationInSpeed: 200,
            animationOutSpeed: 200,
            scrollText: "Scroll to top",
            scrollImg: false,
            activeOverlay: false
        };
        var o = $.extend({}, defaults, options), scrollId = "#" + o.scrollName;
        $("<a/>", {id: o.scrollName, href: "#top", title: o.scrollText}).appendTo("body");
        if (!o.scrollImg) {
            $(scrollId).text(o.scrollText);
        }
        $(scrollId).css({display: "none", position: "fixed", "z-index": "2147483647"});
        if (o.activeOverlay) {
            $("body").append("<div id='" + o.scrollName + "-active'></div>");
            $(scrollId + "-active").css({
                position: "absolute",
                top: o.topDistance + "px",
                width: "100%",
                "border-top": "1px dotted " + o.activeOverlay,
                "z-index": "2147483647"
            });
        }
        $(window).scroll(function () {
            switch (o.animation) {
                case"fade":
                    $(($(window).scrollTop() > o.topDistance) ? $(scrollId).fadeIn(o.animationInSpeed) : $(scrollId).fadeOut(o.animationOutSpeed));
                    break;
                case"slide":
                    $(($(window).scrollTop() > o.topDistance) ? $(scrollId).slideDown(o.animationInSpeed) : $(scrollId).slideUp(o.animationOutSpeed));
                    break;
                default:
                    $(($(window).scrollTop() > o.topDistance) ? $(scrollId).show(0) : $(scrollId).hide(0));
            }
        });
        $(scrollId).click(function (event) {
            $("html, body").animate({scrollTop: 0}, o.topSpeed);
            event.preventDefault();
        });
    };
})(jQuery);
//(function ($) {
//    var helper = {}, current, title, tID, track = false;
//    $.tooltip = {
//        blocked: false,
//        defaults: {delay: 200, fade: false, top: 150, left: 100, id: "tooltip"},
//        block: function () {
//            $.tooltip.blocked = !$.tooltip.blocked;
//        }
//    };
//    $.fn.extend({
//        tooltip: function (settings) {
//            settings = $.extend({}, $.tooltip.defaults, settings);
//            createHelper(settings);
//            return this.each(function () {
//                $.data(this, "tooltip", settings);
//                this.tOpacity = helper.parent.css("opacity");
//                this.tooltipText = this.title;
//                $(this).removeAttr("title");
//                this.alt = "";
//            }).mouseover(save).mouseout(hide).click(hide);
//        }
//    });
//    function createHelper(settings) {
//        if (helper.parent) {
//            return;
//        }
//        helper.parent = $('<div id="' + settings.id + '"><div class="body"></div>').appendTo(document.body).hide();
//        helper.title = $("h3", helper.parent);
//        helper.body = $("div.body", helper.parent);
//    }
//
//    function settings(element) {
//        return $.data(element, "tooltip");
//    }
//
//    function handle(event) {
//        if (settings(this).delay) {
//            tID = setTimeout(show, settings(this).delay);
//        } else {
//            show();
//        }
//        track = !!settings(this).track;
//        $(document.body).bind("mousemove", update);
//        update(event);
//    }
//
//    function save() {
//        if ($.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler)) {
//            return;
//        }
//        current = this;
//        title = this.tooltipText;
//        if (settings(this).bodyHandler) {
//            helper.title.hide();
//            var bodyContent = settings(this).bodyHandler.call(this);
//            if (bodyContent.nodeType || bodyContent.jquery) {
//                helper.body.empty().append(bodyContent);
//            } else {
//                helper.body.html(bodyContent);
//            }
//            helper.body.show();
//        } else {
//            if (settings(this).showBody) {
//                var parts = title.split(settings(this).showBody);
//                helper.title.html(parts.shift()).show();
//                helper.body.empty();
//                for (var i = 0, part; (part = parts[i]); i++) {
//                    if (i > 0) {
//                        helper.body.append("<br/>");
//                    }
//                    helper.body.append(part);
//                }
//                helper.body.hideWhenEmpty();
//            } else {
//                helper.title.html(title).show();
//                helper.body.hide();
//            }
//        }
//        handle.apply(this, arguments);
//    }
//
//    function show() {
//        tID = null;
//        if (settings(current).fade) {
//            if (helper.parent.is(":animated")) {
//                helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
//            } else {
//                helper.parent.is(":visible") ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
//            }
//        } else {
//            helper.parent.show();
//        }
//        update();
//    }
//
//    function update(event) {
//        if ($.tooltip.blocked) {
//            return;
//        }
//        if (event && event.target.tagName == "OPTION") {
//            return;
//        }
//        if (!track && helper.parent.is(":visible")) {
//            $(document.body).unbind("mousemove", update);
//        }
//        if (current == null) {
//            $(document.body).unbind("mousemove", update);
//            return;
//        }
//        helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
//        var left = helper.parent[0].offsetLeft;
//        var top = helper.parent[0].offsetTop;
//        if (event) {
//            left = event.pageX + settings(current).left;
//            top = event.pageY - settings(current).top;
//            var right = "auto";
//            if (settings(current).positionLeft) {
//                right = $(window).width() - left;
//                left = "auto";
//            }
//            helper.parent.css({left: left, right: right, top: top});
//        }
//        var v = viewport(), h = helper.parent[0];
//        if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
//            left -= h.offsetWidth + 20 + settings(current).left;
//            helper.parent.css({left: left + "px"}).addClass("viewport-right");
//        }
//        if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
//            top -= h.offsetHeight + 120 - settings(current).top;
//            helper.parent.css({top: top + "px"}).addClass("viewport-bottom");
//        }
//    }
//
//    function viewport() {
//        return {x: $(window).scrollLeft(), y: $(window).scrollTop(), cx: $(window).width(), cy: $(window).height()};
//    }
//
//    function hide(event) {
//        if ($.tooltip.blocked) {
//            return;
//        }
//        if (tID) {
//            clearTimeout(tID);
//        }
//        current = null;
//        var tsettings = settings(this);
//
//        function complete() {
//            helper.parent.hide().css("opacity", "");
//        }
//
//        if (tsettings.fade) {
//            if (helper.parent.is(":animated")) {
//                helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
//            } else {
//                helper.parent.stop().fadeOut(tsettings.fade, complete);
//            }
//        } else {
//            complete();
//        }
//    }
//})(jQuery);

/**
 * User Script for Mobile Theme
 * */

// variable for event touch data
var UserTouch = (function () {

    var min_touch_length = 5,
        touch_is_vertical,
        finger_place_x_start,
        finger_place_y_start,
        finger_place_x_end,
        finger_place_y_end,
        touch_delta_x,
        touch_delta_y,
        time_start,
        time_end,
        element;

    var on_touch_start = function (event) {

        finger_place_x_start = event.touches[0].pageX;
        finger_place_y_start = event.touches[0].pageY;
        finger_place_x_end = null;
        finger_place_y_end = null;
        touch_delta_x = null;
        touch_delta_y = null;
        touch_is_vertical = false,
            time_start = ( new Date() ).getTime(),
            time_end = false;

        UserTouch = {
            offsetStart: {
                top: finger_place_y_start,
                left: finger_place_x_start
            },
            offsetEnd: {
                top: false,
                left: false
            },
            offsetDelta: {
                x: false,
                y: false
            },
            orientation: {
                x: false,
                y: false
            },
            touchTime: false
        };

        element.addEventListener("touchmove", on_touch_move, false);
        element.addEventListener("touchend", on_touch_end, false);
    };

    var on_touch_move = function (event) {
        time_end = (new Date()).getTime();
        finger_place_x_end = event.touches[0].pageX;
        finger_place_y_end = event.touches[0].pageY;
        touch_delta_x = finger_place_x_end - finger_place_x_start;
        touch_delta_y = finger_place_y_end - finger_place_y_start;

        //var is_horizontal = ( Math.abs(touch_delta_x) > Math.abs(touch_delta_y) && Math.abs(touch_delta_x) > min_touch_length );
        //if (is_horizontal) {
        //    event.preventDefault();
        //}

        UserTouch.offsetEnd = {
            top: finger_place_y_end,
            left: finger_place_x_end
        };

        UserTouch.offsetDelta = {
            x: touch_delta_x,
            y: touch_delta_y
        };

        if (Math.abs(touch_delta_y) > min_touch_length) {
            if (touch_delta_y < 0) {
                UserTouch.orientation.y = "top";
            } else {
                UserTouch.orientation.y = "bottom";
            }
        }

        if (Math.abs(touch_delta_x) > min_touch_length) {
            if (touch_delta_x < 0) {
                UserTouch.orientation.x = "left";
            } else {
                UserTouch.orientation.x = "right";
            }
        }

        UserTouch.touchTime = (time_end - time_start);
    };

    var on_touch_end = function () {
        // отключаем обработчики
        element.removeEventListener("touchmove", on_touch_move);
        element.removeEventListener("touchend", on_touch_end);
    };

    var bindEvents = function () {
        element = document.body;
        element.addEventListener("touchstart", on_touch_start, false);
    };

    document.addEventListener("DOMContentLoaded", function () {
        bindEvents();
    });

    return {
        offsetStart: {
            top: false,
            left: false
        },
        offsetEnd: {
            top: false,
            left: false
        },
        offsetDelta: {
            x: false,
            y: false
        },
        orientation: {
            x: false,
            y: false
        },
        touchTime: false
    };

})();

// Menu JS
(function ($) {

    var storage = {
        activeMenuClass: "menu-is-shown",
        swipeTime: 300,
        swipe_horizontal_percent: 35,
        getWrapper: function () {
            return $("body");
        },
        getMenu: function () {
            return $(".hidden-menu-wrapper");
        },
        menu_is_active: function () {
            return this.getWrapper().hasClass(this.activeMenuClass);
        }
    };

    // Обработчики кликов
    var bindEvents = function () {
        // Открываем меню
        $(document).on("click", ".show-hidden-menu", function () {
            showHiddenMenu();
            return false;
        });

        // Закрываем меню
        $(".hidden-menu-wrapper").on("click", function () {
            hideHiddenMenu();
            return false;
        });

        // Блокируем всплытие кликов у меню-контейнера
        $(".menu-block-wrapper").on("click", function (event) {
            event.stopPropagation();
        });

        // Блокируем всплытие кликов у меню-контейнера
        $("#out-login").on("click", function (event) {
            event.stopPropagation();
        });

        // Клик по ссылке в меню
        $(".menu-block-wrapper .nav-wrapper").on("click", "a", function () {
            onMenuClick($(this));
            return false;
        });

        var $body = document.body,
            $link = document.querySelectorAll(".show-hidden-menu")[0];

        $body.addEventListener("touchend", onTouchEndController, false);
        $link.addEventListener("touchend", onMenuTouchEnd, false);
    };

    var onTouchEndController = function (event) {
        var cancelTargetClass = [
            "shop-slider-wrapper",
            "tab-list-wrapper"
        ];

        var checkTargetClass = function ($target, elementClass) {
            var result;

            if ($target.hasClass(elementClass)) {
                result = $target;

            } else if ($target.closest("." + elementClass).length) {
                result = $target.closest("." + elementClass);

            } else {
                result = false;
            }

            return result;
        };

        var is_passed = true;
        for (var i in cancelTargetClass) {
            if (cancelTargetClass.hasOwnProperty(i)) {
                if (checkTargetClass($(event.target), cancelTargetClass[i])) {
                    is_passed = false;
                }
            }
        }

        if (is_passed) {
            onTouchEnd();
        }
    };

    // Клик по ссылке в меню
    var onMenuClick = function (selector) {
        var link_href = selector.attr("href"),
            menu_animate_time,
            animation_time;

        // Вычисляем время
        //menu_animate_time = parseFloat($(".hidden-menu-wrapper").css("transition-duration")) * 1000;
        animation_time = /*menu_animate_time || */200;

        // Выполняем редирект после закрытия меню
        if (link_href) {

            // Скрываем меню
            hideHiddenMenu();

            // Если URL отличается от текущего, то редирект
            if (location.pathname !== link_href) {
                // Выполняем редирект после закрытия меню
                setTimeout(function () {
                    location.href = link_href;
                }, animation_time);
            }
        }
    };

    var onTouchEnd = function () {
        var menu_is_active = storage.menu_is_active(),
            orientation_x = (UserTouch.orientation.x),
            is_swipe = ( storage.swipeTime >= UserTouch.touchTime ),
            is_horizontal_swipe = false;

        if (is_swipe) {
            is_horizontal_swipe = ( Math.abs(parseInt(( UserTouch.offsetDelta.y / UserTouch.offsetDelta.x ) * 100)) <= storage.swipe_horizontal_percent );
            if (is_horizontal_swipe) {
                if (orientation_x === "left" && menu_is_active) {
                    hideHiddenMenu();
                }
            }
        }
    };

    var onMenuTouchEnd = function () {
        var menu_is_active = storage.menu_is_active(),
            orientation_x = (UserTouch.orientation.x),
            is_swipe = ( storage.swipeTime >= UserTouch.touchTime ),
            is_horizontal_swipe = false;

        if (is_swipe) {
            is_horizontal_swipe = ( Math.abs(parseInt(( UserTouch.offsetDelta.y / UserTouch.offsetDelta.x ) * 100)) <= storage.swipe_horizontal_percent );
            if (is_horizontal_swipe) {
                if (orientation_x === "right" && !menu_is_active) {
                    showHiddenMenu();
                }
            }

        }
    };

    // Показать скрытое меню
    var showHiddenMenu = function () {
        $("body").addClass(storage.activeMenuClass);
    };

    // Скрыть скрытое меню
    var hideHiddenMenu = function () {
        $("body").removeClass(storage.activeMenuClass);
    };

    // Вызов
    $(document).ready(function () {
        bindEvents();
    });

})(jQuery);

//// Comments JS
//( function($) {
//
//    var bindEvents = function() {
//
//        // Проверка на наличие формы на странице
//        var $commentForm = $(".comment-form-wrapper");
//        if ( $commentForm.length ) {
//            var $submitButton = $commentForm.find(".comment-submit input[type='submit']"),
//                $textarea = $commentForm.find(".comment-form-fields textarea");
//
//            // Блокировка отправки сообщения с пустым полем
//            $submitButton.on("click", function() {
//                if ( !$textarea.val() ) {
//                    $textarea
//                        .attr("placeholder", "Введите ваш комментарий")
//                        .focus()
//                    ;
//                    return false;
//                }
//            });
//        }
//
//        // Клик по "оставить ответ к комментарию"
//        $(".reply-comment-link").on( "click", function() {
//            var commentID = $(this).closest(".comment-item").data("comment-id");
//
//            if (commentID) {
//                setParentCommentID(commentID);
//            }
//        });
//    };
//
//    // Проставляет ID коммента, к которому оставят ответ
//    //var setParentCommentID = function(commentID) {
//    //    var $commentForm = $(".comment-form-wrapper"),
//    //        $input = $commentForm.find("input[name=parent]"),
//    //        $textarea = $commentForm.find(".comment-form-fields textarea");
//    //
//    //    // Проставляем в поле ID
//    //    if ($input) {
//    //        $input.val(commentID);
//    //    }
//    //
//    //    // Скролим окно до поля
//    //    var $textareaAnchorTop = $textarea.offset().top;
//    //    $("body").scrollTop($textareaAnchorTop);
//    //
//    //    // Делаем фокус
//    //    $textarea.focus();
//    //};
//
//    $(document).ready(function() {
//        bindEvents();
//    });
//
//})(jQuery);
//
//// Cash Type Change JS
//( function($) {
//
//    var bindEvents = function() {
//        var $selector = $("#currency");
//        if ($selector.length) {
//            $selector.change( function () {
//                var url = location.href;
//                url += (url.indexOf('?') == -1) ? '?' : '&';
//                location.href = url + 'currency=' + $(this).val();
//            });
//        }
//    };
//
//    $(document).ready( function() {
//        bindEvents();
//    });
//
//})(jQuery);
//
// Show Catalog Filter JS
//( function($) {
//    var bindEvents = function() {
//        $(".show-filter-content-link").on( "click", function() {
//            toggleFilterContent( $(this) );
//            return false;
//        });
//    };
//
//    var toggleFilterContent = function($link) {
//        var $wrapper = $link.closest(".catalog-filter-wrapper"),
//            activeClass = "is-shown";
//
//        // Change Link Text
//        if ($wrapper.hasClass(activeClass)) {
//            $link.text( $link.data("hide-text") )
//        } else {
//            $link.text( $link.data("show-text") )
//        }
//
//        // Toggle Content
//        $wrapper.toggleClass(activeClass);
//    };
//
//    $(document).ready( function() {
//        bindEvents();
//    });
//
//
//var initialPoint;
//var finalPoint;
//$(".slider").on('touchstart', function(event) {
//    event.preventDefault();
//    event.stopPropagation();
//    initialPoint=event.changedTouches[0];
//});
//$(".slider").on('touchend', function(event) {
//    event.preventDefault();
//    event.stopPropagation();
//    finalPoint=event.changedTouches[0];
//    var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
//    //var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
//    if (xAbs > 20/* || yAbs > 20*/) {
//        //if (xAbs > yAbs) {
//        if (finalPoint.pageX < initialPoint.pageX){
//            /*СВАЙП ВЛЕВО*/
//            var code = $(this).find('.next_pic').attr('onclick');
//            eval(code);
//        }
//        else{
//            /*СВАЙП ВПРАВО*/
//
//        }
//        //}
//        //else {
//        //    if (finalPoint.pageY < initialPoint.pageY){
//        //        /*СВАЙП ВВЕРХ*/}
//        //    else{
//        //        /*СВАЙП ВНИЗ*/}
//        //}
//    }
//});
//    
//})(jQuery);
//
// Source: k3-list.js
//
//try {
//
//$(function() {
//
//	$('.ptl__pt-link').click(function() {
//		var point = {
//				latitude: $(this).data('lat'),
//				longitude: $(this).data('long'),
//				imageUrl: $(this).data('imageurl'),
//				workingHours: $(this).data('workinghours'),
//				address: $(this).text()
//			},
//			$scope = angular.element('.popup-map').scope();
//
//		$scope.$apply(function() {
//			$scope.zoom = 16;
//			$scope.center = _.clone(point);
//			$scope.point = _.clone(point);
//		});
//		$('.popup-map').dialog('open');
//	});
//
//	$('.show-srv').click(function() {
//		$('.ptl__td_services ul.services:visible').fadeOut(100);
//		$(this).parents('.ptl__td_services').find('ul.services:hidden')
//			.show()
//			.css({top: '0%', opacity: 0})
//			.animate({top: '80%', opacity: 1}, 150);
//	});
//
//	$('ul.services .close-cross').click(function() {
//		$(this).parents('ul.services').fadeOut(100);
//	});
//
//	$('.ptl__tr_caption').on('click', function() {
//		var $self = $(this);
//		if ($self.hasClass('expanded')) {
//			$self.siblings('.ptl__tr').slideUp(250, function() {
//				$self.removeClass('expanded');
//			});
//		} else {
//			$self.siblings('.ptl__tr').slideDown(250, function() {
//				$self.addClass('expanded');
//			});
//		}
//	});
//
//	if ($('.outlets_wrapper').length) {
//		$('.b-tariff__more.show-outlets').on('click', function() {
//			var $self = $(this);
//			$self.find('I').toggleClass('clicked');
//			$('.outlets_wrapper').toggleClass('collapsed');
//		});
//	}
//
//	$('.b-tariff__more.show-content').on('click', function() {
//		$('.b-tariff__content').slideToggle();
//	});
//
//	var outletsLength = $('.ptl__city').length,
//		$searchField = $('#searchOutletsInput'),
//		counter = 0;
//
//	$searchField.keyup(function() {
//		var query = $(this).val().toLowerCase();
//
//		if (query === '') {
//			$('.ptl__city').show();
//		}
//
//		$('.ptl__tr_caption').each(function(i, el) {
//			var item = $(el).text().trim().toLowerCase();
//
//			if (item.indexOf(query) !== 0) {
//				$(this).parent('.ptl__city').addClass('hiddenBySearch').hide();
//			} else {
//				$(this).parent('.ptl__city').removeClass('hiddenBySearch').show();
//			}
//
//			if (outletsLength === $('.hiddenBySearch').length) {
//				$('.no-results').show();
//			} else {
//				$('.no-results').hide();
//			}
//		});
//	});
//
//});
//
//} catch (err) { }
