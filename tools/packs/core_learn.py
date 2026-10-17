"""Core module learning content: lessons 12 to 15, quiz questions, drills and glossary terms.
Lesson ids continue the US numbering so lesson links and progress keys stay unique."""


def L(id, title, minutes, sections, try_it=None):
    return {'id': id, 'module': 'core', 'title': title, 'minutes': minutes, 'sections': [{'h': h, 'p': p} for h, p in sections], 'tryIt': try_it, 'watch': False}


LESSONS = [
    L(12, 'The core data sheet and the core safety information', 7, [
        ('One global position', [
            'A company that sells a medicine in many countries keeps one global reference document for it: the Company Core Data Sheet (CCDS). It states the company\'s position on indications, dosing, contraindications, warnings, interactions, use in pregnancy, adverse reactions and overdose. Local labels in each market are written from it.',
            'Inside the CCDS is the Company Core Safety Information (CCSI): the safety statements the company wants in every label in every market. The idea comes from CIOMS Working Groups III and V. Indications and dosing can differ between markets because approvals differ; the core safety information should not, unless there is a good reason.',
        ]),
        ('Why the CCSI matters beyond labelling', [
            'Pharmacovigilance uses the CCSI as the reference safety information: in periodic benefit-risk reports (ICH E2C(R2)) a reaction is "listed" if it is in the CCSI and "unlisted" if not. So a gap between the CCSI and what is known is a safety problem, and a gap between the CCSI and a local label is a compliance problem.',
        ]),
        ('Versions', [
            'The CCDS is a controlled document. Each change makes a new version with an effective date and a reason, usually a labelling committee decision after a signal, a new study or an agency request. A new version starts the clock for updating every local label.',
            'In this app a project can hold the product\'s CCDS. Older versions are frozen; you edit a draft and make it effective, and the app lists every label and section the change affects.',
        ]),
    ], try_it={'sample': 'ostrevia-ccds', 'doc': 'pi', 'tab': 'core'}),
    L(13, 'Mapping a local label and recording deviations', 8, [
        ('Mapping', [
            'Mapping means going through the CCDS statement by statement and finding where each one is in the local label. A statement can be aligned (the label says the same thing in substance), deviating (the label says something different or leaves it out) or not applicable (for example a dosing statement for an indication not approved in that market).',
            'The words do not have to match. US labels follow 21 CFR 201.57 and FDA style, so a CCDS sentence may be split across Highlights, section 2, section 5 and section 17, and appear again in plain language in the Medication Guide.',
        ]),
        ('Deviations need reasons', [
            'Every deviation goes into a deviation register with a justification that would satisfy an inspector: the agency did not accept the wording, the indication is not approved here, local regulations require something different, or the update is in progress with a date.',
            '"Not needed" is not a justification. A CCSI statement missing from a label without a reason is the kind of gap inspections find.',
        ]),
        ('How the app helps', [
            'The app suggests whether each statement is present by looking for its key terms in the mapped sections, and you confirm or correct it. A CCSI statement that is neither found nor justified is an error that blocks approval; a missing non-CCSI statement is a warning. The register downloads as a CSV file.',
        ]),
    ], try_it={'sample': 'ostrevia-ccds', 'doc': 'pi', 'tab': 'core'}),
    L(14, 'Running a safety labelling change', 9, [
        ('Where changes come from', [
            'A labelling change can start inside the company (a signal reviewed by the labelling committee, which becomes a new CCDS version) or outside it: in the US, FDA can notify the holder under section 505(o)(4) of the FD&C Act that new safety information should be in the labelling. A generic company also changes its label when the reference listed drug\'s label changes.',
        ]),
        ('The 505(o)(4) clock', [
            'After an FDA notification, the holder has 30 days to submit a supplement with the proposed changes or a rebuttal saying why no change is warranted. If FDA disagrees, discussions follow (no more than 30 days). FDA can then order the change within 15 days, and the holder must submit within 15 days of the order. Missing these steps can lead to enforcement.',
            'Separately, a holder can strengthen a warning straight away with a Changes Being Effected supplement under 21 CFR 314.70(c)(6)(iii), without waiting for FDA. Classifying the change is the Variations Classifier\'s job; this app exports the change to it.',
        ]),
        ('Agency comment rounds', [
            'Proposed labelling is usually negotiated. FDA sends comments on the draft; the company accepts, partly accepts or declines each one with a reason, and sends back revised labelling. Several rounds can follow until the labelling is agreed. Keep a response table: comment, decision, reason, and where the text changed.',
            'Pick your battles. Declining a comment needs evidence, and an agency rarely accepts promotional or unsupported claims.',
        ]),
    ], try_it={'sample': 'ostrevia-o4', 'doc': 'pi', 'tab': 'agency'}),
    L(15, 'Implementation: from approval to the pharmacy shelf', 7, [
        ('Approval is not the end', [
            'A change is implemented when packs with the new labelling are being distributed. That needs new artwork, printing, packaging runs and release. Companies set target dates for the first shipment with new labels and for when old stock should have left their control.',
            'In the US, safety changes made through a CBE-0 supplement are implemented when the supplement is submitted, and the updated labelling is posted as SPL. The app records approval, first shipment and old-stock-out dates for each market and flags late ones.',
        ]),
        ('Tracking every market', [
            'One CCDS change can mean a submission in every country where the product is sold, each with its own classification, review time and implementation rules. A tracker shows, per market, the status (not started, wording drafted, submitted, approved, implemented), the target date and how late it is.',
            'The tracker in this app uses the same steps and target defaults as the Variations Classifier\'s labelling rollout, so a rollout file can move between the two apps.',
        ]),
        ('Sending the labels on', [
            'Approved labels go into the dossier: in the US, Module 1.14 (draft labelling in 1.14.1, final in 1.14.2). The app exports a labelling package that the eCTD Dossier Builder imports into the right Module 1 sections, and the current CCSI as a file for pharmacovigilance.',
        ]),
    ], try_it={'sample': 'ostrevia-ccds4', 'doc': 'pi', 'tab': 'core'}),
]


