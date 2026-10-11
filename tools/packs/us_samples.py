"""US sample projects. All products, companies, studies, phone numbers and NDCs are fictional.

Phone numbers use the 555-01xx range reserved for fiction. NDC labeler codes are invented.
"""
import copy
from lib import P, UL, T, BOX, sub, sec

MFR_HR = 'Halcyon Ridge Pharmaceuticals, Inc.'
PHONE_HR = '1-800-555-0142'

# ======================================================================= Ostrevia PI (clean)
ost_meta = {
    'proprietaryName': 'OSTREVIA', 'establishedName': 'lumiravostat', 'dosageForm': 'tablets', 'route': 'for oral use',
    'controlled': '', 'initialApproval': '2023', 'revised': '08/2026', 'manufacturer': MFR_HR, 'phone': PHONE_HR,
    'patientLabeling': 'mg',
}

ost_bw = {
    'title': 'WARNING: SERIOUS INFECTIONS, MALIGNANCY, AND THROMBOSIS',
    'blocks': [
        UL('Serious infections leading to hospitalization or death have occurred in patients treated with OSTREVIA. Avoid use in patients with an active, serious infection. If a serious infection develops, interrupt OSTREVIA until the infection is controlled [see Warnings and Precautions (5.1)].',
           'Malignancies, including lymphoma and non-melanoma skin cancer, have been observed in patients treated with OSTREVIA [see Warnings and Precautions (5.2)].',
           'Thrombosis, including deep venous thrombosis and pulmonary embolism, has occurred in patients treated with OSTREVIA. Avoid OSTREVIA in patients at increased risk of thrombosis [see Warnings and Precautions (5.3)].',
           note='Boxed warning wording agreed with the agency in the fictional 2023 review; thrombosis added 08/2026 after the fictional HALO-LTE signal.'),
    ],
}

ost_hl = {
    'limitation': 'These highlights do not include all the information needed to use OSTREVIA safely and effectively. See full prescribing information for OSTREVIA.',
    'bw': [UL('Serious infections leading to hospitalization or death have occurred. Avoid use with an active, serious infection. (5.1)',
              'Malignancies, including lymphoma, have been observed. (5.2)',
              'Thrombosis, including deep venous thrombosis and pulmonary embolism, has occurred. Avoid use in patients at increased risk. (5.3)')],
    'rmc': [{'heading': 'Boxed Warning', 'num': '', 'date': '08/2026'},
            {'heading': 'Warnings and Precautions, Thrombosis', 'num': '5.3', 'date': '08/2026'}],
    'ind': [P('OSTREVIA is a kinase inhibitor indicated for the treatment of adults with moderate-to-severe chronic hand eczema inadequately controlled with topical corticosteroids. (1)')],
    'da': [UL('Recommended dosage: 10 mg orally once daily, with or without food. (2.1)',
              'Increase to 25 mg once daily if the response is inadequate after 12 weeks. (2.1)',
              'Perform laboratory tests before starting treatment. (2.2)',
              'Moderate hepatic impairment: 10 mg once daily; severe hepatic impairment: not recommended. (2.3, 8.6)')],
    'dfs': [P('Tablets: 10 mg and 25 mg. (3)')],
    'ci': [P('Known hypersensitivity to lumiravostat or to any of the excipients. (4)')],
    'wp': [UL('Serious infections: Screen for tuberculosis before treatment. Monitor for signs and symptoms of infection. (5.1)',
              'Malignancy: Perform periodic skin examinations. (5.2)',
              'Thrombosis: Discontinue OSTREVIA promptly if symptoms of thrombosis occur. (5.3)',
              'Laboratory abnormalities: Monitor lymphocyte and neutrophil counts, hemoglobin and liver enzymes. (5.4)',
              'Embryo-fetal toxicity: May cause fetal harm. Advise females of reproductive potential to use effective contraception. (5.5, 8.1, 8.3)')],
    'ar': [P('Most common adverse reactions (incidence at least 5% and greater than placebo) are nasopharyngitis, headache, nausea and acne. (6.1)'),
           P(f'To report SUSPECTED ADVERSE REACTIONS, contact {MFR_HR} at {PHONE_HR} or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.')],
    'di': [UL('Strong CYP3A4 inhibitors: Use 10 mg once daily. (7.1)', 'Strong CYP3A4 inducers: Avoid concomitant use. (7.2)')],
    'usp': [UL('Lactation: Advise not to breastfeed during treatment and for 4 days after the last dose. (8.2)')],
    'pci': 'See 17 for PATIENT COUNSELING INFORMATION and Medication Guide.',
}

