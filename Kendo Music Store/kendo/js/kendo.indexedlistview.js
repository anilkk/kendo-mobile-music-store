define(["jQuery", "kendo"], function ($, kendo) {
    "use strict";

    var base = kendo.mobile.ui.ListView;
    var that;
    var _indexList = $('<ul class="km-listview-index"></ul>');
    var _scrollWrapper;
    var _prevIndex = undefined;
    var _indexCard = $('<div class="km-listview-index-card"></div>');

    var _scrollToIndex = function (targetIndex) {
        var targetTop = that.headers[that.headers.length - targetIndex - 1].offset;
        that._scroller().scrollTo(0, targetTop * -1);
    };

    var _showIndexCard = function (x, y, text) {
        _indexCard.text(text);
        _indexCard.css("top", (y - (_indexCard.height() / 2)) + "px");
        _indexCard.css("left", ((_scrollWrapper.width() / 2) - (_indexCard.width() / 2)) + "px");
        _indexCard.show();
    };

    var _onIndexDragMove = function (e) {
        try {
            var targetElement = $(document.elementFromPoint(e.touch.x.location, e.touch.y.location));
            var targetIndex = parseInt(targetElement.data("index"));
            if(_prevIndex !== targetIndex) {
                _prevIndex = targetIndex;
                _scrollToIndex(targetIndex);
                _showIndexCard(e.touch.x.location, e.touch.y.location, targetElement.text());
            }
        } catch (ex) {
            _onIndexDragEnd();
        }
    };

    var _onIndexDragStart = function () {
        _prevIndex = undefined;
        _indexList.addClass("km-ontouch");
    };

    var _onIndexDragEnd = function () {
        _indexCard.hide();
        _prevIndex = undefined;
        _indexList.removeClass("km-ontouch");
    };

    var _createIndexList = function (items) {
        $.each(items, function (index, item) {
            var newElement = $('<li data-index="' + index + '">' + item.value + '</li>');
            _indexList.append(newElement);
        });
    };

    var _sizeIndexList = function (items) {
        var lineHeight = Math.floor((_scrollWrapper.height() - 20) / items.length);
        _indexList.css("line-height", lineHeight + "px");
        _indexList.css("font-size", (lineHeight - 1) + "px");
    };

    var IndexedListView = base.extend({
        init: function(element, options) {
            that = this;

            base.fn.init.call(that, element, options);

            _scrollWrapper = $(element).closest(".km-scroll-wrapper");
            _scrollWrapper.prepend(_indexList);
            $("body").prepend(_indexCard);

            _indexList.kendoTouch({
                dragstart:_onIndexDragStart,
                drag: _onIndexDragMove,
                dragend: _onIndexDragEnd
            });
        },

        options: $.extend(base.options, {
            name: "IndexedListView"
        }),

        refresh: function (e) {
            base.fn.refresh.call(that, e);

            if (that.dataSource.group()[0]) {
                _indexList.empty();
                _sizeIndexList(e.items);
                _createIndexList(e.items);
            }
        }
    });

    kendo.mobile.ui.plugin(IndexedListView);
    return {};
});