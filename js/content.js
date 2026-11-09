/* Find My Survey — case file content (prototype v2).
   Everything a surveyor reviewer would edit lives here.
   Survey scope wording follows the RICS "Description of the RICS Home Survey"
   documents (Levels 1, 2, 2 with valuation, 3) and "Helping you choose the right survey".
   No prices are shown in this version. */

window.FMS = window.FMS || {};
const THIS_YEAR = new Date().getFullYear();
const TEN_YEARS_AGO = THIS_YEAR - 10;
FMS.TEN_YEARS_AGO = TEN_YEARS_AGO;

/* ---------- Common designations ---------- */
const RICS_SURVEYOR = "An AssocRICS, MRICS or FRICS member with the skills and experience for this type of property";
const RICS_VALUER = "For any valuation: also a member of the RICS Valuer Registration scheme (an RICS Registered Valuer)";
const RICS_FIRM = "Check the firm is RICS-regulated: not every firm on “Find a Surveyor” is";

/* ---------- Outcomes ---------- */
FMS.outcomes = {
  L1: {
    name: "RICS Home Survey – Level 1", short: "Level 1 Survey", family: "survey", rank: 1,
    tagline: "A concise condition report for a conventional home built in the last 10 years and in reasonable condition.",
    covers: [
      "Inspection of the inside and outside of the main building and all permanent outbuildings",
      "Roof space viewed from the access hatch",
      "Condition ratings for each element: R, 1, 2, 3 and NI (not inspected)",
      "A list of risks to the building, grounds and people",
      "Issues to raise with your legal adviser",
    ],
    notCovers: [
      "No advice on repairs or ongoing maintenance",
      "Risks are listed but not explained",
      "No valuation or reinstatement (rebuild) cost",
      "No tests of services; the fabric is not opened up",
      "Flats: drains, lifts, fire alarms and security systems are not inspected",
      "External wall systems (cladding) are not inspected",
    ],
    who: [RICS_SURVEYOR, RICS_FIRM],
  },
  L2: {
    name: "RICS Home Survey – Level 2", short: "Level 2 Survey", family: "survey", rank: 2,
    tagline: "For conventional homes built from common materials and in reasonable condition, when you want more than a snapshot.",
    covers: [
      "A more extensive visual inspection of the building, its services and grounds",
      "Enters the roof space where it is safe and reasonable to do so",
      "Concealed areas normally used by occupiers, such as cellars, where safe",
      "Explains the risks and gives advice on repairs and ongoing maintenance",
      "Leasehold: general advice and questions for your legal adviser",
    ],
    notCovers: [
      "Services are not tested",
      "Carpets, floorboards and heavy furniture are not lifted or moved",
      "Flats: drains, lifts, fire alarms and security systems are not inspected",
      "External wall systems are not inspected",
      "No enquiries about contamination",
      "No structural calculations",
      "No valuation unless you choose “Level 2 with valuation”",
    ],
    valuationAdds: [
      "The surveyor's opinion of market value",
      "A reinstatement cost for buildings insurance, including garage, boundary walls, outbuildings and site clearance",
      "A check for obvious differences between the EPC and the property",
      "A list of problems that may affect value",
    ],
    who: [RICS_SURVEYOR, RICS_VALUER, RICS_FIRM],
  },
  L3: {
    name: "RICS Home Survey – Level 3", short: "Level 3 Survey", family: "survey", rank: 3,
    tagline: "For large, older or run-down homes, unusual or altered buildings, or when you plan major works.",
    covers: [
      "The most detailed visual inspection of the building, services and grounds",
      "Small corners of loft insulation lifted to identify its type and the ceiling below",
      "Services observed in normal operation, with permission",
      "The most probable cause of defects and the consequences of not repairing them",
      "Priority and likely timescale for repairs; cost estimates if agreed in advance",
      "Risk of hidden defects in areas that could not be inspected",
      "Energy commentary and advice on the EPC's recommendations",
      "Enquiries about contamination; flats: drains, lifts and alarms within the flat's boundary",
    ],
    notCovers: [
      "The fabric is not opened up without the owner's consent",
      "No specialist tests of services",
      "External wall systems are not inspected",
      "No structural calculations",
      "No valuation unless agreed as an extra service",
    ],
    who: [RICS_SURVEYOR, "Ideally experienced with this age and type of construction", RICS_VALUER, RICS_FIRM],
  },
  SNAG: {
    name: "New-build snagging inspection", short: "Snagging inspection", family: "specialist",
    tagline: "A room-by-room defect list for the developer to put right.",
    covers: ["Finish and build-quality defects, room by room", "A report the developer can act on"],
    notCovers: ["Not an RICS Home Survey of an existing home", "No valuation"],
    who: ["A chartered building surveyor (MRICS/FRICS) or experienced snagging inspector"],
  },
  PW: {
    name: "Party wall surveyor", short: "Party wall surveyor", family: "specialist",
    tagline: "Notices and an award under the Party Wall etc. Act 1996.",
    covers: ["Party wall notices and the award that governs how work is done", "Usually a schedule of condition of the neighbouring property"],
    notCovers: ["Does not decide where the legal boundary lies", "Not a survey of overall condition"],
    who: ["Anyone not party to the work can act, but choose a specialist: MRICS/FRICS, or a member of the Faculty of Party Wall Surveyors"],
  },
  SOC: {
    name: "Schedule of condition", short: "Schedule of condition", family: "specialist",
    tagline: "A dated photographic record of condition before nearby works.",
    covers: ["Photographs and notes of existing cracks, finishes and defects", "Evidence if damage is later disputed"],
    notCovers: ["Not advice on whether to buy", "No valuation"],
    who: ["A chartered building surveyor (MRICS/FRICS)"],
  },
  MEAS: {
    name: "Measured or topographical survey", short: "Measured survey", family: "specialist",
    tagline: "Accurate plans, areas and levels for planning, design or a lease plan.",
    covers: ["Measured floor plans and elevations, or a site and levels survey", "Areas calculated to an agreed standard"],
    notCovers: ["Says nothing about condition", "Not a valuation"],
    who: ["A chartered land or measured building surveyor (MRICS)"],
  },
  BOUND: {
    name: "Boundary survey", short: "Boundary survey", family: "specialist",
    tagline: "Finds and documents where the boundary most likely runs.",
    covers: ["Checks deeds, plans, historic maps and aerial photographs", "A plan that can support a boundary agreement at HM Land Registry"],
    notCovers: ["Title plans show only “general boundaries”, so no exact line can be read from them", "Not a party wall award"],
    who: ["A chartered land surveyor specialising in boundaries, following the RICS boundaries guidance note"],
    rules: ["The RICS Boundary Disputes Mediation Service is usually quicker and cheaper than court"],
  },
  EW: {
    name: "Expert witness report", short: "Expert witness report", family: "dispute",
    tagline: "Independent expert evidence for a claim, tribunal or court.",
    covers: ["An independent opinion on the technical issues in dispute", "A report that complies with court rules (CPR Part 35 in England and Wales)"],
    notCovers: ["The expert's overriding duty is to the court, not to you", "Not legal advice"],
    who: ["An RICS member experienced in the issue, following the RICS standard “Surveyors acting as expert witnesses”", "Usually instructed through your solicitor; sometimes a single joint expert"],
    rules: ["The 5th edition of the RICS expert witness standard takes effect on 30 November 2026"],
  },
  HTB: {
    name: "Help to Buy valuation", short: "Help to Buy valuation", family: "valuation",
    tagline: "The RICS valuation Homes England uses to work out what you repay.",
    covers: ["Market value of your home for repaying the equity loan"],
    notCovers: ["Not a survey of condition", "An estate agent's appraisal is not accepted"],
    who: ["RICS qualified and registered", "Independent of any estate agent and not known to you"],
    rules: ["The surveyor must inspect inside the home", "At least 3 comparable sales from the last 12 months, within 2 miles", "Addressed to Homes England on headed paper", "Valid for 3 months; send it within 5 days", "Can be extended by a valuation letter (1 month) or a desktop report (3 months) from the same surveyor"],
  },
  SO: {
    name: "Shared ownership staircasing valuation", short: "Staircasing valuation", family: "valuation",
    tagline: "The independent valuation your housing provider uses to price more shares.",
    covers: ["Market value used to price the share you buy"],
    notCovers: ["Not a survey of condition", "Estate agent figures are not accepted"],
    who: ["An independent RICS Registered Valuer, not an estate agent"],
    rules: ["Usually valid for 3 months; check whether your provider counts from inspection or report date"],
  },
  PROB: {
    name: "Probate valuation", short: "Probate valuation", family: "valuation",
    tagline: "A Red Book valuation at the date of death for the estate.",
    covers: ["Open market value at the date of death (s.160 Inheritance Tax Act 1984)", "Comparable sales from around that date"],
    notCovers: ["Not a survey of condition", "Not tax advice"],
    who: ["An RICS Registered Valuer; a Red Book valuation is recommended"],
    rules: ["It is retrospective: the value on the date of death", "HMRC may check the figure through the District Valuer"],
  },
  MAT: {
    name: "Matrimonial valuation", short: "Matrimonial valuation", family: "valuation",
    tagline: "An independent value when dividing assets on separation.",
    covers: ["Independent market value both sides and the court can rely on"],
    notCovers: ["Not legal advice on how assets are divided"],
    who: ["An RICS Registered Valuer, often appointed as a single joint expert"],
  },
  LEASE: {
    name: "Lease extension or freehold valuation", short: "Lease extension valuation", family: "valuation",
    tagline: "Works out the premium to extend your lease or buy the freehold.",
    covers: ["The premium calculation under leasehold law"],
    notCovers: ["Not the legal process, which runs through a solicitor"],
    who: ["An MRICS/FRICS valuer experienced in leasehold enfranchisement"],
  },
  RCA: {
    name: "Reinstatement cost assessment", short: "Rebuild cost assessment", family: "valuation",
    tagline: "What it would cost to rebuild your home, for buildings insurance.",
    covers: ["Rebuild cost to the existing standard, including garage, boundary walls, outbuildings, site clearance and fees"],
    notCovers: ["Not market value", "Excludes VAT except on fees"],
    who: ["An RICS surveyor (MRICS/FRICS)"],
  },
  RB: {
    name: "RICS Red Book market valuation", short: "Red Book valuation", family: "valuation",
    tagline: "A formal, independent market value for any purpose.",
    covers: ["Independent market value under RICS Valuation – Global Standards"],
    notCovers: ["Not a survey of condition"],
    who: ["An RICS Registered Valuer"],
  },
  DEFECT: {
    name: "Specific defect report", short: "Specific defect report", family: "specialist",
    tagline: "A focused investigation of one known problem.",
    covers: ["Investigation of one issue and its likely cause", "Recommended next steps"],
    notCovers: ["Not a survey of the whole property"],
    who: ["A chartered building surveyor (MRICS/FRICS)"],
  },
  STRUCT: {
    name: "Structural engineer's report", short: "Structural engineer", family: "specialist",
    tagline: "Structural assessment, monitoring or calculations that a survey does not provide.",
    covers: ["Assessment of movement, cracking or structural alterations", "Monitoring or calculations where needed"],
    notCovers: ["Not a general condition survey"],
    who: ["A chartered structural engineer: MIStructE, or CEng MICE"],
  },
  DAMP: {
    name: "Independent damp and timber investigation", short: "Damp specialist", family: "specialist",
    tagline: "Finds the cause of damp before anyone sells you a cure.",
    covers: ["Diagnosis of rising, penetrating or condensation damp and timber decay"],
    notCovers: ["Not a whole-house survey"],
    who: ["A Certified Surveyor in Remedial Treatment (CSRT), Property Care Association", "Prefer one independent of companies selling treatments"],
  },
  ELEC: {
    name: "Electrical Installation Condition Report (EICR)", short: "Electrical check (EICR)", family: "specialist",
    tagline: "Tests the safety of the electrical installation.",
    covers: ["Testing and inspection of wiring, consumer unit and circuits"],
    notCovers: ["Gas and heating appliances"],
    who: ["A registered electrician (NICEIC or NAPIT)"],
  },
  GAS: {
    name: "Gas safety and heating check", short: "Gas Safe check", family: "specialist",
    tagline: "Tests gas appliances, boiler and flue.",
    covers: ["Safety check of gas appliances, boiler and flue"],
    notCovers: ["Electrics"],
    who: ["A Gas Safe registered engineer"],
  },
  DRAIN: {
    name: "CCTV drainage survey", short: "Drainage survey", family: "specialist",
    tagline: "A camera inspection of underground drains.",
    covers: ["Condition of drains, blockages, root ingress and collapses"],
    notCovers: ["Above-ground plumbing"],
    who: ["A drainage contractor providing a written CCTV report"],
  },
  TREE: {
    name: "Arboricultural assessment", short: "Tree assessment", family: "specialist",
    tagline: "Assesses trees near the building and their risk to foundations.",
    covers: ["Species, size, distance and likely influence on the building"],
    notCovers: ["Structural design"],
    who: ["An Arboricultural Association registered consultant"],
  },
  POOL: {
    name: "Pool and leisure facility inspection", short: "Pool specialist", family: "specialist",
    tagline: "Home surveys inspect the building around a pool, not the pool itself.",
    covers: ["Pool structure, plant and equipment"],
    notCovers: ["The rest of the property"],
    who: ["A specialist pool engineer, for example a SPATA member"],
  },
  THATCH: {
    name: "Thatch condition report", short: "Thatcher's report", family: "specialist",
    tagline: "The remaining life and condition of a thatched roof.",
    covers: ["Condition, ridge, fixings and likely remaining life"],
    notCovers: ["The rest of the building"],
    who: ["A master thatcher, for example a National Society of Master Thatchers member"],
  },
  KNOT: {
    name: "Japanese knotweed assessment", short: "Knotweed assessment", family: "specialist",
    tagline: "Confirms knotweed and its RICS management category for you and your lender.",
    covers: ["Identification and management category A–D", "A management plan, often with an insurance-backed guarantee"],
    notCovers: ["Each lender decides what it needs"],
    who: ["A Property Care Association invasive weed specialist"],
  },
  EWS1: {
    name: "EWS1 / external wall assessment", short: "EWS1 external wall form", family: "specialist",
    tagline: "No home survey inspects external wall systems, so lenders may ask for this.",
    covers: ["Fire-safety assessment of external wall materials for lending"],
    notCovers: ["Not a survey of the flat's condition"],
    who: ["A suitably qualified fire engineer or chartered professional, usually arranged by the building owner"],
  },
};

