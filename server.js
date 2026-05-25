const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

// Tuyến đường xử lý link chuyển hướng gốc
app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    const host = req.get('host');
    const protocol = req.protocol;
    const fakeImageUrl = `${protocol}://${host}/public/bi-an.jpg`;

    // TRẢ VỀ META CHO BOT ĐỌC VÀ LẬP TỨC ĐIỀU HƯỚNG BẰNG CẢ HTML LẪN JAVASCRIPT
    res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Ko hiểu luôn</title>
        
        <meta property="og:title" content="Ko hiểu luôn" />
        <meta property="og:description" content="O.O" />
        <meta property="og:image" content="${fakeImageUrl}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />

        <meta http-equiv="refresh" content="0;url=${targetUrl}">
    </head>
    <body>
        <script>
            // Dự phòng thêm tầng Javascript để chắc chắn vào thẳng App Shopee không trễ 1 mili giây
            window.location.href = "${targetUrl}";
        </script>
    </body>
    </html>
    `);
});

// Route trang chủ chống lỗi trống trang
app.get('/', (req, res) => {
    res.send('KVIL Redirect Server Online!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy mượt mà trên port ${PORT}`);
});
