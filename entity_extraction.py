import logging
import re

from tqdm import tqdm

SPECIES_ALIASES = {"9913": ["cow", "bovine", "calf"],
                   "7955": ["zebrafish"],
                   "7227": ["fruitfly", "fruitflies"],
                   "9606": ["human"],
                   "10090": ["mouse", "mice", "murine"],
                   "10116": ["rat"],
                   "559292": ["yeast", "budding yeast"],
                   "4896": ["fission yeast"]}

SPECIES_BLACKLIST = {"4853", "30023", "8805", "216498", "1420681", "10231", "156766", "80388", "101142", "31138",
                     "88086", "34245"}

OPENING_REGEX_STR = "[\\.\\n\\t\\'\\/\\(\\)\\[\\]\\{\\}:;\\,\\!\\?> ]"
CLOSING_REGEX_STR = "[\\.\\n\\t\\'\\/\\(\\)\\[\\]\\{\\}:;\\,\\!\\?> ]"


class TqdmHandler(logging.StreamHandler):
    def __init__(self):
        logging.StreamHandler.__init__(self)

    def emit(self, record):
        msg = self.format(record)
        tqdm.write(msg)


def get_matches_in_fulltext(fulltext_str, keywords, papers_map, paper_id, min_num_occurrences,
                            match_uppercase: bool = False):
    logger = logging.getLogger("AFP vocabulary extraction")
    logger.addHandler(TqdmHandler)
    for keyword in tqdm(keywords):
        if keyword in fulltext_str or match_uppercase and keyword.upper() in fulltext_str:
            try:
                match_counter = len(re.findall(OPENING_REGEX_STR + re.escape(keyword) + CLOSING_REGEX_STR,
                                               fulltext_str))
                if match_uppercase:
                    match_counter += len(re.findall(OPENING_REGEX_STR + re.escape(keyword.upper()) +
                                                    CLOSING_REGEX_STR, fulltext_str))
                if match_counter >= min_num_occurrences:
                    papers_map[paper_id].append(keyword)
            except:
                pass


def get_species_in_fulltext_from_regex(fulltext, papers_map, paper_id, taxon_name_map, min_occurrences: int = 1):
    for taxon_id, species_alias_arr in SPECIES_ALIASES.items():
        taxon_name_map[taxon_id].extend(species_alias_arr)
    for species_id, regex_list in tqdm(taxon_name_map.items()):
        if species_id not in SPECIES_BLACKLIST:
            num_occurrences = 0
            regex_list_mod = [regex_list[0], regex_list[0][0] + "\\. " + " ".join(regex_list[0].split(" ")[1:])]
            if len(regex_list) > 1:
                regex_list_mod.extend(regex_list[1:])
            for regex_text in regex_list_mod:
                num_occurrences += len(re.findall(re.compile(OPENING_REGEX_STR + regex_text.lower() +
                                                             CLOSING_REGEX_STR),
                                                  fulltext.lower()))
            if num_occurrences > min_occurrences:
                papers_map[paper_id].append(regex_list_mod[0].replace("\\", ""))

