import {
    CheckboxWithDetails, EntityList,
    getCheckbxOrSingleFieldFromWBAPIData,
    getSetOfEntitiesFromWBAPIData, getTableValuesFromWBAPIData
} from "../AFPValues";

export class DataManager {
    constructor(apiPostgresEndpoint, apiDBEndpoint, apiWriteEndpoint, writePasswd) {
        if (!!DataManager.instance) {
            return DataManager.instance;
        }

        DataManager.instance = this;
        this.writePasswd = writePasswd;
        this.apiWriteEndpoint = apiWriteEndpoint;
        this.apiPostgresEndpoint = apiPostgresEndpoint;
        this.apiDBEndpoint = apiDBEndpoint;
        let emptyVal = [ { id: 1, name: "" } ];
        this.genesList = new EntityList(new Set(), false);
        this.speciesList = new EntityList(new Set(), false);
        this.structCorrcb = new CheckboxWithDetails(false, "", false);
        this.variationsList = new EntityList(new Set(), false);
        this.strainsList = new EntityList(new Set(), false);
        this.seqChange = new CheckboxWithDetails(false, "", false);
        this.otherVariations = new EntityList(emptyVal, false);
        this.otherStrains = new EntityList(emptyVal, false);
        this.transgenesList = new EntityList(new Set(), false);
        this.otherTransgenesList = new EntityList(emptyVal, false);
        this.otherAntibodiesList = new EntityList({id: 1, name: "", publicationId: ""}, false);
        this.newAntibodies = new CheckboxWithDetails(false, "", false);
        this.person = {name: '', personId: undefined};
        this.expression = new CheckboxWithDetails(false, "", false);
        this.siteOfAction = new CheckboxWithDetails(false, "", false);
        this.timeOfAction = new CheckboxWithDetails(false, "", false);
        this.rnaSeq = new CheckboxWithDetails(false, "", false);
        this.additionalExpr = '';
        this.geneint = new CheckboxWithDetails(false, "", false);
        this.geneprod = new CheckboxWithDetails(false, "", false);
        this.genereg = new CheckboxWithDetails(false, "", false);
        this.newmutant = new CheckboxWithDetails(false, "", false);
        this.rnai = new CheckboxWithDetails(false, "", false);
        this.overexpr = new CheckboxWithDetails(false, "", false);
        this.chemphen = new CheckboxWithDetails(false, "", false);
        this.envpheno = new CheckboxWithDetails(false, "", false);
        this.catalyticact = new CheckboxWithDetails(false, "", false);
        this.othergenefunc = new CheckboxWithDetails(false, "", false);
        this.disease = new CheckboxWithDetails(false, "", false);
        this.comments = '';
    }

    getPaperData() {
        return new Promise((resolve, reject ) => {
            this.fetchGETData(this.apiPostgresEndpoint)
                .then(result => {
                    this.genesList = getSetOfEntitiesFromWBAPIData(result.genestudied, result.genestudied, "WBGene");
                    this.speciesList = getSetOfEntitiesFromWBAPIData(result.species, result.species, undefined);
                    this.structCorrcb = getCheckbxOrSingleFieldFromWBAPIData(result.structcorr, undefined);
                    this.variationsList = getSetOfEntitiesFromWBAPIData(result.variation, result.variation, "");
                    this.strainsList = getSetOfEntitiesFromWBAPIData(result.strain, result.strain, undefined);
                    this.seqChange = getCheckbxOrSingleFieldFromWBAPIData(result.seqchange, result.seqchange);
                    this.otherVariations = getTableValuesFromWBAPIData(result.othervariation, false);
                    this.otherStrains = getTableValuesFromWBAPIData(result.otherstrain, false);
                    this.transgenesList = getSetOfEntitiesFromWBAPIData(result.transgene, result.transgene, "");
                    this.otherTransgenesList = getTableValuesFromWBAPIData(result.othertransgene, false);
                    this.otherAntibodiesList = getTableValuesFromWBAPIData(result.otherantibody, true);
                    this.newAntibodies = getCheckbxOrSingleFieldFromWBAPIData(result.antibody, undefined);
                    this.expression = getCheckbxOrSingleFieldFromWBAPIData(result.otherexpr, result.otherexpr);
                    this.siteOfAction = getCheckbxOrSingleFieldFromWBAPIData(result.siteaction, undefined);
                    this.timeOfAction = getCheckbxOrSingleFieldFromWBAPIData(result.timeaction, undefined);
                    this.rnaSeq = getCheckbxOrSingleFieldFromWBAPIData(result.rnaseq, result.rnaseq);
                    this.additionalExpr = getCheckbxOrSingleFieldFromWBAPIData(result.additionalexpr, undefined);
                    this.geneint = getCheckbxOrSingleFieldFromWBAPIData(result.geneint, result.geneint);
                    this.geneprod = getCheckbxOrSingleFieldFromWBAPIData(result.geneprod, result.geneprod);
                    this.genereg = getCheckbxOrSingleFieldFromWBAPIData(result.genereg, result.genereg);
                    this.newmutant = getCheckbxOrSingleFieldFromWBAPIData(result.newmutant, result.newmutant);
                    this.rnai = getCheckbxOrSingleFieldFromWBAPIData(result.rnai, result.rnai);
                    this.overexpr = getCheckbxOrSingleFieldFromWBAPIData(result.overexpr, result.overexpr);
                    this.chemphen = getCheckbxOrSingleFieldFromWBAPIData(result.chemphen, undefined);
                    this.envpheno = getCheckbxOrSingleFieldFromWBAPIData(result.envpheno, undefined);
                    this.catalyticact = getCheckbxOrSingleFieldFromWBAPIData(result.catalyticact, undefined);
                    this.othergenefunc = getCheckbxOrSingleFieldFromWBAPIData(result.othergenefunc, undefined);
                    this.disease = getCheckbxOrSingleFieldFromWBAPIData(result.humdis, undefined);
                    this.comments = getCheckbxOrSingleFieldFromWBAPIData(result.comment, undefined);
                    resolve();
                })
                .catch(error => {
                    reject();
                });
        });
    }

    getPersonData(passwd, personId) {
        let payload = {};
        payload.passwd = passwd;
        payload.person_id = personId;
        return new Promise((resolve, reject ) => {
            this.fetchPOSTData(this.apiDBEndpoint, payload)
                .then(result => {
                    this.person.name = result.fullname;
                    this.person.personId = result.person_id;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    postWidgetData(payload) {
        payload.passwd = this.writePasswd;
        return this.fetchPOSTData(this.apiWriteEndpoint, payload);
    }

    fetchPOSTData(endpoint, payload) {
        return new Promise((resolve, reject ) => {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'text/html',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    reject("Error")
                }
            }).then(data => {
                if (data === undefined) {
                    reject("Empty response")
                }
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    fetchGETData(endpoint, payload) {
        return new Promise((resolve, reject ) => {
            fetch(endpoint)
                .then(res => {
                    if (res.status === 200) {
                        return res.json()
                    } else {

                    }
                }).then(data => {
                if (data !== undefined) {
                    resolve(data);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
}