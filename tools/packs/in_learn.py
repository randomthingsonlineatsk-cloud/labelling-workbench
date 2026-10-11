"""India learning content: lessons 25 to 29, quiz questions, drills and glossary terms."""


def L(id, title, minutes, sections, try_it=None):
    return {'id': id, 'module': 'in', 'title': title, 'minutes': minutes, 'sections': [{'h': h, 'p': p} for h, p in sections], 'tryIt': try_it, 'watch': False}


LESSONS = [
    L(25, 'Rule 96: what every Indian label must show', 8, [
        ('The particulars', [
            'Rule 96 of the Drugs Rules, 1945 (until 2023 the Drugs and Cosmetics Rules) lists what the label of a drug must show: the proper name, the net content, the content of active ingredients, the name and address of the manufacturer and the premises, the batch number, the manufacturing licence number, and the dates of manufacture and expiry.',
            'Each comes with a set prefix: "B. No." or "Batch No.", "Mfg. Lic. No." or "M.L.", "Mfg. Date" and "Exp. Date". Inspectors and pharmacists rely on finding them in the same form on every pack.',
        ]),
        ('Proper name first', [
            'Since April 2019 the proper (generic) name is printed in a font at least two sizes larger than the brand name, and the brand name comes below or after it. Vitamin fixed-dose combinations and combinations of three or more drugs are exempt.',
        ]),
    ], try_it={'sample': 'in-ostrevia-errors', 'doc': 'carton-10'}),
    L(26, 'Schedule cautions and warnings (Rule 97)', 7, [
        ('Which drugs, which words', [
            'Drugs in Schedules G, H, H1 and X carry a caution or warning set by Rule 97. Since November 2018 it is printed in legible black type inside a completely red rectangular box, and each schedule has its own header, such as "SCHEDULE H PRESCRIPTION DRUG – CAUTION" followed by "Not to be sold by retail without the prescription of a Registered Medical Practitioner."',
            'Schedule H1 adds "It is dangerous to take this preparation except in accordance with the medical advice." Schedule X and narcotic or psychotropic Schedule H drugs use "WARNING" and "To be sold by retail on the prescription of a Registered Medical Practitioner only."',
        ]),
        ('Symbols', [
            'Rx goes at the top left of Schedule H and H1 labels in red; NRx for narcotic and psychotropic substances; XRx for Schedule X. The old red vertical line on the left of the label was replaced by the red box.',
        ]),
    ], try_it={'sample': 'in-ostrevia-errors', 'doc': 'carton-10', 'focus': 'c6'}),
    L(27, 'The package insert', 8, [
        ('The CDSCO format', [
            'For a new drug, the prescribing information approved with the permission under the New Drugs and Clinical Trials Rules, 2019 becomes the package insert. CDSCO-approved inserts follow a set of numbered headings: generic name, composition, dosage form and strength, clinical particulars (4.1 to 4.9), pharmacological and nonclinical properties, description, pharmaceutical particulars, patient counselling information, manufacturer, permission or licence number with date, and date of revision.',
            'The insert opens with "For the use of a Registered Medical Practitioner or a Hospital or a Laboratory only." Its content must match what CDSCO approved; changes go through CDSCO.',
        ]),
        ('Adverse reaction reporting', [
            'Inserts point to the Pharmacovigilance Programme of India (PvPI) for reporting suspected adverse reactions, alongside the company.',
        ]),
    ], try_it={'sample': 'in-ostrevia-clean', 'doc': 'pi'}),
    L(28, 'QR codes under Schedule H2', 6, [
        ('What the code carries', [
            'Schedule H2, added by the Drugs (Eighth Amendment) Rules, 2022, requires a QR code on the primary package label (or the secondary label where the primary has no space) of listed brands. It encodes the unique product identification code, the proper and generic name, the brand name, the manufacturer’s name and address, the batch number, the dates of manufacture and expiry, and the manufacturing licence number.',
        ]),
        ('Who is in scope', [
            'The top 300 brands by sales value have carried the code since 1 August 2023. The list is being extended to vaccines, anti-cancer and NDPS drugs from 1 July 2027 and to antimicrobials from 1 July 2028. The Health Ministry has also said excipient details will be added.',
        ]),
    ], try_it={'sample': 'in-ostrevia-directive', 'doc': 'carton-10'}),
    L(29, 'Price and the pack', 6, [
        ('The maximum retail price', [
            'Under the Drugs (Prices Control) Order, 2013, the label of the container and of the smallest pack offered for retail sale shows the maximum retail price, inclusive of all taxes. For scheduled formulations the price cannot exceed the ceiling price fixed by the National Pharmaceutical Pricing Authority (NPPA); when the ceiling is revised, the MRP on new packs changes.',
            'A strip sold on its own is a retail pack, so it carries its own MRP.',
        ]),
        ('Claims', [
            'Labels and inserts must not claim to prevent or cure the diseases in Schedule J unless the drug is approved for it, and like all product information they must not be promotional.',
        ]),
    ], try_it={'sample': 'in-ostrevia-errors', 'doc': 'strip-10'}),
]