ost_sections = [
    sec('1', 'INDICATIONS AND USAGE',
        P('OSTREVIA is indicated for the treatment of adults with moderate-to-severe chronic hand eczema whose disease is inadequately controlled with topical corticosteroids or for whom topical corticosteroids are not advisable.', note='Wording from the fictional HALO-1 and HALO-2 study populations (14).'),
        P('Limitations of Use: Use of OSTREVIA in combination with other systemic immunosuppressants or biologic immunomodulators is not recommended.')),
    sec('2', 'DOSAGE AND ADMINISTRATION', subs=[
        sub('2.1', 'Recommended Dosage',
            P('The recommended dosage of OSTREVIA is 10 mg taken orally once daily, with or without food.'),
            P('If the response is inadequate after 12 weeks, the dosage may be increased to 25 mg once daily. Use the lowest effective dosage needed to maintain response.'),
            P('Swallow tablets whole. Do not split, crush or chew.')),
        sub('2.2', 'Laboratory Evaluations Before Starting Treatment',
            P('Before starting OSTREVIA, test for latent tuberculosis and obtain a complete blood count and liver enzymes [see Warnings and Precautions (5.1, 5.4)]. Do not start OSTREVIA in patients with an absolute lymphocyte count below 500 cells/mm3 or an absolute neutrophil count below 1,000 cells/mm3.')),
        sub('2.3', 'Dosage in Patients with Hepatic Impairment',
            P('In patients with moderate hepatic impairment (Child-Pugh B), the recommended dosage is 10 mg once daily. OSTREVIA is not recommended in patients with severe hepatic impairment (Child-Pugh C) [see Use in Specific Populations (8.6)].')),
        sub('2.4', 'Dosage Modifications for Drug Interactions',
            P('In patients taking strong CYP3A4 inhibitors, the recommended dosage is 10 mg once daily [see Drug Interactions (7.1)].')),
    ]),
    sec('3', 'DOSAGE FORMS AND STRENGTHS',
        UL('10 mg: white, round, film-coated tablets debossed with "HR" on one side and "10" on the other.',
           '25 mg: yellow, oval, film-coated tablets debossed with "HR" on one side and "25" on the other.')),
    sec('4', 'CONTRAINDICATIONS',
        P('OSTREVIA is contraindicated in patients with known hypersensitivity to lumiravostat or to any of the excipients [see Description (11)].')),
    sec('5', 'WARNINGS AND PRECAUTIONS', subs=[
        sub('5.1', 'Serious Infections',
            P('Serious and sometimes fatal infections, including pneumonia, cellulitis and herpes zoster, have occurred in patients receiving OSTREVIA. In the placebo-controlled period of the clinical studies, serious infections occurred in 1.2% of patients receiving OSTREVIA and 0.4% of patients receiving placebo.'),
            P('Avoid use of OSTREVIA in patients with an active, serious infection. Test patients for latent tuberculosis before treatment and treat latent infection before starting OSTREVIA. If a serious infection develops, interrupt OSTREVIA until the infection is controlled.')),
        sub('5.2', 'Malignancy',
            P('Malignancies, including lymphoma and non-melanoma skin cancer, were observed in clinical studies of OSTREVIA. Consider the risks and benefits before starting OSTREVIA in patients with a known malignancy other than a successfully treated non-melanoma skin cancer. Periodic skin examinations are recommended.')),
        sub('5.3', 'Thrombosis',
            P('Deep venous thrombosis and pulmonary embolism have been reported in patients treated with OSTREVIA, including in the long-term extension study. Avoid OSTREVIA in patients who may be at increased risk of thrombosis. Discontinue OSTREVIA promptly and evaluate patients who develop symptoms of thrombosis.', note='Added 08/2026 after the fictional HALO-LTE signal; see the change request in Phase 2.')),
        sub('5.4', 'Laboratory Abnormalities',
            P('Treatment with OSTREVIA was associated with decreases in lymphocyte and neutrophil counts, decreases in hemoglobin, and increases in liver enzymes. Monitor these values at baseline, 4 weeks after starting treatment and every 3 months thereafter. Interrupt treatment if the absolute lymphocyte count falls below 500 cells/mm3, the absolute neutrophil count falls below 1,000 cells/mm3 or hemoglobin falls below 8 g/dL.')),
        sub('5.5', 'Embryo-Fetal Toxicity',
            P('Based on findings in animal reproduction studies, OSTREVIA may cause fetal harm when administered to a pregnant woman. Advise females of reproductive potential of the potential risk to a fetus and to use effective contraception during treatment and for 4 weeks after the last dose [see Use in Specific Populations (8.1, 8.3)].')),
    ]),
    sec('6', 'ADVERSE REACTIONS',
        P('The following clinically significant adverse reactions are described elsewhere in the labeling:'),
        UL('Serious Infections [see Warnings and Precautions (5.1)]', 'Malignancy [see Warnings and Precautions (5.2)]', 'Thrombosis [see Warnings and Precautions (5.3)]', 'Laboratory Abnormalities [see Warnings and Precautions (5.4)]'),
        subs=[sub('6.1', 'Clinical Trials Experience',
            P('Because clinical trials are conducted under widely varying conditions, adverse reaction rates observed in the clinical trials of a drug cannot be directly compared to rates in the clinical trials of another drug and may not reflect the rates observed in practice.'),
            P('The safety of OSTREVIA was evaluated in two 16-week, randomized, double-blind, placebo-controlled studies (HALO-1 and HALO-2) in 612 adults with chronic hand eczema. Table 1 lists adverse reactions that occurred in at least 5% of patients treated with OSTREVIA and more often than with placebo.'),
            T(['Adverse reaction', 'OSTREVIA 10 mg (N=204)', 'OSTREVIA 25 mg (N=205)', 'Placebo (N=203)'],
              ['Nasopharyngitis', '11%', '13%', '8%'], ['Headache', '8%', '10%', '5%'], ['Nausea', '6%', '8%', '3%'], ['Acne', '5%', '7%', '2%']))]),
    sec('7', 'DRUG INTERACTIONS', subs=[
        sub('7.1', 'Strong CYP3A4 Inhibitors', P('Lumiravostat exposure increases with strong CYP3A4 inhibitors. Use 10 mg once daily [see Dosage and Administration (2.4)].')),
        sub('7.2', 'Strong CYP3A4 Inducers', P('Lumiravostat exposure decreases with strong CYP3A4 inducers, which may reduce efficacy. Avoid concomitant use.')),
    ]),
    sec('8', 'USE IN SPECIFIC POPULATIONS', subs=[
        sub('8.1', 'Pregnancy',
            P('Risk Summary'),
            P('Based on findings in animal reproduction studies, OSTREVIA may cause fetal harm when administered to a pregnant woman. There are no available data on OSTREVIA use in pregnant women to evaluate for a drug-associated risk of major birth defects, miscarriage or other adverse maternal or fetal outcomes. In animal reproduction studies, oral administration of lumiravostat to pregnant rats and rabbits during organogenesis caused skeletal malformations at exposures 6 and 9 times the exposure at the maximum recommended human dose (MRHD).'),
            P('The estimated background risk of major birth defects and miscarriage for the indicated population is unknown. In the U.S. general population, the estimated background risk of major birth defects and miscarriage in clinically recognized pregnancies is 2% to 4% and 15% to 20%, respectively.'),
            P('Data'),
            P('Animal Data: In an embryo-fetal development study in rats, lumiravostat was given orally during organogenesis at doses up to 60 mg/kg/day. Skeletal malformations were seen at 30 mg/kg/day and above (6 times the MRHD on an AUC basis).')),
        sub('8.2', 'Lactation',
            P('Risk Summary'),
            P('There are no data on the presence of lumiravostat in human milk, the effects on the breastfed infant or the effects on milk production. Lumiravostat was present in the milk of lactating rats. Because of the potential for serious adverse reactions in the breastfed infant, advise women not to breastfeed during treatment with OSTREVIA and for 4 days after the last dose (about 6 elimination half-lives).')),
        sub('8.3', 'Females and Males of Reproductive Potential',
            P('Pregnancy Testing: Verify the pregnancy status of females of reproductive potential before starting OSTREVIA.'),
            P('Contraception: Advise females of reproductive potential to use effective contraception during treatment with OSTREVIA and for 4 weeks after the last dose.')),
        sub('8.4', 'Pediatric Use', P('The safety and effectiveness of OSTREVIA in pediatric patients have not been established.')),
        sub('8.5', 'Geriatric Use', P('Of the 612 patients in the clinical studies, 58 (9%) were 65 years of age and older. No overall differences in safety or effectiveness were observed between these patients and younger adults.')),
        sub('8.6', 'Hepatic Impairment', P('Lumiravostat exposure increased in patients with moderate hepatic impairment. Reduce the dosage in moderate hepatic impairment; OSTREVIA is not recommended in severe hepatic impairment [see Dosage and Administration (2.3)].')),
    ]),
    sec('10', 'OVERDOSAGE', P('There is no specific antidote for OSTREVIA overdose. In case of overdose, monitor the patient for signs and symptoms of adverse reactions and give supportive care. Hemodialysis is not expected to remove lumiravostat.')),
    sec('11', 'DESCRIPTION',
        P('OSTREVIA (lumiravostat) is a kinase inhibitor. The molecular formula is C21H24F2N6O2 and the molecular weight is 430.45 g/mol (fictional values).'),
        P('Each film-coated tablet contains 10 mg or 25 mg of lumiravostat and the following inactive ingredients: microcrystalline cellulose, croscarmellose sodium, magnesium stearate, hypromellose and titanium dioxide. The 25 mg tablet also contains iron oxide yellow.')),
    sec('12', 'CLINICAL PHARMACOLOGY', subs=[
        sub('12.1', 'Mechanism of Action', P('Lumiravostat is a reversible inhibitor of the fictional STRK1 kinase, which mediates signalling of cytokines involved in inflammation of the skin. The relevance of STRK1 inhibition to therapeutic effectiveness is not fully understood.')),
        sub('12.2', 'Pharmacodynamics', P('Lumiravostat caused dose-dependent reductions in serum markers of skin inflammation within 2 weeks of starting treatment.')),
        sub('12.3', 'Pharmacokinetics',
            P('Absorption: Peak plasma concentrations are reached 1 to 2 hours after an oral dose. A high-fat meal did not have a clinically meaningful effect on exposure.'),
            P('Elimination: The mean terminal half-life is about 16 hours. Lumiravostat is metabolized mainly by CYP3A4; about 70% of a dose is recovered in feces and 20% in urine.')),
    ]),
    sec('13', 'NONCLINICAL TOXICOLOGY', subs=[
        sub('13.1', 'Carcinogenesis, Mutagenesis, Impairment of Fertility', P('In a 2-year rat carcinogenicity study, lumiravostat did not increase the incidence of tumors at exposures up to 4 times the MRHD. Lumiravostat was not mutagenic in the bacterial reverse mutation assay. Fertility was not affected in male or female rats at exposures up to 6 times the MRHD.')),
    ]),
    sec('14', 'CLINICAL STUDIES',
        P('Two 16-week, randomized, double-blind, placebo-controlled studies (HALO-1 and HALO-2) enrolled 612 adults with moderate-to-severe chronic hand eczema inadequately controlled with topical corticosteroids. The primary endpoint was the proportion of patients with an Investigator Global Assessment (IGA) score of clear or almost clear (0 or 1) with at least a 2-grade improvement at week 16.', note='Fictional studies HALO-1 (n=306) and HALO-2 (n=306); figures match the eCTD sample dossier Module 2.7.3.'),
        T(['Endpoint at week 16', 'OSTREVIA 10 mg', 'OSTREVIA 25 mg', 'Placebo'], ['IGA 0 or 1 (HALO-1)', '36%', '45%', '13%'], ['IGA 0 or 1 (HALO-2)', '39%', '48%', '15%'])),
    sec('16', 'HOW SUPPLIED/STORAGE AND HANDLING',
        UL('10 mg tablets: white, round, film-coated, debossed "HR" and "10"; bottles of 30 (NDC 99999-1010-3).',
           '25 mg tablets: yellow, oval, film-coated, debossed "HR" and "25"; bottles of 30 (NDC 99999-1025-3).'),
        P('Store at 20°C to 25°C (68°F to 77°F); excursions permitted to 15°C to 30°C (59°F to 86°F). Keep in the original bottle.')),
    sec('17', 'PATIENT COUNSELING INFORMATION',
        P('Advise the patient to read the FDA-approved patient labeling (Medication Guide).'),
        P('Serious Infections: Inform patients that OSTREVIA may lower their ability to fight infections, and to contact their healthcare provider right away if they develop signs or symptoms of an infection [see Warnings and Precautions (5.1)].'),
        P('Thrombosis: Advise patients to stop taking OSTREVIA and seek medical help right away if they develop signs of a blood clot, such as leg pain or swelling, chest pain or shortness of breath [see Warnings and Precautions (5.3)].'),
        P('Embryo-Fetal Toxicity: Advise females of reproductive potential to use effective contraception and to tell their healthcare provider if they become pregnant [see Warnings and Precautions (5.5)].'),
        P('Lactation: Advise women not to breastfeed during treatment and for 4 days after the last dose [see Use in Specific Populations (8.2)].'),
        P(f'Manufactured for: {MFR_HR}, Fictionville, NJ 08000, USA.')),
]

