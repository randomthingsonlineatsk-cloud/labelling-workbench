"""US learning content: lessons, quiz bank, drills and glossary. Each quiz question cites its source."""

def L(id, title, minutes, sections, try_it=None, watch=False):
    return {'id': id, 'title': title, 'minutes': minutes, 'sections': [{'h': h, 'p': p} for h, p in sections], 'tryIt': try_it, 'watch': watch}

LESSONS = {'region': 'us', 'lessons': [
    L(1, 'What labelling is and who reads it', 6, [
        ('One product, many labels', [
            'In US regulation, "labeling" covers every piece of written, printed or graphic matter on or with a drug: the prescribing information (PI) for health professionals, patient labeling (Medication Guide, Patient Package Insert, Instructions for Use), and the carton and container labels.',
            'Each piece has a different reader. The PI is written for prescribers and pharmacists and is dense and referenced. Patient labeling is written in plain language. Carton and container labels are read in a hurry, often by a nurse or pharmacist picking one product from a shelf of similar ones.',
        ]),
        ('Why the rules are so detailed', [
            'Labels are the main way the evidence in the application reaches the people using the product. FDA approves the exact wording, so labelling work is part writing, part negotiation and part proof-reading.',
            'The rules come from the regulations (21 CFR 201.56 and 201.57 for the PI, 21 CFR 208 for Medication Guides, 21 CFR 201 subpart A and 201.25 for package labels) and from FDA guidances that explain how to write each section.',
        ]),
        ('How this app works', [
            'Each project holds the labels for one fictional product. The editor keeps the sections in the order the template requires, and the checks test the text against rule cards. Every rule card names its source and says when the app simplifies.',
            'Nothing you make here is an approved label. Exports carry a "Training use only" watermark.',
        ]),
    ], try_it={'sample': 'ostrevia-clean', 'doc': 'pi'}),
    L(2, 'PLR structure and Highlights', 8, [
        ('Three parts', [
            'A PLR-format prescribing information has three parts: Highlights (a half-page summary), the Table of Contents, and the Full Prescribing Information (FPI) with 17 numbered sections.',
            'Section numbers never change. If a section does not apply it is left out, but the numbering of the rest stays the same, so "8.4 Pediatric Use" is 8.4 in every PLR label.',
        ]),
        ('What Highlights must contain', [
            'Highlights start with a fixed limitation statement naming the product, then the product title (proprietary name, established name, dosage form, route) and the year of initial US approval. Then come the headings in a fixed order: Boxed Warning, Recent Major Changes, Indications and Usage, Dosage and Administration, Dosage Forms and Strengths, Contraindications, Warnings and Precautions, Adverse Reactions, Drug Interactions, Use in Specific Populations.',
            'Every statement ends with the number of the FPI section it summarises, in parentheses. Highlights end with the patient counselling statement and "Revised: MM/YYYY".',
            'Highlights, not counting a boxed warning, must fit on one half page in the required two-column layout. The app estimates the length from the text; a real label is measured on the typeset page.',
        ]),
        ('The adverse reaction contact line', [
            'Under Adverse Reactions, Highlights carry: "To report SUSPECTED ADVERSE REACTIONS, contact [manufacturer] at [phone] or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch." The manufacturer and number must match the company named on the label.',
        ]),
    ], try_it={'sample': 'ostrevia-clean', 'doc': 'pi', 'focus': 'hl'}),
    L(3, 'Boxed Warning and Recent Major Changes', 7, [
        ('Boxed warning', [
            'A boxed warning is used for serious risks, such as those that may lead to death or serious injury. In the FPI it sits before section 1, inside a box, with a heading starting "WARNING:" in capitals. Each risk points to the Warnings and Precautions subsection with the detail.',
            'Highlights carry a shorter summary of the box, no longer than 20 lines, ending with "See full prescribing information for complete boxed warning."',
        ]),
        ('Recent Major Changes', [
            'Recent Major Changes tell prescribers what changed recently. Only substantive changes to the Boxed Warning, Indications and Usage, Dosage and Administration, Contraindications, or Warnings and Precautions are listed, each with its heading, section number and the month and year.',
            'An entry stays for at least a year and comes off at the first printing after that year. Changes in other sections, such as Adverse Reactions, are not listed even when they matter.',
        ]),
        ('A safety update touches several places', [
            'A new risk usually means: a new or revised 5.x subsection, a Highlights bullet citing it, a Recent Major Changes entry, possibly the boxed warning, section 17, the Medication Guide, and a new revision date. The capstone drill takes you through all of them.',
        ]),
    ], try_it={'sample': 'ostrevia-errors', 'doc': 'pi', 'focus': 'hl'}),
    L(4, 'Writing sections 5 and 6', 8, [
        ('Warnings and Precautions', [
            'Section 5 describes clinically significant risks: what the risk is, how often and how serious it is when that is known, how to monitor for it, and what to do. Each risk gets its own numbered subsection with a short heading.',
            'Cross-references take the form "[see Warnings and Precautions (5.3)]". When subsections move, every reference has to follow; the editor rewrites references when you reorder subsections.',
        ]),
        ('Adverse Reactions', [
            'Section 6 starts by listing the clinically significant reactions described elsewhere, then gives trial data in 6.1 Clinical Trials Experience and spontaneous reports in 6.2 Postmarketing Experience.',
            'When 6.1 presents trial rates, it includes the standard statement that rates from different trials cannot be compared directly. Tables usually show reactions above a threshold incidence and more frequent than placebo.',
        ]),
        ('Contraindications', [
            'Section 4 lists situations in which the drug should not be used because the risk clearly outweighs any benefit. If there are none, the section says "None." It is never left blank.',
        ]),
    ], try_it={'sample': 'ostrevia-errors', 'doc': 'pi', 'focus': '5'}),
    L(5, 'PLLR: sections 8.1 to 8.3', 7, [
        ('What changed in 2015', [
            'The Pregnancy and Lactation Labeling Rule took effect on 30 June 2015. It removed the pregnancy letter categories (A, B, C, D and X) and replaced them with narrative sections: 8.1 Pregnancy, 8.2 Lactation and 8.3 Females and Males of Reproductive Potential.',
            'Older labels moved to the new content on a phased timetable; a new or revised PLR label must not use letter categories at all.',
        ]),
        ('What each subsection holds', [
            '8.1 Pregnancy: a pregnancy exposure registry if there is one, a Risk Summary, Clinical Considerations and Data. 8.2 Lactation: a Risk Summary, Clinical Considerations and Data. 8.3: pregnancy testing, contraception and infertility, when relevant.',
            'The Risk Summary integrates human and animal data into a statement of risk; the background rates of birth defects and miscarriage in the US population are stated.',
        ]),
    ], try_it={'sample': 'ostrevia-errors', 'doc': 'pi', 'focus': '8.1'}),
    L(6, 'Medication Guide, PPI and IFU', 8, [
        ('Medication Guides', [
            'A Medication Guide is required under 21 CFR 208 when FDA decides patient information is needed to prevent serious adverse effects, when patients need to know about a serious risk to decide whether to use the product, or when adherence is crucial.',
            'It uses question headings ("What is the most important information I should know about X?"), plain language, the side-effect reporting statement, the statement that FDA approved it, and a revision date. The carton must tell the dispenser to give it to each patient.',
        ]),
        ('Patient Package Inserts and Instructions for Use', [
            'A PPI is required for a few classes (such as oral contraceptives and oestrogens) and voluntary for others. An IFU explains how to use a product with complex steps, such as an injector or inhaler.',
            'In the PI, section 17 tells the prescriber to advise the patient to read the patient labeling, and the Highlights counselling statement mentions it.',
        ]),
        ('Patient Medication Information (Watch)', [
            'FDA proposed a one-page Patient Medication Information sheet in 2023 that would replace Medication Guides and most PPIs. It is still a proposal; this app teaches it but never requires it.',
        ]),
    ], try_it={'sample': 'ostrevia-errors', 'doc': 'mg'}),
    L(7, 'Carton and container: designing out medication errors', 8, [
        ('What must be on the label', [
            'Package labels carry the proprietary and established names, strength, dosage form, net quantity, "Rx only", the NDC, lot number, expiration date and the name and place of business of the manufacturer, packer or distributor. Cartons also carry the route, a dosage statement and storage. A linear bar code containing the NDC is required (21 CFR 201.25).',
            'The established name must be at least half as large as the proprietary name (21 CFR 201.10(g)(2)).',
        ]),
        ('Safety by design', [
            'FDA\'s 2022 guidance on container and carton design focuses on the errors that labels cause: no trailing zeros ("5 mg", never "5.0 mg"), leading zeros for doses below 1 ("0.5 mg"), no error-prone abbreviations, strength for injectables per total volume and per mL, and enough contrast and differentiation between strengths.',
        ]),
        ('Proof-reading the artwork', [
            'Approved text becomes artwork at a printer. Every proof is compared word by word with the approved text before release; the Proof check tab does this for you.',
        ]),
    ], try_it={'sample': 'nelvaprox-convert', 'doc': 'carton'}),
    L(8, 'SPL basics', 5, [
        ('Labels as data', [
            'FDA receives labeling as Structured Product Labeling (SPL), an HL7 XML standard. Each section has a LOINC code, so systems such as DailyMed can show and search the same text.',
            'The app exports a practice SPL-style file so you can see how sections map to codes. It is not a validated SPL file and must never be submitted.',
        ]),
    ], try_it={'sample': 'ostrevia-clean', 'doc': 'pi', 'tab': 'export'}),
    L(9, 'Generics and section viii', 8, [
        ('Same as the reference', [
            'An ANDA\'s labeling must be the same as the reference listed drug\'s, except for permitted differences such as the manufacturer\'s name, inactive ingredients, how supplied, and aspects omitted because of patents or exclusivity (21 CFR 314.94(a)(8)(iv)).',
            'When the reference label changes, generic labels are updated to match.',
        ]),
        ('Carve-outs', [
            'If a method-of-use patent covers one indication, the generic applicant can file a section viii statement and omit that indication (21 CFR 314.127(a)(7)). The carve-out must be complete: the indication, its dosing, any text that depends on it in adverse reactions and clinical studies, and the Highlights entries.',
            'The Compare tab shows the generic against the reference, section by section, with permitted differences marked.',
        ]),
        ('Biosimilars', [
            'A biosimilar licensed under section 351(k) incorporates the reference product\'s labeling with appropriate changes. Its Highlights carry a biosimilarity statement, "[BIOSIMILAR] ([proper name]) is biosimilar* to [REFERENCE] ([proper name])", with a footnote that explains what biosimilar means. Statements about the product use the biosimilar\'s own name, and its proper name carries a four-letter suffix (olvecitamab-kzrt).',
            'Watch: FDA\'s revised draft guidance of September 2023 recommends the same biosimilarity statement for interchangeable biosimilars and no interchangeability statement in labeling; interchangeability is shown in the Purple Book. The app shows an interchangeability statement as a hint, not an error.',
        ]),
    ], try_it={'sample': 'talmisartan-generic', 'doc': 'pi', 'tab': 'compare'}),
    L(10, 'Safety labelling changes under 505(o)(4)', 6, [
        ('FDA can require a change', [
            'Under section 505(o)(4) of the FD&C Act, when FDA becomes aware of new safety information it believes should be in the labeling, it notifies the holder. The holder has 30 days to submit a supplement with the change or a rebuttal explaining why it is not warranted.',
            'If they disagree, discussions follow; FDA can then order the change. Phase 2 of this app adds a guided 505(o)(4) exercise and the change-request tracker.',
        ]),
        ('Changes the holder starts', [
            'Holders can also strengthen safety wording themselves through a Changes Being Effected supplement. Which supplement type applies is covered in the Variations Classifier.',
        ]),
    ]),
    L(11, 'Converting an older-format label to PLR', 7, [
        ('Two formats', [
            'Older labels (21 CFR 201.80) have unnumbered sections: Description, Clinical Pharmacology, Indications and Usage, Contraindications, Warnings, Precautions, Adverse Reactions, Drug Abuse and Dependence, Overdosage, Dosage and Administration, How Supplied.',
            'Converting to PLR moves the same content into the 17 numbered sections and adds Highlights. Precautions splits up: drug interactions go to 7, pregnancy and nursing to 8.1 and 8.2 (rewritten for PLLR), pediatric and geriatric use to 8.4 and 8.5, and patient information to 17.',
        ]),
        ('What usually needs rewriting', [
            'Letter categories become a Risk Summary. "Nursing Mothers" becomes Lactation. Clinical trial results in Clinical Pharmacology move to 14 Clinical Studies. Warnings and the relevant precautions become numbered 5.x subsections.',
            'The Convert tab scores your mapping and builds a PLR draft for you to finish.',
        ]),
    ], try_it={'sample': 'nelvaprox-convert', 'doc': 'old', 'tab': 'convert'}),
]}

