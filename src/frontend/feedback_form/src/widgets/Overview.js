import React from 'react';
import {
    Alert,
    Button, Checkbox, FormControl, Glyphicon, OverlayTrigger,
    Panel, Tooltip
} from "react-bootstrap";
import MultipleSelect from "../components/multiselect/MultiSelect";
import InstructionsAlert from "../main_layout/InstructionsAlert";
import {WIDGET} from "../main_layout/menu_and_widgets/constants"
import {addGene, addSpecies, removeGene, removeSpecies} from "../redux/overviewActions";
import {getGeneModel, getGenes, getSpecies} from "../redux/overviewSelectors";
import {connect} from "react-redux";

class Overview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            cb_gmcorr: props.geneModel.checked,
            cb_gmcorr_details: props.geneModel.details,
            show_fetch_data_error: false,
        };

        this.check_cb = props["checkCb"].bind(this);
        this.toggle_cb = props["toggleCb"].bind(this);
        this.selfStateVarModifiedFunction = this.selfStateVarModifiedFunction.bind(this);
    }

    selfStateVarModifiedFunction(value, stateVarName) {
        let stateElem = {};
        stateElem[stateVarName] = value;
        this.setState(stateElem);
    }

    setSuccessAlertMessage() {
        this.alertDismissable.setSaved(true);
    }

    render() {
        const geneTooltip = (
            <Tooltip id="tooltip">
                Please validate the list of genes in your paper in the box below by adding or removing genes if required. Only genes mentioned 2 or more times are extracted
            </Tooltip>
        );

        const speciesTooltip = (
            <Tooltip id="tooltip">
                Please validate the list of species in your paper in the box below by adding or removing species if required. Only species mentioned 10 or more times are extracted
            </Tooltip>
        );
        let geneListComponent;
        if (this.props.hideGenes) {
            geneListComponent = (<Alert bsStyle="warning">More than 100 genes were extracted from the paper and they were omitted from the Author First Pass interface. If you would like to validate the list of genes click <a onClick={() => {
                this.props.toggleEntityVisibilityCallback("hide_genes")
            }}>here</a>. If you prefer not to, all the genes extracted will be associated to this paper in WormBase</Alert>);
        } else {
            geneListComponent = (
            <MultipleSelect
                itemsNameSingular={"gene"}
                itemsNamePlural={"genes"}
                selectedItems={this.props.genes.elements}
                selectedItemsCallback={this.props.stateVarModifiedCallback}
                stateVarName={"selectedGenes"}
                searchType={"gene"}
                sampleQuery={"e.g. dbl-1"}
                addItemCallback={this.props.addGene}
                removeItemCallback={this.props.removeGene}
            />);
        }
        return (
            <div>
                <InstructionsAlert
                    alertTitleNotSaved=""
                    alertTitleSaved="Well done!"
                    alertTextNotSaved="In this page you will see genes and species that have been identified in your
                    paper. Please validate the list by adding/removing entries in the identified lists. You can also
                    notify us for gene model updates."
                    alertTextSaved="The data for this page has been saved, you can modify it any time."
                    saved={this.props.genes.saved && this.props.species.saved}
                    ref={instance => { this.alertDismissable = instance; }}
                />
                <form>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">List of WormBase genes identified in the paper <OverlayTrigger placement="top" overlay={geneTooltip}>
                                <Glyphicon glyph="question-sign"/></OverlayTrigger></Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            {geneListComponent}
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">New Gene Name</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Button bsClass="btn btn-info wrap-button" bsStyle="info" onClick={() => {
                                            this.check_cb("cb_gmcorr", "geneModCorrection");
                                            window.open("http://www.wormbase.org/submissions/gene_name.cgi", "_blank");
                                        }}>
                                            Request New Gene Name
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">Gene model updates and gene sequence connection</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Button bsClass="btn btn-info wrap-button" bsStyle="info" onClick={() => {
                                            this.check_cb("cb_gmcorr", "geneModCorrection");
                                            window.open("http://www.wormbase.org/submissions/gene_name.cgi", "_blank");
                                        }}>
                                            Report Gene-Sequence
                                        </Button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Checkbox checked={this.state.cb_gmcorr}
                                                  onClick={() => this.toggle_cb("cb_gmcorr", "geneModCorrection")}>
                                            <strong>Gene model correction/update</strong></Checkbox>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <FormControl type="text" placeholder="Add details here"
                                                     value={this.state.cb_gmcorr_details}
                                                     onClick={() => this.check_cb("cb_gmcorr", "geneModCorrection")}
                                                     onChange={(event) => {
                                                         this.props.stateVarModifiedCallback(event.target.value, "geneModCorrectionDetails");
                                                         this.selfStateVarModifiedFunction(event.target.value, "cb_gmcorr_details")
                                                     }}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">&nbsp;</div>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">Species in the paper <OverlayTrigger placement="top"
                                                                                                  overlay={speciesTooltip}>
                                <Glyphicon glyph="question-sign"/></OverlayTrigger></Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <MultipleSelect
                                itemsNameSingular={"species"}
                                itemsNamePlural={"species"}
                                selectedItems={this.props.species.elements}
                                ref={instance => { this.speciesSelect = instance; }}
                                selectedItemsCallback={this.props.stateVarModifiedCallback}
                                stateVarName={"selectedSpecies"}
                                searchType={"species"}
                                sampleQuery={"e.g. Caenorhabditis"}
                            />
                        </Panel.Body>
                    </Panel>
                </form>
                <div align="right">
                    <Button bsStyle="success" onClick={this.props.callback.bind(this, WIDGET.OVERVIEW)}>Save and continue
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    genes: getGenes(state),
    geneModel: getGeneModel(state),
    species: getSpecies(state)
});

export default connect(mapStateToProps, { addGene, removeGene, addSpecies, removeSpecies })(Overview);