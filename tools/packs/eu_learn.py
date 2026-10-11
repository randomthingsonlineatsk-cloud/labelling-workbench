"""EU learning content: lessons 16 to 24, quiz questions, drills and glossary terms."""


def L(id, title, minutes, sections, try_it=None, watch=False):
    return {'id': id, 'module': 'eu', 'title': title, 'minutes': minutes, 'sections': [{'h': h, 'p': p} for h, p in sections], 'tryIt': try_it, 'watch': watch}


LESSONS = [
    L(16, 'The QRD template', 8, [
        ('Three documents, one set of headings', [
            'In the EU the product information of a centrally authorised medicine has three parts: the Summary of Product Characteristics (SmPC, Annex I) for health professionals, the labelling (Annex IIIA: outer carton and immediate packaging such as blisters) and the package leaflet (Annex IIIB) for patients. Annex II covers the conditions of the authorisation.',
            'The Quality Review of Documents (QRD) group publishes the templates. Version 10.4 (February 2024) is current. Every heading, its number and much of the standard text is fixed; text in angle brackets offers alternatives, and text in curly brackets is to be filled in.',
        ]),
        ('SmPC structure', [
            'The SmPC has ten numbered sections: name, composition, pharmaceutical form, clinical particulars (4.1 to 4.9), pharmacological properties (5.1 to 5.3), pharmaceutical particulars (6.1 to 6.6), holder, authorisation numbers, date of first authorisation and date of revision. Headings are used exactly as written, even when a section says only "Not applicable."',
            'The SmPC guideline (Rev. 2, 2009) explains what goes in each section, and it is the reference agencies use in assessment.',
        ]),
        ('What is changing (Watch)', [
            'EMA consulted in 2025 on QRD version 11: a shorter leaflet, important information first, warnings grouped by subject and an optional section 7 for long instructions for use. It also consulted on a key information section at the top of the leaflet. Neither is in force; this app checks against v10.4.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-clean', 'doc': 'smpc'}),
    L(17, 'Section 4.8: undesirable effects', 8, [
        ('How 4.8 is built', [
            'Section 4.8 opens with a summary of the safety profile, then a tabulated list of adverse reactions by MedDRA system organ class, with each reaction in a frequency category, then descriptions of selected reactions, special populations, and finally the standard text on reporting suspected adverse reactions.',
        ]),
        ('Frequency categories', [
            'The convention is: very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100), rare (≥1/10,000 to <1/1,000), very rare (<1/10,000) and not known (cannot be estimated from the available data). Reactions from spontaneous reports usually go in "not known".',
            'Words such as "frequent", "occasional" or "isolated cases" are not used: they mean different things to different readers.',
        ]),
        ('The reporting statement', [
            'Since 2012 every SmPC ends 4.8 with: "Reporting suspected adverse reactions after authorisation of the medicinal product is important... Healthcare professionals are asked to report any suspected adverse reactions via the national reporting system listed in Appendix V." The leaflet has the patient version at the end of section 4.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-errors', 'doc': 'smpc', 'focus': '4.8'}),
    L(18, 'Excipients with a known effect', 7, [
        ('Why some excipients must be declared', [
            'Some excipients can matter to some patients: lactose to people with sugar intolerances, aspartame to people with phenylketonuria, benzyl alcohol to newborns, sodium to people on a low-salt diet. The annex to the European Commission excipients guideline lists them, with the route, the threshold and the exact statement.',
        ]),
        ('Where the statements go', [
            'The leaflet carries the statement in section 2, under its own subheading such as "Ostrevia contains sodium". SmPC section 4.4 carries the information for professionals, and section 2 of the SmPC names the excipients with a known effect. The outer carton lists them in section 3 ("Contains lactose. See the package leaflet for further information.").',
            'Thresholds differ: lactose has a zero threshold for oral products; sodium below 1 mmol (23 mg) per dose gets the "essentially sodium-free" statement.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-lactose', 'doc': 'pl'}),
    L(19, 'Additional monitoring and the blue box', 6, [
        ('The black triangle', [
            'Medicines under additional monitoring carry an inverted black triangle and a standard sentence at the start of the SmPC and the leaflet. The list includes medicines with a new active substance authorised after 1 January 2011, biological medicines and products with conditional approvals or post-authorisation safety studies. Status usually lasts five years.',
        ]),
        ('The blue box', [
            'Centrally authorised products have one labelling for the whole EU. Member states may still require national details, such as price, reimbursement or legal status, on the pack; these go in a "blue box" on the outer packaging so the common text stays the same.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-errors', 'doc': 'smpc'}),
    L(20, 'Readability and user testing', 9, [
        ('The legal requirement', [
            'Directive 2001/83/EC requires the leaflet to reflect consultation with target patient groups so that it is legible, clear and easy to use. In practice that means a user test (readability test), or a bridging report to a leaflet that was tested.',
        ]),
        ('How a user test works', [
            'About 12 to 15 questions cover the key safety messages, dosing and how to use the medicine. Participants are recruited from the target population, excluding health professionals and people who know the medicine. The first round usually has 10 participants; the leaflet is revised, then tested again.',
            'The usual standard: for each question, 90% of participants can find the information and 90% of those can show they understand it, so at least 16 of 20 (about 81%) succeed on each question, on the final text.',
        ]),
        ('Writing for patients', [
            'Short sentences, active verbs, everyday words, headings that are questions, bullet lists for symptoms and actions. Medical terms are explained the first time ("blood clot in the lungs (pulmonary embolism)").',
        ]),
    ], try_it={'sample': 'eu-ostrevia-usertest', 'doc': 'pl', 'tab': 'usertest'}),
    L(21, 'Braille and the safety features', 7, [
        ('Braille', [
            'Article 56a of Directive 2001/83/EC requires the name of the medicine in Braille on the packaging, and the strength where there is more than one. Section 16 of the labelling template gives the text to be embossed. The leaflet must be available in formats for blind and partially sighted people on request.',
        ]),
        ('Unique identifier and anti-tampering device', [
            'Since February 2019, most prescription medicines carry a unique identifier encoded in a 2D data matrix (product code, serial number, batch, expiry, and a national reimbursement number where required) and an anti-tampering device. Pharmacies verify and decommission the identifier before supply. Labelling sections 17 and 18 hold the template statements and the human-readable PC, SN and NN.',
        ]),
        ('QR codes', [
            'A QR code linking to product information or training material must be submitted and assessed; what it links to must match the approved product information and must not promote the medicine.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-errors', 'doc': 'outer-10'}),
    L(22, 'Translations and linguistic review', 8, [
        ('All languages at once', [
            'A centrally authorised product has product information in every official EU language plus Icelandic and Norwegian. After the CHMP opinion, the company sends the translations; member state experts review them in the linguistic review and send comments, which the company implements before the Commission decision.',
        ]),
        ('What reviewers look for', [
            'The translation must say exactly what the English says: the same doses, numbers and durations, the QRD standard wording in that language, and approved terms used consistently (in French, "effets indésirables", not "effets secondaires"). A term base keeps terms consistent across products and updates.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-translation', 'doc': 'pl-fr', 'tab': 'translation'}),
    L(23, 'PRAC signals and PSUSA outcomes', 8, [
        ('Where EU safety wording comes from', [
            'The Pharmacovigilance Risk Assessment Committee (PRAC) assesses safety signals. When a signal confirms a risk, PRAC recommends the wording for the SmPC and leaflet, published in English with translations in all EU languages, and sets the deadline for the variation.',
            'A periodic safety update single assessment (PSUSA) can also end in changes to the product information, which then apply to every product with that active substance.',
        ]),
        ('Implementing the wording', [
            'Agreed wording taken as it is goes in as a type IA-IN variation (C.3.a); wording that needs minor assessment as type IB (C.3.b); changes that need new data as type II (C.3.c). The company adds the wording to every affected section and language, keeps the deadline and records it in its tracker.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-prac', 'doc': 'smpc', 'tab': 'changes'}),
    L(24, 'Electronic product information (Watch)', 6, [
        ('ePI', [
            'Electronic product information is the SmPC and leaflet as structured, searchable data rather than a PDF. The EU common standard is based on HL7 FHIR. A pilot ran from July 2023 to August 2024; EMA published guidance for submitting ePI in centralised procedures in September 2026, ahead of go-live.',
            'The new EU pharmaceutical legislation (political agreement December 2025) requires ePI to be made available. Whether and when paper leaflets change is still being worked out.',
        ]),
        ('In this app', [
            'The ePI view shows the SmPC or leaflet as structured sections with stable identifiers, the way an ePI is organised. It is simplified and does not produce FHIR resources.',
        ]),
    ], try_it={'sample': 'eu-ostrevia-clean', 'doc': 'pl', 'tab': 'preview'}, watch=True),
]


def Q(id, topic, q, options, answer, why, cite):
    return {'id': id, 'topic': topic, 'module': 'eu', 'q': q, 'options': options, 'answer': answer, 'why': why, 'cite': cite}


QUESTIONS = [
    Q('q16-1', 16, 'Which annex of a centrally authorised product is the package leaflet?', ['Annex IIIB', 'Annex I', 'Annex II', 'Annex IIIA'], 0, 'Annex I is the SmPC, Annex II the conditions, IIIA the labelling and IIIB the leaflet.', 'QRD template v10.4'),
    Q('q16-2', 16, 'Which QRD template version is current (October 2026)?', ['10.4', '9.0', '11.0', '8.3'], 0, 'Version 10.4 (February 2024); version 11 was consulted on in 2025 and is not yet in force.', 'EMA QRD templates page'),
    Q('q16-3', 16, 'A section of the SmPC does not apply. What do you do?', ['Keep the heading and write the template wording, such as "Not applicable."', 'Delete the heading', 'Leave it blank', 'Merge it with the next section'], 0, 'Headings are kept; the template gives the wording for sections that do not apply.', 'QRD annotated template'),
    Q('q16-4', 16, 'What does text in angle brackets in the QRD template mean?', ['Alternative wording to choose from', 'Text to delete before submission', 'Text in Braille', 'Text for the blue box'], 0, 'Angle brackets mark alternatives; curly brackets mark information to fill in.', 'QRD template conventions'),
    Q('q16-5', 16, 'Which document explains what goes in each SmPC section?', ['The SmPC guideline (Rev. 2)', 'The readability guideline', 'Delegated Regulation 2016/161', 'The excipients annex'], 0, 'The European Commission SmPC guideline, revision 2 (2009).', 'SmPC guideline'),
    Q('q17-1', 17, 'What frequency is "common"?', ['≥1/100 to <1/10', '≥1/10', '≥1/1,000 to <1/100', '<1/10,000'], 0, 'Very common ≥1/10; common ≥1/100 to <1/10; uncommon ≥1/1,000 to <1/100.', 'SmPC guideline 4.8'),
    Q('q17-2', 17, 'Reactions known only from spontaneous reports usually go in which category?', ['Not known', 'Very rare', 'Rare', 'Uncommon'], 0, 'When the frequency cannot be estimated from the data, "not known" is used.', 'SmPC guideline 4.8'),
    Q('q17-3', 17, 'Which word is not used for frequency in 4.8?', ['Frequent', 'Common', 'Rare', 'Not known'], 0, 'Only the convention categories are used.', 'SmPC guideline 4.8'),
    Q('q17-4', 17, 'What closes SmPC section 4.8?', ['The standard text on reporting suspected adverse reactions (Appendix V)', 'The overdose advice', 'The list of excipients', 'The date of revision'], 0, 'The reporting statement points to the national systems in Appendix V.', 'QRD template v10.4'),
    Q('q17-5', 17, 'How are adverse reactions grouped in the 4.8 table?', ['By MedDRA system organ class and frequency', 'Alphabetically', 'By clinical study', 'By severity only'], 0, 'System organ class first, then frequency within it.', 'SmPC guideline 4.8'),
    Q('q18-1', 18, 'An oral tablet contains 0.6 mg sodium per tablet. What does the leaflet say?', ['That it is essentially "sodium-free"', 'Nothing', 'The percentage of the daily intake', 'Not to take it on a low-salt diet'], 0, 'Below 1 mmol (23 mg) per dose the "essentially sodium-free" statement applies.', 'Excipients annex Rev. 2'),
    Q('q18-2', 18, 'What is the threshold for the lactose statement in an oral product?', ['Zero', '5 g per dose', '1 mmol per dose', '100 mg per dose'], 0, 'Lactose has a zero threshold for oral products; a further statement applies at 5 g.', 'Excipients annex Rev. 2'),
    Q('q18-3', 18, 'Where in the leaflet do excipient statements go?', ['Section 2, under "[Name] contains ..."', 'Section 4', 'Section 5', 'Only on the carton'], 0, 'Section 2 has a subheading for each excipient with a known effect.', 'QRD template v10.4'),
    Q('q18-4', 18, 'Why does aspartame need a statement?', ['It is a source of phenylalanine, harmful in phenylketonuria', 'It contains sodium', 'It is an azo dye', 'It causes drowsiness'], 0, 'Aspartame (E 951) is a source of phenylalanine.', 'Excipients annex Rev. 2'),
    Q('q18-5', 18, 'Where does the outer carton name excipients with a known effect?', ['Section 3, List of excipients', 'Section 16', 'Section 6', 'Section 18'], 0, 'Section 3 lists them, usually pointing to the leaflet.', 'QRD template, Annex IIIA'),
    Q('q19-1', 19, 'What does the inverted black triangle mean?', ['The medicine is under additional monitoring', 'It is a controlled drug', 'It is for hospital use only', 'It has a boxed warning'], 0, 'It flags additional monitoring and invites reporting of suspected adverse reactions.', 'Regulation (EU) 1235/2010'),
    Q('q19-2', 19, 'Which medicine is automatically under additional monitoring?', ['One with a new active substance authorised after 1 January 2011', 'Every generic', 'Every over-the-counter medicine', 'Every medicine older than 20 years'], 0, 'New active substances (and biologicals) authorised after 2011 are included.', 'Regulation (EU) 1235/2010'),
    Q('q19-3', 19, 'What goes in the blue box?', ['National particulars a member state requires, such as price', 'The black triangle', 'The Braille text', 'The SmPC summary'], 0, 'The blue box keeps national details separate from the common EU text.', 'Directive 2001/83/EC Art. 57'),
    Q('q19-4', 19, 'Where does the black triangle statement appear?', ['At the start of the SmPC and the leaflet', 'Only on the carton', 'Only in 4.8', 'In the blue box'], 0, 'Both the SmPC and the leaflet open with it.', 'Implementing Regulation 198/2013'),
    Q('q19-5', 19, 'How long does additional monitoring usually last?', ['Five years (it can be extended)', 'One year', 'For the life of the product', 'Until the first PSUR'], 0, 'Typically five years from the reference date.', 'EMA additional monitoring page'),
    Q('q20-1', 20, 'What is the usual success standard for each user-test question?', ['At least 16 of 20 participants find and understand the information', '10 of 20', 'All 20', '50%'], 0, '90% find it and 90% of those understand it, about 81%, so 16 of 20.', 'Readability guideline'),
    Q('q20-2', 20, 'Who should not be a participant in a user test?', ['A pharmacist', 'A retired teacher', 'A patient with the condition', 'A carer'], 0, 'Health professionals and people who know the medicine are excluded.', 'Readability guideline'),
    Q('q20-3', 20, 'How many participants are usually in each round?', ['10', '50', '3', '100'], 0, 'Rounds of 10, with revisions between them.', 'Readability guideline'),
    Q('q20-4', 20, 'What is bridging?', ['Showing a leaflet is similar enough to one already user tested', 'Translating a leaflet', 'Adding a QR code', 'Merging two leaflets'], 0, 'A bridging report can replace a full test when content and layout are similar.', 'Readability guideline'),
    Q('q20-5', 20, 'Which is easier for patients?', ['"Tell your doctor straight away if you get leg pain or swelling"', '"Manifestations of venous thromboembolism necessitate immediate consultation"', 'Both are equal', 'Neither'], 0, 'Short, active sentences with everyday words.', 'Readability guideline'),
    Q('q21-1', 21, 'What must be in Braille on the packaging?', ['The name of the medicine (and the strength if there are several)', 'The full leaflet', 'The batch number', 'The authorisation number'], 0, 'Article 56a requires the name in Braille.', 'Directive 2001/83/EC Art. 56a'),
    Q('q21-2', 21, 'What does the 2D data matrix on a prescription pack carry?', ['The unique identifier: product code, serial number, batch, expiry (and a national number where required)', 'The leaflet text', 'The price', 'A QR link to a website'], 0, 'The unique identifier under Delegated Regulation 2016/161.', 'Delegated Regulation (EU) 2016/161'),
    Q('q21-3', 21, 'What does section 18 of the labelling show?', ['The human-readable PC, SN and NN', 'The Braille text', 'The excipients', 'The storage conditions'], 0, 'Section 18 is the human-readable form of the unique identifier.', 'QRD template, Annex IIIA'),
    Q('q21-4', 21, 'Since when have the safety features applied to most prescription medicines?', ['9 February 2019', '1 January 2011', '30 June 2015', '2026'], 0, 'Delegated Regulation 2016/161 applied from 9 February 2019.', 'Delegated Regulation (EU) 2016/161'),
    Q('q21-5', 21, 'A company wants a QR code on the carton. What is needed?', ['Submission and assessment, with content consistent with the approved information', 'Nothing', 'Only a national notification', 'A new marketing authorisation'], 0, 'EMA assesses QR codes and what they link to.', 'EMA QR code guidance'),
    Q('q22-1', 22, 'Who reviews the translations of a centrally authorised product?', ['Member state linguistic experts, in the linguistic review', 'The company alone', 'PRAC', 'The WHO'], 0, 'Member states review the translations after the CHMP opinion.', 'EMA linguistic review process'),
    Q('q22-2', 22, 'The English says 10 mg and the French says 25 mg. What kind of error is this?', ['A translation error that changes the meaning', 'Acceptable local adaptation', 'A QRD heading error', 'A Braille error'], 0, 'Numbers must be the same in every language.', 'EMA linguistic review process'),
    Q('q22-3', 22, 'Why keep a term base?', ['To use approved terms consistently across documents and updates', 'To store the artwork', 'To count side effects', 'To track deadlines'], 0, 'Consistent terms make review faster and avoid confusion.', 'Industry practice'),
    Q('q22-4', 22, 'In French product information, which term is used for side effects?', ['Effets indésirables', 'Effets secondaires', 'Réactions', 'Symptômes'], 0, 'The QRD French template uses "effets indésirables".', 'QRD template (French)'),
    Q('q22-5', 22, 'How many language versions does a centrally authorised product need?', ['All official EU languages plus Icelandic and Norwegian', 'Only English', 'English and French', 'Only the languages where it is marketed'], 0, 'The decision covers the EU and the EEA states.', 'EMA linguistic review process'),
    Q('q23-1', 23, 'Who decides the EU product information wording for a confirmed signal?', ['PRAC recommends it', 'The company alone', 'The WHO', 'The national price authority'], 0, 'PRAC recommendations include the wording and the deadline.', 'EMA PRAC recommendations'),
    Q('q23-2', 23, 'Agreed PRAC wording implemented as it is: which variation?', ['Type IA-IN, C.3.a', 'Type II, C.3.c', 'A line extension', 'No variation'], 0, 'C.3.a covers implementation of agreed wording without new data.', 'Variation guidelines C/2025/5045'),
    Q('q23-3', 23, 'Where is the deadline for implementing a PRAC signal recommendation?', ['In the recommendation itself', 'Always 30 days', 'Always one year', 'There is none'], 0, 'Each recommendation sets its own deadline.', 'HALMED instructions'),
    Q('q23-4', 23, 'What is a PSUSA?', ['A single assessment of periodic safety reports for an active substance', 'A user test', 'A translation check', 'A carton design review'], 0, 'PSUSA outcomes can change the product information of every product with the substance.', 'EMA PSUSA'),
    Q('q23-5', 23, 'In which languages does EMA publish PRAC signal wording?', ['English and all official EU languages', 'English only', 'French only', 'The company’s language'], 0, 'Translations follow about three weeks after the meeting.', 'EMA PRAC recommendations'),
    Q('q24-1', 24, 'What is the EU ePI standard based on?', ['HL7 FHIR', 'PDF/A', 'Word templates', 'SPL'], 0, 'The EU ePI common standard uses HL7 FHIR.', 'EMA ePI page'),
    Q('q24-2', 24, 'When did the EU ePI pilot run?', ['July 2023 to August 2024', '2015 to 2016', '2026 to 2027', 'It has not run'], 0, 'Results were published in December 2024.', 'EMA ePI page'),
    Q('q24-3', 24, 'Does this app produce FHIR ePI resources?', ['No, it shows a simplified structured view', 'Yes, validated', 'Yes, for the US only', 'Only for the carton'], 0, 'The ePI view is a teaching aid, not a FHIR export.', 'App note'),
    Q('q24-4', 24, 'What did the 2025 political agreement on new EU pharmaceutical legislation say about ePI?', ['Approved product information must be made available electronically (ePI)', 'ePI is banned', 'ePI is optional forever', 'It said nothing'], 0, 'The agreement requires ePI; formal adoption and transition details follow.', 'EMA statement, December 2025'),
    Q('q24-5', 24, 'Is QRD version 11 in force?', ['No, it was consulted on in 2025', 'Yes, since 2024', 'Yes, since 2019', 'It was withdrawn'], 0, 'The consultation closed in August 2025.', 'EMA QRD templates page'),
]

DRILLS = [
    {'id': 'eu-smpc-fix', 'module': 'eu', 'title': 'Fix the SmPC', 'minutes': 15, 'sample': 'eu-ostrevia-errors', 'doc': 'smpc', 'goal': {'type': 'rules', 'prefixes': ['EU-']},
     'about': 'Clear every QRD, black triangle, 4.8, excipient, strength and promotional finding in the Ostrevia SmPC.'},
    {'id': 'eu-pl-fix', 'module': 'eu', 'title': 'Repair the package leaflet', 'minutes': 15, 'sample': 'eu-ostrevia-errors', 'doc': 'pl', 'goal': {'type': 'rules', 'prefixes': ['EU-']},
     'about': 'Restore the standard statements, headings, excipient statement and consistency with the SmPC.'},
    {'id': 'eu-carton-fix', 'module': 'eu', 'title': 'Fix the outer carton', 'minutes': 10, 'sample': 'eu-ostrevia-errors', 'doc': 'outer-10', 'goal': {'type': 'rules', 'prefixes': ['EU-']},
     'about': 'Children warning, Braille, the safety features and the authorisation number.'},
    {'id': 'eu-lactose', 'module': 'eu', 'title': 'Declare a new excipient', 'minutes': 15, 'sample': 'eu-ostrevia-lactose', 'doc': 'pl', 'goal': {'type': 'rules-multi', 'docs': ['smpc', 'pl', 'outer-25'], 'prefixes': ['EU-EXC']},
     'about': 'The 25 mg tablet now contains lactose. Add the statements to SmPC 4.4, the leaflet (section 2) and the carton (section 3).'},
    {'id': 'eu-usertest', 'module': 'eu', 'title': 'Pass the user test', 'minutes': 25, 'sample': 'eu-ostrevia-usertest', 'doc': 'pl', 'tab': 'usertest', 'goal': {'type': 'usertest'},
     'about': 'Run a round, rewrite the sections participants could not use, and pass two final rounds of 10 on the same text (16 of 20 on every question).'},
    {'id': 'eu-translation', 'module': 'eu', 'title': 'Review the French leaflet', 'minutes': 20, 'sample': 'eu-ostrevia-translation', 'doc': 'pl-fr', 'tab': 'translation', 'goal': {'type': 'translation'},
     'about': 'Fix the dose, the missing period and the wrong term against the English and the term base, then answer the linguistic review comments.'},
    {'id': 'eu-prac', 'module': 'eu', 'capstone': True, 'title': 'Capstone: implement a PRAC signal recommendation', 'minutes': 35, 'sample': 'eu-ostrevia-prac', 'doc': 'smpc', 'tab': 'changes', 'goal': {'type': 'prac'},
     'about': 'Add the PRAC wording on DRESS to SmPC 4.4 and 4.8 and leaflet sections 2 and 4, approve both, classify the variation and record the submission before the 60-day deadline.'},
]

GLOSSARY = [
    {'term': 'Additional monitoring', 'def': 'EU status for medicines monitored more closely, shown by an inverted black triangle in the SmPC and leaflet.'},
    {'term': 'Annex IIIA / IIIB', 'def': 'The labelling (IIIA) and package leaflet (IIIB) of a centrally authorised product.'},
    {'term': 'Appendix V', 'def': 'The list of national reporting systems for suspected adverse reactions, referred to in SmPC 4.8 and leaflet section 4.'},
    {'term': 'Blue box', 'def': 'An area on the outer packaging of a centrally authorised product for national particulars such as price.'},
    {'term': 'Bridging', 'def': 'Showing that a leaflet is similar enough to a user-tested leaflet that a new test is not needed.'},
    {'term': 'ePI', 'def': 'Electronic product information: the SmPC and leaflet as structured data (EU standard based on HL7 FHIR).'},
    {'term': 'Excipient with a known effect', 'def': 'An excipient listed in the annex to the excipients guideline, needing a set statement in the product information.'},
    {'term': 'Linguistic review', 'def': 'Member states’ review of the translations of a centrally authorised product’s product information.'},
    {'term': 'Package leaflet (PL)', 'def': 'The EU patient information that comes in the pack (Annex IIIB).'},
    {'term': 'PRAC', 'def': 'Pharmacovigilance Risk Assessment Committee of EMA; recommends safety wording and deadlines.'},
    {'term': 'PSUSA', 'def': 'Periodic safety update single assessment: one EU assessment of PSURs for an active substance.'},
    {'term': 'QRD', 'def': 'Quality Review of Documents: the EMA group that publishes the product information templates.'},
    {'term': 'SmPC', 'def': 'Summary of Product Characteristics: the EU product information for health professionals (Annex I).'},
    {'term': 'Unique identifier', 'def': 'The serialised code in a 2D data matrix on EU prescription packs (Delegated Regulation 2016/161).'},
    {'term': 'User test', 'def': 'Testing a leaflet with members of the public; each question passes when 16 of 20 find and understand the answer.'},
]