def pi_doc(meta, hl, bw, sections, **extra):
    d = {'kind': 'pi', 'meta': meta, 'hl': hl, 'bw': bw, 'sections': sections}
    d.update(extra)
    return d

ost_pi = pi_doc(ost_meta, ost_hl, ost_bw, ost_sections)

# ======================================================================= Ostrevia MG
ost_mg = {
    'kind': 'mg',
    'meta': {'proprietaryName': 'OSTREVIA', 'establishedName': 'lumiravostat', 'dosageForm': 'tablets', 'revised': '08/2026', 'manufacturer': MFR_HR, 'pronunciation': 'os-TREV-ee-uh'},
    'fixed': {'header': 'MEDICATION GUIDE', 'sideEffects': 'Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088.', 'approval': 'This Medication Guide has been approved by the U.S. Food and Drug Administration.'},
    'sections': [
        sec('m1', 'What is the most important information I should know about OSTREVIA?',
            P('OSTREVIA can cause serious side effects, including:'),
            UL('Serious infections. OSTREVIA lowers the ability of your immune system to fight infections. Some people have had serious infections that needed hospital care or caused death. Tell your healthcare provider right away if you have a fever, sweating, chills, cough, or burning when you pass urine.',
               'Cancer. Some people taking OSTREVIA have had lymphoma and skin cancer. Tell your healthcare provider if you have ever had any type of cancer.',
               'Blood clots. Blood clots in the legs or lungs can happen. Stop taking OSTREVIA and get medical help right away if you have leg pain or swelling, chest pain, or sudden shortness of breath.')),
        sec('m2', 'What is OSTREVIA?',
            P('OSTREVIA is a prescription medicine for adults with long-lasting (chronic) hand eczema. It is used when the eczema is moderate to severe and steroid creams or ointments have not worked well enough.'),
            P('It is not known if OSTREVIA is safe and effective in children.')),
        sec('m3', 'Who should not take OSTREVIA?', P('Do not take OSTREVIA if you are allergic to lumiravostat or any of the ingredients in OSTREVIA. See the end of this Medication Guide for a list of the ingredients.')),
        sec('m4', 'What should I tell my healthcare provider before taking OSTREVIA?',
            P('Before taking OSTREVIA, tell your healthcare provider about all of your medical conditions, including if you:'),
            UL('have an infection, or keep getting infections', 'have had tuberculosis (TB) or been in close contact with someone with TB', 'have had a blood clot', 'have liver problems',
               'are pregnant or plan to become pregnant. OSTREVIA may harm your unborn baby. Use effective birth control during treatment and for 4 weeks after your last dose.',
               'are breastfeeding or plan to breastfeed. Do not breastfeed during treatment and for 4 days after your last dose.'),
            P('Tell your healthcare provider about all the medicines you take, including prescription and over-the-counter medicines, vitamins and herbal supplements.')),
        sec('m5', 'How should I take OSTREVIA?',
            UL('Take OSTREVIA exactly as your healthcare provider tells you.', 'Take OSTREVIA 1 time each day, with or without food.', 'Swallow the tablet whole. Do not split, crush or chew it.',
               'If you miss a dose, take it as soon as you remember that day. Do not take 2 doses on the same day.')),
        sec('m7', 'What are the possible side effects of OSTREVIA?',
            P('OSTREVIA can cause serious side effects. See "What is the most important information I should know about OSTREVIA?"'),
            P('The most common side effects of OSTREVIA include: common cold, headache, nausea and acne.'),
            P('These are not all the possible side effects of OSTREVIA.')),
        sec('m8', 'How should I store OSTREVIA?', UL('Store OSTREVIA at room temperature between 68°F and 77°F (20°C and 25°C).', 'Keep OSTREVIA in the bottle it comes in.', 'Keep OSTREVIA and all medicines out of the reach of children.')),
        sec('m9', 'General information about the safe and effective use of OSTREVIA.',
            P('Medicines are sometimes prescribed for purposes other than those listed in a Medication Guide. Do not use OSTREVIA for a condition for which it was not prescribed. Do not give OSTREVIA to other people, even if they have the same symptoms that you have. You can ask your pharmacist or healthcare provider for information about OSTREVIA that is written for health professionals.')),
        sec('m10', 'What are the ingredients in OSTREVIA?',
            P('Active ingredient: lumiravostat'),
            P('Inactive ingredients: microcrystalline cellulose, croscarmellose sodium, magnesium stearate, hypromellose and titanium dioxide. The 25 mg tablet also contains iron oxide yellow.'),
            P(f'Manufactured for: {MFR_HR}, Fictionville, NJ 08000, USA. For more information, call {PHONE_HR}.')),
    ],
}

