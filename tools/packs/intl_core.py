"""Phase 5 packs: Canada, Switzerland, Japan, Australia and WHO prequalification.

Five small region packs (metadata, sources, templates, rule cards) that share one learning module
("More markets"). Regulation and guidance names are used for their factual meaning. Where a check
follows common practice, or the app's simplification of a template, the rule card says so.
"""

AS_OF = '2026-10-11'


def S(num, title, need='required', subs=None, gloss=None):
    s = {'num': num, 'title': title, 'need': need}
    if subs:
        s['fixedSubs'] = subs
    if gloss:
        s['gloss'] = gloss
    return s


def X(num, title, need='required', gloss=None):
    x = {'num': num, 'title': title, 'need': need}
    if gloss:
        x['gloss'] = gloss
    return x


def R(id, title, text, kinds, severity, src, at, simplified=None):
    r = {'id': id, 'title': title, 'text': text, 'kinds': kinds, 'severity': severity, 'src': src, 'at': at, 'check': id}
    if simplified:
        r['simplified'] = simplified
    return r


# ---------------------------------------------------------------- Canada
CA = {
    'id': 'ca', 'name': 'Canada (Health Canada)', 'short': 'CA', 'version': '1.0.0', 'asOf': AS_OF,
    'kinds': ['ca-pm', 'ca-pmi', 'ca-label'],
    'about': 'The product monograph to the Health Canada master template (Part I health professional information, Part II scientific information) and the outer label of a prescription drug under the Food and Drug Regulations: the Pr symbol, the DIN, the proper name, bilingual text and the plain language labelling contact statement.',
    'watch': [],
    'sources': [
        {'id': 'pmtpl', 'title': 'Health Canada: Product monograph master template (issued 2020-10-30, modified 2025-06-13)', 'url': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/applications-submissions/guidance-documents/product-monograph/master-template.html'},
        {'id': 'pmguide', 'title': 'Health Canada: Guidance document, Product Monograph', 'url': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/applications-submissions/guidance-documents/product-monograph/guidance-document-product-monograph.html'},
        {'id': 'fdr', 'title': 'Food and Drug Regulations (C.R.C., c. 870), C.01.004 to C.01.005: labels, Pr symbol, DIN, plain language labelling', 'url': 'https://laws.justice.gc.ca/eng/regulations/c.r.c.,_c._870/page-45.html'},
        {'id': 'fdra', 'title': 'Food and Drug Regulations (C.R.C., c. 870), A.01.015: label information in English and French', 'url': 'https://laws-lois.justice.gc.ca/eng/regulations/C.R.C.,_c._870/'},
        {'id': 'pll', 'title': 'Health Canada: Plain language labelling regulations for prescription drugs, contact information requirement', 'url': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/applications-submissions/guidance-documents/plain-language-labelling-regulations-prescription-drugs/contact-information-requirement.html'},
    ],
}

CA_PM_SECTIONS = [
    S('rmlc', 'RECENT MAJOR LABEL CHANGES', 'optional'),
    S('1', 'INDICATIONS', subs=[X('1.1', 'Pediatrics'), X('1.2', 'Geriatrics')]),
    S('2', 'CONTRAINDICATIONS'),
    S('3', 'SERIOUS WARNINGS AND PRECAUTIONS BOX', 'optional'),
    S('4', 'DOSAGE AND ADMINISTRATION', subs=[X('4.1', 'Dosing Considerations'), X('4.2', 'Recommended Dose and Dosage Adjustment'), X('4.3', 'Reconstitution', 'optional'), X('4.4', 'Administration'), X('4.5', 'Missed Dose')]),
    S('5', 'OVERDOSE'),
    S('6', 'DOSAGE FORMS, STRENGTHS, COMPOSITION, AND PACKAGING'),
    S('7', 'WARNINGS AND PRECAUTIONS', subs=[X('7.1.1', 'Pregnancy'), X('7.1.2', 'Breastfeeding'), X('7.1.3', 'Pediatrics'), X('7.1.4', 'Geriatrics')]),
    S('8', 'ADVERSE REACTIONS', subs=[X('8.1', 'Adverse Reaction Overview'), X('8.2', 'Clinical Trial Adverse Reactions'), X('8.3', 'Less Common Clinical Trial Adverse Reactions'),
                                      X('8.4', 'Abnormal Laboratory Findings: Hematologic, Clinical Chemistry, and Other Quantitative Data', 'optional'), X('8.5', 'Post-Market Adverse Reactions')]),
    S('9', 'DRUG INTERACTIONS', subs=[X('9.1', 'Serious Drug Interactions', 'optional'), X('9.2', 'Drug Interactions Overview'), X('9.3', 'Drug-Behaviour Interactions', 'optional'), X('9.4', 'Drug-Drug Interactions'),
                                      X('9.5', 'Drug-Food Interactions'), X('9.6', 'Drug-Herb Interactions'), X('9.7', 'Drug-Laboratory Test Interactions')]),
    S('10', 'CLINICAL PHARMACOLOGY', subs=[X('10.1', 'Mechanism of Action'), X('10.2', 'Pharmacodynamics'), X('10.3', 'Pharmacokinetics'), X('10.4', 'Immunogenicity', 'optional')]),
    S('11', 'STORAGE, STABILITY, AND DISPOSAL'),
    S('12', 'SPECIAL HANDLING INSTRUCTIONS', 'optional'),
    S('13', 'PHARMACEUTICAL INFORMATION'),
    S('14', 'CLINICAL TRIALS', subs=[X('14.1', 'Clinical Trials by Indication'), X('14.2', 'Comparative Bioavailability Studies', 'optional')]),
    S('15', 'MICROBIOLOGY', 'optional'),
    S('16', 'NON-CLINICAL TOXICOLOGY'),
    S('17', 'SUPPORTING PRODUCT MONOGRAPHS', 'optional'),
]

# Outer label panels. Numbered for the editor; the regulations list items, not a numbering.
CA_LABEL_SECTIONS = [
    S('l1', 'Scheduling symbol (Pr)', 'recommended'),
    S('l2', 'Brand name'),
    S('l3', 'Proper name'),
    S('l4', 'Strength'),
    S('l5', 'Dosage form'),
    S('l6', 'Drug identification number (DIN)'),
    S('l7', 'Net amount'),
    S('l8', 'Directions for use'),
    S('l9', 'Medicinal ingredients (quantitative)'),
    S('l10', 'Storage'),
    S('l11', 'Lot number'),
    S('l12', 'Expiry date'),
    S('l13', 'Sponsor or manufacturer (name and address)'),
    S('l14', 'Contact and side-effect reporting statement'),
    S('l15', 'Non-medicinal ingredients', 'optional'),
]

CA_PM_TITLE = 'PRODUCT MONOGRAPH INCLUDING PATIENT MEDICATION INFORMATION'

# Patient Medication Information (the patient part of the monograph). Headings of the master template.
CA_PMI_SECTIONS = [
    S('m0', 'Serious warnings and precautions', 'optional'),
    S('m1', 'What {name} is used for'),
    S('m2', 'How {name} works'),
    S('m3', 'The ingredients in {name} are'),
    S('m4', '{name} comes in the following dosage forms'),
    S('m5', 'Do not use {name} if'),
    S('m6', 'To help avoid side effects and ensure proper use, talk to your healthcare professional before you take {name}'),
    S('m7', 'Other warnings you should know about', 'optional'),
    S('m8', 'Tell your healthcare professional about all the medicines you take'),
    S('m9', 'The following may interact with {name}'),
    S('m10', 'How to take {name}'),
    S('m11', 'Usual dose'),
    S('m12', 'Overdose'),
    S('m13', 'Missed dose'),
    S('m14', 'Possible side effects from using {name}'),
    S('m15', 'Serious side effects and what to do about them', 'optional'),
    S('m16', 'Reporting side effects'),
    S('m17', 'Storage'),
    S('m18', 'If you want more information about {name}'),
]
CA_PMI_READ = 'READ THIS FOR SAFE AND EFFECTIVE USE OF YOUR MEDICINE'
CA_PMI_OD = "If you think you, or a person you are caring for, have taken too much {name}, contact a healthcare professional, hospital emergency department, regional poison control centre or Health Canada's toll-free number, 1-844 POISON-X (1-844-764-7669) immediately, even if there are no signs or symptoms."
CA_PMI_REPORT = 'You can report any suspected side effects associated with the use of health products to Health Canada by: visiting the web page on Adverse Reaction Reporting for information on how to report online, by mail or by fax; or calling toll-free at 1-866-234-2345. NOTE: Contact your healthcare professional if you need information about how to manage your side effects. The Canada Vigilance Program does not provide medical advice.'

# ---------------------------------------------------------------- Switzerland
CH = {
    'id': 'ch', 'name': 'Switzerland (Swissmedic)', 'short': 'CH', 'version': '1.0.0', 'asOf': AS_OF,
    'kinds': ['ch-fi', 'ch-pi'],
    'about': 'The information for healthcare professionals (Fachinformation, AMZV Annex 4) and the patient information (Patienteninformation, Annex 5.1). Headings and the standard statements are given in German, as Swissmedic publishes them; the practice body text is in English. Official texts are in German, French and Italian.',
    'watch': [
        {'id': 'elvis2', 'title': 'ElViS 2.0', 'src': 'elvis2', 'text': 'Swissmedic plans to replace its ElViS reporting portal with ElViS 2.0 (E2B(R3)) on 21 December 2026. The reporting text in the Fachinformation names ElViS; the app accepts either name.'},
    ],
    'sources': [
        {'id': 'amzv', 'title': 'Arzneimittel-Zulassungsverordnung (AMZV, SR 812.212.22): Annex 4 (Fachinformation), Annex 5.1 (Patienteninformation), Art. 14a (additional monitoring)', 'url': 'https://www.swissmedic.ch/dam/swissmedic/de/dokumente/recht-normen/HMV4-Swissmedic/AMZV.pdf.download.pdf/20180907_AMZV_de.pdf'},
        {'id': 'chbt', 'title': 'Swissmedic: black triangle for medicines under additional monitoring (in force for new submissions from 1 January 2019)', 'url': 'https://www.swissmedic.ch/dam/swissmedic/de/dokumente/stab/veranstaltung/hmg/blacktriangle.pdf.download.pdf/04_Black%20Triangle_Philiipp%20Weyermann.pdf'},
        {'id': 'wlinfo', 'title': 'Swissmedic: Wegleitung Arzneimittelinformation für Humanarzneimittel', 'url': 'https://www.swissmedic.ch/swissmedic/de/home/humanarzneimittel/authorisations/informationen/anpassung-wl-aminfo-ham.html'},
        {'id': 'elvis2', 'title': 'Swissmedic: ElViS 2.0 replaces the electronic vigilance system (notice of 4 September 2026)', 'url': 'https://www.swissmedic.ch/swissmedic/de/home/news/mitteilungen/elvis2-0-elektronisches-vigilanzsystem-wird-durch-modernisiertes-meldetool-abgeloest.html'},
    ],
}

CH_FI_SECTIONS = [
    S('f1', 'Zusammensetzung', subs=[X('f1.1', 'Wirkstoffe', gloss='Active substances'), X('f1.2', 'Hilfsstoffe', gloss='Excipients')], gloss='Composition'),
    S('f2', 'Darreichungsform und Wirkstoffmenge pro Einheit', gloss='Pharmaceutical form and quantity of active substance per unit'),
    S('f3', 'Indikationen/Anwendungsmöglichkeiten', gloss='Indications'),
    S('f4', 'Dosierung/Anwendung', gloss='Posology and method of administration'),
    S('f5', 'Kontraindikationen', gloss='Contraindications'),
    S('f6', 'Warnhinweise und Vorsichtsmassnahmen', gloss='Warnings and precautions'),
    S('f7', 'Interaktionen', gloss='Interactions'),
    S('f8', 'Schwangerschaft, Stillzeit', gloss='Pregnancy, lactation'),
    S('f9', 'Wirkung auf die Fahrtüchtigkeit und auf das Bedienen von Maschinen', gloss='Effects on ability to drive and use machines'),
    S('f10', 'Unerwünschte Wirkungen', gloss='Undesirable effects'),
    S('f11', 'Überdosierung', gloss='Overdose'),
    S('f12', 'Eigenschaften/Wirkungen', gloss='Properties/effects (pharmacodynamics)'),
    S('f13', 'Pharmakokinetik', gloss='Pharmacokinetics'),
    S('f14', 'Präklinische Daten', gloss='Preclinical data'),
    S('f15', 'Sonstige Hinweise', gloss='Other information (incompatibilities, shelf life, storage)'),
    S('f16', 'Zulassungsnummer', gloss='Authorisation number'),
    S('f17', 'Packungen', gloss='Packs (with dispensing category)'),
    S('f18', 'Zulassungsinhaberin', gloss='Marketing authorisation holder'),
    S('f19', 'Stand der Information', gloss='Date of the information'),
]

CH_PI_SECTIONS = [
    S('p1', 'Was ist {name} und wann wird es angewendet?', gloss='What is it and what is it used for?'),
    S('p2', 'Was sollte dazu beachtet werden?', 'optional', gloss='What should be considered?'),
    S('p3', 'Wann darf {name} nicht eingenommen werden?', gloss='When must it not be taken?'),
    S('p4', 'Wann ist bei der Einnahme von {name} Vorsicht geboten?', gloss='When is caution needed?'),
    S('p5', 'Darf {name} während einer Schwangerschaft oder in der Stillzeit eingenommen werden?', gloss='Pregnancy and breastfeeding'),
    S('p6', 'Wie verwenden Sie {name}?', gloss='How to use it'),
    S('p7', 'Welche Nebenwirkungen kann {name} haben?', gloss='Possible side effects'),
    S('p8', 'Was ist ferner zu beachten?', gloss='Other information (storage)'),
    S('p9', 'Was ist in {name} enthalten?', gloss='What it contains'),
    S('p10', 'Zulassungsnummer', gloss='Authorisation number'),
    S('p11', 'Wo erhalten Sie {name}? Welche Packungen sind erhältlich?', gloss='Where to get it, which packs'),
    S('p12', 'Zulassungsinhaberin', gloss='Marketing authorisation holder'),
]

CH_BT_FI = 'Dieses Arzneimittel unterliegt einer zusätzlichen Überwachung. Dies ermöglicht eine schnelle Identifizierung neuer Erkenntnisse über die Sicherheit. Angehörige von Gesundheitsberufen sind aufgefordert, jeden Verdacht einer neuen oder schwerwiegenden Nebenwirkung zu melden.'
CH_BT_PI = 'Dieses Arzneimittel unterliegt einer zusätzlichen Überwachung. Dies ermöglicht eine schnelle Identifizierung neuer Erkenntnisse über die Sicherheit. Sie können dabei helfen, indem Sie Nebenwirkungen melden.'
CH_BT_CORE = ['Dieses Arzneimittel unterliegt einer zusätzlichen Überwachung.', 'Dies ermöglicht eine schnelle Identifizierung neuer Erkenntnisse über die Sicherheit.']
CH_REPORT = 'Meldung des Verdachts einer unerwünschten Wirkung: Die Meldung des Verdachts einer unerwünschten Wirkung nach der Zulassung ist von grosser Wichtigkeit. Sie ermöglicht eine kontinuierliche Überwachung des Nutzen-Risiko-Verhältnisses des Arzneimittels. Angehörige von Gesundheitsberufen sind aufgefordert, jeden Verdacht einer neuen oder schwerwiegenden unerwünschten Wirkung über das Online-Portal ElViS (Electronic Vigilance System) anzuzeigen. Informationen dazu finden Sie unter www.swissmedic.ch.'
CH_PI_HEADER = 'Information für Patientinnen und Patienten'
CH_PI_CHECKED = 'Diese Packungsbeilage wurde im {month} letztmals durch die Arzneimittelbehörde (Swissmedic) geprüft.'

# ---------------------------------------------------------------- Japan
JP = {
    'id': 'jp', 'name': 'Japan (MHLW/PMDA)', 'short': 'JP', 'version': '1.0.0', 'asOf': AS_OF,
    'kinds': ['jp-pi'],
    'about': 'The package insert of a prescription drug in the format in use since April 2019 (PSEHB Notification No. 0608-1, 2017): header items, then numbered sections 1 to 26 whose numbers are kept even when a section is empty. Since August 2021 the insert is electronic, reached from a code on the outer box. The practice text is an English rendering; Japanese inserts are in Japanese.',
    'watch': [
        {'id': 'epijp', 'title': 'Structured electronic package inserts (ePI-JP)', 'src': 'epijp', 'text': 'A FHIR implementation guide for Japanese electronic package inserts is in development. The app shows the section structure only.'},
    ],
    'sources': [
        {'id': 'jp0608', 'title': 'PSEHB Notification No. 0608-1 (8 June 2017): instructions for package inserts of prescription drugs (English translation)', 'url': 'https://www.phrma-jp.org/wordpress/wp-content/uploads/2019/05/PSEHB-Notification-No.0608-1_E_1.1.pdf'},
        {'id': 'jp360', 'title': 'Pharmaceuticals and Medical Devices Safety Information No. 360 (February 2019): package inserts under the revised instructions', 'url': 'https://www.pmda.go.jp/files/000227942.pdf'},
        {'id': 'jpepi', 'title': 'PMDA: electronic package inserts (paper inserts abolished in principle from August 2021; code on the outer box)', 'url': 'https://www.pmda.go.jp/english/safety/info-services/e-pack-ins/0001.html'},
        {'id': 'epijp', 'title': 'Japanese Electronic Medicinal Product Information (ePI-JP), FHIR implementation guide (draft)', 'url': 'https://build.fhir.org/ig/cander2/epi-jp/'},
    ],
}

JP_SECTIONS = [
    S('1', 'WARNINGS', 'optional'),
    S('2', 'CONTRAINDICATIONS'),
    S('3', 'COMPOSITION AND PRODUCT DESCRIPTION', subs=[X('3.1', 'Composition'), X('3.2', 'Product Description')]),
    S('4', 'INDICATIONS'),
    S('5', 'PRECAUTIONS CONCERNING INDICATIONS', 'optional'),
    S('6', 'DOSAGE AND ADMINISTRATION'),
    S('7', 'PRECAUTIONS CONCERNING DOSAGE AND ADMINISTRATION', 'optional'),
    S('8', 'IMPORTANT PRECAUTIONS'),
    S('9', 'PRECAUTIONS CONCERNING PATIENTS WITH SPECIFIC BACKGROUNDS', subs=[
        X('9.1', 'Patients with Complication or History of Diseases, etc.', 'optional'), X('9.2', 'Patients with Renal Impairment', 'optional'), X('9.3', 'Patients with Hepatic Impairment', 'optional'),
        X('9.4', 'Persons with Reproductive Potential', 'optional'), X('9.5', 'Pregnant Women'), X('9.6', 'Breast-feeding Women'), X('9.7', 'Pediatric Use'), X('9.8', 'Geriatric Use')]),
    S('10', 'INTERACTIONS', subs=[X('10.1', 'Contraindications for Co-administration', 'optional'), X('10.2', 'Precautions for Co-administration', 'optional')]),
    S('11', 'ADVERSE REACTIONS', subs=[X('11.1', 'Clinically Significant Adverse Reactions'), X('11.2', 'Other Adverse Reactions')]),
    S('12', 'INFLUENCE ON LABORATORY TESTS', 'optional'),
    S('13', 'OVERDOSAGE', 'optional'),
    S('14', 'PRECAUTIONS CONCERNING USE'),
    S('15', 'OTHER PRECAUTIONS', 'optional', subs=[X('15.1', 'Information Based on Clinical Uses', 'optional'), X('15.2', 'Information Based on Nonclinical Studies', 'optional')]),
    S('16', 'PHARMACOKINETICS', subs=[X('16.1', 'Blood Level', 'optional'), X('16.2', 'Absorption', 'optional'), X('16.3', 'Distribution', 'optional'), X('16.4', 'Metabolism', 'optional'),
                                     X('16.5', 'Excretion', 'optional'), X('16.6', 'Patients with Specific Backgrounds', 'optional'), X('16.7', 'Drug-Drug Interactions', 'optional'), X('16.8', 'Others', 'optional')]),
    S('17', 'CLINICAL STUDIES', subs=[X('17.1', 'Clinical Studies for Efficacy and Safety'), X('17.2', 'Post-marketing Surveillance, etc.', 'optional'), X('17.3', 'Others', 'optional')]),
    S('18', 'PHARMACOLOGY', subs=[X('18.1', 'Mechanism of Action')]),
    S('19', 'PHYSICOCHEMICAL PROPERTIES'),
    S('20', 'PRECAUTIONS FOR HANDLING', 'optional'),
    S('21', 'APPROVAL CONDITIONS', 'optional'),
    S('22', 'PACKAGING'),
    S('23', 'REFERENCES'),
    S('24', 'REFERENCE REQUEST AND CONTACT INFORMATION'),
    S('25', 'PRECAUTION CONCERNING HEALTH INSURANCE BENEFITS', 'optional'),
    S('26', 'MARKETING AUTHORIZATION HOLDER, etc.'),
]

# Header items A to G of the notification (G, the name, is the document's own title line).
JP_HEADER = [
    {'key': 'revised', 'label': 'Date of preparation or revision', 're': r'(Revised|Prepared)\b.*\b(19|20)\d{2}'},
    {'key': 'commodity', 'label': 'Standard Commodity Classification Number of Japan', 're': r'^\s*87\d{4}\s*$'},
    {'key': 'approval', 'label': 'Approval number, date of initial marketing in Japan', 're': r'\b\d{5}[A-Z]{3}\d{8}\b.*\b(19|20)\d{2}'},
    {'key': 'storage', 'label': 'Storage, shelf life', 're': r'(Stor|store).*\b(shelf life|expir)'},
    {'key': 'category', 'label': 'Therapeutic category', 're': r'\w'},
    {'key': 'regulatory', 'label': 'Regulatory classification', 're': r'Prescription drug'},
]
JP_RX = 'Prescription drug (Caution: use only pursuant to the prescription of a physician, etc.)'

# ---------------------------------------------------------------- Australia
AU = {
    'id': 'au', 'name': 'Australia (TGA)', 'short': 'AU', 'version': '1.0.0', 'asOf': AS_OF,
    'kinds': ['au-pi', 'au-cmi'],
    'about': 'The Australian Product Information in the approved form (sections 1 to 10) and the Consumer Medicine Information in the TGA template (a one-page summary and seven sections), with the black triangle scheme. Labels follow Therapeutic Goods Order No. 91 and are not part of this pack.',
    'watch': [],
    'sources': [
        {'id': 'piform', 'title': 'TGA: Form for providing product information (approved under section 7D of the Therapeutic Goods Act 1989)', 'url': 'https://www.tga.gov.au/sites/default/files/legislation-pi-form-approval-180308.pdf'},
        {'id': 'cmitpl', 'title': 'TGA: Improved Consumer Medicine Information template (Schedule 12, Therapeutic Goods Regulations 1990)', 'url': 'https://www.tga.gov.au/sites/default/files/improved-consumer-medicine-information-template.pdf'},
        {'id': 'cmiguide', 'title': 'TGA: Using the TGA CMI template, guidance for sponsors', 'url': 'https://www.tga.gov.au/resources/resource/guidance/using-tga-cmi-template-guidance-sponsors'},
        {'id': 'aubt', 'title': 'TGA: Black triangle scheme, information for sponsors (statements, placement, five years)', 'url': 'https://www.tga.gov.au/sites/default/files/black-triangle-scheme-information-for-sponsors.pdf'},
        {'id': 'tgo91', 'title': 'TGA: Creating prescription medicine labels that meet requirements (Therapeutic Goods Order No. 91)', 'url': 'https://tga.gov.au/node/289612'},
        {'id': 'poisons', 'title': 'Poisons Standard (SUSMP): Schedule 4, Prescription Only Medicine', 'url': 'https://www.legislation.gov.au/F2023L00617/asmade/2023-05-26/text/original/epub/OEBPS/document_1/document_1.html'},
    ],
}

AU_PI_SECTIONS = [
    S('1', 'NAME OF THE MEDICINE'),
    S('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION'),
    S('3', 'PHARMACEUTICAL FORM'),
    S('4', 'CLINICAL PARTICULARS', subs=[X('4.1', 'Therapeutic indications'), X('4.2', 'Dose and method of administration'), X('4.3', 'Contraindications'), X('4.4', 'Special warnings and precautions for use'),
                                        X('4.5', 'Interactions with other medicines and other forms of interactions'), X('4.6', 'Fertility, pregnancy and lactation'), X('4.7', 'Effects on ability to drive and use machines'),
                                        X('4.8', 'Adverse effects (Undesirable effects)'), X('4.9', 'Overdose')]),
    S('5', 'PHARMACOLOGICAL PROPERTIES', subs=[X('5.1', 'Pharmacodynamic properties'), X('5.2', 'Pharmacokinetic properties'), X('5.3', 'Preclinical safety data')]),
    S('6', 'PHARMACEUTICAL PARTICULARS', subs=[X('6.1', 'List of excipients'), X('6.2', 'Incompatibilities'), X('6.3', 'Shelf life'), X('6.4', 'Special precautions for storage'), X('6.5', 'Nature and contents of container'),
                                              X('6.6', 'Special precautions for disposal'), X('6.7', 'Physicochemical properties')]),
    S('7', 'MEDICINE SCHEDULE (POISONS STANDARD)'),
    S('8', 'SPONSOR'),
    S('9', 'DATE OF FIRST APPROVAL'),
    S('10', 'DATE OF REVISION'),
]

AU_CMI_SECTIONS = [
    S('sum', 'Consumer Medicine Information (CMI) summary'),
    S('1', 'Why am I using {name}?'),
    S('2', 'What should I know before I use {name}?'),
    S('3', 'What if I am taking other medicines?'),
    S('4', 'How do I use {name}?'),
    S('5', 'What should I know while using {name}?'),
    S('6', 'Are there any side effects?'),
    S('7', 'Product details'),
]

AU_PI_TITLE = 'AUSTRALIAN PRODUCT INFORMATION – {NAME} ({established}) {form}'
AU_BT_PI = '▼ This medicinal product is subject to additional monitoring in Australia. This will allow quick identification of new safety information. Healthcare professionals are asked to report any suspected adverse events at www.tga.gov.au/reporting-problems.'
AU_BT_CMI = '▼ This medicine is subject to additional monitoring. This will allow quick identification of new safety information. You can help by reporting any side effects you may get. You can report side effects to your doctor, or directly at www.tga.gov.au/reporting-problems.'
AU_SUM_INTRO = 'The full CMI on the next page has more details. If you are worried about using this medicine, speak to your doctor or pharmacist.'
AU_CMI_REPORT = 'After you have received medical advice for any side effects you experience, you can report side effects to the Therapeutic Goods Administration online at www.tga.gov.au/reporting-problems.'
AU_CMI_SE = ['All medicines can have side effects.', 'Tell your doctor or pharmacist if you notice anything else that may be making you feel unwell.', 'Other side effects not listed here may occur in some people.']
AU_PIC = 'For information on the management of overdose, contact the Poisons Information Centre on 13 11 26 (Australia).'

# ---------------------------------------------------------------- WHO prequalification
WHO = {
    'id': 'who', 'name': 'WHO prequalification (PQT/MED)', 'short': 'WHO', 'version': '1.0.0', 'asOf': AS_OF,
    'kinds': ['who-smpc'],
    'about': 'The summary of product characteristics of a prequalified finished pharmaceutical product, published as Part 4 of the WHO Public Assessment Report (WHOPAR): an SmPC-style template whose last sections give the supplier, the WHO reference number, the date of prequalification and the date of revision.',
    'watch': [],
    'sources': [
        {'id': 'whopar', 'title': 'WHO PQT/MED: Contents and structure of a WHOPAR (Part 4 is the SmPC)', 'url': 'https://extranet.who.int/prequal/medicines/contents-and-structure-whopar'},
        {'id': 'whop4', 'title': 'WHO PQT/MED: Section guidance, WHOPAR Part 4 (SmPC): 4.6, 4.8 frequency terms, 6.4 storage', 'url': 'https://extranet.who.int/prequal/sites/default/files/document_files/111%20Section%20guidance%20Part%204%20WHOPAR_Oct2016.pdf'},
        {'id': 'whoex', 'title': 'Example of a published WHOPAR Part 4 (HA790): section headings 1 to 10 and the opening statement', 'url': 'https://extranet.who.int/prequal/sites/default/files/whopar_files/HA790part4v3.pdf'},
    ],
}

WHO_SECTIONS = [
    S('1', 'NAME OF THE MEDICINAL PRODUCT'),
    S('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION'),
    S('3', 'PHARMACEUTICAL FORM'),
    S('4', 'CLINICAL PARTICULARS', subs=[X('4.1', 'Therapeutic indications'), X('4.2', 'Posology and method of administration'), X('4.3', 'Contraindications'), X('4.4', 'Special warnings and precautions for use'),
                                        X('4.5', 'Interaction with other medicinal products and other forms of interaction'), X('4.6', 'Fertility, pregnancy and breastfeeding'), X('4.7', 'Effects on ability to drive and use machines'),
                                        X('4.8', 'Undesirable effects'), X('4.9', 'Overdose')]),
    S('5', 'PHARMACOLOGICAL PROPERTIES', subs=[X('5.1', 'Pharmacodynamic properties'), X('5.2', 'Pharmacokinetic properties'), X('5.3', 'Preclinical safety data')]),
    S('6', 'PHARMACEUTICAL PARTICULARS', subs=[X('6.1', 'List of excipients'), X('6.2', 'Incompatibilities'), X('6.3', 'Shelf life'), X('6.4', 'Special precautions for storage'), X('6.5', 'Nature and contents of container'),
                                              X('6.6', 'Special precautions for disposal and other handling')]),
    S('7', 'SUPPLIER'),
    S('8', 'WHO REFERENCE NUMBER (WHO Prequalification Programme)'),
    S('9', 'DATE OF PREQUALIFICATION'),
    S('10', 'DATE OF REVISION OF THE TEXT'),
]
WHO_INTRO = "This summary of product characteristics focuses on uses of the medicine covered by WHO's Prequalification Team - Medicines. The medicine may be authorised for additional or different uses by national medicines regulatory authorities."

TEMPLATES = {
    'ca-pm': {'kind': 'ca-pm', 'label': 'Product monograph (Canada)', 'short': 'PM', 'src': 'pmtpl', 'numbered': True, 'sections': CA_PM_SECTIONS, 'fixed': {'title': CA_PM_TITLE}},
    'ca-pmi': {'kind': 'ca-pmi', 'label': 'Patient Medication Information (Canada)', 'short': 'PMI', 'src': 'pmtpl', 'sections': CA_PMI_SECTIONS, 'fixed': {'readThis': CA_PMI_READ}},
    'ca-label': {'kind': 'ca-label', 'label': 'Outer label (Canada)', 'short': 'Label', 'src': 'fdr', 'sections': CA_LABEL_SECTIONS, 'fixed': {}},
    'ch-fi': {'kind': 'ch-fi', 'label': 'Fachinformation (Switzerland)', 'short': 'FI', 'src': 'amzv', 'sections': CH_FI_SECTIONS, 'fixed': {'blackTriangle': '▼ ' + CH_BT_FI}},
    'ch-pi': {'kind': 'ch-pi', 'label': 'Patienteninformation (Switzerland)', 'short': 'PI', 'src': 'amzv', 'sections': CH_PI_SECTIONS, 'fixed': {'header': CH_PI_HEADER, 'blackTriangle': '▼ ' + CH_BT_PI, 'lastChecked': CH_PI_CHECKED}},
    'jp-pi': {'kind': 'jp-pi', 'label': 'Package insert (Japan)', 'short': 'PI', 'src': 'jp0608', 'numbered': True, 'sections': JP_SECTIONS, 'fixed': {h['key']: '' for h in JP_HEADER}},
    'au-pi': {'kind': 'au-pi', 'label': 'Product Information (Australia)', 'short': 'PI', 'src': 'piform', 'numbered': True, 'sections': AU_PI_SECTIONS, 'fixed': {'title': AU_PI_TITLE, 'blackTriangle': AU_BT_PI}},
    'au-cmi': {'kind': 'au-cmi', 'label': 'Consumer Medicine Information (Australia)', 'short': 'CMI', 'src': 'cmitpl', 'sections': AU_CMI_SECTIONS, 'fixed': {'blackTriangle': AU_BT_CMI, 'summaryIntro': AU_SUM_INTRO, 'prepared': 'This leaflet was prepared in {month}.'}},
    'who-smpc': {'kind': 'who-smpc', 'label': 'SmPC (WHO prequalification)', 'short': 'SmPC', 'src': 'whoex', 'numbered': True, 'sections': WHO_SECTIONS, 'fixed': {'intro': WHO_INTRO}},
}

PROMO = ['best', 'safest', 'superior', 'breakthrough', 'miracle', 'guaranteed', 'number one', 'revolutionary']
NONSTANDARD_FREQ = ['frequently', 'often', 'occasionally', 'sometimes', 'infrequent', 'seldom']
FR_MARKERS = {
    'l5': {'label': 'dosage form', 're': 'comprimés|gélules|capsules|solution|pellicul'},
    'l7': {'label': 'net amount', 're': 'comprimés|gélules|flacon|unités'},
    'l8': {'label': 'directions for use', 're': 'posologie|monographie|mode d.emploi'},
    'l10': {'label': 'storage', 're': 'conserver'},
    'l14': {'label': 'contact and reporting statement', 're': 'signal|déclar'},
}

ALL = ['ca-pm', 'ca-pmi', 'ca-label', 'ch-fi', 'ch-pi', 'jp-pi', 'au-pi', 'au-cmi', 'who-smpc']
RULES = [
    # Canada
    R('CA-HEAD', 'Product monograph headings, in order', 'The product monograph uses the numbered headings of the master template in order: 1 Indications to 12 Special Handling Instructions in Part I, 13 Pharmaceutical Information to 17 Supporting Product Monographs in Part II. The Patient Medication Information uses the plain-language headings of the template.', ['ca-pm', 'ca-pmi'], 'error', 'pmtpl', 'Product monograph master template',
      'Subsections 7.1.1 to 7.1.4 sit directly under section 7 in the editor; the unnumbered body-system subheadings of section 7 are written in the text.'),
    R('CA-REQ', 'Required content is filled', 'Each required heading of the product monograph and the Patient Medication Information, and each mandatory item of the label, has content.', ['ca-pm', 'ca-pmi', 'ca-label'], 'error', 'pmtpl', 'Master template; Food and Drug Regulations C.01.004'),
    R('CA-TITLE', 'Title page', 'The title page gives "Product Monograph Including Patient Medication Information", the scheduling symbol before the brand name (Pr for a prescription drug), and the date of authorization in YYYY-MM-DD form.', ['ca-pm'], 'error', 'pmtpl', 'Master template, title page',
      'The app checks the title, the symbol and the dates; the full title page also carries the sponsor, the control number and any trademark declaration.'),
    R('CA-SWP', 'Serious Warnings and Precautions box', 'When serious warnings were identified, section 3 holds them in a box of bulleted text, generally no more than 20 lines, with cross-references to the relevant sections, and the Patient Medication Information repeats them in plain language in its own serious warnings box.', ['ca-pm', 'ca-pmi'], 'error', 'pmtpl', 'Master template, section 3'),
    R('CA-RMLC', 'Recent Major Label Changes', 'Each entry names the section and gives the month of approval in YYYY-MM form; entries are kept for 24 months.', ['ca-pm'], 'warning', 'pmtpl', 'Master template, Recent Major Label Changes'),
    R('CA-PMI-STD', 'Standard Patient Medication Information statements', 'The Patient Medication Information opens with "READ THIS FOR SAFE AND EFFECTIVE USE OF YOUR MEDICINE", its Overdose box gives the poison control text with Health Canada\'s toll-free number 1-844 POISON-X (1-844-764-7669), and Reporting side effects gives the Canada Vigilance toll-free number 1-866-234-2345 and says the program does not provide medical advice.', ['ca-pmi'], 'error', 'pmtpl', 'Master template, Patient Medication Information', 'The app checks the opening line, the telephone numbers and the medical-advice sentence rather than every word.'),
    R('CA-PR', 'Pr symbol', 'A prescription drug shows the symbol "Pr" in the upper left quarter of the principal display panel; no other drug may show it.', ['ca-label'], 'error', 'fdr', 'C.01.004(1)(a)'),
    R('CA-DIN', 'Drug identification number', 'The principal display panel shows the eight-digit DIN with "DIN" (or "Drug Identification Number" / "Drogue : identification numérique").', ['ca-label'], 'error', 'fdr', 'C.01.005'),
    R('CA-PROPER', 'Proper name at least half the size of the brand name', 'Where there is a brand name, the proper name is shown on the principal display panel in letters at least one half the size of the brand name.', ['ca-label'], 'error', 'fdr', 'C.01.004(1)(a)'),
    R('CA-LAB', 'Lot and expiry', 'The label shows the lot number (with "Lot") and the expiration date (with "EXP"), giving at least the month and year.', ['ca-label'], 'error', 'fdr', 'C.01.004(1)(c)', 'The app checks the prefixes and a month and year; the regulations do not fix a date format.'),
    R('CA-BIL', 'English and French', 'Information required on the label is shown in both English and French.', ['ca-label'], 'error', 'fdra', 'A.01.015', 'The app looks for French wording in the dosage form, net amount, directions, storage and reporting panels.'),
    R('CA-REPORT', 'Contact for reporting side effects', 'Labels of drugs in dosage form give a way to contact a person in Canada (telephone, email, website or postal address) and state that suspected injuries can be reported to that person.', ['ca-label'], 'error', 'pll', 'C.01.004.01(1)'),
    # Switzerland
    R('CH-HEAD', 'Fachinformation and patient information headings', 'The Fachinformation uses the headings of AMZV Annex 4 and the patient information those of Annex 5.1, in order and with the standard wording.', ['ch-fi', 'ch-pi'], 'error', 'amzv', 'AMZV Annexes 4 and 5.1', 'The app checks the German headings; French and Italian versions follow the same order.'),
    R('CH-REQ', 'Required content is filled', 'Each heading of the Fachinformation and patient information has content.', ['ch-fi', 'ch-pi'], 'error', 'amzv', 'AMZV Annexes 4 and 5.1'),
    R('CH-BT', 'Black triangle (additional monitoring)', 'New active substances, biological medicines authorised since 2019, time-limited authorisations and authorisations with conditions carry the black triangle and the standard text at the top of the Fachinformation and the patient information, until the authorisation is renewed.', ['ch-fi', 'ch-pi'], 'error', 'chbt', 'AMZV Art. 14a'),
    R('CH-ELVIS', 'Reporting text in "Unerwünschte Wirkungen"', 'The section on undesirable effects ends with the request to report suspected new or serious adverse reactions through the ElViS portal.', ['ch-fi'], 'error', 'wlinfo', 'Wegleitung Arzneimittelinformation', 'The app looks for the reporting paragraph and the name ElViS (or ElViS 2.0).'),
    R('CH-ZUL', 'Authorisation number', 'The authorisation number is the five-digit Swissmedic number followed by "(Swissmedic)", the same in the Fachinformation and the patient information.', ['ch-fi', 'ch-pi'], 'error', 'amzv', 'AMZV Annexes 4 and 5.1'),
    R('CH-CAT', 'Dispensing category', 'The packs section gives the dispensing category (Abgabekategorie A to E).', ['ch-fi', 'ch-pi'], 'error', 'amzv', 'AMZV Annex 4 (Packungen) and 5.1'),
    R('CH-DATE', 'Date of the information', 'The Fachinformation ends with the month and year of the information ("Stand der Information"); the patient information ends with the month it was last checked by Swissmedic.', ['ch-fi', 'ch-pi'], 'error', 'amzv', 'AMZV Annexes 4 and 5.1'),
    # Japan
    R('JP-HEAD', 'Package insert sections and numbers', 'Sections use the numbers and headings of the 2017 instructions. A section with nothing to say is left out, but the following sections keep their numbers: they are not moved up.', ['jp-pi'], 'error', 'jp0608', 'PSEHB Notification No. 0608-1'),
    R('JP-REQ', 'Required content is filled', 'The sections that apply to every prescription drug have content.', ['jp-pi'], 'error', 'jp0608', 'PSEHB Notification No. 0608-1'),
    R('JP-HDR', 'Header items', 'Above section 1 the insert gives the date of preparation or revision, the Standard Commodity Classification Number of Japan (87xxxx for drugs), the approval number with the date of initial marketing, storage and shelf life, the therapeutic category and the regulatory classification.', ['jp-pi'], 'error', 'jp0608', 'PSEHB Notification No. 0608-1, header items A to G'),
    R('JP-WARN', 'Warnings', 'When fatal or extremely serious, irreversible adverse reactions can occur, section 1 Warnings is filled and set apart in a box at the top.', ['jp-pi'], 'error', 'jp0608', 'PSEHB Notification No. 0608-1, section 1', 'The red frame of the Warnings box is the usual layout; the app checks that the warnings are boxed.'),
    R('JP-CI', 'Reasons for contraindications', 'Except for hypersensitivity, each contraindication gives its rationale briefly in square brackets [ ].', ['jp-pi'], 'error', 'jp0608', 'PSEHB Notification No. 0608-1, section 2'),
    # Australia
    R('AU-HEAD', 'PI and CMI headings', 'The Product Information uses the headings of the approved form, sections 1 to 10 in order; the CMI uses the summary and the seven headings of the TGA template.', ['au-pi', 'au-cmi'], 'error', 'piform', 'PI form (s. 7D); CMI template (Schedule 12)'),
    R('AU-REQ', 'Required content is filled', 'Each heading of the PI and the CMI has content.', ['au-pi', 'au-cmi'], 'error', 'piform', 'PI form; CMI template'),
    R('AU-TITLE', 'PI title line', 'The PI starts "AUSTRALIAN PRODUCT INFORMATION –" followed by the trade name, the active ingredient and the dosage form.', ['au-pi'], 'error', 'piform', 'PI form'),
    R('AU-BT', 'Black triangle scheme', 'Medicines in the scheme show the ▼ and the standard statement at the top of the first page of the PI and the CMI for five years; others do not.', ['au-pi', 'au-cmi'], 'error', 'aubt', 'Black triangle scheme'),
    R('AU-PI-STD', 'Standard PI statements', 'Section 4.8 points to www.tga.gov.au/reporting-problems, section 4.9 gives the Poisons Information Centre number 13 11 26, section 7 gives the Poisons Standard schedule (for example "Prescription Only Medicine (Schedule 4)"), and sections 9 and 10 give dates.', ['au-pi'], 'error', 'piform', 'PI form', 'The app checks the reporting address and the Poisons Information Centre number rather than the full paragraphs.'),
    R('AU-CMI-STD', 'Standard CMI statements', 'The CMI summary opens with the standard introduction; section 6 carries the standard side-effect sentences and the TGA reporting statement; section 7 ends with "This leaflet was prepared in" and the month and year.', ['au-cmi'], 'error', 'cmitpl', 'CMI template'),
    R('AU-CMI-SUM', 'The summary fits on one page', 'The CMI summary is a single page: the most important information at a glance.', ['au-cmi'], 'warning', 'cmiguide', 'Using the TGA CMI template', 'Estimated at 45 lines of about 90 characters.'),
    # WHO
    R('WHO-HEAD', 'SmPC headings', 'The SmPC uses the headings of the WHOPAR Part 4 template, sections 1 to 10 in order.', ['who-smpc'], 'error', 'whoex', 'WHOPAR Part 4'),
    R('WHO-REQ', 'Required content is filled', 'Each heading of the SmPC has content.', ['who-smpc'], 'error', 'whoex', 'WHOPAR Part 4'),
    R('WHO-INTRO', 'Scope statement', 'The SmPC opens by saying it covers the uses prequalified by WHO and that national authorities may authorise other uses.', ['who-smpc'], 'error', 'whoex', 'WHOPAR Part 4, opening statement'),
    R('WHO-REF', 'WHO reference number', 'Section 8 gives the WHO reference number of the prequalified product (for example "MA999(a)").', ['who-smpc'], 'error', 'whoex', 'WHOPAR Part 4, section 8'),
    R('WHO-DATE', 'Dates', 'Section 9 gives the date of prequalification and section 10 the month and year of the last revision, not earlier than prequalification.', ['who-smpc'], 'error', 'whoex', 'WHOPAR Part 4, sections 9 and 10'),
    R('WHO-48', 'Frequency terms in 4.8', 'Undesirable effects use the MedDRA frequency convention (very common, common, uncommon, rare, very rare, not known), not words such as "often" or "sometimes".', ['who-smpc'], 'warning', 'whop4', 'Section guidance, 4.8'),
    # Shared
    R('INTL-STR', 'Strengths agree', 'The strengths in the composition and dosage form sections agree with the product.', ALL, 'warning', 'pmtpl', 'Every template (composition and pharmaceutical form)'),
    R('INTL-PROMO', 'No promotional wording', 'Product information states facts. Words such as "best", "safest" or "superior" do not belong in it.', ALL, 'warning', 'pmguide', 'Every template; product information is not advertising'),
]

REGIONS = {'ca': CA, 'ch': CH, 'jp': JP, 'au': AU, 'who': WHO}
VOCAB = {
    'jpHeader': JP_HEADER, 'jpRx': JP_RX, 'chBtCore': CH_BT_CORE, 'chReport': CH_REPORT, 'caPmiOd': CA_PMI_OD, 'caPmiReport': CA_PMI_REPORT, 'auCmiReport': AU_CMI_REPORT, 'auCmiSe': AU_CMI_SE, 'auPic': AU_PIC,
    'frMarkers': FR_MARKERS, 'promo': PROMO, 'nonstandardFrequencies': NONSTANDARD_FREQ, 'frequencies': ['very common', 'common', 'uncommon', 'rare', 'very rare', 'not known'],
}