def Q(id, topic, q, options, answer, why, cite):
    return {'id': id, 'topic': topic, 'module': 'core', 'q': q, 'options': options, 'answer': answer, 'why': why, 'cite': cite}


QUESTIONS = [
    Q('q12-1', 12, 'What is the CCSI?', ['The safety part of the company core data sheet', 'A US FDA form for safety changes', 'The local label in the company\'s home country', 'A list of adverse events from one clinical study'], 0,
      'The Company Core Safety Information is the safety subset of the CCDS that the company wants in every local label.', 'CIOMS III/V'),
    Q('q12-2', 12, 'In a periodic benefit-risk report, a reaction that is in the CCSI is called…', ['Listed', 'Labelled in the US', 'Expected by FDA', 'Serious'], 0,
      'ICH E2C(R2) uses the CCSI as the reference safety information: reactions in it are listed, others unlisted.', 'ICH E2C(R2)'),
    Q('q12-3', 12, 'Which part of the CCDS may most legitimately differ between markets?', ['The approved indications', 'A boxed-warning-level safety statement', 'A contraindication', 'An overdose warning'], 0,
      'Indications depend on what each agency approved. Core safety statements should be in every label unless a deviation is justified.', 'CIOMS III/V'),
    Q('q12-4', 12, 'What usually creates a new CCDS version?', ['A labelling committee decision, for example after a safety signal', 'Every local label approval', 'A change of artwork supplier', 'A new pack size'], 0,
      'The CCDS changes when the company\'s position changes, typically after a signal, new data or an agency request.', 'CIOMS III/V'),
    Q('q12-5', 12, 'Why is a CCDS version frozen once it is effective?', ['So every label can be traced to the exact text it was assessed against', 'Because agencies approve the CCDS', 'Because it is printed on the carton', 'So it can be submitted as SPL'], 0,
      'Labels are mapped to a specific version; changing an effective version would break that trace. Changes go into a new version.', 'CIOMS III/V'),
    Q('q12-6', 12, 'Who approves the CCDS?', ['The company (for example its labelling committee)', 'FDA', 'EMA', 'The WHO'], 0,
      'The CCDS is the company\'s own document. Agencies approve local labels.', 'CIOMS III/V'),

    Q('q13-1', 13, 'A CCSI statement is missing from the US label and no reason is recorded. What is it?', ['An unjustified deviation that must be fixed or justified', 'Acceptable, because US style differs', 'Only a problem if FDA asks', 'A Recent Major Change'], 0,
      'Every deviation from the CCSI needs a documented justification.', 'CIOMS III/V'),
    Q('q13-2', 13, 'Which is an acceptable deviation justification?', ['FDA did not accept the proposed wording in the 2025 review (letter on file)', 'The section was full', 'Not needed', 'We forgot'], 0,
      'A justification names a real reason that can be checked: an agency decision, a local requirement, an indication not approved.', 'CIOMS III/V'),
    Q('q13-3', 13, 'Does mapping require the label to repeat the CCDS word for word?', ['No, it must say the same thing in substance', 'Yes, always', 'Only for the boxed warning', 'Only in the Medication Guide'], 0,
      'Local labels follow local format and style; alignment is about meaning.', 'CIOMS III/V'),
    Q('q13-4', 13, 'A CCDS dosing statement covers an indication not approved in the US. How is it recorded?', ['Not applicable, with the reason', 'Aligned', 'Deleted from the CCDS', 'Left blank'], 0,
      '"Not applicable" still needs a reason, here that the indication is not approved in the market.', 'CIOMS III/V'),
    Q('q13-5', 13, 'Where might one CCDS warning appear in a US PLR label?', ['Highlights, section 5, section 17 and the Medication Guide', 'Only section 5', 'Only the carton', 'Only section 12'], 0,
      'A warning is summarised in Highlights, described in 5.x, used in counselling (17) and explained to patients in the Medication Guide.', '21 CFR 201.57'),
    Q('q13-6', 13, 'In this app, what happens if a CCSI statement is neither found nor justified?', ['An error blocks approval', 'Nothing', 'A warning that can be waived', 'The CCDS is changed automatically'], 0,
      'The CORE-MAP rule treats an unexplained CCSI gap as an error.', 'App rule CORE-MAP'),

    Q('q14-1', 14, 'After a 505(o)(4) notification, how long does the holder have to respond?', ['30 days', '15 days', '90 days', '6 months'], 0,
      'The holder must submit a supplement or a rebuttal within 30 days.', 'FD&C Act 505(o)(4); FDA guidance 2013'),
    Q('q14-2', 14, 'What are the two ways to respond to a 505(o)(4) notification?', ['A supplement with proposed changes, or a rebuttal giving reasons no change is warranted', 'A phone call or an email', 'A new NDA or an ANDA', 'A PSUR or a DSUR'], 0,
      'The statute allows a labelling supplement or a statement that the holder believes no change is warranted, with reasons.', 'FDA guidance 2013'),
    Q('q14-3', 14, 'If FDA disagrees with the response, how long can discussions last?', ['No more than 30 days', 'Up to a year', '15 days', 'There is no limit'], 0,
      'Discussions are limited to 30 days, after which FDA may order the change within 15 days.', 'FDA guidance 2013'),
    Q('q14-4', 14, 'Which route lets a holder strengthen a warning before FDA approves it?', ['A CBE-0 supplement under 21 CFR 314.70(c)(6)(iii)', 'An annual report', 'A prior approval supplement only', 'A new SPL listing only'], 0,
      'Changes that add or strengthen a warning can be made on submission of a Changes Being Effected supplement.', '21 CFR 314.70(c)(6)(iii)'),
    Q('q14-5', 14, 'An agency comment asks you to delete "superior efficacy" from section 14. Best response?', ['Accept and delete it, unless you have adequate head-to-head data in the application', 'Decline because marketing wants it', 'Move it to the Medication Guide', 'Ignore the comment'], 0,
      'Comparative claims need substantial evidence; labelling must not be promotional or misleading.', '21 CFR 201.56(a)(2)'),
    Q('q14-6', 14, 'What belongs in a response table for agency comments?', ['Each comment, the decision, the reason and where the text changed', 'Only the accepted comments', 'The reviewer\'s name and phone number', 'The artwork files'], 0,
      'A full response table lets the reviewer check every comment quickly.', 'FDA guidance 2013'),

    Q('q15-1', 15, 'When is a labelling change "implemented"?', ['When packs with the new labelling are being distributed', 'When the CCDS is approved', 'When the agency receives the submission', 'When the artwork is drafted'], 0,
      'Implementation means the new labelling is in use on product leaving the company.', 'Industry practice'),
    Q('q15-2', 15, 'Where does final US labelling go in the eCTD?', ['Module 1.14.2', 'Module 2.5', 'Module 3.2.P.7', 'Module 5.3.6'], 0,
      'Module 1.14 holds labelling: 1.14.1 draft, 1.14.2 final, 1.14.3 listed drug labelling.', 'FDA eCTD Module 1 headings'),
    Q('q15-3', 15, 'Why track a CCDS change per market?', ['Each market has its own submission, classification, review time and implementation date', 'Because the CCDS is different in each market', 'Only to report to the WHO', 'It is not needed'], 0,
      'One core change becomes many local changes, each on its own clock.', 'CIOMS III/V'),
    Q('q15-4', 15, 'In this app, the 90-day target to first shipment is…', ['A training default the company would set in its procedures', 'An FDA regulation', 'An EU regulation', 'An ICH guideline'], 0,
      'There is no single legal deadline; companies set their own targets. The app labels its defaults as such.', 'App note'),
    Q('q15-5', 15, 'Which file does this app hand to pharmacovigilance?', ['The current CCSI as reference safety information', 'The carton artwork', 'The SPL file', 'The certificate'], 0,
      'PV uses the CCSI to decide whether reactions are listed.', 'ICH E2C(R2)'),
    Q('q15-6', 15, 'What does "old stock out" record?', ['The date by which packs with the old labelling have left the company\'s control', 'The expiry date of the product', 'The approval date', 'The date the CCDS was drafted'], 0,
      'It closes the implementation: after it, only the new labelling is distributed.', 'Industry practice'),
    Q('q12-7', 12, 'Which CIOMS working group introduced core safety information?', ['CIOMS III', 'CIOMS I', 'CIOMS X', 'ICH E6'], 0, 'CIOMS III set out the idea of core safety information; CIOMS V developed it.', 'CIOMS Working Groups III and V'),
    Q('q12-8', 12, 'Which ICH guideline uses the CCSI as reference safety information in periodic reports?', ['ICH E2C(R2)', 'ICH Q9', 'ICH M4', 'ICH E9'], 0, 'The PBRER compares reactions against the reference safety information, usually the CCSI.', 'ICH E2C(R2)'),
    Q('q13-7', 13, 'The EU SmPC does not carry a CCDS statement because the EU agreed other wording. How is it mapped?', ['As a deviation with a justification', 'Ignored', 'The SmPC is changed to copy the CCDS', 'The CCDS is changed'], 0, 'Local labels may differ for regulatory reasons; the deviation is recorded and justified.', 'CIOMS Working Group III'),
    Q('q13-8', 13, "In this app, where must a statement's key terms appear for it to count as found?", ['In the sections the statement is mapped to', 'Anywhere in any label', 'In the title', 'On the carton'], 0, 'Each statement names its target sections for each kind of label.', 'Labelling Workbench core pack'),
    Q('q14-7', 14, 'What does a PRAC signal recommendation set?', ['The product information wording and a deadline to submit', 'Only a suggestion', 'A US labeling change', 'A price'], 0, 'PRAC recommendations give wording in all EU languages and a deadline for the variation.', 'EMA PRAC recommendations on signals'),
    Q('q14-8', 14, 'Which trigger in this app has a response clock set by statute?', ['A 505(o)(4) notification', 'A CCDS update', 'An RLD change', 'An internal signal'], 0, '505(o)(4) gives 30 days to respond; company targets are internal choices.', 'FD&C Act 505(o)(4)'),
    Q('q15-7', 15, 'Where does EU product information go in the eCTD?', ['Module 1.3.1', 'Module 1.14', 'Module 2.5', 'Module 3.2.P.7'], 0, '1.3.1 holds the SmPC, Annex II, labelling and package leaflet.', 'EU Module 1 specification'),
    Q('q15-8', 15, 'In US Module 1, what goes in 1.14.1?', ['Draft labeling', 'Final labeling', 'Listed drug labeling', 'Promotional material'], 0, '1.14.1 is draft labeling, 1.14.2 final labeling, 1.14.3 listed drug labeling.', 'FDA eCTD Module 1 specification'),
]

