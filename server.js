const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1); // Thêm dòng này để Render nhận chuẩn HTTPS

// Cấu hình để phục vụ file ảnh tĩnh từ thư mục 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Tuyến đường xử lý link động
app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // Kiểm tra xem User-Agent có phải là Bot quét của Facebook hay không
    const userAgent = req.headers['user-agent'] || '';
    const isFacebookBot = userAgent.toLowerCase().includes('facebookexternalhit') || 
                          userAgent.toLowerCase().includes('facebot');

    if (isFacebookBot) {
        // Nếu là Bot Facebook, trả về HTML chứa thẻ Open Graph để hiển thị Preview ảnh mờ
        const host = req.get('host');
        const protocol = req.protocol;
        const fakeImageUrl = `${protocol}://${host}/public/bi-an.jpg`;

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
        // Nếu là người dùng thật click vào, thực hiện HTTP 302 Redirect trực tiếp từ Server
        res.redirect(302, targetUrl);
    }
});

app.listen(PORT, () => {
    console.log(`Hệ thống KVIL đang chạy trên port ${PORT}`);
});
