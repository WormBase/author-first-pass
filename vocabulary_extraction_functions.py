import logging
import re

from tqdm import tqdm

SPECIES_REGEX_DICT = {"6277": ["Acanthocheilonema viteae", ""],
                      "470": ["Acinetobacter baumanii", ""],
                      "293684": ["Acrobeles complexus", ""],
                      "358": ["Agrobacterium tumefaciens", ""],
                      "29170": ["Ancylostoma caninum", ""],
                      "53326": ["Ancylostoma ceylanicum", ""],
                      "51022": ["Ancylostoma duodenale", ""],
                      "6313": ["Angiostrongylus cantonensis", ""],
                      "334426": ["Angiostrongylus costaricensis", ""],
                      "6269": ["Anisakis simplex", ""],
                      "70226": ["Aphelenchus avenae", ""],
                      "3702": ["Arabidopsis thaliana", ""],
                      "6252": ["Ascaris lumbricoides", ""],
                      "6253": ["Ascaris suum", ""],
                      "1404": ["Bacillus megatherium", ""],
                      "1428": ["Bacillus thuringiensis", ""],
                      "9913": ["Bos taurus", "cow, bovine, calf"],
                      "6279": ["Brugia malayi", ""],
                      "6280": ["Brugia pahangi", ""],
                      "42155": ["Brugia timori", ""],
                      "6326": ["Bursaphelenchus xylophilus", ""],
                      "860376": ["Caenorhabditis angaria", ""],
                      "135651": ["Caenorhabditis brenneri", ""],
                      "6238": ["Caenorhabditis briggsae", ""],
                      "1094321": ["Caenorhabditis doughertyi", ""],
                      "96641": ["Caenorhabditis drosophilae", ""],
                      "6239": ["Caenorhabditis elegans", ""],
                      "281687": ["Caenorhabditis japonica", ""],
                      "1611254": ["Caenorhabditis nigoni", ""],
                      "31234": ["Caenorhabditis remanei", ""],
                      "497829": ["Caenorhabditis sinica", ""],
                      "1978547": ["Caenorhabditis sp. 34 TK-2017", ""],
                      "1561998": ["Caenorhabditis tropicalis", ""],
                      "1094326": ["Caenorhabditis wallacei", ""],
                      "79923": ["Clonorchis sinensis", ""],
                      "27828": ["Cooperia oncophora", ""],
                      "5207": ["Cryptococcus neoformans", ""],
                      "53996": ["Cylicocyclus ashworthi", ""],
                      "71431": ["Cylicocyclus insigne", ""],
                      "53992": ["Cylicocyclus nassatus", ""],
                      "71465": ["Cylicostephanus goldi", ""],
                      "71466": ["Cylicostephanus longibursatus", ""],
                      "7955": ["Danio rerio", "zebrafish"],
                      "29172": ["Dictyocaulus viviparus", ""],
                      "60516": ["Diphyllobothrium latum", ""],
                      "6287": ["Dirofilaria immitis", ""],
                      "318479": ["Dracunculus medinensis", ""],
                      "98403": ["Drechmeria coniospora", ""],
                      "7227": ["Drosophila melanogaster", "fruitfly, fruitflies"],
                      "519352": ["Echinococcus canadensis", ""],
                      "6210": ["Echinococcus granulosus", ""],
                      "6211": ["Echinococcus multilocularis", ""],
                      "27848": ["Echinostoma caproni", ""],
                      "1147741": ["Elaeophora elaphi", ""],
                      "57292": ["Enoplus brevis", ""],
                      "51028": ["Enterobius vermicularis", ""],
                      "1351": ["Enterococcus faecalis", ""],
                      "1352": ["Enterococcus faecium", ""],
                      "562": ["Escherichia coli", ""],
                      "6192": ["Fasciola hepatica", ""],
                      "36090": ["Globodera pallida", ""],
                      "31243": ["Globodera rostochiensis", ""],
                      "637853": ["Gongylonema pulchrum", ""],
                      "6289": ["Haemonchus contortus", ""],
                      "6290": ["Haemonchus placei", ""],
                      "114868": ["Halicephalobus gingivalis", ""],
                      "375939": ["Heligmosomoides polygyrus", ""],
                      "51029": ["Heterodera glycines", ""],
                      "97005": ["Heterodera schachtii", ""],
                      "37862": ["Heterorhabditis bacteriophora", ""],
                      "51550": ["Heterorhabditis indica", ""],
                      "9606": ["Homo sapiens", "human"],
                      "6205": ["Hydatigera taeniaeformis", ""],
                      "6216": ["Hymenolepis diminuta", ""],
                      "85433": ["Hymenolepis microstoma", ""],
                      "102285": ["Hymenolepis nana", ""],
                      "6299": ["Litomosoides carinii", ""],
                      "42156": ["Litomosoides sigmodontis", ""],
                      "1930747": ["Leucobacter musarum", ""],
                      "7209": ["Loa loa", ""],
                      "6304": ["Meloidogyne arenaria", ""],
                      "59747": ["Meloidogyne chitwoodi", ""],
                      "298350": ["Meloidogyne floridensis", ""],
                      "6305": ["Meloidogyne hapla", ""],
                      "6306": ["Meloidogyne incognita", ""],
                      "6303": ["Meloidogyne javanica", ""],
                      "189293": ["Meloidogyne paranaensis", ""],
                      "53468": ["Mesocestoides corti", ""],
                      "151262": ["Microbacterium nematophilum", ""],
                      "10090": ["Mus musculus", "mouse, mice, murine"],
                      "51031": ["Necator americanus", ""],
                      "1913371": ["Nematocida ausubeli", ""],
                      "1805483": ["Nematocida displodere", ""],
                      "586133": ["Nematocida parisii", ""],
                      "27835": ["Nippostrongylus brasiliensis", ""],
                      "61180": ["Oesophagostomum dentatum", ""],
                      "387005": ["Onchocerca flexuosa", ""],
                      "42157": ["Onchocerca ochengi", ""],
                      "6282": ["Onchocerca volvulus", ""],
                      "6198": ["Opisthorchis viverrini", ""],
                      "592163": ["Oscheius carolinensis", ""],
                      "486159": ["Oscheius chongmingensis", ""],
                      "141966": ["Oscheius sp. FVV-2", ""],
                      "141969": ["Oscheius tipulae", ""],
                      "6317": ["Ostertagia ostertagi", ""],
                      "6233": ["Panagrellus redivivus", ""],
                      "6234": ["Panagrellus silusiae", ""],
                      "310955": ["Panagrolaimus superbus", ""],
                      "6256": ["Parascaris equorum", ""],
                      "131310": ["Parastrongyloides trichosuri", ""],
                      "96647": ["Pellioditis marina", ""],
                      "45929": ["Pratylenchus penetrans", ""],
                      "1317126": ["Pristionchus bucculentus", ""],
                      "1420681": ["Pristionchus elegans", ""],
                      "1195656": ["Pristionchus exspectatus", ""],
                      "1538716": ["Pristionchus fissidentatus", ""],
                      "54126": ["Pristionchus pacificus", ""],
                      "117903": ["Protopolystoma xenopodis", ""],
                      "287": ["Pseudomonas aeruginosa", ""],
                      "10116": ["Rattus norvegicus", "rat"],
                      "114890": ["Rhabditophanes sp. KR3021", ""],
                      "13658": ["Romanomermis culicivorax", ""],
                      "559292": ["Saccharomyces cerevisiae S288C", "Saccharomyces cerevisiae, yeast, budding yeast"],
                      "28901": ["Salmonella enterica", ""],
                      "90371": ["Salmonella typhimurium", ""],
                      "70667": ["Schistocephalus solidus", ""],
                      "6186": ["Schistosoma curassoni", ""],
                      "6185": ["Schistosoma haematobium", ""],
                      "6182": ["Schistosoma japonicum", ""],
                      "6183": ["Schistosoma mansoni", ""],
                      "48269": ["Schistosoma margrebowiei", ""],
                      "31246": ["Schistosoma mattheei", ""],
                      "6188": ["Schistosoma rodhaini", ""],
                      "4896": ["Schizosaccharomyces pombe", "fission yeast, yeast"],
                      "79327": ["Schmidtea mediterranea", ""],
                      "615": ["Serratia marcescens", ""],
                      "241478": ["Soboliphyme baturini", ""],
                      "99802": ["Spirometra erinaceieuropaei", ""],
                      "1280": ["Staphylococcus aureus", ""],
                      "34508": ["Steinernema carpocapsae", ""],
                      "52066": ["Steinernema feltiae", ""],
                      "37863": ["Steinernema glaseri", ""],
                      "90984": ["Steinernema monticolum", ""],
                      "52067": ["Steinernema riobrave", ""],
                      "90986": ["Steinernema scapterisci", ""],
                      "174720": ["Strongyloides papillosus", ""],
                      "34506": ["Strongyloides ratti", ""],
                      "6248": ["Strongyloides stercoralis", ""],
                      "75913": ["Strongyloides venezuelensis", ""],
                      "40348": ["Strongylus vulgaris", ""],
                      "451379": ["Syphacia muris", ""],
                      "60517": ["Taenia asiatica", ""],
                      "6204": ["Taenia solium", ""],
                      "45464": ["Teladorsagia circumcincta", ""],
                      "103827": ["Thelazia callipaeda", ""],
                      "6265": ["Toxocara canis", ""],
                      "6335": ["Trichinella nativa", ""],
                      "6334": ["Trichinella spiralis", ""],
                      "157069": ["Trichobilharzia regenti", ""],
                      "6319": ["Trichostrongylus colubriformis", ""],
                      "70415": ["Trichuris muris", ""],
                      "68888": ["Trichuris suis", ""],
                      "36087": ["Trichuris trichiura", ""],
                      "6293": ["Wuchereria bancrofti", ""],
                      "443947": ["Xenopus laevis laevis", ""],
                      "8364": ["Xenopus tropicalis", ""],
                      "46003": ["Xiphinema index", ""],
                      "632": ["Yersinia pestis", ""]}


