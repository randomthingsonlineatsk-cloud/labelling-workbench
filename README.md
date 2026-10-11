# Labelling Workbench

A browser-based practice tool for writing and checking drug labels. Write prescribing information in PLR format, a Medication Guide, patient information, instructions for use and carton and container labels for fictional products. Then:

- run **37 rule checks**, each naming its regulation or guidance and saying where the app simplifies;
- compare a generic label with its **reference listed drug** and complete a **section viii carve-out**;
- convert an **older-format label to PLR**, block by block;
- **proof** a carton or container mock-up against the approved text;
- take a label through **author, reviewer and approver** sign-off with an append-only audit trail;
- export a watermarked **label PDF**, an **annotated label**, a **check report**, a **comparison report** and a **practice SPL-style XML** file;
- keep the labels in line with the **company core data sheet (CCDS)**: map every core statement, keep a **deviation register** with justifications, and see the **impact** of a new CCDS version;
- run **labelling change requests** with a deadline per market, the **505(o)(4) clock** (supplement or rebuttal), and an **implementation tracker** (approval, first shipment, old stock out);
- work through scripted **agency comment rounds** with a response table until the labelling is agreed;
- write a one-page **Patient Medication Information** sheet to the proposed rule (a Watch item);
- send labels to the **eCTD Dossier Builder** (a Module 1.14 labelling package), a change to the **Variations Classifier** (and its rollout back), and the **CCSI** to pharmacovigilance;
- run a **class**: set drills with due dates, collect and re-score submissions (classroom server shared with the other two apps);
- write **EU product information** to the QRD template (SmPC, package leaflet, outer carton, blister) with checks for headings, the black triangle, section 4.8, excipients, Braille and the safety features;
- run a simulated **user test** of a leaflet (the 16-of-20 rule), review a **translation** against a term base with a member state's linguistic comments, implement **PRAC** safety wording, and see a simplified **ePI** view;
- write an **Indian package insert** in the CDSCO format and the **carton and strip**, with checks for the Rule 96 particulars, the Rule 97 **red-box caution** and Rx/NRx/XRx symbol, the proper name two sizes larger than the brand, the **MRP** "inclusive of all taxes" and the **Schedule H2 QR code**, then implement a CDSCO directive.