DRILLS = [
    {'id': 'ccds-map', 'module': 'core', 'title': 'Map the US label to the core data sheet', 'minutes': 20, 'sample': 'ostrevia-ccds', 'doc': 'pi', 'tab': 'core',
     'goal': {'type': 'ccds-map', 'docs': ['pi', 'mg']},
     'about': 'Map CCDS 3.0 to the Ostrevia prescribing information and Medication Guide. Confirm every match, and record a justification for each statement the label does not carry (two are missing on purpose).'},
    {'id': 'ccds-map-eu', 'module': 'core', 'title': 'Map the EU SmPC to the core data sheet', 'minutes': 20, 'sample': 'ostrevia-ccds-eu', 'doc': 'smpc', 'tab': 'core',
     'goal': {'type': 'ccds-map', 'docs': ['smpc', 'pl']},
     'about': 'Map CCDS 3.0 to the Ostrevia SmPC and package leaflet. The EU text words some statements differently and leaves some out: confirm the matches and justify the gaps.'},
    {'id': 'o4-respond', 'module': 'core', 'title': 'Respond to a 505(o)(4) notification', 'minutes': 30, 'sample': 'ostrevia-o4', 'doc': 'pi', 'tab': 'agency',
     'goal': {'type': 'o4'},
     'about': 'FDA has notified you of serious hypersensitivity reactions. Choose your response within the 30-day clock, draft the new warning, Highlights, 6.2, section 17 and Medication Guide text, submit, answer the agency comments and get the labelling agreed.'},
    {'id': 'ccds-rollout', 'module': 'core', 'capstone': True, 'title': 'Capstone: roll out a CCDS change to every market', 'minutes': 40, 'sample': 'ostrevia-ccds4', 'doc': 'pi', 'tab': 'core',
     'goal': {'type': 'rollout', 'key': 'wp-hbv'},
     'about': 'CCDS 4.0 adds hepatitis B reactivation. Make it effective, start the change request from the impact list with deadlines for the US, EU and India, update the US prescribing information (2.2 and section 5) and Medication Guide, map them to 4.0 with no gaps, approve both, and record the US approval and first shipment.'},
    {'id': 'pmi-write', 'module': 'core', 'title': 'Write a one-page PMI (proposed rule)', 'minutes': 25, 'sample': 'ostrevia-pmi', 'doc': 'pmi', 'tab': 'edit',
     'goal': {'type': 'pmi'},
     'about': 'Watch item: FDA\'s Patient Medication Information rule is still proposed. Write Ostrevia\'s PMI with the proposed headings, every boxed warning risk, "Use exactly as prescribed", no promotional words, on one page.'},
]

