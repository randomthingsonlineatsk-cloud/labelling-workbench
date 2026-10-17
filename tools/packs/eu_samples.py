"""EU samples: Ostrevia (lumiravostat), a fictional centrally authorised product. The clean set
matches the US labels in substance; the other samples plant errors or set up a scenario."""
import copy
from lib import P, UL, T
from eu_core import BT_SMPC, BT_PL, REPORT_SMPC, REPORT_PL, READ_FIRST, A2_PSUR, A2_RMP

MAH = 'Halcyon Ridge Pharmaceuticals Europe B.V.'
MAH_ADDR = 'Fictieweg 21, 3000 CC Voorbeeldhaven, Netherlands'
MFR = 'Halcyon Ridge Manufacturing Ireland Ltd., Unit 9, Sample Industrial Estate, Exampleford, Ireland'
MA = ['EU/1/23/9901/001', 'EU/1/23/9901/002', 'EU/1/23/9901/003', 'EU/1/23/9901/004']


def sec(num, title, *blocks, subs=None):
    return {'num': num, 'title': title, 'blocks': list(blocks), 'subs': subs or []}


def sub(num, title, *blocks):
    return {'num': num, 'title': title, 'blocks': list(blocks)}


META = {'proprietaryName': 'Ostrevia', 'establishedName': 'lumiravostat', 'dosageForm': 'film-coated tablets', 'route': 'oral',
        'strengths': ['10 mg', '25 mg'], 'manufacturer': MAH, 'revised': '08/2026', 'additionalMonitoring': True,
        'excipients': [{'key': 'sodium', 'amount': '0.6 mg', 'per': 'tablet'}], 'lang': 'en', 'procedure': 'centralised', 'maNumber': 'EU/1/23/9901/001-004'}

SODIUM = 'This medicine contains less than 1 mmol sodium (23 mg) per tablet, that is to say essentially ‘sodium-free’.'

