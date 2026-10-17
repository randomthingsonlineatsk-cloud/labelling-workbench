"""India pack: metadata, sources, templates, rule cards and vocabulary.

Statute and rule names are used for their factual meaning. Where the app follows common CDSCO
practice rather than a rule text it has checked word for word, the rule card says so.
"""

PACK = {
    'id': 'in',
    'name': 'India (CDSCO)',
    'short': 'IN',
    'version': '1.0.1',
    'changes': [{'version': '1.0.1', 'date': '2026-10-17', 'notes': 'Fifteen more quiz questions (every lesson now has at least eight). No rule changes.'}, {'version': '1.0.0', 'date': '2026-10-11', 'notes': 'First release (Phase 4): package insert, carton and strip, Rules 96 and 97, Schedule H2, MRP.'}],
    'asOf': '2026-10-11',
    'kinds': ['in-pi', 'in-carton', 'in-label'],
    'about': (
        'The package insert (prescribing information) of a new drug approved by CDSCO, the carton, and the '
        'label on the strip or container. Label particulars follow Rule 96 of the Drugs Rules, 1945, schedule '
        'warnings follow Rule 97 (as amended in 2018), the QR code follows Schedule H2, and the price display '
        'follows the Drugs (Prices Control) Order, 2013. Where a check follows common practice rather than a '
        'rule text, its rule card says so.'
    ),
    'watch': [
        {'id': 'h2ext', 'title': 'Schedule H2 QR codes for more products', 'src': 'h2ext',
         'text': 'The QR code requirement, in force since 1 August 2023 for the top 300 brands, is being extended: vaccines, anti-cancer and NDPS drugs from 1 July 2027 and antimicrobials from 1 July 2028. The app checks a product only when it is marked as in scope.'},
        {'id': 'excipqr', 'title': 'Excipients in QR codes', 'src': 'excipqr',
         'text': 'The Health Ministry has said it will amend the Drugs Rules so that QR codes also carry excipient details. Until the amendment is final, the app does not require them.'},
    ],
    'sources': [
        {'id': 'r96', 'title': 'Drugs Rules, 1945 (formerly Drugs and Cosmetics Rules), Rule 96: manner of labelling', 'url': 'https://cdsco.gov.in/opencms/opencms/en/Acts-and-rules/'},
        {'id': 'r97', 'title': 'Drugs and Cosmetics (Fifth Amendment) Rules, 2018: Rule 97 schedule cautions and warnings in a red box, Rx/NRx/XRx symbols (in force 1 November 2018)', 'url': 'https://business.medicaldialogues.in/labelling-norms-for-high-risk-medicines-made-stringent-check-out-details'},
        {'id': 'fdcname', 'title': 'Drugs and Cosmetics Rules amendment: proper name at least two font sizes larger than the brand name (in force 1 April 2019)', 'url': 'https://business.medicaldialogues.in/government-issues-law-for-labelling-drugs-fdcs-details'},
        {'id': 'h2', 'title': 'Drugs (Eighth Amendment) Rules, 2022: Schedule H2, QR code on the label of the top 300 brands (in force 1 August 2023)', 'url': 'https://business.medicaldialogues.in/track-and-trace-codes-for-pharma-apis-ministry-issues-gazette-cdsco-issues-notice'},
        {'id': 'h2ext', 'title': 'Schedule H2 extended to vaccines, antimicrobials, anti-cancer and NDPS drugs (2027 and 2028)', 'url': 'https://anantamias.com/current-affairs/qr-code-drug-traceability-vaccines-antimicrobials/'},
        {'id': 'excipqr', 'title': 'Health Ministry to amend the Drugs Rules for excipient details in QR codes', 'url': 'https://www.digitalhealthnews.com/union-health-ministry-to-amend-drugs-rules-for-inclusion-of-excipients-in-qr-codes'},
        {'id': 'ndct', 'title': 'New Drugs and Clinical Trials Rules, 2019 (permission for new drugs; prescribing information submitted with the application)', 'url': 'https://cdsco.gov.in/opencms/opencms/en/Acts-and-rules/New-Drugs/'},
        {'id': 'pifmt', 'title': 'Package insert format used in CDSCO-approved prescribing information (headings 1 to 12)', 'url': 'https://cdsco.gov.in/opencms/opencms/en/Drugs/New-Drugs/'},
        {'id': 'dpco', 'title': 'Drugs (Prices Control) Order, 2013: display of the maximum retail price on the label, inclusive of all taxes', 'url': 'https://www.nppaindia.nic.in/'},
        {'id': 'schj', 'title': 'Drugs Rules, 1945, Schedule J: diseases a drug may not claim to prevent or cure', 'url': 'https://en.wikipedia.org/wiki/Drugs_and_Cosmetics_Rules,_1945'},
    ],
}


