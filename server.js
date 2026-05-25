const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('KVIL Redirect Server is running perfectly!');
});

app.get('/click/:shopeeId', (req, res) => {
    const shopeeId = req.params.shopeeId;
    const targetUrl = `https://s.shopee.vn/${shopeeId}`;
    
    const userAgent = req.headers['user-agent'] || '';
    const isFacebookBot = userAgent.toLowerCase().includes('facebookexternalhit') || 
                          userAgent.toLowerCase().includes('facebot');

    if (isFacebookBot) {
        // Luồng dành cho Bot Facebook quét (Giữ nguyên để hiện ảnh preview mờ)
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
        // NẾU LÀ NGƯỜI DÙNG THẬT: Trả về trang đệm có nút bấm cực đẹp
        res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đang chuyển hướng đến Shopee...</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    text-align: center;
                    max-width: 320px;
                    width: 90%;
                }
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #ee4d2d;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                h3 { color: #333; margin-bottom: 10px; font-size: 18px; }
                p { color: #666; font-size: 14px; margin-bottom: 25px; line-height: 1.4; }
                .btn {
                    display: block;
                    background-color: #ee4d2d;
                    color: white;
                    text-decoration: none;
                    padding: 14px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background 0.2s;
                    box-shadow: 0 4px 6px rgba(238, 77, 45, 0.2);
                }
                .btn:active { background-color: #d73c1f; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="loader"></div>
                <h3>Đang chuyển hướng</h3>
                <p>Nhấn vào nút bên dưới để mở sản phẩm trực tiếp trong ứng dụng Shopee nhằm nhận ưu đãi độc quyền.</p>
                <a href="${targetUrl}" class="btn">MỞ TRONG APP SHOPEE</a>
            </div>
            
            <script>
                // Vẫn cố gắng tự động kích hoạt chuyển hướng sau 1.5 giây nếu máy khách mượt
                setTimeout(function() {
                    window.location.href = "${targetUrl}";
                }, 10000);
            </script>
        </body>
        </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Hệ thống đang chạy trên port ${PORT}`);
});
