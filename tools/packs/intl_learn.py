"""More-markets learning content: lessons 30 to 34, quiz questions, drills and glossary terms."""


def L(id, title, minutes, sections, try_it=None):
    return {'id': id, 'module': 'intl', 'title': title, 'minutes': minutes, 'sections': [{'h': h, 'p': p} for h, p in sections], 'tryIt': try_it, 'watch': False}


LESSONS = [
    L(30, 'Canada: the product monograph and the label', 9, [
        ('The master template', [
            'A Canadian product monograph follows the Health Canada master template. Part I, Health Professional Information, runs from 1 Indications to 12 Special Handling Instructions; Part II, Scientific Information, from 13 Pharmaceutical Information to 17 Supporting Product Monographs; the Patient Medication Information follows. Headings are numbered and in capitals; section 7 has unnumbered body-system subheadings such as "Immune" and "Hematologic", in alphabetical order after "General".',
            'The title page gives "Product Monograph Including Patient Medication Information", the scheduling symbol before the brand name ("Pr" for a prescription drug), and the date of authorization as YYYY-MM-DD (the master template revised in 2025 has one date line, "Date of Authorization").',
        ]),
        ('The box and recent changes', [
            'Section 3, the Serious Warnings and Precautions box, lists serious warnings as bullets, generally no more than 20 lines, each with a cross-reference such as "(see 7 WARNINGS AND PRECAUTIONS, Immune)". It is omitted when there are none.',
            'Recent Major Label Changes, before the table of contents, lists each changed section with the month of approval (YYYY-MM). Entries stay for 24 months.',
        ]),
        ('Patient Medication Information', [
            'The patient part of the monograph opens with "READ THIS FOR SAFE AND EFFECTIVE USE OF YOUR MEDICINE" and uses plain-language headings: "What [BRAND] is used for", "Do not use [BRAND] if", "How to take [BRAND]", "Possible side effects from using [BRAND]" and so on. When section 3 has a box, the patient version repeats the serious warnings in plain language in its own box.',
            'Two passages are standard: the Overdose box sends people to a healthcare professional, an emergency department, a poison control centre or Health Canada\'s toll-free number 1-844 POISON-X (1-844-764-7669); Reporting side effects gives the Canada Vigilance toll-free number 1-866-234-2345 and says the program does not provide medical advice.',
        ]),
        ('The label', [
            'Under the Food and Drug Regulations the principal display panel shows "Pr" in the upper left quarter for a prescription drug, the brand name, the proper name in letters at least half the size of the brand name, and the eight-digit DIN. Elsewhere on the label: the sponsor’s name and address, the lot number, the expiry date, the net amount, directions and the medicinal ingredients. Label information is in English and French, and plain language labelling adds a contact in Canada to which side effects can be reported.',
        ]),
    ], try_it={'sample': 'ca-ostrevia-errors', 'doc': 'pm'}),
    L(31, 'Switzerland: Fachinformation and patient information', 8, [
        ('Two documents, three languages', [
            'Swissmedic approves the information for healthcare professionals (Fachinformation, AMZV Annex 4) and the patient information (Patienteninformation, Annex 5.1). They are published in German, French and Italian, with fixed headings: "Zusammensetzung", "Indikationen/Anwendungsmöglichkeiten", "Dosierung/Anwendung" and so on, ending with "Zulassungsnummer", "Packungen", "Zulassungsinhaberin" and "Stand der Information".',
            'The packs section gives the dispensing category (Abgabekategorie A to E). The authorisation number is the five-digit Swissmedic number, written "99101 (Swissmedic)".',
        ]),
        ('The black triangle', [
            'Since 2019 (AMZV Art. 14a), new active substances, new biological medicines, time-limited authorisations and authorisations with conditions carry a black triangle and the text "Dieses Arzneimittel unterliegt einer zusätzlichen Überwachung. Dies ermöglicht eine schnelle Identifizierung neuer Erkenntnisse über die Sicherheit." at the top of both documents, until the authorisation is renewed.',
        ]),
        ('Reporting', [
            'The section on undesirable effects ends with a request to report suspected new or serious adverse reactions through ElViS, Swissmedic’s electronic vigilance portal. ElViS 2.0 is planned for 21 December 2026. The patient information ends with the month it was last checked by Swissmedic.',
        ]),
    ], try_it={'sample': 'ch-ostrevia-errors', 'doc': 'fi'}),
    L(32, 'Japan: the package insert since 2019', 8, [
        ('Header and sections', [
            'The instructions of 2017 (PSEHB Notification No. 0608-1), applied from April 2019, set the header items (date of revision, the Standard Commodity Classification Number, approval number and launch date, storage and shelf life, therapeutic category, regulatory classification, name) and 26 numbered sections, from 1 WARNINGS and 2 CONTRAINDICATIONS to 26 MARKETING AUTHORIZATION HOLDER, etc.',
            'A section with nothing to say is left out, but the numbers are not moved up: if there is no section 12, OVERDOSAGE is still 13. Subsections are numbered 9.1, sub-subsections 9.1.1.',
        ]),
        ('Warnings and contraindications', [
            'WARNINGS (section 1) is used when fatal or extremely serious, irreversible adverse reactions can occur, and sits in a box at the top (traditionally a red frame). For each contraindication other than hypersensitivity, the reason is given briefly in square brackets, such as "[Symptoms may worsen. See 9.1.1.]".',
        ]),
        ('Electronic inserts', [
            'Since August 2021 paper inserts are abolished in principle for prescription drugs. The outer box carries a code that a smartphone app reads to open the latest insert on the PMDA website.',
        ]),
    ], try_it={'sample': 'jp-ostrevia-errors', 'doc': 'pi'}),
    L(33, 'Australia: PI, CMI and the black triangle', 8, [
        ('The PI form', [
            'The Australian Product Information follows the approved form: a title line "AUSTRALIAN PRODUCT INFORMATION – NAME (active ingredient) dosage form", then sections 1 to 10, close to an SmPC, with 6.7 Physicochemical properties, 7 Medicine schedule (Poisons Standard), 8 Sponsor, 9 Date of first approval and 10 Date of revision.',
            'Section 4.8 points healthcare professionals to www.tga.gov.au/reporting-problems, and 4.9 gives the Poisons Information Centre number, 13 11 26.',
        ]),
        ('The CMI template', [
            'The Consumer Medicine Information starts with a one-page summary and has seven headings: why am I using it, what should I know before I use it, other medicines, how do I use it, what should I know while using it, are there any side effects, and product details. Section 6 has standard sentences and the TGA reporting statement; the leaflet ends "This leaflet was prepared in" with the month and year.',
        ]),
        ('Black triangle scheme', [
            'New prescription medicines (Type A applications), provisionally registered medicines and significantly new indications carry the ▼ and a standard statement at the top of the PI and CMI for five years. Labels follow Therapeutic Goods Order No. 91.',
        ]),
    ], try_it={'sample': 'au-ostrevia-errors', 'doc': 'pi'}),
    L(34, 'WHO prequalification: the SmPC of a WHOPAR', 6, [
        ('Part 4 of the WHOPAR', [
            'For a prequalified finished pharmaceutical product, WHO publishes a public assessment report (WHOPAR) in eight parts. Part 4 is the summary of product characteristics, close to the EU template, opening with a statement that it covers the uses prequalified by WHO and that national authorities may authorise others.',
            'Its last sections are 7 Supplier, 8 WHO reference number (such as MA999(a) for an antimalarial), 9 Date of prequalification and 10 Date of revision of the text. Trade names are not prequalified.',
        ]),
        ('Writing for programmes', [
            'Prequalified medicines are bought by procurement agencies for national programmes, often for children. Weight-band dosing tables, preparation of dispersible tablets and the MedDRA frequency convention in 4.8 matter more than brand wording.',
        ]),
    ], try_it={'sample': 'who-malvaren-errors', 'doc': 'smpc'}),
]


