/* ============================================================
   MVIT ADMISSION PORTAL 2026 — script.js
   Supabase backend | Auto-calc | Toggle groups | Admin
   College: Manakula Vinayagar Institute of Technology, Puducherry
   ============================================================ */

/* ──────────────────────────────────────────────
   SUPABASE CONFIG
   Replace with your actual Supabase project URL and Anon Key
   Get them from: https://app.supabase.com → Project Settings → API
   ────────────────────────────────────────────── */
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';

/* ──────────────────────────────────────────────
   PONDICHERRY SCHOOLS — Comprehensive List
   ────────────────────────────────────────────── */
const PONDICHERRY_SCHOOLS = [
    /* ── Amalorpavam Group ── */
    { group: 'Amalorpavam Group', name: 'Amalorpavam Higher Secondary School, Vanarapet (State Board)' },
    { group: 'Amalorpavam Group', name: "Amalorpavam Lourds Academy, Vanarapet (CBSE)" },
    /* ── Petit Seminaire Group ── */
    { group: 'Petit Seminaire Group', name: "Petit Seminaire Higher Secondary School, MG Road (State Board)" },
    { group: 'Petit Seminaire Group', name: "Petit Seminaire CBSE School, Moolakulam (CBSE)" },
    /* ── St. Joseph of Cluny Group ── */
    { group: "St. Joseph of Cluny Group", name: "St. Joseph of Cluny Girls HSS, Lawspet (State Board)" },
    { group: "St. Joseph of Cluny Group", name: "St. Joseph of Cluny International School, Odiampet (CBSE)" },
    /* ── Achariya Group ── */
    { group: 'Achariya Group', name: "Achariya Siksha Mandir, Villianur (CBSE)" },
    { group: 'Achariya Group', name: "Achariya Bala Siksha Mandir, Thengaithittu (CBSE)" },
    { group: 'Achariya Group', name: "Achariya Bala Siksha Mandir, Lawspet (CBSE)" },
    /* ── Aditya Vidhyashram Group ── */
    { group: 'Aditya Vidhyashram Group', name: "Aditya Vidhyashram Residential School, Poraiyur (CBSE)" },
    { group: 'Aditya Vidhyashram Group', name: "Aditya Vidhyashram, Saram Branch (CBSE)" },
    /* ── SDA Group ── */
    { group: 'Seventh Day Adventist Group', name: "SDA Higher Secondary School, Mudaliarpet (State Board)" },
    { group: 'Seventh Day Adventist Group', name: "SDA Higher Secondary School, Shanmugapuram (State Board)" },
    { group: 'Seventh Day Adventist Group', name: "Faithful SDA Higher Secondary School, Thirubuvanai (ICSE)" },
    /* ── Alpha Group ── */
    { group: 'Alpha Group', name: "Alpha English Higher Secondary School, Muthialpet (State Board)" },
    { group: 'Alpha Group', name: "Alpha Matriculation Higher Secondary School, Saram (State Board)" },
    { group: 'Alpha Group', name: "Alpha International School, Bahour (CBSE)" },
    /* ── Vivekananda Group ── */
    { group: 'Vivekananda Group', name: "Vivekanandha Higher Secondary School, Lawspet (State Board)" },
    { group: 'Vivekananda Group', name: "Vivekanandha CBSE School, Lawspet (CBSE)" },
    { group: 'Vivekananda Group', name: "Swami Vivekananda Higher Secondary School, Manakuppam (State Board)" },
    /* ── Standalone CBSE / International ── */
    { group: 'CBSE / International', name: "The Study L'école Internationale, Kalapet (CBSE)" },
    { group: 'CBSE / International', name: "Billabong High International School, Moolakulam (CBSE)" },
    { group: 'CBSE / International', name: "Jawahar Navodaya Vidyalaya, Kalapet (CBSE - Central Govt)" },
    { group: 'CBSE / International', name: "Kendriya Vidyalaya No. 1, JIPMER Campus (CBSE - Central Govt)" },
    { group: 'CBSE / International', name: "Kendriya Vidyalaya No. 2, Pondicherry University, Kalapet (CBSE)" },
    { group: 'CBSE / International', name: "Velammal Bodhi Campus, Thiruvandarkovil (CBSE)" },
    { group: 'CBSE / International', name: "Vaasavi International School, Muthialpet (CBSE)" },
    { group: 'CBSE / International', name: "Sri Sankara Vidyashramam, Odiampet (CBSE)" },
    /* ── State Board / Matriculation ── */
    { group: 'State Board', name: "St. Patrick Matriculation HSS, Saradambal Nagar (State Board)" },
    { group: 'State Board', name: "Wiseman Higher Secondary School, Velrampet (State Board)" },
    { group: 'State Board', name: "Don Bosco Higher Secondary School, Lawspet (State Board)" },
    { group: 'State Board', name: "Immaculate Heart of Mary Girls HSS, Mission Street (State Board)" },
    { group: 'State Board', name: "St. Joseph's Higher Secondary School, Thiruvandarkoil (State Board)" },
    { group: 'State Board', name: "Senthil Matriculation HSS, Sanjay Gandhi Nagar (State Board)" },
    { group: 'State Board', name: "New Modern Vidhya Mandir HSS, Muthialpet (State Board)" },
    { group: 'State Board', name: "Sri Sankara Vidyalaya HSS, Lawspet (State Board)" },
    /* ── Government HSS ── */
    { group: 'Government HSS', name: "Calve College GHSS, Mission Street (Govt)" },
    { group: 'Government HSS', name: "V.O.C. GHSS, Mission Street (Govt)" },
    { group: 'Government HSS', name: "Thiruvalluvar Government Girls HSS, Laporte Street (Govt)" },
    { group: 'Government HSS', name: "Soucilabai Government Girls HSS, Vysial Street (Govt)" },
    { group: 'Government HSS', name: "Jeevanandam GHSS, Karamanikuppam (Govt)" },
    { group: 'Government HSS', name: "Navalar Nedunchezhian GHSS, Lawspet (Govt)" },
    { group: 'Government HSS', name: "Indira Gandhi GHSS, Indira Nagar (Govt)" },
    { group: 'Government HSS', name: "Annai Sivagami Government Girls HSS, Mudaliarpet (Govt)" },
    { group: 'Government HSS', name: "Thanthai Periyar Government Girls HSS, Ariankuppam (Govt)" },
    { group: 'Government HSS', name: "Chevalier Sellane GHSS, Kalapet (Govt)" },
    { group: 'Government HSS', name: "Ilango Adigal GHSS, Muthirapalayam (Govt)" },
    { group: 'Government HSS', name: "Kannagi Government Girls HSS, Villianur (Govt)" },
    { group: 'Government HSS', name: "Vivekananda Government Boys HSS, Villianur (Govt)" },
    { group: 'Government HSS', name: "Bharathi GHSS, Bahour (Govt)" },
];