SMPC = {
    'id': 'smpc', 'kind': 'smpc', 'title': 'Summary of Product Characteristics', 'status': 'approved', 'meta': dict(META),
    'fixed': {'header': 'ANNEX I: SUMMARY OF PRODUCT CHARACTERISTICS', 'blackTriangle': BT_SMPC},
    'sections': [
        sec('1', 'NAME OF THE MEDICINAL PRODUCT', P('Ostrevia 10 mg film-coated tablets'), P('Ostrevia 25 mg film-coated tablets')),
        sec('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION',
            P('Ostrevia 10 mg film-coated tablets: each film-coated tablet contains 10 mg lumiravostat.'),
            P('Ostrevia 25 mg film-coated tablets: each film-coated tablet contains 25 mg lumiravostat.'),
            P('For the full list of excipients, see section 6.1.')),
        sec('3', 'PHARMACEUTICAL FORM', P('Film-coated tablet (tablet).'),
            P('10 mg: white, round, film-coated tablet, debossed with "HR" on one side and "10" on the other.'),
            P('25 mg: yellow, oval, film-coated tablet, debossed with "HR" on one side and "25" on the other.')),
        sec('4', 'CLINICAL PARTICULARS', subs=[
            sub('4.1', 'Therapeutic indications', P('Ostrevia is indicated for the treatment of adults with moderate to severe chronic hand eczema who have had an inadequate response to, or for whom treatment with, potent topical corticosteroids is not advisable.')),
            sub('4.2', 'Posology and method of administration',
                P('Treatment should be started and supervised by a physician experienced in the diagnosis and treatment of chronic hand eczema.'),
                P('Posology: the recommended dose is 10 mg once daily. The dose may be increased to 25 mg once daily if the response is inadequate after 12 weeks. The lowest effective dose should be used.'),
                P('Before starting treatment, patients should be tested for latent tuberculosis, and a full blood count and liver enzymes obtained. Treatment should not be started in patients with an absolute lymphocyte count below 0.5 × 10⁹ cells/L or an absolute neutrophil count below 1 × 10⁹ cells/L.'),
                P('Hepatic impairment: 10 mg once daily in moderate hepatic impairment (Child-Pugh B). Not recommended in severe hepatic impairment (Child-Pugh C).'),
                P('Concomitant strong CYP3A4 inhibitors: 10 mg once daily (see section 4.5).'),
                P('Paediatric population: the safety and efficacy of Ostrevia in children and adolescents below 18 years of age have not been established. No data are available.'),
                P('Method of administration: oral use. The tablets are taken with or without food and are swallowed whole.')),
            sub('4.3', 'Contraindications', P('Hypersensitivity to the active substance or to any of the excipients listed in section 6.1.'), P('Active tuberculosis or active serious infections (see section 4.4).'), P('Pregnancy (see section 4.6).')),
            sub('4.4', 'Special warnings and precautions for use',
                P('Serious infections: serious and sometimes fatal infections, including pneumonia, cellulitis and herpes zoster, have been reported. Ostrevia should be interrupted if a patient develops a serious infection until the infection is controlled. Vaccination against herpes zoster should be considered before starting treatment.'),
                P('Malignancy: malignancies, including lymphoma and non-melanoma skin cancer, have been observed. Periodic skin examination is recommended.'),
                P('Venous thromboembolism: deep vein thrombosis and pulmonary embolism have been reported. Ostrevia should be used with caution in patients with risk factors for venous thromboembolism and discontinued promptly if symptoms occur.'),
                P('Laboratory abnormalities: lymphocyte and neutrophil counts, haemoglobin and liver enzymes should be monitored at baseline, at 4 weeks and every 3 months thereafter.'),
                P('Excipients: ' + SODIUM)),
            sub('4.5', 'Interaction with other medicinal products and other forms of interaction',
                P('Lumiravostat is metabolised mainly by CYP3A4. Strong CYP3A4 inhibitors (for example ketoconazole) increase exposure; the dose should be 10 mg once daily. Strong CYP3A4 inducers (for example rifampicin) decrease exposure and may reduce efficacy; concomitant use is not recommended.')),
            sub('4.6', 'Fertility, pregnancy and lactation',
                P('Women of childbearing potential: effective contraception should be used during treatment and for 4 weeks after the last dose.'),
                P('Pregnancy: there are no data from the use of lumiravostat in pregnant women. Studies in animals have shown reproductive toxicity (see section 5.3). Ostrevia is contraindicated during pregnancy.'),
                P('Breast-feeding: lumiravostat is excreted in the milk of rats. A risk to the breast-fed child cannot be excluded. Ostrevia should not be used during breast-feeding and for 4 days after the last dose.'),
                P('Fertility: no effect on fertility was seen in animal studies.')),
            sub('4.7', 'Effects on ability to drive and use machines', P('Ostrevia has no or negligible influence on the ability to drive and use machines.')),
            sub('4.8', 'Undesirable effects',
                P('Summary of the safety profile: the most common adverse reactions were nasopharyngitis (12%), headache (9%), nausea (7%) and acne (6%).'),
                P('Tabulated list of adverse reactions: adverse reactions are listed by MedDRA system organ class and frequency: very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100), rare (≥1/10,000 to <1/1,000), very rare (<1/10,000), not known (cannot be estimated from the available data).'),
                T(['System organ class', 'Very common', 'Common', 'Uncommon'],
                  ['Infections and infestations', 'Nasopharyngitis', 'Herpes zoster', 'Pneumonia, cellulitis'],
                  ['Nervous system disorders', '', 'Headache', ''],
                  ['Vascular disorders', '', '', 'Deep vein thrombosis, pulmonary embolism'],
                  ['Gastrointestinal disorders', '', 'Nausea', ''],
                  ['Skin and subcutaneous tissue disorders', '', 'Acne', ''],
                  ['Investigations', '', 'Lymphopenia, neutropenia, ALT increased', '']),
                P('Reporting of suspected adverse reactions'), P(REPORT_SMPC)),
            sub('4.9', 'Overdose', P('There is no specific antidote. In case of overdose, the patient should be monitored for signs and symptoms of adverse reactions and supportive treatment given. Haemodialysis is not expected to remove lumiravostat.')),
        ]),
        sec('5', 'PHARMACOLOGICAL PROPERTIES', subs=[
            sub('5.1', 'Pharmacodynamic properties', P('Pharmacotherapeutic group: immunosuppressants, ATC code: not yet assigned.'), P('Mechanism of action: lumiravostat is a reversible inhibitor of the fictional STRK1 kinase.'),
                P('Clinical efficacy: in two 16-week placebo-controlled studies (HALO-1 and HALO-2, 612 patients), an IGA score of 0 or 1 with at least a 2-grade improvement at week 16 was reached by 36% to 48% of patients on Ostrevia and 13% to 15% on placebo.')),
            sub('5.2', 'Pharmacokinetic properties', P('Peak plasma concentrations are reached 1 to 2 hours after an oral dose. The mean terminal half-life is about 16 hours. Lumiravostat is metabolised mainly by CYP3A4.')),
            sub('5.3', 'Preclinical safety data', P('Lumiravostat was not genotoxic. Embryo-fetal toxicity was seen in rats and rabbits at exposures close to human exposure.')),
        ]),
        sec('6', 'PHARMACEUTICAL PARTICULARS', subs=[
            sub('6.1', 'List of excipients', P('Tablet core: microcrystalline cellulose, croscarmellose sodium, magnesium stearate.'), P('Film-coating: hypromellose, titanium dioxide (E171); 25 mg only: iron oxide yellow (E172).')),
            sub('6.2', 'Incompatibilities', P('Not applicable.')),
            sub('6.3', 'Shelf life', P('3 years.')),
            sub('6.4', 'Special precautions for storage', P('This medicinal product does not require any special storage conditions.')),
            sub('6.5', 'Nature and contents of container', P('PVC/aluminium blisters. Pack sizes of 28 and 84 film-coated tablets. Not all pack sizes may be marketed.')),
            sub('6.6', 'Special precautions for disposal <and other handling>', P('Any unused medicinal product or waste material should be disposed of in accordance with local requirements.')),
        ]),
        sec('7', 'MARKETING AUTHORISATION HOLDER', P(MAH), P(MAH_ADDR)),
        sec('8', 'MARKETING AUTHORISATION NUMBER(S)', *[P(x) for x in MA]),
        sec('9', 'DATE OF FIRST AUTHORISATION/RENEWAL OF THE AUTHORISATION', P('Date of first authorisation: 20 June 2023')),
        sec('10', 'DATE OF REVISION OF THE TEXT', P('August 2026')),
    ],
}

