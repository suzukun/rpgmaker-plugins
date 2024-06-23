//=============================================================================
// RPG Maker MZ - CSV Loader
//=============================================================================

/*:
 * @target MZ
 * @plugindesc CSVファイルを扱うプラグインです。
 * @author suzukun
 *
 * @help CSVLoader.js
 *
 * このプラグインは、CSVファイルを扱う機能を提供します。
 *
 * ## CSVについて
 *
 * このプラグインで扱うCSVには、[id, value]ヘッダー行が必要です。
 * それぞれの行のidには、一意の値を設定してください。
 *
 * ## CSVファイルの読み込み方法
 *
 * CSVファイルは、csvフォルダ内に配置してください。
 * ファイル名は、半角英数字で設定してください。
 *
 * 配置後、プラグインパラメータから読み込むCSVファイルの設定をしてください。
 *
 * nameには、対象のCSV情報に付ける任意の名前を設定してください。
 * この名前は、制御文字で使用します。
 * 例: sample
 *
 * pathには、対象のCSVファイルのパスを設定してください。
 * 例: csv/sample.csv
 *
 * ## 制御文字について
 *
 * CSVデータ内の値を取得するには、制御文字を使用してください。
 * 例: \CSV[name, id]
 *
 * ## 他
 *
 * プラグインコマンドはありません。
 *
 * @param list
 * @text CSVファイル一覧
 * @desc 読み込むCSVファイルの一覧です。
 * @type struct<CSVData>[]
 *
 * @requiredAssets csv/*
 */

/*~struct~CSVData:
 * @param name
 * @text CSVデータ名
 * @desc CSVデータの名前です。
 * @type string
 *
 * @param path
 * @text CSVファイルパス
 * @desc CSVファイルのパスです。
 * @type string
 */
(async () => {
  const REG_EXP = /\x1bCSV\[([\w\-]+),\s*([\w\-]+)\]/gi;
  const PLUGIN_NAME = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

  const escapeBackSlash = (text) =>
    text.replace(/\\/g, "\x1b").replace(/\x1b\x1b/g, "\\");

  const escapeMultipleLineText = (data) => {
    const result = [];
    const tempMap = {};
    const splited = data.split('"');

    splited.forEach((item, index) => {
      if (index % 2 === 0) {
        result.push(item);
      } else {
        const key = `__TEMP_${index}__`;

        tempMap[key] = item;
        result[result.length - 1] = result[result.length - 1] + key;
      }
    });

    return { tempMap, text: result.join("") };
  };

  const parseCSV = (csv) => {
    const data = csv.replace(/\r/g, "").replace(/\r?\n/g, "\n");
    const { text, tempMap } = escapeMultipleLineText(data);
    const [headers, ...rows] = text.split(/\n/).map((row) => row.split(","));

    return rows.map((row) =>
      row.reduce((result, value, index) => {
        const header = headers[index];

        if (!header) {
          return result;
        }

        [...value.matchAll(/__TEMP_\d+__/g)].forEach((item) => {
          const key = item[0];

          value = value.replace(key, tempMap[key]);
        });

        return {
          ...result,
          [header]: value,
        };
      }, {})
    );
  };

  const csv2json = (csv) =>
    csv.reduce((result, item) => {
      const { id, value } = item;

      if (!id) {
        return result;
      }

      return {
        ...result,
        [id]: value,
      };
    }, {});

  const params = PluginManager.parameters(PLUGIN_NAME);
  const list = JSON.parse(params.list).map(JSON.parse);
  const csvMap = new Map();

  list.forEach(async (item) => {
    if (!item.name || !item.path) {
      return;
    }

    const response = await fetch(item.path);
    const raw = await response.text();
    const csv = parseCSV(raw);
    const data = csv2json(csv);

    csvMap.set(item.name, data);
  });

  const _convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function (text) {
    let result = text;

    result = escapeBackSlash(result);

    while (result.match(REG_EXP)) {
      result = result.replace(REG_EXP, (_, id1, id2) => {
        if (!csvMap.has(id1)) {
          return `id:${id1}は存在しません。`;
        }

        const o = csvMap.get(id1);

        if (!o[id2]) {
          return `id:${id1}.${id2}は存在しません。`;
        }

        return o[id2];
      });

      result = escapeBackSlash(result);
    }

    return _convertEscapeCharacters.apply(this, [result]);
  };
})();