# ======================================================================= Ostrevia carton and container
ost_carton = {
    'kind': 'carton',
    'fields': {
        'proprietaryName': 'OSTREVIA', 'establishedName': '(lumiravostat) tablets', 'strength': '10 mg', 'dosageForm': 'tablets', 'route': 'For oral use',
        'netQuantity': '30 tablets', 'rxOnly': 'Rx only', 'ndc': 'NDC 99999-1010-3', 'dosageStatement': 'Recommended dosage: See prescribing information.',
        'storage': 'Store at 20°C to 25°C (68°F to 77°F); excursions permitted to 15°C to 30°C (59°F to 86°F).', 'lot': 'LOT: XXXXXX', 'expiry': 'EXP: YYYY-MM',
        'manufacturer': 'Manufactured for: Halcyon Ridge Pharmaceuticals, Inc., Fictionville, NJ 08000, USA', 'mgStatement': 'Dispense the accompanying Medication Guide to each patient.',
    },
    'sizes': {'proprietaryName': 18, 'establishedName': 10, 'strength': 14},
    'barcode': True, 'twoD': True, 'colour': '#2f6f6a', 'injectable': False,
}
ost_container = {
    'kind': 'container',
    'fields': {
        'proprietaryName': 'OSTREVIA', 'establishedName': '(lumiravostat) tablets', 'strength': '10 mg', 'dosageForm': 'tablets', 'route': 'For oral use',
        'netQuantity': '30 tablets', 'rxOnly': 'Rx only', 'ndc': 'NDC 99999-1010-3', 'dosageStatement': '', 'storage': 'Store at 20°C to 25°C.',
        'lot': 'LOT: XXXXXX', 'expiry': 'EXP: YYYY-MM', 'manufacturer': 'Halcyon Ridge Pharmaceuticals, Inc., Fictionville, NJ 08000', 'mgStatement': 'Dispense the accompanying Medication Guide to each patient.',
    },
    'sizes': {'proprietaryName': 14, 'establishedName': 8, 'strength': 12},
    'barcode': True, 'twoD': True, 'colour': '#2f6f6a', 'injectable': False,
}

# ======================================================================= Ostrevia: error-seeded copies
# Each mutation is listed so the answer key in the app can show what was planted.
ost_pi_err = copy.deepcopy(ost_pi)
E = []
def plant(rule, where, what):
    E.append({'rule': rule, 'where': where, 'what': what})

h = ost_pi_err['hl']
h['limitation'] = 'These highlights do not include all the information needed to use OSTREVIA. See full prescribing information for OSTREVIA.'
plant('US-HL-LIM', 'Highlights', '"safely and effectively" is missing from the limitation statement.')
ost_pi_err['meta']['initialApproval'] = ''
plant('US-HL-APPROVAL', 'Highlights', 'Initial U.S. Approval year is missing.')
ost_pi_err['meta']['revised'] = 'August 2026'
plant('US-HL-REV', 'Highlights', 'Revision date is not in MM/YYYY form.')
h['bw'] = [UL('Serious infections leading to hospitalization or death have occurred. (5.1)', 'Malignancies, including lymphoma, have been observed. (5.2)', 'Thrombosis has occurred. (5.3)')]
h['bwNoClose'] = True
plant('US-HL-BW', 'Highlights boxed warning', 'The closing line "See full prescribing information for complete boxed warning." is missing.')
h['rmc'] = [{'heading': 'Warnings and Precautions, Thrombosis', 'num': '5.3', 'date': '08/2026'},
            {'heading': 'Adverse Reactions', 'num': '6.1', 'date': '08/2026'},
            {'heading': 'Dosage and Administration', 'num': '2.1', 'date': '02/2025'}]
plant('US-HL-RMC', 'Recent Major Changes', 'Adverse Reactions (6.1) is not a section that can be listed.')
plant('US-HL-RMC', 'Recent Major Changes', 'The 02/2025 entry is more than a year before the revision date.')
h['wp'][0]['items'][1] = 'Malignancy: Perform periodic skin examinations. (5.9)'
plant('US-HL-REF', 'Highlights, Warnings and Precautions', 'Bullet cites (5.9), which does not exist.')
h['ar'][1] = P(f'To report SUSPECTED ADVERSE REACTIONS, contact {MFR_HR} at {PHONE_HR}.')
plant('US-HL-AR', 'Highlights, Adverse Reactions', 'FDA contact details are missing from the reporting statement.')
h['pci'] = 'See 17 for PATIENT COUNSELING INFORMATION.'
plant('US-HL-PCI', 'Highlights', 'The statement does not mention the Medication Guide.')
h['dfs'] = [P('Tablets: 10 mg and 15 mg. (3)')]
plant('US-PI-STR', 'Highlights, Dosage Forms and Strengths', '15 mg does not match the 10 mg and 25 mg strengths.')
S = {s['num']: s for s in ost_pi_err['sections']}
S['4']['blocks'] = []
plant('US-PI-CI-NONE', '4 Contraindications', 'Section 4 is empty instead of listing the contraindication or saying "None."')
plant('US-HL-CI', 'Highlights, Contraindications', 'Highlights has a contraindication that section 4 no longer has.')
s8 = {x['num']: x for x in S['8']['subs']}
s8['8.1']['blocks'][1]['text'] = 'Pregnancy Category C. ' + s8['8.1']['blocks'][1]['text']
plant('US-PI-PLLR', '8.1 Pregnancy', 'A pregnancy letter category is still used.')
s8['8.2']['blocks'] = s8['8.2']['blocks'][1:]
plant('US-PI-PLLR', '8.2 Lactation', 'The "Risk Summary" heading is missing.')
s8['8.4']['title'] = 'Pediatrics'
plant('US-PI-SEC-TITLE', '8.4', 'Heading should be "Pediatric Use".')
s2 = {x['num']: x for x in S['2']['subs']}
s2['2.2']['blocks'][0]['text'] = s2['2.2']['blocks'][0]['text'].replace('(5.1, 5.4)', '(5.1, 5.7)')
plant('US-PI-XREF', '2.2', 'Cross-reference to 5.7, which does not exist.')
s2['2.1']['blocks'][0]['text'] = 'The recommended dosage of OSTREVIA is 10.0 mg taken orally QD, with or without food.'
plant('US-ME-TZ', '2.1', 'Trailing zero in "10.0 mg".')
plant('US-ME-ABBR', '2.1', '"QD" is an error-prone abbreviation.')
s2['2.3']['blocks'][0]['text'] = s2['2.3']['blocks'][0]['text'].replace('the recommended dosage is 10 mg once daily', 'reduce the dose by .5 of the usual dose (10 mg once daily)')
plant('US-ME-ND', '2.3', 'Naked decimal ".5".')
S['12']['subs'][2]['blocks'][1]['text'] = 'Elimination: The mean terminal half-life is about 16 hours. Lumiravastat is metabolized mainly by CYP3A4; about 70% of a dose is recovered in feces and 20% in urine.'
plant('US-NAME', '12.3', '"Lumiravastat" is a misspelling of lumiravostat.')
S['6']['subs'][0]['blocks'] = S['6']['subs'][0]['blocks'][1:]
plant('US-PI-AR-STMT', '6.1', 'The standard clinical trials statement is missing.')
S['16']['blocks'][0]['items'][1] = '50 mg tablets: yellow, oval, film-coated, debossed "HR" and "50"; bottles of 30 (NDC 99999-1050-3).'
plant('US-PI-STR', '16', '50 mg does not match the product strengths.')
S['17']['blocks'] = S['17']['blocks'][1:]
plant('US-PI-17-MG', '17', 'Section 17 no longer tells the prescriber to advise reading the Medication Guide.')
ost_pi_err['bw']['blocks'] = [UL('Serious infections leading to hospitalization or death have occurred in patients treated with OSTREVIA.', 'Malignancies have been observed in patients treated with OSTREVIA.', 'Thrombosis has occurred in patients treated with OSTREVIA.')]
plant('US-PI-BW-REF', 'Boxed warning', 'The boxed warning no longer points to section 5.')
ost_pi_err['answerKey'] = E