PL = {
    'id': 'pl', 'kind': 'pl', 'title': 'Package leaflet', 'status': 'approved', 'meta': dict(META),
    'fixed': {'header': 'Package leaflet: Information for the patient', 'nameLine': 'Ostrevia 10 mg film-coated tablets\nOstrevia 25 mg film-coated tablets\nlumiravostat',
              'blackTriangle': BT_PL, 'readFirst': READ_FIRST, 'lastRevised': 'This leaflet was last revised in August 2026.'},
    'sections': [
        sec('pl1', '1. What Ostrevia is and what it is used for', P('Ostrevia contains the active substance lumiravostat. It works by calming the part of the immune system that causes inflammation of the skin.'),
            P('Ostrevia is used to treat adults with long-lasting (chronic) hand eczema that is moderate to severe, when strong steroid creams have not worked well enough or cannot be used.')),
        sec('pl2', '2. What you need to know before you take Ostrevia', subs=[
            sub('pl2.1', 'Do not take Ostrevia', UL('if you are allergic to lumiravostat or any of the other ingredients of this medicine (listed in section 6)', 'if you have active tuberculosis (TB) or another serious infection', 'if you are pregnant')),
            sub('pl2.2', 'Warnings and precautions', P('Talk to your doctor or pharmacist before taking Ostrevia if you:'),
                UL('have an infection, or keep getting infections. Ostrevia can lower your body’s ability to fight infections.', 'have had TB or been in close contact with someone with TB. Your doctor will test you for TB before you start.', 'have had cancer, or get new skin growths', 'have had blood clots in your legs or lungs', 'have liver problems'),
                P('Tell your doctor straight away if you get a fever, chills, cough, leg pain or swelling, chest pain or sudden shortness of breath.'),
                P('You will have blood tests before you start and while you take Ostrevia.')),
            sub('pl2.3', 'Children and adolescents', P('Do not give this medicine to children and adolescents under 18 years because it has not been studied in this age group.')),
            sub('pl2.4', 'Other medicines and Ostrevia', P('Tell your doctor or pharmacist if you are taking, have recently taken or might take any other medicines, especially medicines for fungal infections (such as ketoconazole) or tuberculosis (such as rifampicin).')),
            sub('pl2.6', 'Pregnancy and breast-feeding', P('Do not take Ostrevia if you are pregnant. It may harm your unborn baby. If you can become pregnant, use effective contraception while taking Ostrevia and for 4 weeks after your last dose.'),
                P('Do not breast-feed while taking Ostrevia and for 4 days after your last dose.')),
            sub('pl2.7', 'Driving and using machines', P('Ostrevia is not expected to affect your ability to drive or use machines.')),
            sub('pl2.8', 'Ostrevia contains sodium', P(SODIUM)),
        ]),
        sec('pl3', '3. How to take Ostrevia', P('Always take this medicine exactly as your doctor or pharmacist has told you. Check with your doctor or pharmacist if you are not sure.'),
            P('The recommended dose is one 10 mg tablet once a day. Your doctor may increase it to one 25 mg tablet once a day after 12 weeks. Swallow the tablet whole, with or without food.'),
            subs=[sub('pl3.1', 'If you take more Ostrevia than you should', P('Talk to a doctor or pharmacist straight away.')),
                  sub('pl3.2', 'If you forget to take Ostrevia', P('Take it as soon as you remember on the same day. Do not take a double dose to make up for a forgotten tablet.')),
                  sub('pl3.3', 'If you stop taking Ostrevia', P('Talk to your doctor before you stop. Your eczema may come back.'), P('If you have any further questions on the use of this medicine, ask your doctor or pharmacist.'))]),
        sec('pl4', '4. Possible side effects', P('Like all medicines, this medicine can cause side effects, although not everybody gets them.'),
            P('Serious side effects. Tell your doctor straight away if you notice: signs of a serious infection (fever, chills, cough, burning when passing urine); signs of a blood clot (leg pain or swelling, chest pain, sudden shortness of breath).'),
            P('Very common (may affect more than 1 in 10 people): common cold.'), P('Common (may affect up to 1 in 10 people): headache, feeling sick (nausea), acne, shingles (herpes zoster), changes in blood tests.'),
            P('Uncommon (may affect up to 1 in 100 people): pneumonia, skin infection (cellulitis), blood clots in the legs or lungs.'),
            subs=[sub('pl4.1', 'Reporting of side effects', P(REPORT_PL))]),
        sec('pl5', '5. How to store Ostrevia', P('Keep this medicine out of the sight and reach of children.'), P('Do not use this medicine after the expiry date which is stated on the carton and blister after EXP. The expiry date refers to the last day of that month.'),
            P('This medicine does not require any special storage conditions.'), P('Do not throw away any medicines via wastewater or household waste. Ask your pharmacist how to throw away medicines you no longer use. These measures will help protect the environment.')),
        sec('pl6', '6. Contents of the pack and other information', subs=[
            sub('pl6.1', 'What Ostrevia contains', P('The active substance is lumiravostat. Each film-coated tablet contains 10 mg or 25 mg of lumiravostat.'), P('The other ingredients are microcrystalline cellulose, croscarmellose sodium, magnesium stearate, hypromellose, titanium dioxide (E171) and, in the 25 mg tablet, iron oxide yellow (E172). See section 2 "Ostrevia contains sodium".')),
            sub('pl6.2', 'What Ostrevia looks like and contents of the pack', P('Ostrevia 10 mg are white, round tablets marked "HR" and "10". Ostrevia 25 mg are yellow, oval tablets marked "HR" and "25". Packs of 28 or 84 tablets in blisters. Not all pack sizes may be marketed.')),
            sub('pl6.3', 'Marketing Authorisation Holder and Manufacturer', P(f'Marketing Authorisation Holder: {MAH}, {MAH_ADDR}'), P(f'Manufacturer: {MFR}')),
        ]),
    ],
}


