"""Phase 5 samples. Ostrevia (lumiravostat) tablets in Canada, Switzerland, Japan and Australia,
and Malvaren (arterolin and lumexantine) dispersible tablets, a fictional antimalarial
prequalified by WHO. Numbers, holders and dates are invented."""
import copy
from lib import P, UL, T, BOX, sec, sub
from intl_core import (CA_PM_TITLE, CA_PMI_READ, CA_PMI_OD, CA_PMI_REPORT, CH_BT_FI, CH_BT_PI, CH_REPORT, CH_PI_HEADER, JP_RX, AU_BT_PI, AU_BT_CMI, AU_SUM_INTRO, AU_CMI_REPORT, AU_PIC, WHO_INTRO)

# ---------------------------------------------------------------- shared Ostrevia facts
IND = 'adults with moderate to severe chronic hand eczema that has not responded adequately to potent topical corticosteroids, or when these are not advisable'
DOSE = 'The recommended dose is 10 mg once daily, with or without food. The dose may be increased to 25 mg once daily if the response is inadequate after 12 weeks.'
HEP = 'Moderate hepatic impairment: 10 mg once daily. Severe hepatic impairment: not recommended.'
CYP = 'With strong CYP3A4 inhibitors (for example ketoconazole or clarithromycin): 10 mg once daily.'
INF = 'Serious infections, including tuberculosis, pneumonia, cellulitis and herpes zoster, have been reported, some leading to hospitalization or death. Screen patients for latent tuberculosis before starting treatment and treat it first. Interrupt treatment if a serious infection develops.'
MAL = 'Malignancy, including lymphoma and non-melanoma skin cancer, has been reported. Consider the risks and benefits before starting treatment in patients with a known malignancy.'
VTE = 'Venous thromboembolism, including deep vein thrombosis and pulmonary embolism, has been reported. Use with caution in patients with risk factors and stop treatment if it occurs.'
LAB = 'Monitor lymphocyte and neutrophil counts, haemoglobin and liver enzymes at baseline, at 4 weeks and every 3 months.'
INTER = 'Strong CYP3A4 inhibitors increase lumiravostat exposure (use 10 mg once daily). Strong CYP3A4 inducers, such as rifampicin, reduce exposure; avoid concomitant use.'
PREG = 'Lumiravostat caused embryo-fetal toxicity in rats and rabbits. It is contraindicated in pregnancy. Women of childbearing potential should use effective contraception during treatment and for 4 weeks after the last dose.'
LACT = 'It is not known whether lumiravostat passes into human milk. Do not breastfeed during treatment and for 4 days after the last dose.'
AR = [('Very common', 'nasopharyngitis'), ('Common', 'headache, nausea, acne, herpes zoster, lymphopenia, neutropenia, alanine aminotransferase increased'), ('Uncommon', 'pneumonia, cellulitis, deep vein thrombosis, pulmonary embolism')]
OD = 'There is no specific antidote. Monitor the patient for signs of adverse reactions and give supportive treatment. Lumiravostat is not removed by haemodialysis to a meaningful extent.'
MOA = 'Lumiravostat is a reversible inhibitor of the fictional STRK1 kinase, which signals downstream of several cytokines involved in skin inflammation.'
PD = 'Dose-dependent reductions in markers of skin inflammation were seen within 2 weeks.'
PK = 'Peak plasma concentrations are reached 1 to 2 hours after a dose. The half-life is about 16 hours. Lumiravostat is metabolised mainly by CYP3A4.'
TOX = 'Lumiravostat was not genotoxic. Embryo-fetal toxicity was seen in rats and rabbits at exposures close to the human exposure at 25 mg.'
EXC = 'microcrystalline cellulose, mannitol, croscarmellose sodium, magnesium stearate; film coat: hypromellose, titanium dioxide, macrogol (25 mg tablets also iron oxide yellow)'
DESC10 = '10 mg: white, round, film-coated tablets debossed "HR" on one side and "10" on the other.'
DESC25 = '25 mg: yellow, oval, film-coated tablets debossed "HR" on one side and "25" on the other.'
TRIAL = 'In two 16-week placebo-controlled studies (fictional HANDS-1 and HANDS-2, 1,210 adults), 38% of patients on lumiravostat 25 mg and 31% on 10 mg reached clear or almost clear hands, against 12% on placebo.'


def ar_table():
    return T(('Frequency', 'Adverse reactions'), *AR)


# ---------------------------------------------------------------- Canada
CA_META = {'proprietaryName': 'OSTREVIA', 'establishedName': 'lumiravostat', 'dosageForm': 'tablets', 'route': 'oral', 'strengths': ['10 mg', '25 mg'],
           'manufacturer': 'Halcyon Ridge Pharmaceuticals Canada ULC, 200 Maple Crescent, Suite 4, Fictionton, ON A1A 1A1', 'scheduleSymbol': 'Pr', 'revised': '2026-08-20',
           'controlNo': '299999', 'swp': True, 'lang': 'en'}

