import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Deno Deploy ではトップレベルで serve を呼び出します
serve(async (req: Request) => {
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
      try {
        const client = new WebTorrent();
        const torrentUrl = "https://sukebei.nyaa.si/download/4350323.torrent";

        const response = await fetch(torrentUrl);
        if (!response.ok) throw new Error(`Failed to fetch torrent: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        client.add(new Uint8Array(arrayBuffer), (torrent) => {
          const file = torrent.files.find(file => /\.(mp4|mkv|webm)$/i.test(file.name));
          if (!file) {
            document.body.insertAdjacentHTML('beforeend', '<p>動画ファイルが見つかりませんでした。</p>');
            return;
          }
          file.renderTo(document.getElementById('video'));
        });
      } catch (e) {
        console.error(e);
        document.body.insertAdjacentHTML('beforeend', `<p>エラー: ${e.message}</p>`);
      }
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
});