def S(num, title, need='required', subs=None):
    s = {'num': num, 'title': title, 'need': need}
    if subs:
        s['fixedSubs'] = subs
    return s


def X(num, title, need='required'):
    return {'num': num, 'title': title, 'need': need}


PI_SECTIONS = [
    S('1', 'GENERIC NAME'),
    S('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION'),
    S('3', 'DOSAGE FORM AND STRENGTH'),
    S('4', 'CLINICAL PARTICULARS', subs=[
        X('4.1', 'Therapeutic indication'), X('4.2', 'Posology and method of administration'), X('4.3', 'Contraindications'),
        X('4.4', 'Special warnings and precautions for use'), X('4.5', 'Drug interactions'),
        X('4.6', 'Use in special populations (such as pregnant women, lactating women, paediatric patients, geriatric patients etc.)'),
        X('4.7', 'Effects on ability to drive and use machines'), X('4.8', 'Undesirable effects'), X('4.9', 'Overdose')]),
    S('5', 'PHARMACOLOGICAL PROPERTIES', subs=[X('5.1', 'Mechanism of action'), X('5.2', 'Pharmacodynamic properties'), X('5.3', 'Pharmacokinetic properties')]),
    S('6', 'NONCLINICAL PROPERTIES', subs=[X('6.1', 'Animal toxicology or pharmacology')]),
    S('7', 'DESCRIPTION'),
    S('8', 'PHARMACEUTICAL PARTICULARS', subs=[X('8.1', 'Incompatibilities'), X('8.2', 'Shelf-life'), X('8.3', 'Packaging information'), X('8.4', 'Storage and handling instructions')]),
    S('9', 'PATIENT COUNSELLING INFORMATION'),
    S('10', 'DETAILS OF MANUFACTURER'),
    S('11', 'DETAILS OF PERMISSION OR LICENCE NUMBER WITH DATE'),
    S('12', 'DATE OF REVISION'),
]

# Carton and strip/container label particulars. Numbered for the editor; not a statutory numbering.
CARTON_SECTIONS = [
    S('c1', 'Symbol (Rx, NRx or XRx)', 'recommended'),
    S('c2', 'Proper (generic) name'),
    S('c3', 'Brand name', 'recommended'),
    S('c4', 'Composition (content of active ingredients)'),
    S('c5', 'Dosage form and net content'),
    S('c6', 'Schedule caution or warning (red box)', 'recommended'),
    S('c7', 'Dosage and directions', 'recommended'),
    S('c8', 'Storage'),
    S('c9', 'Manufacturer (name and address of the premises)'),
    S('c10', 'Manufacturing licence number'),
    S('c11', 'Batch number'),
    S('c12', 'Date of manufacture'),
    S('c13', 'Date of expiry'),
    S('c14', 'Maximum retail price'),
    S('c15', 'Marketed by', 'optional'),
    S('c16', 'QR code (Schedule H2)', 'optional'),
]
LABEL_SECTIONS = [x for x in CARTON_SECTIONS if x['num'] not in ('c7',)]