GLOSSARY = [
    {'term': 'Change request', 'def': 'In this app, a labelling change with its trigger, the markets it affects, their deadlines and the label versions it produces.'},
    {'term': 'Company Core Data Sheet (CCDS)', 'def': 'The company\'s global reference for a product\'s indications, dosing, safety and use. Local labels are written from it.'},
    {'term': 'Company Core Safety Information (CCSI)', 'def': 'The safety part of the CCDS; the reference safety information for periodic reports.'},
    {'term': 'Deviation register', 'def': 'The list of places where a local label differs from the CCDS, each with a justification.'},
    {'term': 'Implementation', 'def': 'The point when packs carrying the new labelling are being distributed.'},
    {'term': 'Labelling committee', 'def': 'The company group that decides changes to the CCDS.'},
    {'term': 'Listed / unlisted', 'def': 'Whether an adverse reaction is in the CCSI (listed) or not (unlisted), in periodic safety reports.'},
    {'term': 'Mapping', 'def': 'Finding where each CCDS statement appears in a local label and recording whether it is aligned, deviating or not applicable.'},
    {'term': 'Patient Medication Information (PMI)', 'def': 'A proposed one-page FDA patient sheet with fixed headings (proposed 2023, not final).'},
    {'term': 'Rebuttal', 'def': 'Under 505(o)(4), the holder\'s statement, with reasons, that no labelling change is warranted.'},
    {'term': 'Response table', 'def': 'A table of agency comments with the company\'s decision, reason and the resulting text change.'},
]
