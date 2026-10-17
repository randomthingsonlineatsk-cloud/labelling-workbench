"""Biosimilar labelling exercise: ARVENTA (olvecitamab), the fictional reference product licensed
under section 351(a), and SELVANTA (olvecitamab-kzrt), its fictional biosimilar under 351(k).
All names, studies, companies and phone numbers are fictional."""
import copy
from lib import AR, P, UL, T, sub, sec

MFR_LB = 'Lumenfield Biologics Inc.'
PHONE_LB = '1-800-555-0177'
MFR_BB = 'Brightmere Biosimilars Ltd.'
PHONE_BB = '1-800-555-0188'

BIO_FOOTNOTE = ('* Biosimilar means that the biological product is approved based on data demonstrating that it is highly similar to an FDA-approved biological product, '
                'known as a reference product, and that there are no clinically meaningful differences between the biosimilar product and the reference product. '
                'Biosimilarity of {NAME} has been demonstrated for the condition(s) of use (e.g., indication(s), dosing regimen(s)), strength(s), dosage form(s), and route(s) '
                'of administration described in its Full Prescribing Information.')

arv_meta = {'proprietaryName': 'ARVENTA', 'establishedName': 'olvecitamab', 'dosageForm': 'injection, for intravenous use', 'route': 'for intravenous use',
            'controlled': '', 'initialApproval': '2022', 'revised': '06/2026', 'manufacturer': MFR_LB, 'phone': PHONE_LB, 'patientLabeling': '',
            'strengths': ['100 mg/10 mL', '10 mg/mL']}

arv_hl = {
    'limitation': 'These highlights do not include all the information needed to use ARVENTA safely and effectively. See full prescribing information for ARVENTA.',
    'bw': [], 'bwClose': '', 'rmc': [],
    'ind': [P('ARVENTA is an interleukin-36 receptor antagonist indicated for the treatment of adults with moderate-to-severe chronic hand eczema who are candidates for systemic therapy. (1)')],
    'da': [UL('Administer as an intravenous infusion over 60 minutes. (2.1)', 'Recommended dosage: 10 mg/kg at Weeks 0, 2 and 4, then every 8 weeks. (2.1)',
              'Dilute in 0.9% Sodium Chloride Injection before use. (2.2)')],
    'dfs': [P('Injection: 100 mg/10 mL (10 mg/mL) in a single-dose vial. (3)')],
    'ci': [P('Known serious hypersensitivity to olvecitamab or to any of the excipients. (4)')],
    'wp': [UL('Hypersensitivity and infusion-related reactions: If a serious reaction occurs, stop the infusion and start appropriate treatment. (5.1)',
              'Infections: Do not start during an active, serious infection. Test for tuberculosis before treatment. (5.2)',
              'Live vaccines: Avoid live vaccines during treatment. (5.3)')],
    'ar': [P('Most common adverse reactions (incidence at least 5% and greater than placebo) are infusion-related reactions, nasopharyngitis and headache. (6.1)'),
           P(f'To report SUSPECTED ADVERSE REACTIONS, contact {MFR_LB} at {PHONE_LB} or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.')],
    'usp': [],
    'pci': 'See 17 for PATIENT COUNSELING INFORMATION',
}