/* Build grouped school dropdown options */
function buildSchoolOptions() {
    const groups = {};
    PONDICHERRY_SCHOOLS.forEach(s => {
        if (!groups[s.group]) groups[s.group] = [];
        groups[s.group].push(s.name);
    });
    let html = '<option value="">— Select School —</option>';
    Object.entries(groups).forEach(([grp, names]) => {
        html += `<optgroup label="${grp}">`;
        names.forEach(n => { html += `<option value="${n}">${n}</option>`; });
        html += '</optgroup>';
    });
    html += '<option value="other">⊕ Other (specify below)</option>';
    return html;
}

/* Populate all school dropdowns on the page */
function populateSchoolDropdowns() {
    const opts = buildSchoolOptions();
    document.querySelectorAll('[data-school-select]').forEach(sel => {
        sel.innerHTML = opts;
    });
}

/* ──────────────────────────────────────────────
   PONDICHERRY COLLEGES — For Autocomplete
   ────────────────────────────────────────────── */
const PONDICHERRY_COLLEGES = [
    "Manakula Vinayagar Institute of Technology (MVIT)",
    "Sri Manakula Vinayagar Engineering College (SMVEC)",
    "Pondicherry Engineering College (PEC)",
    "Puducherry Technological University (PTU)",
    "Perunthalaivar Kamarajar Institute of Engineering and Technology (PKIET)",
    "Rajiv Gandhi College of Engineering and Technology (RGCET)",
    "Christ College of Engineering and Technology",
    "Sri Venkateshwaraa College of Engineering & Technology",
    "Alpha College of Engineering and Technology",
    "Yanam Engineering College (Yanam)",
    "Others"
];

