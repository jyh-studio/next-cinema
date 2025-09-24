#!/usr/bin/env python3
import os
from pathlib import Path

# Define all the worksheets that need to be created
worksheets = {
    'resume': [
        'film-tv-credits',
        'special-skills', 
        'professional-references'
    ],
    'headshots': [
        'makeup-grooming',
        'photographer-research',
        'shot-list-planning',
        'budget-planning',
        'post-session-evaluation'
    ],
    'demo-reel': [
        'scene-selection',
        'reel-structure',
        'technical-requirements',
        'editing-timeline',
        'music-sound',
        'distribution-strategy'
    ],
    'profile': [
        'bio-writing',
        'social-media-audit',
        'professional-photo',
        'skills-assessment',
        'goal-setting',
        'progress-tracking'
    ]
}

# PDF template
pdf_template = """%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length {content_length}
>>
stream
BT
/F1 24 Tf
50 700 Td
({title}) Tj
0 -50 Td
/F1 12 Tf
(This is a placeholder worksheet for {description}.) Tj
0 -30 Td
(Complete your {category} details here.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
623
%%EOF"""

def create_pdf(category, file_id, title, description):
    # Create directory if it doesn't exist
    dir_path = Path(f'worksheets/{category}')
    dir_path.mkdir(parents=True, exist_ok=True)
    
    # Create content
    content = f"BT\n/F1 24 Tf\n50 700 Td\n({title}) Tj\n0 -50 Td\n/F1 12 Tf\n(This is a placeholder worksheet for {description}.) Tj\n0 -30 Td\n(Complete your {category} details here.) Tj\nET"
    content_length = len(content)
    
    # Generate PDF content
    pdf_content = pdf_template.format(
        title=title,
        description=description,
        category=category,
        content_length=content_length
    )
    
    # Write file
    file_path = dir_path / f'{file_id}.pdf'
    with open(file_path, 'w') as f:
        f.write(pdf_content)
    
    print(f"Created: {file_path}")

# Create all missing worksheets
for category, file_ids in worksheets.items():
    for file_id in file_ids:
        title = file_id.replace('-', ' ').title() + " Worksheet"
        description = file_id.replace('-', ' ')
        create_pdf(category, file_id, title, description)

print("All worksheet PDFs created successfully!")