CA_PM = {
    'id': 'pm', 'kind': 'ca-pm', 'title': 'Product monograph', 'status': 'approved', 'meta': dict(CA_META), 'fixed': {'title': CA_PM_TITLE},
    'sections': [
        sec('rmlc', 'RECENT MAJOR LABEL CHANGES', T(('Section', 'Date'), ('7 WARNINGS AND PRECAUTIONS, Hepatic/Biliary/Pancreatic', '2026-08'))),
        sec('1', 'INDICATIONS', P(f'OSTREVIA (lumiravostat) is indicated for the treatment of {IND}.'), subs=[
            sub('1.1', 'Pediatrics', P('Pediatrics (< 18 years of age): No data are available to Health Canada; therefore, Health Canada has not authorized an indication for pediatric use.')),
            sub('1.2', 'Geriatrics', P('Geriatrics (≥ 65 years of age): Clinical studies included too few patients aged 65 and over to determine whether they respond differently. Use with caution.'))]),
        sec('2', 'CONTRAINDICATIONS', UL('Patients who are hypersensitive to lumiravostat or to any ingredient in the formulation, including any non-medicinal ingredient. For a complete listing, see 6 DOSAGE FORMS, STRENGTHS, COMPOSITION, AND PACKAGING.', 'Patients with active tuberculosis or an active serious infection.', 'Pregnancy.')),
        sec('3', 'SERIOUS WARNINGS AND PRECAUTIONS BOX', BOX('Serious Warnings and Precautions\n• Serious infections leading to hospitalization or death, including tuberculosis, have occurred (see 7 WARNINGS AND PRECAUTIONS, Immune).\n• Malignancies, including lymphoma, have occurred (see 7 WARNINGS AND PRECAUTIONS, Carcinogenesis and Genotoxicity).\n• Thrombosis, including pulmonary embolism, has occurred (see 7 WARNINGS AND PRECAUTIONS, Hematologic).')),
        sec('4', 'DOSAGE AND ADMINISTRATION', subs=[
            sub('4.1', 'Dosing Considerations', P('Screen for latent tuberculosis and check blood counts and liver enzymes before starting treatment (see 7 WARNINGS AND PRECAUTIONS).')),
            sub('4.2', 'Recommended Dose and Dosage Adjustment', P(DOSE), P(HEP), P(CYP), P('Renal impairment: no dose adjustment.')),
            sub('4.4', 'Administration', P('Swallow tablets whole with water, with or without food.')),
            sub('4.5', 'Missed Dose', P('If a dose is missed, take it as soon as possible unless the next dose is due within 12 hours. Do not take two doses at once.'))]),
        sec('5', 'OVERDOSE', P(OD), P('For management of a suspected drug overdose, contact your regional poison control centre.')),
        sec('6', 'DOSAGE FORMS, STRENGTHS, COMPOSITION, AND PACKAGING', T(('Route', 'Dosage form / strength', 'Non-medicinal ingredients'), ('Oral', 'Tablet, film-coated, 10 mg and 25 mg', EXC)), P(DESC10), P(DESC25), P('Blister packs of 30 tablets (3 x 10).')),
        sec('7', 'WARNINGS AND PRECAUTIONS', P('Please see 3 SERIOUS WARNINGS AND PRECAUTIONS BOX.'),
            P('Carcinogenesis and Genotoxicity: ' + MAL), P('Hematologic: ' + VTE), P('Hepatic/Biliary/Pancreatic: Elevations of liver enzymes have occurred. Interrupt treatment if drug-induced liver injury is suspected.'),
            P('Immune: ' + INF), P('Monitoring and Laboratory Tests: ' + LAB), subs=[
                sub('7.1.1', 'Pregnancy', P(PREG)), sub('7.1.2', 'Breastfeeding', P(LACT)),
                sub('7.1.3', 'Pediatrics', P('Safety and efficacy have not been established.')), sub('7.1.4', 'Geriatrics', P('Infections were more frequent in patients aged 65 and over.'))]),
        sec('8', 'ADVERSE REACTIONS', subs=[
            sub('8.1', 'Adverse Reaction Overview', P('The most common adverse reactions (≥ 10%) were nasopharyngitis. Serious infections, malignancy and thrombosis are described in 7 WARNINGS AND PRECAUTIONS.')),
            sub('8.2', 'Clinical Trial Adverse Reactions', P('Clinical trials are conducted under very specific conditions. The adverse reaction rates observed in the clinical trials, therefore, may not reflect the rates observed in practice and should not be compared to the rates in the clinical trials of another drug.'), ar_table()),
            sub('8.3', 'Less Common Clinical Trial Adverse Reactions', P('Infections: pneumonia, cellulitis. Vascular: deep vein thrombosis, pulmonary embolism.')),
            sub('8.5', 'Post-Market Adverse Reactions', P('Hypersensitivity reactions, including angioedema, have been reported.'))]),
        sec('9', 'DRUG INTERACTIONS', subs=[
            sub('9.2', 'Drug Interactions Overview', P('Lumiravostat is metabolised mainly by CYP3A4.')),
            sub('9.4', 'Drug-Drug Interactions', P(INTER)),
            sub('9.5', 'Drug-Food Interactions', P('Food does not affect exposure to a clinically relevant extent.')),
            sub('9.6', 'Drug-Herb Interactions', P("St. John's wort is a CYP3A4 inducer and may reduce exposure; avoid.")),
            sub('9.7', 'Drug-Laboratory Test Interactions', P('Interactions with laboratory tests have not been established.'))]),
        sec('10', 'CLINICAL PHARMACOLOGY', subs=[sub('10.1', 'Mechanism of Action', P(MOA)), sub('10.2', 'Pharmacodynamics', P(PD)), sub('10.3', 'Pharmacokinetics', P(PK))]),
        sec('11', 'STORAGE, STABILITY, AND DISPOSAL', P('Store at 15°C to 30°C. Keep in the original package to protect from moisture. Keep out of reach and sight of children.')),
        sec('13', 'PHARMACEUTICAL INFORMATION', P('Proper name: lumiravostat. Molecular formula and mass: fictional. Physicochemical properties: white to off-white powder, slightly soluble in water.')),
        sec('14', 'CLINICAL TRIALS', subs=[sub('14.1', 'Clinical Trials by Indication', P(TRIAL))]),
        sec('16', 'NON-CLINICAL TOXICOLOGY', P(TOX)),
    ],
}


CA_PMI = {
    'id': 'pmi', 'kind': 'ca-pmi', 'title': 'Patient Medication Information', 'status': 'approved', 'meta': dict(CA_META), 'fixed': {'readThis': CA_PMI_READ},
    'sections': [
        sec('m0', 'Serious warnings and precautions', BOX('Serious Warnings and Precautions\n• Serious infections: OSTREVIA can lower your ability to fight infections. Some infections, including tuberculosis, have led to hospital stays or death.\n• Cancer: some people taking OSTREVIA have had cancers, including lymphoma.\n• Blood clots: blood clots in the legs or lungs have happened and can be life-threatening.')),
        sec('m1', 'What OSTREVIA is used for', P('OSTREVIA is used in adults to treat moderate to severe hand eczema that has not got better with strong steroid creams, or when those creams are not suitable.')),
        sec('m2', 'How OSTREVIA works', P('OSTREVIA blocks a protein in the body that drives inflammation in the skin. This helps reduce redness, itching and cracking.')),
        sec('m3', 'The ingredients in OSTREVIA are', P('Medicinal ingredient: lumiravostat.'), P('Non-medicinal ingredients: ' + EXC + '.')),
        sec('m4', 'OSTREVIA comes in the following dosage forms', P('Tablets: 10 mg and 25 mg.')),
        sec('m5', 'Do not use OSTREVIA if', UL('you are allergic to lumiravostat or any other ingredient in OSTREVIA', 'you have active tuberculosis or another serious infection', 'you are pregnant')),
        sec('m6', 'To help avoid side effects and ensure proper use, talk to your healthcare professional before you take OSTREVIA', P('Talk about any health conditions or problems you may have, including if you:'), UL('have an infection, or keep getting infections', 'have had tuberculosis or been in close contact with someone who has it', 'have had cancer', 'have had a blood clot', 'have liver problems')),
        sec('m8', 'Tell your healthcare professional about all the medicines you take', P('This includes any drugs, vitamins, minerals, natural supplements or alternative medicines.')),
        sec('m9', 'The following may interact with OSTREVIA', UL('medicines for fungal infections such as ketoconazole', 'antibiotics such as clarithromycin', 'rifampicin, a tuberculosis medicine', "St. John's wort")),
        sec('m10', 'How to take OSTREVIA', P('Take OSTREVIA exactly as your healthcare professional tells you. Swallow the tablet whole with water, with or without food.')),
        sec('m11', 'Usual dose', P('Adults: one 10 mg tablet once a day. Your healthcare professional may increase this to 25 mg once a day after 12 weeks.')),
        sec('m12', 'Overdose', BOX(CA_PMI_OD.replace('{name}', 'OSTREVIA'))),
        sec('m13', 'Missed dose', P('If you miss a dose, take it as soon as you remember. If your next dose is due within 12 hours, skip the missed dose. Do not take two doses at once.')),
        sec('m14', 'Possible side effects from using OSTREVIA', P('These are not all the possible side effects. If you have any side effects not listed here, tell your healthcare professional.'), UL('runny or stuffy nose, sore throat', 'headache', 'feeling sick', 'acne')),
        sec('m15', 'Serious side effects and what to do about them', T(('Symptom or effect', 'What to do'), ('Infection: fever, cough, chills, burning when you pass urine', 'Talk to your healthcare professional'), ('Blood clot: swelling or pain in one leg, sudden chest pain or shortness of breath', 'Stop taking the drug and get immediate medical help'))),
        sec('m16', 'Reporting side effects', P(CA_PMI_REPORT)),
        sec('m17', 'Storage', P('Store at 15°C to 30°C in the original package to protect from moisture. Keep out of reach and sight of children.')),
        sec('m18', 'If you want more information about OSTREVIA', P('Talk to your healthcare professional. Find the full product monograph on the Health Canada website or the sponsor website (www.halcyonridge.example/ca), or call 1-800-555-0199.'), P('This leaflet was prepared by Halcyon Ridge Pharmaceuticals Canada ULC (fictional).')),
    ],
}


