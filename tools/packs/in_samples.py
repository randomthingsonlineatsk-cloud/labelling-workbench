"""India samples: Ostrevia (lumiravostat) tablets, a fictional new drug made in India under a
loan licence and marketed by a fictional Indian subsidiary. Permission and licence numbers are
invented and marked as fictional."""
import copy
from lib import P, UL, T
from in_core import RMP, SCHEDULES

MFR = 'Sahyadri Formulations Pvt. Ltd., Plot 12, MIDC Example Area, Fictionpur 411000, Maharashtra, India'
MKT = 'Halcyon Ridge Pharmaceuticals India Pvt. Ltd., 5th Floor, Example Towers, Andheri (East), Mumbai 400069'
LIC = 'MH/102345'
PERM = 'Permission No. ND/IMP-MFG/2025/0123 (fictional), dated 14 March 2025'


def sec(num, title, *blocks, subs=None):
    return {'num': num, 'title': title, 'blocks': list(blocks), 'subs': subs or []}


def sub(num, title, *blocks):
    return {'num': num, 'title': title, 'blocks': list(blocks)}


def BOX(text):
    return {'id': 'box', 't': 'box', 'text': text}


META = {'proprietaryName': 'OSTREVIA', 'establishedName': 'lumiravostat', 'dosageForm': 'film-coated tablets', 'route': 'oral', 'strengths': ['10 mg', '25 mg'],
        'manufacturer': MFR, 'revised': '09/2026', 'schedule': 'H', 'h2': False, 'sizes': {'proper': 14, 'brand': 10}, 'lang': 'en'}

H = SCHEDULES['H']
BOX_H = f"{H['header']}\n{H['text'][0]}"

PI = {
    'id': 'pi', 'kind': 'in-pi', 'title': 'Package insert', 'status': 'approved', 'meta': dict(META), 'fixed': {'header': RMP},
    'sections': [
        sec('1', 'GENERIC NAME', P('Lumiravostat Tablets 10 mg / 25 mg')),
        sec('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION', P('Each film-coated tablet contains: Lumiravostat 10 mg (or 25 mg). Excipients q.s. Colour: Titanium Dioxide IP (25 mg: Iron Oxide Yellow).')),
        sec('3', 'DOSAGE FORM AND STRENGTH', P('Film-coated tablets, 10 mg and 25 mg.')),
        sec('4', 'CLINICAL PARTICULARS', subs=[
            sub('4.1', 'Therapeutic indication', P('Lumiravostat is indicated for the treatment of adults with moderate to severe chronic hand eczema not adequately controlled with potent topical corticosteroids, or when these are not advisable.')),
            sub('4.2', 'Posology and method of administration', P('10 mg orally once daily, with or without food. The dose may be increased to 25 mg once daily if the response is inadequate after 12 weeks. Hepatic impairment: 10 mg once daily in moderate impairment; not recommended in severe impairment. With strong CYP3A4 inhibitors: 10 mg once daily.')),
            sub('4.3', 'Contraindications', P('Hypersensitivity to lumiravostat or any excipient. Active tuberculosis or active serious infection. Pregnancy.')),
            sub('4.4', 'Special warnings and precautions for use', P('Serious infections, including tuberculosis, pneumonia, cellulitis and herpes zoster, have been reported. Screen for latent tuberculosis before starting treatment. Interrupt treatment if a serious infection develops.'),
                P('Malignancy, including lymphoma and non-melanoma skin cancer, and venous thromboembolism have been reported. Monitor lymphocyte and neutrophil counts, haemoglobin and liver enzymes at baseline, at 4 weeks and every 3 months.')),
            sub('4.5', 'Drug interactions', P('Strong CYP3A4 inhibitors increase exposure (use 10 mg once daily). Strong CYP3A4 inducers such as rifampicin reduce exposure; avoid concomitant use.')),
            sub('4.6', 'Use in special populations (such as pregnant women, lactating women, paediatric patients, geriatric patients etc.)', P('Pregnancy: contraindicated; women of childbearing potential should use effective contraception during treatment and for 4 weeks after the last dose. Lactation: do not breastfeed during treatment and for 4 days after the last dose. Paediatric patients: safety and efficacy not established. Geriatric patients: no dose adjustment.')),
            sub('4.7', 'Effects on ability to drive and use machines', P('No or negligible influence.')),
            sub('4.8', 'Undesirable effects', P('Very common: nasopharyngitis. Common: headache, nausea, acne, herpes zoster, lymphopenia, neutropenia, ALT increased. Uncommon: pneumonia, cellulitis, deep vein thrombosis, pulmonary embolism.'),
                P('Reporting of suspected adverse reactions: report to the marketer, or to the Pharmacovigilance Programme of India (PvPI) through the ADR reporting form or helpline.')),
            sub('4.9', 'Overdose', P('No specific antidote. Monitor and give supportive treatment.')),
        ]),
        sec('5', 'PHARMACOLOGICAL PROPERTIES', subs=[
            sub('5.1', 'Mechanism of action', P('Lumiravostat is a reversible inhibitor of the fictional STRK1 kinase.')),
            sub('5.2', 'Pharmacodynamic properties', P('Dose-dependent reductions in markers of skin inflammation within 2 weeks.')),
            sub('5.3', 'Pharmacokinetic properties', P('Peak concentrations at 1 to 2 hours; half-life about 16 hours; metabolised mainly by CYP3A4.')),
        ]),
        sec('6', 'NONCLINICAL PROPERTIES', subs=[sub('6.1', 'Animal toxicology or pharmacology', P('Not genotoxic. Embryo-fetal toxicity in rats and rabbits at exposures close to human exposure.'))]),
        sec('7', 'DESCRIPTION', P('10 mg: white, round, film-coated tablets debossed "HR" and "10". 25 mg: yellow, oval, film-coated tablets debossed "HR" and "25".')),
        sec('8', 'PHARMACEUTICAL PARTICULARS', subs=[
            sub('8.1', 'Incompatibilities', P('Not applicable.')), sub('8.2', 'Shelf-life', P('36 months.')),
            sub('8.3', 'Packaging information', P('Alu-Alu strip of 10 tablets; carton of 3 strips.')),
            sub('8.4', 'Storage and handling instructions', P('Store below 30°C. Protect from moisture. Keep out of reach of children.')),
        ]),
        sec('9', 'PATIENT COUNSELLING INFORMATION', P('Tell patients that lumiravostat can lower the ability to fight infections, including tuberculosis, and to report fever, cough or weight loss. Advise them to seek help for leg swelling, chest pain or breathlessness, to use contraception, and not to breastfeed.')),
        sec('10', 'DETAILS OF MANUFACTURER', P(f'Manufactured by: {MFR}'), P(f'Marketed by: {MKT}')),
        sec('11', 'DETAILS OF PERMISSION OR LICENCE NUMBER WITH DATE', P(PERM), P(f'Mfg. Lic. No. {LIC} (fictional)')),
        sec('12', 'DATE OF REVISION', P('September 2026')),
    ],
}