def Q(id, topic, q, options, answer, why, cite):
    return {'id': id, 'topic': topic, 'module': 'in', 'q': q, 'options': options, 'answer': answer, 'why': why, 'cite': cite}


QUESTIONS = [
    Q('q25-1', 25, 'Which prefix does Rule 96 use for the batch number?', ['"B. No." or "Batch No."', '"Lot"', '"BN#"', 'None'], 0, 'Rule 96 prescribes the prefix.', 'Rule 96(1)'),
    Q('q25-2', 25, 'How much larger must the proper name be than the brand name?', ['At least two font sizes', 'The same size', 'Twice the height', 'One font size'], 0, 'Since April 2019, at least two font sizes larger, brand name below or after.', 'Rule 96 proviso'),
    Q('q25-3', 25, 'Which products are exempt from the proper-name size rule?', ['Vitamin FDCs and FDCs of three or more drugs', 'All imported drugs', 'All tablets', 'Schedule X drugs'], 0, 'Those FDCs are exempt.', 'Rule 96 proviso'),
    Q('q25-4', 25, 'Which prefix goes before the manufacturing licence number?', ['"Mfg. Lic. No." or "M.L."', '"Licence"', '"DL No."', '"Reg."'], 0, 'Rule 96 sets the prefix.', 'Rule 96(1)'),
    Q('q25-5', 25, 'What is the Drugs and Cosmetics Rules, 1945 now called for drugs?', ['The Drugs Rules, 1945', 'The Medicines Act', 'The NDCT Rules', 'DPCO'], 0, 'The rules were renamed in 2023 when cosmetics moved to separate rules.', 'Drugs Rules, 1945'),
    Q('q26-1', 26, 'How is the Schedule H caution printed since 2018?', ['Black type in a completely red rectangular box', 'A red vertical line on the left', 'Red type with no box', 'Only in the insert'], 0, 'The red box replaced the red line.', 'Rule 97 (2018 amendment)'),
    Q('q26-2', 26, 'Which symbol goes on a Schedule X label?', ['XRx', 'Rx', 'NRx', 'No symbol'], 0, 'Schedule X uses XRx.', 'Rule 97'),
    Q('q26-3', 26, 'Which sentence is added for Schedule H1?', ['It is dangerous to take this preparation except in accordance with the medical advice.', 'Keep out of reach of children.', 'For external use only.', 'Store below 30°C.'], 0, 'H1 adds this caution.', 'Rule 97'),
    Q('q26-4', 26, 'A Schedule H drug that is a psychotropic substance carries which symbol?', ['NRx', 'Rx', 'XRx', 'H'], 0, 'NDPS substances use NRx.', 'Rule 97'),
    Q('q26-5', 26, 'Where does the schedule caution go?', ['On the innermost container label and every covering', 'Only on the carton', 'Only in the insert', 'Only on the invoice'], 0, 'Every label layer carries it.', 'Rule 97'),
    Q('q27-1', 27, 'Which statement opens a prescription drug’s package insert?', ['For the use of a Registered Medical Practitioner or a Hospital or a Laboratory only.', 'Keep this leaflet.', 'Rx only.', 'Read before use.'], 0, 'CDSCO-approved inserts carry it.', 'CDSCO package insert format'),
    Q('q27-2', 27, 'What does section 11 of the insert give?', ['The permission or licence number with its date', 'The price', 'The batch number', 'The storage temperature'], 0, 'Heading 11 is the permission or licence number with date.', 'CDSCO package insert format'),
    Q('q27-3', 27, 'Which programme receives adverse reaction reports in India?', ['The Pharmacovigilance Programme of India (PvPI)', 'MedWatch', 'EudraVigilance', 'Yellow Card'], 0, 'PvPI is India’s national programme.', 'PvPI'),
    Q('q27-4', 27, 'Under which rules does CDSCO grant permission for a new drug?', ['New Drugs and Clinical Trials Rules, 2019', 'DPCO 2013', 'Legal Metrology Rules', 'Schedule M'], 0, 'The NDCT Rules govern new drug permission.', 'NDCT Rules 2019'),
    Q('q27-5', 27, 'Can a company change the approved insert wording on its own?', ['No, changes go through CDSCO', 'Yes, any time', 'Only the price', 'Only the indication'], 0, 'The insert must match the approved text.', 'NDCT Rules 2019'),
    Q('q28-1', 28, 'Since when have the top 300 brands carried a QR code?', ['1 August 2023', '1 January 2020', '1 July 2027', 'They do not'], 0, 'Schedule H2 applied from 1 August 2023.', 'Drugs (Eighth Amendment) Rules, 2022'),
    Q('q28-2', 28, 'Which is not one of the Schedule H2 data elements?', ['The price', 'The batch number', 'The brand name', 'The manufacturing licence number'], 0, 'Price is not in the list.', 'Schedule H2'),
    Q('q28-3', 28, 'Where does the QR code go?', ['The primary package label, or the secondary label if the primary has no space', 'Only the shipping case', 'Only the insert', 'The invoice'], 0, 'Primary first, secondary if needed.', 'Schedule H2'),
    Q('q28-4', 28, 'From when are antimicrobials added to Schedule H2?', ['1 July 2028', '1 August 2023', '2026', 'Never'], 0, 'Antimicrobials from 1 July 2028; vaccines, anti-cancer and NDPS drugs from 1 July 2027.', 'Schedule H2 extension'),
    Q('q28-5', 28, 'What is planned to be added to the QR code?', ['Excipient details', 'The doctor’s name', 'The pharmacy address', 'The patient’s name'], 0, 'The Health Ministry announced it would add excipients.', 'Health Ministry announcement'),
    Q('q29-1', 29, 'What words must follow the MRP?', ['Inclusive of all taxes', 'Plus GST', 'Excluding taxes', 'Approximately'], 0, 'DPCO 2013 requires the MRP inclusive of all taxes.', 'DPCO 2013'),
    Q('q29-2', 29, 'Does a strip sold on its own need an MRP?', ['Yes, it is the smallest retail pack', 'No, only the carton', 'Only for Schedule X', 'Only for imports'], 0, 'The smallest pack offered for sale shows the MRP.', 'DPCO 2013'),
    Q('q29-3', 29, 'Who fixes ceiling prices of scheduled formulations?', ['NPPA', 'CDSCO', 'The state drug controller', 'The pharmacist'], 0, 'The National Pharmaceutical Pricing Authority.', 'DPCO 2013'),
    Q('q29-4', 29, 'Which claim is not allowed on a label?', ['That it cures cancer, unless approved for it', 'The strength', 'The storage', 'The batch number'], 0, 'Schedule J lists diseases a drug may not claim to cure or prevent.', 'Schedule J'),
    Q('q29-5', 29, 'The ceiling price is revised downwards. What changes on new packs?', ['The MRP', 'The batch number format', 'The schedule warning', 'The proper name'], 0, 'New packs carry the revised MRP.', 'DPCO 2013'),
]

