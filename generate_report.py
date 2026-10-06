import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

def set_font(run, font_name, size, bold=False, italic=False):
    run.font.name = font_name
    run._element.rPr.rFonts.set(qn('w:eastAsia'), font_name)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic

def add_heading(doc, text, level=1, font_name='Times New Roman', size=14, align=WD_ALIGN_PARAGRAPH.CENTER):
    p = doc.add_paragraph()
    p.alignment = align
    run = p.add_run(text)
    set_font(run, font_name, size, bold=True)
    return p

def add_paragraph(doc, text, font_name='Times New Roman', size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    p.alignment = align
    run = p.add_run(text)
    set_font(run, font_name, size)
    return p

def main():
    doc = Document()
    
    # Title Page
    add_heading(doc, 'SMART EXAMINATION SEATING ARRANGEMENT\n', size=18)
    add_paragraph(doc, 'A PROJECT REPORT\n', align=WD_ALIGN_PARAGRAPH.CENTER)
    add_paragraph(doc, 'Submitted by\n', align=WD_ALIGN_PARAGRAPH.CENTER)
    add_heading(doc, 'PRISK (24104050)\n', size=14)
    add_paragraph(doc, 'In partial fulfillment for the award of the degree\nof\nBACHELOR OF ENGINEERING\nin\nCOMPUTER SCIENCE AND ENGINEERING\n', align=WD_ALIGN_PARAGRAPH.CENTER)
    add_heading(doc, 'NATIONAL ENGINEERING COLLEGE\n', size=14)
    add_paragraph(doc, '(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R.NAGAR, KOVILPATTI - 628503\nOCTOBER - 2026', align=WD_ALIGN_PARAGRAPH.CENTER)
    
    doc.add_page_break()

    # Bonafide Certificate
    add_heading(doc, 'NATIONAL ENGINEERING COLLEGE')
    add_paragraph(doc, '(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R.NAGAR, KOVILPATTI - 628503\n', align=WD_ALIGN_PARAGRAPH.CENTER)
    add_heading(doc, 'BONAFIDE CERTIFICATE\n')
    
    add_paragraph(doc, 'This is to certify that this project report, "Smart Examination Seating Arrangement", is the bonafide work of PRISK (24104050) who carried out the project work under my supervision.\n\n')
    
    p = doc.add_paragraph()
    run = p.add_run('                                                                                             Course Instructor/Guide\n')
    set_font(run, 'Times New Roman', 12, bold=True)
    
    add_paragraph(doc, 'Submitted to the Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ____________\n\n\n')
    
    p = doc.add_paragraph()
    run1 = p.add_run('Internal Examiner')
    set_font(run1, 'Times New Roman', 12, bold=True)
    run2 = p.add_run('                                                                                 Co Examiner')
    set_font(run2, 'Times New Roman', 12, bold=True)

    doc.add_page_break()

    # Table of Contents
    add_heading(doc, 'TABLE OF CONTENTS')
    toc_text = """
1. INTRODUCTION....................................................................... 4
2. OBJECTIVES............................................................................ 5
3. DESCRIPTION........................................................................... 6
4. CLASS DIAGRAM......................................................................... 7
5. TABLE STRUCTURES...................................................................... 8
6. ER DIAGRAM............................................................................ 10
7. TECH STACK............................................................................ 11
8. MODULES............................................................................... 12
9. CONCLUSION............................................................................ 20
"""
    add_paragraph(doc, toc_text, align=WD_ALIGN_PARAGRAPH.LEFT)

    doc.add_page_break()

    # Chapter 1
    add_heading(doc, 'CHAPTER 1')
    add_heading(doc, 'INTRODUCTION')
    add_paragraph(doc, "In modern educational institutions, efficient management of examinations and seating arrangements plays a vital role in ensuring smooth operations during exam periods. Handling student lists, allocating rooms, managing capacities, and preventing seating conflicts through manual or spreadsheet-based methods is time-consuming, error-prone, and lacks real-time coordination. There is an urgent need for a reliable, digital solution that brings all these operations under one unified platform.")
    add_paragraph(doc, "The Smart Examination Seating Arrangement (SESA) system is a comprehensive, full-stack web application designed to digitize and automate the complete lifecycle of examination planning. The system was developed to meet the real-world operational requirements of educational institutions.")
    add_paragraph(doc, "The application is organized into three major functional domains: Master Data Management (Departments, Halls, Subjects), Examination Management (Scheduling, Student Registration, Staff Allocation), and Seating Arrangement Generation (Automated conflict-free seat allocation based on hall capacity).")
    
    doc.add_page_break()
    
    # Chapter 2
    add_heading(doc, 'CHAPTER 2')
    add_heading(doc, 'OBJECTIVES')
    objectives = [
        "To Digitize Examination Operations: Replace manual seating plans with a digital algorithm to improve accuracy and efficiency.",
        "To Centralize Master Data: Maintain consistent master data for students, departments, halls, and subjects.",
        "To Automate Seating Allocation: Streamline the seating generation process ensuring no conflicts and optimal use of hall capacity.",
        "To Track Exam Schedules: Monitor and record all upcoming and past examinations.",
        "To Enforce Role-Based Access: Secure the application using JWT authentication with specific roles for Admin, Principal, HOD, Staff, and Student.",
        "To Provide Dynamic Reporting: Generate detailed printable seating arrangement slips and hall allocation reports.",
        "To Ensure System Reliability: Implement security measures such as Helmet, CORS, rate limiting, and payload restrictions.",
        "To Deploy a Scalable Architecture: Use a modular REST API architecture with React frontend and Express backend."
    ]
    for obj in objectives:
        p = doc.add_paragraph(style='List Bullet')
        run = p.add_run(obj)
        set_font(run, 'Times New Roman', 12)

    doc.add_page_break()

    # Chapter 3
    add_heading(doc, 'CHAPTER 3')
    add_heading(doc, 'DESCRIPTION')
    add_paragraph(doc, "The Smart Examination Seating Arrangement (SESA) is a full-stack web application developed to manage and automate exam operations. The system consists of five major functional areas:\n\n1. Master Data Management\nThis module maintains centralized master records, including departments, halls, and students. These records ensure consistency across all exam scheduling.\n\n2. Examination Management\nThis module manages day-to-day exam schedules, including adding exams, registering students for exams, and defining time slots.\n\n3. Seating Arrangement Logic\nAn automated algorithm allocates students to halls without conflicts, maximizing capacity utilization and ensuring proper spacing between students from the same department if required.\n\n4. Reports and Export\nGenerates downloadable seat slips for students and hall attendance sheets for invigilators.\n\n5. Security and Access Control\nThe system uses bcrypt for password hashing and JSON Web Token (JWT) authentication to secure user access.")

    doc.add_page_break()

    # Add remaining chapters as text (Table Structures, Tech Stack, Modules, Conclusion)
    add_heading(doc, 'CHAPTER 7')
    add_heading(doc, 'TECH STACK')
    add_paragraph(doc, "Frontend: React.js (Vite), Tailwind CSS\nState Management: Context API / Hooks\nBackend: Node.js + Express.js\nDatabase: MySQL (via mysql2)\nAuthentication: JSON Web Tokens (JWT)\nSecurity: Helmet, CORS, bcrypt")
    
    doc.add_page_break()

    add_heading(doc, 'CHAPTER 8')
    add_heading(doc, 'MODULES')
    add_paragraph(doc, "8.1 USER AUTHENTICATION & ACCESS CONTROL\nProvides tokenized authentication and Role-Based Access Control (Admin, Principal, HOD, Staff, Student).")
    add_paragraph(doc, "8.2 MASTER DATA MANAGEMENT\nUnifies foundational reference datasets including Students, Halls, and Departments.")
    add_paragraph(doc, "8.3 EXAMINATION SCHEDULING\nOrchestrates the exam lifecycle, from creation to student registration.")
    add_paragraph(doc, "8.4 SEATING ALGORITHM\nAllocates physical seats based on hall capacity and exam registrations, avoiding overlaps.")

    doc.add_page_break()
    add_heading(doc, 'CHAPTER 9')
    add_heading(doc, 'CONCLUSION')
    add_paragraph(doc, "The Smart Examination Seating Arrangement (SESA) provides a complete digital solution for managing examinations and seating logistics. The system integrates master data, scheduling, and automated seating algorithms within a single secure application. By replacing manual records, it improves the accuracy and accessibility of operational information. Its modular structure makes the application easier to maintain and allows additional features to be introduced in the future. Overall, the SESA system successfully meets its objective of providing a secure, organized, and efficient platform for managing examination activities.")

    doc.save('FINAL_SMART_EXAMINATION_SEATING_ARRANGEMENT_REPORT.docx')
    print("DOCX successfully generated.")

if __name__ == '__main__':
    main()
