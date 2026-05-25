const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// KHỞI TẠO BỘ ĐẾM: Lưu trữ lượt click vào RAM dưới dạng { shopeeId: số_lượt_click }
let clickCounter = {};

app.use('/public', express.static(path.join(__dirname, 'public')));

// Tuyến đường xử lý link chuyển hướng gốc
app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // TỰ ĐỘNG ĐẾM SỐ LƯỢT TRUY CẬP
    if (!clickCounter[shopeeId]) {
        clickCounter[shopeeId] = 0; // Nếu ID này mới tinh thì đặt bằng 0
    }
    clickCounter[shopeeId] += 1; // Cộng thêm 1 lượt click

    // In trực tiếp ra Terminal/Log của Render để bạn tiện theo dõi realtime
    console.log(`[LOG] Sản phẩm ${shopeeId} vừa có thêm 1 click. Tổng: ${clickCounter[shopeeId]}`);
    
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

// TUYẾN ĐƯỜNG XEM THỐNG KÊ (Chỉ có bạn biết)
app.get('/kvil-stats', (req, res) => {
    res.json({
        status: "success",
        description: "Bảng thống kê lượt click chuyển hướng Shopee",
        total_tracked: Object.keys(clickCounter).length,
        analytics: clickCounter
    });
});

// Route trang chủ chống lỗi trống trang
app.get('/', (req, res) => {
    res.send('KVIL Redirect Server Online!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy mượt mà trên port ${PORT}`);
});