DRILLS = [
    {'id': 'in-pi-fix', 'module': 'in', 'title': 'Fix the package insert', 'minutes': 12, 'sample': 'in-ostrevia-errors', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['IN-']},
     'about': 'Restore the RMP statement, the heading, the permission date, the strength and the revision date, and remove the promotional claim.'},
    {'id': 'in-label-fix', 'module': 'in', 'title': 'Fix the carton and strip', 'minutes': 15, 'sample': 'in-ostrevia-errors', 'doc': 'carton-10', 'goal': {'type': 'rules-multi', 'docs': ['carton-10', 'strip-10'], 'prefixes': ['IN-']},
     'about': 'The Rx symbol, the 2018 red-box caution, the proper name size, the Rule 96 prefixes, the MRP and the expiry date.'},
    {'id': 'in-directive', 'module': 'in', 'capstone': True, 'title': 'Capstone: implement a CDSCO directive', 'minutes': 30, 'sample': 'in-ostrevia-directive', 'doc': 'pi', 'tab': 'changes', 'goal': {'type': 'directive'},
     'about': 'Add tuberculosis screening (IGRA or skin test, chest X-ray) to 4.4 and section 9, revise the date, add the Schedule H2 QR code and the new MRP to the carton and strip, approve all three, and record the submission within 30 days.'},
]

GLOSSARY = [
    {'term': 'CDSCO', 'def': 'Central Drugs Standard Control Organisation: India’s national drug regulator, headed by the Drugs Controller General of India (DCGI).'},
    {'term': 'DPCO', 'def': 'Drugs (Prices Control) Order, 2013: sets ceiling prices and requires the MRP, inclusive of all taxes, on the label.'},
    {'term': 'MRP', 'def': 'Maximum retail price, printed on the label inclusive of all taxes.'},
    {'term': 'NPPA', 'def': 'National Pharmaceutical Pricing Authority: fixes and revises ceiling prices.'},
    {'term': 'NRx / XRx', 'def': 'Symbols for narcotic or psychotropic Schedule H/H1 drugs (NRx) and Schedule X drugs (XRx).'},
    {'term': 'Package insert (India)', 'def': 'The prescribing information approved by CDSCO, packed with the drug.'},
    {'term': 'Proper name', 'def': 'The generic name of the drug, printed at least two font sizes larger than the brand name.'},
    {'term': 'PvPI', 'def': 'Pharmacovigilance Programme of India.'},
    {'term': 'Rule 96', 'def': 'The rule of the Drugs Rules, 1945 that lists the particulars every drug label must show.'},
    {'term': 'Rule 97', 'def': 'The rule setting the cautions and warnings for Schedule G, H, H1 and X drugs, printed in a red box.'},
    {'term': 'Schedule H / H1 / X', 'def': 'Lists of prescription drugs with increasing control; each has its own label caution and symbol.'},
    {'term': 'Schedule H2', 'def': 'The list of brands that must carry a QR code with set data elements.'},
    {'term': 'Schedule J', 'def': 'Diseases a drug may not claim to prevent or cure.'},
]