/* Populate college datalist for PG form */
function populateCollegeDatalist() {
    const datalist = document.getElementById('college-list');
    if (!datalist) return;
    
    let html = '';
    PONDICHERRY_COLLEGES.forEach(college => {
        html += `<option value="${college}"></option>`;
    });
    datalist.innerHTML = html;
}

/* Supabase REST helper */
const db = {
    async insert(table, data) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async fetchAll(table, filters = {}) {
        let url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`;
        Object.entries(filters).forEach(([k, v]) => {
            if (v) url += `&${k}=eq.${encodeURIComponent(v)}`;
        });
        const res = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};

/* ================================================================
   UTILITY FUNCTIONS
   ================================================================ */

/* Toast Notification */
function showToast(msg, type = 'success') {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = `toast${type === 'error' ? ' error' : ''}`;
    t.innerHTML = `<span style="font-size:1.4rem">${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.animation = 'slideOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 4000);
}

/* Percentage Colour Helper */
function applyPercentageColor(field, percentageValue) {
    if (!field) return;
    if (percentageValue === '' || isNaN(percentageValue)) {
        field.style.color = '';
        field.style.fontWeight = '';
        return;
    }
    if (percentageValue < 50) {
        field.style.color = '#ef4444'; // red
        field.style.fontWeight = 'bold';
    } else {
        field.style.color = '#22c55e'; // green
        field.style.fontWeight = 'bold';
    }
}

/* Hamburger nav toggle */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('navLinks');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ── Age Auto-Calculation ── */
function initAgeCalc() {
    document.querySelectorAll('[data-dob]').forEach(dobInput => {
        const ageId = dobInput.getAttribute('data-dob');
        const ageField = document.getElementById(ageId);
        if (!ageField) return;
        dobInput.addEventListener('change', function () {
            const dob = new Date(this.value);
            if (isNaN(dob)) return;
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            ageField.value = age > 0 ? age : '';
        });
    });
}

/* ── CAPS Conversion ── */
function initCapsFields() {
    document.querySelectorAll('.caps-field').forEach(el => {
        el.addEventListener('input', function () {
            const pos = this.selectionStart;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(pos, pos);
        });
    });
}

/* ── Marks → Percentage Auto-Calc ── */
function initPercentCalc() {
    document.querySelectorAll('[data-marks]').forEach(marksInput => {
        const attrs = marksInput.getAttribute('data-marks').split(',');
        const total = parseInt(attrs[0]);
        const percId = attrs[1];
        const percField = document.getElementById(percId);
        if (!percField) return;
        marksInput.addEventListener('input', function () {
            const val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0 && val <= total) {
                const perc = (val / total) * 100;
                percField.value = perc.toFixed(2) + '%';
                applyPercentageColor(percField, perc);
            } else {
                percField.value = '';
                applyPercentageColor(percField, '');
            }
        });
    });
}

/* ── CGPA → Percentage Auto-Calc ── */
function initCGPACalc() {
    const cgpaInput = document.getElementById('pg-degree-cgpa');
    const percField = document.getElementById('pg-degree-perc');
    if (!cgpaInput || !percField) return;

    cgpaInput.addEventListener('input', function () {
        const val = parseFloat(this.value);
        if (!isNaN(val) && val >= 0 && val <= 10) {
            // Formula: CGPA * 10 = Percentage (or standard formula like CGPA*9.5)
            // Using * 10 as generic mapping unless specified otherwise.
            const perc = val * 10;
            percField.value = perc.toFixed(2) + '%';
            applyPercentageColor(percField, perc);
        } else {
            if (val > 10) {
                this.value = 10;
                const perc = 100;
                percField.value = perc.toFixed(2) + '%';
                applyPercentageColor(percField, perc);
            } else {
                percField.value = '';
                applyPercentageColor(percField, '');
            }
        }
    });
}

/* ── HSC Multi-Subject → PCM % + Overall HSC % ── */
function initHscCalc() {
    const subs = ['hsc-maths', 'hsc-physics', 'hsc-chem'];
    const pcmPercField = document.getElementById('hsc-pcm-perc');   // out of 300
    const hscMarksField = document.getElementById('hsc-marks');       // total out of 600
    const hscPercField = document.getElementById('hsc-percentage');  // out of 600

    /* PCM percentage: recalculate when any subject mark changes */
    subs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', calcPcm);
    });

    function calcPcm() {
        let pcmSum = 0;
        subs.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value !== '') pcmSum += parseInt(el.value) || 0;
        });
        if (pcmPercField) {
            if (pcmSum > 0) {
                const perc = (pcmSum / 300) * 100;
                pcmPercField.value = perc.toFixed(2) + '%';
                applyPercentageColor(pcmPercField, perc);
            } else {
                pcmPercField.value = '';
                applyPercentageColor(pcmPercField, '');
            }
        }
    }

    /* Overall HSC percentage: recalculate when grand total changes */
    if (hscMarksField && hscPercField) {
        hscMarksField.addEventListener('input', function () {
            const val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0 && val <= 600) {
                const perc = (val / 600) * 100;
                hscPercField.value = perc.toFixed(2) + '%';
                applyPercentageColor(hscPercField, perc);
            } else {
                hscPercField.value = '';
                applyPercentageColor(hscPercField, '');
            }
        });
    }
}

