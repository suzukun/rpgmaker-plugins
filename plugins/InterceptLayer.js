//=============================================================================
// RPG Maker MZ - Intercept Layer
//=============================================================================

$interceptLayer = null;

/*:
 * @target MZ
 * @plugindesc 新たにレイヤーを用意するプラグインです。
 * @author suzukun
 *
 * @help InterceptLayer.js
 *
 * このプラグインは、以下のレイヤーを追加します。
 *
 * $interceptLayer.beforeBackground
 * $interceptLayer.afterBackground
 * $interceptLayer.beforeForeground
 * $interceptLayer.afterForeground
 * $interceptLayer.beforeSpriteset
 * $interceptLayer.afterSpriteset
 * $interceptLayer.beforeWindowLayer
 * $interceptLayer.afterWindowLayer
 *
 * これらのレイヤーは、単純なPIXI.Containerです。
 *
 * プラグインコマンドはありません。
 */
(() => {
  class InterceptLayer {
    constructor() {
      this._events = {
        onCreateBackground: [],
        onCreateForeground: [],
        onCreateSpriteset: [],
        onCreateWindowLayer: [],
      };

      this._beforeBackground = null;
      this._afterBackground = null;
      this._beforeForeground = null;
      this._afterForeground = null;
      this._beforeSpriteset = null;
      this._afterSpriteset = null;
      this._beforeWindowLayer = null;
      this._afterWindowLayer = null;
    }

    get beforeBackground() {
      return this._beforeBackground;
    }

    get afterBackground() {
      return this._afterBackground;
    }

    get beforeForeground() {
      return this._beforeForeground;
    }

    get afterForeground() {
      return this._afterForeground;
    }

    get beforeSpriteset() {
      return this._beforeSpriteset;
    }

    get afterSpriteset() {
      return this._afterSpriteset;
    }

    get beforeWindowLayer() {
      return this._beforeWindowLayer;
    }

    get afterWindowLayer() {
      return this._afterWindowLayer;
    }

    clear() {
      this._events.onCreateBackground = [];
      this._events.onCreateForeground = [];
      this._events.onCreateSpriteset = [];
      this._events.onCreateWindowLayer = [];

      this._beforeBackground = null;
      this._afterBackground = null;
      this._beforeForeground = null;
      this._afterForeground = null;
      this._beforeSpriteset = null;
      this._afterSpriteset = null;
      this._beforeWindowLayer = null;
      this._afterWindowLayer = null;
    }

    offCreateBackground(callback = null) {
      if (!callback) {
        this._events.onCreateBackground = [];
        return;
      }

      this._events.onCreateBackground = this._events.onCreateBackground.filter(
        (f) => f !== callback
      );
    }

    offCreateForeground(callback = null) {
      if (!callback) {
        this._events.onCreateForeground = [];
        return;
      }

      this._events.onCreateForeground = this._events.onCreateForeground.filter(
        (f) => f !== callback
      );
    }

    offCreateSpriteset(callback = null) {
      if (!callback) {
        this._events.onCreateSpriteset = [];
        return;
      }

      this._events.onCreateSpriteset = this._events.onCreateSpriteset.filter(
        (f) => f !== callback
      );
    }

    offCreateWindowLayer(callback = null) {
      if (!callback) {
        this._events.onCreateWindowLayer = [];
        return;
      }

      this._events.onCreateWindowLayer =
        this._events.onCreateWindowLayer.filter((f) => f !== callback);
    }

    onCreateBackground(callback) {
      this._events.onCreateBackground.push(callback);
    }

    onCreateForeground(callback) {
      this._events.onCreateForeground.push(callback);
    }

    onCreateSpriteset(callback) {
      this._events.onCreateSpriteset.push(callback);
    }

    onCreateWindowLayer(callback) {
      this._events.onCreateWindowLayer.push(callback);
    }

    _emitCreateBackground() {
      this._events.onCreateBackground.forEach((f) => f());
    }

    _emitCreateForeground() {
      this._events.onCreateForeground.forEach((f) => f());
    }

    _emitCreateSpriteset() {
      this._events.onCreateSpriteset.forEach((f) => f());
    }

    _emitCreateWindowLayer() {
      this._events.onCreateWindowLayer.forEach((f) => f());
    }
  }

  $interceptLayer = new InterceptLayer();

  const createInterceptLayer = function (self, id) {
    const container = new PIXI.Container();

    container.name = `InterceptLayer_${id}`;
    container.width = Graphics.width;
    container.height = Graphics.height;
    container.interactive = false;

    self.addChild(container);

    return container;
  };

  const createBackground1 = Scene_Splash.prototype.createBackground;
  Scene_Splash.prototype.createBackground = function () {
    $interceptLayer._beforeBackground = createInterceptLayer(
      this,
      "BeforeBackground"
    );
    createBackground1.apply(this, arguments);
    $interceptLayer._afterBackground = createInterceptLayer(
      this,
      "AfterBackground"
    );
    $interceptLayer._emitCreateBackground();
  };

  const createBackground2 = Scene_Title.prototype.createBackground;
  Scene_Title.prototype.createBackground = function () {
    $interceptLayer._beforeBackground = createInterceptLayer(
      this,
      "BeforeBackground"
    );
    createBackground2.apply(this, arguments);
    $interceptLayer._afterBackground = createInterceptLayer(
      this,
      "AfterBackground"
    );
    $interceptLayer._emitCreateBackground();
  };

  const createBackground3 = Scene_Gameover.prototype.createBackground;
  Scene_Gameover.prototype.createBackground = function () {
    $interceptLayer._beforeBackground = createInterceptLayer(
      this,
      "BeforeBackground"
    );
    createBackground3.apply(this, arguments);
    $interceptLayer._afterBackground = createInterceptLayer(
      this,
      "AfterBackground"
    );
    $interceptLayer._emitCreateBackground();
  };

  const createBackground4 = Scene_MenuBase.prototype.createBackground;
  Scene_MenuBase.prototype.createBackground = function () {
    $interceptLayer._beforeBackground = createInterceptLayer(
      this,
      "BeforeBackground"
    );
    createBackground4.apply(this, arguments);
    $interceptLayer._afterBackground = createInterceptLayer(
      this,
      "AfterBackground"
    );
    $interceptLayer._emitCreateBackground();
  };

  const createForeground = Scene_Title.prototype.createForeground;
  Scene_Title.prototype.createForeground = function () {
    $interceptLayer._beforeForeground = createInterceptLayer(
      this,
      "BeforeForeground"
    );
    createForeground.apply(this, arguments);
    $interceptLayer._afterForeground = createInterceptLayer(
      this,
      "AfterForeground"
    );
    $interceptLayer._emitCreateForeground();
  };

  const createSpriteset1 = Scene_Map.prototype.createSpriteset;
  Scene_Map.prototype.createSpriteset = function () {
    $interceptLayer._beforeSpriteset = createInterceptLayer(
      this,
      "BeforeSpriteset"
    );
    createSpriteset1.apply(this, arguments);
    $interceptLayer._afterSpriteset = createInterceptLayer(
      this,
      "AfterSpriteset"
    );
    $interceptLayer._emitCreateSpriteset();
  };

  const createSpriteset2 = Scene_Battle.prototype.createSpriteset;
  Scene_Battle.prototype.createSpriteset = function () {
    $interceptLayer._beforeSpriteset = createInterceptLayer(
      this,
      "BeforeSpriteset"
    );
    createSpriteset2.apply(this, arguments);
    $interceptLayer._afterSpriteset = createInterceptLayer(
      this,
      "AfterSpriteset"
    );
    $interceptLayer._emitCreateSpriteset();
  };

  const createWindowLayer = Scene_Base.prototype.createWindowLayer;
  Scene_Base.prototype.createWindowLayer = function () {
    $interceptLayer._beforeWindowLayer = createInterceptLayer(
      this,
      "BeforeWindowLayer"
    );
    createWindowLayer.apply(this, arguments);
    $interceptLayer._afterWindowLayer = createInterceptLayer(
      this,
      "AfterWindowLayer"
    );
    $interceptLayer._emitCreateWindowLayer();
  };

  const terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminate = function () {
    $interceptLayer._beforeBackground?.destroy(true);
    $interceptLayer._afterBackground?.destroy(true);
    $interceptLayer.beforeForeground?.destroy(true);
    $interceptLayer.afterForeground?.destroy(true);
    $interceptLayer.beforeSpriteset?.destroy(true);
    $interceptLayer.afterSpriteset?.destroy(true);
    $interceptLayer.beforeWindowLayer?.destroy(true);
    $interceptLayer.afterWindowLayer?.destroy(true);

    $interceptLayer.clear();

    terminate.apply(this, arguments);
  };
})();