/* ---------- Case notes (educational, cited) ---------- */
FMS.notes = {
  mv: { title: "A valuation is not a survey", text: "Your lender's valuation only tells the lender whether the home is reasonable security for the loan. It is not a survey.", source: "RICS, Helping you choose the right survey" },
  level1: { title: "When Level 1 fits", text: `We only suggest Level 1 for conventional homes built in the last 10 years (${TEN_YEARS_AGO} or later) and in reasonable condition. It gives no repair advice and no valuation.`, source: "Find My Survey rule, based on RICS descriptions" },
  l2v: { title: "Level 2 with valuation", text: "Adds a market value, a reinstatement cost for insurance and a list of problems that may affect value.", source: "RICS, Description of Level 2 (survey and valuation)" },
  outbuild: { title: "Outbuildings", text: "All levels inspect permanent outbuildings. Buildings with pools or sports facilities are inspected as outbuildings, but the pool, its equipment, tennis courts and temporary outbuildings are not reported on.", source: "RICS Home Survey descriptions" },
  flats: { title: "Flats and shared parts", text: "Levels 1 and 2 do not inspect drains, lifts, fire alarms or security systems. Level 3 does, within the flat's boundary, in normal use. No level inspects external wall systems.", source: "RICS Home Survey descriptions" },
  conversion: { title: "Converted flats", text: "Conversions can hide alterations, sound and fire separation issues. Ask your conveyancer for building regulations sign-off; older conversions often suit Level 3.", source: "Find My Survey guidance" },
  crack: { title: "Measuring cracks", text: "Crack width is a common first guide to severity. Hairline cracks are usually cosmetic; around 5 mm or more, or cracks that are growing, usually need a structural engineer.", source: "Based on BRE Digest 251 damage categories" },
  damp: { title: "Damp: diagnose first", text: "Damp meter readings in a survey are a screening tool. Get an independent specialist to find the cause before paying for treatment.", source: "Find My Survey guidance" },
  trees: { title: "Trees and foundations", text: "Large trees close to a house, especially on clay soils, can contribute to movement. A Level 3 and possibly a tree assessment help.", source: "Find My Survey guidance" },
  warranty: { title: "New-home warranties", text: "Most new homes come with a 10-year warranty (for example NHBC Buildmark, LABC Warranty or Premier Guarantee). Typically the builder fixes defects in the first 2 years; years 3–10 cover specified structural defects only.", source: "NHBC Buildmark and provider guidance" },
  warrantyLimits: { title: "A warranty is not a survey", text: "Warranties exclude wear and tear and usually alterations made after completion. A survey finds defects you can raise while cover still runs.", source: "Find My Survey guidance" },
  lender10: { title: "Lenders and homes under 10", text: "Lenders generally need a recognised warranty or a Professional Consultant's Certificate for homes built in roughly the last 10 years. Your conveyancer checks this.", source: "UK Finance Lenders' Handbook, section 6.7" },
  nhqc: { title: "Pre-completion inspection", text: "Under the New Homes Quality Code, developers should let you, or a professional, inspect before completion.", source: "New Homes Quality Code" },
  ews1: { title: "External walls", text: "No RICS Home Survey inspects external wall systems. With Level 2 with valuation, the value may be held back until they are investigated.", source: "RICS Home Survey descriptions" },
  lease: { title: "Short leases", text: "Leases under about 90 years cost more to extend and some lenders won't lend on them. Your conveyancer will check.", source: "Find My Survey guidance" },
  tell: { title: "Tell your surveyor", text: "Before the inspection, tell the surveyor the agreed price and any particular concerns, such as a crack or plans to extend.", source: "RICS terms of engagement" },
  pw: { title: "Party wall is not boundary", text: "A party wall award controls how work is done. It does not decide where the boundary lies.", source: "Party Wall etc. Act 1996" },
  boundary: { title: "General boundaries", text: "HM Land Registry title plans show general boundaries: the red line is not the exact legal line.", source: "HM Land Registry" },
  ew: { title: "The expert's duty", text: "An expert witness's overriding duty is to the court, not to whoever pays them.", source: "Civil Procedure Rules Part 35" },
  htb: { title: "Help to Buy designation", text: "For Help to Buy: Equity Loan (2021–2023), the valuer must be an RICS member or fellow (MRICS or FRICS).", source: "GOV.UK / Homes England" },
  probate: { title: "Date-of-death value", text: "Probate valuations are usually retrospective: the value on the date of death.", source: "Inheritance Tax Act 1984 s.160" },
  knot: { title: "Knotweed categories", text: "RICS sorts knotweed into management categories A–D. Each lender decides what it needs.", source: "RICS professional standard, 2022" },
  nomeasure: { title: "Surveys don't measure", text: "Home surveys produce no floor plans or area calculations. You need a measured survey for that.", source: "RICS Home Survey descriptions" },
};