/* ── Toggle Pill Group (single-select) ── */
function initToggleGroups() {
    document.querySelectorAll('.toggle-group').forEach(group => {
        const pills = group.querySelectorAll('.toggle-pill');
        const hiddenInput = document.getElementById(group.getAttribute('data-input'));
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                if (hiddenInput) hiddenInput.value = pill.getAttribute('data-value');
            });
        });
    });
}

/* ── School Dropdown + Other reveal ── */
function initSchoolDropdown() {
    document.querySelectorAll('[data-school-select]').forEach(sel => {
        const wrapperId = sel.getAttribute('data-school-select');
        sel.addEventListener('change', function () {
            const wrap = document.getElementById(wrapperId);
            if (wrap) wrap.style.display = this.value === 'other' ? 'block' : 'none';
        });
    });
}

/* ── Print ── */
function initPrint() {
    document.querySelectorAll('.print-btn').forEach(btn => {
        btn.addEventListener('click', () => window.print());
    });
}

/* ── Form Validation ── */
function validateForm(formEl) {
    let valid = true;
    formEl.querySelectorAll('[required]').forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            valid = false;
        }
    });
    // mobile validation
    const mob = formEl.querySelector('#mobile');
    if (mob && mob.value && !/^\d{10}$/.test(mob.value.trim())) {
        mob.style.borderColor = '#ef4444';
        valid = false;
        showToast('Enter a valid 10-digit mobile number.', 'error');
    }
    // email
    const em = formEl.querySelector('#email');
    if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
        em.style.borderColor = '#ef4444';
        valid = false;
        showToast('Enter a valid email address.', 'error');
    }
    if (!valid && !formEl.querySelector('#mobile')) {
        showToast('Please fill all required fields.', 'error');
    }
    return valid;
}

/* ── Get selected toggle value ── */
function getToggleVal(groupId) {
    const g = document.getElementById(groupId);
    if (!g) return '';
    const active = g.querySelector('.toggle-pill.active');
    return active ? active.getAttribute('data-value') : '';
}

/* ── School value (handles "Other") ── */
function getSchoolVal(selectId, otherId) {
    const sel = document.getElementById(selectId);
    if (!sel) return '';
    if (sel.value === 'other') {
        const oth = document.getElementById(otherId);
        return oth ? oth.value : 'Other';
    }
    return sel.value;
}

/* ================================================================
   UG FORM SUBMISSION
   ================================================================ */