def Q(id, topic, q, options, answer, why, cite):
    return {'id': id, 'topic': topic, 'module': 'intl', 'q': q, 'options': options, 'answer': answer, 'why': why, 'cite': cite}


QUESTIONS = [
    Q('q30-1', 30, 'Which symbol does a Canadian prescription drug label carry in the upper left quarter of the main panel?', ['Pr', 'Rx', 'Rx only', 'POM'], 0, 'C.01.004(1)(a): "Pr"; no other drug may show it.', 'Food and Drug Regulations C.01.004'),
    Q('q30-2', 30, 'How many digits does a Canadian DIN have?', ['Eight', 'Six', 'Ten', 'Eleven'], 0, 'The drug identification number is eight digits, shown with "DIN".', 'C.01.005'),
    Q('q30-3', 30, 'How large must the proper name be on a Canadian label?', ['At least half the size of the brand name', 'At least two sizes larger than the brand', 'The same size as the brand', 'Any size'], 0, 'C.01.004(1)(a).', 'C.01.004'),
    Q('q30-4', 30, 'How long do entries stay in Recent Major Label Changes?', ['24 months', '12 months', '6 months', 'Until the next renewal'], 0, 'The template says retain for 24 months.', 'PM master template'),
    Q('q30-5', 30, 'Where is the Serious Warnings and Precautions box?', ['Section 3', 'Section 7', 'The title page', 'Part II'], 0, 'Section 3, with cross-references to the detailed sections.', 'PM master template'),
    Q('q30-7', 30, 'Which toll-free number does the Overdose box of the Canadian Patient Medication Information give?', ['1-844 POISON-X (1-844-764-7669)', '1-866-234-2345', '911 only', 'The sponsor\'s number'], 0, 'Health Canada\'s poison control number; 1-866-234-2345 is for reporting side effects to Canada Vigilance.', 'PM master template, Patient Medication Information'),
    Q('q30-6', 30, 'In which date form is the date of authorization given on the title page?', ['YYYY-MM-DD', 'DD/MM/YYYY', 'Month YYYY', 'MM/YYYY'], 0, 'The template uses YYYY-MM-DD.', 'PM master template'),
    Q('q31-1', 31, 'In which annex of the AMZV is the Fachinformation set out?', ['Annex 4', 'Annex 1', 'Annex 5.1', 'Annex 7'], 0, 'Annex 4; the patient information is Annex 5.1.', 'AMZV'),
    Q('q31-2', 31, 'Which products carry the Swiss black triangle?', ['New active substances, new biologicals, time-limited authorisations and authorisations with conditions', 'All prescription medicines', 'Only vaccines', 'Only generics'], 0, 'AMZV Art. 14a.', 'AMZV Art. 14a'),
    Q('q31-3', 31, 'How long does a Swiss medicine stay under additional monitoring?', ['As a rule until the authorisation is renewed', 'Five years from first supply', 'Two years', 'Permanently'], 0, 'Until renewal, unless Swissmedic extends it.', 'Swissmedic black triangle'),
    Q('q31-4', 31, 'How is the Swiss authorisation number written?', ['"99101 (Swissmedic)"', '"CH-99101"', '"SM 99101"', '"Reg. No. 99101"'], 0, 'Five digits followed by "(Swissmedic)".', 'AMZV Annex 4'),
    Q('q31-5', 31, 'Where does the Fachinformation give the dispensing category?', ['Packungen', 'Zusammensetzung', 'Sonstige Hinweise', 'Stand der Information'], 0, 'The packs section gives the Abgabekategorie.', 'AMZV Annex 4'),
    Q('q31-6', 31, 'Through which portal does the Fachinformation ask professionals to report?', ['ElViS', 'EudraVigilance', 'MedWatch', 'Yellow Card'], 0, 'ElViS; ElViS 2.0 is planned for December 2026.', 'Swissmedic'),
    Q('q32-1', 32, 'A Japanese insert has no section 12. What number does OVERDOSAGE keep?', ['13', '12', '11', 'It is renumbered at the next revision'], 0, 'Numbers are not moved up.', 'PSEHB Notification No. 0608-1'),
    Q('q32-2', 32, 'What must a contraindication other than hypersensitivity include?', ['Its reason, briefly, in square brackets', 'A frequency', 'A literature reference number', 'A boxed warning'], 0, 'The rationale goes in [ ].', 'PSEHB Notification No. 0608-1'),
    Q('q32-3', 32, 'When is section 1 WARNINGS used?', ['When fatal or extremely serious, irreversible adverse reactions can occur', 'Always', 'Only for controlled drugs', 'Only for injectables'], 0, 'When alert is particularly needed.', 'PSEHB Notification No. 0608-1'),
    Q('q32-4', 32, 'What do Japanese drug Standard Commodity Classification Numbers start with?', ['87', '49', '30', '99'], 0, 'Drugs are in class 87.', 'Header item B'),
    Q('q32-5', 32, 'Since when are paper inserts abolished in principle for prescription drugs?', ['August 2021', 'April 2019', 'January 2015', 'April 2024'], 0, 'The electronic insert system took effect on 1 August 2021.', 'PMDA'),
    Q('q32-6', 32, 'How does a user reach the electronic insert?', ['By reading the code on the outer box with an app', 'By calling the MAH', 'Only through a pharmacist login', 'By email request'], 0, 'A barcode or 2D code on the outer box.', 'PMDA'),
    Q('q33-1', 33, 'How does the Australian PI title line start?', ['"AUSTRALIAN PRODUCT INFORMATION –"', '"PRODUCT INFORMATION"', '"PRESCRIBING INFORMATION"', '"SUMMARY OF PRODUCT CHARACTERISTICS"'], 0, 'The approved form sets it.', 'PI form'),
    Q('q33-2', 33, 'Which number does section 4.9 give?', ['The Poisons Information Centre, 13 11 26', '000', 'The sponsor’s number', 'Medicines Line'], 0, 'The PI form text points to the Poisons Information Centre.', 'PI form'),
    Q('q33-3', 33, 'How long does a medicine stay in the Australian black triangle scheme?', ['Five years', 'Two years', 'Until renewal', 'Ten years'], 0, 'Five years from first supply or approval of the new indication.', 'TGA black triangle scheme'),
    Q('q33-4', 33, 'What does the CMI start with?', ['A one-page summary', 'The sponsor details', 'The list of excipients', 'A boxed warning in every case'], 0, 'The CMI summary, required for prescription medicines.', 'CMI template'),
    Q('q33-5', 33, 'Which section of the PI gives the Poisons Standard schedule?', ['7', '6.7', '8', '2'], 0, 'Section 7 Medicine schedule (Poisons Standard).', 'PI form'),
    Q('q33-6', 33, 'Which order sets the label standard for Australian prescription medicines?', ['TGO 91', 'TGO 92', 'TGO 100', 'Schedule 12'], 0, 'TGO 91; TGO 92 covers non-prescription medicines.', 'TGO 91'),
    Q('q34-1', 34, 'Which part of a WHOPAR is the SmPC?', ['Part 4', 'Part 1', 'Part 3', 'Part 6'], 0, 'Part 4 is the information for the health care provider.', 'WHOPAR structure'),
    Q('q34-2', 34, 'What does section 8 of a WHO PQ SmPC give?', ['The WHO reference number', 'The marketing authorisation number', 'The date of revision', 'The supplier'], 0, 'For example MA999(a).', 'WHOPAR Part 4'),
    Q('q34-3', 34, 'Are trade names prequalified by WHO?', ['No', 'Yes', 'Only for antimalarials', 'Only after five years'], 0, 'Trade names are the national regulator’s responsibility.', 'WHOPAR Part 4'),
    Q('q34-4', 34, 'What does the opening statement of the SmPC say?', ['It covers the uses prequalified by WHO; national authorities may authorise others', 'It is legally binding in every country', 'It replaces national labelling', 'It is a summary for patients'], 0, 'It sets the scope.', 'WHOPAR Part 4'),
    Q('q34-5', 34, 'Which frequency word belongs in section 4.8?', ['Uncommon', 'Often', 'Sometimes', 'Occasionally'], 0, 'The MedDRA convention.', 'Section guidance 4.8'),
    Q('q34-6', 34, 'Which storage wording does the section guidance offer for 6.4?', ['"Do not store above 30°C"', '"Store cool"', '"Room temperature"', '"Keep dry if possible"'], 0, 'Standard optional wording.', 'Section guidance 6.4'),
]

