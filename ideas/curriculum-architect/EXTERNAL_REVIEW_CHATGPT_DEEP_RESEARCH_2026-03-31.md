# Externe integriteitsreview van I-002 Curriculum Architect in IsIdeas

## Scope en beoordelingsstandaard

Ik beoordeel uitsluitend of de huidige I-002 “validation packet” + ondersteunende dossier/research **intuïtief eerlijk en niet-autoritatief blijft**, of dat er nog **verborgen autoriteitsclaims** weglekken (ook via framing/taal/labels). 

Ik blijf binnen de rol: geen product-herontwerp, geen implementatieplanning, geen feature-ideatie, geen curricula-ranking. Alleen minimale koerscorrecties indien nodig om **valse scholastieke autoriteit** te voorkomen. 

## Repo-basis en wat ik heb gelezen

In de gevraagde volgorde (en met de huidige repo-versies) heb ik gelezen:

- Validatiepakket: `ideas/curriculum-architect/RESEARCH.md`   
- Dossier: `ideas/curriculum-architect/DOSSIER.md`   
- Eerste bron-anker: `research/I-002-JAMIA-BINORIA-DARS-E-NIZAMI-SEQUENCE-2026-03-31.md`   
- Actieve focus: `catalog/ACTIVE_FOCUS.md`   
- Integriteitsboard: `catalog/INTEGRITY_BOARD.md`   
- ADR: `decisions/ADR-012-I-002-MODELABILITY-DETERMINATION.md`   
- Modelability-sessie: `research/I-002-MODELABILITY-SESSION-2026-03-31.md`   

## Beoordeling per as

axis: 1  
verdict: conditional  
confidence: moderate  
reason: Eén institutioneel-gebonden primaire bron is **genoeg als eerste anker** voor een *variant* mits je die variant-status niet alleen “disclaimt” maar ook *structureel afdwingt*; de repo doet dat deels (bron-attributie, “geen universaliteit”), maar er zitten al abstraheringen/labels (“core/co_curricular/optional”, “representativeness_status: validated”) die zonder tweede bron snel als **canoniserend** kunnen werken.     
would_change_if: Als “representativeness” niet als globale status/keurmerk wordt behandeld maar als **geattribueerde, scope-gelimiteerde validatie** (wie valideerde wat, voor welke claim, met welke grenzen), en als “core/optional”-labeling strikt wordt vervangen door **bron-eigen categorieën** (of expliciet “editorial, not scholarly”).   

axis: 2  
verdict: conditional  
confidence: moderate  
reason: Het “teacher overlay”-principe is in intentie autoriteit-behoudend (bron niet muteren, leraarpad zichtbaar naast bron, geen default/recommend), maar de gekozen framing (“override”, “contradict”, “diverge”, bron-als-basislaag) kan subtiel impliceren dat de bron de norm is en de leraar een afwijking—dat is precies het soort **status-hiërarchie** dat in de praktijk een leraar kan demoten, zelfs als je het tegendeel bedoelt.    
would_change_if: Als het packet expliciet maakt dat (a) het “teacher path” in de studentcontext als **primaire waarheid** mag functioneren, en (b) elke vergelijking met een bron **symmetrisch** wordt geframed (“verschil tussen twee paden”) i.p.v. “override/contradict”, plus een harde regel dat niets in taal/visualisatie “canon vs uitzondering” suggereert.   

axis: 3  
verdict: conditional  
confidence: moderate  
reason: “Preserveer letterlijk + annoteer” is meestal eerlijker dan stil corrigeren, maar jullie huidige verpakking (“anomaly”, “surprising order”) bevat een ingebouwde norm (“het hoort anders”), waardoor annotaties zelf een **slinkse autoriteitsclaim** kunnen worden (alsof jullie weten wat ‘normaal’ is). Daarbovenop kan het label “anomaly” bij lezers voelen als: “de software detecteert fouten in curricula”, wat precies het verkeerde signaal is.     
would_change_if: Als “observations” strikt worden beperkt tot **bron-fideliteit en extractie-epistemiek** (bv. “volgens bron staat X vóór Y; dit lijkt numeriek niet-monotoon; we claimen geen fout, enkel ‘let op’”), en “anomaly” qua semantiek wordt vervangen door iets als “non-monotonic label order”/“source-note” zonder fout-implicatie.   

