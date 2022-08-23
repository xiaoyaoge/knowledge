/*
 * 帧动画库类
 * @constructor
 */

var requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, callback.interval);
    }
  );
})();

var cancelAnimationFrame = (function () {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function (id) {
      return window.clearTimeout(id);
    }
  );
})();

const FrameAnimation = function () {
  // 初始化状态
  this.taskQueue = [];
  this.index = 0; // 动画帧的位置
  this.timeline = null;
  this.state = 0;
  this.edom = null;
  this.interval = 1000 / 60;
  this.wait = 5 * 1000;
  this.loop = 3; // 循环次数
  this.count = 0;
};
/*
 *  初始化变量
 *
 */
FrameAnimation.prototype.init = function (ele, positions, imageUrl) {
  if (ele) {
    this.edom = ele;
    if (imageUrl) {
      this.edom.style.backgroundImage = "url(" + imageUrl + ")";
    }
  }
  var len = positions.length;
  if (len) {
    positions.forEach((item) => {
      var position = item.split(" ");
      this.taskQueue.push({ x: position[0], y: position[1] });
    });
  }
  this.timeline && cancelAnimationFrame(this.timeline);
  return this;
};

/*
 * 播放序列图
 *
 */
FrameAnimation.prototype.run = function () {
  var me = this;
  var lastTick = +new Date();
  function payDrow() {
    const task = me.taskQueue[me.index];
    if (task) {
      me.edom.style.backgroundPosition = task.x + "px " + task.y + "px";
    }
  }
  const cLen = me.taskQueue.length * me.loop * me.interval;
  var tmer = null;
  function enterframe() {
    var now = +new Date();
    if (now - lastTick >= me.interval) {
      // 执行函数
      if (me.count >= cLen) {
        if (!tmer) {
          tmer = setTimeout(function () {
            clearTimeout(tmer);
            tmer = null;
            me.count = 0;
          }, me.wait);
        }
      } else {
        payDrow();
        if (me.index === me.taskQueue.length - 1) {
          me.index = 0;
        } else {
          me.index++;
        }
        me.count += me.interval;
      }
      lastTick = now;
    }

    me.timeline = requestAnimationFrame(enterframe);
  }
  enterframe.interval = this.interval;
  this.timeline = requestAnimationFrame(enterframe);
};
/*
 * 暂停当前异步定时任务
 *
 */
FrameAnimation.prototype.pause = function () {
  if (this.state === 1) {
    this.state = 2;
    this.timeline && cancelAnimationFrame(this.timeline);
    return this;
  }
  return this;
};
/**
 *  开始播放
 * @param {*} interval
 * @returns
 */
FrameAnimation.prototype.start = function (interval) {
  this.interval = interval;
  this.run();
  return this;
};
/**
 * 释放当前播放、销毁
 * @returns
 */
FrameAnimation.prototype.dispose = function () {
  this.timeline && cancelAnimationFrame(this.timeline);
  this.taskQueue = [];
  this.index = 0; // 动画帧的位置
  this.state = 0;
  this.edom = null;
  this.interval = 1000 / 60;
  this.wait = 5 * 1000;
  this.loop = 5;
  return this;
};

export default FrameAnimation;
