const fs = require("fs");
const marked = require("marked");

marked.setOptions({
  headerIds: false,
});

// ブログコンテンツのファイルパス
const contentPath = "./content/blog";

// content直下にあるファイルを配列で取得
const contentArray = fs.readdirSync(contentPath);

const summary = { content: [] };

for (const i of contentArray) {
  // ファイルの読み込み
  fs.readFile(`./content/blog/${i}/index.md`, "utf8", (err, data) => {
    if (err) throw err;

    // コンテンツのメタ情報が入った配列
    const metaDataArray = data
      .split("---")[1]
      .split(/\r\n|\r|\n/)
      .filter((x) => {
        return x !== "";
      });

    // メタ情報、本文を格納する配列
    const contentObj = {};

    // コンテンツのメタ情報をオブジェクトに格納
    for (const j of metaDataArray) {
      contentObj[j.split(":")[0]] = j.split(":")[1].replace(" ", "");
    }

    // 記事の文章をオブジェクトに追加
    const postText = marked(data.split("---")[2].replace("\n", ""));
    contentObj.post = postText;

    contentObj.path = i;

    //
    summary.content.push(contentObj);

    // JSON形式に変換
    const contentJson = JSON.stringify(summary, null, 2);

    // mdファイルをもとにjsonファイルを作成
    fs.writeFileSync(`./content/json/content.json`, contentJson);
  });
}