def Q(id, topic, q, options, answer, why, cite):
    return {'id': id, 'topic': topic, 'q': q, 'options': options, 'answer': answer, 'why': why, 'cite': cite}

QUIZ = {'topics': [{'id': l['id'], 'label': f"{l['id']}. {l['title']}"} for l in LESSONS['lessons']], 'questions': [
    # 1
    Q('q1-1', 1, 'Which of these is NOT part of a product\'s labeling in US terms?', ['The prescribing information', 'The Medication Guide', 'The carton', 'The clinical study report'], 3, 'Labeling is the written matter on or with the product. A study report supports the application but is not labeling.', 'FD&C Act 201(m); 21 CFR 201'),
    Q('q1-2', 1, 'Who is the main reader of the prescribing information?', ['Patients', 'Health professionals', 'Distributors', 'Payers'], 1, 'The PI is written for prescribers and pharmacists; patient labeling is written for patients.', '21 CFR 201.56(a)'),
    Q('q1-3', 1, 'Which regulation sets the PLR content and format requirements?', ['21 CFR 201.57', '21 CFR 314.70', '21 CFR 211.137', '21 CFR 50'], 0, '201.56 gives general requirements and 201.57 the specific PLR content and format.', '21 CFR 201.57'),
    Q('q1-4', 1, 'Who approves the exact wording of a prescription drug label in the US?', ['The manufacturer alone', 'FDA', 'The pharmacy board', 'USP'], 1, 'Labeling is part of the approved application; FDA approves its wording.', '21 CFR 314.50(e)'),
    Q('q1-5', 1, 'Medication Guides are governed by which part of 21 CFR?', ['Part 208', 'Part 312', 'Part 600', 'Part 11'], 0, 'Part 208 covers Medication Guides for prescription drugs.', '21 CFR 208'),
    Q('q1-6', 1, 'The bar code requirement for drug labels is in:', ['21 CFR 201.25', '21 CFR 201.57', '21 CFR 207.33', '21 CFR 208.20'], 0, '201.25 requires a linear bar code containing the NDC.', '21 CFR 201.25'),
    Q('q1-7', 1, 'What does a "Training use only" watermark on this app\'s exports mean?', ['The label is approved', 'The label is a practice document and must not be used as a real label', 'The label is in draft at FDA', 'The label is for internal company use'], 1, 'All products here are fictional and nothing is an approved label.', 'App ground rules'),
    Q('q1-8', 1, 'Which reader is most likely to be under time pressure and confuse look-alike products?', ['A regulatory reviewer', 'A nurse choosing a vial from a shelf', 'A patient reading the leaflet at home', 'A statistician'], 1, 'Carton and container labels are designed for quick, accurate selection at the point of use.', 'FDA container and carton guidance (2022)'),
    # 2
    Q('q2-1', 2, 'How long may Highlights be, not counting a boxed warning?', ['One quarter page', 'One half page', 'One page', 'There is no limit'], 1, 'Highlights must fit on one half page unless FDA grants a waiver.', '21 CFR 201.57(d)(8)'),
    Q('q2-2', 2, 'Which item comes right after the product title in Highlights?', ['Recent Major Changes', 'Initial U.S. Approval', 'Indications and Usage', 'Revised date'], 1, 'The year of initial US approval follows the product title.', '21 CFR 201.57(a)(3)'),
    Q('q2-3', 2, 'How does each Highlights statement point to the detail?', ['A footnote', 'The FPI section number in parentheses', 'A hyperlink only', 'Nothing; Highlights stand alone'], 1, 'Each statement ends with its FPI section number, for example (5.2).', '21 CFR 201.57(a); PLR guidance'),
    Q('q2-4', 2, 'Section 3 of the FPI is:', ['Contraindications', 'Dosage Forms and Strengths', 'Description', 'Drug Interactions'], 1, 'Sections 1 to 4 are Indications, Dosage and Administration, Dosage Forms and Strengths, Contraindications.', '21 CFR 201.57(c)(4)'),
    Q('q2-5', 2, 'If a product has no drug abuse concerns, what happens to section 9?', ['It says "None"', 'It is omitted and later sections keep their numbers', 'Section 10 becomes section 9', 'It moves to the end'], 1, 'Sections can be omitted when not applicable, but numbering never changes.', '21 CFR 201.57(d)'),
    Q('q2-6', 2, 'The Highlights adverse reaction contact statement includes which FDA number?', ['1-800-FDA-1088', '1-888-INFO-FDA', '1-800-222-1222', 'No FDA number is required'], 0, 'The statement names the manufacturer and FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.', '21 CFR 201.57(a)(11)'),
    Q('q2-7', 2, 'Highlights end with:', ['The table of contents', 'The patient counselling statement and the revision date', 'The boxed warning', 'The manufacturer\'s address'], 1, 'The counselling statement and "Revised: MM/YYYY" close Highlights.', '21 CFR 201.57(a)(14) and (15)'),
    Q('q2-8', 2, 'Which is the correct revision date format?', ['Revised: August 2026', 'Revised: 08/2026', 'Rev. 2026-08-01', 'Revised 8/26'], 1, 'Month and year: MM/YYYY.', '21 CFR 201.57(a)(15)'),
    # 3
    Q('q3-1', 3, 'The Highlights summary of a boxed warning may be at most:', ['10 lines', '20 lines', '30 lines', 'One page'], 1, 'The summary is limited to 20 lines.', '21 CFR 201.57(a)(4)'),
    Q('q3-2', 3, 'Which change can be listed in Recent Major Changes?', ['A new adverse reaction in 6.2', 'A new subsection in Warnings and Precautions', 'A new storage condition in 16', 'An updated pharmacokinetic table'], 1, 'Only the Boxed Warning and sections 1, 2, 4 and 5 can be listed.', '21 CFR 201.57(a)(5)'),
    Q('q3-3', 3, 'How long does a Recent Major Changes entry stay?', ['Until the next annual report', 'At least one year, removed at the first printing after that', 'Six months', 'Permanently'], 1, 'Entries stay at least a year after the change.', '21 CFR 201.57(a)(5)'),
    Q('q3-4', 3, 'A boxed warning heading must begin with:', ['CAUTION:', 'WARNING:', 'IMPORTANT:', 'BOXED:'], 1, 'The heading begins "WARNING:" followed by the risk, in capitals.', '21 CFR 201.57(c)(1)'),
    Q('q3-5', 3, 'The Highlights boxed warning ends with:', ['"See full prescribing information for complete boxed warning."', '"Call your doctor."', '"Revised: MM/YYYY."', 'Nothing'], 0, 'That closing line is required.', '21 CFR 201.57(a)(4)'),
    Q('q3-6', 3, 'Where does the full boxed warning sit in the FPI?', ['After section 17', 'Before section 1', 'Inside section 5', 'In Highlights only'], 1, 'It appears at the beginning of the FPI.', '21 CFR 201.57(c)(1)'),
    Q('q3-7', 3, 'A new risk is added as 5.6. Which of these does NOT normally need updating?', ['Highlights Warnings and Precautions', 'Recent Major Changes', 'Section 11 Description', 'The revision date'], 2, 'Description covers the product\'s composition and is unaffected by a new risk.', 'PLR guidance; 21 CFR 201.57'),
    Q('q3-8', 3, 'Each boxed warning risk in the FPI should refer to:', ['Section 14', 'The relevant Warnings and Precautions subsection', 'The Medication Guide', 'Section 16'], 1, 'The box summarises; section 5 holds the detail.', '21 CFR 201.57(c)(1)'),
    # 4
    Q('q4-1', 4, 'If a drug has no contraindications, section 4 says:', ['Nothing; it is omitted', '"None."', '"See section 5."', '"Not applicable."'], 1, 'Section 4 is never left out; it states "None." when there are none.', '21 CFR 201.57(c)(5)'),
    Q('q4-2', 4, 'Which is the correct PLR cross-reference style?', ['(see section five)', '[see Warnings and Precautions (5.3)]', 'cf. 5.3', 'See W&P'], 1, 'Cross-references name the section and give its number in parentheses.', 'PLR implementation guidance'),
    Q('q4-3', 4, '6.1 Clinical Trials Experience includes a standard statement that:', ['The drug is safe', 'Rates from different trials cannot be compared directly', 'All reactions are listed', 'Placebo had no reactions'], 1, 'The statement warns against comparing rates across trials.', '21 CFR 201.57(c)(7)(ii)(A)'),
    Q('q4-4', 4, 'Where do spontaneous reports after approval usually go?', ['6.1', '6.2 Postmarketing Experience', '14', '17'], 1, 'Postmarketing reports are described in 6.2.', '21 CFR 201.57(c)(7)(ii)(B)'),
    Q('q4-5', 4, 'A contraindication is appropriate when:', ['A side effect is common but mild', 'The risk clearly outweighs any possible benefit in that situation', 'The drug was not studied in a group', 'Two drugs interact mildly'], 1, 'Contraindications are for situations where the drug should not be used.', '21 CFR 201.57(c)(5)'),
    Q('q4-6', 4, 'You swap 5.2 and 5.3. What else must change?', ['Nothing', 'Every cross-reference to 5.2 and 5.3, and the Highlights references', 'Only the table of contents', 'Only section 17'], 1, 'References follow the numbers; the editor rewrites them when you reorder.', 'PLR implementation guidance'),
    Q('q4-7', 4, 'Section 6 begins by listing:', ['All reactions alphabetically', 'Clinically significant reactions described elsewhere in the labeling', 'Only fatal reactions', 'Placebo reactions'], 1, 'It lists the serious reactions covered in other sections, with references.', '21 CFR 201.57(c)(7)'),
    Q('q4-8', 4, 'Which belongs in Warnings and Precautions?', ['Tablet colour', 'How to monitor for and manage a serious risk', 'The molecular formula', 'Storage temperature'], 1, 'Section 5 covers clinically significant risks and their management.', '21 CFR 201.57(c)(6)'),
    # 5
    Q('q5-1', 5, 'When did the PLLR take effect?', ['1 January 2006', '30 June 2015', '1 June 2020', '12 April 2023'], 1, 'The Pregnancy and Lactation Labeling Rule took effect on 30 June 2015.', 'PLLR final rule (December 2014)'),
    Q('q5-2', 5, 'Which of these may a PLR label still show?', ['Pregnancy Category C', 'A Risk Summary under 8.1', 'Nursing Mothers as 8.3', 'Category X in Contraindications'], 1, 'Letter categories were removed; 8.1 and 8.2 begin with a Risk Summary.', '21 CFR 201.57(c)(9)(i)'),
    Q('q5-3', 5, '8.2 is titled:', ['Nursing Mothers', 'Lactation', 'Breastfeeding', 'Labor and Delivery'], 1, 'PLLR renamed the subsection Lactation.', '21 CFR 201.57(c)(9)(ii)'),
    Q('q5-4', 5, '8.3 covers:', ['Pediatric use', 'Females and Males of Reproductive Potential', 'Geriatric use', 'Hepatic impairment'], 1, '8.3 covers pregnancy testing, contraception and infertility.', '21 CFR 201.57(c)(9)(iii)'),
    Q('q5-5', 5, 'If a pregnancy exposure registry exists, where is it described?', ['Section 17 only', 'At the start of 8.1', 'Section 14', 'It is not mentioned'], 1, 'Registry information appears in 8.1 before the Risk Summary.', '21 CFR 201.57(c)(9)(i)(A)'),
    Q('q5-6', 5, 'The 8.1 Risk Summary states background rates of:', ['Adverse reactions', 'Major birth defects and miscarriage', 'Overdose', 'Hospitalisation'], 1, 'Background risks for the population are given for context.', '21 CFR 201.57(c)(9)(i)(B)'),
    Q('q5-7', 5, 'Animal data supporting a pregnancy risk statement go under:', ['Data, within 8.1', '13.2 only', '12.3', 'Section 15'], 0, 'Human and animal data are summarised under Data in 8.1 (with nonclinical detail in 13).', '21 CFR 201.57(c)(9)(i)(D)'),
    Q('q5-8', 5, 'An older-format label still shows "Pregnancy Category B". When converting to PLR you should:', ['Keep it', 'Replace it with a Risk Summary and data', 'Move it to section 17', 'Delete 8.1'], 1, 'PLR labels cannot use letter categories.', '21 CFR 201.57(c)(9)'),
    # 6
    Q('q6-1', 6, 'A Medication Guide is required when:', ['Every new drug is approved', 'FDA decides patient information is needed for safe and effective use, for one of the reasons in Part 208', 'The company prefers', 'The drug is a generic'], 1, 'Part 208 sets out when FDA requires one.', '21 CFR 208.1'),
    Q('q6-2', 6, 'Which heading belongs in a Medication Guide?', ['"Clinical Pharmacology"', '"What is the most important information I should know about X?"', '"Description"', '"Overdosage"'], 1, 'Medication Guides use question headings in plain language.', '21 CFR 208.20(b)'),
    Q('q6-3', 6, 'What must the carton say when a Medication Guide is required?', ['Nothing', 'Instruct the dispenser to give the Medication Guide to each patient', 'List all side effects', 'Show the FDA logo'], 1, 'The label tells the dispenser to provide the Medication Guide.', '21 CFR 208.24(d)'),
    Q('q6-4', 6, 'The Medication Guide side-effect statement mentions:', ['The company website only', 'Reporting side effects to FDA at 1-800-FDA-1088', 'The pharmacist\'s phone number', 'Nothing'], 1, 'It reads "Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088."', '21 CFR 208.20(b)(7)(iii)'),
    Q('q6-5', 6, 'Which product type usually needs an IFU?', ['A film-coated tablet', 'A prefilled pen or metered-dose inhaler', 'An oral solution in a bottle', 'A capsule'], 1, 'IFUs explain multi-step use of devices and complex products.', 'FDA patient labeling resources'),
    Q('q6-6', 6, 'Where in the PI is the prescriber told to advise reading the patient labeling?', ['Section 2', 'Section 17', 'Section 11', 'Highlights only'], 1, 'Section 17 opens with that advice.', '21 CFR 201.57(c)(18)'),
    Q('q6-7', 6, 'Status of FDA\'s Patient Medication Information (PMI) rule as of mid-2026:', ['Final and in force', 'Proposed, not yet final', 'Withdrawn', 'Applies only to biologics'], 1, 'PMI was proposed in May 2023 and was still proposed in mid-2026.', 'FDA PMI proposed rule (2023); FR 2026-13346'),
    Q('q6-8', 6, 'A Medication Guide states that it:', ['Has been approved by the U.S. Food and Drug Administration', 'Replaces the PI', 'Is optional reading', 'Was written by the pharmacist'], 0, 'The approval statement is required.', '21 CFR 208.20(b)'),
    # 7
    Q('q7-1', 7, 'Which strength expression avoids a tenfold error?', ['5.0 mg', '5 mg', '.5 mg', '5 mg.'], 1, 'No trailing zeros, and a leading zero for values below 1.', 'FDA container and carton guidance (2022); ISMP list'),
    Q('q7-2', 7, 'The established name on a carton must be at least:', ['The same size as the proprietary name', 'Half the size of the proprietary name', 'One quarter of the size', '6 pt'], 1, '21 CFR 201.10(g)(2) sets the half-size minimum.', '21 CFR 201.10(g)(2)'),
    Q('q7-3', 7, 'For a 5 mL vial containing 50 mg, the strength reads:', ['10 mg', '50 mg/5 mL (10 mg/mL)', '50 mg', '10 mg/mL only'], 1, 'Injectables show the amount per total volume, then per mL.', 'FDA container and carton guidance (2022)'),
    Q('q7-4', 7, 'Which is a valid 10-digit NDC configuration?', ['5-4-1', '3-3-4', '6-2-2', '4-5-1'], 0, 'Valid configurations are 4-4-2, 5-3-2 and 5-4-1.', '21 CFR 207.33'),
    Q('q7-5', 7, 'The linear bar code on a prescription drug label must contain:', ['The lot number only', 'The NDC', 'The price', 'The expiry date only'], 1, '201.25 requires the NDC in a linear bar code.', '21 CFR 201.25'),
    Q('q7-6', 7, 'Which abbreviation is on the error-prone list?', ['mg', 'mL', 'U (for units)', 'mcg'], 2, '"U" can be misread as 0 or 4; write "units".', 'ISMP error-prone abbreviations list'),
    Q('q7-7', 7, '"Rx only" on a label is required by:', ['21 CFR 201.100(b)(1)', '21 CFR 314.81', '21 CFR 208.24', '21 CFR 600.3'], 0, '201.100(b)(1) requires the "Rx only" symbol or statement.', '21 CFR 201.100(b)(1)'),
    Q('q7-8', 7, 'What is a proof check?', ['A stability test', 'Comparing printed artwork word by word with the approved text', 'A user test', 'A bar code scan only'], 1, 'Proofs are checked against approved text before release.', 'FDA container and carton guidance (2022)'),
    # 8
    Q('q8-1', 8, 'SPL is based on which standard?', ['PDF/A', 'HL7 XML', 'CSV', 'JSON-LD'], 1, 'Structured Product Labeling is an HL7 XML standard.', 'FDA SPL resources'),
    Q('q8-2', 8, 'How are PI sections identified in SPL?', ['By page number', 'By LOINC section codes', 'By font', 'By colour'], 1, 'Each section carries a LOINC code.', 'FDA SPL resources'),
    Q('q8-3', 8, 'Can this app\'s XML export be submitted to FDA?', ['Yes', 'No, it is a practice file and not validated', 'Only for generics', 'Only after printing'], 1, 'It is a teaching example, marked as such inside the file.', 'App ground rules'),
    Q('q8-4', 8, 'Which public site shows SPL labels for marketed products?', ['DailyMed', 'ClinicalTrials.gov', 'PubMed', 'Orange Book only'], 0, 'DailyMed publishes the SPL labeling FDA receives.', 'FDA SPL resources'),
    # 9
    Q('q9-1', 9, 'Which difference from the reference label is permitted for a generic?', ['A shorter Warnings and Precautions section', 'A different list of inactive ingredients', 'Removing the boxed warning', 'Changing the dosing'], 1, 'Inactive ingredients are among the permitted differences.', '21 CFR 314.94(a)(8)(iv)'),
    Q('q9-2', 9, 'A section viii statement lets a generic:', ['Skip bioequivalence', 'Omit an indication protected by a method-of-use patent', 'Change the strength', 'Avoid a Medication Guide'], 1, 'The protected use is carved out of the label.', 'FD&C Act 505(j)(2)(A)(viii); 21 CFR 314.127(a)(7)'),
    Q('q9-3', 9, 'After carving out indication 1.2, which must also go?', ['Section 16', 'Dosing, study results and Highlights entries that depend on 1.2', 'The boxed warning', 'Section 11'], 1, 'Every mention that depends on the carved indication goes.', '21 CFR 314.127(a)(7)'),
    Q('q9-4', 9, 'Who must update a generic label when the reference label changes?', ['Nobody', 'The ANDA holder', 'FDA only', 'The reference holder'], 1, 'ANDA holders keep their labeling the same as the RLD.', 'FDA guidance on ANDA labeling updates (2024)'),
    Q('q9-5', 9, 'Which section is usually different between a generic and its reference?', ['5 Warnings and Precautions', '16 How Supplied', '4 Contraindications', '2 Dosage and Administration'], 1, 'How supplied details (NDCs, pack sizes) are the generic\'s own.', '21 CFR 314.94(a)(8)(iv)'),
    Q('q9-6', 9, 'The "Initial U.S. Approval" year on a generic label is:', ['The ANDA approval year', 'The year the active moiety was first approved', 'Left blank', 'The patent expiry year'], 1, 'It refers to the active moiety, so it matches the reference.', '21 CFR 201.57(a)(3)'),
    # 10
    Q('q10-1', 10, 'Under 505(o)(4), after FDA notifies the holder, the holder has how long to respond?', ['10 days', '30 days', '90 days', '6 months'], 1, 'The holder submits a supplement or a rebuttal within 30 days.', 'FD&C Act 505(o)(4)'),
    Q('q10-2', 10, 'If the holder disagrees with FDA\'s proposed change, what happens?', ['The change is dropped', 'Discussions follow and FDA may order the change', 'The product is withdrawn', 'Nothing'], 1, 'After discussions FDA can issue an order.', 'FD&C Act 505(o)(4)'),
    Q('q10-3', 10, 'What triggers a 505(o)(4) notification?', ['A marketing request', 'New safety information FDA believes should be in the labeling', 'A manufacturing change', 'A price change'], 1, 'It is a safety labeling power.', 'FD&C Act 505(o)(4)'),
    Q('q10-4', 10, 'A holder wants to add a new warning quickly on its own initiative. Which route is typical?', ['Annual report', 'Changes Being Effected supplement', 'No filing', 'A new NDA'], 1, 'Strengthening safety wording can go through a CBE supplement.', '21 CFR 314.70(c)(6)(iii)'),
    # 11
    Q('q11-1', 11, 'In conversion, "Nursing Mothers" content goes to:', ['8.2 Lactation', '8.4', '17', '6.2'], 0, 'It becomes 8.2 Lactation, rewritten for PLLR.', '21 CFR 201.57(c)(9)(ii)'),
    Q('q11-2', 11, 'Old-format "Clinical Trials" results inside Clinical Pharmacology move to:', ['12.3', '14 Clinical Studies', '6.1', '1'], 1, 'Efficacy results belong in section 14.', '21 CFR 201.57(c)(15)'),
    Q('q11-3', 11, '"Information for Patients" under Precautions moves to:', ['17 Patient Counseling Information', '16', '2', '11'], 0, 'Counselling content goes to section 17.', '21 CFR 201.57(c)(18)'),
    Q('q11-4', 11, 'Old-format drug interaction text under Precautions moves to:', ['7 Drug Interactions', '12.1', '5', '10'], 0, 'PLR gives drug interactions their own section.', '21 CFR 201.57(c)(8)'),
    Q('q11-5', 11, 'Which part is new when converting to PLR?', ['Description', 'Highlights', 'Overdosage', 'How Supplied'], 1, 'The older format has no Highlights.', '21 CFR 201.57(a)'),
    Q('q11-6', 11, 'Older-format labels are governed by:', ['21 CFR 201.80', '21 CFR 201.57', '21 CFR 208', '21 CFR 314.94'], 0, '201.80 covers the older format.', '21 CFR 201.80'),
    Q('q8-5', 8, 'Which code system names SPL section types such as Boxed Warning or Indications and Usage?', ['MedDRA', 'SNOMED CT', 'ATC', 'LOINC'], 3, 'Each SPL section carries a LOINC code for its type.', 'FDA SPL Implementation Guide'),
    Q('q8-6', 8, 'What lets FDA and readers track the versions of one SPL document?', ['A set ID and a version number', 'The NDA number alone', 'The barcode', 'A Federal Register citation'], 0, 'Every version of a label keeps the same set ID and gets the next version number.', 'FDA SPL Implementation Guide'),
    Q('q8-7', 8, 'Where in an SPL file are the NDC, ingredients and packaging held?', ['In the revision date', 'In the product data elements', 'In Highlights', 'In the boxed warning'], 1, 'The product data elements describe the product in coded form, separate from the label text.', 'FDA SPL Implementation Guide'),
    Q('q8-8', 8, 'How are SPL files sent to FDA?', ['Through MedWatch', 'Through the Purple Book', 'Through the FDA Electronic Submissions Gateway', 'By fax'], 2, 'SPL is submitted electronically through the ESG, inside the application or as a listing.', 'FDA SPL resources'),
    Q('q9-7', 9, 'Which regulation lists the permitted differences between a generic label and its reference?', ['21 CFR 201.57(c)', '21 CFR 208.20', '21 CFR 201.80', '21 CFR 314.94(a)(8)(iv)'], 3, '314.94(a)(8)(iv) covers the labeling of an ANDA and the differences allowed.', '21 CFR 314.94'),
    Q('q9-8', 9, "Under FDA's September 2023 revised draft guidance, what does a biosimilar's labeling carry?", ['One biosimilarity statement, whether or not the product is interchangeable', 'An interchangeability statement for interchangeable products', 'No statement at all', "The reference product's brand name throughout"], 0, 'The revised draft recommends the same biosimilarity statement for every biosimilar. It is a draft (Watch).', 'Labeling for Biosimilar and Interchangeable Biosimilar Products (revised draft, 2023)'),
    Q('q9-9', 9, 'Where does FDA show which biosimilars are interchangeable?', ['DailyMed only', 'The Purple Book', 'The Orange Book', 'The label Highlights'], 1, 'Interchangeability matters at pharmacy dispensing, so FDA points to the Purple Book.', 'FDA updated labeling recommendations for biosimilars'),
    Q('q10-5', 10, "Which law created FDA's authority under section 505(o)(4)?", ['PDUFA 1992', '21st Century Cures Act 2016', 'FDAAA 2007', 'Hatch-Waxman 1984'], 2, 'The Food and Drug Administration Amendments Act of 2007 added safety labeling change authority.', 'FD&C Act 505(o)(4); FDA guidance on safety labeling changes'),
    Q('q10-6', 10, 'If discussions after a 505(o)(4) notice end without agreement, how soon may FDA order the change?', ['Within 30 days', 'Within 60 days', 'Within 90 days', 'Within 15 days'], 3, 'After the discussion period FDA may issue an order within 15 days.', 'FD&C Act 505(o)(4)(E)'),
    Q('q10-7', 10, "What should the holder's response to a 505(o)(4) notice contain?", ['A labeling supplement with the change, or a statement of why it is not warranted', 'A fee', 'A REMS', 'A Dear Health Care Provider letter only'], 0, 'The holder either submits the change or rebuts within 30 days.', 'FD&C Act 505(o)(4)(B)'),
    Q('q10-8', 10, 'What can follow a failure to comply with 505(o)(4)?', ['Loss of patent protection', 'Civil money penalties, and the drug can be misbranded', 'Automatic withdrawal of approval', 'Nothing'], 1, 'Violations can bring civil penalties, and the product can be deemed misbranded.', 'FD&C Act 303(f)(4), 502(z)'),
    Q('q11-7', 11, 'In PLR, which section number is Contraindications?', ['2', '8', '4', '5'], 2, 'PLR sections: 1 Indications, 2 Dosage, 3 Forms and strengths, 4 Contraindications, 5 Warnings and precautions.', '21 CFR 201.57(c)'),
    Q('q11-8', 11, 'When an older-format label is converted, which part must be written new?', ['The carton', 'The Medication Guide', 'Nothing', 'Highlights, with its cross-references'], 3, 'Highlights and the contents list have no older-format equivalent.', '21 CFR 201.57(a)'),
]}