def outer(strength, pack, ma, pc):
    return {
        'id': f'outer-{strength.split()[0]}', 'kind': 'eu-outer', 'title': f'Outer carton, {strength}, {pack}', 'status': 'approved', 'meta': {**META, 'strengths': [strength]},
        'fixed': {'header': 'PARTICULARS TO APPEAR ON THE OUTER PACKAGING'},
        'sections': [
            sec('1', 'NAME OF THE MEDICINAL PRODUCT', P(f'Ostrevia {strength} film-coated tablets'), P('lumiravostat')),
            sec('2', 'STATEMENT OF ACTIVE SUBSTANCE(S)', P(f'Each film-coated tablet contains {strength} lumiravostat.')),
            sec('3', 'LIST OF EXCIPIENTS', P('Contains sodium. See the package leaflet for further information.')),
            sec('4', 'PHARMACEUTICAL FORM AND CONTENTS', P(f'Film-coated tablet. {pack}')),
            sec('5', 'METHOD AND ROUTE(S) OF ADMINISTRATION', P('Read the package leaflet before use.'), P('Oral use.')),
            sec('6', 'SPECIAL WARNING THAT THE MEDICINAL PRODUCT MUST BE STORED OUT OF THE SIGHT AND REACH OF CHILDREN', P('Keep out of the sight and reach of children.')),
            sec('8', 'EXPIRY DATE', P('EXP')),
            sec('11', 'NAME AND ADDRESS OF THE MARKETING AUTHORISATION HOLDER', P(MAH), P(MAH_ADDR)),
            sec('12', 'MARKETING AUTHORISATION NUMBER(S)', P(ma)),
            sec('13', 'BATCH NUMBER', P('Lot')),
            sec('16', 'INFORMATION IN BRAILLE', P(f'ostrevia {strength}')),
            sec('17', 'UNIQUE IDENTIFIER - 2D BARCODE', P('2D barcode carrying the unique identifier included.')),
            sec('18', 'UNIQUE IDENTIFIER - HUMAN READABLE DATA', P(f'PC {pc}'), P('SN'), P('NN')),
        ],
    }


OUTER = outer('10 mg', '28 film-coated tablets', MA[0], '09990001234567')

BLISTER = {
    'id': 'blister-10', 'kind': 'eu-blister', 'title': 'Blister, 10 mg', 'status': 'approved', 'meta': {**META, 'strengths': ['10 mg']},
    'fixed': {'header': 'MINIMUM PARTICULARS TO APPEAR ON BLISTERS OR STRIPS'},
    'sections': [sec('1', 'NAME OF THE MEDICINAL PRODUCT', P('Ostrevia 10 mg tablets'), P('lumiravostat')), sec('2', 'NAME OF THE MARKETING AUTHORISATION HOLDER', P('Halcyon Ridge')),
                 sec('3', 'EXPIRY DATE', P('EXP')), sec('4', 'BATCH NUMBER', P('Lot'))],
}


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
    return out


# ---------------------------------------------------------------- error hunt
ANNEX2 = {
    'id': 'annex2', 'kind': 'eu-annex2', 'title': 'Annex II', 'status': 'approved', 'meta': dict(META), 'fixed': {'header': 'ANNEX II'},
    'sections': [
        sec('A', 'A. MANUFACTURER(S) RESPONSIBLE FOR BATCH RELEASE', P('Name and address of the manufacturer(s) responsible for batch release'), P(MFR)),
        sec('B', 'B. CONDITIONS OR RESTRICTIONS REGARDING SUPPLY AND USE', P('Medicinal product subject to medical prescription.')),
        sec('C', 'C. OTHER CONDITIONS AND REQUIREMENTS OF THE MARKETING AUTHORISATION', subs=[sub('C.1', 'Periodic safety update reports (PSURs)', P(A2_PSUR))]),
        sec('D', 'D. CONDITIONS OR RESTRICTIONS WITH REGARD TO THE SAFE AND EFFECTIVE USE OF THE MEDICINAL PRODUCT', subs=[sub('D.1', 'Risk management plan (RMP)', P(A2_RMP))]),
    ],
}

ERR_SMPC, ERR_PL, ERR_OUTER, ERR_BLISTER, ERR_ANNEX2 = drafts(SMPC, PL, OUTER, BLISTER, ANNEX2)
for d in (ERR_SMPC, ERR_PL, ERR_OUTER, ERR_BLISTER, ERR_ANNEX2):
    d['answerKey'] = []
K = lambda d, rule, where, what: d['answerKey'].append({'rule': rule, 'where': where, 'what': what})

ERR_SMPC['fixed']['blackTriangle'] = ''
K(ERR_SMPC, 'EU-BT', 'Start of the SmPC', 'The black triangle statement was removed, but Ostrevia is under additional monitoring.')
find(ERR_SMPC, '4.5')['title'] = 'Interactions'
K(ERR_SMPC, 'EU-HEAD', '4.5', 'Heading shortened to "Interactions".')
find(ERR_SMPC, '4.8')['blocks'] = find(ERR_SMPC, '4.8')['blocks'][:3]
K(ERR_SMPC, 'EU-48-REPORT', '4.8', 'The reporting statement pointing to Appendix V is gone.')
find(ERR_SMPC, '4.8')['blocks'][0]['text'] = 'Summary of the safety profile: nasopharyngitis and headache were frequent; acne occurred occasionally.'
K(ERR_SMPC, 'EU-48-FREQ', '4.8', '"frequent" and "occasionally" are not frequency categories.')
find(ERR_SMPC, '4.4')['blocks'] = find(ERR_SMPC, '4.4')['blocks'][:4]
K(ERR_SMPC, 'EU-EXC', '4.4', 'The sodium statement is missing.')
find(ERR_SMPC, '1')['blocks'][1]['text'] = 'Ostrevia 20 mg film-coated tablets'
K(ERR_SMPC, 'EU-STR', '1', '20 mg is not a strength of Ostrevia.')
find(ERR_SMPC, '10')['blocks'] = [P('')]
K(ERR_SMPC, 'EU-REQ', '10', 'No date of revision.')
find(ERR_SMPC, '5.1')['blocks'].append(P('Ostrevia offers superior efficacy compared with other systemic treatments.'))
K(ERR_SMPC, 'EU-PROMO', '5.1', '"superior": a comparative, promotional claim.')