axis: 4  
verdict: conditional  
confidence: low  
reason: De MVP (bronbrowser + attributie + alternatieven + één teacher overlay, zonder aanbevelingen/default pad) *kan* nuttig zijn als transparantie- en vergelijkingstool, maar de repo onderbouwt nog niet dat die nuttigheid stabiel blijft zonder alsnog “help bij kiezen”—en precies die druk is een voorspelbare route naar **herintroductie van autoriteit** (implicit defaults, ranking, readiness). “Bruikbaarheid” is hier een integriteitsrisico, niet alleen een productvraag.    
would_change_if: Als het packet (of begeleidende context) vooraf definieert welk besluit/gedrag de MVP *wel* ondersteunt zonder keuze-autoriteit (bv. “documenteer wat jouw leraar zegt vs wat bron X publiceert”) en expliciet afbakent dat “help bij kiezen” buiten scope blijft—ook als gebruikers dat vragen.   

## Overkoepelend oordeel

overall_honest: no  
second_source_required_before_further_work: no  
blocking_concern: Het grootste resterende autoriteitslek zit niet in “recommendation” (die is netjes uitgesloten), maar in **semantische kleur**: labels als “core/optional” en “anomaly/surprising” coderen een oordeel dat de repo niet mag claimen—en die oordelen kunnen later als “scholarly-ish” overkomen terwijl ze eigenlijk editoriale heuristiek zijn.     
misuse_risk: De gevaarlijkste misbruikmodus is dat een student (of bouwer) het ene institutionele schema alsnog als *de* standaard gebruikt via impliciete default (“dit is wat Dars-e-Nizami is”), of dat “observations/anomalies” worden gelezen als softwarematige correctheidssignalen (“de tool weet dat dit raar/fout is”), waarmee jullie onbedoeld een pseudo-‘scholarly referee’ worden.    
open_note: Jullie eigen interne documenten gebruiken soms nog normatieve taal (“right order”, “validates the concept”); ook al is dat niet per se in de externe packettekst, het creëert intern een **teleologie** (“er is een juiste volgorde”) die later makkelijk teruglekt in copy/UX/featurekeuzes.     

Expliciet: ik zou **pauzeren** vóór je de packet verstuurt, maar alleen voor een *kleine integriteits-revisie* (terminologie/labeling/epistemische status van notes), en daarna direct door naar de beoogde “eerste externe validatie response” stap.    

## repo-grounded-summary

- Het huidige validatiepakket vraagt expliciet om een externe check op representativiteit, teacher-override, anomalie-preservatie en MVP-nut zonder aanbevelingen; het positioneert het systeem als “container, niet judge”, en sluit ranking/recommendation/UI-advies expliciet uit.   
- Het dossier formaliseert een authority-boundary datamodel met bron-attributie, geen cross-source canon, en een teacher overlay die de bron niet muteert; en het definieert een MVP die nadrukkelijk géén default pad of readiness scoring bevat.   
- De Jamia Binoria note is inhoudelijk opgezet als “één institutioneel-gebonden sequence” en claimt expliciet niet-universaliteit; maar introduceert tegelijk model-implicaties die makkelijk normatief kunnen lezen (“core” vs “co_curricular”, “anomaly”).    
- ADR-012 en de modelability-sessie erkennen dat eerdere claims over curricula deels “general knowledge” waren en dat externe validatie nodig blijft; tegelijk gebruiken ze woorden als “validate” die intern autoriteitsglans kunnen geven zonder primaire brondiscipline.    
- De repo heeft als actieve focus expliciet: “wacht op eerste externe validatie response” en het integriteitsboard zet dat als open integriteitsactie; dat is consistente procesdiscipline.    

## external-knowledge-notes

- Ik heb de genoemde Jamia Binoria pagina extern geopend om te verifiëren dat de bron daadwerkelijk een 8-jarig schema publiceert met de genoemde stage labels en dat de (door de repo genoemde) “Al-Hidaya part 4 in jaar 6” en “part 3 in jaar 7” inderdaad zo op de pagina staat; dit ondersteunt dat de repo-extractie hier geen evidente fabricatie is. citeturn8view0
