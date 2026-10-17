"""EU generic SmPC against its reference SmPC. Corvenza (talmisartan), the fictional reference
medicinal product, and Talmisartan Ashvale, a fictional generic authorised through the
decentralised procedure. One indication of the reference is still covered by a (fictional)
patent, so the generic leaves it out under Article 11 of Directive 2001/83/EC."""
import copy
from lib import P, T, sec, sub
from eu_core import REPORT_SMPC

REF_MAH = 'Northmere Pharma Europe B.V., Voorbeeldlaan 5, 4000 DD Fictiestad, Netherlands'
GEN_MAH = 'Ashvale Generics Europe B.V., Voorbeeldstraat 10, 1000 AA Voorbeeldstad, Netherlands'

DN = ['diabetic nephropathy', 'nephropathy', 'RENEW-DN', 'doubling of serum creatinine', 'end-stage renal disease', 'proteinuria']
CARVE = [{'num': 'dn', 'name': 'Diabetic nephropathy', 'protected': 'Indication still covered by a (fictional) patent until 2029; left out under Article 11 of Directive 2001/83/EC.', 'keywords': DN}]


def smpc(name, mah, ma, first, revised, strengths, excipients, shelf, extra_ind=True):
    forms = ', '.join(f'{name} {s} tablets' for s in strengths)
    ind = [P(f'{name} is indicated for the treatment of essential hypertension in adults.')]
    if extra_ind:
        ind.append(P(f'{name} is indicated for the treatment of renal disease in adult patients with hypertension and type 2 diabetic nephropathy as part of an antihypertensive medicinal product regimen.'))
    pos = [P('Hypertension: the usual effective dose is 40 mg once daily. Some patients may already benefit at a daily dose of 20 mg. Where the target blood pressure is not achieved, the dose can be increased to a maximum of 80 mg once daily.')]
    if extra_ind:
        pos.append(P('Diabetic nephropathy: the recommended maintenance dose is 80 mg once daily.'))
    pos += [P('Renal impairment: no posology adjustment is required in patients with mild to moderate renal impairment.'),
            P(f'Paediatric population: the safety and efficacy of {name} in children and adolescents aged below 18 years have not been established.'),
            P('Method of administration: oral use. The tablets may be taken with or without food.')]
    ae = [P('Summary of the safety profile: the most common adverse reactions in hypertension were dizziness, back pain and upper respiratory tract infection.'),
          P('Adverse reactions are listed by frequency: very common (≥1/10), common (≥1/100 to <1/10), uncommon (≥1/1,000 to <1/100), rare (≥1/10,000 to <1/1,000).'),
          T(['System organ class', 'Common', 'Uncommon'], ['Infections and infestations', 'Upper respiratory tract infection', ''], ['Nervous system disorders', 'Dizziness', ''],
            ['Musculoskeletal and connective tissue disorders', 'Back pain', ''], ['Metabolism and nutrition disorders', '', 'Hyperkalaemia'])]
    if extra_ind:
        ae.append(P('Diabetic nephropathy: in the RENEW-DN study, hyperkalaemia was reported in 18% of patients and 6% with placebo.'))
    ae += [P('Reporting of suspected adverse reactions'), P(REPORT_SMPC)]
    pd = [P('Mechanism of action: talmisartan is an angiotensin II receptor (type AT1) antagonist.')]
    if extra_ind:
        pd.append(P('Diabetic nephropathy: in RENEW-DN (1,513 patients), talmisartan reduced the risk of doubling of serum creatinine, end-stage renal disease or death by 16% compared with placebo.'))
    return {
        'kind': 'smpc', 'fixed': {'header': 'ANNEX I: SUMMARY OF PRODUCT CHARACTERISTICS', 'blackTriangle': ''},
        'meta': {'proprietaryName': name, 'establishedName': 'talmisartan', 'dosageForm': 'tablets', 'route': 'oral', 'strengths': strengths, 'manufacturer': mah.split(',')[0],
                 'revised': revised, 'additionalMonitoring': False, 'excipients': [], 'lang': 'en', 'procedure': 'dcp', 'maNumber': ma},
        'sections': [
            sec('1', 'NAME OF THE MEDICINAL PRODUCT', *[P(f'{name} {s} tablets') for s in strengths]),
            sec('2', 'QUALITATIVE AND QUANTITATIVE COMPOSITION', *[P(f'Each tablet contains {s} talmisartan.') for s in strengths], P('For the full list of excipients, see section 6.1.')),
            sec('3', 'PHARMACEUTICAL FORM', P('Tablet.'), P('White, oval tablets debossed with the strength.')),
            sec('4', 'CLINICAL PARTICULARS', subs=[
                sub('4.1', 'Therapeutic indications', *ind),
                sub('4.2', 'Posology and method of administration', *pos),
                sub('4.3', 'Contraindications', P('Hypersensitivity to the active substance or to any of the excipients listed in section 6.1.'), P('Second and third trimesters of pregnancy (see sections 4.4 and 4.6).'),
                    P(f'The concomitant use of {name} with aliskiren-containing products is contraindicated in patients with diabetes mellitus or renal impairment (GFR <60 mL/min/1.73 m2).')),
                sub('4.4', 'Special warnings and precautions for use',
                    P('Hyperkalaemia: serum potassium should be monitored in patients at risk, such as those with renal impairment or diabetes, or those taking potassium supplements.'),
                    P('Dual blockade of the renin-angiotensin-aldosterone system (RAAS): concomitant use of ACE inhibitors, angiotensin II receptor blockers or aliskiren increases the risk of hypotension, hyperkalaemia and decreased renal function and is not recommended.'),
                    P('Pregnancy: angiotensin II receptor antagonists should not be initiated during pregnancy. When pregnancy is diagnosed, treatment should be stopped immediately.')),
                sub('4.5', 'Interaction with other medicinal products and other forms of interaction', P('Potassium-sparing diuretics, potassium supplements and salt substitutes containing potassium may increase serum potassium. NSAIDs may reduce the antihypertensive effect and worsen renal function.')),
                sub('4.6', 'Fertility, pregnancy and lactation', P('Pregnancy: not recommended during the first trimester and contraindicated during the second and third trimesters.'), P('Breast-feeding: not recommended.'), P('Fertility: no effects were seen in animal studies.')),
                sub('4.7', 'Effects on ability to drive and use machines', P('Dizziness may occasionally occur when driving or using machines.')),
                sub('4.8', 'Undesirable effects', *ae),
                sub('4.9', 'Overdose', P('The most likely signs of overdose are hypotension and tachycardia. Treatment should be symptomatic and supportive. Talmisartan is not removed by haemodialysis.')),
            ]),
            sec('5', 'PHARMACOLOGICAL PROPERTIES', subs=[
                sub('5.1', 'Pharmacodynamic properties', *pd),
                sub('5.2', 'Pharmacokinetic properties', P('Peak plasma concentrations are reached 0.5 to 1 hour after dosing. The terminal half-life is about 24 hours.')),
                sub('5.3', 'Preclinical safety data', P('Preclinical data reveal no special hazard for humans based on conventional studies. Fetotoxicity was seen in animal studies.')),
            ]),
            sec('6', 'PHARMACEUTICAL PARTICULARS', subs=[
                sub('6.1', 'List of excipients', P(excipients)), sub('6.2', 'Incompatibilities', P('Not applicable.')), sub('6.3', 'Shelf life', P(shelf)),
                sub('6.4', 'Special precautions for storage', P('This medicinal product does not require any special storage conditions.')),
                sub('6.5', 'Nature and contents of container', P('PVC/aluminium blisters of 28 tablets.')),
                sub('6.6', 'Special precautions for disposal', P('Any unused medicinal product or waste material should be disposed of in accordance with local requirements.')),
            ]),
            sec('7', 'MARKETING AUTHORISATION HOLDER', P(mah)),
            sec('8', 'MARKETING AUTHORISATION NUMBER(S)', P(ma)),
            sec('9', 'DATE OF FIRST AUTHORISATION/RENEWAL OF THE AUTHORISATION', P(f'Date of first authorisation: {first}')),
            sec('10', 'DATE OF REVISION OF THE TEXT', P({'08/2026': 'August 2026', '09/2026': 'September 2026'}[revised])),
        ],
    }