def label(kind, id, title, pack, mrp, extra_dosage=True):
    secs = [
        sec('c1', 'Symbol (Rx, NRx or XRx)', P('Rx')),
        sec('c2', 'Proper (generic) name', P('Lumiravostat Tablets 10 mg')),
        sec('c3', 'Brand name', P('OSTREVIA')),
        sec('c4', 'Composition (content of active ingredients)', P('Each film-coated tablet contains: Lumiravostat 10 mg. Excipients q.s. Colour: Titanium Dioxide IP.')),
        sec('c5', 'Dosage form and net content', P(pack)),
        sec('c6', 'Schedule caution or warning (red box)', BOX(BOX_H)),
    ]
    if extra_dosage:
        secs.append(sec('c7', 'Dosage and directions', P('Dosage: As directed by the physician.')))
    secs += [
        sec('c8', 'Storage', P('Store below 30°C. Protect from moisture. Keep out of reach of children.')),
        sec('c9', 'Manufacturer (name and address of the premises)', P(f'Manufactured by: {MFR}')),
        sec('c10', 'Manufacturing licence number', P(f'Mfg. Lic. No.: {LIC}')),
        sec('c11', 'Batch number', P('B. No.: XXXXXX')),
        sec('c12', 'Date of manufacture', P('Mfg. Date: MM/YYYY')),
        sec('c13', 'Date of expiry', P('Exp. Date: MM/YYYY')),
        sec('c14', 'Maximum retail price', P(mrp)),
        sec('c15', 'Marketed by', P(f'Marketed by: {MKT}')),
    ]
    return {'id': id, 'kind': kind, 'title': title, 'status': 'approved', 'meta': {**META, 'strengths': ['10 mg']}, 'fixed': {}, 'sections': secs}


CARTON = label('in-carton', 'carton-10', 'Carton, 10 mg, 3 x 10 tablets', '3 strips of 10 film-coated tablets', 'M.R.P. ₹ 3,750.00 for 30 tablets (inclusive of all taxes)')
STRIP = label('in-label', 'strip-10', 'Strip, 10 mg, 10 tablets', '10 film-coated tablets', 'M.R.P. ₹ 1,250.00 per strip of 10 tablets (inclusive of all taxes)', extra_dosage=False)


def find(doc, num):
    for s in doc['sections']:
        if s['num'] == num:
            return s
        for x in s.get('subs', []):
            if x['num'] == num:
                return x
    raise KeyError(num)


def drafts(*docs):
    out = copy.deepcopy(list(docs))
    for d in out:
        d['status'] = 'draft'
        d['answerKey'] = []
    return out


