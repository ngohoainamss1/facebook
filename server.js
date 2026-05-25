const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let clickCounter = {};

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // 1. CHỐNG CACHE CHO ĐIỆN THOẠI (Bắt buộc phải ping về server mỗi khi click)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    // 2. PHÂN LOẠI BOT VÀ NGƯỜI THẬT
    const userAgent = req.headers['user-agent'] || '';
    const isBot = userAgent.toLowerCase().includes('bot') || 
                  userAgent.toLowerCase().includes('facebookexternalhit') ||
                  userAgent.toLowerCase().includes('crawler');

    // 3. CHỈ ĐẾM LƯỢT CLICK CỦA NGƯỜI THẬT
    if (!isBot) {
        if (!clickCounter[shopeeId]) {
            clickCounter[shopeeId] = 0;
        }
        clickCounter[shopeeId] += 1;
        // In log ra để bạn dễ theo dõi trên Render
        console.log(`[USER CLICK] Khách vừa click vào mã ${shopeeId} | Tổng: ${clickCounter[shopeeId]}`);
    } else {
        console.log(`[BOT QUÉT] Bot Facebook đang quét link ${shopeeId} (Không đếm)`);
    }
    
    const host = req.get('host');
    const protocol = req.protocol;
    const fakeImageUrl = `${protocol}://${host}/public/bi-an.jpg`;

    // TRẢ VỀ GIAO DIỆN CHUYỂN HƯỚNG
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

// Route thống kê (cũng gắn chống cache để lúc bạn F5 xem số nó cập nhật ngay)
app.get('/kvil-stats', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
        status: "success",
        description: "Bảng thống kê click NGƯỜI THẬT (Đã lọc Bot)",
        total_tracked: Object.keys(clickCounter).length,
        analytics: clickCounter
    });
});

app.get('/', (req, res) => {
    res.send('KVIL Redirect Server Online!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy mượt mà trên port ${PORT}`);
});
