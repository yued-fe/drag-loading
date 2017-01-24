/**!
 * @drag-loading.js
 * @author zhangxinxu
 * @copyright YUED-阅文集团用户体验设计中心前端团队
 * @version
 * @Created: 17-01-24
 * @description 基于窗体滚动的下拉加载效果，依赖Zepto.js或者jQuery.js
 */

/**
 * [DragLoading description]
 * @param {object} el loading元素
 * @param {object} option 可选参数
 */
var DragLoading = function (el, option) {
    var defaults = {
        trigger: $('body'),
        // 最大移动垂直距离，下拉超过这个距离认为触发刷新或加载行为
        maxY: 40,
        // 当触发加载行为的时候
        onReload: function () {}
    };

    var params = $.extend({}, defaults, option || {});

    // loading元素处理
    if (!el || !el.length) {
        return this;
    }

    var self = this;

    self.el = el.css('border-bottom', '0 solid transparent');

    self.callback = {
        reload: params.onReload
    };

    // 滚动窗体
    var elWindow = $(window);
    // 最大滚动
    var maxY = params.maxY;

    // 对象槽
    var data = {};

    // 事件
    params.trigger.on({
        touchstart: function (event) {
            var events = event.touches[0] || event;

            // 垂直方向
            data.posY = events.pageY;
            data.nowY = data.posY;
            data.distanceY = 0;

            data.scrollY = elWindow.scrollTop();

            data.touching = true;

            data.markY = -1;
        },
        touchmove: function (event) {
            if (data.touching !== true) {
                return;
            }

            var events = event.touches[0] || event;

            // 垂直位移
            data.nowY = events.pageY;
            var distanceY = data.nowY - data.posY;
            data.distanceY = distanceY;

            var moveY;
            var valHeight


            // 所有浏览器使用统一处理
            if (elWindow.scrollTop() == 0 && distanceY > 0) {
                // other browser
                // 已经滚动到头，阻止默认滚动行为，例如iPhone Chrome的下拉加载
                event.preventDefault();

                // 切换是否下拉loading标志量
                if (data.markY == -1) {
                    // 一旦滚动到顶部，开始下拉展开交互
                    // 1. 先设置标志量，此标志量只有在touch释放到时候才变更
                    // 同时记忆现在滚动到位置
                    data.markY = distanceY;
                }
            }

            // 此时，相比顶端位置，手指移动到的距离
            moveY = distanceY - data.markY;

            // 如果符合下拉展开的条件
            if (data.markY > 0 && el.data('loading') != true) {
                // 太小不处理
                if (moveY < 0) {
                    valHeight = 0;
                } else {
                    valHeight = Math.min(moveY, maxY);
                }

                // borderBottomWidth增加阻力
                var overflowHeight = 0 - valHeight / 2 + Math.max(0, moveY - maxY), borderBottomWidth = overflowHeight;
                if (overflowHeight > 0) {
                    borderBottomWidth = self.damping(overflowHeight);
                }

                el.css({
                    height: valHeight,
                    // 使用border继续增加高度的意义在于loading里面如果有绝对定位等适应性会更强
                    // 然后，随着继续往下拉，再高度变大
                    borderBottomWidth: borderBottomWidth,
                    transition: 'none'
                });
            }
            // 暴露给touchend使用
            data.rectY = moveY;
        },
        touchend: function () {
            if (data.touching !== true) {
                return;
            }

            if (data.markY > 0 && data.rectY > 0) {
                // data.markY是标志量
                // data.rectY是移动量，为了减少属性值数量，使用和Safari同样的属性值
                // 释放的逻辑如下
                // 如果移动超过最大高度，加载，否则，状态还原
                if (data.rectY >= maxY) {
                    el.data('loading', true).css({
                        transition: '',
                        borderBottomWidth: 0
                    });

                    // 加载
                    params.onReload.call(self);
                } else {
                    self.origin();
                }
            }

            data.touching = false;
        }
    });
};

/**
 * 回到最初的样式
 * @return {object} 当前实例对象
 */
DragLoading.prototype.origin = function () {
    var self = this;

    var el = self.el;

    el.css({
        transition: '',
        borderBottomWidth: 0,
        height: 0
    }).data('loading', false);

    return self;
};

/**
 * 设置阻尼计算
 * @param  {number} value 数值
 * @return {[number]}       计算值
 */
DragLoading.prototype.damping = function (value) {
    var step = [20, 40, 60, 80, 100];
    var rate = [0.5, 0.4, 0.3, 0.2, 0.1];

    var scaleedValue = value;
    var valueStepIndex = step.length;

    while (valueStepIndex--) {
        if (value > step[valueStepIndex]) {
            scaleedValue = (value - step[valueStepIndex]) * rate[valueStepIndex];
            for (var i = valueStepIndex; i > 0; i--) {
                scaleedValue += (step[i] - step[i - 1]) * rate[i - 1];
            }
            scaleedValue += step[0] * 1;
            break;
        }
    }

    return scaleedValue;
};