def ca_label(proper=9):
    return {
        'id': 'carton-10', 'kind': 'ca-label', 'title': 'Outer label, 10 mg, 30 tablets', 'status': 'approved', 'meta': {**CA_META, 'strengths': ['10 mg'], 'sizes': {'brand': 16, 'proper': proper}}, 'fixed': {},
        'sections': [
            sec('l1', 'Scheduling symbol (Pr)', P('Pr')),
            sec('l2', 'Brand name', P('OSTREVIA')),
            sec('l3', 'Proper name', P('lumiravostat tablets / comprimés de lumiravostat')),
            sec('l4', 'Strength', P('10 mg')),
            sec('l5', 'Dosage form', P('Film-coated tablets / Comprimés pelliculés')),
            sec('l6', 'Drug identification number (DIN)', P('DIN 09990101')),
            sec('l7', 'Net amount', P('30 tablets / 30 comprimés')),
            sec('l8', 'Directions for use', P('Dosage: see the product monograph. / Posologie : voir la monographie de produit.')),
            sec('l9', 'Medicinal ingredients (quantitative)', P('Each tablet contains 10 mg lumiravostat. / Chaque comprimé contient 10 mg de lumiravostat.')),
            sec('l10', 'Storage', P('Store at 15°C to 30°C. Protect from moisture. / Conserver entre 15 °C et 30 °C. Protéger de l’humidité.')),
            sec('l11', 'Lot number', P('Lot: XXXXXX')),
            sec('l12', 'Expiry date', P('EXP: YYYY-MM')),
            sec('l13', 'Sponsor or manufacturer (name and address)', P('Halcyon Ridge Pharmaceuticals Canada ULC, 200 Maple Crescent, Suite 4, Fictionton, ON A1A 1A1')),
            sec('l14', 'Contact and side-effect reporting statement', P('Questions or to report side effects: 1-800-555-0199 or www.halcyonridge.example/ca. / Pour des questions ou pour signaler des effets secondaires : 1-800-555-0199.')),
        ],
    }


CA_LABEL = ca_label()

# ---------------------------------------------------------------- Switzerland
CH_META = {'proprietaryName': 'Ostrevia', 'establishedName': 'lumiravostat', 'dosageForm': 'Filmtabletten', 'route': 'oral', 'strengths': ['10 mg', '25 mg'],
           'manufacturer': 'Halcyon Ridge Pharma (Schweiz) AG, Beispielstadt', 'additionalMonitoring': True, 'authNumber': '99101', 'lang': 'de'}

CH_FI = {
    'id': 'fi', 'kind': 'ch-fi', 'title': 'Fachinformation', 'status': 'approved', 'meta': dict(CH_META), 'fixed': {'blackTriangle': '▼ ' + CH_BT_FI},
    'sections': [
        sec('f1', 'Zusammensetzung', subs=[sub('f1.1', 'Wirkstoffe', P('Lumiravostat.')), sub('f1.2', 'Hilfsstoffe', P('Tablet core: ' + EXC + '. Each tablet contains less than 1 mmol (23 mg) sodium.'))]),
        sec('f2', 'Darreichungsform und Wirkstoffmenge pro Einheit', P('Film-coated tablets of 10 mg and 25 mg lumiravostat.'), P(DESC10), P(DESC25)),
        sec('f3', 'Indikationen/Anwendungsmöglichkeiten', P(f'Treatment of {IND}.')),
        sec('f4', 'Dosierung/Anwendung', P(DOSE), P(HEP), P(CYP), P('Children and adolescents: safety and efficacy have not been established.')),
        sec('f5', 'Kontraindikationen', P('Hypersensitivity to the active substance or to any excipient. Active tuberculosis or active serious infection. Pregnancy.')),
        sec('f6', 'Warnhinweise und Vorsichtsmassnahmen', P(INF), P(MAL), P(VTE), P(LAB)),
        sec('f7', 'Interaktionen', P(INTER)),
        sec('f8', 'Schwangerschaft, Stillzeit', P(PREG), P(LACT)),
        sec('f9', 'Wirkung auf die Fahrtüchtigkeit und auf das Bedienen von Maschinen', P('No corresponding studies have been performed. Lumiravostat is not expected to affect the ability to drive.')),
        sec('f10', 'Unerwünschte Wirkungen', P('Adverse reactions are listed by frequency: very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100).'), ar_table(), P(CH_REPORT)),
        sec('f11', 'Überdosierung', P(OD)),
        sec('f12', 'Eigenschaften/Wirkungen', P('ATC code: not yet assigned (fictional substance).'), P(MOA), P(PD), P(TRIAL)),
        sec('f13', 'Pharmakokinetik', P(PK)),
        sec('f14', 'Präklinische Daten', P(TOX)),
        sec('f15', 'Sonstige Hinweise', P('Shelf life: do not use after the expiry date (EXP) on the pack. Storage: do not store above 30°C; store in the original package to protect from moisture; keep out of the reach of children.')),
        sec('f16', 'Zulassungsnummer', P('99101 (Swissmedic)')),
        sec('f17', 'Packungen', P('Ostrevia 10 mg: 30 film-coated tablets [B]. Ostrevia 25 mg: 30 film-coated tablets [B].'), P('Abgabekategorie B')),
        sec('f18', 'Zulassungsinhaberin', P('Halcyon Ridge Pharma (Schweiz) AG, Beispielstadt')),
        sec('f19', 'Stand der Information', P('August 2026')),
    ],
}

CH_PI = {
    'id': 'pi', 'kind': 'ch-pi', 'title': 'Patienteninformation', 'status': 'approved', 'meta': dict(CH_META),
    'fixed': {'header': CH_PI_HEADER, 'blackTriangle': '▼ ' + CH_BT_PI, 'lastChecked': 'Diese Packungsbeilage wurde im August 2026 letztmals durch die Arzneimittelbehörde (Swissmedic) geprüft.'},
    'sections': [
        sec('p1', 'Was ist Ostrevia und wann wird es angewendet?', P('Ostrevia contains lumiravostat. It calms the immune activity that causes long-lasting hand eczema. Your doctor prescribes it when creams have not helped enough.')),
        sec('p3', 'Wann darf Ostrevia nicht eingenommen werden?', P('If you are allergic to lumiravostat or any of the other ingredients, if you have active tuberculosis or another serious infection, or if you are pregnant.')),
        sec('p4', 'Wann ist bei der Einnahme von Ostrevia Vorsicht geboten?', P('Ostrevia can lower your ability to fight infections. Your doctor will test you for tuberculosis before you start. Tell your doctor straight away if you have a fever, cough, a painful swollen leg, chest pain or breathlessness. Tell your doctor about all other medicines you take.')),
        sec('p5', 'Darf Ostrevia während einer Schwangerschaft oder in der Stillzeit eingenommen werden?', P('No. Use effective contraception during treatment and for 4 weeks after the last tablet. Do not breastfeed during treatment and for 4 days after the last tablet.')),
        sec('p6', 'Wie verwenden Sie Ostrevia?', P('Take one tablet once a day, with or without food. Your doctor may raise the dose after 12 weeks. Do not change the dose yourself.')),
        sec('p7', 'Welche Nebenwirkungen kann Ostrevia haben?', P('Very common (more than 1 in 10 users): cold symptoms. Common: headache, nausea, acne, shingles, changes in blood tests. Uncommon: pneumonia, skin infection, blood clots.'), P('If you notice side effects, tell your doctor or pharmacist, also if they are not listed here.')),
        sec('p8', 'Was ist ferner zu beachten?', P('Do not store above 30°C. Store in the original package. Keep out of the reach of children. Do not use after the date marked EXP.')),
        sec('p9', 'Was ist in Ostrevia enthalten?', P('Active substance: lumiravostat 10 mg or 25 mg. Other ingredients: ' + EXC + '.')),
        sec('p10', 'Zulassungsnummer', P('99101 (Swissmedic)')),
        sec('p11', 'Wo erhalten Sie Ostrevia? Welche Packungen sind erhältlich?', P('In pharmacies, on a doctor’s prescription only. Packs of 30 film-coated tablets of 10 mg and 25 mg.'), P('Abgabekategorie B')),
        sec('p12', 'Zulassungsinhaberin', P('Halcyon Ridge Pharma (Schweiz) AG, Beispielstadt')),
    ],
}