def arv_sections(name, est):
    return [
        sec('1', 'INDICATIONS AND USAGE', P(f'{name} is indicated for the treatment of adults with moderate-to-severe chronic hand eczema who are candidates for systemic therapy.')),
        sec('2', 'DOSAGE AND ADMINISTRATION', subs=[
            sub('2.1', 'Recommended Dosage', P(f'The recommended dosage of {name} is 10 mg/kg administered as an intravenous infusion over 60 minutes at Weeks 0, 2 and 4, then every 8 weeks.')),
            sub('2.2', 'Preparation and Administration', P(f'Dilute the required volume of {name} in 0.9% Sodium Chloride Injection to a final volume of 250 mL. Administer through an infusion set with a 0.2 micron in-line filter. Do not infuse with other medicines.')),
        ]),
        sec('3', 'DOSAGE FORMS AND STRENGTHS', P('Injection: 100 mg/10 mL (10 mg/mL) clear to slightly opalescent, colorless to pale yellow solution in a single-dose vial.')),
        sec('4', 'CONTRAINDICATIONS', P(f'{name} is contraindicated in patients with known serious hypersensitivity to {est} or to any of the excipients [see Warnings and Precautions (5.1)].')),
        sec('5', 'WARNINGS AND PRECAUTIONS', subs=[
            sub('5.1', 'Hypersensitivity and Infusion-Related Reactions', P(f'Serious hypersensitivity reactions, including anaphylaxis, and infusion-related reactions have occurred. If a serious reaction occurs, stop the infusion and start appropriate treatment. Monitor patients during and for 1 hour after each infusion.')),
            sub('5.2', 'Infections', P(f'{name} may increase the risk of infections. Do not start treatment in patients with an active, serious infection. Test for tuberculosis before starting {name}.')),
            sub('5.3', 'Live Vaccines', P(f'Avoid use of live vaccines in patients treated with {name}.')),
        ]),
        sec('6', 'ADVERSE REACTIONS', P('The following clinically significant adverse reactions are described elsewhere in the labeling:'),
            UL('Hypersensitivity and Infusion-Related Reactions [see Warnings and Precautions (5.1)]', 'Infections [see Warnings and Precautions (5.2)]'),
            subs=[
                sub('6.1', 'Clinical Trials Experience',
                    P('Because clinical trials are conducted under widely varying conditions, adverse reaction rates observed in the clinical trials of a drug cannot be directly compared to rates in the clinical trials of another drug and may not reflect the rates observed in practice.'),
                    P(f'The safety of {est} was evaluated in two placebo-controlled studies in 640 adults with chronic hand eczema.'),
                    AR(['Adverse reaction', f'{est} 10 mg/kg (N=321)', 'Placebo (N=319)'], ['Infusion-related reaction', '8%', '2%'], ['Nasopharyngitis', '7%', '5%'], ['Headache', '6%', '4%'])),
                sub('6.2', 'Immunogenicity', P('Anti-drug antibodies developed in 4% of patients; there was no identified effect on safety or effectiveness.')),
            ]),
        sec('7', 'DRUG INTERACTIONS', P(f'No formal drug interaction studies have been conducted with {est}.')),
        sec('8', 'USE IN SPECIFIC POPULATIONS', subs=[
            sub('8.1', 'Pregnancy', P('Risk Summary'), P(f'There are no available data on {est} use in pregnant women. Human IgG is known to cross the placental barrier. In an animal reproduction study, no adverse developmental effects were observed.')),
            sub('8.2', 'Lactation', P('Risk Summary'), P(f'There are no data on the presence of {est} in human milk. Consider the benefits of breastfeeding together with the mother\'s clinical need for {name}.')),
            sub('8.4', 'Pediatric Use', P('Safety and effectiveness in pediatric patients have not been established.')),
            sub('8.5', 'Geriatric Use', P('No overall differences in safety or effectiveness were observed between patients 65 years and older and younger adult patients.')),
        ]),
        sec('10', 'OVERDOSAGE', P('There is no specific treatment for overdose. Monitor for signs or symptoms of adverse reactions and give appropriate treatment.')),
        sec('11', 'DESCRIPTION', P(f'{est.capitalize()} is a humanized IgG1 monoclonal antibody (fictional) produced in Chinese hamster ovary cells. {name} injection is a sterile, preservative-free solution: each 10 mL single-dose vial contains 100 mg of {est}, histidine, sucrose, polysorbate 80 and Water for Injection.')),
        sec('12', 'CLINICAL PHARMACOLOGY', subs=[
            sub('12.1', 'Mechanism of Action', P(f'{est.capitalize()} binds the interleukin-36 receptor and blocks signaling that drives skin inflammation.')),
            sub('12.2', 'Pharmacodynamics', P('Reductions in inflammatory markers in skin were seen by Week 4.')),
            sub('12.3', 'Pharmacokinetics', P('Steady state was reached by Week 12. The terminal half-life was about 21 days.')),
        ]),
        sec('13', 'NONCLINICAL TOXICOLOGY', subs=[sub('13.1', 'Carcinogenesis, Mutagenesis, Impairment of Fertility', P('Carcinogenicity and genotoxicity studies have not been conducted. No effects on fertility were seen in monkeys.'))]),
        sec('14', 'CLINICAL STUDIES', P(f'In two 16-week studies (fictional ARC-1 and ARC-2), 41% of patients given {est} 10 mg/kg reached clear or almost clear hands, against 13% given placebo.')),
        sec('16', 'HOW SUPPLIED/STORAGE AND HANDLING', P(f'{name} injection: 100 mg/10 mL in a single-dose vial, carton of 1 vial. Store in a refrigerator at 2°C to 8°C in the original carton to protect from light. Do not freeze. Do not shake.')),
        sec('17', 'PATIENT COUNSELING INFORMATION', P('Advise patients to report signs of an allergic reaction or an infusion reaction, and signs of infection, to their healthcare provider right away.')),
    ]


