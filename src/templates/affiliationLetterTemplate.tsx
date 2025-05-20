export default function AffiliationLetterTemplate(
    college_name: string,
    university_name: string,
    date: string,
    affiliation_request_reason: string
) {
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
                text-align: left;
            }

            .header {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 30px;
                color: #004080;
                text-align: center;
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
                The Principal <br>
                ${college_name} <br>
                ${university_name}
            </div>

            <div class="content">
                <p class="date">Date: ${date}</p>

                <p>
                    To,<br>
                    The Secretary, <br>
                    University Grants Commission (UGC) <br>
                    Bahadur Shah Zafar Marg, <br>
                    New Delhi – 110002
                </p>

                <p>
                    Subject: Request for Affiliation under Section 2(f) of the UGC Act, 1956.
                </p>

                <p>
                    Respected Sir/Madam,
                </p>

                <p>
                    I, on behalf of the management of <span class="highlight">${college_name}</span>, am writing to request affiliation with the University Grants Commission under Section 2(f) of the UGC Act, 1956. The college is situated in <span class="highlight">${university_name}</span> and has been providing quality education for several years.
                </p>

                <p>
                    Our college is committed to offering a range of academic programs, and we are eager to be formally affiliated with the UGC to enhance the quality and recognition of our degrees. The affiliation is crucial for ensuring the academic credibility of our institution and providing our students with nationally recognized qualifications.
                </p>

                <p>
                    The reason for our request is <span class="highlight">${affiliation_request_reason}</span>. We believe that affiliation with the UGC will help our institution take its rightful place among the leading colleges/universities of the region and help us meet the evolving demands of the educational sector.
                </p>

                <p>
                    We would be grateful if you could consider our request for affiliation and guide us through the necessary steps for formal recognition.
                </p>

                <p>
                    Thank you for your time and consideration. We look forward to a positive response from your esteemed office.
                </p>
            </div>

            <div class="footer">
                <p class="footer-signature">
                    Yours faithfully, <br>
                    (Principal Name) <br>
                    Principal, <br>
                    ${college_name}
                </p>
                <div class="contact-info">
                    Copy to: <br>
                    1. The Registrar, ${university_name}, New Delhi. <br>
                    2. The Director, Higher Education, Department of Education, Shastri Bhawan, New Delhi-110001. <br>
                    3. The Local MLA, Local Government Office, New Delhi. <br>
                    4. The Vice Chancellor, ${university_name}.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