# Rule 97 as amended in 2018: header, sentence(s) and symbol per schedule.
SCHEDULES = {
    'H': {'symbol': 'Rx', 'header': 'SCHEDULE H PRESCRIPTION DRUG – CAUTION', 'text': ['Not to be sold by retail without the prescription of a Registered Medical Practitioner.']},
    'H-NDPS': {'symbol': 'NRx', 'header': 'SCHEDULE H PRESCRIPTION DRUG – WARNING', 'text': ['To be sold by retail on the prescription of a Registered Medical Practitioner only.']},
    'H1': {'symbol': 'Rx', 'header': 'SCHEDULE H1 PRESCRIPTION DRUG – CAUTION', 'text': ['It is dangerous to take this preparation except in accordance with the medical advice.', 'Not to be sold by retail without the prescription of a Registered Medical Practitioner.']},
    'H1-NDPS': {'symbol': 'NRx', 'header': 'SCHEDULE H1 PRESCRIPTION DRUG – CAUTION', 'text': ['It is dangerous to take this preparation except in accordance with the medical advice.', 'Not to be sold by retail without the prescription of a Registered Medical Practitioner.']},
    'X': {'symbol': 'XRx', 'header': 'SCHEDULE X PRESCRIPTION DRUG – WARNING', 'text': ['To be sold by retail on the prescription of a Registered Medical Practitioner only.']},
    'G': {'symbol': '', 'header': 'SCHEDULE G PRESCRIPTION DRUG – CAUTION', 'text': ['It is dangerous to take this preparation except under medical supervision.']},
}
SCHEDULE_LABEL = {'H': 'Schedule H', 'H-NDPS': 'Schedule H (NDPS substance)', 'H1': 'Schedule H1', 'H1-NDPS': 'Schedule H1 (NDPS substance)', 'X': 'Schedule X', 'G': 'Schedule G', 'none': 'No schedule (OTC)'}

H2_FIELDS = [
    {'key': 'upic', 'label': 'Unique product identification code', 're': 'unique product identification code|UPIC'},
    {'key': 'name', 'label': 'Proper and generic name', 're': 'generic name|proper name'},
    {'key': 'brand', 'label': 'Brand name', 're': 'brand name'},
    {'key': 'mfr', 'label': 'Name and address of the manufacturer', 're': 'manufacturer'},
    {'key': 'batch', 'label': 'Batch number', 're': 'batch'},
    {'key': 'mfg', 'label': 'Date of manufacturing', 're': 'date of manufactur'},
    {'key': 'exp', 'label': 'Date of expiry', 're': 'date of expiry|expiry date'},
    {'key': 'lic', 'label': 'Manufacturing licence number', 're': 'licen[cs]e'},
]

RMP = 'For the use of a Registered Medical Practitioner or a Hospital or a Laboratory only.'

TEMPLATES = {
    'in-pi': {'kind': 'in-pi', 'label': 'Package insert (prescribing information)', 'short': 'PI', 'src': 'pifmt', 'numbered': True, 'sections': PI_SECTIONS, 'fixed': {'header': RMP}},
    'in-carton': {'kind': 'in-carton', 'label': 'Carton (India)', 'short': 'Carton', 'src': 'r96', 'sections': CARTON_SECTIONS, 'fixed': {}},
    'in-label': {'kind': 'in-label', 'label': 'Strip or container label (India)', 'short': 'Label', 'src': 'r96', 'sections': LABEL_SECTIONS, 'fixed': {}},
}


def R(id, title, text, kinds, severity, src, at, simplified=None):
    r = {'id': id, 'title': title, 'text': text, 'kinds': kinds, 'severity': severity, 'src': src, 'at': at, 'check': id}
    if simplified:
        r['simplified'] = simplified
    return r