E_PI, E_CARTON, E_STRIP = drafts(PI, CARTON, STRIP)
K = lambda d, rule, where, what: d['answerKey'].append({'rule': rule, 'where': where, 'what': what})
E_PI['fixed']['header'] = ''
K(E_PI, 'IN-RMP', 'Top of the insert', 'The registered medical practitioner statement is missing.')
find(E_PI, '4.5')['title'] = 'Interactions'
K(E_PI, 'IN-HEAD', '4.5', 'Heading should be "Drug interactions".')
find(E_PI, '11')['blocks'] = [P('Permission No. ND/IMP-MFG/2025/0123 (fictional)')]
K(E_PI, 'IN-PERM', '11', 'The date of the permission is missing.')
find(E_PI, '4.1')['blocks'].append(P('Ostrevia is the best treatment available for hand eczema.'))
K(E_PI, 'IN-PROMO', '4.1', '"best": promotional.')
find(E_PI, '3')['blocks'] = [P('Film-coated tablets, 10 mg and 20 mg.')]
K(E_PI, 'IN-STR', '3', '20 mg is not a strength.')
find(E_PI, '12')['blocks'] = [P('')]
K(E_PI, 'IN-REQ', '12', 'No date of revision.')

find(E_CARTON, 'c1')['blocks'] = [P('')]
K(E_CARTON, 'IN-97-SYM', 'Symbol', 'Rx is missing for a Schedule H drug.')
find(E_CARTON, 'c6')['blocks'] = [P('Schedule H drug. Warning: Not to be sold by retail without the prescription of a Registered Medical Practitioner.')]
K(E_CARTON, 'IN-97-BOX', 'Schedule warning', 'Old pre-2018 wording, and not in a box.')
E_CARTON['meta']['sizes'] = {'proper': 10, 'brand': 16}
K(E_CARTON, 'IN-NAME', 'Type sizes', 'The brand name is larger than the proper name.')
find(E_CARTON, 'c11')['blocks'] = [P('Batch: XXXXXX')]
K(E_CARTON, 'IN-96-PART', 'Batch number', 'Not preceded by "B. No." or "Batch No.".')
find(E_CARTON, 'c14')['blocks'] = [P('MRP Rs. 3,750.00')]
K(E_CARTON, 'IN-MRP', 'Maximum retail price', '"inclusive of all taxes" is missing.')
find(E_CARTON, 'c13')['blocks'] = [P('')]
K(E_CARTON, 'IN-REQ', 'Date of expiry', 'No expiry date particular.')

E_STRIP['sections'] = [s for s in E_STRIP['sections'] if s['num'] != 'c14']
K(E_STRIP, 'IN-REQ', 'Maximum retail price', 'The strip is the smallest retail pack and must show the MRP.')
find(E_STRIP, 'c10')['blocks'] = [P(f'Lic: {LIC}')]
K(E_STRIP, 'IN-96-PART', 'Manufacturing licence number', 'Not preceded by "Mfg. Lic. No." or "M.L.".')

# ---------------------------------------------------------------- capstone: CDSCO directive
DIRECTIVE = {
    'from': 'CDSCO (fictional letter after a Subject Expert Committee meeting)', 'title': 'Directive: tuberculosis screening wording, Schedule H2 inclusion and revised price',
    'text': 'Following the recommendation of the Subject Expert Committee (fictional), all holders of permission for lumiravostat tablets shall, within 30 days, revise the package insert to state in 4.4 that patients must be screened for latent tuberculosis with an interferon-gamma release assay (IGRA) or tuberculin skin test, and a chest X-ray, before starting treatment, and add matching counselling in section 9. Separately, the brand has been added to Schedule H2 (fictional notification): the label must carry a QR code with the data elements of Schedule H2. The ceiling price has been revised (fictional NPPA order): the MRP becomes ₹ 3,600.00 for 30 tablets (₹ 1,200.00 per strip of 10).',
    'sections': ['Package insert 4.4', 'Package insert 9', 'Package insert 12', 'Carton: QR code and MRP', 'Strip: QR code and MRP'], 'deadlineDays': 30,
}
D_PI, D_CARTON, D_STRIP = copy.deepcopy([PI, CARTON, STRIP])
for d in (D_PI, D_CARTON, D_STRIP):
    d['meta']['h2'] = True

SAMPLES = [
    {'id': 'in-ostrevia-clean', 'region': 'in', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (India): clean package insert and labels',
     'about': 'A Schedule H new drug: the package insert in the CDSCO format, the carton and the strip, with the red-box caution, the Rx symbol, Rule 96 particulars and the MRP.',
     'docs': [PI, CARTON, STRIP]},
    {'id': 'in-ostrevia-errors', 'region': 'in', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (India): find and fix the errors',
     'about': 'The same set with 14 planted errors: the old schedule wording, a missing Rx, a brand name larger than the proper name, Rule 96 prefixes, the MRP wording, the permission date and more.',
     'docs': [E_PI, E_CARTON, E_STRIP]},
    {'id': 'in-ostrevia-directive', 'region': 'in', 'productId': 'nce-tablet', 'level': 'Capstone', 'title': 'Ostrevia (India): implement a CDSCO directive',
     'about': 'CDSCO asks for tuberculosis screening wording, the brand joins Schedule H2, and the ceiling price is revised. Update the insert, add the QR code, change the MRP on the carton and strip, approve, and record it within 30 days.',
     'docs': [D_PI, D_CARTON, D_STRIP], 'change': {'trigger': 'cdsco', 'kind': 'warning', 'title': 'CDSCO directive: TB screening, Schedule H2, revised price', 'notice': DIRECTIVE, 'markets': ['in'], 'deadlineDays': 30}},
]