DRILLS = [
    {'id': 'ca-fix', 'module': 'intl', 'title': 'Canada: fix the monograph, patient information and label', 'minutes': 15, 'sample': 'ca-ostrevia-errors', 'doc': 'pm', 'goal': {'type': 'rules-multi', 'docs': ['pm', 'pmi', 'carton-10'], 'prefixes': ['CA-', 'INTL-']},
     'about': 'The title page, the box cross-references, the label changes, a heading, Pr, the DIN, the proper name size, French, the reporting contact and the expiry.'},
    {'id': 'ch-fix', 'module': 'intl', 'title': 'Switzerland: fix the Fachinformation and patient information', 'minutes': 12, 'sample': 'ch-ostrevia-errors', 'doc': 'fi', 'goal': {'type': 'rules-multi', 'docs': ['fi', 'pi'], 'prefixes': ['CH-', 'INTL-']},
     'about': 'The black triangle, a heading, the ElViS text, the authorisation numbers, the dispensing category and the dates.'},
    {'id': 'jp-fix', 'module': 'intl', 'title': 'Japan: fix the package insert', 'minutes': 10, 'sample': 'jp-ostrevia-errors', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['JP-', 'INTL-']},
     'about': 'A header item, the Warnings box, a contraindication reason, a section number, an empty subsection and a strength.'},
    {'id': 'au-fix', 'module': 'intl', 'title': 'Australia: fix the PI and CMI', 'minutes': 12, 'sample': 'au-ostrevia-errors', 'doc': 'pi', 'goal': {'type': 'rules-multi', 'docs': ['pi', 'cmi'], 'prefixes': ['AU-', 'INTL-']},
     'about': 'The title, the black triangle, the Poisons Information Centre, the schedule, a heading and the CMI standard statements.'},
    {'id': 'who-fix', 'module': 'intl', 'title': 'WHO PQ: fix the SmPC', 'minutes': 8, 'sample': 'who-malvaren-errors', 'doc': 'smpc', 'goal': {'type': 'rules', 'prefixes': ['WHO-', 'INTL-']},
     'about': 'The scope statement, the reference number, the dates, the frequencies, a heading and the posology.'},
    {'id': 'intl-ild', 'module': 'intl', 'capstone': True, 'title': 'Capstone: one safety signal, four markets', 'minutes': 35, 'sample': 'intl-ostrevia-ild', 'doc': 'ca-pm', 'tab': 'changes', 'goal': {'type': 'rollout-intl'},
     'about': 'Add the interstitial lung disease warning to the Canadian monograph, the Swiss Fachinformation, the Japanese insert and the Australian PI and CMI in the right places, move each date on, approve all five, and classify and submit in the four markets within 60 days.'},
]

