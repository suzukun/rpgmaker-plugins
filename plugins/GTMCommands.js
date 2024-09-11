//=============================================================================
// RPG Maker MZ - GTM Commands
//=============================================================================

/*:
 * @target MZ
 * @plugindesc GoogleTagManagerに関する機能を提供するプラグインです。
 * @author suzukun
 *
 * @help GTMCommands.js
 *
 * このプラグインは、gtm.js用のプラグインコマンドを提供します。
 *
 * ## 使い方
 *
 * プラグインパラメータで使用するGoogleタグIDを指定してください。
 *
 * 必要なプラグインコマンドを使用してください。
 *
 * ・ sendEvent
 *
 * @command sendEvent
 * @text イベント送信
 * @desc イベントを送信します。
 *
 * @arg event
 * @text イベント名
 * @desc イベント名です。
 * @type string
 *
 * @arg customProperties
 * @text カスタムプロパティ
 * @desc 任意のプロパティです。
 * @type struct<CustomEventProperty>[]
 *
 * @param tagId
 * @text タグID
 * @desc 使用するGoogleタグID。
 * @type string
 */

/*~struct~CustomEventProperty:
 * @param name
 * @text 名前
 * @desc プロパティ名です。
 * @type string
 *
 * @param value
 * @text 値
 * @desc プロパティの値です。
 * @type string
 */
(() => {
  const PLUGIN_NAME = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

  const createGTMSrcElement = (id) => {
    const element = document.createElement("script");

    element.async = true;
    element.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;

    return element;
  };

  const createGTMHeadCodeElement = () => {
    const element = document.createElement("script");

    element.innerText = `window.dataLayer = window.dataLayer || [];window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`;

    return element;
  };

  const createGTMBodyCodeElement = (id) => {
    const wrapper = document.createElement("noscript");
    const element = document.createTextNode("iframe");

    element.height = 0;
    element.width = 0;
    element.style.display = "none";
    element.style.visibility = "hidden";
    element.src = `https://www.googletagmanager.com/ns.html?id=${id}`;

    wrapper.append(element);

    return wrapper;
  };

  const params = PluginManager.parameters(PLUGIN_NAME);
  const { tagId } = params;
  const hasTagId = !!tagId;

  if (hasTagId) {
    document.head.append(createGTMSrcElement(tagId));
    document.head.append(createGTMHeadCodeElement());
    document.body.prepend(createGTMBodyCodeElement(tagId));
  }

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "sendEvent",
    ({ event, customProperties }) => {
      if (!hasTagId) {
        return;
      }

      const list = JSON.parse(customProperties || "[]");
      const props = list.reduce((result, item) => {
        const { name, value } = JSON.parse(item || "{}");

        result[name] = value;

        return result;
      }, {});

      window.dataLayer.push({
        event,
        ...props,
      });
    }
  );
})();
