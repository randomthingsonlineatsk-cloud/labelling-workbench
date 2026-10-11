"""Core pack: company core data sheet (CCDS), change management, agency comment rounds and the
proposed one-page Patient Medication Information (PMI) template.

Every rule card cites a source. Company targets (days to submit, days to implement) are training
defaults, not regulatory deadlines, and the app says so wherever it shows them.
"""

PACK = {
    'id': 'core',
    'name': 'Core data sheet and change management',
    'short': 'Core',
    'version': '1.0.0',
    'asOf': '2026-10-11',
    'about': (
        'The company core data sheet (CCDS) and its safety subset (CCSI), mapping local labels to it, '
        'the deviation register, labelling change requests (including FDA safety labelling changes under '
        'section 505(o)(4)), agency comment rounds and implementation tracking. Company targets are '
        'training defaults; real companies set their own in their procedures.'
    ),
    'targets': {
        'submitDays': {'safety': 30, 'other': 90},
        'shipDays': 90,
        'stockOutDays': 180,
        'o4': {'respond': 30, 'discuss': 30, 'order': 15, 'afterOrder': 15},
        'note': 'Submit and implementation targets are training defaults (the same defaults as the Variations Classifier). The 505(o)(4) clocks come from the statute as described in FDA guidance; a PRAC recommendation sets its own deadline.',
    },
    'markets': [
        {'id': 'us', 'label': 'United States', 'pack': True},
        {'id': 'eu', 'label': 'European Union', 'pack': True},
        {'id': 'in', 'label': 'India', 'pack': True},
        {'id': 'ca', 'label': 'Canada', 'pack': True},
        {'id': 'ch', 'label': 'Switzerland', 'pack': True},
        {'id': 'jp', 'label': 'Japan', 'pack': True},
        {'id': 'au', 'label': 'Australia', 'pack': True},
        {'id': 'who', 'label': 'WHO prequalification', 'pack': True},
    ],
    'statuses': ['Not started', 'Wording drafted', 'Submitted', 'Approved', 'Implemented'],
    'triggers': [
        {'id': 'ccds', 'label': 'New core data sheet version', 'safety': None},
        {'id': 'signal', 'label': 'Safety signal (labelling committee decision)', 'safety': True},
        {'id': 'o4', 'label': 'FDA safety labelling change notification, 505(o)(4)', 'safety': True},
        {'id': 'rld', 'label': 'Reference listed drug labelling changed', 'safety': None},
        {'id': 'prac', 'label': 'PRAC signal recommendation (EU)', 'safety': True},
        {'id': 'psusa', 'label': 'PSUSA outcome (EU)', 'safety': True},
        {'id': 'cdsco', 'label': 'CDSCO directive (India)', 'safety': True},
        {'id': 'other', 'label': 'Other (editorial, new data)', 'safety': False},
    ],
    'kinds': [
        {'id': 'adr', 'label': 'New adverse reaction', 'safety': True},
        {'id': 'warning', 'label': 'New or strengthened warning or precaution', 'safety': True},
        {'id': 'contra', 'label': 'New contraindication', 'safety': True},
        {'id': 'dosing', 'label': 'Dosing instruction for safer use', 'safety': True},
        {'id': 'indication', 'label': 'New indication', 'safety': False},
        {'id': 'editorial', 'label': 'Editorial change', 'safety': False},
    ],
    'sources': [
        {'id': 'cioms3', 'title': 'CIOMS Working Groups III and V: Guidelines for Preparing Core Clinical-Safety Information on Drugs (2nd edition, 1999)', 'url': 'https://cioms.ch/publications/product/guidelines-for-preparing-core-clinical-safety-information-on-drugs-second-edition-report-of-cioms-working-groups-iii-and-v/'},
        {'id': 'e2c', 'title': 'ICH E2C(R2): Periodic Benefit-Risk Evaluation Report (reference safety information and the CCSI)', 'url': 'https://database.ich.org/sites/default/files/E2C_R2_Guideline.pdf'},
        {'id': 'o4', 'title': 'FDA guidance: Safety Labeling Changes, Implementation of Section 505(o)(4) of the FD&C Act (July 2013)', 'url': 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/safety-labeling-changes-implementation-section-505o4-federal-food-drug-and-cosmetic-act'},
        {'id': 'cfr31470', 'title': '21 CFR 314.70: Supplements and other changes to an approved NDA (CBE-0 for strengthening safety labelling, 314.70(c)(6)(iii))', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314/subpart-B/section-314.70'},
        {'id': 'cfr201571', 'title': '21 CFR 201.57(c)(6): Warnings and Precautions, and 201.56(a)(2): labeling must be updated when new information becomes available', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-201/subpart-B/section-201.56'},
        {'id': 'm1', 'title': 'FDA eCTD Module 1: Comprehensive Table of Contents Headings and Hierarchy (1.14 Labeling)', 'url': 'https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/electronic-common-technical-document-ectd'},
        {'id': 'pmi', 'title': 'FDA: Medication Guide; Patient Medication Information, proposed rule (88 FR 35694, 31 May 2023)', 'url': 'https://www.fda.gov/drugs/cder-conversations/patient-medication-information-2023-proposed-rule-help-patients-understand-their-prescription'},
        {'id': 'pmisum', 'title': 'Summary of the proposed PMI headings: Important Safety Information, Common Side Effects, Directions for Use', 'url': 'https://www.hlc.com/en/publications/fda-proposes-mandatory-patient-labeling-for-rx-drugs'},
        {'id': 'promo', 'title': '21 CFR 201.56(a)(2) and 208.20(b)(2): labeling must not be promotional, false or misleading', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-208/subpart-B/section-208.20'},
    ],
}


def R(id, title, text, kinds, severity, src, at, simplified=None):
    r = {'id': id, 'title': title, 'text': text, 'kinds': kinds, 'severity': severity, 'src': src, 'at': at, 'check': id}
    if simplified:
        r['simplified'] = simplified
    return r


RULES = [
    R('CORE-MAP', 'Every core safety statement is in the label or justified',
      'Each statement of the company core safety information (CCSI) should appear in the local label in substance. Where it does not, the difference is recorded in the deviation register with a justification. Non-CCSI parts of the CCDS (indications, dosing, pharmacology) may differ more freely, but the difference is still recorded.',
      ['pi', 'mg'], 'error', 'cioms3', 'CCSI and local labelling',
      'The app suggests a match by key terms in the mapped sections and asks you to confirm it. Real alignment is a judgement about meaning, made by the labelling team.'),
    R('CORE-DEV-JUST', 'A deviation needs a justification',
      'A statement marked as deviating (or not applicable) needs a written reason, for example a local agency decision, an indication not approved in this market, or a local requirement.',
      ['pi', 'mg'], 'error', 'cioms3', 'Deviations'),
    R('CORE-VERSION', 'The label is mapped to the current core data sheet',
      'When a new CCDS version becomes effective, every local label is assessed against it. A label still mapped to an older version needs an impact assessment.',
      ['pi', 'mg'], 'warning', 'cioms3', 'CCDS updates',
      'The app compares version numbers only.'),
    R('CORE-AGENCY', 'Agency comments answered and labelling agreed',
      'When the agency has commented on draft labelling, every comment needs a response (accept, partially accept, or decline with a reason), and the label is final only once the agency has agreed it.',
      ['pi', 'mg', 'ppi', 'ifu', 'carton', 'container', 'pmi'], 'error', 'o4', 'Discussion and agreement of labelling',
      'The agency comments are scripted by the app; real review is a negotiation.'),
    R('US-PMI-HEAD', 'PMI headings in the proposed order',
      'The proposed PMI has a fixed structure: the product name and use, then "Important Safety Information" with the subheadings Warnings, Do not take, Serious side effects and Tell your health care provider before taking, then "Common Side Effects", then "Directions for Use".',
      ['pmi'], 'warning', 'pmisum', 'Proposed 21 CFR 208 (2023)',
      'Proposed rule only (Watch). The app uses the headings described in public summaries of the proposal; check the final rule when it is published.'),
    R('US-PMI-LEN', 'PMI fits on one page',
      'The proposed PMI is a single page, with a 10-point minimum type size. FDA said it expects to grant waivers rarely.',
      ['pmi'], 'warning', 'pmi', 'Proposed rule, format',
      'The app estimates the page from a word count (about 520 words at 10 point on one page with headings). A real PMI is measured on the typeset page.'),
    R('US-PMI-USE', 'Directions for Use start with "Use exactly as prescribed"',
      'The Directions for Use section starts with the statement "Use exactly as prescribed", followed by how to take the product, storage and disposal.',
      ['pmi'], 'warning', 'pmisum', 'Proposed rule, Directions for Use'),
    R('US-PMI-BW', 'Boxed warning risks are in the PMI warnings',
      'The PMI is based on the prescribing information. Each risk in the boxed warning should appear under Important Safety Information, Warnings.',
      ['pmi'], 'warning', 'pmi', 'Consistency with the PI',
      'The app looks for each boxed warning heading word (for example "infection") in the Warnings subsection.'),
    R('US-PMI-PROMO', 'No promotional wording',
      'Patient labelling must not be promotional in tone, false or misleading. Words such as "best", "safest", "superior" or "breakthrough" do not belong in it.',
      ['pmi', 'mg', 'ppi', 'pi'], 'warning', 'promo', '201.56(a)(2), 208.20(b)(2)',
      'The app looks for a short list of promotional words; a reviewer judges tone as a whole.'),
    R('US-PMI-READ', 'Plain language',
      'Patient information should be written for patients. A reading level around grade 6 to 8 is a common target.',
      ['pmi'], 'info', 'pmi', 'Proposed rule, plain language',
      'Reading grade is an estimate (Flesch-Kincaid style) and is shown as a hint only.'),
]

PROMO_WORDS = ['best', 'safest', 'superior', 'breakthrough', 'revolutionary', 'miracle', 'guaranteed', 'unmatched', 'first-in-class', 'proven to cure']

# ---------------------------------------------------------------- PMI template (Watch)
PMI_TEMPLATE = {
    'kind': 'pmi', 'label': 'Patient Medication Information (proposed)', 'short': 'PMI', 'src': 'pmi', 'watch': True,
    'sections': [
        {'num': 'p0', 'title': '{name} ({established}): what it is used for', 'need': 'required'},
        {'num': 'p1', 'title': 'Important Safety Information', 'need': 'required', 'fixedSubs': [
            {'num': 'p1.1', 'title': 'Warnings', 'need': 'required'},
            {'num': 'p1.2', 'title': 'Do not take', 'need': 'required'},
            {'num': 'p1.3', 'title': 'Serious side effects', 'need': 'required'},
            {'num': 'p1.4', 'title': 'Tell your health care provider before taking', 'need': 'required'},
        ]},
        {'num': 'p2', 'title': 'Common Side Effects', 'need': 'required'},
        {'num': 'p3', 'title': 'Directions for Use', 'need': 'required'},
    ],
    'fixed': {
        'header': 'PATIENT MEDICATION INFORMATION',
        'contact': 'Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088.',
        'useStart': 'Use exactly as prescribed.',
    },
    'pageWords': 520,
}

# ---------------------------------------------------------------- Ostrevia core data sheet
# Statement targets per label kind: PI section or subsection numbers (and 'bw', 'hl'), Medication
# Guide section ids. 'terms': every group must match somewhere in the mapped text (a group is a
# regular expression of alternatives).
def S(key, heading, text, ccsi, pi, mg=None, terms=None, mg_terms=None):
    return {'key': key, 'heading': heading, 'text': text, 'ccsi': ccsi, 'targets': {'pi': pi, 'mg': mg or []},
            'terms': {'pi': terms or [], 'mg': mg_terms if mg_terms is not None else (terms or [])}}


CCDS_V3 = [
    S('ind', 'Therapeutic indications', 'Treatment of adults with moderate-to-severe chronic hand eczema inadequately controlled with, or not suitable for, topical corticosteroids.', False, ['1'], ['m2'], ['hand eczema']),
    S('dose', 'Posology', '10 mg orally once daily; may be increased to 25 mg once daily if the response is inadequate after 12 weeks. Use the lowest effective dose.', False, ['2.1'], [], ['10 mg', '25 mg', 'once daily']),
    S('dose-labs', 'Posology', 'Before starting: test for latent tuberculosis and obtain blood counts and liver enzymes. Do not start if the absolute lymphocyte count is below 500 cells/mm3 or the absolute neutrophil count is below 1,000 cells/mm3.', True, ['2.2'], [], ['tuberculosis', 'lymphocyte', 'neutrophil']),
    S('dose-hep', 'Posology', 'Moderate hepatic impairment (Child-Pugh B): 10 mg once daily. Not recommended in severe hepatic impairment.', True, ['2.3', '8.6'], [], ['Child-Pugh B|moderate hepatic', 'severe hepatic']),
    S('dose-cyp', 'Posology', 'With strong CYP3A4 inhibitors: 10 mg once daily.', True, ['2.4', '7.1'], [], ['CYP3A4 inhibitor', '10 mg']),
    S('ci-hyp', 'Contraindications', 'Hypersensitivity to lumiravostat or to any of the excipients.', True, ['4'], ['m3'], ['hypersensitivity'], ['allergic']),
    S('wp-inf', 'Special warnings and precautions', 'Serious infections, some fatal, including pneumonia, cellulitis and herpes zoster. Avoid in active serious infection; interrupt treatment if a serious infection develops.', True, ['bw', '5.1'], ['m1'], ['serious infection', 'interrupt'], ['serious infection']),
    S('wp-hz', 'Special warnings and precautions', 'Consider vaccination against herpes zoster, in line with local guidance, before starting treatment. Live vaccines should not be given during treatment.', True, ['5.1', '2.2'], [], ['vaccin', 'zoster']),
    S('wp-mal', 'Special warnings and precautions', 'Malignancies, including lymphoma and non-melanoma skin cancer, have been observed.', True, ['bw', '5.2'], ['m1'], ['lymphoma', 'skin cancer']),
    S('wp-thr', 'Special warnings and precautions', 'Thrombosis, including deep venous thrombosis and pulmonary embolism. Avoid in patients at increased risk; discontinue promptly if symptoms occur.', True, ['bw', '5.3'], ['m1'], ['thrombosis', 'pulmonary embolism'], ['blood clot', 'lungs']),
    S('wp-lab', 'Special warnings and precautions', 'Decreases in lymphocytes, neutrophils and haemoglobin, and increases in liver enzymes. Monitor at baseline, at 4 weeks and every 3 months.', True, ['5.4'], [], ['lymphocyte', 'neutrophil', 'liver enzymes']),
    S('wp-efd', 'Special warnings and precautions', 'May cause fetal harm. Females of reproductive potential should use effective contraception during treatment and for 4 weeks after the last dose.', True, ['5.5', '8.1', '8.3'], ['m4'], ['fetal', 'contraception', '4 weeks'], ['unborn baby', 'birth control', '4 weeks']),
    S('int-ind', 'Interactions', 'Avoid strong CYP3A4 inducers (reduced exposure and efficacy).', True, ['7.2'], [], ['inducer']),
    S('lact', 'Fertility, pregnancy and lactation', 'Do not breastfeed during treatment and for 4 days after the last dose.', True, ['8.2'], ['m4'], ['breastfe', '4 days']),
    S('ar-common', 'Undesirable effects', 'Very common or common adverse reactions: nasopharyngitis, headache, nausea, acne.', True, ['6.1'], ['m7'], ['nasopharyngitis', 'headache', 'nausea', 'acne'], ['common cold', 'headache', 'nausea', 'acne']),
    S('ar-renal', 'Special populations', 'No dose adjustment is needed in mild or moderate renal impairment. Not studied in severe renal impairment or end-stage renal disease.', False, ['8.7'], [], ['renal']),
    S('od', 'Overdose', 'No specific antidote. Monitor and give supportive care. Haemodialysis is not expected to remove lumiravostat.', False, ['10'], [], ['supportive', 'dialysis']),
]

HBV = S('wp-hbv', 'Special warnings and precautions',
        'Hepatitis B virus reactivation, including cases of hepatic failure, has been reported. Screen for hepatitis B infection before starting treatment. Do not start in patients with active hepatitis B. Monitor patients with evidence of past infection (HBsAg negative, anti-HBc positive) for HBV DNA during treatment, and consult a liver specialist if HBV DNA is detected.',
        True, ['2.2', '5'], ['m1', 'm4'], ['hepatitis B', 'screen|test'], ['hepatitis B'])

CCDS_V4 = [*CCDS_V3[:9], HBV, *CCDS_V3[9:]]

HYPERSENS_NOTE = 'Serious hypersensitivity reactions, including angioedema and anaphylaxis, have been reported after marketing. Discontinue treatment and treat if a serious hypersensitivity reaction occurs.'

CCDS = {
    'productId': 'nce-tablet',
    'owner': 'Halcyon Ridge Pharmaceuticals, Inc. (fictional), Global Labelling',
    'versions': [
        {'v': '3.0', 'date': '2026-08-03', 'status': 'effective', 'note': 'Thrombosis added to the core safety information after the fictional HALO-LTE signal (labelling committee, July 2026).', 'statements': CCDS_V3},
    ],
}
CCDS_WITH_V4 = {**CCDS, 'versions': [
    CCDS['versions'][0],
    {'v': '4.0', 'date': '', 'status': 'draft', 'note': 'Hepatitis B virus reactivation added after the fictional signal from postmarketing reports (labelling committee decision, September 2026). Make this version effective, then roll it out.', 'statements': CCDS_V4},
]}

# ---------------------------------------------------------------- Agency comments (scripted)
# expect: where the change must show for an "accept" to count. area: 'sec' with num ('5' means any
# subsection of 5), 'hl' with key, 'mg' with section id, 'any' for the whole label.
def C(id, where, text, expect=None, kind='revise', if_declined=None):
    c = {'id': id, 'where': where, 'kind': kind, 'text': text}
    if expect:
        c['expect'] = expect
    if if_declined:
        c['ifDeclined'] = if_declined
    return c


AGENCY = {
    'ostrevia-o4': {
        'pi': [
            C('pi-1', '5 WARNINGS AND PRECAUTIONS', 'In the new hypersensitivity subsection, state that OSTREVIA should be discontinued and appropriate treatment started if a serious hypersensitivity reaction occurs.',
              {'area': 'sec', 'num': '5', 'all': ['hypersensitivity|anaphyla|angioedema', 'discontinue']},
              if_declined='We do not agree. Prescribers need a clear action when a serious reaction occurs. Revise as requested.'),
            C('pi-2', 'Highlights, Warnings and Precautions', 'Add a Highlights bullet for hypersensitivity reactions that cites the new subsection.',
              {'area': 'hl', 'key': 'wp', 'all': ['hypersensitivity|anaphyla|angioedema']}),
            C('pi-3', '6 ADVERSE REACTIONS', 'Add a 6.2 Postmarketing Experience subsection listing angioedema and anaphylaxis, with the standard statement that these reactions are reported voluntarily from a population of uncertain size.',
              {'area': 'sec', 'num': '6.2', 'all': ['angioedema', 'anaphyla', 'voluntarily|uncertain size']}),
            C('pi-4', '14 CLINICAL STUDIES', 'Delete "OSTREVIA demonstrated superior efficacy, making it the best choice for chronic hand eczema." This is a comparative, promotional claim that is not supported by the studies described.',
              {'area': 'sec', 'num': '14', 'none': ['superior efficacy|best choice']}, kind='remove',
              if_declined='Head-to-head data are not in the application. The statement must be removed.'),
            C('pi-5', '17 PATIENT COUNSELING INFORMATION', 'Add counselling on hypersensitivity: advise patients to stop OSTREVIA and get emergency help for swelling of the face, lips or tongue, or trouble breathing.',
              {'area': 'sec', 'num': '17', 'all': ['hypersensitivity|allergic', 'swelling|breathing']}),
            C('pi-6', 'Highlights, Recent Major Changes', 'Please confirm that the new Warnings and Precautions subsection is listed under Recent Major Changes with this revision date.',
              {'area': 'hl', 'key': 'rmc', 'all': []}, kind='question'),
        ],
        'mg': [
            C('mg-1', 'What are the possible side effects', 'Add serious allergic reactions to the serious side effects, in plain language, with the symptoms (swelling of the face, lips, mouth or tongue, trouble breathing, hives) and the action (stop taking and get emergency help).',
              {'area': 'sec', 'num': 'm7', 'all': ['allergic', 'swelling', 'emergency']}),
            C('mg-2', 'Who should not take', 'No change needed to this section: the existing allergy statement covers the contraindication.', None, kind='question'),
        ],
    },
}

# Planted promotional sentence for the 505(o)(4) sample.
PROMO_SENTENCE = 'OSTREVIA demonstrated superior efficacy, making it the best choice for chronic hand eczema.'

O4_NOTICE = {
    'from': 'FDA, Division of Dermatology and Dentistry (fictional letter)',
    'date': '2026-10-01',
    'title': 'Safety labeling change notification under section 505(o)(4)',
    'text': 'Based on postmarketing reports in FAERS and the published literature (fictional), FDA has become aware of new safety information about serious hypersensitivity reactions, including angioedema and anaphylaxis, with OSTREVIA. FDA believes this information should be included in the labeling. Within 30 days, submit a prior approval supplement proposing changes to the Warnings and Precautions, Adverse Reactions and Patient Counseling Information sections and the Medication Guide, or notify FDA that you do not believe a change is warranted and give your reasons (rebuttal).',
    'sections': ['5 Warnings and Precautions (new subsection)', 'Highlights', '6.2 Postmarketing Experience', '17 Patient Counseling Information', 'Medication Guide'],
}

# Deviations already recorded on the approved labels (used by the samples that start mapped).
MAPPED_ROWS = {
    'pi': {
        'wp-hz': {'status': 'deviates', 'justification': 'Proposed for 5.1 in the 2023 review; FDA asked for vaccination advice to follow ACIP guidance by reference only. Re-proposal planned with the next safety supplement (fictional).'},
        'ar-renal': {'status': 'deviates', 'justification': 'Renal impairment data were not reviewed for the US application; FDA did not include an 8.7 subsection (fictional review history).'},
    },
    'mg': {},
}

SAMPLES = [
    {
        'id': 'ostrevia-ccds', 'base': 'ostrevia-clean', 'productId': 'nce-tablet', 'level': 'Core',
        'title': 'Ostrevia: map the label to the core data sheet',
        'about': 'The approved Ostrevia labels and CCDS 3.0. Map each core statement to the prescribing information and the Medication Guide, confirm the matches, and record a justified deviation wherever the US label differs.',
        'ccds': CCDS, 'docs': ['pi', 'mg', 'carton', 'container'], 'approved': True,
    },
    {
        'id': 'ostrevia-ccds4', 'base': 'ostrevia-clean', 'productId': 'nce-tablet', 'level': 'Core',
        'title': 'Ostrevia: roll out CCDS 4.0 (hepatitis B reactivation)',
        'about': 'CCDS 4.0 is in draft with a new hepatitis B reactivation warning. Make it effective, start the change request from the impact list, update the prescribing information and Medication Guide, take them to approval and track implementation in every market.',
        'ccds': CCDS_WITH_V4, 'docs': ['pi', 'mg'], 'mapped': '3.0', 'mappedRows': MAPPED_ROWS, 'approved': True,
    },
    {
        'id': 'ostrevia-o4', 'base': 'ostrevia-clean', 'productId': 'nce-tablet', 'level': 'Core',
        'title': 'Ostrevia: respond to a 505(o)(4) notification',
        'about': 'FDA has notified Halcyon Ridge (fictional) of new safety information on serious hypersensitivity reactions. Decide your response within the 30-day clock, draft the changes, submit, and work through the agency comments until the labelling is agreed.',
        'ccds': CCDS, 'docs': ['pi', 'mg'], 'mapped': '3.0', 'mappedRows': MAPPED_ROWS, 'approved': True,
        'patch': [{'doc': 'pi', 'num': '14', 'append': PROMO_SENTENCE}],
        'change': {'trigger': 'o4', 'kind': 'warning', 'title': 'Serious hypersensitivity reactions (505(o)(4) notification)', 'notice': O4_NOTICE, 'markets': ['us']},
    },
    {
        'id': 'ostrevia-pmi', 'base': 'ostrevia-clean', 'productId': 'nce-tablet', 'level': 'Watch',
        'title': 'Ostrevia: write a one-page PMI (proposed rule)',
        'about': 'FDA has proposed a one-page Patient Medication Information sheet (not final). Write one for Ostrevia from its prescribing information and Medication Guide: the fixed headings, every boxed warning risk, plain language, one page.',
        'ccds': None, 'docs': ['pi', 'mg'], 'blank': ['pmi'],
    },
]
