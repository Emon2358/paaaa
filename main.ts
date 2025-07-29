import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Torrent Video Stream</title>
  <script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"></script>
</head>
<body>
  <h1>トレントファイルの動画ストリーミング</h1>
  <video id="video" controls style="max-width: 100%; height: auto;"></video>
  <script>
    (async () => {
      const client = new WebTorrent();
      const torrentUrl = "https://sukebei.nyaa.si/download/4350323.torrent";

      // トレントファイルをフェッチ
      const response = await fetch(torrentUrl);
      const arrayBuffer = await response.arrayBuffer();

      // トレントをクライアントに追加
      client.add(new Uint8Array(arrayBuffer), (torrent) => {
        // 動画ファイルを探して最初のものを再生
        const file = torrent.files.find(file => /\.(mp4|mkv|webm)$/i.test(file.name));
        if (!file) {
          document.body.insertAdjacentHTML('beforeend', '<p>動画ファイルが見つかりませんでした。</p>');
          return;
        }

        // <video>要素にストリームを送る
        file.renderTo(document.getElementById('video')); 
      });
    })();
  </script>
</body>
</html>`;

console.log("Server running on http://localhost:8000");
serve((_req) => new Response(html, { headers: { "content-type": "text/html; charset=UTF-8" } }), { port: 8000 });