# ---------------------------------------------------------------- Japan
JP_META = {'proprietaryName': 'OSTREVIA Tablets 10 mg / 25 mg', 'establishedName': 'lumiravostat', 'dosageForm': 'film-coated tablets', 'route': 'oral', 'strengths': ['10 mg', '25 mg'],
           'manufacturer': 'Halcyon Ridge Japan K.K.', 'warnings': True, 'lang': 'en'}
JP_FIXED = {'revised': 'Revised: August 2026 (2nd version)', 'commodity': '873999', 'approval': '10 mg: 30500AMX00101000; 25 mg: 30500AMX00102000. Initial marketing in Japan: May 2024',
            'storage': 'Storage: store at room temperature. Shelf life: 36 months.', 'category': 'STRK1 inhibitor (fictional); agent for chronic hand eczema', 'regulatory': 'Powerful drug; ' + JP_RX}

JP_PI = {
    'id': 'pi', 'kind': 'jp-pi', 'title': 'Package insert (English practice text)', 'status': 'approved', 'meta': dict(JP_META), 'fixed': dict(JP_FIXED),
    'sections': [
        sec('1', 'WARNINGS', BOX('1.1 Serious infections, including tuberculosis and pneumonia, some fatal, and malignancies have been reported. Use only under a physician with sufficient knowledge and experience of the treatment of hand eczema and of this drug, after explaining its risks to the patient.\n1.2 Before treatment, check for tuberculosis by interview, an interferon-gamma release assay or tuberculin test, and a chest X-ray. [See 2.2, 8.1, 9.1.1.]')),
        sec('2', 'CONTRAINDICATIONS', UL('2.1 Patients with a history of hypersensitivity to any ingredient of this drug',
                                        '2.2 Patients with serious infections, including active tuberculosis [Symptoms may worsen. See 1.1, 8.1, 9.1.1.]',
                                        '2.3 Pregnant women or women who may be pregnant [See 9.5.]')),
        sec('3', 'COMPOSITION AND PRODUCT DESCRIPTION', subs=[
            sub('3.1', 'Composition', T(('Brand name', 'OSTREVIA Tablets 10 mg', 'OSTREVIA Tablets 25 mg'), ('Active ingredient (per tablet)', 'Lumiravostat 10 mg', 'Lumiravostat 25 mg'), ('Additives', EXC, EXC))),
            sub('3.2', 'Product Description', P(DESC10), P(DESC25))]),
        sec('4', 'INDICATIONS', P('Chronic hand eczema in adults that has not responded adequately to existing treatment')),
        sec('6', 'DOSAGE AND ADMINISTRATION', P('The usual adult dosage is 10 mg of lumiravostat administered orally once daily. The dose may be increased to 25 mg once daily depending on the patient’s condition.')),
        sec('8', 'IMPORTANT PRECAUTIONS', P('8.1 Serious infections may occur. Monitor patients carefully and instruct them to contact a physician promptly if fever, cough or fatigue occurs.'),
            P('8.2 Measure lymphocyte and neutrophil counts, haemoglobin and liver enzymes before treatment, at 4 weeks and every 3 months thereafter.')),
        sec('9', 'PRECAUTIONS CONCERNING PATIENTS WITH SPECIFIC BACKGROUNDS', subs=[
            sub('9.1', 'Patients with Complication or History of Diseases, etc.', P('9.1.1 Patients with a history of tuberculosis or with findings suggesting tuberculosis: tuberculosis may reactivate.'), P('9.1.2 Patients with risk factors for venous thromboembolism.')),
            sub('9.3', 'Patients with Hepatic Impairment', P('9.3.1 Patients with severe hepatic impairment: not studied; administration is not recommended.')),
            sub('9.4', 'Persons with Reproductive Potential', P('Instruct women of childbearing potential to use effective contraception during treatment and for 4 weeks after the last dose.')),
            sub('9.5', 'Pregnant Women', P('Do not administer. Embryo-fetal toxicity was observed in rats and rabbits.')),
            sub('9.6', 'Breast-feeding Women', P('Advise women not to breastfeed during treatment and for 4 days after the last dose.')),
            sub('9.7', 'Pediatric Use', P('No clinical studies have been conducted in children.')),
            sub('9.8', 'Geriatric Use', P('Administer with care while monitoring the patient. Infections occurred more often in elderly patients.'))]),
        sec('10', 'INTERACTIONS', P('Lumiravostat is metabolised mainly by CYP3A4.'), subs=[sub('10.2', 'Precautions for Co-administration', T(('Drugs', 'Signs, symptoms and treatment', 'Mechanism and risk factors'), ('Strong CYP3A4 inhibitors (ketoconazole, clarithromycin, etc.)', 'Use 10 mg once daily.', 'Exposure to this drug increases.'), ('CYP3A4 inducers (rifampicin, etc.)', 'Avoid co-administration.', 'Exposure to this drug decreases.')))]),
        sec('11', 'ADVERSE REACTIONS', P('The following adverse reactions may occur. Patients should be carefully monitored, and if any abnormalities are observed, appropriate measures such as discontinuation should be taken.'), subs=[
            sub('11.1', 'Clinically Significant Adverse Reactions', P('11.1.1 Serious infections (pneumonia 0.8%, herpes zoster 3.1%, tuberculosis frequency unknown)'), P('11.1.2 Venous thromboembolism (0.3%)')),
            sub('11.2', 'Other Adverse Reactions', T(('', '≥5%', '1% to <5%'), ('Infections', 'Nasopharyngitis', ''), ('Nervous system', '', 'Headache'), ('Skin', '', 'Acne'), ('Laboratory', '', 'Lymphopenia, neutropenia, ALT increased')))]),
        sec('13', 'OVERDOSAGE', P(OD)),
        sec('14', 'PRECAUTIONS CONCERNING USE', P('Instruct patients to remove the tablet from the PTP sheet before taking it. Swallowing the PTP sheet may cause the sharp corners to injure the oesophageal mucosa.')),
        sec('16', 'PHARMACOKINETICS', subs=[sub('16.1', 'Blood Level', P(PK))]),
        sec('17', 'CLINICAL STUDIES', subs=[sub('17.1', 'Clinical Studies for Efficacy and Safety', P(TRIAL))]),
        sec('18', 'PHARMACOLOGY', subs=[sub('18.1', 'Mechanism of Action', P(MOA))]),
        sec('19', 'PHYSICOCHEMICAL PROPERTIES', P('Nonproprietary name: lumiravostat (JAN). Description: white to off-white powder, slightly soluble in water.')),
        sec('21', 'APPROVAL CONDITIONS', P('21.1 Develop and appropriately implement a risk management plan.'), P('21.2 Conduct a post-marketing use-results survey of all patients until data from a set number of patients have been gathered.')),
        sec('22', 'PACKAGING', P('OSTREVIA Tablets 10 mg: 28 tablets (14 tablets x 2, PTP). OSTREVIA Tablets 25 mg: 28 tablets (14 tablets x 2, PTP).')),
        sec('23', 'REFERENCES', P('1) Internal report: HANDS-1 study (fictional). 2) Internal report: HANDS-2 study (fictional).')),
        sec('24', 'REFERENCE REQUEST AND CONTACT INFORMATION', P('Halcyon Ridge Japan K.K., Medical Information Center, 1-2-3 Fictional-cho, Example-ku, Tokyo 100-0000. Tel: 0120-000-000 (fictional)')),
        sec('26', 'MARKETING AUTHORIZATION HOLDER, etc.', P('26.1 Marketing authorization holder: Halcyon Ridge Japan K.K., 1-2-3 Fictional-cho, Example-ku, Tokyo 100-0000')),
    ],
}

# ---------------------------------------------------------------- Australia
AU_META = {'proprietaryName': 'OSTREVIA', 'establishedName': 'lumiravostat', 'dosageForm': 'film-coated tablets', 'route': 'oral', 'strengths': ['10 mg', '25 mg'],
           'manufacturer': 'Halcyon Ridge Pharmaceuticals Australia Pty Ltd', 'additionalMonitoring': True, 'lang': 'en'}

