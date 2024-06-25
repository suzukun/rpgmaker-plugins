//=============================================================================
// RPG Maker MZ - Share Commands
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SNSシェア機能を提供するプラグインです。
 * @author suzukun
 *
 * @help ShareCommands.js
 *
 * このプラグインは、SNSシェア用のプラグインコマンドを提供します。
 *
 * ## 使い方
 *
 * 必要なプラグインコマンドを使用してください。
 *
 * ・ Twitter(X)シェア
 * ・ Facebookシェア
 * ・ LINEシェア
 *
 * @command shareTwitter
 * @text Twitter(X)シェア
 * @desc Twitterのシェア用URLを開きます。
 *
 * @arg url
 * @text URL
 * @desc シェアするページのURLです。
 * @type string
 *
 * @arg text
 * @text 文章
 * @desc シェアする文章です。
 * @type string
 *
 * @command shareFacebook
 * @text Facebookシェア
 * @desc Facebookのシェア用URLを開きます。
 *
 * @arg url
 * @text URL
 * @desc シェアするページのURLです。
 * @type string
 *
 * @command shareLINE
 * @text LINEシェア
 * @desc LINEのシェア用URLを開きます。
 *
 * @arg url
 * @text URL
 * @desc シェアするページのURLです。
 * @type string
 *
 * @arg text
 * @text 文章
 * @desc シェアする文章です。
 * @type string
 */
(() => {
    const PLUGIN_NAME = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

    const stringify = (params) => new URLSearchParams(params).toString();

    const openLink = (url) => window.open(url, "_blank");

    PluginManager.registerCommand(PLUGIN_NAME, "shareTwitter", ({ url, text }) => {
        const v = `http://twitter.com/intent/tweet?${stringify({ url, text })}`;

        openLink(v);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "shareFacebook", ({ url }) => {
        const v = `http://www.facebook.com/share.php?${stringify({ u: url })}`;

        openLink(v);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "shareLINE", ({ url, text }) => {
        const v = `https://social-plugins.line.me/lineit/share?${stringify({ url, text })}`;

        openLink(v);
    });
})();