async function submitUG() {
    const form = document.getElementById('ug-form');
    if (!validateForm(form)) return;

    const branch = getToggleVal('branch-group');
    if (!branch) { showToast('Please select a branch.', 'error'); return; }
    const community = getToggleVal('community-group');
    if (!community) { showToast('Please select a community.', 'error'); return; }
    const gender = getToggleVal('ug-gender-group');
    if (!gender) { showToast('Please select a gender.', 'error'); return; }

    const data = {
        name: g('ug-name'),
        father_name: g('ug-father'),
        dob: g('ug-dob'),
        age: parseInt(g('ug-age')) || null,
        gender,
        community,
        address: g('ug-address'),
        parent_mobile: g('ug-parent-mobile'),
        student_mobile: g('ug-student-mobile'),
        email: g('ug-email'),
        referred_by: g('ug-referred'),
        sslc_year: g('sslc-year'),
        sslc_marks: parseInt(g('sslc-marks')) || null,
        sslc_percentage: parseFloat(g('sslc-perc')) || null,
        sslc_school: getSchoolVal('sslc-school', 'sslc-school-other'),
        hsc_year: g('hsc-year'),
        hsc_maths: parseInt(g('hsc-maths')) || null,
        hsc_physics: parseInt(g('hsc-physics')) || null,
        hsc_chem: parseInt(g('hsc-chem')) || null,
        hsc_pcm_percentage: g('hsc-pcm-perc') || null,
        hsc_marks: parseInt(g('hsc-marks')) || null,
        hsc_percentage: g('hsc-percentage') || null,
        hsc_school: getSchoolVal('hsc-school', 'hsc-school-other'),
        branch
    };

    const btn = document.getElementById('ug-submit-btn');
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
        await db.insert('ug_admissions', data);
        showToast('UG Admission submitted successfully!');
        form.reset();
        document.querySelectorAll('.toggle-pill').forEach(p => p.classList.remove('active'));
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false; btn.textContent = 'Submit Application';
    }
}

/* ================================================================
   PG FORM SUBMISSION
   ================================================================ */
async function submitPG() {
    const form = document.getElementById('pg-form');
    if (!validateForm(form)) return;

    const course = getToggleVal('course-group');
    if (!course) { showToast('Please select a course.', 'error'); return; }
    const community = getToggleVal('pg-community-group');
    if (!community) { showToast('Please select a community.', 'error'); return; }
    const gender = getToggleVal('pg-gender-group');
    if (!gender) { showToast('Please select a gender.', 'error'); return; }

    const data = {
        name: g('pg-name'),
        father_name: g('pg-father'),
        dob: g('pg-dob'),
        age: parseInt(g('pg-age')) || null,
        gender,
        community,
        address: g('pg-address'),
        parent_mobile: g('pg-parent-mobile'),
        student_mobile: g('pg-student-mobile'),
        email: g('pg-email'),
        referred_by: g('pg-referred'),
        sslc_year: g('pg-sslc-year'),
        sslc_marks: parseInt(g('pg-sslc-marks')) || null,
        sslc_percentage: parseFloat(g('pg-sslc-perc')) || null,
        sslc_school: getSchoolVal('pg-sslc-school', 'pg-sslc-school-other'),
        degree_name: g('pg-degree-name'),
        degree_year: g('pg-degree-year'),
        degree_cgpa: parseFloat(g('pg-degree-cgpa')) || null,
        degree_percentage: parseFloat(g('pg-degree-perc')) || null,
        university: g('pg-university'),
        college: g('pg-college'),
        course
    };

    const btn = document.getElementById('pg-submit-btn');
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
        await db.insert('pg_admissions', data);
        showToast('PG Admission submitted successfully!');
        form.reset();
        document.querySelectorAll('.toggle-pill').forEach(p => p.classList.remove('active'));
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false; btn.textContent = 'Submit Application';
    }
}

/* ================================================================
   LATERAL ENTRY FORM SUBMISSION
   ================================================================ */
async function submitLE() {
    const form = document.getElementById('le-form');
    if (!validateForm(form)) return;

    const branch = getToggleVal('le-branch-group');
    if (!branch) { showToast('Please select a branch.', 'error'); return; }
    const community = getToggleVal('le-community-group');
    if (!community) { showToast('Please select a community.', 'error'); return; }
    const gender = getToggleVal('le-gender-group');
    if (!gender) { showToast('Please select a gender.', 'error'); return; }

    const data = {
        name: g('le-name'),
        father_name: g('le-father'),
        dob: g('le-dob'),
        age: parseInt(g('le-age')) || null,
        gender,
        community,
        address: g('le-address'),
        parent_mobile: g('le-parent-mobile'),
        student_mobile: g('le-student-mobile'),
        email: g('le-email'),
        referred_by: g('le-referred'),
        sslc_year: g('le-sslc-year'),
        sslc_marks: parseInt(g('le-sslc-marks')) || null,
        sslc_percentage: parseFloat(g('le-sslc-perc')) || null,
        sslc_school: getSchoolVal('le-sslc-school', 'le-sslc-school-other'),
        diploma_course: g('le-diploma-course'),
        diploma_year: g('le-diploma-year'),
        diploma_percentage: parseFloat(g('le-diploma-perc')) || null,
        branch
    };

    const btn = document.getElementById('le-submit-btn');
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
        await db.insert('lateral_admissions', data);
        showToast('Lateral Entry Admission submitted successfully!');
        form.reset();
        document.querySelectorAll('.toggle-pill').forEach(p => p.classList.remove('active'));
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false; btn.textContent = 'Submit Application';
    }
}