ERR_PL['fixed']['readFirst'] = ''
K(ERR_PL, 'EU-PL-STD', 'Start of the leaflet', 'The "Read all of this leaflet carefully" box is missing.')
ERR_PL['fixed']['blackTriangle'] = ''
K(ERR_PL, 'EU-BT', 'Start of the leaflet', 'The black triangle statement is missing.')
find(ERR_PL, 'pl2.1')['blocks'] = [UL('if you have active tuberculosis (TB) or another serious infection', 'if you are pregnant')]
K(ERR_PL, 'EU-PL-CONSIST', 'Do not take Ostrevia', 'The allergy contraindication in SmPC 4.3 is not in the leaflet.')
find(ERR_PL, 'pl4.1')['blocks'] = [P('If you get any side effects, talk to your doctor or pharmacist.')]
K(ERR_PL, 'EU-PL-STD', 'Reporting of side effects', 'Appendix V and the reporting text are missing.')
find(ERR_PL, 'pl2')['subs'] = [x for x in find(ERR_PL, 'pl2')['subs'] if x['num'] != 'pl2.8']
K(ERR_PL, 'EU-EXC', 'Section 2', '"Ostrevia contains sodium" and its statement are missing.')
find(ERR_PL, 'pl3')['title'] = '3. Dosage'
K(ERR_PL, 'EU-HEAD', 'Section 3', 'Heading should be "3. How to take Ostrevia".')
ERR_PL['fixed']['lastRevised'] = 'This leaflet was last revised in'
K(ERR_PL, 'EU-DATE', 'End of the leaflet', 'The month and year are missing.')

find(ERR_OUTER, '6')['blocks'] = [P('Keep out of reach of children.')]
K(ERR_OUTER, 'EU-LAB-CHILD', '6', 'Not the required wording.')
find(ERR_OUTER, '16')['blocks'] = [P('')]
K(ERR_OUTER, 'EU-BRAILLE', '16', 'No Braille text.')
find(ERR_OUTER, '17')['blocks'] = [P('')]
K(ERR_OUTER, 'EU-SF', '17', 'The 2D barcode statement is missing.')
find(ERR_OUTER, '18')['blocks'] = [P('PC 09990001234567')]
K(ERR_OUTER, 'EU-SF', '18', 'SN (and NN) lines are missing.')
find(ERR_OUTER, '12')['blocks'] = [P('EU/1/23/9901/005')]
K(ERR_OUTER, 'EU-LAB-PART', '12', 'Not one of the authorisation numbers in SmPC section 8.')

find(ERR_BLISTER, '2')['blocks'] = [P('')]
K(ERR_BLISTER, 'EU-REQ', '2', 'The marketing authorisation holder is missing.')
find(ERR_BLISTER, '4')['blocks'] = [P('Batch')]
K(ERR_BLISTER, 'EU-SMALL', '4', 'The batch number is not preceded by "Lot".')
find(ERR_ANNEX2, 'B')['blocks'] = [P('')]
K(ERR_ANNEX2, 'EU-REQ', 'B', 'The conditions on supply and use are empty.')
K(ERR_ANNEX2, 'EU-A2', 'B', 'No legal status for supply.')
find(ERR_ANNEX2, 'C.1')['blocks'] = [P('PSURs are to be submitted every six months.')]
K(ERR_ANNEX2, 'EU-A2', 'C.1', 'Not the standard PSUR statement (EURD list, Article 107c(7)).')

# ---------------------------------------------------------------- small immediate packaging: a vial label
VIAL_META = {'proprietaryName': 'Nelvaprox', 'establishedName': 'velnaprozine', 'dosageForm': 'solution for injection', 'route': 'intravenous', 'strengths': ['10 mg/mL'],
             'manufacturer': 'Halcyon Ridge Pharmaceuticals Europe B.V.', 'revised': '', 'additionalMonitoring': False, 'excipients': [], 'lang': 'en', 'procedure': 'centralised', 'maNumber': 'EU/1/21/9904/001'}
VIAL = {
    'id': 'vial', 'kind': 'eu-small', 'title': 'Vial label, 10 mg/mL, 5 mL', 'status': 'approved', 'meta': VIAL_META,
    'fixed': {'header': 'MINIMUM PARTICULARS TO APPEAR ON SMALL IMMEDIATE PACKAGING UNITS'},
    'sections': [
        sec('1', 'NAME OF THE MEDICINAL PRODUCT AND ROUTE(S) OF ADMINISTRATION', P('Nelvaprox 10 mg/mL solution for injection'), P('velnaprozine'), P('IV')),
        sec('2', 'METHOD OF ADMINISTRATION', P('Dilute before use.')),
        sec('3', 'EXPIRY DATE', P('EXP')),
        sec('4', 'BATCH NUMBER', P('Lot')),
        sec('5', 'CONTENTS BY WEIGHT, BY VOLUME OR BY UNIT', P('50 mg/5 mL')),
    ],
}
ERR_VIAL, = drafts(VIAL)
ERR_VIAL['answerKey'] = []
find(ERR_VIAL, '1')['blocks'] = [P('Nelvaprox 10 mg/mL solution for injection'), P('velnaprozine')]
K(ERR_VIAL, 'EU-SMALL', '1', 'The route of administration is missing from the name.')
find(ERR_VIAL, '3')['blocks'] = [P('Use by')]
K(ERR_VIAL, 'EU-SMALL', '3', 'The expiry date is not preceded by "EXP".')
find(ERR_VIAL, '5')['blocks'] = [P('5 mL'), P('10 mg/mL')]

