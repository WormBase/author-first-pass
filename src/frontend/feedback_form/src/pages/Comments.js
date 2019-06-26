import React from 'react';
import {Button, FormControl, Image, Panel} from "react-bootstrap";
import InstructionsAlert from "../main_layout/InstructionsAlert";
import {WIDGET} from "../main_layout/MenuAndWidgets";

class Other extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            saved: props["saved"],
            other: props["other"],
            personid: props.personId
        };

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
        return (
            <div>
                <InstructionsAlert
                    alertTitleNotSaved=""
                    alertTitleSaved="Well done!"
                    alertTextNotSaved="In this page you can update your contact info, submit your unpublished data to
                    microPublication, send comments to the WormBase team and finalize the data submission process."
                    alertTextSaved="The data for this page has been saved, you can modify it any time."
                    saved={this.state.saved}
                    ref={instance => { this.alertDismissable = instance; }}
                />
                <form>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">
                                Update contact info
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        Please check that your contact info is up to date by clicking on the button below
                                    </div>
                                </div>
                                <br/>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <Button bsClass="btn btn-info wrap-button" bsStyle="info"
                                                href={"https://wormbase.org/submissions/person.cgi?action=Display&number=WBPerson" + this.state.personid}
                                                target={"_blank"}>
                                            Update contact info</Button>
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">
                                Update lineage
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        Please check that your lineage is up to date by clicking on the button below
                                    </div>
                                </div>
                                <br/>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <Button bsClass="btn btn-info wrap-button" bsStyle="info"
                                                href={"https://wormbase.org/submissions/person_lineage.cgi?action=Display&number=WBPerson" + this.state.personid}
                                                target={"_blank"}>
                                            Update lineage</Button>
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">
                                Do you have additional unpublished data?
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="row">
                                <div className="col-sm-10">
                                    If you have unpublished data generated during this study, we encourage you to
                                    submit it at <a href="https://www.micropublication.org" target="_blank">
                                    micropublication.org</a>
                                </div>
                                <div className="col-sm-2">
                                    <a href="https://www.micropublication.org" target="_blank">
                                        <Image src="micropub_logo.png" responsive/>
                                    </a>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">
                                Have we missed anything? Do you have any comments?
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        Write comments here
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <FormControl componentClass="textarea" multiple
                                                     value={this.state.other}
                                                     onChange={(event) => {
                                                         this.props.stateVarModifiedCallback(event.target.value, "other");
                                                         this.selfStateVarModifiedFunction(event.target.value, "other");
                                                     }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                </form>
                <div align="right">
                    <Button bsStyle="success" onClick={() => {this.props.callback(WIDGET.COMMENTS)}}>Finish and submit
                    </Button>
                </div>
            </div>
        );
    }
}

export default Other;