AU_PI = {
    'id': 'pi', 'kind': 'au-pi', 'title': 'Product Information', 'status': 'approved', 'meta': dict(AU_META),
    'fixed': {'title': 'AUSTRALIAN PRODUCT INFORMATION – OSTREVIA (lumiravostat) film-coated tablets', 'blackTriangle': AU_BT_PI},
    'sections': [
        sec('1', 'NAME OF THE MEDICINE', P('Lumiravostat')),
        sec('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION', P('Each film-coated tablet contains 10 mg or 25 mg of lumiravostat. For the full list of excipients, see Section 6.1 List of excipients.')),
        sec('3', 'PHARMACEUTICAL FORM', P(DESC10), P(DESC25)),
        sec('4', 'CLINICAL PARTICULARS', subs=[
            sub('4.1', 'Therapeutic indications', P(f'OSTREVIA is indicated for the treatment of {IND}.')),
            sub('4.2', 'Dose and method of administration', P(DOSE), P(HEP), P(CYP)),
            sub('4.3', 'Contraindications', P('Hypersensitivity to lumiravostat or any excipient. Active tuberculosis or active serious infection. Pregnancy (Category D, fictional).')),
            sub('4.4', 'Special warnings and precautions for use', P(INF), P(MAL), P(VTE), P(LAB)),
            sub('4.5', 'Interactions with other medicines and other forms of interactions', P(INTER)),
            sub('4.6', 'Fertility, pregnancy and lactation', P(PREG), P(LACT)),
            sub('4.7', 'Effects on ability to drive and use machines', P('OSTREVIA has no or negligible influence on the ability to drive and use machines.')),
            sub('4.8', 'Adverse effects (Undesirable effects)', ar_table(), P('Reporting suspected adverse effects: Reporting suspected adverse reactions after registration of the medicinal product is important. It allows continued monitoring of the benefit-risk balance of the medicinal product. Healthcare professionals are asked to report any suspected adverse reactions at www.tga.gov.au/reporting-problems.')),
            sub('4.9', 'Overdose', P(OD), P(AU_PIC))]),
        sec('5', 'PHARMACOLOGICAL PROPERTIES', subs=[sub('5.1', 'Pharmacodynamic properties', P(MOA), P(PD), P('Clinical trials: ' + TRIAL)), sub('5.2', 'Pharmacokinetic properties', P(PK)), sub('5.3', 'Preclinical safety data', P(TOX))]),
        sec('6', 'PHARMACEUTICAL PARTICULARS', subs=[
            sub('6.1', 'List of excipients', P(EXC[0].upper() + EXC[1:] + '.')), sub('6.2', 'Incompatibilities', P('Incompatibilities were either not assessed or not identified as part of the registration of this medicine.')),
            sub('6.3', 'Shelf life', P('In Australia, information on the shelf life can be found on the public summary of the Australian Register of Therapeutic Goods (ARTG). The expiry date can be found on the packaging.')),
            sub('6.4', 'Special precautions for storage', P('Store below 30°C. Store in the original package.')), sub('6.5', 'Nature and contents of container', P('Aluminium/aluminium blister packs of 28 tablets.')),
            sub('6.6', 'Special precautions for disposal', P('In Australia, any unused medicine or waste material should be disposed of by taking it to your local pharmacy.')),
            sub('6.7', 'Physicochemical properties', P('Chemical structure: fictional. CAS number: not applicable (fictional substance).'))]),
        sec('7', 'MEDICINE SCHEDULE (POISONS STANDARD)', P('Prescription Only Medicine (Schedule 4)')),
        sec('8', 'SPONSOR', P('Halcyon Ridge Pharmaceuticals Australia Pty Ltd, Level 5, 10 Example Street, Fictionville NSW 2000. www.halcyonridge.example/au')),
        sec('9', 'DATE OF FIRST APPROVAL', P('12 March 2025')),
        sec('10', 'DATE OF REVISION', P('20 August 2026')),
    ],
}

AU_CMI = {
    'id': 'cmi', 'kind': 'au-cmi', 'title': 'Consumer Medicine Information', 'status': 'approved', 'meta': dict(AU_META),
    'fixed': {'blackTriangle': AU_BT_CMI, 'summaryIntro': AU_SUM_INTRO, 'prepared': 'This leaflet was prepared in August 2026.'},
    'sections': [
        sec('sum', 'Consumer Medicine Information (CMI) summary', UL('1. Why am I using OSTREVIA? It contains lumiravostat and is used to treat long-lasting hand eczema in adults.',
                                                                     '2. What should I know before I use OSTREVIA? Do not use it if you are allergic to it, have an active serious infection or tuberculosis, or are pregnant.',
                                                                     '3. What if I am taking other medicines? Some medicines may interfere with OSTREVIA.',
                                                                     '4. How do I use OSTREVIA? Take one tablet once a day.',
                                                                     '5. What should I know while using OSTREVIA? Tell your doctor straight away if you have signs of infection.',
                                                                     '6. Are there any side effects? Common side effects include cold symptoms, headache and acne. Serious side effects include infections and blood clots.')),
        sec('1', 'Why am I using OSTREVIA?', P('OSTREVIA contains the active ingredient lumiravostat. It calms the immune activity that causes long-lasting hand eczema when creams have not worked well enough.')),
        sec('2', 'What should I know before I use OSTREVIA?', P('Do not use OSTREVIA if you are allergic to lumiravostat or any of the ingredients listed at the end of this leaflet, if you have tuberculosis or another serious infection, or if you are pregnant.'), P('Check with your doctor if you have had tuberculosis, cancer or blood clots, or have liver problems.')),
        sec('3', 'What if I am taking other medicines?', P('Tell your doctor or pharmacist if you are taking any other medicines, including any medicines, vitamins or supplements that you buy without a prescription. Some antifungals, antibiotics and St John’s wort may interfere with OSTREVIA.')),
        sec('4', 'How do I use OSTREVIA?', P('Take one tablet once a day, with or without food. Swallow it whole with water. If you forget a dose, take it as soon as you remember, unless the next dose is due within 12 hours.')),
        sec('5', 'What should I know while using OSTREVIA?', T(('Things you should do', 'Tell your doctor straight away if you have a fever, cough or a painful swollen leg.'), ('Things you should not do', 'Do not stop taking it or change the dose without checking with your doctor.'), ('Looking after your medicine', 'Store below 30°C in the original pack.'))),
        sec('6', 'Are there any side effects?', P('All medicines can have side effects. If you do experience any side effects, most of them are minor and temporary.'),
            T(('Less serious side effects', 'What to do'), ('Cold symptoms, headache, nausea, acne', 'Speak to your doctor if you have any of these less serious side effects and they worry you.')),
            T(('Serious side effects', 'What to do'), ('Fever, cough, painful blistering rash; pain or swelling in a leg, chest pain or sudden breathlessness', 'Call your doctor straight away, or go straight to the Emergency Department at your nearest hospital if you notice any of these serious side effects.')),
            P('Tell your doctor or pharmacist if you notice anything else that may be making you feel unwell. Other side effects not listed here may occur in some people.'),
            P('Reporting side effects: ' + AU_CMI_REPORT)),
        sec('7', 'Product details', P('This medicine is only available with a doctor’s prescription.'), P('What OSTREVIA contains: lumiravostat 10 mg or 25 mg; inactive ingredients ' + EXC + '. Do not take this medicine if you are allergic to any of these ingredients.'),
            P('What OSTREVIA looks like: ' + DESC10 + ' ' + DESC25 + ' (AUST R 999101, AUST R 999102, fictional).'), P('Who distributes OSTREVIA: Halcyon Ridge Pharmaceuticals Australia Pty Ltd, Level 5, 10 Example Street, Fictionville NSW 2000.')),
    ],
}