# ---------------------------------------------------------------- user test
UT_PL = drafts(PL)[0]
UT_PL['id'] = 'pl'
find(UT_PL, 'pl2.2')['blocks'] = [P('Prior to initiation of therapy with Ostrevia, it is imperative that you inform your physician or pharmacist should you have a current infection or recurrent infections, a history of tuberculosis or close contact with an individual with tuberculosis, a history of malignancy or new cutaneous lesions, prior thromboembolic events affecting the lower limbs or pulmonary vasculature, or hepatic dysfunction, since lumiravostat-mediated immunomodulation may predispose to such events.')]
find(UT_PL, 'pl3')['blocks'][1]['text'] = 'The posology comprises a once-daily oral administration of a single 10 mg unit, which may be titrated by the prescribing physician to the 25 mg strength subsequent to an evaluation of therapeutic response at the 12-week time point, irrespective of food intake, with the tablet being swallowed intact.'
find(UT_PL, 'pl4')['blocks'][1]['text'] = 'Adverse events of a serious nature necessitating immediate medical consultation include manifestations of serious infection (pyrexia, rigors, cough, dysuria) and manifestations of venous thromboembolism (lower-limb pain or oedema, thoracic pain, acute dyspnoea).'
UT_QUESTIONS = [
    {'id': 'q1', 'q': 'What is Ostrevia used for?', 'section': 'pl1', 'answer': 'hand eczema'},
    {'id': 'q2', 'q': 'Name one reason you must not take Ostrevia.', 'section': 'pl2.1', 'answer': 'allergic|tuberculosis|pregnant'},
    {'id': 'q3', 'q': 'What should you tell your doctor before you start?', 'section': 'pl2.2', 'answer': 'infection|tuberculosis|TB'},
    {'id': 'q4', 'q': 'What should you do if you get leg pain or swelling?', 'section': 'pl4', 'answer': 'leg pain|lower-limb pain'},
    {'id': 'q5', 'q': 'Can you breast-feed while taking Ostrevia?', 'section': 'pl2.6', 'answer': 'breast-feed'},
    {'id': 'q6', 'q': 'How long must you use contraception after the last dose?', 'section': 'pl2.6', 'answer': '4 weeks'},
    {'id': 'q7', 'q': 'How many tablets do you take each day?', 'section': 'pl3', 'answer': 'once a day|once-daily|1 tablet|one 10 mg'},
    {'id': 'q8', 'q': 'Can you take the tablet with food?', 'section': 'pl3', 'answer': 'with or without food|irrespective of food'},
    {'id': 'q9', 'q': 'What do you do if you forget a dose?', 'section': 'pl3.2', 'answer': 'as soon as you remember'},
    {'id': 'q10', 'q': 'Name a serious side effect that needs a doctor straight away.', 'section': 'pl4', 'answer': 'infection|blood clot|thromboembolism'},
    {'id': 'q11', 'q': 'How should you store Ostrevia?', 'section': 'pl5', 'answer': 'storage conditions|out of the sight and reach'},
    {'id': 'q12', 'q': 'Who do you report side effects to?', 'section': 'pl4.1', 'answer': 'Appendix V|national reporting system'},
]
UT_PL['userTest'] = {'questions': UT_QUESTIONS, 'rounds': []}

# ---------------------------------------------------------------- translation
FR = copy.deepcopy(PL)
FR.update({'id': 'pl-fr', 'title': 'Notice (français)', 'status': 'draft', 'role': 'translation', 'sourceSampleDocId': 'pl'})
FR['meta'] = {**META, 'lang': 'fr'}
FR['fixed'] = {'header': 'Notice : Information du patient', 'nameLine': 'Ostrevia 10 mg, comprimé pelliculé\nOstrevia 25 mg, comprimé pelliculé\nlumiravostat',
               'blackTriangle': '▼ Ce médicament fait l’objet d’une surveillance supplémentaire qui permettra l’identification rapide de nouvelles informations relatives à la sécurité. Vous pouvez y contribuer en signalant tout effet indésirable que vous observez. Voir en fin de rubrique 4 comment déclarer les effets indésirables.',
               'readFirst': 'Veuillez lire attentivement cette notice avant de prendre ce médicament car elle contient des informations importantes pour vous. Gardez cette notice. Si vous avez d’autres questions, interrogez votre médecin ou votre pharmacien.',
               'lastRevised': 'La dernière date à laquelle cette notice a été révisée est août 2026.'}