/* ── shorthand ── */
function g(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

/* ================================================================
   UG PHASE 2 FORM SUBMISSION
   ================================================================ */
async function submitUG2() {
    const form = document.getElementById('ug2-form');
    if (!validateForm(form)) return;

    const branch = getToggleVal('ug2-branch-group');
    if (!branch) { showToast('Please select a course (BBA or BCA).', 'error'); return; }
    const community = getToggleVal('ug2-community-group');
    if (!community) { showToast('Please select a community.', 'error'); return; }
    const gender = getToggleVal('ug2-gender-group');
    if (!gender) { showToast('Please select a gender.', 'error'); return; }

    // If Others selected, grab the typed community
    const communityValue = community === 'Others'
        ? (g('ug2-community-other') || 'Others')
        : community;

    const data = {
        name: g('ug2-name'),
        father_name: g('ug2-father'),
        dob: g('ug2-dob'),
        age: parseInt(g('ug2-age')) || null,
        gender,
        community: communityValue,
        address: g('ug2-address'),
        parent_mobile: g('ug2-parent-mobile'),
        student_mobile: g('ug2-student-mobile'),
        email: g('ug2-email'),
        referred_by: g('ug2-referred'),
        sslc_year: g('ug2-sslc-year'),
        sslc_marks: parseInt(g('ug2-sslc-marks')) || null,
        sslc_percentage: parseFloat(g('ug2-sslc-perc')) || null,
        sslc_school: getSchoolVal('ug2-sslc-school', 'ug2-sslc-school-other'),
        hsc_year: g('ug2-hsc-year'),
        hsc_school: getSchoolVal('ug2-hsc-school', 'ug2-hsc-school-other'),
        sub1_name: g('ug2-sub1-name'),
        sub1_mark: parseInt(g('ug2-sub1-mark')) || null,
        sub2_name: g('ug2-sub2-name'),
        sub2_mark: parseInt(g('ug2-sub2-mark')) || null,
        sub3_name: g('ug2-sub3-name'),
        sub3_mark: parseInt(g('ug2-sub3-mark')) || null,
        main_total: parseInt(g('ug2-main-total')) || null,
        main_perc: g('ug2-main-perc'),
        hsc_total: parseInt(g('ug2-hsc-total')) || null,
        hsc_percentage: g('ug2-hsc-perc'),
        branch
    };

    const btn = document.getElementById('ug2-submit-btn');
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
        await db.insert('ug2_admissions', data);
        showToast('UG Phase 2 Admission submitted successfully!');
        form.reset();
        document.querySelectorAll('.toggle-pill').forEach(p => p.classList.remove('active'));
        document.getElementById('ug2-community-other-wrap')?.classList.remove('visible');
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false; btn.textContent = 'Submit Application';
    }
}

/* ── UG2: subject mark colour feedback ── */
function initMarkColour() {
    document.querySelectorAll('.mark-input[data-mark-threshold]').forEach(input => {
        const threshold = parseInt(input.getAttribute('data-mark-threshold'));
        input.addEventListener('input', function () {
            const val = parseInt(this.value);
            this.classList.remove('mark-pass', 'mark-fail');
            if (this.value === '') return;
            this.classList.add(val < threshold ? 'mark-fail' : 'mark-pass');
        });
    });
}