DRILLS = {'drills': [
    {'id': 'hl-fix', 'title': 'Fix the Highlights', 'minutes': 15, 'sample': 'ostrevia-errors', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['US-HL-']},
     'about': 'Every Highlights rule fails at least once in this label. Clear all Highlights errors and warnings.'},
    {'id': 'fpi-fix', 'title': 'Fix the full prescribing information', 'minutes': 20, 'sample': 'ostrevia-errors', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['US-PI-', 'US-ME-', 'US-NAME']},
     'about': 'Clear the section, PLLR, cross-reference, strength and medication-error findings in the full prescribing information.'},
    {'id': 'mg-fix', 'title': 'Repair the Medication Guide', 'minutes': 10, 'sample': 'ostrevia-errors', 'doc': 'mg', 'goal': {'type': 'rules', 'prefixes': ['US-PT-', 'US-MG-']},
     'about': 'Restore the missing heading and statement and make the most important information plain.'},
    {'id': 'carton-fix', 'title': 'Fix the injectable carton', 'minutes': 10, 'sample': 'nelvaprox-convert', 'doc': 'carton', 'goal': {'type': 'rules', 'prefixes': ['US-CC-', 'US-ME-']},
     'about': 'Six planted errors on a vial carton. Clear them all.'},
    {'id': 'carve', 'title': 'Complete the carve-out', 'minutes': 15, 'sample': 'talmisartan-generic', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['US-ANDA-', 'US-HL-REF']},
     'about': 'Remove every trace of the protected diabetic nephropathy indication and restore the text that is not a permitted difference.'},
    {'id': 'bio-label', 'title': 'Label a biosimilar', 'minutes': 12, 'sample': 'selvanta-biosimilar', 'doc': 'pi', 'goal': {'type': 'rules', 'prefixes': ['US-BIO-STMT', 'US-BIO-NAME']},
     'about': 'Complete the biosimilarity footnote, describe the product as SELVANTA throughout, and decide what to do with the interchangeability sentence (Watch).'},
    {'id': 'convert', 'title': 'Map an older-format label to PLR', 'minutes': 10, 'sample': 'nelvaprox-convert', 'doc': 'old', 'goal': {'type': 'convert', 'pass': 80},
     'about': 'Send each block of the older-format label to its PLR section. 80% or more passes.'},
    {'id': 'capstone', 'title': 'Capstone: a safety update from signal to approved labels', 'minutes': 45, 'sample': 'ostrevia-clean', 'doc': 'pi', 'capstone': True,
     'goal': {'type': 'capstone', 'keyword': 'interstitial lung disease', 'mgKeyword': 'lung', 'section': '5'},
     'about': 'Signal (fictional): in the HALO-LTE extension study, 6 cases of interstitial lung disease (ILD) were reported in patients taking OSTREVIA, 2 of them serious. The labelling committee has agreed to add a warning. Add a new Warnings and Precautions subsection on interstitial lung disease, summarise it in Highlights with its section number, add a Recent Major Changes entry dated with the new revision date, update the revision date, tell patients in the Medication Guide (shortness of breath or cough), and take the PI and the Medication Guide through review to approval with no open errors or warnings.'},
]}