class TqdmHandler(logging.StreamHandler):
    def __init__(self):
        logging.StreamHandler.__init__(self)

    def emit(self, record):
        msg = self.format(record)
        tqdm.write(msg)


def get_matches_in_fulltext(fulltext_str, keywords, papers_map, paper_id, min_num_occurrences):
    logger = logging.getLogger("AFP vocabulary extraction")
    logger.addHandler(TqdmHandler)
    fulltext_copy = fulltext_str
    for keyword in tqdm(keywords):
        try:
            regx = re.compile("[\\.\\n\\t\\'\\/\\(\\[\\{:;\\,\\!\\?> ]" + keyword +
                              "[\\.\\n\\t\\'\\/\\)\\]\\}:;\\,\\!\\?< ]")
            matches = re.findall(regx, fulltext_copy)
            if len(matches) >= min_num_occurrences:
                papers_map[paper_id].append(keyword)
        except:
            pass


def get_species_in_fulltext_from_regex(fulltext, papers_map, paper_id):
    for species_id, regex_list in SPECIES_REGEX_DICT.items():
        regex_list_mod = [regex_list[0], regex_list[0][0] + "\\. " + " ".join(regex_list[0].split(" ")[1:])]
        if regex_list[1]:
            regex_list_mod.extend(regex_list[1].split(", "))
        for regex_text in regex_list_mod:
            if re.match(re.compile(".*[\\.\\n\\t\\'\\/\\(\\[\\{:;\\,\\!\\?> ]" + regex_text.lower() +
                                   "[\\.\\n\\t\\'\\/\\)\\]\\}:;\\,\\!\\?< ].*"), fulltext.lower()):
                papers_map[paper_id].append(species_id + ";%;" + regex_list_mod[1].replace("\\", ""))