/* ---------- Free-text brief matching ---------- */
FMS.keywords = [
  { re: /help ?to ?buy|equity loan|homes england/i, route: "valuing", hint: "Help to Buy", suggest: { q_v_why: "htb" } },
  { re: /stair ?casing|shared ownership/i, route: "valuing", hint: "Shared ownership", suggest: { q_v_why: "so" } },
  { re: /probate|died|passed away|estate|inherit/i, route: "valuing", hint: "Probate", suggest: { q_v_why: "prob" } },
  { re: /divorce|separat|matrimonial/i, route: "valuing", hint: "Separation", suggest: { q_v_why: "mat" } },
  { re: /lease extension|extend (my|the) lease|freehold/i, route: "valuing", hint: "Lease extension", suggest: { q_v_why: "lease" } },
  { re: /insurance|rebuild cost|reinstatement/i, route: "valuing", hint: "Rebuild cost", suggest: { q_v_why: "rca" } },
  { re: /worth|valu/i, route: "valuing", hint: "A valuation" },
  { re: /claim|negligen|missed|sue|court|tribunal|solicitor/i, route: "dispute", hint: "A possible claim", suggest: { q_d_kind: "missed" } },
  { re: /boundary|fence|hedge|title plan/i, route: "dispute", hint: "A boundary question", suggest: { q_d_kind: "boundary" } },
  { re: /party wall|basement|neighbou?r.{0,25}(extension|work|build|dig)/i, route: "works", hint: "Building work next door", suggest: { q_w_who: "neighbour" } },
  { re: /neighbou?r/i, ambiguous: ["works", "dispute"], hint: "Your neighbour" },
  /* Concern keywords: route to "worry" only when nothing more specific matches;
     otherwise their flags carry the concern into the other route's questions. */
  { re: /knotweed/i, route: "worry", hint: "Japanese knotweed", suggest: { q_x_kind: "knot", q_c_issue: "knot" }, flags: { knotweed: true, issues: true } },
  { re: /cladding|ews1|external wall/i, route: "worry", hint: "Cladding", suggest: { q_x_kind: "clad" }, flags: { ews1: true } },
  { re: /crack|subsiden|movement/i, route: "worry", hint: "Cracking", suggest: { q_x_kind: "crack", q_c_issue: "crack", q_c_cond: "issues" }, flags: { crack: true, issues: true } },
  { re: /damp|mould|condensation/i, route: "worry", hint: "Damp", suggest: { q_x_kind: "damp", q_c_issue: "damp", q_c_cond: "issues" }, flags: { damp: true, issues: true } },
  { re: /snag|new ?build/i, route: "buying", hint: "A new build", suggest: { q_p_type: "newbuild" } },
  { re: /floor ?plan|measure|square (feet|metres)|sq ?ft/i, route: "works", hint: "Plans or measurements", flag: "needsPlans" },
  { re: /selling|sell my|own(er)?|maintenance|renovat/i, route: "condition", hint: "Checking a home you own" },
  { re: /buy|offer|purchas|first home|first[- ]time/i, route: "buying", hint: "Buying a home" },
];
FMS.chips = ["Offer accepted on a 1930s semi", "New build, completing next month", "Neighbour is digging a basement", "Help to Buy remortgage", "Cracking above a window", "Valuation for probate"];

