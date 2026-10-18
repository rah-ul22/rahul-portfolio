"""
generate_resume.py
Generates a clean, professional, standards-compliant PDF resume for Rahul M.
Uses pure Python with standard library only (no external dependencies).
"""

import sys

def create_resume_pdf(filename="resume.pdf"):
    # Stream content commands for PDF
    stream_lines = []
    
    # Coordinates in points (1/72 inch). Letter is 612 x 792 pt.
    # Margins: Left = 45, Right = 567 (width = 522), Top = 747, Bottom = 45
    
    # Helper functions
    def esc(text):
        return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
    
    def set_font(font_id, size):
        stream_lines.append(f"/{font_id} {size} Tf")
        
    def text(x, y, s, font="F1", size=10, r=0.1, g=0.15, b=0.2):
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        set_font(font, size)
        stream_lines.append(f"BT {x:.2f} {y:.2f} Td ({esc(s)}) Tj ET")
        
    def line(x1, y1, x2, y2, r=0.75, g=0.8, b=0.85, width=0.8):
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        stream_lines.append(f"{width:.2f} w")
        stream_lines.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def rect(x, y, w, h, r=0.96, g=0.97, b=0.99):
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        stream_lines.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")

    curr_y = 754
    left_x = 42
    right_x = 570
    content_width = right_x - left_x

    # Header: Name
    text(left_x, curr_y, "RAHUL M", font="F2", size=20, r=0.08, g=0.12, b=0.22)
    curr_y -= 14
    text(left_x, curr_y, "IT & TECHNOLOGY PROFESSIONAL | DATA * AI/ML * SOFTWARE", font="F2", size=8.5, r=0.2, g=0.45, b=0.75)
    curr_y -= 12
    
    # Contact Row
    contact_str1 = "Portfolio: https://rahul1604-m.github.io   |   Email: rahulmurugan1812@gmail.com"
    contact_str2 = "LinkedIn: linkedin.com/in/rahulm1604   |   GitHub: github.com/rahul1604-m   |   Location: Tamil Nadu, India"
    text(left_x, curr_y, contact_str1, font="F1", size=8, r=0.15, g=0.35, b=0.6)
    curr_y -= 10
    text(left_x, curr_y, contact_str2, font="F1", size=8, r=0.3, g=0.35, b=0.42)
    curr_y -= 9
    line(left_x, curr_y, right_x, curr_y, r=0.8, g=0.85, b=0.9, width=0.8)
    curr_y -= 13

    # Section Header Helper
    def section_header(title):
        nonlocal curr_y
        rect(left_x, curr_y - 2, content_width, 13, r=0.94, g=0.96, b=0.98)
        text(left_x + 4, curr_y + 1, title.upper(), font="F2", size=9, r=0.08, g=0.25, b=0.55)
        curr_y -= 13

    # PROFESSIONAL SUMMARY
    section_header("Professional Summary")
    summary_lines = [
        "MCA postgraduate skilled in Python, SQL, Excel, and Power BI, with hands-on experience in data analysis,",
        "machine learning, and visualization. Adept at deriving insights from complex data, building predictive models,",
        "and delivering technology solutions, with strong problem-solving abilities and a willingness to learn and adapt."
    ]
    for s in summary_lines:
        text(left_x + 4, curr_y, s, font="F1", size=8, r=0.2, g=0.22, b=0.26)
        curr_y -= 9.5
    curr_y -= 3

    # EDUCATION
    section_header("Education")
    edu_data = [
        ("Master of Computer Applications (MCA)", "Sastra Deemed University, Thanjavur", "July 2024 - May 2026", "CGPA: 7.0"),
        ("Bachelor of Computer Applications (BCA)", "Hindustan College of Arts and Science, Coimbatore", "June 2021 - April 2024", "CGPA: 7.4"),
        ("12th Standard (CBSE)", "Kendriya Vidyalaya, Madurai", "April 2021", "69%"),
        ("10th Standard (CBSE)", "Kendriya Vidyalaya, Madurai", "April 2019", "58%")
    ]
    for degree, school, years, grade in edu_data:
        text(left_x + 4, curr_y, degree, font="F2", size=8, r=0.1, g=0.15, b=0.25)
        text(right_x - 110, curr_y, years, font="F1", size=7.5, r=0.4, g=0.45, b=0.5)
        curr_y -= 9
        text(left_x + 4, curr_y, school, font="F1", size=7.5, r=0.3, g=0.35, b=0.4)
        text(right_x - 70, curr_y, grade, font="F2", size=7.5, r=0.15, g=0.35, b=0.6)
        curr_y -= 9.5
    curr_y -= 3

    # TECHNICAL SKILLS
    section_header("Technical Skills")
    skills_data = [
        ("Programming & Databases:", "Python, SQL, MySQL, Oracle SQL"),
        ("Analytics & BI Tools:", "Microsoft Excel (Advanced), Power BI, Google Sheets, SAS (Learning)"),
        ("Data Analysis:", "Data Cleaning, Preprocessing, EDA, Statistical Analysis, Forecasting, Customer Segmentation, Time Series, Predictive Analytics"),
        ("Machine Learning & Libraries:", "Pandas, NumPy, Scikit-learn, TensorFlow, Keras, Matplotlib, Seaborn, Random Forest, Decision Trees, KNN, LSTM, Classification, Regression"),
        ("Visualization & Platforms:", "Dashboard Development, Data Visualization, Pivot Tables, VLOOKUP, XLOOKUP, Jupyter Notebook, VS Code, GitHub, Streamlit, APIs"),
        ("Professional Skills:", "Requirement Analysis, Problem Solving, Critical Thinking, Attention to Detail, Time Management, Client Support, Stakeholder Communication, Business Process Understanding"),
        ("Languages:", "English, Tamil, Hindi")
    ]
    for cat, items in skills_data:
        text(left_x + 4, curr_y, cat, font="F2", size=7.5, r=0.12, g=0.18, b=0.28)
        text(left_x + 125, curr_y, items, font="F1", size=7.5, r=0.22, g=0.25, b=0.3)
        curr_y -= 9.5
    curr_y -= 3

    # PROJECTS
    section_header("Projects")
    
    projects = [
        {
            "title": "Sales Data Analysis Dashboard",
            "tag": "Data & Analytics | Microsoft Excel, Power BI",
            "bullets": [
                "Built an interactive dashboard to monitor sales, profit, and units sold, enabling stakeholder reporting and supporting data-driven client decision-making.",
                "Created visualizations (bar, line, pie charts) to analyze sales trends, regional performance, and product insights.",
                "Implemented dynamic filters for region, product, and salesperson to enable real-time, data-driven decision."
            ]
        },
        {
            "title": "Predicting Length of Survival for Bone Cancer Patients",
            "tag": "AI / Machine Learning | Python, Scikit-learn, KNN, Random Forest",
            "bullets": [
                "Expanded machine learning models using KNN and Random Forest to predict bone cancer risk from patient health and medical test data, achieving approximately 89% classification accuracy.",
                "Performed data preprocessing, feature selection, and model testing; evaluated accuracy metrics to validate deployment readiness.",
                "Designed the system to support early clinical decision-making through predictive insights (academic ML research project)."
            ]
        },
        {
            "title": "Earthquake Prediction Using Hybrid Approach",
            "tag": "AI / Machine Learning | Python, Random Forest, LSTM, USGS Data",
            "bullets": [
                "Built a hybrid forecasting model using Random Forest and LSTM with USGS earthquake data.",
                "Applied sliding-window techniques for seismic feature extraction and time-series forecasting.",
                "Improved model performance through preprocessing, normalization, and cross-validation."
            ]
        },
        {
            "title": "End-to-End Hybrid AI Framework for Earthquake Forecasting",
            "tag": "AI / Machine Learning | Python, LSTM, Random Forest, Interactive Web App",
            "bullets": [
                "Improved an end-to-end forecasting system to estimate the probability of major earthquakes (M >= 6.0) and maximum expected magnitude, achieving approximately 98% risk classification accuracy.",
                "Implemented magnitude-based resampling and sliding-window feature engineering for time-series modeling.",
                "Delivered an end-to-end solution deployment enabling real-time seismic risk analysis, interactive hazard visualization, and ongoing system monitoring.",
                "Designed system architecture for a hybrid forecasting model, selecting Random Forest and LSTM components and specifying data pipeline requirements using USGS earthquake data."
            ]
        }
    ]

    for p in projects:
        text(left_x + 4, curr_y, p["title"], font="F2", size=8, r=0.1, g=0.15, b=0.25)
        text(left_x + 230, curr_y, f"({p['tag']})", font="F1", size=7, r=0.4, g=0.45, b=0.55)
        curr_y -= 8.5
        for b_text in p["bullets"]:
            text(left_x + 8, curr_y, "-", font="F2", size=7.5, r=0.2, g=0.4, b=0.7)
            if len(b_text) > 115:
                split_idx = b_text[:115].rfind(" ")
                text(left_x + 16, curr_y, b_text[:split_idx], font="F1", size=7.2, r=0.25, g=0.28, b=0.32)
                curr_y -= 8
                text(left_x + 16, curr_y, b_text[split_idx+1:], font="F1", size=7.2, r=0.25, g=0.28, b=0.32)
            else:
                text(left_x + 16, curr_y, b_text, font="F1", size=7.2, r=0.25, g=0.28, b=0.32)
            curr_y -= 8
        curr_y -= 1.5

    # CERTIFICATIONS
    section_header("Certifications")
    certs_data = [
        ("Introduction to Internet of Things", "NPTEL * IIT Kharagpur (Elite + Silver, Score: 81%)", "Jan-Apr 2026"),
        ("Cloud Computing", "NPTEL * IIT Kharagpur (Elite, Score: 73%)", "Jan-Apr 2026"),
        ("Cybersecurity Analyst Job Simulation", "Tata * Forage (IAM & Enterprise Security)", "Dec 2024"),
        ("Programming the Finch Robot in Java Workshop", "Oracle Academy (Java & Robotics)", "Apr 2024"),
        ("Preparing Data for Analysis with Microsoft Excel", "Coursera (Data Preparation & Modeling)", "Sep 2025")
    ]
    for c_title, c_issuer, c_date in certs_data:
        text(left_x + 4, curr_y, c_title, font="F2", size=7.8, r=0.1, g=0.15, b=0.25)
        text(left_x + 215, curr_y, f"- {c_issuer}", font="F1", size=7.2, r=0.3, g=0.35, b=0.4)
        text(right_x - 65, curr_y, c_date, font="F2", size=7.5, r=0.15, g=0.35, b=0.6)
        curr_y -= 8.5
    curr_y -= 4

    # Build PDF binary
    content_stream = "\n".join(stream_lines)
    content_bytes = content_stream.encode('latin1')
    stream_len = len(content_bytes)

    objects = []
    
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    objects.append(
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> "
        b"/Contents 6 0 R >>"
    )
    # 4: F1 - Helvetica
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    # 5: F2 - Helvetica-Bold
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    # 6: Stream
    stream_obj = (
        f"<< /Length {stream_len} >>\nstream\n".encode('latin1') +
        content_bytes +
        b"\nendstream"
    )
    objects.append(stream_obj)

    pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for i, obj in enumerate(objects, 1):
        offsets.append(len(pdf))
        pdf.extend(f"{i} 0 obj\n".encode('latin1'))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_pos = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode('latin1'))
    for off in offsets:
        pdf.extend(f"{off:010d} 00000 n \n".encode('latin1'))
    pdf.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode('latin1'))

    with open(filename, "wb") as f:
        f.write(pdf)
    print(f"Successfully created {filename} ({len(pdf)} bytes)")

if __name__ == "__main__":
    create_resume_pdf("resume.pdf")