ost_mg_err = copy.deepcopy(ost_mg)
EM = []
ost_mg_err['sections'] = [s for s in ost_mg_err['sections'] if s['num'] != 'm9']
EM.append({'rule': 'US-PT-HEAD', 'where': 'Medication Guide', 'what': 'The "General information about the safe and effective use" section is missing.'})
ost_mg_err['fixed']['sideEffects'] = 'Call your doctor for medical advice about side effects.'
EM.append({'rule': 'US-PT-FIXED', 'where': 'Medication Guide', 'what': 'The FDA reporting part of the side-effects statement is missing.'})
ost_mg_err['sections'][0]['blocks'][1]['items'][0] = 'Serious infections. OSTREVIA lowers the ability of your immune system to fight infections. Patients have experienced serious infections requiring hospitalization; contact your provider in the event of pyrexia or concomitant symptoms of infection.'
EM.append({'rule': 'US-PT-READ', 'where': 'Most important information', 'what': 'Medical terms (pyrexia, concomitant, in the event of) where plain words exist.'})
ost_mg_err['answerKey'] = EM

ost_carton_err = copy.deepcopy(ost_carton)
ost_carton_err['fields']['mgStatement'] = ''
ost_carton_err['fields']['strength'] = '10.0 mg'
ost_carton_err['sizes']['establishedName'] = 7
ost_carton_err['answerKey'] = [
    {'rule': 'US-CC-MG', 'where': 'Carton', 'what': 'The Medication Guide dispensing statement is missing.'},
    {'rule': 'US-ME-TZ', 'where': 'Carton strength', 'what': 'Trailing zero in "10.0 mg".'},
    {'rule': 'US-CC-ESTNAME', 'where': 'Carton', 'what': 'Established name (7 pt) is less than half the proprietary name (18 pt).'},
]
# A printer's proof of the clean carton, with two differences from the approved text.
ost_proof = copy.deepcopy(ost_carton['fields'])
ost_proof['storage'] = 'Store at 20°C to 25°C (68°F to 77°F); excursions permitted to 15°C to 30°C (59°F to 86°F'
ost_proof['ndc'] = 'NDC 99999-1010-8'

# ======================================================================= Corvenza (reference listed drug)
MFR_NM = 'Northmere Pharma Inc.'
PHONE_NM = '1-800-555-0177'
corv_meta = {'proprietaryName': 'CORVENZA', 'establishedName': 'talmisartan', 'dosageForm': 'tablets', 'route': 'for oral use', 'controlled': '',
             'initialApproval': '2018', 'revised': '05/2026', 'manufacturer': MFR_NM, 'phone': PHONE_NM, 'patientLabeling': '', 'strengths': ['20 mg', '40 mg', '80 mg']}
corv_bw = {'title': 'WARNING: FETAL TOXICITY', 'blocks': [UL('When pregnancy is detected, discontinue CORVENZA as soon as possible [see Warnings and Precautions (5.1)].',
                                                              'Drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus [see Warnings and Precautions (5.1)].')]}
