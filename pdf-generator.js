/* ============================================================
   MVIT ADMISSION PORTAL 2026 — pdf-generator.js
   Generates A4 PDF matching the reference forms (ug.pdf/pg.pdf/le.pdf)
   Libraries: jsPDF (CDN) + html2canvas (CDN)
   ============================================================ */

/* ── Helper: get field value by id ── */
function fv(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    const val = el.value ? el.value.trim() : '';
    return val || '';
}

/* ── Helper: format month input (YYYY-MM → Mon YYYY) ── */
function formatMonth(raw) {
    if (!raw) return '';
    const [y, m] = raw.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(m) - 1] + ' ' + y;
}

/* ── Helper: format date (YYYY-MM-DD → DD/MM/YYYY) ── */
function formatDate(raw) {
    if (!raw) return '';
    const [y, m, d] = raw.split('-');
    return `${d}/${m}/${y}`;
}

/* ── Convert image URL to base64 ── */
function getBase64Image(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve('');
        img.src = url;
    });
}

/* ================================================================
   DATA COLLECTORS
   ================================================================ */

function collectUGData() {
    return {
        date: formatDate(fv('ug-date')),
        name: fv('ug-name'),
        father: fv('ug-father'),
        dob: formatDate(fv('ug-dob')),
        age: fv('ug-age'),
        gender: fv('ug-gender'),
        community: fv('ug-community'),
        referred: fv('ug-referred'),
        address: fv('ug-address'),
        parent_mobile: fv('ug-parent-mobile'),
        student_mobile: fv('ug-student-mobile'),
        email: fv('ug-email'),
        sslc_year: formatMonth(fv('sslc-year')),
        sslc_marks: fv('sslc-marks'),
        sslc_perc: fv('sslc-perc'),
        sslc_school: fv('sslc-school') === 'other' ? fv('sslc-school-other') : fv('sslc-school'),
        hsc_year: formatMonth(fv('hsc-year')),
        hsc_maths: fv('hsc-maths'),
        hsc_physics: fv('hsc-physics'),
        hsc_chem: fv('hsc-chem'),
        hsc_pcm_perc: fv('hsc-pcm-perc'),
        hsc_marks: fv('hsc-marks'),
        hsc_percentage: fv('hsc-percentage'),
        hsc_school: fv('hsc-school') === 'other' ? fv('hsc-school-other') : fv('hsc-school'),
        branch: fv('ug-branch'),
    };
}

function collectPGData() {
    return {
        date: formatDate(fv('pg-date')),
        name: fv('pg-name'),
        father: fv('pg-father'),
        dob: formatDate(fv('pg-dob')),
        age: fv('pg-age'),
        gender: fv('pg-gender'),
        community: fv('pg-community'),
        referred: fv('pg-referred'),
        address: fv('pg-address'),
        parent_mobile: fv('pg-parent-mobile'),
        student_mobile: fv('pg-student-mobile'),
        email: fv('pg-email'),
        sslc_year: formatMonth(fv('pg-sslc-year')),
        sslc_marks: fv('pg-sslc-marks'),
        sslc_perc: fv('pg-sslc-perc'),
        sslc_school: fv('pg-sslc-school') === 'other' ? fv('pg-sslc-school-other') : fv('pg-sslc-school'),
        degree_name: fv('pg-degree-name'),
        degree_year: formatMonth(fv('pg-degree-year')),
        degree_max: fv('pg-degree-max'),
        degree_obtained: fv('pg-degree-obtained'),
        degree_perc: fv('pg-degree-perc'),
        university: fv('pg-university'),
        college: fv('pg-college'),
        course: fv('pg-course'),
    };
}