# ---------------------------------------------------------------- WHO PQ: Malvaren
WHO_META = {'proprietaryName': 'Malvaren', 'establishedName': 'arterolin and lumexantine', 'dosageForm': 'dispersible tablets', 'route': 'oral', 'strengths': ['20 mg/120 mg'],
            'manufacturer': 'Sunpath Essential Medicines Ltd.', 'pqRef': 'MA999(a)', 'lang': 'en'}

WHO_SMPC = {
    'id': 'smpc', 'kind': 'who-smpc', 'title': 'SmPC (WHOPAR Part 4)', 'status': 'approved', 'meta': dict(WHO_META), 'fixed': {'intro': WHO_INTRO},
    'sections': [
        sec('1', 'NAME OF THE MEDICINAL PRODUCT', P('Malvaren 20 mg/120 mg dispersible tablets*'), P('*Trade names are not prequalified by WHO. This is the national medicines regulatory authority’s responsibility.')),
        sec('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION', P('Each dispersible tablet contains 20 mg arterolin and 120 mg lumexantine.'), P('Excipient with known effect: each tablet contains 1.5 mg saccharin sodium. For the full list of excipients, see section 6.1.')),
        sec('3', 'PHARMACEUTICAL FORM', P('Dispersible tablet. Yellow, round, flat tablets with a break line on one side and "SM" on the other. The break line is not intended for dividing the dose.')),
        sec('4', 'CLINICAL PARTICULARS', subs=[
            sub('4.1', 'Therapeutic indications', P('Malvaren is indicated for the treatment of acute uncomplicated malaria caused by Plasmodium falciparum in infants and children weighing 5 kg to less than 35 kg.'), P('Consideration should be given to official guidance on the appropriate use of antimalarial agents.')),
            sub('4.2', 'Posology and method of administration', T(('Body weight', 'Dose (tablets) at 0, 8, 24, 36, 48 and 60 hours'), ('5 kg to < 15 kg', '1'), ('15 kg to < 25 kg', '2'), ('25 kg to < 35 kg', '3')),
                P('Disperse the tablets in a small amount of water (about 10 mL per tablet) and give the whole mixture at once. Give with food or milk to improve absorption of lumexantine. If the child vomits within 1 hour, repeat the dose.')),
            sub('4.3', 'Contraindications', UL('Hypersensitivity to the active substances or to any of the excipients listed in section 6.1.', 'Severe malaria (WHO definition).', 'Known prolongation of the QTc interval or a family history of congenital QT prolongation.')),
            sub('4.4', 'Special warnings and precautions for use', P('Malvaren is not indicated for severe malaria or for the prevention of malaria.'), P('Lumexantine can prolong the QTc interval. Use with caution with other medicines that prolong the QTc interval and in patients with electrolyte disturbances.'), P('If the patient does not eat, monitor closely, as exposure to lumexantine may be lower.')),
            sub('4.5', 'Interaction with other medicinal products and other forms of interaction', P('Strong CYP3A4 inhibitors increase lumexantine exposure; strong CYP3A4 inducers (rifampicin, carbamazepine) reduce exposure to both components and may cause treatment failure. Avoid medicines that prolong the QTc interval.')),
            sub('4.6', 'Fertility, pregnancy and breastfeeding', P('Pregnancy: data from more than 1000 exposed pregnancies in the second and third trimesters show no malformative or feto/neonatal toxicity. In the first trimester, use only if the expected benefit outweighs the risk, following national guidelines.'), P('Breastfeeding: small amounts pass into human milk; breastfeeding may continue.')),
            sub('4.7', 'Effects on ability to drive and use machines', P('Not relevant for the intended population.')),
            sub('4.8', 'Undesirable effects', P('Frequencies: very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100).'),
                T(('System organ class', 'Very common', 'Common', 'Uncommon'), ('Metabolism and nutrition disorders', '', 'Decreased appetite', ''), ('Nervous system disorders', '', 'Headache, dizziness', ''), ('Cardiac disorders', '', '', 'Electrocardiogram QT prolonged'),
                  ('Respiratory, thoracic and mediastinal disorders', 'Cough', '', ''), ('Gastrointestinal disorders', 'Vomiting', 'Abdominal pain, diarrhoea', ''), ('Skin and subcutaneous tissue disorders', '', 'Rash', 'Urticaria'), ('General disorders', 'Pyrexia', '', ''))),
            sub('4.9', 'Overdose', P('There is no experience of overdose. Give symptomatic and supportive treatment and monitor the ECG and serum potassium.'))]),
        sec('5', 'PHARMACOLOGICAL PROPERTIES', subs=[
            sub('5.1', 'Pharmacodynamic properties', P('Pharmacotherapeutic group: antimalarials, combinations (fictional ATC). Arterolin, an artemisinin-type endoperoxide (fictional), rapidly reduces parasite biomass; lumexantine, a long-acting blood schizonticide (fictional), clears the remaining parasites.')),
            sub('5.2', 'Pharmacokinetic properties', P('Arterolin is absorbed rapidly (Tmax about 2 hours) and eliminated with a half-life of about 1 hour. Lumexantine absorption increases with food; its half-life is 3 to 5 days.')),
            sub('5.3', 'Preclinical safety data', P('Embryo-lethality was seen with arterolin in rats in early pregnancy. Lumexantine was not genotoxic.'))]),
        sec('6', 'PHARMACEUTICAL PARTICULARS', subs=[
            sub('6.1', 'List of excipients', P('Microcrystalline cellulose, crospovidone, saccharin sodium, cherry flavour, colloidal anhydrous silica, magnesium stearate.')),
            sub('6.2', 'Incompatibilities', P('Not applicable.')), sub('6.3', 'Shelf life', P('24 months.')),
            sub('6.4', 'Special precautions for storage', P('Do not store above 30°C. Store in the original package in order to protect from moisture.')),
            sub('6.5', 'Nature and contents of container', P('Aluminium/aluminium blisters of 6, 12 and 18 tablets, in cartons.')),
            sub('6.6', 'Special precautions for disposal and other handling', P('No special requirements.'))]),
        sec('7', 'SUPPLIER', P('Sunpath Essential Medicines Ltd., Plot 9, Fictional Industrial Estate, Example City, India')),
        sec('8', 'WHO REFERENCE NUMBER (WHO Prequalification Programme)', P('MA999(a)')),
        sec('9', 'DATE OF PREQUALIFICATION', P('20 September 2023')),
        sec('10', 'DATE OF REVISION OF THE TEXT', P('July 2026')),
    ],
}


# ---------------------------------------------------------------- error versions
def find(doc, num):
    for s in doc['sections']:
        if s['num'] == num:
            return s
        for x in s.get('subs', []):
            if x['num'] == num:
                return x
    raise KeyError(num)


def drafts(*docs):
    out = copy.deepcopy(list(docs))
    for d in out:
        d['status'] = 'draft'
        d['answerKey'] = []
    return out


K = lambda d, rule, where, what: d['answerKey'].append({'rule': rule, 'where': where, 'what': what})