/* ── UG2: auto-total Main Subjects (3 subjects, each / 100) and Overall Perc ── */
function initUG2HscCalc() {
    // 1. Main Subjects (300 max)
    const subs = ['ug2-sub1-mark', 'ug2-sub2-mark', 'ug2-sub3-mark'];
    const mainTotalField = document.getElementById('ug2-main-total');
    const mainPercField = document.getElementById('ug2-main-perc');

    if (mainTotalField && mainPercField) {
        const recalcMain = () => {
            let sum = 0;
            let count = 0;
            subs.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.value !== '') {
                    sum += parseInt(el.value) || 0;
                    count++;
                }
            });
            mainTotalField.value = count > 0 ? sum : '';
            if (count > 0) {
                const perc = (sum / 300) * 100;
                mainPercField.value = perc.toFixed(2) + '%';
                applyPercentageColor(mainPercField, perc);
            } else {
                mainPercField.value = '';
                applyPercentageColor(mainPercField, '');
            }
        };
        subs.forEach(id => document.getElementById(id)?.addEventListener('input', recalcMain));
    }

    // 2. Overall HSC (600 max)
    const hscTotalField = document.getElementById('ug2-hsc-total');
    const hscPercField = document.getElementById('ug2-hsc-perc');
    if (hscTotalField && hscPercField) {
        hscTotalField.addEventListener('input', function () {
            const val = parseInt(this.value);
            if (!isNaN(val) && val >= 0 && val <= 600) {
                const perc = (val / 600) * 100;
                hscPercField.value = perc.toFixed(2) + '%';
                applyPercentageColor(hscPercField, perc);
            } else {
                hscPercField.value = '';
                applyPercentageColor(hscPercField, '');
            }
        });
    }
}

/* ── UG2: Community 'Others' → reveal text input ── */
function initCommunityOthers() {
    // works for any toggle-group that has a pill with data-value="Others"
    // and a sibling ".community-other-wrap" in the same parent
    document.querySelectorAll('.toggle-group .toggle-pill[data-value="Others"]').forEach(pill => {
        const group = pill.closest('.toggle-group');
        // find the wrap in the parent form-group
        const formGroup = group?.parentElement;
        const wrap = formGroup?.querySelector('.community-other-wrap');
        if (!wrap) return;

        group.addEventListener('click', (e) => {
            const clicked = e.target.closest('.toggle-pill');
            if (!clicked) return;
            if (clicked.getAttribute('data-value') === 'Others') {
                wrap.classList.add('visible');
            } else {
                wrap.classList.remove('visible');
            }
        });
    });
}

/* ================================================================
   ADMIN DASHBOARD
   ================================================================ */
const ADMIN_PASSWORD = 'admin@2026';

let adminData = { ug: [], pg: [], le: [] };
let currentTable = 'ug';
let currentDetailRow = null;

async function initAdmin() {
    // Login overlay
    const overlay = document.getElementById('login-overlay');
    const loginBtn = document.getElementById('login-btn');
    if (!overlay || !loginBtn) return;

    loginBtn.addEventListener('click', async () => {
        const pw = document.getElementById('admin-pw').value;
        if (pw !== ADMIN_PASSWORD) { showToast('Incorrect password.', 'error'); return; }
        overlay.style.display = 'none';
        await loadAllData();
    });
    document.getElementById('admin-pw').addEventListener('keydown', e => {
        if (e.key === 'Enter') loginBtn.click();
    });

    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTable = this.getAttribute('data-tab');
            renderTable(currentTable);
        });
    });

    // Filter
    document.getElementById('filter-dept')?.addEventListener('change', () => renderTable(currentTable));
    document.getElementById('search-input')?.addEventListener('input', () => renderTable(currentTable));

    // Export
    document.getElementById('export-btn')?.addEventListener('click', exportExcel);

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
    });
}

async function loadAllData() {
    try {
        const [ug, pg, le] = await Promise.all([
            db.fetchAll('ug_admissions'),
            db.fetchAll('pg_admissions'),
            db.fetchAll('lateral_admissions')
        ]);
        adminData = { ug, pg, le };
        updateStats();
        renderTable('ug');
    } catch (err) {
        showToast('Failed to load data: ' + err.message, 'error');
    }
}

