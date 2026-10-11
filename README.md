# Labelling Workbench

A browser-based practice tool for writing and checking drug labels. Write prescribing information in PLR format, a Medication Guide, patient information, instructions for use and carton and container labels for fictional products. Then:

- run **37 rule checks**, each naming its regulation or guidance and saying where the app simplifies;
- compare a generic label with its **reference listed drug** and complete a **section viii carve-out**;
- convert an **older-format label to PLR**, block by block;
- **proof** a carton or container mock-up against the approved text;
- take a label through **author, reviewer and approver** sign-off with an append-only audit trail;
- export a watermarked **label PDF**, an **annotated label**, a **check report**, a **comparison report** and a **practice SPL-style XML** file.

Third app in a series with the [eCTD Dossier Builder](https://github.com/randomthingsonlineatsk-cloud/ectd-dossier-builder) and the [Variations Classifier](https://github.com/randomthingsonlineatsk-cloud/variations-classifier), using the same fictional products.

Live site: https://randomthingsonlineatsk-cloud.github.io/labelling-workbench/

**Training only.** Every product, company and person is fictional. Real regulation and guidance names are used so the practice is realistic; nothing here imitates an agency form or an approved label, exports carry a "Training use only" watermark, the XML is not validated SPL, and results are not regulatory advice.

## What is in this release (Phase 1)

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

**Learning:** 11 lessons, a 76-question quiz bank, 7 drills (including the capstone: a safety signal taken through to approved labels), a 35-term glossary, a progress page and a certificate with a verification code.

## Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Engine and US pack: editor, checks, comparison and carve-outs, conversion, proof check, review and audit, exports, lessons, quiz, drills, certificate | Done |
| 2 | Company core data sheet, mapping and deviations, change requests and the 505(o)(4) path, implementation tracking, agency comment rounds, Module 1 labelling package for the eCTD Dossier Builder, classroom on the shared Worker (/lw/v1), PMI one-page drill | Next |
| 3 | EU pack: QRD templates, 4.8 frequencies, excipients, black triangle, blue box, Braille, safety features, user-testing simulator, translations | Planned |
| 4 | India pack: Rules 96 and 97, schedule warnings, package insert, Schedule H2 QR codes, price | Planned |
| 5 | Canada, Switzerland, Japan, Australia and WHO PQ packs | Planned |

## How it works

- `src/packs/<region>/`: a content pack. `pack.json` holds the version, date, sources and Watch items; `templates.json` the document kinds; `rules.json` the rule cards; `vocab.json` controlled terms; `samples.json`, `lessons.json`, `quiz.json`, `drills.json` and `glossary.json` the practice content.
- `tools/packs/`: the Python generators that write each pack (`npm run pack`), so every rule and sample can be reviewed and rebuilt.
- `src/engine/`: checks, comparison and diff, conversion, drills, practice SPL, PDFs, storage and project files. No UI code.
- `src/screens/`: the app. Labels open in tabs: Edit, Preview, Checks, Review, Versions, Export, plus Compare, Convert and Proof where they apply.
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