# Canada: 17
E_CA_PM, E_CA_PMI, E_CA_LABEL = drafts(CA_PM, CA_PMI, CA_LABEL)
E_CA_PM['meta']['scheduleSymbol'] = ''
E_CA_PM['meta']['revised'] = '20/08/2026'
K(E_CA_PM, 'CA-TITLE', 'Title page', 'The Pr symbol is missing and the date of authorization is not in YYYY-MM-DD form.')
find(E_CA_PM, '3')['blocks'] = [BOX('Serious Warnings and Precautions\n• Serious infections leading to hospitalization or death, including tuberculosis, have occurred.\n• Malignancies, including lymphoma, have occurred.\n• Thrombosis, including pulmonary embolism, has occurred.')]
K(E_CA_PM, 'CA-SWP', '3', 'No cross-references to section 7.')
find(E_CA_PM, '5')['title'] = 'OVERDOSAGE'
K(E_CA_PM, 'CA-HEAD', '5', 'The heading is "OVERDOSE".')
find(E_CA_PM, '8.5')['blocks'] = [P('')]
K(E_CA_PM, 'CA-REQ', '8.5', 'Post-market adverse reactions are empty.')
find(E_CA_PM, 'rmlc')['blocks'] = [T(('Section', 'Date'), ('7 WARNINGS AND PRECAUTIONS, Hepatic/Biliary/Pancreatic', '2026-08'), ('4 DOSAGE AND ADMINISTRATION, 4.2 Recommended Dose and Dosage Adjustment', '2023-11'))]
K(E_CA_PM, 'CA-RMLC', 'Recent Major Label Changes', 'The 2023-11 entry is more than 24 months old.')
find(E_CA_PM, '6')['blocks'][0] = T(('Route', 'Dosage form / strength', 'Non-medicinal ingredients'), ('Oral', 'Tablet, film-coated, 10 mg and 20 mg', EXC))
K(E_CA_PM, 'INTL-STR', '6', '20 mg is not a strength.')
find(E_CA_PM, '1')['blocks'].append(P('OSTREVIA offers superior control of hand eczema.'))
K(E_CA_PM, 'INTL-PROMO', '1', '"superior" is promotional.')

E_CA_PMI['sections'] = [s for s in E_CA_PMI['sections'] if s['num'] != 'm0']
K(E_CA_PMI, 'CA-SWP', 'Serious warnings and precautions', 'The monograph has a serious warnings box; the patient version is missing.')
find(E_CA_PMI, 'm12')['blocks'] = [BOX('If you think you have taken too much OSTREVIA, contact your doctor or go to a hospital.')]
K(E_CA_PMI, 'CA-PMI-STD', 'Overdose', 'No poison control centre or 1-844 POISON-X number.')
find(E_CA_PMI, 'm16')['blocks'] = [P('Tell your doctor about any side effects.')]
K(E_CA_PMI, 'CA-PMI-STD', 'Reporting side effects', 'No Canada Vigilance number or medical-advice sentence.')

find(E_CA_LABEL, 'l1')['blocks'] = [P('Rx')]
K(E_CA_LABEL, 'CA-PR', 'Scheduling symbol', 'Canada uses "Pr", not "Rx".')
find(E_CA_LABEL, 'l6')['blocks'] = [P('DIN 0999010')]
K(E_CA_LABEL, 'CA-DIN', 'DIN', 'Seven digits; a DIN has eight.')
E_CA_LABEL['meta']['sizes'] = {'brand': 16, 'proper': 6}
K(E_CA_LABEL, 'CA-PROPER', 'Type sizes', 'The proper name is less than half the size of the brand name.')
find(E_CA_LABEL, 'l10')['blocks'] = [P('Store at 15°C to 30°C. Protect from moisture.')]
K(E_CA_LABEL, 'CA-BIL', 'Storage', 'No French.')
find(E_CA_LABEL, 'l14')['blocks'] = [P('Questions or comments: 1-800-555-0199. / Questions ou commentaires : signalez-les au 1-800-555-0199.')]
K(E_CA_LABEL, 'CA-REPORT', 'Contact', 'No statement that side effects can be reported to that contact.')
find(E_CA_LABEL, 'l12')['blocks'] = [P('2028/04')]
K(E_CA_LABEL, 'CA-LAB', 'Expiry date', 'Not preceded by "EXP".')

# Switzerland: 10
E_CH_FI, E_CH_PI = drafts(CH_FI, CH_PI)
E_CH_FI['fixed']['blackTriangle'] = ''
K(E_CH_FI, 'CH-BT', 'Top of the Fachinformation', 'A new active substance needs the black triangle and the standard text.')
find(E_CH_FI, 'f7')['title'] = 'Wechselwirkungen'
K(E_CH_FI, 'CH-HEAD', 'Interaktionen', 'The heading is "Interaktionen".')
find(E_CH_FI, 'f10')['blocks'] = find(E_CH_FI, 'f10')['blocks'][:2]
K(E_CH_FI, 'CH-ELVIS', 'Unerwünschte Wirkungen', 'The reporting paragraph is missing.')
find(E_CH_FI, 'f16')['blocks'] = [P('99101')]
K(E_CH_FI, 'CH-ZUL', 'Zulassungsnummer', '"(Swissmedic)" is missing.')
find(E_CH_FI, 'f17')['blocks'] = [P('Ostrevia 10 mg: 30 film-coated tablets. Ostrevia 25 mg: 30 film-coated tablets.')]
K(E_CH_FI, 'CH-CAT', 'Packungen', 'No dispensing category.')
find(E_CH_FI, 'f19')['blocks'] = [P('2026')]
K(E_CH_FI, 'CH-DATE', 'Stand der Information', 'Month and year are needed.')
find(E_CH_FI, 'f4')['blocks'].append(P('Ostrevia is the best oral option for hand eczema.'))
K(E_CH_FI, 'INTL-PROMO', 'Dosierung/Anwendung', '"best" is promotional.')
find(E_CH_PI, 'p10')['blocks'] = [P('99110 (Swissmedic)')]
K(E_CH_PI, 'CH-ZUL', 'Zulassungsnummer', 'Differs from the Fachinformation (99101).')
E_CH_PI['fixed']['lastChecked'] = 'Diese Packungsbeilage wurde letztmals durch die Arzneimittelbehörde (Swissmedic) geprüft.'
K(E_CH_PI, 'CH-DATE', 'Last line', 'The month and year are missing.')
find(E_CH_PI, 'p6')['blocks'] = [P('')]
K(E_CH_PI, 'CH-REQ', 'Wie verwenden Sie Ostrevia?', 'Empty.')

# Japan: 6
(E_JP_PI,) = drafts(JP_PI)
E_JP_PI['fixed']['commodity'] = '123456'
K(E_JP_PI, 'JP-HDR', 'Header', 'The Standard Commodity Classification Number for a drug starts with 87.')
find(E_JP_PI, '1')['blocks'] = [P(find(JP_PI, '1')['blocks'][0]['text'])]
K(E_JP_PI, 'JP-WARN', '1', 'The warnings are not boxed.')
find(E_JP_PI, '2')['blocks'] = [UL('2.1 Patients with a history of hypersensitivity to any ingredient of this drug', '2.2 Patients with serious infections, including active tuberculosis', '2.3 Pregnant women or women who may be pregnant [See 9.5.]')]
K(E_JP_PI, 'JP-CI', '2.2', 'No rationale in [ ].')
od = find(E_JP_PI, '13')
od['num'] = '12'
K(E_JP_PI, 'JP-HEAD', 'OVERDOSAGE', 'Numbered 12; section 12 is left out, so OVERDOSAGE keeps 13.')
find(E_JP_PI, '9.5')['blocks'] = [P('')]
K(E_JP_PI, 'JP-REQ', '9.5', 'Pregnant women: empty.')
find(E_JP_PI, '3.1')['blocks'] = [T(('Brand name', 'OSTREVIA Tablets 10 mg', 'OSTREVIA Tablets 25 mg'), ('Active ingredient (per tablet)', 'Lumiravostat 10 mg', 'Lumiravostat 20 mg'), ('Additives', EXC, EXC))]
K(E_JP_PI, 'INTL-STR', '3.1', '20 mg is not a strength.')