REF = {'id': 'ref', 'title': 'Reference SmPC: Corvenza', 'status': 'approved', 'role': 'reference',
       **smpc('Corvenza', REF_MAH, 'NL/H/9801/001-003', '12 March 2014', '08/2026', ['20 mg', '40 mg', '80 mg'], 'Mannitol, sodium hydroxide, meglumine, povidone, magnesium stearate.', '3 years')}
GEN = {'id': 'smpc', 'title': 'SmPC (generic draft): Talmisartan Ashvale', 'status': 'draft', 'role': 'generic', 'carveOuts': CARVE, 'carved': ['dn'],
       **smpc('Talmisartan Ashvale', GEN_MAH, 'NL/H/9902/001-002', '15 November 2022', '09/2026', ['20 mg', '40 mg'], 'Mannitol, sodium stearyl fumarate, crospovidone, microcrystalline cellulose.', '2 years', extra_ind=False)}
GEN['answerKey'] = []
K = lambda rule, where, what: GEN['answerKey'].append({'rule': rule, 'where': where, 'what': what})
for s in GEN['sections']:
    for x in s.get('subs', []):
        if x['num'] == '4.2':
            x['blocks'].insert(1, P('Diabetic nephropathy: the recommended maintenance dose is 80 mg once daily.'))
        if x['num'] == '4.4':
            x['blocks'][0] = P('Hyperkalaemia: serum potassium may be checked in some patients.')
K('EU-GEN-CARVE', '4.2', 'The diabetic nephropathy dose is still in 4.2 although the indication is left out.')
K('EU-GEN-SAME', '4.4', 'The hyperkalaemia warning is weaker than the reference SmPC: not a permitted difference.')

SAMPLES_GEN = [
    {'id': 'eu-talmisartan-generic', 'region': 'eu', 'productId': 'generic-tablet', 'level': 'Practice', 'title': 'Talmisartan Ashvale (EU): generic SmPC against the reference',
     'about': 'A generic SmPC drafted from the reference SmPC (Corvenza, fictional). The diabetic nephropathy indication is still under patent and is left out under Article 11, but one mention remains, and one warning was changed when it should match the reference.',
     'docs': [REF, GEN]},
]