corv_hl = {
    'limitation': 'These highlights do not include all the information needed to use CORVENZA safely and effectively. See full prescribing information for CORVENZA.',
    'bw': [UL('When pregnancy is detected, discontinue CORVENZA as soon as possible. (5.1)', 'Drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus. (5.1)')],
    'rmc': [],
    'ind': [P('CORVENZA is an angiotensin II receptor blocker (ARB) indicated for:'),
            UL('Treatment of hypertension, to lower blood pressure. (1.1)', 'Treatment of diabetic nephropathy in hypertensive patients with type 2 diabetes and proteinuria. (1.2)')],
    'da': [UL('Hypertension: 40 mg once daily; range 20 mg to 80 mg once daily. (2.1)', 'Diabetic nephropathy: 80 mg once daily. (2.2)')],
    'dfs': [P('Tablets: 20 mg, 40 mg and 80 mg. (3)')],
    'ci': [UL('Known hypersensitivity to talmisartan. (4)', 'Coadministration with aliskiren in patients with diabetes. (4)')],
    'wp': [UL('Hypotension in volume- or salt-depleted patients: Correct depletion before starting. (5.2)', 'Hyperkalemia: Monitor serum potassium. (5.3)', 'Impaired renal function: Monitor serum creatinine. (5.4)')],
    'ar': [P('Most common adverse reactions (incidence at least 3% and greater than placebo) are dizziness, back pain and upper respiratory tract infection. (6.1)'),
           P(f'To report SUSPECTED ADVERSE REACTIONS, contact {MFR_NM} at {PHONE_NM} or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.')],
    'di': [UL('Potassium-sparing diuretics and potassium supplements: may increase serum potassium. (7.1)', 'NSAIDs: may worsen renal function and reduce the antihypertensive effect. (7.2)')],
    'usp': [UL('Lactation: Breastfeeding is not recommended. (8.2)')],
    'pci': 'See 17 for PATIENT COUNSELING INFORMATION',
}
corv_sections = [
    sec('1', 'INDICATIONS AND USAGE', subs=[
        sub('1.1', 'Hypertension', P('CORVENZA is indicated for the treatment of hypertension, to lower blood pressure. Lowering blood pressure reduces the risk of fatal and nonfatal cardiovascular events, primarily strokes and myocardial infarctions.')),
        sub('1.2', 'Diabetic Nephropathy', P('CORVENZA is indicated for the treatment of diabetic nephropathy with an elevated serum creatinine and proteinuria (more than 300 mg/day) in patients with type 2 diabetes and hypertension. In this population, CORVENZA reduces the rate of progression of nephropathy as measured by the doubling of serum creatinine or end-stage renal disease [see Clinical Studies (14.2)].')),
    ]),
    sec('2', 'DOSAGE AND ADMINISTRATION', subs=[
        sub('2.1', 'Hypertension', P('The recommended starting dosage is 40 mg once daily. The dosage range is 20 mg to 80 mg once daily. Most of the antihypertensive effect is present within 2 weeks.')),
        sub('2.2', 'Diabetic Nephropathy', P('The recommended dosage in patients with diabetic nephropathy is 80 mg once daily.')),
    ]),
    sec('3', 'DOSAGE FORMS AND STRENGTHS', P('Tablets: 20 mg, 40 mg and 80 mg, white, oval, debossed "NM" and the strength.')),
    sec('4', 'CONTRAINDICATIONS', UL('CORVENZA is contraindicated in patients who are hypersensitive to talmisartan or any component of this product.', 'Do not coadminister aliskiren with CORVENZA in patients with diabetes [see Drug Interactions (7.3)].')),
    sec('5', 'WARNINGS AND PRECAUTIONS', subs=[
        sub('5.1', 'Fetal Toxicity', P('Use of drugs that act on the renin-angiotensin system during the second and third trimesters of pregnancy reduces fetal renal function and increases fetal and neonatal morbidity and death. When pregnancy is detected, discontinue CORVENZA as soon as possible [see Use in Specific Populations (8.1)].')),
        sub('5.2', 'Hypotension in Volume- or Salt-Depleted Patients', P('In patients with an activated renin-angiotensin system, such as volume- or salt-depleted patients, symptomatic hypotension may occur after starting CORVENZA. Correct volume or salt depletion before starting treatment.')),
        sub('5.3', 'Hyperkalemia', P('Hyperkalemia may occur, especially in patients with renal impairment or diabetes, or those taking potassium supplements or potassium-sparing diuretics. Monitor serum potassium periodically.')),
        sub('5.4', 'Impaired Renal Function', P('Changes in renal function, including acute renal failure, can be caused by drugs that inhibit the renin-angiotensin system. Monitor renal function periodically and consider withholding or discontinuing therapy in patients who develop a clinically significant decrease in renal function.')),
    ]),
    sec('6', 'ADVERSE REACTIONS', subs=[
        sub('6.1', 'Clinical Trials Experience',
            P('Because clinical trials are conducted under widely varying conditions, adverse reaction rates observed in the clinical trials of a drug cannot be directly compared to rates in the clinical trials of another drug and may not reflect the rates observed in practice.'),
            P('Hypertension: In placebo-controlled trials in 1,850 patients, adverse reactions occurring in at least 3% of patients and more often than with placebo were dizziness (4% vs 2%), back pain (3% vs 1%) and upper respiratory tract infection (3% vs 2%).'),
            P('Diabetic Nephropathy: In the RENEW-DN study, hyperkalemia was reported in 18% of patients treated with CORVENZA and 6% of patients given placebo.')),
    ]),
    sec('7', 'DRUG INTERACTIONS', subs=[
        sub('7.1', 'Agents Increasing Serum Potassium', P('Coadministration with potassium-sparing diuretics, potassium supplements or salt substitutes containing potassium may increase serum potassium.')),
        sub('7.2', 'NSAIDs', P('In elderly, volume-depleted or renally impaired patients, coadministration of NSAIDs with CORVENZA may worsen renal function. Monitor renal function periodically.')),
        sub('7.3', 'Dual Blockade of the Renin-Angiotensin System', P('Dual blockade with an ARB, an ACE inhibitor or aliskiren increases the risks of hypotension, hyperkalemia and changes in renal function. Do not coadminister aliskiren with CORVENZA in patients with diabetes.')),
    ]),
    sec('8', 'USE IN SPECIFIC POPULATIONS', subs=[
        sub('8.1', 'Pregnancy', P('Risk Summary'), P('CORVENZA can cause fetal harm when administered to a pregnant woman. Use of drugs that act on the renin-angiotensin system during the second and third trimesters of pregnancy reduces fetal renal function and increases fetal and neonatal morbidity and death. When pregnancy is detected, discontinue CORVENZA as soon as possible.')),
        sub('8.2', 'Lactation', P('Risk Summary'), P('There is no information on the presence of talmisartan in human milk. Talmisartan is present in rat milk. Because of the potential for serious adverse reactions in the breastfed infant, including hypotension, hyperkalemia and renal impairment, advise women not to breastfeed during treatment with CORVENZA.')),
        sub('8.4', 'Pediatric Use', P('Safety and effectiveness in pediatric patients have not been established.')),
        sub('8.5', 'Geriatric Use', P('No overall differences in effectiveness or safety were observed between patients 65 years and older and younger patients.')),
    ]),
    sec('10', 'OVERDOSAGE', P('The most likely signs of overdose are hypotension, dizziness and tachycardia. Give supportive treatment. Talmisartan is not removed by hemodialysis.')),
    sec('11', 'DESCRIPTION', P('CORVENZA (talmisartan) is an angiotensin II receptor blocker. Each tablet contains 20 mg, 40 mg or 80 mg of talmisartan and the following inactive ingredients: mannitol, sodium hydroxide, meglumine, povidone and magnesium stearate.')),
    sec('12', 'CLINICAL PHARMACOLOGY', subs=[
        sub('12.1', 'Mechanism of Action', P('Talmisartan blocks the vasoconstrictor and aldosterone-secreting effects of angiotensin II by selectively blocking the binding of angiotensin II to the AT1 receptor.')),
        sub('12.2', 'Pharmacodynamics', P('Talmisartan inhibits the pressor effect of an angiotensin II infusion in a dose-related manner. The effect lasts for at least 24 hours after a single dose.')),
        sub('12.3', 'Pharmacokinetics', P('Peak concentrations are reached 0.5 to 1 hour after dosing. The terminal half-life is about 24 hours. Talmisartan is eliminated mainly in feces as unchanged drug.')),
    ]),
    sec('13', 'NONCLINICAL TOXICOLOGY', subs=[sub('13.1', 'Carcinogenesis, Mutagenesis, Impairment of Fertility', P('Talmisartan was not carcinogenic in mice or rats and was not mutagenic. No effects on fertility were seen in rats.'))]),
    sec('14', 'CLINICAL STUDIES', subs=[
        sub('14.1', 'Hypertension', P('In placebo-controlled studies in 1,850 patients with hypertension, talmisartan 20 mg to 80 mg once daily lowered trough seated blood pressure by 7 to 13 mm Hg systolic and 5 to 8 mm Hg diastolic more than placebo.')),
        sub('14.2', 'Diabetic Nephropathy', P('The RENEW-DN study randomized 1,320 hypertensive patients with type 2 diabetes and nephropathy to talmisartan 80 mg or placebo. Talmisartan reduced the risk of the composite of doubling of serum creatinine or end-stage renal disease by 22% compared with placebo over a mean of 2.6 years.')),
    ]),
    sec('16', 'HOW SUPPLIED/STORAGE AND HANDLING', UL('20 mg tablets: bottles of 30 (NDC 99998-0020-3)', '40 mg tablets: bottles of 30 (NDC 99998-0040-3)', '80 mg tablets: bottles of 30 (NDC 99998-0080-3)'), P('Store at 25°C (77°F); excursions permitted to 15°C to 30°C (59°F to 86°F). Protect from moisture.')),
    sec('17', 'PATIENT COUNSELING INFORMATION',
        P('Pregnancy: Tell female patients of childbearing age about the consequences of exposure to CORVENZA during pregnancy and ask them to report pregnancies as soon as possible [see Warnings and Precautions (5.1)].'),
        P('Lactation: Advise women not to breastfeed during treatment with CORVENZA [see Use in Specific Populations (8.2)].'),
        P(f'Distributed by: {MFR_NM}, Fictionburg, PA 19000, USA.')),
]
CARVE = [{'num': '1.2', 'name': 'Diabetic Nephropathy', 'protected': 'Method-of-use patent (fictional) listed for the diabetic nephropathy indication until 2029.',
          'keywords': ['diabetic nephropathy', 'nephropathy', 'RENEW-DN', 'doubling of serum creatinine', 'end-stage renal disease', 'proteinuria']}]
corv_pi = pi_doc(corv_meta, corv_hl, corv_bw, corv_sections, carveOuts=CARVE, role='reference')

# ======================================================================= Talmisartan Tablets (generic, Ashvale) with an incomplete carve-out
MFR_AG = 'Ashvale Generics Ltd.'
PHONE_AG = '1-800-555-0163'
gen = copy.deepcopy(corv_pi)
gen['role'] = 'generic'
gen['meta'].update({'proprietaryName': 'TALMISARTAN TABLETS', 'revised': '09/2026', 'manufacturer': MFR_AG, 'phone': PHONE_AG, 'strengths': ['20 mg', '40 mg']})
def rename(o):
    if isinstance(o, dict):
        return {k: rename(v) for k, v in o.items()}
    if isinstance(o, list):
        return [rename(x) for x in o]
    if isinstance(o, str):
        return o.replace('CORVENZA', 'TALMISARTAN TABLETS').replace(MFR_NM, MFR_AG).replace(PHONE_NM, PHONE_AG)
    return o
