//=============================================================================
// RPG Maker MZ - Gtag Commands
//=============================================================================

/*:
 * @target MZ
 * @plugindesc gtagに関する機能を提供するプラグインです。
 * @author suzukun
 *
 * @help GtagCommands.js
 *
 * このプラグインは、gtag.js用のプラグインコマンドを提供します。
 *
 * ## 使い方
 *
 * プラグインパラメータで使用するGoogleタグIDを指定してください。
 *
 * 必要なプラグインコマンドを使用してください。
 *
 * ・ sendPageView
 * ・ sendEvent
 *
 * @command sendPageView
 * @text ページビュー送信
 * @desc ページビューを送信します。
 *
 * @arg title
 * @text タイトル
 * @desc ページタイトル。
 * @type string
 *
 * @arg location
 * @text URL
 * @desc ページの完全なURL。
 * @type string
 *
 * @arg path
 * @text パス
 * @desc ページパス。
 * @type string
 *
 * @command sendEvent
 * @text イベント送信
 * @desc イベントを送信します。
 *
 * @arg name
 * @text イベント名
 * @desc イベント名です。
 * @type string
 *
 * @arg category
 * @text カテゴリー
 * @desc イベントカテゴリーです。
 * @type string
 *
 * @arg label
 * @text ラベル
 * @desc イベントラベルです。
 * @type string
 *
 * @arg value
 * @text 値
 * @desc イベントの値です。
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

  const createGtagSrcElement = (id) => {
    const element = document.createElement("script");

    element.async = true;
    element.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

    return element;
  };

  const createGtagCodeElement = (id) => {
    const element = document.createElement("script");

    element.innerText = `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "${id}");`;

    return element;
  };

  const params = PluginManager.parameters(PLUGIN_NAME);
  const { tagId } = params;
  const hasTagId = !!tagId;

  if (hasTagId) {
    document.body.appendChild(createGtagSrcElement(tagId));
    document.body.appendChild(createGtagCodeElement(tagId));
  }

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "sendPageView",
    ({ title, location, path }) => {
      const o = {
        page_title: title,
        page_location: location,
        page_path: path,
      };

      if (hasTagId) {
        window.gtag("config", tagId, o);
      }
    }
  );

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "sendEvent",
    ({ name, category, label, value, customProperties }) => {
      const list = JSON.parse(customProperties || "[]");
      const props = list.reduce((result, item) => {
        const { name, value } = JSON.parse(item || "{}");

        result[name] = value;

        return result;
      }, {});

      const o = {
        ...props,
        event_category: category,
        event_label: label,
        event_value: value,
      };

      if (hasTagId) {
        window.gtag("event", name, o);
      }
    }
  );
})();