/* ---------- Questions ----------
   Option keys: v, label, sub, score {OUTCOME: weight}, min (survey floor), set {flags},
   why (shown on result), note (case note id), also [specialists], tell (for the surveyor).
   Question keys: when(f), followUp, multi (several answers), type "date", stage, help. */
const unsure = (extra = {}) => Object.assign({ v: "unsure", label: "Not sure", sub: "We'll explain and take the cautious route", unsure: true }, extra);
const prop = f => f.route === "buying" || f.route === "condition";
const existing = f => prop(f) && !f.newbuild;

FMS.questions = [
  /* ----- 01 Brief ----- */
  { id: "q_route", stage: 0, text: "What is this case about?", help: "This sets the line of enquiry. You can change it at any time.",
    options: [
      { v: "buying", label: "Buying a home", sub: "Offer accepted, or about to be", set: { route: "buying" } },
      { v: "condition", label: "A home I own", sub: "Selling soon, maintenance or planning works", set: { route: "condition" } },
      { v: "works", label: "Building work", sub: "Mine, or a neighbour's", set: { route: "works" } },
      { v: "valuing", label: "A valuation", sub: "For a loan, tax, a separation or a lease", set: { route: "valuing" } },
      { v: "dispute", label: "A dispute or claim", sub: "Boundaries, damage, a missed defect", set: { route: "dispute" } },
      { v: "worry", label: "One specific concern", sub: "Cracking, damp, knotweed, cladding", set: { route: "worry" } },
    ] },

  /* ----- 02 Property ----- */
  { id: "q_p_type", stage: 1, when: prop, text: "What type of property is it?",
    options: [
      { v: "detached", label: "Detached house", set: { type: "house" }, score: { L2: 1 } },
      { v: "semi", label: "Semi-detached or terraced house", set: { type: "house" }, score: { L2: 1 } },
      { v: "bungalow", label: "Bungalow", set: { type: "bungalow" }, score: { L2: 1 } },
      { v: "flat", label: "Flat or maisonette", set: { type: "flat" }, score: { L2: 1 }, note: "flats" },
      { v: "newbuild", label: "New build, never lived in", set: { type: "house", newbuild: true, recent: true }, score: { SNAG: 4 }, why: "It's a brand-new home", note: "nhqc" },
      unsure({ score: { L2: 1 } }),
    ] },
  { id: "q_p_nb", stage: 1, followUp: true, when: f => f.newbuild, text: "Where are you with the developer?",
    help: "Defects are easiest to resolve before completion or within the builder's first 2 years.",
    options: [
      { v: "before", label: "Not yet completed", score: { SNAG: 3 }, set: { nbStage: "before" }, why: "You can raise defects before you complete", note: "nhqc" },
      { v: "within2", label: "Completed, under 2 years ago", score: { SNAG: 2 }, set: { nbStage: "within2" }, why: "You're inside the builder's 2-year defects period", note: "warranty" },
      unsure({ score: { SNAG: 2 } }),
    ] },
  { id: "q_p_flat", stage: 1, followUp: true, when: f => prop(f) && f.type === "flat", text: "Is the flat purpose-built or a conversion?",
    help: "Conversions are often older buildings divided up later, so alterations, sound and fire separation matter more.",
    options: [
      { v: "purpose", label: "Purpose-built block", set: { flatKind: "purpose" } },
      { v: "conversion", label: "Converted from a house or other building", set: { flatKind: "conversion" }, score: { L2: 1, L3: 2 }, why: "It's a converted flat", note: "conversion" },
      { v: "commercial", label: "Above a shop or commercial premises", set: { flatKind: "commercial" }, score: { L3: 2 }, why: "It's above commercial premises" },
      unsure({ score: { L3: 1 } }),
    ] },
  { id: "q_p_block", stage: 1, followUp: true, when: f => prop(f) && f.type === "flat", text: "How tall is the building, and is there cladding?",
    help: "No RICS Home Survey inspects external wall systems. Lenders may ask for an EWS1 form on taller or clad buildings.",
    options: [
      { v: "low", label: "Up to 4 storeys, no cladding concerns" },
      { v: "tall", label: "5 storeys or more, or clad", set: { ews1: true }, also: ["EWS1"], why: "The building is tall or clad", note: "ews1" },
      unsure({ also: ["EWS1"], note: "ews1" }),
    ] },
  { id: "q_p_lease", stage: 1, followUp: true, when: f => prop(f) && f.type === "flat", text: "How long is left on the lease?",
    options: [
      { v: "long", label: "90 years or more" },
      { v: "short", label: "Under 90 years", set: { shortLease: true }, also: ["LEASE"], why: "The lease is under 90 years", note: "lease" },
      { v: "sof", label: "Share of freehold" },
      unsure({ note: "lease" }),
    ] },
  { id: "q_p_age", stage: 1, when: existing, text: "When was it built?",
    help: `The listing, EPC or seller's information usually gives this. We only suggest Level 1 for homes built in the last 10 years (${TEN_YEARS_AGO} or later).`,
    options: [
      { v: "recent", label: `${TEN_YEARS_AGO} or later`, sub: "Within the last 10 years", set: { recent: true }, score: { L1: 2, L2: 1 }, note: "level1", why: `Built in ${TEN_YEARS_AGO} or later` },
      { v: "1990", label: `1990 to ${TEN_YEARS_AGO - 1}`, score: { L2: 2 } },
      { v: "1945", label: "1945 to 1989", score: { L2: 2, L3: 1 } },
      { v: "1900", label: "1900 to 1944", score: { L2: 1, L3: 2 } },
      { v: "pre1900", label: "Before 1900", min: "L3", score: { L3: 3 }, why: "Built before 1900" },
      unsure({ score: { L2: 2, L3: 1 } }),
    ] },
  { id: "q_p_warranty", stage: 1, followUp: true, when: f => prop(f) && f.recent && !f.newbuild, text: "Is a new-home warranty still running?",
    help: "Most homes built in the last 10 years came with a warranty such as NHBC Buildmark, LABC Warranty or Premier Guarantee.",
    options: [
      { v: "yes2", label: "Yes, and it's under 2 years old", sub: "Builder's defects period", set: { warranty: "builder" }, note: "warranty", why: "The builder is still responsible for defects" },
      { v: "yes10", label: "Yes, 2 to 10 years old", sub: "Structural cover only", set: { warranty: "structural" }, note: "warrantyLimits" },
      { v: "no", label: "No warranty, or it has lapsed", set: { warranty: "none" }, score: { L2: 2 }, note: "lender10", why: "There's no warranty to fall back on" },
      unsure({ set: { warranty: "unsure" }, note: "lender10" }),
    ] },
  { id: "q_p_build", stage: 1, when: existing, text: "What is it mainly built from?",
    options: [
      { v: "cavity", label: "Brick or block with cavity walls", set: { material: "cavity" }, score: { L1: 1, L2: 1 }, why: "Conventional cavity-wall construction" },
      { v: "solid", label: "Solid brick or stone walls", set: { material: "solid" }, score: { L2: 1, L3: 1 } },
      { v: "timber", label: "Timber frame", set: { material: "timber" }, score: { L3: 2 }, min: "L2", why: "Timber-frame construction" },
      { v: "nonstd", label: "Concrete panels, steel frame or prefabricated", sub: "Non-standard construction", min: "L3", score: { L3: 2 }, why: "Non-standard construction" },
      { v: "earth", label: "Cob, clay or other traditional materials", min: "L3", score: { L3: 3 }, why: "Traditional earth construction" },
      unsure({ score: { L2: 1, L3: 1 } }),
    ] },
  { id: "q_p_special", stage: 1, when: existing, multi: true, text: "Do any of these apply?", help: "Choose all that apply.",
    options: [
      { v: "listed", label: "Listed building", min: "L3", score: { L3: 3 }, why: "It's a listed building", tell: "It is listed" },
      { v: "cons", label: "In a conservation area", score: { L3: 1 } },
      { v: "thatch", label: "Thatched roof", min: "L3", score: { L3: 3 }, also: ["THATCH"], why: "It has a thatched roof" },
      { v: "none", label: "None of these", exclusive: true },
    ] },
  { id: "q_p_alter", stage: 1, when: existing, multi: true, text: "Has it been altered or extended?", help: "Choose all that apply.",
    options: [
      { v: "ext", label: "Extension", set: { extension: true }, score: { L2: 1, L3: 1 }, why: "It has been extended", tell: "Ask about the extension and its sign-off" },
      { v: "loft", label: "Loft conversion", set: { extension: true }, score: { L2: 1, L3: 1 }, why: "It has a loft conversion" },
      { v: "walls", label: "Walls removed or opened up", min: "L3", score: { L3: 2 }, also: ["STRUCT"], why: "Walls have been removed", tell: "Walls have been removed; ask about building regulations sign-off" },
      { v: "conserv", label: "Conservatory", score: { L2: 1 } },
      { v: "none", label: "None that I know of", exclusive: true },
    ] },
  { id: "q_p_out", stage: 1, when: f => existing(f) && f.type !== "flat", multi: true, text: "Are there any outbuildings?", help: "Every RICS level inspects permanent outbuildings. Some facilities are excluded.",
    options: [
      { v: "garage", label: "Garage or shed", note: "outbuild" },
      { v: "annexe", label: "Annexe, garden room or studio", sub: "Especially if lived in", score: { L2: 1, L3: 1 }, why: "There's an annexe or garden room", tell: "Ask about the annexe's use and approvals" },
      { v: "pool", label: "Pool or sports building", also: ["POOL"], score: { L3: 1 }, note: "outbuild", why: "There's a pool or sports building" },
      { v: "grounds", label: "Several outbuildings or large grounds", score: { L3: 2 }, why: "There are several outbuildings or large grounds" },
      { v: "none", label: "None", exclusive: true },
    ] },
  { id: "q_p_trees", stage: 1, when: f => existing(f) && f.type !== "flat", text: "Are there large trees close to the house?",
    options: [
      { v: "yes", label: "Yes, within about the height of the tree", set: { trees: true }, score: { L3: 2 }, also: ["TREE"], note: "trees", why: "Large trees are close to the house" },
      { v: "no", label: "No" },
      unsure({ score: { L3: 1 } }),
    ] },

  /* ----- 03 Concerns ----- */
  { id: "q_c_cond", stage: 2, when: prop, text: "From what you've seen, what condition is it in?",
    options: [
      { v: "good", label: "Well maintained", score: { L1: 2, L2: 1 }, why: "It appears well maintained" },
      { v: "dated", label: "Dated but sound", score: { L2: 2 } },
      { v: "issues", label: "Some visible problems", set: { issues: true }, score: { L2: 1, L3: 2 } },
      { v: "rundown", label: "Run-down or needs renovation", min: "L3", score: { L3: 3 }, why: "It needs renovation" },
      unsure({ score: { L2: 2 } }),
    ] },
  { id: "q_c_issue", stage: 2, followUp: true, multi: true, when: f => prop(f) && f.issues, text: "What did you notice?", help: "Choose all that apply. We'll ask a little more about each.",
    options: [
      { v: "crack", label: "Cracking", set: { crack: true } },
      { v: "damp", label: "Damp, staining or mould", set: { damp: true } },
      { v: "roof", label: "Roof problems", set: { roofIssue: true } },
      { v: "services", label: "Old electrics, boiler or heating", also: ["ELEC", "GAS"], why: "The electrics or heating look dated", tell: "Point out the electrics and heating" },
      { v: "drains", label: "Drainage smells or slow drains", also: ["DRAIN"], why: "There may be a drainage problem" },
      { v: "knot", label: "Plants that look like knotweed", set: { knotweed: true }, also: ["KNOT"], note: "knot", why: "Possible Japanese knotweed" },
    ] },
  { id: "q_c_crack", stage: 2, followUp: true, when: f => f.crack, text: "How wide is the widest crack?",
    help: "Measure the widest point, or compare it with a coin's edge (about 2–3 mm). Cracking of about 5 mm or more usually needs a structural engineer as well as a survey.",
    options: [
      { v: "hair", label: "Hairline, under 1 mm", score: { L2: 1, DEFECT: 1 }, note: "crack", tell: "Point out the hairline cracking" },
      { v: "fine", label: "1 to 5 mm", sub: "Up to about two coin edges", score: { L3: 2, DEFECT: 3 }, why: "Cracking of 1–5 mm", note: "crack", tell: "Point out the cracking and where it is" },
      { v: "wide", label: "5 to 15 mm, or doors and windows sticking", min: "L3", score: { L3: 2, STRUCT: 4 }, also: ["STRUCT"], set: { structural: true }, why: "Cracking of 5 mm or more", note: "crack", tell: "Point out the cracking and sticking doors or windows" },
      { v: "severe", label: "Over 15 mm, or you can see through it", min: "L3", score: { STRUCT: 7 }, also: ["STRUCT"], set: { structural: true, severe: true }, why: "Severe cracking", note: "crack" },
      unsure({ score: { L3: 1, DEFECT: 1 }, note: "crack" }),
    ] },
  { id: "q_c_crack2", stage: 2, followUp: true, when: f => f.crack, text: "Is the cracking new or changing?",
    options: [
      { v: "old", label: "Old and unchanged", sub: "Filled or painted over long ago" },
      { v: "new", label: "New, growing or reopening", score: { STRUCT: 3, L3: 1 }, also: ["STRUCT"], set: { active: true }, why: "The cracking appears active" },
      unsure({ score: { L3: 1 } }),
    ] },
  { id: "q_c_damp", stage: 2, followUp: true, when: f => f.damp, text: "Where is the damp?",
    options: [
      { v: "low", label: "Lower walls, near the floor", score: { L2: 1, L3: 1, DAMP: 3 }, also: ["DAMP"], why: "Damp low on the walls", note: "damp", tell: "Point out the damp low on the walls" },
      { v: "high", label: "Ceilings, chimney breasts or around windows", score: { L2: 1, DEFECT: 2 }, why: "Damp on ceilings or around openings", note: "damp" },
      { v: "mould", label: "Black mould on windows or cold walls", score: { L2: 1, DEFECT: 1 }, note: "damp" },
      { v: "cellar", label: "Cellar or basement", score: { L3: 2, DAMP: 2 }, also: ["DAMP"], why: "Damp in a cellar or basement" },
      unsure({ score: { L2: 1 }, also: ["DAMP"] }),
    ] },
  { id: "q_c_roof", stage: 2, followUp: true, when: f => f.roofIssue, text: "What kind of roof problem?",
    options: [
      { v: "flat", label: "Flat roof, ponding or leaks", score: { L2: 1, DEFECT: 2 }, why: "A flat roof problem" },
      { v: "sag", label: "Sagging, slipped or missing tiles", score: { L3: 2 }, why: "The roof is sagging or tiles have slipped" },
      { v: "thatch", label: "Thatch looks thin or worn", also: ["THATCH"], score: { L3: 1 }, why: "The thatch looks worn" },
      unsure({ score: { L2: 1 } }),
    ] },

  /* ----- New-build: no full survey needed in most cases ----- */

  /* ----- Building work route ----- */
  { id: "q_w_who", stage: 1, when: f => f.route === "works", text: "Whose building work is it?",
    options: [
      { v: "mine", label: "Mine", set: { worksBy: "me" } },
      { v: "neighbour", label: "My neighbour's", set: { worksBy: "neighbour", neighbourWorks: true } },
      unsure(),
    ] },
  { id: "q_w_what", stage: 2, when: f => f.route === "works", text: "What does the work involve?",
    help: "The Party Wall etc. Act 1996 covers work to a shared wall, a new wall on the boundary line, and excavation near a neighbouring building.",
    options: [
      { v: "wall", label: "Work to a shared wall", sub: "Cutting in, raising, underpinning", score: { PW: 6 }, set: { pwType: "wall" }, why: "Work affects a shared wall", note: "pw" },
      { v: "dig", label: "Excavation near a neighbouring building", sub: "Foundations, basements", score: { PW: 6 }, set: { pwType: "dig" }, why: "Excavation near a neighbouring building", note: "pw" },
      { v: "line", label: "A new wall on the boundary line", score: { PW: 5 }, set: { pwType: "line" }, why: "A new wall on the boundary line", note: "pw" },
      { v: "away", label: "Nowhere near a boundary", score: { MEAS: 2, STRUCT: 1 } },
      { v: "where", label: "Not sure where the boundary is", set: { boundaryQ: true }, score: { BOUND: 4, PW: 2 }, why: "The boundary position is unclear", note: "boundary" },
      unsure({ score: { PW: 3 } }),
    ] },
  { id: "q_w_damage", stage: 2, followUp: true, when: f => f.route === "works" && f.worksBy !== "me", text: "Are you concerned about damage to your home?",
    options: [
      { v: "yes", label: "Yes, I want a record first", score: { SOC: 3 }, also: ["SOC"], why: "You want evidence of condition before work starts" },
      { v: "already", label: "Damage has already happened", set: { damageDone: true }, score: { EW: 3, SOC: 1 }, also: ["EW"], why: "Damage has already happened", note: "ew" },
      { v: "no", label: "Not particularly" },
    ] },
  { id: "q_w_plans", stage: 2, followUp: true, when: f => f.route === "works" && f.worksBy === "me", text: "Do you also need drawings or calculations?",
    options: [
      { v: "plans", label: "Measured drawings for planning or design", set: { needsPlans: true }, score: { MEAS: 3 }, also: ["MEAS"], note: "nomeasure" },
      { v: "calcs", label: "Structural calculations", score: { STRUCT: 3 }, also: ["STRUCT"] },
      { v: "no", label: "No" },
    ] },
  { id: "q_w_date", stage: 3, type: "date", when: f => f.route === "works", dateKey: "startDate",
    text: "When is the work planned to start?", help: "Party wall notices must be served in advance: at least 2 months for work to a shared wall, 1 month for excavation or a new wall on the line." },

  /* ----- Valuation route ----- */
  { id: "q_v_why", stage: 1, when: f => f.route === "valuing", text: "Who needs the valuation, and why?",
    help: "Valuations look alike but follow different rules depending on who relies on them.",
    options: [
      { v: "buy", label: "Me, to check a purchase price", score: { L2: 4 }, set: { wantVal: true }, why: "You want to check a purchase price", note: "l2v" },
      { v: "htb", label: "Homes England (Help to Buy)", set: { htb: true }, score: { HTB: 8 }, why: "Repaying a Help to Buy equity loan" },
      { v: "so", label: "My housing provider (staircasing)", set: { so: true }, score: { SO: 8 }, why: "Buying more shares in a shared ownership home" },
      { v: "prob", label: "An estate after a death", set: { prob: true }, score: { PROB: 8 }, why: "Valuing an estate for probate", note: "probate" },
      { v: "mat", label: "A separation or divorce", set: { mat: true }, score: { MAT: 8 }, why: "Dividing assets on separation" },
      { v: "lease", label: "Extending a lease or buying the freehold", score: { LEASE: 8 }, why: "A lease extension or freehold purchase", note: "lease" },
      { v: "rca", label: "My insurer (rebuild cost)", score: { RCA: 8 }, why: "Setting buildings insurance cover" },
      unsure(),
    ] },
  { id: "q_v_reader", stage: 1, followUp: true, when: f => f.route === "valuing" && f._q_v_why === "unsure", text: "Who will read the report?",
    help: "The reader decides the rules: a lender, a tax office and a court each need something different.",
    options: [
      { v: "lender", label: "A lender", score: { RB: 2, L2: 2 }, note: "mv" },
      { v: "agency", label: "Homes England or a housing association", score: { HTB: 4, SO: 4 } },
      { v: "hmrc", label: "HMRC or the estate's solicitor", score: { PROB: 6 }, set: { prob: true }, note: "probate" },
      { v: "court", label: "A court or the other side", score: { MAT: 4, EW: 3 } },
      { v: "me", label: "Only me", score: { RB: 5 } },
    ] },
  { id: "q_v_htb_year", stage: 2, followUp: true, when: f => f.htb, text: "Which Help to Buy scheme is your loan from?",
    help: "Your Help to Buy paperwork or online account shows the scheme. It decides which surveyors may value the home.",
    options: [
      { v: "2013", label: "2013–2021 scheme", set: { htbYear: "2013" } },
      { v: "2021", label: "Equity Loan 2021–2023", set: { htbYear: "2021" }, why: "Your loan is from the 2021–2023 scheme, so the valuer must be MRICS or FRICS", note: "htb" },
      unsure({ set: { htbYear: "unsure" }, note: "htb" }),
    ] },
  { id: "q_v_htb_clad", stage: 2, followUp: true, when: f => f.htb, text: "Is there external cladding, or any planning breach?",
    help: "If so, Homes England may require a specialist valuation.",
    options: [
      { v: "yes", label: "Yes", set: { htbSpecial: true }, why: "Cladding or a planning breach may need a specialist valuation" },
      { v: "no", label: "No" },
      unsure({ set: { htbSpecial: true } }),
    ] },
  { id: "q_v_prob", stage: 2, followUp: true, when: f => f.prob, text: "Is the value for the date of death, or for selling now?",
    options: [
      { v: "dod", label: "Date of death, for the estate", why: "Inheritance tax uses the value at the date of death", note: "probate" },
      { v: "now", label: "Today, for a sale", score: { RB: 3 } },
      { v: "both", label: "Both", why: "You need the date-of-death value as well as today's", note: "probate" },
    ] },
  { id: "q_v_mat", stage: 2, followUp: true, when: f => f.mat, text: "Have both sides agreed to one valuer?",
    options: [
      { v: "joint", label: "Yes, one joint valuer", why: "A single joint expert both sides can rely on" },
      { v: "own", label: "No, we each want our own", score: { EW: 2 } },
      unsure(),
    ] },
  { id: "q_v_date", stage: 3, type: "date", when: f => f.route === "valuing" && !f.prob, dateKey: "deadline",
    text: "Is there a date you're working to?", help: "For example a remortgage, redemption or completion date. Some valuations are only valid for 3 months." },

  /* ----- Dispute route ----- */
  { id: "q_d_kind", stage: 1, when: f => f.route === "dispute", text: "What is the dispute about?",
    options: [
      { v: "boundary", label: "Where the boundary is", set: { boundaryQ: true }, score: { BOUND: 6 }, why: "The boundary position is disputed", note: "boundary" },
      { v: "damage", label: "Damage from a neighbour's building work", set: { neighbourWorks: true }, score: { EW: 3, PW: 2, SOC: 1 }, why: "Damage from a neighbour's work", note: "pw" },
      { v: "missed", label: "A survey or report missed a problem", score: { EW: 4, DEFECT: 2 }, why: "A report missed a problem", note: "ew" },
      { v: "disrepair", label: "Disrepair with a landlord", score: { EW: 4 }, why: "A disrepair dispute" },
      unsure({ score: { EW: 2, DEFECT: 2 } }),
    ] },
  { id: "q_d_claim", stage: 2, followUp: true, when: f => f.route === "dispute" && !f.boundaryQ, text: "Are you considering a legal claim, or do you just need it fixed?",
    help: "If a claim is possible, a solicitor will usually instruct an expert witness, whose duty is to the court.",
    options: [
      { v: "claim", label: "A claim is likely", set: { claim: true }, score: { EW: 5 }, why: "A legal claim is likely", note: "ew" },
      { v: "fix", label: "I just need it fixed", score: { DEFECT: 5, EW: -2 }, why: "You want the cause and the fix" },
      unsure({ score: { EW: 2, DEFECT: 2 } }),
    ] },
  { id: "q_d_when", stage: 3, followUp: true, when: f => f.route === "dispute" && !f.boundaryQ, text: "When did you first become aware of the problem?",
    help: "Claims are subject to legal time limits, so timing matters.",
    options: [
      { v: "recent", label: "Within the last year", set: { awareness: "recent" } },
      { v: "mid", label: "1 to 3 years ago", set: { awareness: "mid" } },
      { v: "old", label: "More than 3 years ago", set: { awareness: "old" }, why: "Time limits may be close" },
      unsure({ set: { awareness: "unsure" } }),
    ] },
  { id: "q_d_bound", stage: 2, followUp: true, when: f => f.route === "dispute" && f.boundaryQ, text: "Where are things with your neighbour?",
    options: [
      { v: "agreed", label: "We agree; it just needs recording", score: { BOUND: 3 }, why: "An agreed boundary can be recorded" },
      { v: "disagree", label: "We disagree", score: { BOUND: 2 }, why: "Mediation may help before court" },
      { v: "legal", label: "Solicitors are involved", score: { EW: 4, BOUND: 1 }, why: "Expert evidence may be needed" },
    ] },

  /* ----- Single concern route ----- */
  { id: "q_x_kind", stage: 1, when: f => f.route === "worry", text: "What is the concern?",
    options: [
      { v: "crack", label: "Cracking", set: { crack: true }, score: { DEFECT: 3 } },
      { v: "damp", label: "Damp or mould", set: { damp: true }, score: { DEFECT: 3 } },
      { v: "roof", label: "The roof", set: { roofIssue: true }, score: { DEFECT: 4 } },
      { v: "knot", label: "Japanese knotweed", set: { knotweed: true }, score: { KNOT: 8 }, why: "Possible Japanese knotweed", note: "knot" },
      { v: "clad", label: "Cladding or external walls", set: { type: "flat", ews1: true }, score: { EWS1: 8 }, why: "External wall or cladding concerns", note: "ews1" },
      { v: "services", label: "Electrics or heating", score: { ELEC: 5, GAS: 4 }, why: "Concerns about electrics or heating" },
      unsure({ score: { DEFECT: 3 } }),
    ] },
  { id: "q_x_buying", stage: 3, when: f => f.route === "worry", text: "Are you buying this property?",
    help: "If you're buying, a full survey can look at this concern and everything else at once.",
    options: [
      { v: "yes", label: "Yes", set: { buyingToo: true }, score: { L3: 6 }, why: "You're buying, so a full survey covers this and more" },
      { v: "no", label: "No, I already own it" },
    ] },

  /* ----- 04 Timeline ----- */
  { id: "q_t_stage", stage: 3, when: f => f.route === "buying" && !f.newbuild, text: "Where are you in the purchase?",
    options: [
      { v: "looking", label: "Viewing, no offer yet", set: { stage: "looking" } },
      { v: "offer", label: "Offer accepted", set: { stage: "offer" } },
      { v: "searches", label: "Mortgage and searches under way", set: { stage: "searches" } },
      { v: "exchange", label: "Exchange date agreed", set: { stage: "exchange" } },
      { v: "exchanged", label: "Already exchanged", set: { stage: "exchanged" } },
    ] },
  { id: "q_t_chain", stage: 3, when: f => f.route === "buying" && !f.newbuild && f.stage !== "exchanged", text: "Is there a chain?",
    help: "A chain is the line of linked sales and purchases that depend on each other.",
    options: [
      { v: "none", label: "No chain", sub: "Empty home, first-time buyer and seller moving out", set: { chain: "none" } },
      { v: "short", label: "Short chain", sub: "One or two other moves", set: { chain: "short" } },
      { v: "long", label: "Long chain", sub: "Three or more", set: { chain: "long" } },
      unsure({ set: { chain: "unsure" } }),
    ] },
  { id: "q_t_date", stage: 3, type: "date", when: f => (f.route === "buying" && f.stage !== "exchanged") || f.newbuild, dateKey: "targetDate",
    text: "Is there a proposed exchange or completion date?", help: "Even a rough target helps us show when to instruct." },
  { id: "q_t_money", stage: 3, when: f => f.route === "buying" && !f.newbuild, text: "How are you paying?",
    options: [
      { v: "mortgage", label: "With a mortgage", note: "mv" },
      { v: "cash", label: "Cash", set: { wantVal: true }, why: "As a cash buyer there's no lender valuation", note: "l2v" },
      unsure({ note: "mv" }),
    ] },
  { id: "q_t_price", stage: 3, when: f => f.route === "buying" && !f.newbuild && !f.wantVal, text: "Do you want your own view on value?",
    options: [
      { v: "yes", label: "Yes, to negotiate with confidence", set: { wantVal: true }, why: "You want your own valuation", note: "l2v" },
      { v: "ins", label: "Only a rebuild cost for insurance", set: { wantVal: true }, why: "You want a reinstatement cost", note: "l2v" },
      { v: "no", label: "No" },
    ] },
  { id: "q_t_plans", stage: 3, when: prop, text: "Any plans for work once it's yours?",
    options: [
      { v: "major", label: "Major works or renovation", score: { L3: 3 }, also: ["STRUCT"], why: "You plan major works", tell: "Mention your plans for works" },
      { v: "plans", label: "I'll need floor plans or sizes", set: { needsPlans: true }, also: ["MEAS"], note: "nomeasure" },
      { v: "minor", label: "Decorating only", score: { L2: 1 } },
      { v: "none", label: "No plans" },
    ] },
  { id: "q_c_why", stage: 3, when: f => f.route === "condition", text: "Why do you want the condition checked now?",
    options: [
      { v: "selling", label: "I'm selling soon", score: { L2: 2 }, why: "A survey shows problems that could delay a sale" },
      { v: "maint", label: "To plan maintenance", score: { L2: 2 } },
      { v: "works", label: "Before major works", score: { L3: 3 }, why: "You're planning major works" },
    ] },
  { id: "q_t_depth", stage: 3, when: existing, text: "How much detail do you want?",
    options: [
      { v: "headline", label: "Condition ratings only", score: { L1: 3 }, why: "You want condition ratings rather than repair advice" },
      { v: "advice", label: "Defects explained, with repair advice", score: { L2: 3 } },
      { v: "all", label: "Causes, repair options and timescales", score: { L3: 3 }, why: "You want causes, options and timescales" },
    ] },
];

FMS.stages = ["Brief", "Property", "Concerns", "Timeline", "Located"];