LABELS = ['in-carton', 'in-label']
RULES = [
    R('IN-HEAD', 'Package insert headings, in order', 'The package insert uses the headings of the format CDSCO approves, in order: generic name, composition, dosage form and strength, clinical particulars (4.1 to 4.9), pharmacological properties, nonclinical properties, description, pharmaceutical particulars, patient counselling information, manufacturer, permission or licence number with date, and date of revision.', ['in-pi'], 'error', 'pifmt', 'Common format of CDSCO-approved package inserts',
      'The app checks the heading set used in CDSCO-approved inserts; check the current CDSCO format for your product type.'),
    R('IN-REQ', 'Required content is filled', 'Each required heading of the package insert, and each mandatory particular of the label, has content.', ['in-pi', *LABELS], 'error', 'r96', 'Rule 96(1)'),
    R('IN-RMP', 'Registered medical practitioner statement', 'A package insert for a prescription drug carries "For the use of a Registered Medical Practitioner or a Hospital or a Laboratory only."', ['in-pi'], 'error', 'pifmt', 'CDSCO-approved package inserts',
      'Taken from the statement on CDSCO-approved prescribing information.'),
    R('IN-PERM', 'Permission or licence number with date', 'Section 11 gives the CDSCO permission (or manufacturing licence) number and its date.', ['in-pi'], 'error', 'ndct', 'NDCT Rules 2019; CDSCO package insert format'),
    R('IN-96-PART', 'Rule 96 particulars and their prefixes', 'The label shows the batch number preceded by "B. No." or "Batch No.", the manufacturing licence number preceded by "Mfg. Lic. No." or "M.L.", and the dates of manufacture and expiry preceded by "Mfg. Date" and "Exp. Date", with the month and year.', LABELS, 'error', 'r96', 'Rule 96(1)',
      'The app checks the prefixes and the month/year form, not the exact print layout.'),
    R('IN-97-BOX', 'Schedule caution or warning in a red box', 'Drugs in Schedules G, H, H1 and X carry the caution or warning set by Rule 97 for their schedule, in legible black type inside a completely red rectangular box, on the innermost container label and every covering.', LABELS, 'error', 'r97', 'Rule 97 (Fifth Amendment Rules, 2018)'),
    R('IN-97-SYM', 'Rx, NRx or XRx symbol', 'Schedule H and H1 drugs carry Rx (NRx for narcotic or psychotropic substances), and Schedule X drugs carry XRx, conspicuously at the top left of the label, in red.', LABELS, 'error', 'r97', 'Rule 97 (Fifth Amendment Rules, 2018)',
      'The app checks the symbol text in the symbol particular; it does not check position or colour.'),
    R('IN-NAME', 'Proper name larger than the brand name', 'The proper (generic) name is printed in a font at least two sizes larger than the brand name, and the brand name comes below or after it. Vitamin FDCs and FDCs of three or more drugs are exempt.', LABELS, 'error', 'fdcname', 'Proviso to Rule 96(1)(i), in force 1 April 2019',
      '"Two font sizes larger" is checked as at least 2 points larger.'),
    R('IN-MRP', 'Maximum retail price, inclusive of all taxes', 'The label of the container and the smallest pack offered for retail sale shows the maximum retail price, with the words "inclusive of all taxes".', LABELS, 'error', 'dpco', 'DPCO 2013, display of prices',
      'The app checks the words "MRP" or "Maximum Retail Price", a rupee amount and "inclusive of all taxes".'),
    R('IN-H2', 'Schedule H2 QR code', 'For products in Schedule H2, the primary package label (or the secondary label where the primary has no space) carries a QR code encoding the unique product identification code, proper and generic name, brand name, manufacturer name and address, batch number, dates of manufacture and expiry, and manufacturing licence number.', LABELS, 'error', 'h2', 'Schedule H2 (Drugs (Eighth Amendment) Rules, 2022)',
      'The app checks that the QR particular lists each data element; it does not make a code.'),
    R('IN-STR', 'Strengths agree', 'The strength on the label and in the package insert agree with the approved product.', ['in-pi', *LABELS], 'warning', 'r96', 'Rule 96(1)'),
    R('IN-SCHJ', 'No Schedule J claims', 'Labels and inserts must not claim to prevent or cure the diseases listed in Schedule J (for example cancer, diabetes or AIDS) except where the drug is approved for it.', ['in-pi', *LABELS], 'warning', 'schj', 'Rule 106 and Schedule J',
      'The app looks for "cure" next to a few Schedule J diseases.'),
    R('IN-PROMO', 'No promotional wording', 'Prescribing information and labels state facts. Words such as "best", "safest" or "superior" do not belong in them.', ['in-pi', *LABELS], 'warning', 'r96', 'Rule 96; CDSCO approved text'),
]

PROMO = ['best', 'safest', 'superior', 'breakthrough', 'miracle', 'guaranteed', 'number one']
SCHJ = ['cancer', 'diabetes', 'AIDS', 'tuberculosis', 'blindness', 'paralysis']
