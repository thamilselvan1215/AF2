import os, glob, re

files = glob.glob('*.html')

header_pattern = re.compile(r'<!-- MVIT COLLEGE HEADER -->.*?<!-- NAV -->', re.DOTALL)

# Refined Header Template
new_header = """<!-- MVIT COLLEGE HEADER -->
  <div class="college-header no-print">
    <img src="new_college_logo.png" alt="MVIT Logo" class="clg-logo" />
    <div class="college-header-text">
        <div class="college-header-name">
            <span class="clg-abbr">MANAKULA VINAYAGAR</span><br>INSTITUTE OF TECHNOLOGY
        </div>
        <div class="college-header-divider"></div>
        <div class="college-header-sub">Affiliated to Pondicherry University &nbsp;|&nbsp; Approved by AICTE, New Delhi</div>
        <div class="college-header-sub">Accredited by NBA, New Delhi &amp; NAAC with 'A' Grade</div>
        <div class="college-header-tag">An Autonomous Institution &nbsp;&bull;&nbsp; Kaliteerthalkuppam, Puducherry – 605 107</div>
    </div>
  </div>

  <!-- NAV -->"""

count = 0
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if header_pattern.search(content):
        new_content = header_pattern.sub(new_header, content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1

print(f"Updated header in {count} files.")