FR['sections'] = [
    sec('pl1', '1. Qu’est-ce que Ostrevia et dans quels cas est-il utilisé', P('Ostrevia contient la substance active lumiravostat. Il agit en calmant la partie du système immunitaire qui provoque l’inflammation de la peau.'),
        P('Ostrevia est utilisé chez l’adulte pour traiter l’eczéma chronique des mains modéré à sévère, lorsque les crèmes à base de corticoïdes puissants n’ont pas suffi ou ne peuvent pas être utilisées.')),
    sec('pl2', '2. Quelles sont les informations à connaître avant de prendre Ostrevia', subs=[
        sub('pl2.1', 'Ne prenez jamais Ostrevia', UL('si vous êtes allergique au lumiravostat ou à l’un des autres composants contenus dans ce médicament (mentionnés dans la rubrique 6)', 'si vous avez une tuberculose active ou une autre infection grave', 'si vous êtes enceinte')),
        sub('pl2.2', 'Avertissements et précautions', P('Adressez-vous à votre médecin ou pharmacien avant de prendre Ostrevia si vous avez une infection, si vous avez eu la tuberculose, un cancer, des caillots sanguins dans les jambes ou les poumons, ou des problèmes de foie.'),
            P('Vous ferez des analyses de sang avant le début du traitement et pendant celui-ci.')),
        sub('pl2.3', 'Enfants et adolescents', P('Ne donnez pas ce médicament aux enfants et adolescents de moins de 18 ans.')),
        sub('pl2.4', 'Autres médicaments et Ostrevia', P('Informez votre médecin ou pharmacien si vous prenez, avez récemment pris ou pourriez prendre tout autre médicament, en particulier le kétoconazole ou la rifampicine.')),
        sub('pl2.6', 'Grossesse et allaitement', P('Ne prenez pas Ostrevia si vous êtes enceinte. Si vous pouvez tomber enceinte, utilisez une contraception efficace pendant le traitement et pendant 4 semaines après la dernière dose.'),
            P('N’allaitez pas pendant le traitement.')),
        sub('pl2.7', 'Conduite de véhicules et utilisation de machines', P('Ostrevia ne devrait pas affecter votre aptitude à conduire ou à utiliser des machines.')),
        sub('pl2.8', 'Ostrevia contient du sodium', P('Ce médicament contient moins de 1 mmol (23 mg) de sodium par comprimé, c’est-à-dire qu’il est essentiellement « sans sodium ».')),
    ]),
    sec('pl3', '3. Comment prendre Ostrevia', P('Veillez à toujours prendre ce médicament en suivant exactement les indications de votre médecin ou pharmacien.'),
        P('La dose recommandée est d’un comprimé de 25 mg une fois par jour. Votre médecin peut l’augmenter après 12 semaines. Avalez le comprimé en entier, avec ou sans nourriture.'),
        subs=[sub('pl3.1', 'Si vous avez pris plus d’Ostrevia que vous n’auriez dû', P('Parlez-en immédiatement à un médecin ou à un pharmacien.')),
              sub('pl3.2', 'Si vous oubliez de prendre Ostrevia', P('Prenez-le dès que vous vous en souvenez le même jour. Ne prenez pas de dose double.')),
              sub('pl3.3', 'Si vous arrêtez de prendre Ostrevia', P('Parlez-en à votre médecin avant d’arrêter. Votre eczéma pourrait réapparaître.'), P('Si vous avez d’autres questions sur l’utilisation de ce médicament, demandez plus d’informations à votre médecin ou à votre pharmacien.'))]),
    sec('pl4', '4. Quels sont les effets secondaires éventuels', P('Comme tous les médicaments, ce médicament peut provoquer des effets secondaires, mais ils ne surviennent pas systématiquement chez tout le monde.'),
        P('Prévenez immédiatement votre médecin si vous remarquez des signes d’infection grave (fièvre, frissons, toux) ou de caillots sanguins (douleur ou gonflement de la jambe, douleur thoracique, essoufflement soudain).'),
        P('Très fréquent (peut toucher plus de 1 personne sur 10) : rhume. Fréquent (peut toucher jusqu’à 1 personne sur 10) : maux de tête, nausées, acné, zona, modifications des analyses de sang.'),
        P('Peu fréquent (peut toucher jusqu’à 1 personne sur 100) : pneumonie, infection de la peau (cellulite), caillots sanguins dans les jambes ou les poumons.'),
        subs=[sub('pl4.1', 'Déclaration des effets secondaires', P('Si vous ressentez un quelconque effet indésirable, parlez-en à votre médecin ou votre pharmacien. Ceci s’applique aussi à tout effet indésirable qui ne serait pas mentionné dans cette notice. Vous pouvez également déclarer les effets indésirables directement via le système national de déclaration décrit en Annexe V. En signalant les effets indésirables, vous contribuez à fournir davantage d’informations sur la sécurité du médicament.'))]),
    sec('pl5', '5. Comment conserver Ostrevia', P('Tenir ce médicament hors de la vue et de la portée des enfants.'), P('N’utilisez pas ce médicament après la date de péremption indiquée sur la boîte et la plaquette après EXP. La date de péremption fait référence au dernier jour de ce mois.'),
        P('Ce médicament ne nécessite pas de précautions particulières de conservation.'), P('Ne jetez aucun médicament au tout-à-l’égout ou avec les ordures ménagères. Demandez à votre pharmacien d’éliminer les médicaments que vous n’utilisez plus. Ces mesures contribueront à protéger l’environnement.')),
    sec('pl6', '6. Contenu de l’emballage et autres informations', subs=[
        sub('pl6.1', 'Ce que contient Ostrevia', P('La substance active est le lumiravostat. Chaque comprimé pelliculé contient 10 mg ou 25 mg de lumiravostat.'), P('Les autres composants sont : cellulose microcristalline, croscarmellose sodique, stéarate de magnésium, hypromellose, dioxyde de titane (E171) et, dans le comprimé à 25 mg, oxyde de fer jaune (E172). Voir rubrique 2 « Ostrevia contient du sodium ».')),
        sub('pl6.2', 'Comment se présente Ostrevia et contenu de l’emballage externe', P('Ostrevia 10 mg se présente sous forme de comprimés blancs et ronds portant les inscriptions « HR » et « 10 ». Ostrevia 25 mg se présente sous forme de comprimés jaunes et ovales portant les inscriptions « HR » et « 25 ». Boîtes de 28 ou 84 comprimés sous plaquettes. Toutes les présentations peuvent ne pas être commercialisées.')),
        sub('pl6.3', 'Titulaire de l’autorisation de mise sur le marché et fabricant', P(f'{MAH}, {MAH_ADDR}'), P(MFR)),
    ]),
]