function collectLEData() {
    return {
        date: formatDate(fv('le-date')),
        name: fv('le-name'),
        father: fv('le-father'),
        dob: formatDate(fv('le-dob')),
        age: fv('le-age'),
        gender: fv('le-gender'),
        community: fv('le-community'),
        referred: fv('le-referred'),
        address: fv('le-address'),
        parent_mobile: fv('le-parent-mobile'),
        student_mobile: fv('le-student-mobile'),
        email: fv('le-email'),
        sslc_year: formatMonth(fv('le-sslc-year')),
        sslc_marks: fv('le-sslc-marks'),
        sslc_perc: fv('le-sslc-perc'),
        sslc_school: fv('le-sslc-school') === 'other' ? fv('le-sslc-school-other') : fv('le-sslc-school'),
        diploma_course: fv('le-diploma-course'),
        diploma_year: formatMonth(fv('le-diploma-year')),
        diploma_perc: fv('le-diploma-perc'),
        branch: fv('le-branch'),
    };
}

/* ================================================================
   SHARED CSS FOR THE PRINTED FORM
   ================================================================ */
const PRINT_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #000;
    background: #fff;
    width: 794px;
  }
  .page {
    width: 794px;
    min-height: 1123px;
    padding: 24px 30px;
    border: 2px solid #000;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  /* ── Header ── */
  .hdr {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #000;
    margin-bottom: 8px;
  }
  .hdr-logo {
    width: 85px;
    height: 85px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .hdr-logo-nba {
    width: 72px;
    height: 72px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .hdr-center {
    flex: 1;
    text-align: center;
  }
  .hdr-name {
    font-size: 19px;
    font-weight: bold;
    letter-spacing: 0.5px;
    color: #000;
    line-height: 1.2;
  }
  .hdr-auto {
    font-size: 13px;
    color: red;
    font-weight: bold;
    margin: 3px 0;
  }
  .hdr-info {
    font-size: 11px;
    color: #000;
    line-height: 1.6;
  }
  .hdr-addr {
    font-size: 10.5px;
    color: #000;
    margin-top: 3px;
  }
  /* ── Form title ── */
  .form-title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 12px 0 8px;
  }
  /* ── Date row ── */
  .date-row {
    text-align: right;
    font-size: 13px;
    margin-bottom: 8px;
  }
  /* ── Section heading ── */
  .sec-head {
    background: #000;
    color: #fff;
    font-size: 13px;
    font-weight: bold;
    padding: 5px 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 12px 0 8px;
  }
  /* ── Field rows ── */
  .field-row {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    gap: 10px;
  }
  .field-row-2 {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    gap: 6px;
  }
  .lbl {
    font-size: 12.5px;
    font-weight: bold;
    white-space: nowrap;
    padding-bottom: 2px;
    min-width: 155px;
  }
  .lbl-sm {
    font-size: 12.5px;
    font-weight: bold;
    white-space: nowrap;
    padding-bottom: 2px;
  }
  .val-line {
    flex: 1;
    border-bottom: 1.5px solid #000;
    min-height: 22px;
    font-size: 13px;
    padding-bottom: 2px;
    padding-left: 4px;
  }
  .val-line-fixed {
    border-bottom: 1.5px solid #000;
    min-height: 22px;
    font-size: 13px;
    padding-bottom: 2px;
    padding-left: 4px;
  }
  /* ── Community checkboxes ── */
  .comm-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
  }
  .chk-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: bold;
  }
  .chk-box {
    width: 14px;
    height: 14px;
    border: 1.5px solid #000;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }
  /* ── Branch checkboxes ── */
  .branch-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 22px;
    margin: 8px 0 12px;
  }
  /* ── Marks table ── */
  .marks-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 12.5px;
  }
  .marks-table th {
    border: 1px solid #000;
    padding: 5px 6px;
    text-align: center;
    font-size: 12px;
    background: #f0f0f0;
    font-weight: bold;
  }
  .marks-table td {
    border: 1px solid #000;
    padding: 5px 6px;
    text-align: center;
    font-size: 12.5px;
  }
  /* ── Signature ── */
  .sig-row {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 30px;
    gap: 30px;
  }
  .sig-box {
    flex: 1;
    text-align: center;
  }
  .sig-line {
    border-bottom: 1.5px solid #000;
    margin-bottom: 6px;
    height: 55px;
  }
  .sig-lbl {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }
  /* ── Degree table ── */
  .degree-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
    margin-bottom: 8px;
  }
  .degree-table th {
    border: 1px solid #000;
    padding: 5px 6px;
    background: #f0f0f0;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
  }
  .degree-table td {
    border: 1px solid #000;
    padding: 6px 6px;
    font-size: 12.5px;
    text-align: center;
  }
  /* ── Photo box ── */
  .photo-box {
    border: 1px solid #000;
    width: 100px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    text-align: center;
    color: #555;
    flex-shrink: 0;
  }