gen = rename(gen)
gen['carveOuts'] = CARVE
gen['carved'] = ['1.2']
G = {s['num']: s for s in gen['sections']}
G['1']['subs'] = [s for s in G['1']['subs'] if s['num'] != '1.2']
G['2']['subs'] = [s for s in G['2']['subs'] if s['num'] != '2.2']
# left behind on purpose: Highlights indication and dosing bullets, 6.1 RENEW-DN sentence, 14.2
G['3']['blocks'] = [P('Tablets: 20 mg and 40 mg, white, round, debossed "AG" and the strength.')]
gen['hl']['dfs'] = [P('Tablets: 20 mg and 40 mg. (3)')]
G['11']['blocks'] = [P('Talmisartan tablets, USP is an angiotensin II receptor blocker. Each tablet contains 20 mg or 40 mg of talmisartan and the following inactive ingredients: lactose monohydrate, maize starch, povidone, sodium hydroxide and magnesium stearate.')]
G['16']['blocks'] = [UL('20 mg tablets: bottles of 30 (NDC 99997-0201-3)', '40 mg tablets: bottles of 30 and 90 (NDC 99997-0401-3, 99997-0401-9)'), P('Store at 20°C to 25°C (68°F to 77°F). Protect from moisture.')]
G['17']['blocks'][-1] = P(f'Manufactured by: {MFR_AG}, Unit II, Example Town, India. Distributed by: Ashvale Generics USA LLC, Fictionburg, NJ 08100, USA.')
# A difference that is not permitted: the hyperkalemia warning lost its monitoring sentence.
G['5']['subs'][2]['blocks'] = [P('Hyperkalemia may occur, especially in patients with renal impairment or diabetes, or those taking potassium supplements or potassium-sparing diuretics.')]
gen['answerKey'] = [
    {'rule': 'US-ANDA-CARVE', 'where': 'Highlights, Indications and Usage', 'what': 'The diabetic nephropathy bullet is still there.'},
    {'rule': 'US-ANDA-CARVE', 'where': 'Highlights, Dosage and Administration', 'what': 'The diabetic nephropathy dosing bullet (2.2) is still there.'},
    {'rule': 'US-ANDA-CARVE', 'where': '6.1', 'what': 'The RENEW-DN adverse reaction sentence is still there.'},
    {'rule': 'US-ANDA-CARVE', 'where': '14.2', 'what': 'The diabetic nephropathy study is still there.'},
    {'rule': 'US-ANDA-SAME', 'where': '5.3', 'what': 'The monitoring sentence in Hyperkalemia was dropped; this is not a permitted difference.'},
]

# ======================================================================= Nelvaprox: older-format PI for the conversion exercise
MFR_MD = 'Meridale Therapeutics Inc.'
def OB(text, target):
    b = P(text)
    b['target'] = target
    return b
nel_old = {
    'kind': 'pi-old',
    'meta': {'proprietaryName': 'NELVAPROX', 'establishedName': 'velnaprozine', 'dosageForm': 'injection', 'route': 'for intravenous use', 'initialApproval': '2004', 'revised': '11/2019', 'manufacturer': MFR_MD, 'phone': '1-800-555-0119'},
    'sections': [
        sec('A', 'DESCRIPTION', OB('NELVAPROX (velnaprozine) Injection is a sterile, clear, colorless solution for intravenous use. Each mL contains 10 mg velnaprozine, sodium citrate, citric acid and sodium chloride in water for injection.', '11')),
        sec('B', 'CLINICAL PHARMACOLOGY',
            OB('Velnaprozine is a selective antagonist of the fictional NK-3B receptor in the chemoreceptor trigger zone.', '12.1'),
            OB('After a 10 mg intravenous dose, the elimination half-life is about 9 hours. Velnaprozine is metabolized by CYP2D6 and CYP3A4.', '12.3'),
            OB('Clinical Trials: In two studies in 1,140 adults undergoing elective surgery, a single 10 mg dose given at the end of surgery reduced the incidence of vomiting in the first 24 hours from 41% (placebo) to 22%.', '14')),
        sec('C', 'INDICATIONS AND USAGE', OB('NELVAPROX is indicated for the prevention of postoperative nausea and vomiting in adults undergoing elective surgery.', '1')),
        sec('D', 'CONTRAINDICATIONS', OB('NELVAPROX is contraindicated in patients with known hypersensitivity to velnaprozine.', '4')),
        sec('E', 'WARNINGS', OB('QT Prolongation: NELVAPROX prolongs the QT interval in a dose-related manner. Avoid use in patients with congenital long QT syndrome. Correct hypokalemia and hypomagnesemia before administration.', '5.1')),
        sec('F', 'PRECAUTIONS',
            OB('Serotonin Syndrome: Cases of serotonin syndrome have been reported when NELVAPROX was used with serotonergic drugs.', '5.2'),
            OB('Drug Interactions: Strong CYP3A4 inhibitors increase velnaprozine exposure; no dose adjustment is needed for a single dose.', '7'),
            OB('Pregnancy: Teratogenic Effects. Pregnancy Category B. Reproduction studies in rats and rabbits showed no harm to the fetus. There are no adequate and well-controlled studies in pregnant women.', '8.1'),
            OB('Nursing Mothers: It is not known whether velnaprozine is excreted in human milk. Caution should be exercised when NELVAPROX is given to a nursing woman.', '8.2'),
            OB('Pediatric Use: Safety and effectiveness in pediatric patients have not been established.', '8.4'),
            OB('Geriatric Use: No overall differences in safety or effectiveness were observed in patients 65 years and older.', '8.5'),
            OB('Information for Patients: Tell patients to report palpitations, fainting or symptoms of serotonin syndrome.', '17')),
        sec('G', 'ADVERSE REACTIONS', OB('In clinical trials, the most common adverse reactions (at least 2% and more than placebo) were headache (7% vs 5%), constipation (5% vs 3%) and dizziness (3% vs 2%).', '6.1')),
        sec('I', 'OVERDOSAGE', OB('There is no specific antidote. Overdose may cause QT prolongation; monitor the ECG and give supportive care.', '10')),
        sec('J', 'DOSAGE AND ADMINISTRATION', OB('Give 10 mg as a single intravenous injection over at least 30 seconds at the end of surgery. Do not mix with other drugs.', '2')),
        sec('K', 'HOW SUPPLIED', OB('NELVAPROX Injection, 10 mg/mL: 5 mL single-dose vials in cartons of 10. Store below 25°C. Do not freeze. Protect from light.', '16')),
    ],
}

# Nelvaprox carton with errors (injectable: strength per total volume and per mL)
nel_carton = {
    'kind': 'carton',
    'fields': {
        'proprietaryName': 'NELVAPROX', 'establishedName': '(velnaprozine) injection', 'strength': '10.0 mg/mL', 'dosageForm': 'injection', 'route': 'For intravenous use only',
        'netQuantity': '10 x 5 mL single-dose vials', 'rxOnly': '', 'ndc': 'NDC 99996-501', 'dosageStatement': 'Recommended dosage: See prescribing information.',
        'storage': 'Store below 25°C. Do not freeze. Keep vials in the carton to protect from light.', 'lot': 'LOT: XXXXXX', 'expiry': 'EXP: YYYY-MM',
        'manufacturer': 'Manufactured for: Meridale Therapeutics Inc., Fictionville, DE 19000, USA', 'mgStatement': '',
    },
    'sizes': {'proprietaryName': 16, 'establishedName': 6, 'strength': 12},
    'barcode': False, 'twoD': True, 'colour': '#6a3f8f', 'injectable': True,
    'answerKey': [
        {'rule': 'US-ME-TZ', 'where': 'Strength', 'what': 'Trailing zero in "10.0 mg/mL".'},
        {'rule': 'US-CC-PERML', 'where': 'Strength', 'what': 'Strength per total volume is missing (50 mg/5 mL (10 mg/mL)).'},
        {'rule': 'US-CC-REQ', 'where': 'Rx only', 'what': '"Rx only" is missing.'},
        {'rule': 'US-CC-NDC', 'where': 'NDC', 'what': 'NDC is not 10 digits in a valid configuration.'},
        {'rule': 'US-CC-BARCODE', 'where': 'Bar code', 'what': 'No linear bar code.'},
        {'rule': 'US-CC-ESTNAME', 'where': 'Names', 'what': 'Established name (6 pt) is less than half the proprietary name (16 pt).'},
    ],
}

