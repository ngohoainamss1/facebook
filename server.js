const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // Đảm bảo nhận diện chuẩn HTTPS trên Render

// Phục vụ file ảnh tĩnh từ thư mục 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Tuyến đường xử lý link gốc cho đỡ trống trang
app.get('/', (req, res) => {
    res.send('KVIL Redirect Server is running perfectly!');
});

// Tuyến đường xử lý link động để phân phối Shopee
app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // Đọc thông tin User-Agent để nhận biết nguồn truy cập
    const userAgent = req.headers['user-agent'] || '';
    const isFacebookBot = userAgent.toLowerCase().includes('facebookexternalhit') || 
                          userAgent.toLowerCase().includes('facebot');

    if (isFacebookBot) {
        // 1. NẾU LÀ BOT FACEBOOK: Trả về cấu trúc HTML/Open Graph để hiển thị Preview ảnh
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
        // 2. NẾU LÀ NGƯỜI DÙNG THẬT: Ép trình duyệt chuyển hướng HTTP 302 ngay lập tức
        res.redirect(302, targetUrl);
    }
});

app.listen(PORT, () => {
    console.log(`Hệ thống đang chạy trên port ${PORT}`);
});
