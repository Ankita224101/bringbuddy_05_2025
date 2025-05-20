export default function UgcNotificationTemplate(name: string, university_name: string, date: string) {
    return `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

            body {
                font-family: 'Roboto', sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
            }

            .container {
                max-width: 800px;
                background-color: #ffffff;
                margin: 0 auto;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .header {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 30px;
                color: #004080;
            }

            .content {
                font-size: 16px;
                line-height: 1.8;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
                color: #004080;
            }

            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #004080;
            }

            .footer-signature {
                font-weight: bold;
                color: #004080;
                margin-top: 20px;
            }

            .date {
                font-style: italic;
                color: #333;
                margin-top: 20px;
            }

        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                UNIVERSITY GRANTS COMMISSION <br>
                BAHADURSHAH ZAFAR MARG <br>
                NEW DELHI, 110 002
            </div>

            <div class="content">
                <p class="date">Date: ${date}</p>
                <p>
                    The name of <span class="highlight">${university_name}</span>, which is already included in the list of State Universities maintained by the University Grants Commission under Section 2(f) of the UGC Act, 1956, has been changed to The <span class="highlight">${university_name}</span>, Jalandhar-Kapurthala Highway, Near Pushpa Gujral Science City, Kapurthala-1446-1, Punjab, vide Amendment Act, (Act No. 28 of 2014) passed by the State Legislature of Punjab and Notification No. 29-Leg/2014 dated 1 October, 2014 issued by the Government of Punjab.
                </p>
                <p>
                    This change is duly notified, and the University Grants Commission has updated the details accordingly.
                </p>
            </div>

            <div class="footer">
                <p class="footer-signature">
                    Yours faithfully, <br>
                    (Nirmal Kaur) <br>
                    Under Secretary (CPP-1)
                </p>

                <div class="contact-info">
                    Copy to: <br>
                    1. The Registrar, The ${university_name}, Jalandhar-Kapurthala Highway, Near Pushpa Gujral Science City, Kapurthala-1446-1, Punjab. <br>
                    2. The Secretary, Government of India, Ministry of Human Resource Development, Department of School & Hr. Education, Shastri Bhawan, New Delhi-110001. <br>
                    3. The Special Secretary (Higher Education), Govt. of Punjab, Room No. 408, 4th Floor, Mini Secretariat, Chandigarh-160009 (Punjab). <br>
                    4. P.O Website, UGC, New Delhi. <br>
                    5. Guard File.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