# Australia: 9
E_AU_PI, E_AU_CMI = drafts(AU_PI, AU_CMI)
E_AU_PI['fixed']['title'] = 'PRODUCT INFORMATION – OSTREVIA'
K(E_AU_PI, 'AU-TITLE', 'Title', 'Starts "AUSTRALIAN PRODUCT INFORMATION –" with the active ingredient and form.')
E_AU_PI['fixed']['blackTriangle'] = ''
K(E_AU_PI, 'AU-BT', 'Top of the PI', 'The product is in the black triangle scheme.')
find(E_AU_PI, '4.9')['blocks'] = [P(OD)]
K(E_AU_PI, 'AU-PI-STD', '4.9', 'The Poisons Information Centre number 13 11 26 is missing.')
find(E_AU_PI, '7')['blocks'] = [P('')]
K(E_AU_PI, 'AU-REQ', '7', 'No schedule.')
find(E_AU_PI, '4.8')['title'] = 'Adverse effects'
K(E_AU_PI, 'AU-HEAD', '4.8', 'The heading is "Adverse effects (Undesirable effects)".')
E_AU_CMI['fixed']['summaryIntro'] = ''
K(E_AU_CMI, 'AU-CMI-STD', 'Summary', 'The standard introduction is missing.')
find(E_AU_CMI, '6')['blocks'] = find(E_AU_CMI, '6')['blocks'][:4]
K(E_AU_CMI, 'AU-CMI-STD', '6', 'The TGA reporting statement is missing.')
E_AU_CMI['fixed']['prepared'] = 'This leaflet was prepared recently.'
K(E_AU_CMI, 'AU-CMI-STD', '7', 'No month and year.')
find(E_AU_CMI, '1')['blocks'].append(P('It is the safest tablet for hand eczema.'))
K(E_AU_CMI, 'INTL-PROMO', '1', '"safest" is promotional.')

# WHO: 6
(E_WHO,) = drafts(WHO_SMPC)
E_WHO['fixed']['intro'] = ''
K(E_WHO, 'WHO-INTRO', 'Opening statement', 'Missing.')
find(E_WHO, '8')['blocks'] = [P('MA999')]
K(E_WHO, 'WHO-REF', '8', 'The reference is MA999(a).')
find(E_WHO, '10')['blocks'] = [P('May 2023')]
K(E_WHO, 'WHO-DATE', '10', 'Earlier than the date of prequalification.')
s48 = find(E_WHO, '4.8')
s48['blocks'] = [P('Vomiting, cough and fever occur often; headache and rash occur sometimes; QT prolongation has been seen.')]
K(E_WHO, 'WHO-48', '4.8', '"often" and "sometimes" are not frequency categories.')
find(E_WHO, '6.6')['title'] = 'Special precautions for disposal'
K(E_WHO, 'WHO-HEAD', '6.6', 'The heading is "Special precautions for disposal and other handling".')
find(E_WHO, '4.2')['blocks'] = [P('')]
K(E_WHO, 'WHO-REQ', '4.2', 'Posology is empty.')

# ---------------------------------------------------------------- capstone: one signal, four markets
SIGNAL = {
    'from': 'Halcyon Ridge global safety (fictional): CCDS 4.1 effective', 'title': 'Interstitial lung disease: new warning in every market',
    'text': 'A cumulative review found a causal association between lumiravostat and interstitial lung disease (ILD), including fatal cases. The CCDS now warns that patients should be told to report new or worsening cough, breathlessness or fever, and that treatment should be interrupted while ILD is investigated and stopped if it is confirmed. ILD is added to the post-marketing adverse reactions. Implement the wording in Canada, Switzerland, Japan and Australia and submit within 60 days.',
    'sections': ['CA PM: 7 (Respiratory) and 8.5; Recent Major Label Changes', 'CH FI: Warnhinweise, Unerwünschte Wirkungen, Stand der Information', 'JP PI: 8 and 11.1; revision date', 'AU PI: 4.4, 4.8, 10; CMI: section 6'],
    'deadlineDays': 60,
}
C_DOCS = copy.deepcopy([CA_PM, CH_FI, JP_PI, AU_PI, AU_CMI])
for d, nid in zip(C_DOCS, ['ca-pm', 'ch-fi', 'jp-pi', 'au-pi', 'au-cmi']):
    d['id'] = nid

SAMPLES = [
    {'id': 'ca-ostrevia-clean', 'region': 'ca', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (Canada): clean product monograph and label', 'about': 'Part I and Part II of the product monograph to the master template, with the Serious Warnings and Precautions box and Recent Major Label Changes, the Patient Medication Information, and the bilingual outer label with Pr, DIN and the reporting contact.', 'docs': [CA_PM, CA_PMI, CA_LABEL]},
    {'id': 'ca-ostrevia-errors', 'region': 'ca', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (Canada): find and fix the errors', 'about': '17 planted errors: the title page, the box without cross-references, a stale label change, an old heading, the patient version\'s missing warnings box and standard statements, Rx instead of Pr, a short DIN, the proper name size, French, the reporting statement and more.', 'docs': [E_CA_PM, E_CA_PMI, E_CA_LABEL]},
    {'id': 'ch-ostrevia-clean', 'region': 'ch', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (Switzerland): clean Fachinformation and patient information', 'about': 'A new active substance under additional monitoring: the black triangle, the AMZV headings in German, the ElViS reporting text, the authorisation number and the dispensing category.', 'docs': [CH_FI, CH_PI]},
    {'id': 'ch-ostrevia-errors', 'region': 'ch', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (Switzerland): find and fix the errors', 'about': '10 planted errors: the missing black triangle, a heading, the reporting text, the authorisation number, the dispensing category, the dates and more.', 'docs': [E_CH_FI, E_CH_PI]},
    {'id': 'jp-ostrevia-clean', 'region': 'jp', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (Japan): clean package insert', 'about': 'The 2019 format in an English practice rendering: header items, the boxed Warnings, contraindications with their reasons in brackets, and sections numbered 1 to 26 with the gaps kept.', 'docs': [JP_PI]},
    {'id': 'jp-ostrevia-errors', 'region': 'jp', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (Japan): find and fix the errors', 'about': '6 planted errors: a header item, unboxed warnings, a contraindication without its reason, a section that moved up a number, an empty subsection and a strength.', 'docs': [E_JP_PI]},
    {'id': 'au-ostrevia-clean', 'region': 'au', 'productId': 'nce-tablet', 'level': 'Start here', 'title': 'Ostrevia (Australia): clean PI and CMI', 'about': 'The PI in the approved form and the CMI in the TGA template with its one-page summary, both with the black triangle.', 'docs': [AU_PI, AU_CMI]},
    {'id': 'au-ostrevia-errors', 'region': 'au', 'productId': 'nce-tablet', 'level': 'Practice', 'title': 'Ostrevia (Australia): find and fix the errors', 'about': '9 planted errors: the title line, the black triangle, the Poisons Information Centre, the schedule, a heading, and the CMI standard statements.', 'docs': [E_AU_PI, E_AU_CMI]},
    {'id': 'who-malvaren-clean', 'region': 'who', 'productId': 'pq-antimalarial', 'level': 'Start here', 'title': 'Malvaren (WHO PQ): clean SmPC', 'about': 'A prequalified paediatric antimalarial: the WHOPAR Part 4 SmPC with weight-band dosing, the MedDRA frequency table, the supplier, the WHO reference number and the dates.', 'docs': [WHO_SMPC]},
    {'id': 'who-malvaren-errors', 'region': 'who', 'productId': 'pq-antimalarial', 'level': 'Practice', 'title': 'Malvaren (WHO PQ): find and fix the errors', 'about': '6 planted errors: the scope statement, the reference number, the dates, the 4.8 frequencies, a heading and empty posology.', 'docs': [E_WHO]},
    {'id': 'intl-ostrevia-ild', 'region': 'intl', 'productId': 'nce-tablet', 'level': 'Capstone', 'title': 'Ostrevia: one safety signal, four markets',
     'about': 'A new interstitial lung disease warning reaches Canada, Switzerland, Japan and Australia at once. Put it in the right sections of each format, move the dates, approve, and track the four submissions within 60 days.',
     'docs': C_DOCS, 'change': {'trigger': 'signal', 'kind': 'warning', 'title': 'Interstitial lung disease (CCDS 4.1)', 'notice': SIGNAL, 'markets': ['ca', 'ch', 'jp', 'au'], 'deadlineDays': 60}},
]