GLOSSARY = [
    {'term': 'Abgabekategorie', 'def': 'Swiss dispensing category (A to E), given in the packs section.'},
    {'term': 'AMZV', 'def': 'Arzneimittel-Zulassungsverordnung: the Swissmedic ordinance on authorisation requirements, whose annexes set the Fachinformation and patient information.'},
    {'term': 'ARTG', 'def': 'Australian Register of Therapeutic Goods; AUST R numbers identify registered medicines.'},
    {'term': 'CMI', 'def': 'Consumer Medicine Information: the Australian patient leaflet, with a one-page summary.'},
    {'term': 'DIN', 'def': 'Drug Identification Number: the eight-digit number Health Canada assigns to a drug product.'},
    {'term': 'ElViS', 'def': 'Electronic Vigilance System: Swissmedic’s portal for reporting adverse reactions (ElViS 2.0 from December 2026).'},
    {'term': 'Fachinformation', 'def': 'The Swiss information for healthcare professionals.'},
    {'term': 'Pr symbol', 'def': 'The symbol on Canadian labels and monographs of prescription drugs.'},
    {'term': 'Product monograph', 'def': 'The Canadian factual document on a drug, for healthcare professionals, with Patient Medication Information.'},
    {'term': 'WHOPAR', 'def': 'WHO Public Assessment Report for a prequalified product; Part 4 is the SmPC.'},
]