`;

/* ================================================================
   CHECKBOX HELPER
   ================================================================ */
function checkboxRow(options, selected) {
    return options.map(opt => {
        const checked = selected && selected.toUpperCase() === opt.toUpperCase();
        return `<div class="chk-item">
            <div class="chk-box">${checked ? '✓' : ''}</div>
            <span>${opt}</span>
        </div>`;
    }).join('');
}

function branchCheckboxRow(options, selected) {
    return options.map(opt => {
        const checked = selected && selected.toUpperCase() === opt.toUpperCase();
        return `<div class="chk-item">
            <div class="chk-box" style="width:14px;height:14px;font-size:11px;">${checked ? '✓' : ''}</div>
            <span style="font-size:13px;font-weight:bold;">${opt}</span>
        </div>`;
    }).join('');
}

/* ================================================================
   COLLEGE HEADER HTML (logo + NBA logo)
   ================================================================ */
function buildHeader(logoBase64, nbaLogoBase64) {
    const logoTag = logoBase64
        ? `<img class="hdr-logo" src="${logoBase64}" alt="MVIT Logo" />`
        : `<div class="hdr-logo" style="border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:8px;color:#555;">MVIT<br>LOGO</div>`;

    const nbaTag = nbaLogoBase64
        ? `<img class="hdr-logo-nba" src="${nbaLogoBase64}" alt="NBA Logo" />`
        : `<div class="hdr-logo-nba" style="border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:8px;color:#555;">NBA</div>`;

    return `
    <div class="hdr">
        ${logoTag}
        <div class="hdr-center">
            <div class="hdr-name">MANAKULA VINAYAGAR INSTITUTE OF TECHNOLOGY</div>
            <div class="hdr-auto">An Autonomous Institution</div>
            <div class="hdr-info">Affiliated to Pondicherry University &nbsp;|&nbsp; Approved by AICTE, New Delhi</div>
            <div class="hdr-info">Accredited by NBA, New Delhi &amp; NAAC with 'A' Grade</div>
            <div class="hdr-addr">Kalitheerthalkuppam, Puducherry – 605 107</div>
        </div>
        ${nbaTag}
    </div>`;
}


/* ================================================================
   UG TEMPLATE
   ================================================================ */
function buildUGHTML(d, logoBase64, nbaLogoBase64) {
    const ugBranches = ['MECH', 'ECE', 'CSE', 'IT', 'EEE', 'FTECH', 'ROBOTICS', 'IOT', 'AIML'];
    const communityOptions = ['OC', 'OBC', 'MBC', 'SC', 'ST'];

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>${PRINT_CSS}</style>
</head>
<body>
<!-- PAGE 1 -->
<div class="page">
    ${buildHeader(logoBase64, nbaLogoBase64)}

    <div class="form-title">B.TECH ADMISSION ENQUIRY FORM</div>
    <div class="date-row">Date : <u>${d.date || ''}</u></div>

    <!-- Personal Info -->
    <div class="sec-head">PERSONAL INFORMATION</div>

    <div class="field-row">
        <div class="lbl">NAME OF THE STUDENT :</div>
        <div class="val-line">${d.name}</div>
        <div style="width:8px;"></div>
        <div class="photo-box">PHOTO</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">GENDER :</div>
        <div class="val-line">${d.gender || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">DATE OF BIRTH :</div>
        <div class="val-line-fixed" style="width:100px;">${d.dob}</div>
        <div style="width:6px;"></div>
        <div class="lbl-sm">AGE :</div>
        <div class="val-line-fixed" style="width:40px;">${d.age}</div>
    </div>

    <div class="comm-row">
        <div class="lbl" style="min-width:80px;">COMMUNITY :</div>
        ${checkboxRow(['OC', 'OBC', 'MBC', 'SC', 'ST', 'Others'], d.community)}
    </div>

    <div class="field-row-2">
        <div class="lbl">PARENT MOBILE :</div>
        <div class="val-line-fixed" style="width:130px;">${d.parent_mobile || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">STUDENT MOBILE :</div>
        <div class="val-line">${d.student_mobile || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">ADDRESS :</div>
        <div class="val-line">${d.address || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">EMAIL :</div>
        <div class="val-line">${d.email}</div>
    </div>

    <!-- SSLC -->
    <div class="sec-head">SSLC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.sslc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">MARKS :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_marks ? d.sslc_marks + ' / 500' : ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_perc ? d.sslc_perc + '%' : ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">SCHOOL NAME :</div>
        <div class="val-line">${d.sslc_school}</div>
    </div>

    <!-- H.Sc -->
    <div class="sec-head">H.SC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.hsc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">TOTAL MARKS :</div>
        <div class="val-line-fixed" style="width:70px;">${d.hsc_marks ? d.hsc_marks + ' / 600' : ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.hsc_percentage ? d.hsc_percentage + '%' : ''}</div>
    </div>
    <table class="marks-table">
        <thead>
            <tr>
                <th>SUBJECT</th>
                <th>MATHEMATICS</th>
                <th>PHYSICS</th>
                <th>COM.SCI / CHEM / BIO</th>
                <th>PCM PERCENTAGE</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="font-weight:bold;">MARKS (Out of 100)</td>
                <td>${d.hsc_maths || ''}</td>
                <td>${d.hsc_physics || ''}</td>
                <td>${d.hsc_chem || ''}</td>
                <td>${d.hsc_pcm_perc ? d.hsc_pcm_perc + '%' : ''}</td>
            </tr>
        </tbody>
    </table>
    <div class="field-row">
        <div class="lbl">SCHOOL NAME :</div>
        <div class="val-line">${d.hsc_school}</div>
    </div>

    <!-- Branch Opted -->
    <div class="sec-head">BRANCH OPTED</div>
    <div class="branch-row">
        ${branchCheckboxRow(ugBranches, d.branch)}
    </div>

    <!-- Signature -->
    <div class="sig-row">
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE PARENT</div>
        </div>
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE STUDENT</div>
        </div>
    </div>
</div>

</body>
</html>`;
}