# ======================================================================= Brezovent: patient labelling (PPI and IFU)
MFR_NV = 'Northvale Respiratory Inc.'
brz_ppi = {
    'kind': 'ppi',
    'meta': {'proprietaryName': 'BREZOVENT', 'establishedName': 'tavoterol', 'dosageForm': 'inhalation aerosol', 'revised': '04/2026', 'manufacturer': MFR_NV},
    'fixed': {'header': 'PATIENT INFORMATION', 'approval': 'This Patient Information has been approved by the U.S. Food and Drug Administration.'},
    'sections': [
        sec('p1', 'What is BREZOVENT?', P('BREZOVENT is a prescription medicine used to quickly relieve wheezing and shortness of breath (bronchospasm) in people 12 years of age and older with asthma.'), P('It is not known if BREZOVENT is safe and effective in children under 12 years of age.')),
        sec('p2', 'Who should not take BREZOVENT?', P('Do not use BREZOVENT if you are allergic to tavoterol or any of the ingredients in BREZOVENT.')),
        sec('p3', 'What should I tell my healthcare provider before taking BREZOVENT?', UL('have heart problems or high blood pressure', 'have seizures', 'have thyroid problems', 'have diabetes', 'are pregnant or breastfeeding')),
        sec('p4', 'How should I take BREZOVENT?', UL('Read the Instructions for Use at the end of this leaflet before you use BREZOVENT.', 'The usual dose is 2 puffs every 4 to 6 hours as needed.', 'Do not use BREZOVENT more often than prescribed. Call your healthcare provider if your breathing problems get worse or you need to use BREZOVENT more often than usual.')),
        sec('p5', 'What are the possible side effects of BREZOVENT?', P('BREZOVENT can cause serious side effects, including worsening trouble breathing right after use, heart problems such as a fast heartbeat, and low potassium in your blood.'), P('The most common side effects include nervousness, shaking (tremor) and headache.'), P('Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088.')),
        sec('p6', 'How should I store BREZOVENT?', UL('Store at room temperature between 68°F and 77°F (20°C and 25°C).', 'The canister is under pressure. Do not puncture it or put it near heat or an open flame.', 'Keep BREZOVENT and all medicines out of the reach of children.')),
        sec('p7', 'General information about the safe and effective use of BREZOVENT.', P('Medicines are sometimes prescribed for purposes other than those listed in a Patient Information leaflet. Do not use BREZOVENT for a condition for which it was not prescribed. Do not give it to other people.')),
        sec('p8', 'What are the ingredients in BREZOVENT?', P('Active ingredient: tavoterol'), P('Inactive ingredients: propellant HFA-134a, ethanol and oleic acid.')),
    ],
}
brz_ifu = {
    'kind': 'ifu',
    'meta': {'proprietaryName': 'BREZOVENT', 'establishedName': 'tavoterol', 'dosageForm': 'inhalation aerosol', 'revised': '04/2026', 'manufacturer': MFR_NV},
    'fixed': {'header': 'INSTRUCTIONS FOR USE', 'approval': 'This Instructions for Use has been approved by the U.S. Food and Drug Administration.'},
    'sections': [
        sec('i1', 'Important information you need to know before using BREZOVENT', UL('BREZOVENT is for oral inhalation only.', 'Use the inhaler only with the canister that comes with it.', 'The counter on the back of the inhaler shows how many puffs are left.')),
        sec('i2', 'Supplies you will need', UL('BREZOVENT inhaler (canister in an actuator, with cap)')),
        sec('i3', 'Preparing your dose', P('Priming: Before you use BREZOVENT for the first time, or if you have not used it for more than 14 days, spray 4 test puffs into the air, away from your face, shaking well before each puff.')),
        sec('i4', 'Using BREZOVENT', UL('Step 1. Shake the inhaler well for 5 seconds and take the cap off the mouthpiece.', 'Step 2. Breathe out fully through your mouth.', 'Step 3. Put the mouthpiece in your mouth and close your lips around it.', 'Step 4. Push the top of the canister all the way down while you breathe in deeply and slowly through your mouth.', 'Step 5. Hold your breath for as long as you can, up to 10 seconds, then breathe out slowly.', 'Step 6. If your healthcare provider has told you to take another puff, wait 1 minute and repeat Steps 1 to 5.', 'Step 7. Put the cap back on the mouthpiece.')),
        sec('i5', 'Storing BREZOVENT', UL('Store at room temperature between 68°F and 77°F (20°C and 25°C).')),
        sec('i6', 'Disposing of BREZOVENT', P('Throw the inhaler away when the counter reads 0, or 12 months after you open the foil pouch, whichever comes first. Do not throw the canister into a fire or incinerator.')),
    ],
}

# ======================================================================= Projects
def doc(id, title, body, status='draft'):
    d = {'id': id, 'title': title, 'status': status}
    d.update(body)
    return d

SAMPLES = [
    {'id': 'ostrevia-clean', 'productId': 'nce-tablet', 'title': 'Ostrevia: clean label set', 'level': 'Start here',
     'about': 'A complete, clean PLR prescribing information with a boxed warning, its Medication Guide, carton and bottle label. Use it to see what a passing label looks like and to try the editor.',
     'docs': [doc('pi', 'Prescribing information', ost_pi), doc('mg', 'Medication Guide', ost_mg), doc('carton', 'Carton, 10 mg bottle of 30', ost_carton, ), doc('container', 'Bottle label, 10 mg', ost_container)],
     'proof': {'docId': 'carton', 'fields': ost_proof, 'answerKey': [{'where': 'Storage', 'what': 'Closing parenthesis missing.'}, {'where': 'NDC', 'what': 'Package code 8 instead of 3.'}]}},
    {'id': 'ostrevia-errors', 'productId': 'nce-tablet', 'title': 'Ostrevia: find and fix the errors', 'level': 'Practice',
     'about': 'The same label set with about 25 planted errors across Highlights, the full prescribing information, the Medication Guide and the carton. Run the checks, fix each one, and compare with the answer key.',
     'docs': [doc('pi', 'Prescribing information', ost_pi_err), doc('mg', 'Medication Guide', ost_mg_err), doc('carton', 'Carton, 10 mg bottle of 30', ost_carton_err)]},
    {'id': 'talmisartan-generic', 'productId': 'generic-tablet', 'title': 'Talmisartan Tablets: compare with the reference and carve out', 'level': 'Practice',
     'about': 'A generic label drafted from the reference listed drug (CORVENZA, fictional). The diabetic nephropathy indication is protected and must be carved out under section viii; the draft only half did it, and one difference is not permitted.',
     'docs': [doc('ref', 'Reference label: CORVENZA (RLD)', corv_pi, status='approved'), doc('pi', 'Prescribing information (generic draft)', gen)]},
    {'id': 'nelvaprox-convert', 'productId': 'sterile-injectable', 'title': 'Nelvaprox: convert to PLR and fix the carton', 'level': 'Practice',
     'about': 'An older-format label (21 CFR 201.80) to convert into PLR sections, and an injectable carton with six planted errors.',
     'docs': [doc('old', 'Prescribing information (older format)', nel_old), doc('carton', 'Carton, 10 x 5 mL vials', nel_carton)]},
    {'id': 'brezovent-patient', 'productId': 'mdi-aerosol', 'title': 'Brezovent: patient labelling', 'level': 'Practice',
     'about': 'A Patient Information leaflet and an Instructions for Use for a metered-dose inhaler. Use the readability panel to make them plainer.',
     'docs': [doc('ppi', 'Patient Information', brz_ppi), doc('ifu', 'Instructions for Use', brz_ifu)]},
]
