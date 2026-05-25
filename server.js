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
    
    // Khôi phục lại link Shopee hoàn chỉnh từ tham số truyền vào
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // Tự động lấy tên miền hiện tại (dù chạy ở localhost hay Render)
    const host = req.get('host');
    const protocol = req.protocol;
    const fakeImageUrl = `${protocol}://${host}/public/bi-an.jpg`;

    // Trả về HTML chứa thẻ Open Graph cho Facebook Bot đọc, và Script điều hướng cho User
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
        
        <script>
            window.location.href = "${targetUrl}";
        </script>
    </head>
    <body>
        <p>Đang chuyển hướng đến Shopee...</p>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Hệ thống KVIL đang chạy trên port ${PORT}`);
});