LING = [
    {'id': 'lr-1', 'where': 'Section 4 (heading and text)', 'kind': 'revise', 'text': 'Use the QRD term « effets indésirables » throughout section 4, including the heading, instead of « effets secondaires ».',
     'expect': {'area': 'sec', 'num': 'pl4', 'all': ['effets indésirables'], 'none': ['effets secondaires']}},
    {'id': 'lr-2', 'where': 'Section 3', 'kind': 'revise', 'text': 'The starting dose is 10 mg, not 25 mg. Please correct: « un comprimé de 10 mg une fois par jour ».',
     'expect': {'area': 'sec', 'num': 'pl3', 'all': ['10 mg']}},
    {'id': 'lr-3', 'where': 'Grossesse et allaitement', 'kind': 'revise', 'text': 'The English text says not to breast-feed for 4 days after the last dose; this period is missing in French.',
     'expect': {'area': 'sec', 'num': 'pl2.6', 'all': ['4 jours']}},
    {'id': 'lr-4', 'where': 'Section 1', 'kind': 'question', 'text': 'Minor: « Qu’est-ce que Ostrevia » is the QRD wording and is accepted. No change needed; please confirm.'},
]

# ---------------------------------------------------------------- lactose reformulation (excipients drill)
LAC_SMPC, LAC_PL, LAC_OUTER = drafts(SMPC, PL, outer('25 mg', '28 film-coated tablets', MA[2], '09990001234574'))
for d in (LAC_SMPC, LAC_PL, LAC_OUTER):
    d['meta']['excipients'] = [{'key': 'sodium', 'amount': '0.6 mg', 'per': 'tablet'}, {'key': 'lactose', 'amount': '120 mg', 'per': 'tablet', 'note': '25 mg tablet only (fictional reformulation)'}]
find(LAC_SMPC, '6.1')['blocks'][0]['text'] = 'Tablet core: microcrystalline cellulose, lactose monohydrate (25 mg only), croscarmellose sodium, magnesium stearate.'

# ---------------------------------------------------------------- PRAC signal (capstone)
PRAC_NOTICE = {
    'from': 'PRAC (fictional recommendation, EPITT 99999)', 'title': 'PRAC recommendation on a signal: drug reaction with eosinophilia and systemic symptoms (DRESS)',
    'text': 'Having reviewed the available evidence, PRAC agreed that the marketing authorisation holder(s) of lumiravostat-containing products should submit a variation within 60 days to amend the product information as follows. SmPC section 4.4: "Drug reaction with eosinophilia and systemic symptoms (DRESS), which can be life-threatening or fatal, has been reported. Patients should be advised of the signs and symptoms and monitored closely for skin reactions. If signs and symptoms suggestive of DRESS appear, Ostrevia should be withdrawn immediately." SmPC section 4.8, Skin and subcutaneous tissue disorders, frequency not known: drug reaction with eosinophilia and systemic symptoms (DRESS). Package leaflet section 2 (Warnings and precautions) and section 4: a widespread rash, high body temperature and enlarged lymph nodes (DRESS or drug hypersensitivity syndrome): stop taking Ostrevia and contact your doctor or seek medical attention immediately.',
    'sections': ['SmPC 4.4', 'SmPC 4.8', 'Package leaflet section 2', 'Package leaflet section 4'], 'deadlineDays': 60,
}

from eu_generic import SAMPLES_GEN

SAMPLES = [
    {'id': 'eu-ostrevia-clean', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (EU): clean product information',
     'about': 'The SmPC, Annex II, package leaflet, outer carton and blister for a centrally authorised product under additional monitoring. Use it to see what a passing QRD set looks like.',
     'docs': [SMPC, ANNEX2, PL, OUTER, BLISTER]},
    {'id': 'eu-ostrevia-errors', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (EU): find and fix the errors',
     'about': 'The same set with about 20 planted errors: QRD headings, black triangle, 4.8 frequencies and reporting text, excipients, standard leaflet statements, Braille and safety features. Compare with the answer key when you are done.',
     'docs': [ERR_SMPC, ERR_ANNEX2, ERR_PL, ERR_OUTER, ERR_BLISTER]},
    {'id': 'eu-nelvaprox-vial', 'region': 'eu', 'productId': 'sterile-injectable', 'level': 'Practice', 'title': 'Nelvaprox (EU): a small vial label',
     'about': 'A 5 mL vial is too small for the full particulars, so Annex IIIA allows a minimum set. Two required particulars are missing or wrongly marked: find them and fix the label.',
     'docs': [ERR_VIAL]},
    {'id': 'eu-ostrevia-usertest', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (EU): pass the user test',
     'about': 'A draft leaflet written in heavy medical language and 12 test questions. Run a round of 10 participants, rewrite what fails, and pass two final rounds on the same text.',
     'docs': [drafts(SMPC)[0], UT_PL]},
    {'id': 'eu-ostrevia-translation', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (EU): review the French leaflet',
     'about': 'The English leaflet and its French translation, with a term base. Find the wrong dose, the missing period and the wrong term, then answer the member state’s linguistic review comments.',
     'docs': [PL, FR], 'termBase': 'fr'},
    {'id': 'eu-ostrevia-lactose', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (EU): a new excipient (lactose)',
     'about': 'The 25 mg tablet is reformulated with lactose monohydrate (fictional). Add every statement the excipients annex requires to the SmPC, the leaflet and the carton.',
     'docs': [LAC_SMPC, LAC_PL, LAC_OUTER]},
    {'id': 'eu-ostrevia-prac', 'region': 'eu', 'productId': 'nce-tablet', 'level': 'Capstone', 'title': 'Ostrevia (EU): implement a PRAC signal recommendation',
     'about': 'PRAC has recommended new wording on DRESS. Implement it in the SmPC and leaflet, take both through approval, record the variation in the tracker and keep the deadline.',
     'docs': [SMPC, PL], 'change': {'trigger': 'prac', 'kind': 'warning', 'title': 'DRESS (PRAC signal recommendation)', 'notice': PRAC_NOTICE, 'markets': ['eu'], 'deadlineDays': 60}},
] + SAMPLES_GEN

AGENCY = {'eu-ostrevia-translation': {'pl-fr': LING}}
