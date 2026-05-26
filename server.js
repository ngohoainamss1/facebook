const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Cơ chế chuyển hướng thẳng, tốc độ tối đa cho mọi lượt truy cập
app.get('/share/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    // Chống cache để đảm bảo link luôn cập nhật mới nhất từ server
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    // Bắn thẳng HTTP 302 sang Shopee (Không tải HTML, không chạy JS, không tốn thời gian xử lý)
    return res.redirect(302, targetUrl);
});

app.get('/', (req, res) => {
    res.send('KVIL Ultra Fast Redirect Server Online!');
});

app.listen(PORT, () => {
    console.log(`Server siêu tốc đang chạy trên port ${PORT}`);
});
