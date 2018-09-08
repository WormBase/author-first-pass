import React from 'react';
import Button from "react-bootstrap/es/Button";
import {
    Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, HelpBlock, OverlayTrigger,
    Panel, Tooltip
} from "react-bootstrap";
import AlertDismissable from "../main_layout/AlertDismissable";

class Disease extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: '',
            active: false,
            cb_orthologs: props["orthologs"],
            cb_transgenic: props["transgenic"],
            cb_modifiers: props["modifiers"],
            comments: props["comments"]
        };

        this.toggle_cb = props["toggleCb"].bind(this);
    }

    render() {

        return (
            <div>
                <AlertDismissable title="" text="If this paper reports a disease model, please choose one or more that it
                describes." bsStyle="info"
                                  show={!this.props.saved}/>
                <AlertDismissable title="well done!" text="The data for this page has been saved, you can modify it any
                time." bsStyle="success" show={this.props.saved}/>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Disease model data in the paper</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Form>
                            <Checkbox checked={this.state.cb_orthologs} onClick={() => this.toggle_cb("cb_orthologs", "orthologsDis")}>
                                <strong>Worm ortholog/s of human disease relevant gene</strong>
                            </Checkbox>
                            <Checkbox checked={this.state.cb_transgenic} onClick={() => this.toggle_cb("cb_transgenic", "transgenicDis")}>
                                <strong>Transgenic studies with either human (or worm) disease relevant gene</strong>
                            </Checkbox>
                            <Checkbox checked={this.state.cb_modifiers} onClick={() => this.toggle_cb("cb_modifiers", "modifiersDis")}>
                                <strong>Modifiers of a new or previously established disease model (eg., drugs, herbals, chemicals, etc)</strong>
                            </Checkbox>
                        </Form>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            Additional comments on disease models
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
                                                 value={this.state.comments}
                                                 onChange={(event) => {
                                                     this.props.stateVarModifiedCallback(event.target.value, "disComments");
                                                     this.setOther(event.target.value);
                                                 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <div align="right">
                    <Button bsStyle="success" onClick={this.props.callback.bind(this, "disease")}>Save and continue
                    </Button>
                </div>
            </div>
        );
    }
}

export default Disease;