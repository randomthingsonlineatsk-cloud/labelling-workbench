# Hand-off file formats

The Labelling Workbench exchanges plain JSON files with the other apps in the series. Every file
has a `kind` (what it is) and a `schema` number (its version). A reader refuses a file whose
`kind` it does not know, or whose `schema` is newer than it understands. Every file carries
`userId` and `classId` so the shared classroom can follow work between apps.

All content is fictional and for training. None of these files is a regulatory submission format.

| File | `kind` | Written by | Read by |
|---|---|---|---|
| Project file | `labelling-workbench/project` | This app (Download project file) | This app (import) |
| Drill submission | `labelling-workbench/drill-submission` | This app (Classroom) | This app (instructor re-score) |
| Labelling package | `labelling-workbench/labelling-package` | This app (Export, Changes) | eCTD Dossier Builder |
| CCDS change | `labelling-workbench/ccds-change` | This app (Changes) | Variations Classifier |
| Rollout | `variations-classifier/ccds-rollout` | Variations Classifier | This app (Changes) |
| CCSI | `labelling-workbench/ccsi` | This app (Export) | A pharmacovigilance app |
| Labelling signal | `pv-app/labelling-signal` | A pharmacovigilance app | This app (Changes) |
| eCTD project | `ectd-dossier-builder/project` | eCTD Dossier Builder | This app (Projects) |

## Labelling package (schema 1)

The labels of one project, each placed in the Module 1 node of the project's region. The eCTD
Dossier Builder adds them to the selected draft sequence, or starts a new sequence of the given
submission type.

```json
{
  "kind": "labelling-workbench/labelling-package", "schema": 1, "createdAt": "2026-10-17T00:00:00Z",
  "userId": "u-…", "classId": null, "projectId": "p-…",
  "region": "US | EU | IN | CA | CH | JP",
  "product": { "id": "nce-tablet", "ectdProductId": "nce-tablet", "brandName": "Ostrevia", "inn": "lumiravostat" },
  "pack": { "id": "us", "version": "1.1.0", "asOf": "2026-10-17" },
  "submission": { "submissionType": "labeling-supplement", "subType": "application", "description": "…", "trigger": "o4", "o4": null },
  "documents": [
    { "id": "d-…", "kind": "pi", "role": null, "status": "draft", "version": 1, "section": "1.14.1.3",
      "title": "Ostrevia Prescribing information (draft)", "fileName": "ostrevia-prescribing-information-draft.pdf",
      "pages": 9, "lang": "en", "content": "plain text of the label (first 20,000 characters)" }
  ]
}
```

Placement by region:

| Region | Node | Default submission type |
|---|---|---|
| US | 1.14.1 draft, 1.14.2 final, 1.14.3 listed drug (annotated draft in 1.14.1.2) | `labeling-supplement` |
| EU | `eu:1.3.1`, one combined SmPC, Annex II, labelling and leaflet document per language | `var-type2` |
| India | `in:1.3` | `post-approval-change` |
| Canada | `ca:1.3.1` product monograph and patient information, `ca:1.3.2` labels | `snds` |
| Switzerland | `ch:1.3.1` information for professionals, `ch:1.3.2` patient information | `var-type2` |
| Japan | `jp:1.8` package insert (the app's insert is an English practice text) | `jp_partial-change` |

## CCDS change (schema 1) and rollout (schema 1)

A change request goes to the Variations Classifier as a prefilled change; the classification
comes back as a rollout file that updates the markets of the same change.

```json
{ "kind": "labelling-workbench/ccds-change", "schema": 1, "changeId": "c-…", "projectId": "p-…",
  "product": { "id": "nce-tablet", "brandName": "Ostrevia", "inn": "lumiravostat" },
  "ccds": { "version": "4.0", "date": "2026-10-01", "kind": "warning", "text": "…" },
  "trigger": "ccds", "regions": ["us", "eu", "in"],
  "status": { "us": { "step": 1, "dates": { "Wording drafted": "2026-10-03" } } } }
```

```json
{ "kind": "variations-classifier/ccds-rollout", "schema": 1, "changeId": "c-…",
  "regions": [ { "region": "eu", "classification": "Type II, C.I.4", "step": 2, "dates": { "Submitted": "2026-10-20" } } ] }
```

Steps: 0 not started, 1 wording drafted, 2 submitted, 3 approved, 4 implemented.

## CCSI (schema 1)

The core safety statements of the effective CCDS version, for deciding whether a reaction is
listed.

```json
{ "kind": "labelling-workbench/ccsi", "schema": 1, "product": { "id": "nce-tablet", "brandName": "Ostrevia", "inn": "lumiravostat" },
  "ccds": { "version": "3.0", "effective": "2026-08-03", "owner": "…" },
  "statements": [ { "key": "wp-inf", "heading": "Special warnings and precautions", "text": "…" } ],
  "use": "Reference safety information: an adverse reaction in these statements is listed; one that is not is unlisted." }
```

## Labelling signal (schema 1)

A validated signal from a pharmacovigilance app becomes a change request here (Changes, New
change request, Fill from a signal file). Only `kind`, `signal.title` and
`signal.proposedWording` are required.

```json
{ "kind": "pv-app/labelling-signal", "schema": 1,
  "product": { "inn": "lumiravostat" },
  "signal": {
    "title": "Interstitial lung disease",
    "kind": "warning",
    "validatedOn": "2026-10-10",
    "proposedWording": "Interstitial lung disease, including fatal cases, has been reported…",
    "evidence": "14 cases in the safety database; disproportionality ROR 4.2 (fictional)",
    "markets": ["us", "eu"]
  } }
```

`kind` takes the change kinds of the core pack (`adr`, `warning`, `contra`, `dosing`,
`indication`, `editorial`). `markets` takes the market ids of the core pack (`us`, `eu`, `in`, `ca`, `ch`,
`jp`, `au`, `who`).