Third app in a series with the [eCTD Dossier Builder](https://github.com/randomthingsonlineatsk-cloud/ectd-dossier-builder) and the [Variations Classifier](https://github.com/randomthingsonlineatsk-cloud/variations-classifier), using the same fictional products.

Live site: https://randomthingsonlineatsk-cloud.github.io/labelling-workbench/

**Training only.** Every product, company and person is fictional. Real regulation and guidance names are used so the practice is realistic; nothing here imitates an agency form or an approved label, exports carry a "Training use only" watermark, the XML is not validated SPL, and results are not regulatory advice.

## What is in this release (Phases 1 to 4)

**US pack 1.0.0, dated 2026-10-11.** Document kinds: PLR prescribing information, older-format prescribing information, Medication Guide, Patient Information (PPI), Instructions for Use, carton and container. Built from:

| Source | Used for |
|---|---|
| 21 CFR 201.56, 201.57 | PLR format: Highlights, contents, the 17 FPI sections, Boxed Warning, Recent Major Changes, PLLR (8.1 to 8.3) |
| 21 CFR 201.80 | Older-format labelling and the conversion exercise |
| 21 CFR 208 | Medication Guide headings and content |
| 21 CFR 201.1, 201.10, 201.17, 201.18, 201.25, 201.51, 201.100, 207.33 | Carton and container particulars, established-name prominence, net quantity, Rx only, barcode, NDC format |
| 21 CFR 314.94(a)(8), 314.127(a)(7); FD&C Act 505(j)(2)(A)(viii) | Generic labelling: same as the RLD, permitted differences, carve-outs |
| FDA guidance: Safety Considerations for Container Labels and Carton Labeling Design (May 2022) and the ISMP error-prone abbreviation list | Medication-error checks |
| FDA PLR, patient labelling, SPL and biosimilar labelling resources | Section guidance, patient labelling, practice XML |
| FDA proposed rule on Patient Medication Information (May 2023); Federal Register 2026-13346 | Watch item: taught, never required |

**Watch items** (taught in lessons, never flagged as errors): the one-page Patient Medication Information rule (still proposed), the 12-digit NDC, and biosimilar interchangeability statements.

**Samples:** a clean Ostrevia label set; the same set with about 25 planted errors; a Talmisartan generic to compare with its reference (Corvenza) and carve out; a Nelvaprox older-format label to convert; Brezovent patient labelling.

**Learning:** 11 lessons, a 76-question quiz bank, 7 drills (including the capstone: a safety signal taken through to approved labels), a glossary, a progress page and a certificate with a verification code.

**Core module 1.0.0, dated 2026-10-11.** The company core data sheet and change management, built from:

| Source | Used for |
|---|---|
| CIOMS Working Groups III and V, Core Clinical-Safety Information | CCDS and CCSI, mapping, deviations |
| ICH E2C(R2) | CCSI as reference safety information (listed and unlisted) |
| FDA guidance: Safety Labeling Changes, Implementation of Section 505(o)(4) (July 2013) | The 30-day response, discussions and orders |
| 21 CFR 314.70(c)(6)(iii) | CBE-0 for strengthening safety labelling |
| FDA eCTD Module 1 headings (1.14 Labeling) | Placement in the labelling package |
| FDA proposed rule on Patient Medication Information (2023) | The PMI template and checks (Watch) |

Company targets (30 days to submit a safety change, 90 for others, first shipment 90 days and old stock out 180 days after approval) are training defaults, the same as the Variations Classifier's, and the app says so wherever it shows them.

**Core samples:** Ostrevia mapped against CCDS 3.0 (with two deliberate gaps), Ostrevia rolling out CCDS 4.0 (hepatitis B reactivation), Ostrevia responding to a 505(o)(4) notification (hypersensitivity, with six scripted agency comments and a promotional sentence to remove), and a blank PMI to write.

**Core learning:** 4 lessons (12 to 15), 24 quiz questions, 4 drills (the capstone rolls a CCDS change out to every market) and a separate core certificate.

**EU pack 1.0.0, dated 2026-10-11.** Document kinds: SmPC (Annex I), package leaflet (Annex IIIB), outer carton and blister (Annex IIIA), for a centrally authorised product. Built from:

| Source | Used for |
|---|---|
| EMA QRD template v10.4 (February 2024) and annotated template | Headings, order, standard statements |
| SmPC guideline Rev. 2 (2009) | Section 4.8 frequency convention and content |
| Annex to the excipients guideline, Rev. 2 (2019, updated 2022) | Excipient statements in the SmPC, leaflet and carton |
| Readability guideline Rev. 1 (2009) and a national agency summary | User testing and the 16-of-20 standard |
| Regulation 1235/2010 and Implementing Regulation 198/2013 | Additional monitoring and the black triangle |
| Directive 2001/83/EC Articles 54 to 59, 56a, 57, 62 | Labelling particulars, Braille, blue box, no promotion |
| Delegated Regulation (EU) 2016/161 | Unique identifier and anti-tampering device |
| EMA linguistic review process; PRAC signal recommendations; PSUSA variation instructions | Translation review; PRAC and PSUSA triggers (C.3.a/b/c) |
| EMA ePI page (September 2026) | Watch item: the simplified ePI view |

**EU Watch items:** QRD version 11 and the key information section (consulted on in 2025), and ePI under the new EU legislation.

**EU samples:** Ostrevia's clean product information; the same set with about 20 planted errors; a jargon-heavy leaflet to user test; a French translation with three errors and linguistic review comments; a lactose reformulation (excipients); and the capstone, a PRAC signal recommendation on DRESS with a 60-day deadline.

**EU learning:** 9 lessons (16 to 24), 45 quiz questions, 7 drills and an EU certificate.

**India pack 1.0.0, dated 2026-10-11.** Document kinds: package insert (prescribing information), carton, and strip or container label, for a Schedule H new drug made under a manufacturing licence. Built from:

| Source | Used for |
|---|---|
| Drugs Rules, 1945, Rule 96 | Label particulars and their prefixes (B. No., Mfg. Lic. No., Mfg. Date, Exp. Date) |
| Drugs and Cosmetics (Fifth Amendment) Rules, 2018 (Rule 97) | Schedule G, H, H1 and X cautions in a red box; Rx, NRx and XRx symbols |
| Amendment in force 1 April 2019 | Proper name at least two font sizes larger than the brand name |
| Drugs (Eighth Amendment) Rules, 2022 (Schedule H2) | QR code with eight data elements on the top 300 brands |
| New Drugs and Clinical Trials Rules, 2019, and the package insert format of CDSCO-approved prescribing information | Insert headings 1 to 12, the RMP statement, permission number with date |
| Drugs (Prices Control) Order, 2013 | MRP inclusive of all taxes on the smallest retail pack |
| Schedule J | No claims to prevent or cure the listed diseases |

Where a check follows common practice rather than a rule text (the insert heading set, the RMP statement), its rule card says so.

**India Watch items:** Schedule H2 extended to vaccines, anti-cancer and NDPS drugs (2027) and antimicrobials (2028); excipient details in QR codes (amendment announced). Neither is checked as an error.

**India samples:** Ostrevia's clean insert, carton and strip; the same set with 14 planted errors (the pre-2018 schedule wording, a missing Rx, a brand name larger than the proper name, Rule 96 prefixes, the MRP wording, the permission date and more); and the capstone, a fictional CDSCO directive: tuberculosis screening wording, Schedule H2 inclusion and a revised ceiling price, within 30 days.

**India learning:** 5 lessons (25 to 29), 25 quiz questions, 3 drills and an India certificate.

**Classroom:** the shared Cloudflare Worker in the eCTD Dossier Builder repository serves this app under `/lw/v1` (`lw_` tables). Assignments are drills; students send the drill project, the instructor re-scores it in their own browser and comments. Email reminders use the same Brevo setup as the other apps.

## Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Engine and US pack: editor, checks, comparison and carve-outs, conversion, proof check, review and audit, exports, lessons, quiz, drills, certificate | Done |
| 2 | Company core data sheet, mapping and deviations, change requests and the 505(o)(4) path, implementation tracking, agency comment rounds, Module 1 labelling package for the eCTD Dossier Builder, exchange with the Variations Classifier, CCSI file, classroom on the shared Worker (/lw/v1), PMI one-page drill | Done |
| 3 | EU pack: QRD templates, 4.8 frequencies, excipients, black triangle, blue box, Braille, safety features, user-testing simulator, translations and linguistic review, PRAC and PSUSA triggers, ePI view | Done |
| 4 | India pack: package insert, carton and strip, Rules 96 and 97, schedule red boxes and symbols, proper-name size, Schedule H2 QR codes, MRP, CDSCO directive capstone | Done |
| 5 | Canada, Switzerland, Japan, Australia and WHO PQ packs | Planned |

## How it works

- `src/packs/<region>/`: a content pack (`us`, `eu`, `in`, and `core` for the CCDS and change-management module). All are merged at load; document kinds, rule ids and lesson ids are distinct, and each project names its region. `pack.json` holds the version, date, sources and Watch items; `templates.json` the document kinds; `rules.json` the rule cards; `vocab.json` controlled terms; `samples.json`, `lessons.json`, `quiz.json`, `drills.json` and `glossary.json` the practice content.
- `tools/packs/`: the Python generators that write each pack (`npm run pack`), so every rule and sample can be reviewed and rebuilt.
- `src/engine/`: checks, comparison and diff, conversion, drills, practice SPL, PDFs, storage and project files; `ccds.js` (mapping, deviations, impact), `changes.js` (change requests, 505(o)(4), tracker, the classifier exchange), `agency.js` (comment rounds), `handoff.js` (labelling package, CCSI file, eCTD project files), `classroom.js`, and for the EU `checks-eu.js` (QRD, excipients, labelling, translation review), `usertest.js` (the simulator) and `epi.js`, and for India `checks-in.js` (insert format, Rule 96 and 97, MRP, Schedule H2). No UI code.
- `src/screens/`: the app. Labels open in tabs: Edit, Preview, Checks, Review, Versions, Core data sheet, Changes, Export, plus Compare, Convert, Proof, Agency comments, User test and Translation review where they apply.

### Files exchanged with the other apps

| File | Kind | From → to |
|---|---|---|
| Labelling package | `labelling-workbench/labelling-package` | This app → eCTD Dossier Builder (Sequences: "Import labelling package") |
| CCDS change | `labelling-workbench/ccds-change` | This app → Variations Classifier (Labelling rollout: "Import a change from the Labelling Workbench") |
| Rollout | `variations-classifier/ccds-rollout` | Variations Classifier → this app (Changes: "Import rollout file") |
| CCSI | `labelling-workbench/ccsi` | This app → a pharmacovigilance app (reference safety information) |
| eCTD project | `ectd-dossier-builder/project` | eCTD Dossier Builder → this app (Projects: "From an eCTD project file"; US, EU and India projects) |

Not yet: an EU labelling package for Module 1.3.1, mapping EU documents to the CCDS, and comparing a generic SmPC with its reference.
- Work is saved in the browser (IndexedDB). Every record carries `userId` and `classId`, so classroom mode can be switched on without a migration. A project downloads and imports as one JSON file with its pack version and a checksum.

## Run it locally

```
npm install
npm test
npm run dev
```

`npm run build` writes the static site to `dist/`; it uses relative paths, so it works from any GitHub Pages path.

## Accessibility

Every control works from the keyboard, form fields have labels, check results are listed as text (colour is never the only signal), there is a light, dark and system theme, and every screen works at 360 px width.

## Licence

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

Built by Khan Gulrez Shagufa Fazal Ahmed.
