import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, phone, subject, content } = await request.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: '"BeeStyle" <anhvdph@gmail.com>',
            to: 'ductaph30986@fpt.edu.vn',
            subject: subject,
            html: `
               <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Phản hồi từ khách hàng</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f8f8f8;
                            margin: 0;
                            padding: 0;
                        }

                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 30px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                        }

                        h3 {
                            color: #F3911C;
                            margin-bottom: 20px;
                        }

                        p {
                            margin-bottom: 15px;
                        }

                        .footer {
                            margin-top: 30px;
                            font-size: 14px;
                            color: #888;
                        }

                        .footer p {
                            margin-bottom: 5px;
                        }

                        .logo {
                            display: block;
                            margin: 0 auto 20px;
                            max-width: 150px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="cid:logo" alt="BeeStyle Logo" class="logo">
                        <h3>Phản hồi từ khách hàng: ${name}</h3>
                        <p>Xin chào,</p>
                        <p>Chúng tôi đã nhận được phản hồi từ khách hàng <b>${name}</b> với nội dung như sau:</p>
                        <p style="padding-left: 20px; font-style: italic;">${content}</p>
                        <p>Vui lòng kiểm tra và xử lý phản hồi này.</p>

                        <div class="footer">
                            <p>Trân trọng,</p>
                            <p>Hệ thống BeeStyle</p>
                        </div>
                    </div>
                </body>
                </html>
 `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: './public/logo.png',
                    cid: 'logo'
                }
            ]
        };


        console.log(mailOptions);
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Đã gửi thành công Email' }, { status: 200 });
    } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi Email:', error);
        return NextResponse.json({ message: 'Đã có lỗi xảy ra khi gửi thắc mắc. Vui lòng thử lại sau.' }, { status: 500 });
    }
}