arv_pi = {'kind': 'pi', 'role': 'reference', 'meta': arv_meta, 'hl': arv_hl, 'bw': None, 'sections': arv_sections('ARVENTA', 'olvecitamab')}

# ---------------------------------------------------------------- SELVANTA (biosimilar), draft with planted errors
sel_meta = {**arv_meta, 'proprietaryName': 'SELVANTA', 'establishedName': 'olvecitamab-kzrt', 'initialApproval': '2025', 'revised': '09/2026', 'manufacturer': MFR_BB, 'phone': PHONE_BB,
            'reference': {'name': 'ARVENTA', 'est': 'olvecitamab'}}
sel_hl = copy.deepcopy(arv_hl)
sel_hl['limitation'] = 'These highlights do not include all the information needed to use SELVANTA safely and effectively. See full prescribing information for SELVANTA.'
sel_hl['ind'] = [P('SELVANTA is an interleukin-36 receptor antagonist indicated for the treatment of adults with moderate-to-severe chronic hand eczema who are candidates for systemic therapy. (1)')]
sel_hl['ar'] = [P('Most common adverse reactions (incidence at least 5% and greater than placebo) are infusion-related reactions, nasopharyngitis and headache. (6.1)'),
                P(f'To report SUSPECTED ADVERSE REACTIONS, contact {MFR_BB} at {PHONE_BB} or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.')]
sel_hl['bio'] = 'SELVANTA (olvecitamab-kzrt) is biosimilar* to ARVENTA (olvecitamab).'
sel_hl['bioNote'] = BIO_FOOTNOTE.replace('{NAME}', 'SELVANTA')

sel_pi = {'kind': 'pi', 'role': 'biosimilar', 'meta': sel_meta, 'hl': sel_hl, 'bw': None, 'sections': arv_sections('SELVANTA', 'olvecitamab-kzrt')}
# Section 16 describes the biosimilar's own presentation and storage (a permitted difference).
for s in sel_pi['sections']:
    if s['num'] == '16':
        s['blocks'] = [P('SELVANTA injection: 100 mg/10 mL in a single-dose vial, carton of 1 vial. Store in a refrigerator at 2°C to 8°C in the original carton to protect from light. Do not freeze. Discard unused portion.')]
    if s['num'] == '11':
        s['blocks'] = [P('Olvecitamab-kzrt is a humanized IgG1 monoclonal antibody (fictional) produced in Chinese hamster ovary cells. SELVANTA injection is a sterile, preservative-free solution: each 10 mL single-dose vial contains 100 mg of olvecitamab-kzrt, histidine, trehalose, polysorbate 20 and Water for Injection.')]

sel_err = copy.deepcopy(sel_pi)
sel_err['status'] = 'draft'
sel_err['answerKey'] = []
K = lambda rule, where, what: sel_err['answerKey'].append({'rule': rule, 'where': where, 'what': what})
sel_err['hl']['bioNote'] = ''
K('US-BIO-STMT', 'Highlights, biosimilarity statement', 'The footnote explaining what biosimilar means is missing.')
for s in sel_err['sections']:
    if s['num'] == '5':
        for x in s['subs']:
            if x['num'] == '5.1':
                x['blocks'] = [P('Serious hypersensitivity reactions, including anaphylaxis, and infusion-related reactions have occurred with ARVENTA. If a serious reaction occurs, stop the infusion and start appropriate treatment. Monitor patients during and for 1 hour after each infusion.')]
K('US-BIO-NAME', '5.1', 'Describes the risk for ARVENTA instead of SELVANTA.')
for s in sel_err['sections']:
    if s['num'] == '17':
        s['blocks'].append(P('SELVANTA is interchangeable with its reference product and may be substituted at the pharmacy.'))
K('US-BIO-IC', '17', 'An interchangeability statement: the 2023 revised draft no longer recommends it (Watch, a hint only).')

DOC = lambda id, title, d, status='approved': {'id': id, 'title': title, 'status': d.get('status', status), **d}
SAMPLES_BIO = [
    {'id': 'selvanta-biosimilar', 'productId': 'biosimilar-mab', 'region': 'us', 'title': 'Selvanta: biosimilar labeling', 'level': 'Practice',
     'about': 'A draft label for SELVANTA (olvecitamab-kzrt), a fictional biosimilar to ARVENTA (olvecitamab). Add the biosimilarity statement and its footnote, describe the product by its own name, and see how FDA now treats interchangeability (Watch).',
     'docs': [DOC('ref', 'Reference product label: ARVENTA', arv_pi), DOC('pi', 'Prescribing information (biosimilar draft)', sel_err)]},
]