/* ================================================================
   PG TEMPLATE
   ================================================================ */
function buildPGHTML(d, logoBase64, nbaLogoBase64) {
    const communityOptions = ['OC', 'OBC', 'MBC', 'SC', 'ST'];
    const pgCourses = ['MBA', 'MCA', 'M.TECH'];

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>${PRINT_CSS}</style>
</head>
<body>
<!-- PAGE 1 -->
<div class="page">
    ${buildHeader(logoBase64, nbaLogoBase64)}

    <div class="form-title">PG ADMISSION ENQUIRY FORM</div>
    <div class="date-row">Date : <u>${d.date || ''}</u></div>

    <!-- Personal Info -->
    <div class="sec-head">PERSONAL INFORMATION</div>

    <div class="field-row">
        <div class="lbl">NAME OF THE STUDENT :</div>
        <div class="val-line">${d.name}</div>
        <div style="width:8px;"></div>
        <div class="photo-box">PHOTO</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">GENDER :</div>
        <div class="val-line">${d.gender || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">DATE OF BIRTH :</div>
        <div class="val-line-fixed" style="width:100px;">${d.dob}</div>
        <div style="width:6px;"></div>
        <div class="lbl-sm">AGE :</div>
        <div class="val-line-fixed" style="width:40px;">${d.age}</div>
    </div>

    <div class="comm-row">
        <div class="lbl" style="min-width:80px;">COMMUNITY :</div>
        ${checkboxRow(['OC', 'OBC', 'MBC', 'SC', 'ST', 'Others'], d.community)}
    </div>

    <div class="field-row-2">
        <div class="lbl">PARENT MOBILE :</div>
        <div class="val-line-fixed" style="width:130px;">${d.parent_mobile || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">STUDENT MOBILE :</div>
        <div class="val-line">${d.student_mobile || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">ADDRESS :</div>
        <div class="val-line">${d.address || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">EMAIL :</div>
        <div class="val-line">${d.email}</div>
    </div>

    <!-- SSLC -->
    <div class="sec-head">SSLC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.sslc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">MARKS :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_marks ? d.sslc_marks + ' / 500' : ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_perc ? d.sslc_perc + '%' : ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">SCHOOL NAME :</div>
        <div class="val-line">${d.sslc_school}</div>
    </div>

    <!-- H.Sc -->
    <div class="sec-head">H.SC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.hsc_year || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.hsc_perc || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">SCHOOL :</div>
        <div class="val-line">${d.hsc_school || ''}</div>
    </div>

    <!-- Degree -->
    <div class="sec-head">DEGREE DETAILS</div>
    <table class="degree-table">
        <thead>
            <tr>
                <th>NAME OF THE DEGREE</th>
                <th>MONTH &amp; YEAR OF PASSING</th>
                <th>MAXIMUM MARKS</th>
                <th>MARKS OBTAINED</th>
                <th>PERCENTAGE OF MARKS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${d.degree_name}</td>
                <td>${d.degree_year}</td>
                <td>${d.degree_max}</td>
                <td>${d.degree_obtained}</td>
                <td>${d.degree_perc ? d.degree_perc + '%' : ''}</td>
            </tr>
        </tbody>
    </table>
    <div class="field-row">
        <div class="lbl">NAME OF THE UNIVERSITY :</div>
        <div class="val-line">${d.university}</div>
        <div style="width:8px;"></div>
        <div class="lbl-sm" style="font-size:8.5px;color:#555;">(Only Regular Mode)</div>
    </div>
    <div class="field-row">
        <div class="lbl">COLLEGE NAME :</div>
        <div class="val-line">${d.college}</div>
    </div>

    <!-- Course Opted -->
    <div class="sec-head">COURSE OPTED</div>
    <div class="branch-row">
        ${branchCheckboxRow(pgCourses, d.course)}
    </div>

    <!-- Referred By -->
    <div class="field-row" style="margin-top:10px;">
        <div class="lbl">REFERRED BY :</div>
        <div class="val-line">${d.referred || ''}</div>
    </div>

    <!-- Signature -->
    <div class="sig-row">
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE PARENT</div>
        </div>
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE STUDENT</div>
        </div>
    </div>
</div>
</body>
</html>`;
}

/* ================================================================
   LATERAL ENTRY TEMPLATE
   ================================================================ */
function buildLEHTML(d, logoBase64, nbaLogoBase64) {
    const ugBranches = ['MECH', 'ECE', 'CSE', 'IT', 'EEE', 'FTECH', 'ROBOTICS', 'IOT', 'AIML'];
    const communityOptions = ['OC', 'OBC', 'MBC', 'SC', 'ST'];

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>${PRINT_CSS}</style>
</head>
<body>
<!-- PAGE 1 -->
<div class="page">
    ${buildHeader(logoBase64, nbaLogoBase64)}

    <div class="form-title">B.TECH LATERAL ENTRY ADMISSION ENQUIRY FORM</div>
    <div class="date-row">Date : <u>${d.date || ''}</u></div>

    <!-- Personal Info -->
    <div class="sec-head">PERSONAL INFORMATION</div>

    <div class="field-row">
        <div class="lbl">NAME OF THE STUDENT :</div>
        <div class="val-line">${d.name}</div>
        <div style="width:8px;"></div>
        <div class="photo-box">PHOTO</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">GENDER :</div>
        <div class="val-line">${d.gender || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">DATE OF BIRTH :</div>
        <div class="val-line-fixed" style="width:100px;">${d.dob}</div>
        <div style="width:6px;"></div>
        <div class="lbl-sm">AGE :</div>
        <div class="val-line-fixed" style="width:40px;">${d.age}</div>
    </div>

    <div class="comm-row">
        <div class="lbl" style="min-width:80px;">COMMUNITY :</div>
        ${checkboxRow(['OC', 'OBC', 'MBC', 'SC', 'ST', 'Others'], d.community)}
    </div>

    <div class="field-row-2">
        <div class="lbl">PARENT MOBILE :</div>
        <div class="val-line-fixed" style="width:130px;">${d.parent_mobile || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">STUDENT MOBILE :</div>
        <div class="val-line">${d.student_mobile || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">ADDRESS :</div>
        <div class="val-line">${d.address || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">EMAIL :</div>
        <div class="val-line">${d.email}</div>
    </div>

    <!-- SSLC -->
    <div class="sec-head">SSLC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.sslc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">MARKS :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_marks ? d.sslc_marks + ' / 500' : ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_perc ? d.sslc_perc + '%' : ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">SCHOOL NAME :</div>
        <div class="val-line">${d.sslc_school}</div>
    </div>

    <!-- Diploma -->
    <div class="sec-head">DIPLOMA DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">NAME OF THE DIPLOMA COURSE :</div>
        <div class="val-line">${d.diploma_course}</div>
    </div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:100px;">${d.diploma_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE (Upto VI Sem) :</div>
        <div class="val-line-fixed" style="width:80px;">${d.diploma_perc ? d.diploma_perc + '%' : ''}</div>
    </div>

    <!-- Branch Opted -->
    <div class="sec-head">BRANCH OPTED</div>
    <div class="branch-row">
        ${branchCheckboxRow(ugBranches, d.branch)}
    </div>

    <!-- Signature -->
    <div class="sig-row">
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE PARENT</div>
        </div>
        <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-lbl">SIGNATURE OF THE STUDENT</div>
        </div>
    </div>
</div>

</body>
</html>`;
}

/* ================================================================
   CORE PDF ENGINE
   ================================================================ */
async function generatePDF(htmlContent, fileName) {
    // Create off-screen container
    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;background:#fff;';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const pages = container.querySelectorAll('.page');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210;
    const pageH = 297;

    try {
        for (let i = 0; i < pages.length; i++) {
            if (i > 0) pdf.addPage();

            const canvas = await html2canvas(pages[i], {
                scale: 2.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 794,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgH = (canvas.height * pageW) / canvas.width;

            if (imgH <= pageH) {
                // fits on one page — center vertically
                const yOffset = 0;
                pdf.addImage(imgData, 'PNG', 0, yOffset, pageW, imgH);
            } else {
                // tall content — tile across pages
                let heightLeft = imgH;
                let position = 0;
                pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
                heightLeft -= pageH;
                while (heightLeft > 0) {
                    position = heightLeft - imgH;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
                    heightLeft -= pageH;
                }
            }
        }

        pdf.save(fileName);
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('PDF generation failed. Please try again.');
    } finally {
        document.body.removeChild(container);
    }
}

/* ================================================================
   PUBLIC DOWNLOAD FUNCTIONS — called by buttons
   ================================================================ */

async function downloadUGPDF() {
    const data = collectUGData();
    const name = data.name ? data.name.replace(/\s+/g, '_') : 'STUDENT';
    const logoB64 = await getBase64Image('college_logo.jpg');
    const htmlContent = buildUGHTML(data, logoB64, '');
    generatePDF(htmlContent, `UG_Admission_${name}.pdf`);
}

async function downloadPGPDF() {
    const data = collectPGData();
    const name = data.name ? data.name.replace(/\s+/g, '_') : 'STUDENT';
    const logoB64 = await getBase64Image('college_logo.jpg');
    const htmlContent = buildPGHTML(data, logoB64, '');
    generatePDF(htmlContent, `PG_Admission_${name}.pdf`);
}

async function downloadLEPDF() {
    const data = collectLEData();
    const name = data.name ? data.name.replace(/\s+/g, '_') : 'STUDENT';
    const logoB64 = await getBase64Image('college_logo.jpg');
    const htmlContent = buildLEHTML(data, logoB64, '');
    generatePDF(htmlContent, `Lateral_Entry_${name}.pdf`);
}

/* ──────────────────────────────────────────────────────────────
   UG PHASE 2: COLLECTOR + HTML BUILDER + DOWNLOAD
   ────────────────────────────────────────────────────────────── */

function collectUG2Data() {
    return {
        date: formatDate(fv('ug2-date')),
        name: fv('ug2-name'),
        father: fv('ug2-father'),
        dob: formatDate(fv('ug2-dob')),
        age: fv('ug2-age'),
        gender: fv('ug2-gender'),
        community: fv('ug2-community-other') && fv('ug2-community') === 'Others'
            ? fv('ug2-community-other')
            : fv('ug2-community'),
        referred: fv('ug2-referred'),
        address: fv('ug2-address'),
        parent_mobile: fv('ug2-parent-mobile'),
        student_mobile: fv('ug2-student-mobile'),
        email: fv('ug2-email'),
        sslc_year: formatMonth(fv('ug2-sslc-year')),
        sslc_marks: fv('ug2-sslc-marks'),
        sslc_perc: fv('ug2-sslc-perc'),
        sslc_school: fv('ug2-sslc-school') === 'other' ? fv('ug2-sslc-school-other') : fv('ug2-sslc-school'),
        hsc_year: formatMonth(fv('ug2-hsc-year')),
        hsc_school: fv('ug2-hsc-school') === 'other' ? fv('ug2-hsc-school-other') : fv('ug2-hsc-school'),
        sub1_name: fv('ug2-sub1-name'),
        sub1_mark: fv('ug2-sub1-mark'),
        sub2_name: fv('ug2-sub2-name'),
        sub2_mark: fv('ug2-sub2-mark'),
        sub3_name: fv('ug2-sub3-name'),
        sub3_mark: fv('ug2-sub3-mark'),
        main_total: fv('ug2-main-total'),
        main_perc: fv('ug2-main-perc'),
        hsc_total: fv('ug2-hsc-total'),
        hsc_perc: fv('ug2-hsc-perc'),
        branch: fv('ug2-branch'),
    };
}

function buildUG2HTML(d, logoBase64, nbaLogoBase64) {
    const subjectRowHtml = (name, mark) => {
        return `<tr>
            <td style="padding:5px 8px;">${name || '—'}</td>
            <td style="text-align:center;font-weight:700;padding:5px 8px;">${mark || '—'}</td>
            <td style="text-align:center;padding:5px 8px;">100</td>
        </tr>`;
    };

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>${PRINT_CSS}
.sub-table { width:100%; border-collapse:collapse; margin:8px 0; }
.sub-table th { background:#1e3a6e; color:#fff; padding:6px 8px; font-size:11px; text-align:left; }
.sub-table td { border-bottom:1px solid #e2e8f0; font-size:12px; height:24px; }
</style>
</head>
<body>
<!-- PAGE 1 -->
<div class="page">
    ${buildHeader(logoBase64, nbaLogoBase64)}

    <div class="form-title">UG PHASE 2 ADMISSION ENQUIRY FORM (BBA / BCA)</div>
    <div class="date-row">Date : <u>${d.date || ''}</u></div>

    <!-- Personal Info -->
    <div class="sec-head">PERSONAL INFORMATION</div>

    <div class="field-row">
        <div class="lbl">NAME OF THE STUDENT :</div>
        <div class="val-line">${d.name}</div>
        <div style="width:8px;"></div>
        <div class="photo-box">PHOTO</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">FATHER'S NAME :</div>
        <div class="val-line">${d.father}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">DATE OF BIRTH :</div>
        <div class="val-line-fixed" style="width:100px;">${d.dob}</div>
        <div style="width:6px;"></div>
        <div class="lbl-sm">AGE :</div>
        <div class="val-line-fixed" style="width:40px;">${d.age}</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">GENDER :</div>
        <div class="val-line-fixed" style="width:80px;">${d.gender || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">COMMUNITY :</div>
        <div class="val-line">${d.community || ''}</div>
    </div>

    <div class="field-row-2">
        <div class="lbl">PARENT MOBILE :</div>
        <div class="val-line-fixed" style="width:130px;">${d.parent_mobile || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">STUDENT MOBILE :</div>
        <div class="val-line">${d.student_mobile || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">ADDRESS :</div>
        <div class="val-line">${d.address || ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">EMAIL :</div>
        <div class="val-line">${d.email}</div>
    </div>

    <!-- SSLC -->
    <div class="sec-head">SSLC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.sslc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">MARKS :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_marks ? d.sslc_marks + ' / 500' : ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:60px;">${d.sslc_perc ? d.sslc_perc : ''}</div>
    </div>
    <div class="field-row">
        <div class="lbl">SCHOOL NAME :</div>
        <div class="val-line">${d.sslc_school}</div>
    </div>

    <!-- HSC -->
    <div class="sec-head">HSC DETAILS</div>
    <div class="field-row-2">
        <div class="lbl-sm">MONTH &amp; YEAR OF PASSING :</div>
        <div class="val-line-fixed" style="width:80px;">${d.hsc_year}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">SCHOOL :</div>
        <div class="val-line">${d.hsc_school}</div>
    </div>

    <!-- Subject marks table -->
    <table class="sub-table">
        <thead>
            <tr>
                <th>SUBJECT NAME</th>
                <th style="text-align:center;">MARKS OBTAINED</th>
                <th style="text-align:center;">MAXIMUM</th>
            </tr>
        </thead>
        <tbody>
            ${subjectRowHtml(d.sub1_name, d.sub1_mark)}
            ${subjectRowHtml(d.sub2_name, d.sub2_mark)}
            ${subjectRowHtml(d.sub3_name, d.sub3_mark)}
        </tbody>
    </table>
    
    <div class="field-row-2" style="margin-top:2px;">
        <div class="lbl-sm">MAIN SUBJECTS TOTAL (/ 300) :</div>
        <div class="val-line-fixed" style="width:60px;">${d.main_total || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">MAIN SUBJECTS PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:70px;">${d.main_perc || ''}</div>
    </div>
    <div class="field-row-2">
        <div class="lbl-sm">OVERALL TOTAL MARKS (/ 600) :</div>
        <div class="val-line-fixed" style="width:60px;">${d.hsc_total || ''}</div>
        <div style="width:12px;"></div>
        <div class="lbl-sm">OVERALL PERCENTAGE :</div>
        <div class="val-line-fixed" style="width:70px;">${d.hsc_perc || ''}</div>
    </div>

    <!-- Course Opted -->
    <div class="sec-head">COURSE OPTED</div>
    <div class="branch-row">
        ${branchCheckboxRow(['BBA', 'BCA'], d.branch)}
    </div>

    <!-- Referred -->
    <div class="field-row" style="margin-top:8px;">
        <div class="lbl">REFERRED BY :</div>
        <div class="val-line">${d.referred || ''}</div>
    </div>

    <!-- Signature -->
    <div class="sig-row">
        <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-label">PARENT / GUARDIAN SIGNATURE</div>
        </div>
        <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-label">STUDENT SIGNATURE</div>
        </div>
    </div>
</div>
</body>
</html>`;
}

async function downloadUG2PDF() {
    const data = collectUG2Data();
    const name = data.name ? data.name.replace(/\s+/g, '_') : 'STUDENT';
    const logoB64 = await getBase64Image('college_logo.jpg');
    const htmlContent = buildUG2HTML(data, logoB64, '');
    generatePDF(htmlContent, `UG_Phase2_${name}.pdf`);
}
