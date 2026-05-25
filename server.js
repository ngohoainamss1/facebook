const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    const host = req.get('host');
    const protocol = req.protocol;
    const fakeImageUrl = `${protocol}://${host}/public/bi-an.jpg`;

    // Phân loại: Ai đang truy cập link này?
    const userAgent = req.headers['user-agent'] || '';
    const isBot = userAgent.toLowerCase().includes('facebookexternalhit') || 
                  userAgent.toLowerCase().includes('facebot');

    if (isBot) {
        // LUỒNG 1 - DÀNH CHO BOT FACEBOOK: Chỉ cho đọc Meta, KHÔNG CÓ LỆNH CHUYỂN HƯỚNG
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
        </head>
        <body></body>
        </html>
        `);
    } else {
        // LUỒNG 2 - DÀNH CHO NGƯỜI THẬT: Không cần meta ảnh, ép chuyển hướng ngay lập tức
        res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="refresh" content="0;url=${targetUrl}">
        </head>
        <body>
            <script>
                window.location.href = "${targetUrl}";
            </script>
        </body>
        </html>
        `);
    }
});

// Route trang chủ
app.get('/', (req, res) => {
    res.send('KVIL Redirect Server Online!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
