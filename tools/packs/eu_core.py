"""EU pack: metadata, sources, QRD templates, rule cards and the excipients vocabulary.

The QRD headings and standard statements are regulatory template text, used here for their
factual meaning. Every rule card cites a source and says where the app simplifies.
"""

QRD = 'https://www.ema.europa.eu/en/human-regulatory/marketing-authorisation/product-information/product-information-templates-human'

PACK = {
    'id': 'eu',
    'name': 'European Union (EMA, centralised procedure)',
    'short': 'EU',
    'version': '1.1.0',
    'changes': [{'version': '1.1.0', 'date': '2026-10-17', 'notes': 'Annex II and small immediate packaging templates; generic SmPC compared with its reference (Article 11 omissions); four new rule cards (EU-A2, EU-SMALL, EU-GEN-SAME, EU-GEN-CARVE); vial label and generic samples with drills; 28 more quiz questions.'}, {'version': '1.0.0', 'date': '2026-10-11', 'notes': 'First release (Phase 3): QRD v10.4 SmPC, package leaflet, outer carton and blister; excipients, black triangle, Braille, safety features, user testing, translations, PRAC and PSUSA, ePI view.'}],
    'asOf': '2026-10-17',
    'kinds': ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'],
    'about': (
        'Product information for a centrally authorised medicine: the Summary of Product Characteristics '
        '(Annex I), the labelling (Annex IIIA: outer carton and blister) and the package leaflet (Annex IIIB), '
        'following QRD template version 10.4. National procedures use the same headings with national '
        'details. Where a check estimates or simplifies, its rule card says so.'
    ),
    'watch': [
        {'id': 'qrd11', 'title': 'QRD template version 11', 'src': 'qrd',
         'text': 'EMA consulted on QRD v11 (April to August 2025): a shorter leaflet, important information first, warnings grouped by subject and an optional section 7 for instructions for use. Until v11 is published and in force, the app checks against v10.4 and teaches v11 in a lesson.'},
        {'id': 'keyinfo', 'title': 'Key information section in the leaflet', 'src': 'qrd',
         'text': 'EMA also consulted (April to May 2025) on a key information section at the top of the package leaflet of centrally authorised medicines. No decision has been published; the app does not require it.'},
        {'id': 'epi', 'title': 'Electronic product information (ePI)', 'src': 'epi',
         'text': 'The EU ePI common standard is based on HL7 FHIR. EMA published guidance for submitting ePI in centralised procedures in September 2026, ahead of go-live, and the new EU pharmaceutical legislation (political agreement December 2025) requires ePI. The app shows a simplified structured ePI view; it does not produce FHIR.'},
    ],
    'sources': [
        {'id': 'qrd', 'title': 'EMA: Product-information (QRD) templates, human, version 10.4 (February 2024)', 'url': QRD},
        {'id': 'qrdann', 'title': 'EMA: QRD annotated template (English) version 10.4, with guidance on each heading', 'url': QRD},
        {'id': 'smpcgl', 'title': 'European Commission: A Guideline on Summary of Product Characteristics (SmPC), Rev. 2 (September 2009)', 'url': 'https://health.ec.europa.eu/system/files/2016-11/smpc_guideline_rev2_en_0.pdf'},
        {'id': 'dir', 'title': 'Directive 2001/83/EC, Articles 54 to 59 (labelling and package leaflet), 56a (Braille), 57 (blue box)', 'url': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02001L0083-20220101'},
        {'id': 'excip', 'title': 'Annex to the European Commission guideline on excipients in the labelling and package leaflet of medicinal products for human use, Rev. 2 (November 2019, updated 2022)', 'url': 'https://www.ema.europa.eu/en/documents/scientific-guideline/annex-european-commission-guideline-excipients-labelling-package-leaflet-medicinal-products-human-use-sante-2017-11668-revision-2_en.pdf'},
        {'id': 'read', 'title': 'European Commission: Guideline on the readability of the labelling and package leaflet of medicinal products for human use, Rev. 1 (January 2009)', 'url': 'https://health.ec.europa.eu/system/files/2016-11/2009_01_12_readability_guideline_final_en_0.pdf'},
        {'id': 'readno', 'title': 'Norwegian Medical Products Agency: Readability testing and bridging (summary of the success criteria)', 'url': 'https://www.dmp.no/en/approval-of-medicines/approval-and-follow-up-of-marketing-authorisation-ma/Product-information---templates-and-guidance/readability-testing-and-bridging'},
        {'id': 'am', 'title': 'Regulation (EU) No 1235/2010 and Commission Implementing Regulation (EU) No 198/2013: additional monitoring and the black symbol', 'url': 'https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/pharmacovigilance-post-authorisation/medicines-under-additional-monitoring'},
        {'id': 'sf', 'title': 'Commission Delegated Regulation (EU) 2016/161: safety features (unique identifier and anti-tampering device)', 'url': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0161'},
        {'id': 'qr', 'title': 'EMA: Mobile scanning and other technologies in the labelling and package leaflet of centrally authorised medicinal products (QR codes)', 'url': 'https://www.ema.europa.eu/en/human-regulatory-overview/marketing-authorisation/product-information-requirements'},
        {'id': 'prac', 'title': 'EMA: PRAC recommendations on signals (with product information wording in all EU languages)', 'url': 'https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/pharmacovigilance-post-authorisation/signal-management/prac-recommendations-safety-signals'},
        {'id': 'psusa', 'title': 'HALMED: Variations following PSUSA outcomes and PRAC signal recommendations (C.3.a, C.3.b, C.3.c; deadline set in the recommendation)', 'url': 'https://halmed.hr/en/Lijekovi/Arbitrazni-postupci-PSUSA-postupci-i-PRAC-signali-upute-za-prijavu-izmjena-/Upute-za-prijavu-izmjena-na-temelju-preporuka-PRAC-a-nakon-ocjene-sigurnosnih-signala/'},
        {'id': 'ling', 'title': 'EMA: Linguistic review process of product information in the centralised procedure', 'url': 'https://www.ema.europa.eu/en/human-regulatory-overview/marketing-authorisation/product-information-requirements/linguistic-review-process-product-information-centralised-procedure'},
        {'id': 'art11', 'title': 'Directive 2001/83/EC, Article 10 (generic medicinal products) and Article 11 (SmPC; parts referring to indications or dosage forms still covered by patent law may be left out)', 'url': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02001L0083-20220101'},
        {'id': 'qrda2', 'title': 'EMA ePI implementation guide: QRD template for centrally authorised products, Annex II structure (sections A to E)', 'url': 'https://epi.ema.europa.eu/fhirig/StructureDefinition-EUQRD-CAP-template-new-Annex-II-en.html'},
        {'id': 'epi', 'title': 'EMA: Electronic product information (ePI), page updated September 2026', 'url': 'https://www.ema.europa.eu/en/human-regulatory/marketing-authorisation/product-information/electronic-product-information-epi'},
    ],
}

# ---------------------------------------------------------------- templates
def S(num, title, need='required', subs=None):
    s = {'num': num, 'title': title, 'need': need}
    if subs:
        s['fixedSubs'] = subs
    return s


def X(num, title, need='required'):
    return {'num': num, 'title': title, 'need': need}


SMPC_SECTIONS = [
    S('1', 'NAME OF THE MEDICINAL PRODUCT'),
    S('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION'),
    S('3', 'PHARMACEUTICAL FORM'),
    S('4', 'CLINICAL PARTICULARS', subs=[
        X('4.1', 'Therapeutic indications'), X('4.2', 'Posology and method of administration'), X('4.3', 'Contraindications'),
        X('4.4', 'Special warnings and precautions for use'), X('4.5', 'Interaction with other medicinal products and other forms of interaction'),
        X('4.6', 'Fertility, pregnancy and lactation'), X('4.7', 'Effects on ability to drive and use machines'), X('4.8', 'Undesirable effects'), X('4.9', 'Overdose')]),
    S('5', 'PHARMACOLOGICAL PROPERTIES', subs=[X('5.1', 'Pharmacodynamic properties'), X('5.2', 'Pharmacokinetic properties'), X('5.3', 'Preclinical safety data')]),
    S('6', 'PHARMACEUTICAL PARTICULARS', subs=[
        X('6.1', 'List of excipients'), X('6.2', 'Incompatibilities'), X('6.3', 'Shelf life'), X('6.4', 'Special precautions for storage'),
        X('6.5', 'Nature and contents of container'), X('6.6', 'Special precautions for disposal <and other handling>')]),
    S('7', 'MARKETING AUTHORISATION HOLDER'),
    S('8', 'MARKETING AUTHORISATION NUMBER(S)'),
    S('9', 'DATE OF FIRST AUTHORISATION/RENEWAL OF THE AUTHORISATION'),
    S('10', 'DATE OF REVISION OF THE TEXT'),
]

PL_SECTIONS = [
    S('pl1', '1. What {name} is and what it is used for'),
    S('pl2', '2. What you need to know before you take {name}', subs=[
        X('pl2.1', 'Do not take {name}'), X('pl2.2', 'Warnings and precautions'), X('pl2.3', 'Children and adolescents', 'recommended'),
        X('pl2.4', 'Other medicines and {name}'), X('pl2.5', '{name} with food, drink and alcohol', 'optional'), X('pl2.6', 'Pregnancy and breast-feeding'),
        X('pl2.7', 'Driving and using machines'), X('pl2.8', '{name} contains sodium', 'optional')]),
    S('pl3', '3. How to take {name}', subs=[X('pl3.1', 'If you take more {name} than you should'), X('pl3.2', 'If you forget to take {name}'), X('pl3.3', 'If you stop taking {name}')]),
    S('pl4', '4. Possible side effects', subs=[X('pl4.1', 'Reporting of side effects')]),
    S('pl5', '5. How to store {name}'),
    S('pl6', '6. Contents of the pack and other information', subs=[X('pl6.1', 'What {name} contains'), X('pl6.2', 'What {name} looks like and contents of the pack'), X('pl6.3', 'Marketing Authorisation Holder and Manufacturer')]),
]

OUTER_SECTIONS = [
    S('1', 'NAME OF THE MEDICINAL PRODUCT'), S('2', 'STATEMENT OF ACTIVE SUBSTANCE(S)'), S('3', 'LIST OF EXCIPIENTS', 'recommended'),
    S('4', 'PHARMACEUTICAL FORM AND CONTENTS'), S('5', 'METHOD AND ROUTE(S) OF ADMINISTRATION'),
    S('6', 'SPECIAL WARNING THAT THE MEDICINAL PRODUCT MUST BE STORED OUT OF THE SIGHT AND REACH OF CHILDREN'),
    S('7', 'OTHER SPECIAL WARNING(S), IF NECESSARY', 'optional'), S('8', 'EXPIRY DATE'), S('9', 'SPECIAL STORAGE CONDITIONS', 'optional'),
    S('10', 'SPECIAL PRECAUTIONS FOR DISPOSAL OF UNUSED MEDICINAL PRODUCTS OR WASTE MATERIALS DERIVED FROM SUCH MEDICINAL PRODUCTS, IF APPROPRIATE', 'optional'),
    S('11', 'NAME AND ADDRESS OF THE MARKETING AUTHORISATION HOLDER'), S('12', 'MARKETING AUTHORISATION NUMBER(S)'), S('13', 'BATCH NUMBER'),
    S('14', 'GENERAL CLASSIFICATION FOR SUPPLY', 'optional'), S('15', 'INSTRUCTIONS ON USE', 'optional'), S('16', 'INFORMATION IN BRAILLE'),
    S('17', 'UNIQUE IDENTIFIER - 2D BARCODE'), S('18', 'UNIQUE IDENTIFIER - HUMAN READABLE DATA'),
]

BLISTER_SECTIONS = [
    S('1', 'NAME OF THE MEDICINAL PRODUCT'), S('2', 'NAME OF THE MARKETING AUTHORISATION HOLDER'), S('3', 'EXPIRY DATE'), S('4', 'BATCH NUMBER'), S('5', 'OTHER', 'optional'),
]

ANNEX2_SECTIONS = [
    S('A', 'A. MANUFACTURER(S) <OF THE BIOLOGICAL ACTIVE SUBSTANCE(S) AND MANUFACTURER(S)> RESPONSIBLE FOR BATCH RELEASE'),
    S('B', 'B. CONDITIONS OR RESTRICTIONS REGARDING SUPPLY AND USE'),
    S('C', 'C. OTHER CONDITIONS AND REQUIREMENTS OF THE MARKETING AUTHORISATION', subs=[X('C.1', 'Periodic safety update reports (PSURs)')]),
    S('D', 'D. CONDITIONS OR RESTRICTIONS WITH REGARD TO THE SAFE AND EFFECTIVE USE OF THE MEDICINAL PRODUCT', subs=[X('D.1', 'Risk management plan (RMP)'), X('D.2', 'Additional risk minimisation measures', 'optional')]),
    S('E', 'E. SPECIFIC OBLIGATION TO COMPLETE POST-AUTHORISATION MEASURES FOR THE CONDITIONAL MARKETING AUTHORISATION', 'optional'),
]
A2_PSUR = 'The requirements for submission of PSURs for this medicinal product are set out in the list of Union reference dates (EURD list) provided for under Article 107c(7) of Directive 2001/83/EC and any subsequent updates published on the European medicines web-portal.'
A2_RMP = 'The marketing authorisation holder (MAH) shall perform the required pharmacovigilance activities and interventions detailed in the agreed RMP presented in Module 1.8.2 of the marketing authorisation and any agreed subsequent updates of the RMP. An updated RMP should be submitted: at the request of the European Medicines Agency; whenever the risk management system is modified, especially as the result of new information being received that may lead to a significant change to the benefit/risk profile or as the result of an important (pharmacovigilance or risk minimisation) milestone being reached.'

SMALL_SECTIONS = [
    S('1', 'NAME OF THE MEDICINAL PRODUCT AND ROUTE(S) OF ADMINISTRATION'), S('2', 'METHOD OF ADMINISTRATION'), S('3', 'EXPIRY DATE'),
    S('4', 'BATCH NUMBER'), S('5', 'CONTENTS BY WEIGHT, BY VOLUME OR BY UNIT'), S('6', 'OTHER', 'optional'),
]

BT_SMPC = '▼ This medicinal product is subject to additional monitoring. This will allow quick identification of new safety information. Healthcare professionals are asked to report any suspected adverse reactions. See section 4.8 for how to report adverse reactions.'
BT_PL = '▼ This medicine is subject to additional monitoring. This will allow quick identification of new safety information. You can help by reporting any side effects you may get. See the end of section 4 for how to report side effects.'
REPORT_SMPC = 'Reporting suspected adverse reactions after authorisation of the medicinal product is important. It allows continued monitoring of the benefit/risk balance of the medicinal product. Healthcare professionals are asked to report any suspected adverse reactions via the national reporting system listed in Appendix V.'
REPORT_PL = 'If you get any side effects, talk to your doctor or pharmacist. This includes any possible side effects not listed in this leaflet. You can also report side effects directly via the national reporting system listed in Appendix V. By reporting side effects you can help provide more information on the safety of this medicine.'
READ_FIRST = 'Read all of this leaflet carefully before you start taking this medicine because it contains important information for you. Keep this leaflet. You may need to read it again. If you have any further questions, ask your doctor or pharmacist. This medicine has been prescribed for you only. Do not pass it on to others. It may harm them, even if their signs of illness are the same as yours. If you get any side effects, talk to your doctor or pharmacist. This includes any possible side effects not listed in this leaflet. See section 4.'

TEMPLATES = {
    'smpc': {'kind': 'smpc', 'label': 'Summary of Product Characteristics', 'short': 'SmPC', 'src': 'qrd', 'numbered': True, 'sections': SMPC_SECTIONS,
             'fixed': {'header': 'ANNEX I: SUMMARY OF PRODUCT CHARACTERISTICS', 'blackTriangle': BT_SMPC}, 'reporting': REPORT_SMPC},
    'pl': {'kind': 'pl', 'label': 'Package leaflet', 'short': 'PL', 'src': 'qrd', 'sections': PL_SECTIONS,
           'fixed': {'header': 'Package leaflet: Information for the patient', 'blackTriangle': BT_PL, 'readFirst': READ_FIRST, 'lastRevised': 'This leaflet was last revised in'},
           'reporting': REPORT_PL},
    'eu-outer': {'kind': 'eu-outer', 'label': 'Outer carton (Annex IIIA)', 'short': 'Outer', 'src': 'qrd', 'numbered': True, 'sections': OUTER_SECTIONS,
                 'fixed': {'header': 'PARTICULARS TO APPEAR ON THE OUTER PACKAGING'},
                 'standard': {'6': 'Keep out of the sight and reach of children.', '17': '2D barcode carrying the unique identifier included.'}},
    'eu-annex2': {'kind': 'eu-annex2', 'label': 'Annex II (conditions of the marketing authorisation)', 'short': 'Annex II', 'src': 'qrda2', 'sections': ANNEX2_SECTIONS,
                  'fixed': {'header': 'ANNEX II'}, 'standard': {'C.1': A2_PSUR, 'D.1': A2_RMP}},
    'eu-small': {'kind': 'eu-small', 'label': 'Small immediate packaging (Annex IIIA)', 'short': 'Small unit', 'src': 'qrd', 'numbered': True, 'sections': SMALL_SECTIONS,
                 'fixed': {'header': 'MINIMUM PARTICULARS TO APPEAR ON SMALL IMMEDIATE PACKAGING UNITS'}},
    'eu-blister': {'kind': 'eu-blister', 'label': 'Blister (Annex IIIA)', 'short': 'Blister', 'src': 'qrd', 'numbered': True, 'sections': BLISTER_SECTIONS,
                   'fixed': {'header': 'MINIMUM PARTICULARS TO APPEAR ON BLISTERS OR STRIPS'}},
}

# Adverse reaction frequency convention (SmPC guideline, section 4.8).
FREQUENCIES = ['very common', 'common', 'uncommon', 'rare', 'very rare', 'not known']
NONSTANDARD_FREQ = ['frequent', 'frequently', 'occasional', 'occasionally', 'infrequent', 'isolated cases', 'sporadic', 'often']

# Excipients with a known effect (annex Rev. 2, simplified to the statements the app checks).
EXCIPIENTS = [
    {'key': 'sodium', 'label': 'Sodium', 'route': 'oral, parenteral', 'threshold': 'below 1 mmol (23 mg) per dose',
     'pl': 'essentially .sodium-free', 'smpc': 'essentially .sodium-free', 'plSub': 'pl2.8',
     'text': 'This medicine contains less than 1 mmol sodium (23 mg) per tablet, that is to say essentially ‘sodium-free’.'},
    {'key': 'lactose', 'label': 'Lactose', 'route': 'oral', 'threshold': 'zero',
     'pl': 'intolerance to some sugars', 'smpc': 'galactose intolerance|lactase deficiency|glucose-galactose malabsorption', 'plSub': 'pl2.8', 'carton': 'lactose',
     'text': 'If you have been told by your doctor that you have an intolerance to some sugars, contact your doctor before taking this medicinal product.'},
    {'key': 'sucrose', 'label': 'Sucrose', 'route': 'oral', 'threshold': 'zero',
     'pl': 'intolerance to some sugars', 'smpc': 'fructose intolerance|sucrase-isomaltase', 'plSub': 'pl2.8', 'carton': 'sucrose',
     'text': 'If you have been told by your doctor that you have an intolerance to some sugars, contact your doctor before taking this medicinal product.'},
    {'key': 'aspartame', 'label': 'Aspartame (E 951)', 'route': 'oral', 'threshold': 'zero',
     'pl': 'phenylalanine', 'smpc': 'phenylalanine|phenylketonuria', 'plSub': 'pl2.8', 'carton': 'aspartame',
     'text': 'This medicine contains x mg aspartame in each tablet. Aspartame is a source of phenylalanine. It may be harmful if you have phenylketonuria (PKU).'},
    {'key': 'benzyl-alcohol', 'label': 'Benzyl alcohol', 'route': 'all', 'threshold': 'zero',
     'pl': 'benzyl alcohol', 'smpc': 'benzyl alcohol', 'plSub': 'pl2.8', 'carton': 'benzyl alcohol',
     'text': 'This medicine contains x mg benzyl alcohol in each dose. Benzyl alcohol may cause allergic reactions.'},
    {'key': 'azo', 'label': 'Azo colouring agents (E 102, E 110, E 124 and others)', 'route': 'oral', 'threshold': 'zero',
     'pl': 'allergic reactions', 'smpc': 'allergic reactions', 'plSub': 'pl2.8', 'carton': 'E ?1(02|10|24)',
     'text': 'May cause allergic reactions.'},
]

PROMO = ['best', 'safest', 'superior', 'breakthrough', 'revolutionary', 'miracle', 'guaranteed', 'unmatched']


def R(id, title, text, kinds, severity, src, at, simplified=None):
    r = {'id': id, 'title': title, 'text': text, 'kinds': kinds, 'severity': severity, 'src': src, 'at': at, 'check': id}
    if simplified:
        r['simplified'] = simplified
    return r


RULES = [
    R('EU-HEAD', 'QRD headings, in order', 'Every heading of the QRD template appears with its exact wording and in the template order. Optional headings may be left out.', ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'], 'error', 'qrd', 'QRD template v10.4',
      'Alternative wording in angle brackets in the template is accepted as written in the app (for example "<and other handling>").'),
    R('EU-REQ', 'Required sections are filled', 'Each required section has content. If a section does not apply, the template usually gives the wording to use instead (for example "Not applicable.").', ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'], 'error', 'qrd', 'QRD template v10.4'),
    R('EU-BT', 'Black triangle for additional monitoring', 'A medicine under additional monitoring carries the black inverted triangle and the standard statement at the start of the SmPC and the package leaflet. Medicines not under additional monitoring do not.', ['smpc', 'pl'], 'error', 'am', 'Implementing Regulation 198/2013, Article 1; QRD template'),
    R('EU-48-REPORT', 'Reporting statement in 4.8', 'Section 4.8 ends with the standard text on reporting suspected adverse reactions, pointing to the national reporting system listed in Appendix V.', ['smpc'], 'error', 'qrd', 'QRD template v10.4, section 4.8'),
    R('EU-48-FREQ', 'Frequency categories in 4.8', 'Adverse reactions are listed by MedDRA system organ class and frequency, using the convention very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100), rare (≥1/10,000 to <1/1,000), very rare (<1/10,000) and not known. Words such as "frequent" or "occasional" are not used.', ['smpc'], 'warning', 'smpcgl', 'SmPC guideline, section 4.8',
      'The app looks for the category names and for non-standard frequency words; it does not check the system organ class order.'),
    R('EU-EXC', 'Excipients with a known effect', 'Excipients listed in the annex to the excipients guideline need the set statement in the package leaflet (section 2) and the matching information in SmPC section 4.4; most must also be named on the outer carton.', ['smpc', 'pl', 'eu-outer'], 'error', 'excip', 'Annex, Rev. 2',
      'The app knows six common excipients and checks for the key words of each statement, not the full text or the dose thresholds.'),
    R('EU-PL-STD', 'Standard statements in the leaflet', 'The leaflet starts with the "Read all of this leaflet carefully" box, section 4 ends with "Reporting of side effects" pointing to Appendix V, and the last line gives the date it was last revised.', ['pl'], 'error', 'qrd', 'QRD template v10.4, Annex IIIB'),
    R('EU-PL-CONSIST', 'Leaflet consistent with the SmPC', 'The leaflet says the same things as the SmPC in patient language: contraindications in 4.3 appear under "Do not take", strengths match, and the warnings in 4.4 are reflected in "Warnings and precautions".', ['pl'], 'warning', 'read', 'Readability guideline; Directive 2001/83/EC Article 59',
      'The app compares strengths and checks that an allergy contraindication in 4.3 is mirrored in the leaflet.'),
    R('EU-LAB-CHILD', 'Keep out of the sight and reach of children', 'Section 6 of the outer packaging carries exactly "Keep out of the sight and reach of children."', ['eu-outer'], 'error', 'qrd', 'QRD template, Annex IIIA section 6'),
    R('EU-BRAILLE', 'Name in Braille', 'The name of the medicinal product is in Braille on the packaging; where there are several strengths, the strength is included. The text to be embossed is given in section 16.', ['eu-outer'], 'error', 'dir', 'Directive 2001/83/EC, Article 56a',
      'The app checks the text given for Braille, not the embossing itself.'),
    R('EU-SF', 'Safety features', 'Prescription medicines carry a unique identifier in a 2D data matrix and an anti-tampering device. Section 17 states "2D barcode carrying the unique identifier included." and section 18 shows the human-readable product code (PC), serial number (SN) and, where applicable, national reimbursement number (NN).', ['eu-outer'], 'error', 'sf', 'Delegated Regulation (EU) 2016/161, Articles 4 to 7',
      'The app checks the template statements and the PC/SN/NN lines, not a real code.'),
    R('EU-A2', 'Annex II conditions', 'Annex II names the manufacturer responsible for batch release, gives the legal status for supply in B (for example "Medicinal product subject to medical prescription."), and carries the standard statements on periodic safety update reports (the EURD list, Article 107c(7) of Directive 2001/83/EC) in C and on the risk management plan (Module 1.8.2, when an updated RMP is due) in D.', ['eu-annex2'], 'error', 'qrda2', 'QRD template, Annex II',
      'The app checks the supply statement and the key phrases of the PSUR and RMP statements, not every word; conditions specific to a product (additional risk minimisation, post-authorisation measures) are not checked.'),
    R('EU-SMALL', 'Immediate packaging particulars', 'Blisters, strips and small immediate packaging give the expiry date after "EXP" and the batch number after "Lot". Small units also give the route of administration with the name, the method of administration and the contents by weight, volume or unit.', ['eu-blister', 'eu-small'], 'error', 'qrd', 'QRD template v10.4, Annex IIIA; Directive 2001/83/EC, Article 55',
      'The app checks the prefixes and that the route and contents are given; the date and batch are printed on the packaging line.'),
    R('EU-GEN-SAME', 'Generic SmPC matches the reference', 'The SmPC of a generic medicinal product follows the reference SmPC. Differences are expected only where the products differ (strengths offered, composition, appearance and excipients in sections 1 to 3 and 6, and the holder, numbers and dates in sections 7 to 10), and in parts left out because they refer to indications or dosage forms still covered by patent law.', ['smpc'], 'error', 'art11', 'Directive 2001/83/EC, Articles 10 and 11',
      'The app compares section by section after swapping the product and company names; national authorities also accept differences that the app cannot judge, which you would waive with a reason.'),
    R('EU-GEN-CARVE', 'Patent-protected indication fully left out', 'When an indication still covered by patent law is left out of a generic SmPC, every mention that depends on it goes too: indication, posology, adverse reaction data and clinical data.', ['smpc'], 'error', 'art11', 'Directive 2001/83/EC, Article 11',
      'Mentions are found by keywords defined for the left-out indication in the exercise.'),
    R('EU-LAB-PART', 'Particulars agree with the SmPC', 'The name, strength, pharmaceutical form, pack size, authorisation number and holder on the packaging agree with the SmPC.', ['eu-outer', 'eu-blister'], 'error', 'dir', 'Directive 2001/83/EC, Articles 54 and 55'),
    R('EU-BLUEBOX', 'Blue box for national particulars', 'Centrally authorised products may carry a "blue box" on the outer packaging for national particulars (for example price or reimbursement) required by a member state.', ['eu-outer'], 'info', 'dir', 'Directive 2001/83/EC, Article 57',
      'Shown as a hint only: whether a blue box is needed depends on the member states where the pack is sold.'),
    R('EU-QR', 'QR codes need agency assessment', 'A QR code or other mobile-scanning link in the labelling or leaflet of a centrally authorised product must be submitted to EMA, and the content it links to must be consistent with the approved product information and not promotional.', ['pl', 'eu-outer'], 'info', 'qr', 'EMA QR code guidance'),
    R('EU-DATE', 'Revision dates', 'SmPC section 10 gives the date of revision, and the leaflet ends with the month and year it was last revised.', ['smpc', 'pl'], 'warning', 'qrd', 'QRD template v10.4, SmPC section 10 and Annex IIIB'),
    R('EU-STR', 'Strengths agree', 'The strengths in the SmPC name and composition agree with the product and with the labelling.', ['smpc', 'eu-outer'], 'warning', 'qrd', 'QRD template v10.4'),
    R('EU-PL-READ', 'Plain language in the leaflet', 'The leaflet should be easy to read: short sentences, everyday words, explained medical terms.', ['pl'], 'info', 'read', 'Readability guideline, chapter A',
      'Reading grade is an estimate (Flesch-Kincaid style) shown as a hint.'),
    R('EU-UT', 'User test passed', 'The leaflet is user tested (or bridged to a tested leaflet). The usual success standard: for each question, at least 16 of 20 participants (about 81%) find the information and show they understand it, over two rounds of 10 on the final text.', ['pl'], 'warning', 'readno', 'Readability guideline; national agency summary',
      'The simulator estimates participants\' results from the leaflet text; a real test uses real people.'),
    R('EU-TR-TERM', 'Approved terms in the translation', 'A translation uses the approved terms from the term base for each source term it translates.', ['smpc', 'pl'], 'error', 'ling', 'Linguistic review process'),
    R('EU-TR-NUM', 'Numbers kept in the translation', 'Every number in a section of the source (doses, durations, strengths) appears in the matching section of the translation.', ['smpc', 'pl'], 'error', 'ling', 'Linguistic review process',
      'The app compares digits section by section.'),
    R('EU-TR-MISS', 'Every section translated', 'Every section of the source has a translated section with content.', ['smpc', 'pl'], 'warning', 'ling', 'Linguistic review process'),
    R('EU-PROMO', 'No promotional wording', 'Product information must not be promotional. Words such as "best", "safest" or "superior" do not belong in it.', ['smpc', 'pl'], 'warning', 'dir', 'Directive 2001/83/EC, Article 62'),
]

# Term base for the French translation exercise (fictional practice glossary).
TERM_BASE = {
    'fr': [
        {'source': 'side effects', 'target': 'effets indésirables', 'note': 'Not "effets secondaires" in product information.'},
        {'source': 'doctor', 'target': 'médecin'},
        {'source': 'pharmacist', 'target': 'pharmacien'},
        {'source': 'film-coated tablet', 'target': 'comprimé pelliculé'},
        {'source': 'blood clots', 'target': 'caillots sanguins'},
        {'source': 'breast-feeding', 'target': 'allaitement'},
        {'source': 'pregnancy', 'target': 'grossesse'},
        {'source': 'leaflet', 'target': 'notice'},
        {'source': 'contraception', 'target': 'contraception'},
        {'source': 'infection', 'target': 'infection'},
    ],
}
LANGS = {'fr': 'French', 'de': 'German', 'es': 'Spanish', 'it': 'Italian', 'nl': 'Dutch', 'pl': 'Polish', 'pt': 'Portuguese', 'sv': 'Swedish'}