function updateStats() {
    const total = adminData.ug.length + adminData.pg.length + adminData.le.length;
    setText('stat-total', total);
    setText('stat-ug', adminData.ug.length);
    setText('stat-pg', adminData.pg.length);
    setText('stat-le', adminData.le.length);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function renderTable(type) {
    let rows = adminData[type] || [];
    const deptFilter = document.getElementById('filter-dept')?.value;
    const search = document.getElementById('search-input')?.value?.toLowerCase();

    if (deptFilter) {
        rows = rows.filter(r => (r.branch || r.course || '') === deptFilter);
    }
    if (search) {
        rows = rows.filter(r =>
            (r.name || '').toLowerCase().includes(search) ||
            (r.mobile || '').includes(search) ||
            (r.email || '').toLowerCase().includes(search)
        );
    }

    const tbody = document.getElementById('admin-tbody');
    if (!tbody) return;

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state"><div class="empty-state-icon">📭</div><p>No records found</p></td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map((r, i) => {
        const dept = r.branch || r.course || '—';
        const typeBadge = type === 'ug' ? 'badge-ug' : type === 'pg' ? 'badge-pg' : 'badge-le';
        const typeLabel = type === 'ug' ? 'UG' : type === 'pg' ? 'PG' : 'LE';
        return `<tr style="cursor:pointer" onclick="openModal(${i},'${type}')">
      <td>${i + 1}</td>
      <td><strong>${r.name || '—'}</strong></td>
      <td>${r.father_name || '—'}</td>
      <td>${r.mobile || '—'}</td>
      <td>${r.email || '—'}</td>
      <td><span class="badge badge-branch">${dept}</span></td>
      <td><span class="badge ${typeBadge}">${typeLabel}</span></td>
      <td>${r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : '—'}</td>
    </tr>`;
    }).join('');
}

function openModal(index, type) {
    const row = adminData[type][index];
    if (!row) return;
    currentDetailRow = { row, type };

    const body = document.getElementById('modal-body');
    const entries = Object.entries(row).filter(([k]) => k !== 'id');
    body.innerHTML = `<div class="detail-grid">${entries.map(([k, v]) => `
    <div class="detail-item">
      <div class="detail-key">${k.replace(/_/g, ' ')}</div>
      <div class="detail-val">${v ?? '—'}</div>
    </div>`).join('')}
  </div>`;

    document.getElementById('modal-name').textContent = row.name || 'Student Details';
    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('open');
}

/* Export to Excel via SheetJS */
function exportExcel() {
    if (typeof XLSX === 'undefined') { showToast('Excel library not loaded.', 'error'); return; }

    const wb = XLSX.utils.book_new();

    ['ug', 'pg', 'le'].forEach(key => {
        if (adminData[key].length > 0) {
            const ws = XLSX.utils.json_to_sheet(adminData[key]);
            const sheetName = key === 'ug' ? 'UG Admissions' : key === 'pg' ? 'PG Admissions' : 'Lateral Entry';
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
    });

    XLSX.writeFile(wb, `Admissions_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Excel file downloaded!');
}

/* ================================================================
   INIT ON DOM READY
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initHamburger();
    populateSchoolDropdowns();
    populateCollegeDatalist();
    initAgeCalc();
    initCapsFields();
    initPercentCalc();
    initCGPACalc();
    initHscCalc();
    initToggleGroups();
    initSchoolDropdown();
    initPrint();
    initMarkColour();          // UG2 subject mark colour feedback
    initUG2HscCalc();         // UG2 subject total auto-calc
    initCommunityOthers();    // Community Others → reveal input

    // PG degree percentage calc
    const degObt = document.getElementById('pg-degree-obtained');
    const degMax = document.getElementById('pg-degree-max');
    const degPerc = document.getElementById('pg-degree-perc');
    if (degObt && degMax && degPerc) {
        const calc = () => {
            const obt = parseFloat(degObt.value);
            const max = parseFloat(degMax.value);
            if (!isNaN(obt) && !isNaN(max) && max > 0) {
                degPerc.value = ((obt / max) * 100).toFixed(2) + '%';
            }
        };
        degObt.addEventListener('input', calc);
        degMax.addEventListener('input', calc);
    }

    // Form submits
    document.getElementById('ug-submit-btn')?.addEventListener('click', submitUG);
    document.getElementById('pg-submit-btn')?.addEventListener('click', submitPG);
    document.getElementById('le-submit-btn')?.addEventListener('click', submitLE);
    document.getElementById('ug2-submit-btn')?.addEventListener('click', submitUG2);

    // Admin
    initAdmin();
});
