import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';
import formFields from './formFields';

const SurveyFormReview = (props) => {
    const reviewFields = _.map(formFields, (field) => {
        return (
            <div key={field.name} >
                <label>{field.label}</label>
                <div>
                    {props.formValues[field.name]}
                </div>
            </div>
        );
    });

    return (
        <div>
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <button className="yellow darken-3 white-text btn-flat" onClick={props.onCancel}>
                Back
            </button>
            <button onClick={() => props.submitSurvey(props.formValues, props.history)} className="green white-text btn-flat right">Send Survey<i className="material-icons right">email</i></button>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        formValues: state.form.surveyForm.values
    };
};

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));

