"""US pack: metadata, sources, templates, rule cards and vocabulary.

Every rule card cites a source. Simplifications are stated on the card, and the app shows them.
"""

ECFR = 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-201'

PACK = {
    'id': 'us',
    'name': 'United States (FDA)',
    'short': 'US',
    'version': '1.0.0',
    'asOf': '2026-10-11',
    'kinds': ['pi', 'pi-old', 'mg', 'ppi', 'ifu', 'carton', 'container'],
    'about': (
        'Prescribing information in PLR format (21 CFR 201.56 and 201.57) and the older format '
        '(21 CFR 201.80), patient labelling (Medication Guide under 21 CFR 208, Patient Package '
        'Insert, Instructions for Use), and carton and container labels. The checks follow the '
        'regulations and FDA guidance listed below; where a check estimates or simplifies, its '
        'rule card says so.'
    ),
    'watch': [
        {'id': 'pmi', 'title': 'Patient Medication Information (PMI)',
         'text': 'FDA proposed a one-page Patient Medication Information sheet in May 2023 that would replace Medication Guides and most Patient Package Inserts. As of mid-2026 the rule is still proposed (FDA reconfirmed the existing Medication Guide requirements in a July 2026 information-collection notice). The app teaches it in lesson 6 and never flags its absence; a one-page PMI drill is planned for Phase 2.',
         'src': 'pmi'},
        {'id': 'ndc12', 'title': '12-digit NDC',
         'text': 'FDA has proposed moving to a uniform 12-digit National Drug Code. Until a final rule applies, the app checks the current 10-digit formats (4-4-2, 5-3-2 or 5-4-1).',
         'src': 'ndc'},
        {'id': 'interchange', 'title': 'Interchangeability statements for biosimilars',
         'text': 'FDA has been revising how interchangeability is shown in biosimilar labelling. A biosimilar labelling exercise is planned for a later phase and will be marked Watch until the policy settles.',
         'src': 'biosim'},
    ],
    'sources': [
        {'id': 'cfr20156', 'title': '21 CFR 201.56: Requirements on content and format of labeling for human prescription drug and biological products', 'url': f'{ECFR}/subpart-B/section-201.56'},
        {'id': 'cfr20157', 'title': '21 CFR 201.57: Specific requirements on content and format of labeling (PLR format)', 'url': f'{ECFR}/subpart-B/section-201.57'},
        {'id': 'cfr20180', 'title': '21 CFR 201.80: Specific requirements for older-format labeling', 'url': f'{ECFR}/subpart-B/section-201.80'},
        {'id': 'cfr208', 'title': '21 CFR Part 208: Medication Guides for prescription drug products', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-208'},
        {'id': 'cfr20125', 'title': '21 CFR 201.25: Bar code label requirements', 'url': f'{ECFR}/subpart-A/section-201.25'},
        {'id': 'cfr2011', 'title': '21 CFR 201.1: Drugs; name and place of business of manufacturer, packer, or distributor', 'url': f'{ECFR}/subpart-A/section-201.1'},
        {'id': 'cfr20110', 'title': '21 CFR 201.10: Drugs; statement of ingredients (established name prominence)', 'url': f'{ECFR}/subpart-A/section-201.10'},
        {'id': 'cfr20117', 'title': '21 CFR 201.17: Drugs; location of expiration date', 'url': f'{ECFR}/subpart-A/section-201.17'},
        {'id': 'cfr20118', 'title': '21 CFR 201.18: Drugs; significance of control numbers', 'url': f'{ECFR}/subpart-A/section-201.18'},
        {'id': 'cfr20151', 'title': '21 CFR 201.51: Declaration of net quantity of contents', 'url': f'{ECFR}/subpart-A/section-201.51'},
        {'id': 'cfr201100', 'title': '21 CFR 201.100: Prescription drugs for human use (Rx only and label statements)', 'url': f'{ECFR}/subpart-D/section-201.100'},
        {'id': 'ndc', 'title': '21 CFR 207.33: National Drug Code format', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-207/subpart-C/section-207.33'},
        {'id': 'cfr31494', 'title': '21 CFR 314.94(a)(8): ANDA labeling and permitted differences', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314/subpart-C/section-314.94'},
        {'id': 'cfr314127', 'title': '21 CFR 314.127(a)(7): Omission of protected indications from generic labeling', 'url': 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314/subpart-D/section-314.127'},
        {'id': 'viii', 'title': 'FD&C Act 505(j)(2)(A)(viii) (21 U.S.C. 355): section viii statements', 'url': 'https://www.law.cornell.edu/uscode/text/21/355'},
        {'id': 'plrpage', 'title': 'FDA: PLR requirements for prescribing information (labeling resources and guidances)', 'url': 'https://www.fda.gov/drugs/laws-acts-and-rules/plr-requirements-prescribing-information'},
        {'id': 'carton', 'title': 'FDA guidance: Safety Considerations for Container Labels and Carton Labeling Design to Minimize Medication Errors (May 2022)', 'url': 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/safety-considerations-container-labels-and-carton-labeling-design-minimize-medication-errors'},
        {'id': 'ismp', 'title': 'ISMP List of Error-Prone Abbreviations, Symbols and Dose Designations (cited by FDA in its carton and container guidance)', 'url': 'https://www.ismp.org/recommendations/error-prone-abbreviations-list'},
        {'id': 'spl', 'title': 'FDA: Structured Product Labeling resources', 'url': 'https://www.fda.gov/industry/fda-data-standards-advisory-board/structured-product-labeling-resources'},
        {'id': 'pmi', 'title': 'FDA: proposed rule for Patient Medication Information (May 2023)', 'url': 'https://www.fda.gov/news-events/press-announcements/fda-proposes-new-easy-read-medication-guide-patients-patient-medication-information'},
        {'id': 'mgnotice', 'title': 'Federal Register 2026-13346: Medication Guides information collection (July 2026)', 'url': 'https://public-inspection.federalregister.gov/2026-13346.pdf'},
        {'id': 'patient', 'title': 'FDA: Patient labeling resources (Medication Guides, PPIs, IFUs)', 'url': 'https://www.fda.gov/drugs/fdas-labeling-resources-human-prescription-drugs/patient-labeling-resources'},
        {'id': 'biosim', 'title': 'FDA: Biosimilar and interchangeable products labeling resources', 'url': 'https://www.fda.gov/drugs/biosimilars/biosimilar-and-interchangeable-biologics-more-treatment-choices'},
    ],
}

# ---------------------------------------------------------------- templates
# Section numbers are fixed by the regulation; required = the check expects content,
# recommended = a warning when empty, optional = no check.
PI_SECTIONS = [
    {'num': '1', 'title': 'INDICATIONS AND USAGE', 'need': 'required'},
    {'num': '2', 'title': 'DOSAGE AND ADMINISTRATION', 'need': 'required'},
    {'num': '3', 'title': 'DOSAGE FORMS AND STRENGTHS', 'need': 'required'},
    {'num': '4', 'title': 'CONTRAINDICATIONS', 'need': 'required'},
    {'num': '5', 'title': 'WARNINGS AND PRECAUTIONS', 'need': 'required'},
    {'num': '6', 'title': 'ADVERSE REACTIONS', 'need': 'required'},
    {'num': '7', 'title': 'DRUG INTERACTIONS', 'need': 'recommended'},
    {'num': '8', 'title': 'USE IN SPECIFIC POPULATIONS', 'need': 'required', 'extraSubs': True, 'fixedSubs': [
        {'num': '8.1', 'title': 'Pregnancy', 'need': 'required'},
        {'num': '8.2', 'title': 'Lactation', 'need': 'required'},
        {'num': '8.3', 'title': 'Females and Males of Reproductive Potential', 'need': 'optional'},
        {'num': '8.4', 'title': 'Pediatric Use', 'need': 'required'},
        {'num': '8.5', 'title': 'Geriatric Use', 'need': 'required'},
    ]},
    {'num': '9', 'title': 'DRUG ABUSE AND DEPENDENCE', 'need': 'optional', 'fixedSubs': [
        {'num': '9.1', 'title': 'Controlled Substance', 'need': 'optional'},
        {'num': '9.2', 'title': 'Abuse', 'need': 'optional'},
        {'num': '9.3', 'title': 'Dependence', 'need': 'optional'},
    ]},
    {'num': '10', 'title': 'OVERDOSAGE', 'need': 'recommended'},
    {'num': '11', 'title': 'DESCRIPTION', 'need': 'required'},
    {'num': '12', 'title': 'CLINICAL PHARMACOLOGY', 'need': 'required', 'fixedSubs': [
        {'num': '12.1', 'title': 'Mechanism of Action', 'need': 'required'},
        {'num': '12.2', 'title': 'Pharmacodynamics', 'need': 'recommended'},
        {'num': '12.3', 'title': 'Pharmacokinetics', 'need': 'required'},
        {'num': '12.4', 'title': 'Microbiology', 'need': 'optional'},
        {'num': '12.5', 'title': 'Pharmacogenomics', 'need': 'optional'},
        {'num': '12.6', 'title': 'Immunogenicity', 'need': 'optional'},
    ]},
    {'num': '13', 'title': 'NONCLINICAL TOXICOLOGY', 'need': 'recommended', 'fixedSubs': [
        {'num': '13.1', 'title': 'Carcinogenesis, Mutagenesis, Impairment of Fertility', 'need': 'recommended'},
        {'num': '13.2', 'title': 'Animal Toxicology and/or Pharmacology', 'need': 'optional'},
    ]},
    {'num': '14', 'title': 'CLINICAL STUDIES', 'need': 'recommended'},
    {'num': '15', 'title': 'REFERENCES', 'need': 'optional'},
    {'num': '16', 'title': 'HOW SUPPLIED/STORAGE AND HANDLING', 'need': 'required'},
    {'num': '17', 'title': 'PATIENT COUNSELING INFORMATION', 'need': 'required'},
]

HL_HEADINGS = [
    {'key': 'rmc', 'title': 'RECENT MAJOR CHANGES', 'kind': 'rmc'},
    {'key': 'ind', 'title': 'INDICATIONS AND USAGE', 'ref': '1', 'need': 'required'},
    {'key': 'da', 'title': 'DOSAGE AND ADMINISTRATION', 'ref': '2', 'need': 'required'},
    {'key': 'dfs', 'title': 'DOSAGE FORMS AND STRENGTHS', 'ref': '3', 'need': 'required'},
    {'key': 'ci', 'title': 'CONTRAINDICATIONS', 'ref': '4', 'need': 'required'},
    {'key': 'wp', 'title': 'WARNINGS AND PRECAUTIONS', 'ref': '5', 'need': 'required'},
    {'key': 'ar', 'title': 'ADVERSE REACTIONS', 'ref': '6', 'need': 'required'},
    {'key': 'di', 'title': 'DRUG INTERACTIONS', 'ref': '7', 'need': 'optional'},
    {'key': 'usp', 'title': 'USE IN SPECIFIC POPULATIONS', 'ref': '8', 'need': 'optional'},
]

OLD_SECTIONS = [
    {'num': 'A', 'title': 'DESCRIPTION', 'need': 'required'},
    {'num': 'B', 'title': 'CLINICAL PHARMACOLOGY', 'need': 'required'},
    {'num': 'C', 'title': 'INDICATIONS AND USAGE', 'need': 'required'},
    {'num': 'D', 'title': 'CONTRAINDICATIONS', 'need': 'required'},
    {'num': 'E', 'title': 'WARNINGS', 'need': 'required'},
    {'num': 'F', 'title': 'PRECAUTIONS', 'need': 'required'},
    {'num': 'G', 'title': 'ADVERSE REACTIONS', 'need': 'required'},
    {'num': 'H', 'title': 'DRUG ABUSE AND DEPENDENCE', 'need': 'optional'},
    {'num': 'I', 'title': 'OVERDOSAGE', 'need': 'recommended'},
    {'num': 'J', 'title': 'DOSAGE AND ADMINISTRATION', 'need': 'required'},
    {'num': 'K', 'title': 'HOW SUPPLIED', 'need': 'required'},
]

# Patient labelling headings. {name} is replaced by the proprietary name. "alt" lists other
# wordings FDA templates accept for the same heading.
MG_SECTIONS = [
    {'num': 'm1', 'title': 'What is the most important information I should know about {name}?', 'need': 'required'},
    {'num': 'm2', 'title': 'What is {name}?', 'need': 'required'},
    {'num': 'm3', 'title': 'Who should not take {name}?', 'alt': ['Do not take {name} if you:'], 'need': 'recommended'},
    {'num': 'm4', 'title': 'What should I tell my healthcare provider before taking {name}?', 'alt': ['Before taking {name}, tell your healthcare provider about all of your medical conditions, including if you:'], 'need': 'recommended'},
    {'num': 'm5', 'title': 'How should I take {name}?', 'need': 'recommended'},
    {'num': 'm6', 'title': 'What should I avoid while taking {name}?', 'need': 'optional'},
    {'num': 'm7', 'title': 'What are the possible side effects of {name}?', 'need': 'required'},
    {'num': 'm8', 'title': 'How should I store {name}?', 'need': 'recommended'},
    {'num': 'm9', 'title': 'General information about the safe and effective use of {name}.', 'need': 'required'},
    {'num': 'm10', 'title': 'What are the ingredients in {name}?', 'need': 'required'},
]
PPI_SECTIONS = [
    {'num': 'p1', 'title': 'What is {name}?', 'need': 'required'},
    {'num': 'p2', 'title': 'Who should not take {name}?', 'alt': ['Do not take {name} if you:'], 'need': 'recommended'},
    {'num': 'p3', 'title': 'What should I tell my healthcare provider before taking {name}?', 'need': 'recommended'},
    {'num': 'p4', 'title': 'How should I take {name}?', 'need': 'required'},
    {'num': 'p5', 'title': 'What are the possible side effects of {name}?', 'need': 'required'},
    {'num': 'p6', 'title': 'How should I store {name}?', 'need': 'recommended'},
    {'num': 'p7', 'title': 'General information about the safe and effective use of {name}.', 'need': 'required'},
    {'num': 'p8', 'title': 'What are the ingredients in {name}?', 'need': 'required'},
]
IFU_SECTIONS = [
    {'num': 'i1', 'title': 'Important information you need to know before using {name}', 'need': 'required'},
    {'num': 'i2', 'title': 'Supplies you will need', 'need': 'recommended'},
    {'num': 'i3', 'title': 'Preparing your dose', 'need': 'recommended'},
    {'num': 'i4', 'title': 'Using {name}', 'need': 'required'},
    {'num': 'i5', 'title': 'Storing {name}', 'need': 'recommended'},
    {'num': 'i6', 'title': 'Disposing of {name}', 'need': 'recommended'},
]

CARTON_FIELDS = [
    {'key': 'proprietaryName', 'label': 'Proprietary name', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr20110', 'at': '201.10'},
    {'key': 'establishedName', 'label': 'Established name', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr20110', 'at': '201.10(g)'},
    {'key': 'strength', 'label': 'Strength', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'carton', 'at': 'Section III'},
    {'key': 'dosageForm', 'label': 'Dosage form', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'carton', 'at': 'Section III'},
    {'key': 'route', 'label': 'Route of administration', 'need': {'carton': 'required', 'container': 'recommended'}, 'src': 'cfr201100', 'at': '201.100(b)(3)'},
    {'key': 'netQuantity', 'label': 'Net quantity', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr20151', 'at': '201.51'},
    {'key': 'rxOnly', 'label': 'Rx only statement', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr201100', 'at': '201.100(b)(1)'},
    {'key': 'ndc', 'label': 'NDC', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'ndc', 'at': '207.33'},
    {'key': 'dosageStatement', 'label': 'Dosage statement', 'need': {'carton': 'required', 'container': 'optional'}, 'src': 'cfr201100', 'at': '201.100(b)(2)'},
    {'key': 'storage', 'label': 'Storage', 'need': {'carton': 'required', 'container': 'recommended'}, 'src': 'carton', 'at': 'Section III'},
    {'key': 'lot', 'label': 'Lot number', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr20118', 'at': '201.18'},
    {'key': 'expiry', 'label': 'Expiration date', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr20117', 'at': '201.17'},
    {'key': 'manufacturer', 'label': 'Manufacturer, packer or distributor', 'need': {'carton': 'required', 'container': 'required'}, 'src': 'cfr2011', 'at': '201.1'},
]

TEMPLATES = {
    'pi': {'kind': 'pi', 'label': 'Prescribing information (PLR format)', 'short': 'PI', 'src': 'cfr20157', 'sections': PI_SECTIONS, 'hl': HL_HEADINGS,
           'fixed': {
               'limitation': 'These highlights do not include all the information needed to use {NAME} safely and effectively. See full prescribing information for {NAME}.',
               'bwClose': 'See full prescribing information for complete boxed warning.',
               'arContact': 'To report SUSPECTED ADVERSE REACTIONS, contact {manufacturer} at {phone} or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.',
               'pci': 'See 17 for PATIENT COUNSELING INFORMATION',
               'pciMG': 'See 17 for PATIENT COUNSELING INFORMATION and Medication Guide.',
               'pciPPI': 'See 17 for PATIENT COUNSELING INFORMATION and FDA-approved patient labeling.',
               'arStatement': 'Because clinical trials are conducted under widely varying conditions, adverse reaction rates observed in the clinical trials of a drug cannot be directly compared to rates in the clinical trials of another drug and may not reflect the rates observed in practice.',
           }},
    'pi-old': {'kind': 'pi-old', 'label': 'Prescribing information (older format, 201.80)', 'short': 'Old PI', 'src': 'cfr20180', 'sections': OLD_SECTIONS},
    'mg': {'kind': 'mg', 'label': 'Medication Guide', 'short': 'MG', 'src': 'cfr208', 'sections': MG_SECTIONS,
           'fixed': {'header': 'MEDICATION GUIDE', 'sideEffects': 'Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088.',
                     'approval': 'This Medication Guide has been approved by the U.S. Food and Drug Administration.'}},
    'ppi': {'kind': 'ppi', 'label': 'Patient Package Insert', 'short': 'PPI', 'src': 'patient', 'sections': PPI_SECTIONS,
            'fixed': {'header': 'PATIENT INFORMATION', 'approval': 'This Patient Information has been approved by the U.S. Food and Drug Administration.'}},
    'ifu': {'kind': 'ifu', 'label': 'Instructions for Use', 'short': 'IFU', 'src': 'patient', 'sections': IFU_SECTIONS,
            'fixed': {'header': 'INSTRUCTIONS FOR USE', 'approval': 'This Instructions for Use has been approved by the U.S. Food and Drug Administration.'}},
    'carton': {'kind': 'carton', 'label': 'Carton', 'short': 'Carton', 'src': 'carton', 'fields': CARTON_FIELDS,
               'fixed': {'mgStatement': 'Dispense the accompanying Medication Guide to each patient.'}},
    'container': {'kind': 'container', 'label': 'Container label', 'short': 'Container', 'src': 'carton', 'fields': CARTON_FIELDS},
}

# ---------------------------------------------------------------- rules
def R(id, title, text, kinds, severity, src, at, simplified=None, check=None):
    r = {'id': id, 'title': title, 'text': text, 'kinds': kinds, 'severity': severity, 'src': src, 'at': at, 'check': check or id}
    if simplified:
        r['simplified'] = simplified
    return r

RULES = [
    # Highlights
    R('US-HL-LIM', 'Highlights limitation statement', 'Highlights begin with the verbatim limitation statement naming the product: "These highlights do not include all the information needed to use [PROPRIETARY NAME] safely and effectively. See full prescribing information for [PROPRIETARY NAME]."', ['pi'], 'error', 'cfr20157', '201.57(a)(1)'),
    R('US-HL-TITLE', 'Product title', 'The product title gives the proprietary name, the established name, the dosage form and the route of administration, plus the controlled substance symbol where one applies.', ['pi'], 'error', 'cfr20157', '201.57(a)(2)'),
    R('US-HL-APPROVAL', 'Initial U.S. Approval', 'Highlights state "Initial U.S. Approval:" and the four-digit year the active moiety was first approved in the US.', ['pi'], 'error', 'cfr20157', '201.57(a)(3)'),
    R('US-HL-BW', 'Boxed warning in Highlights', 'When the full prescribing information has a boxed warning, Highlights carry a summary: a heading starting "WARNING:", no more than 20 lines, ending with "See full prescribing information for complete boxed warning."', ['pi'], 'error', 'cfr20157', '201.57(a)(4)',
      simplified='The 20-line limit is estimated from the text length (about 65 characters per line in the two-column layout).'),
    R('US-HL-RMC', 'Recent Major Changes', 'Recent Major Changes list substantive changes to the Boxed Warning, Indications and Usage, Dosage and Administration, Contraindications, or Warnings and Precautions only, each with the section heading, number and the month and year of the change. An entry stays for at least one year and is removed at the first printing after that year.', ['pi'], 'error', 'cfr20157', '201.57(a)(5)',
      simplified='The app flags entries older than 12 months before the revision date. In practice an entry may stay until the next printing after the year ends.'),
    R('US-HL-REF', 'Highlights cite their sections', 'Each statement in Highlights is followed by the number of the section or subsection in the full prescribing information that it summarises, in parentheses, for example "(5.2)".', ['pi'], 'warning', 'plrpage', '201.57(a); PLR implementation guidance',
      simplified='Checked for bullets and paragraphs under Indications, Dosage and Administration, Dosage Forms, Contraindications, Warnings and Precautions, Adverse Reactions, Drug Interactions and Use in Specific Populations.'),
    R('US-HL-AR', 'Adverse reaction contact statement', 'The Adverse Reactions heading in Highlights includes "To report SUSPECTED ADVERSE REACTIONS, contact [name of manufacturer] at [phone] or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch."', ['pi'], 'error', 'cfr20157', '201.57(a)(11)'),
    R('US-HL-PCI', 'Patient counselling statement', 'Highlights end with "See 17 for PATIENT COUNSELING INFORMATION", adding "and Medication Guide" or "and FDA-approved patient labeling" when patient labeling exists.', ['pi'], 'error', 'cfr20157', '201.57(a)(14)'),
    R('US-HL-REV', 'Revision date', 'Highlights show the date of the most recent revision as "Revised: MM/YYYY".', ['pi'], 'error', 'cfr20157', '201.57(a)(15)'),
    R('US-HL-LEN', 'Highlights length', 'Highlights, not counting the boxed warning, fit on one-half page in the required two-column layout. A waiver may be requested.', ['pi'], 'warning', 'cfr20157', '201.57(d)(8)',
      simplified='Estimated: about 76 lines of 65 characters, counting each heading as a line. Real length depends on the typeset page.'),
    R('US-HL-CI', 'Contraindications match', 'Every contraindication in section 4 is summarised in Highlights; "None" in section 4 is "None" in Highlights.', ['pi'], 'warning', 'cfr20157', '201.57(a)(9)',
      simplified='Compared by count of items: each list item or paragraph in section 4 should have a matching Highlights item.'),
    # Full prescribing information
    R('US-PI-SEC-REQ', 'Required sections have content', 'Sections 1 to 6, 8 (with 8.1, 8.2, 8.4 and 8.5), 11, 12 (with 12.1 and 12.3), 16 and 17 are required in PLR format; 7, 10, 13 and 14 are expected for most products. Section and subsection numbers never change, even when one is omitted.', ['pi'], 'error', 'cfr20157', '201.57(c) and (d)',
      simplified='Sections marked recommended are a warning when empty; the regulation allows them to be omitted when not applicable.'),
    R('US-PI-SEC-TITLE', 'Exact headings', 'Section and fixed subsection headings use the wording set by the regulation, for example "8.4 Pediatric Use", not "8.4 Pediatrics".', ['pi', 'pi-old'], 'error', 'cfr20157', '201.57(c); 201.80'),
    R('US-PI-CI-NONE', 'Contraindications never left blank', 'Section 4 lists each contraindication, or states "None." when there are none.', ['pi'], 'error', 'cfr20157', '201.57(c)(5)'),
    R('US-PI-XREF', 'Cross-references resolve', 'Every cross-reference in parentheses, for example "[see Warnings and Precautions (5.3)]", points to a section or subsection that exists.', ['pi'], 'error', 'plrpage', 'PLR implementation guidance (cross-references)'),
    R('US-PI-BW-REF', 'Boxed warning points to section 5', 'The boxed warning in the full prescribing information refers to the Warnings and Precautions subsection(s) where the risk is discussed in more detail.', ['pi'], 'warning', 'cfr20157', '201.57(c)(1)'),
    R('US-PI-PLLR', 'Pregnancy and lactation (PLLR)', 'Section 8.1 Pregnancy and 8.2 Lactation each include a "Risk Summary". The letter categories (A, B, C, D, X) were removed by the Pregnancy and Lactation Labeling Rule and must not appear.', ['pi'], 'error', 'cfr20157', '201.57(c)(9)(i) and (ii)'),
    R('US-PI-AR-STMT', 'Clinical trials statement in section 6', 'When section 6 presents clinical trial data, it includes the standard statement that adverse reaction rates from different trials cannot be compared directly.', ['pi'], 'warning', 'cfr20157', '201.57(c)(7)(ii)(A)'),
    R('US-PI-STR', 'Strengths agree', 'The strengths in Highlights (Dosage Forms and Strengths), section 3, section 16 and the product record are the same.', ['pi'], 'error', 'cfr20157', '201.57(c)(4) and (c)(17)'),
    R('US-PI-17-MG', 'Section 17 points to patient labelling', 'When a Medication Guide or other FDA-approved patient labeling exists, section 17 tells the prescriber to advise the patient to read it.', ['pi'], 'error', 'cfr20157', '201.57(c)(18)'),
    R('US-NAME', 'Established name spelled consistently', 'The established name is spelled the same way everywhere. Near-misses (one or two letters different) are usually typing errors.', ['pi', 'pi-old', 'mg', 'ppi', 'ifu', 'carton', 'container'], 'warning', 'cfr20110', '201.10',
      simplified='Detects words within two letters of the established name.'),
    # Medication errors
    R('US-ME-TZ', 'No trailing zeros', 'Doses and strengths never carry a trailing zero ("5 mg", not "5.0 mg"): the decimal point can be missed and a tenfold overdose given.', ['pi', 'pi-old', 'mg', 'ppi', 'ifu', 'carton', 'container'], 'error', 'carton', 'Section III.B; ISMP list'),
    R('US-ME-ND', 'No naked decimals', 'Doses below 1 always carry a leading zero ("0.5 mg", not ".5 mg").', ['pi', 'pi-old', 'mg', 'ppi', 'ifu', 'carton', 'container'], 'error', 'carton', 'Section III.B; ISMP list'),
    R('US-ME-ABBR', 'No error-prone abbreviations', 'Avoid abbreviations on the ISMP error-prone list, for example U or IU for units, QD, QOD, SC or SQ, cc, and ug for micrograms.', ['pi', 'pi-old', 'mg', 'ppi', 'ifu', 'carton', 'container'], 'warning', 'ismp', 'Error-prone abbreviations list',
      simplified='A subset of the ISMP list is checked.'),
    # Patient labelling
    R('US-PT-HEAD', 'Patient labelling headings', 'Patient labelling uses the required headings in order, in question form, with the product name filled in, and each required heading has content.', ['mg', 'ppi', 'ifu'], 'error', 'cfr208', '208.20(b)',
      simplified='Headings follow the FDA templates; the PPI and IFU headings are recommended practice rather than regulation.'),
    R('US-PT-FIXED', 'Patient labelling statements', 'A Medication Guide is titled "MEDICATION GUIDE", gives the side-effect reporting statement, states that it has been approved by FDA, and shows the revision date.', ['mg', 'ppi', 'ifu'], 'error', 'cfr208', '208.20(b)'),
    R('US-MG-PI', 'Most important information matches the boxed warning', 'When the prescribing information has a boxed warning, the Medication Guide opens with the most important information on that risk.', ['mg'], 'warning', 'cfr208', '208.20(b)(2)'),
    R('US-PT-READ', 'Reading level', 'Patient labelling is written in plain language. The app estimates a reading grade and flags long sentences and medical terms with lay alternatives.', ['mg', 'ppi', 'ifu'], 'info', 'cfr208', '208.20(a)(2)',
      simplified='Flesch-Kincaid grade estimate in English; a hint only, never a pass or fail.'),
    # Carton and container
    R('US-CC-REQ', 'Required label particulars', 'Carton and container labels carry the proprietary and established names, strength, dosage form, net quantity, "Rx only", NDC, lot number, expiration date and the name and place of business of the manufacturer, packer or distributor; cartons also carry the route, a dosage statement and storage.', ['carton', 'container'], 'error', 'cfr201100', '201.1, 201.17, 201.18, 201.51, 201.100',
      simplified='Small-container exemptions are not modelled.'),
    R('US-CC-NDC', 'NDC format', 'The NDC is 10 digits in one of the configurations 4-4-2, 5-3-2 or 5-4-1.', ['carton', 'container'], 'error', 'ndc', '207.33'),
    R('US-CC-BARCODE', 'Bar code', 'Prescription drug labels carry a linear bar code that contains the NDC.', ['carton', 'container'], 'error', 'cfr20125', '201.25'),
    R('US-CC-ESTNAME', 'Established name prominence', 'The established name is printed in letters at least half as large as the letters of the proprietary name, with prominence commensurate with it.', ['carton', 'container'], 'error', 'cfr20110', '201.10(g)(2)'),
    R('US-CC-STR', 'Strength matches the PI', 'The strength on the carton or container is one of the strengths in the approved prescribing information.', ['carton', 'container'], 'error', 'carton', 'Section III'),
    R('US-CC-PERML', 'Strength per total volume and per mL', 'For injectables, the strength is shown as the amount per total volume, followed by the amount per mL (for example "50 mg/5 mL (10 mg/mL)").', ['carton', 'container'], 'warning', 'carton', 'Section III.A'),
    R('US-CC-MG', 'Medication Guide statement', 'When a Medication Guide is required, the carton tells the dispenser to provide it: "Dispense the accompanying Medication Guide to each patient."', ['carton'], 'error', 'cfr208', '208.24(d)'),
    # Generic labelling
    R('US-ANDA-SAME', 'Same as the reference label', 'Generic labeling is the same as the reference listed drug labeling, except for permitted differences: for example the manufacturer, inactive ingredients, how supplied, and indications omitted because of patents or exclusivity.', ['pi'], 'warning', 'cfr31494', '314.94(a)(8)(iv)'),
    R('US-ANDA-CARVE', 'Carve-outs are complete', 'When a protected indication is carved out under section viii, every mention that depends on it is removed: the indication, its dosing, its clinical studies and its Highlights entries.', ['pi'], 'error', 'cfr314127', '314.127(a)(7); FD&C Act 505(j)(2)(A)(viii)',
      simplified='Mentions are found by keywords defined for each indication in the exercise.'),
]

ABBREVIATIONS = [
    {'pattern': r'\d\s*U\b', 'label': 'U (units)', 'use': 'units'},
    {'pattern': r'\d\s*IU\b', 'label': 'IU (international units)', 'use': 'units'},
    {'pattern': r'\b(QD|qd|Q\.D\.|q\.d\.)\b', 'label': 'QD', 'use': 'daily'},
    {'pattern': r'\b(QOD|qod|Q\.O\.D\.)\b', 'label': 'QOD', 'use': 'every other day'},
    {'pattern': r'\b(SC|SQ|sub q|subq)\b', 'label': 'SC or SQ', 'use': 'subcutaneous'},
    {'pattern': r'\d\s*cc\b', 'label': 'cc', 'use': 'mL'},
    {'pattern': r'\d\s*ug\b', 'label': 'ug', 'use': 'mcg'},
    {'pattern': r'\bTIW\b', 'label': 'TIW', 'use': 'three times weekly'},
    {'pattern': r'\b(HS|hs)\b', 'label': 'HS', 'use': 'at bedtime'},
    {'pattern': r'\bD/C\b', 'label': 'D/C', 'use': 'discharge or discontinue'},
    {'pattern': r'\b(MSO4|MgSO4)\b', 'label': 'MSO4 or MgSO4', 'use': 'the full drug name'},
]

JARGON = {
    'hepatic': 'liver', 'renal': 'kidney', 'administer': 'give', 'adverse reaction': 'side effect',
    'contraindicated': 'should not be used', 'hypertension': 'high blood pressure', 'hypotension': 'low blood pressure',
    'myocardial infarction': 'heart attack', 'pruritus': 'itching', 'concomitant': 'at the same time',
    'efficacy': 'how well it works', 'subcutaneous': 'under the skin', 'dyspnea': 'shortness of breath',
    'erythema': 'redness', 'malignancy': 'cancer', 'thrombosis': 'blood clot', 'neutropenia': 'low white blood cell count',
    'pyrexia': 'fever', 'cephalgia': 'headache', 'emesis': 'vomiting', 'syncope': 'fainting', 'edema': 'swelling',
    'gastrointestinal': 'stomach and bowel', 'discontinue': 'stop', 'initiate': 'start', 'prior to': 'before',
    'in the event of': 'if', 'nasopharyngitis': 'common cold', 'arthralgia': 'joint pain', 'anaphylaxis': 'a severe allergic reaction',
    'angioedema': 'swelling of the face, lips, tongue or throat', 'hyperkalemia': 'high potassium in the blood',
}