GLOSSARY = {'terms': [
    {'term': 'ANDA', 'def': 'Abbreviated New Drug Application: the application for a generic drug, which relies on the reference listed drug.'},
    {'term': 'Annotated label', 'def': 'A copy of the label with notes linking each statement to its source (study, CCDS section, agency request).'},
    {'term': 'Boxed warning', 'def': 'A warning in a box at the start of the FPI for serious risks; summarised in Highlights in no more than 20 lines.'},
    {'term': 'Carton', 'def': 'The outer package label. Carries more information than the container label.'},
    {'term': 'Carve-out', 'def': 'Leaving a protected indication out of generic labeling under a section viii statement.'},
    {'term': 'CBE', 'def': 'Changes Being Effected supplement: some labeling changes, such as strengthening a warning, can be implemented when the supplement is submitted.'},
    {'term': 'CCDS', 'def': 'Company Core Data Sheet: the company\'s global reference for a product\'s safety and use, against which local labels are compared (Phase 2).'},
    {'term': 'CCSI', 'def': 'Company Core Safety Information: the safety part of the CCDS.'},
    {'term': 'Container label', 'def': 'The label on the immediate container, such as a bottle or vial.'},
    {'term': 'Cross-reference', 'def': 'A pointer to another section, written as "[see Warnings and Precautions (5.3)]".'},
    {'term': 'DailyMed', 'def': 'The public website that publishes SPL labeling for marketed products.'},
    {'term': 'Established name', 'def': 'The official non-proprietary name of the drug, such as lumiravostat.'},
    {'term': 'FPI', 'def': 'Full Prescribing Information: the 17 numbered sections after Highlights and the table of contents.'},
    {'term': 'Highlights', 'def': 'The half-page summary at the top of a PLR prescribing information.'},
    {'term': 'IFU', 'def': 'Instructions for Use: step-by-step patient labeling for products with complex use.'},
    {'term': 'Labeling', 'def': 'All written, printed or graphic matter on or accompanying a drug.'},
    {'term': 'LOINC', 'def': 'A coding system; in SPL, LOINC codes identify each labeling section.'},
    {'term': 'Medication Guide', 'def': 'FDA-approved patient labeling required under 21 CFR 208 for certain products with serious risks.'},
    {'term': 'Naked decimal', 'def': 'A decimal without a leading zero (".5 mg"). Write "0.5 mg".'},
    {'term': 'NDC', 'def': 'National Drug Code: a 10-digit identifier for labeler, product and package (4-4-2, 5-3-2 or 5-4-1).'},
    {'term': 'Old format', 'def': 'The labeling format in 21 CFR 201.80, used before PLR, with unnumbered sections.'},
    {'term': 'PI', 'def': 'Prescribing information: the label written for health professionals.'},
    {'term': 'PLLR', 'def': 'Pregnancy and Lactation Labeling Rule (in effect 30 June 2015): replaced letter categories with 8.1, 8.2 and 8.3.'},
    {'term': 'PLR', 'def': 'Physician Labeling Rule (2006): the Highlights plus 17-section format in 21 CFR 201.57.'},
    {'term': 'PMI', 'def': 'Patient Medication Information: a proposed one-page patient sheet (2023 proposal, not final).'},
    {'term': 'PPI', 'def': 'Patient Package Insert: patient labeling required for some classes and voluntary for others.'},
    {'term': 'Proof', 'def': 'The printer\'s artwork, checked word by word against approved text before printing.'},
    {'term': 'Recent Major Changes', 'def': 'A Highlights list of recent substantive changes to the Boxed Warning or sections 1, 2, 4 or 5.'},
    {'term': 'Reference listed drug (RLD)', 'def': 'The approved drug a generic is compared with and whose labeling it follows.'},
    {'term': 'Risk Summary', 'def': 'The opening of 8.1 and 8.2 under PLLR, integrating data into a statement of risk.'},
    {'term': 'Section viii statement', 'def': 'A statement in an ANDA that it does not seek approval for a patented method of use.'},
    {'term': 'SPL', 'def': 'Structured Product Labeling: the HL7 XML format FDA uses to receive labeling.'},
    {'term': 'Trailing zero', 'def': 'A zero after a decimal point ("5.0 mg"), which can cause tenfold errors.'},
    {'term': 'Waiver', 'def': 'In this app, a recorded reason for accepting a warning without changing the text. Errors cannot be waived.'},
    {'term': '505(o)(4)', 'def': 'The FD&C Act power for FDA to require safety labeling changes; the holder has 30 days to respond.'},
]}
