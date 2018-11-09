import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteQvaluesContainer from './DiscreteQvaluesContainer';
import ContinuousStochasticActionsContainer from './ContinuousStochasticActionsContainer';
import DiscreteStochasticActionsContainer from './DiscreteStochasticActionsContainer';

import {
  mapAgentProfileToValuesPaneList,
  DISCRETE_ACTION_VALUE_PANE,
  GAUSSIAN_DISTRIBUTION_PANE,
  SOFTMAX_DISTRIBUTION_PANE,
} from '../settings/agent';

const ValuesPaneContainer = ({ valuesPaneName }) => {
  switch (valuesPaneName) {
    case DISCRETE_ACTION_VALUE_PANE:
      return <DiscreteQvaluesContainer />;
    case GAUSSIAN_DISTRIBUTION_PANE:
      return <ContinuousStochasticActionsContainer />;
    case SOFTMAX_DISTRIBUTION_PANE:
      return <DiscreteStochasticActionsContainer />;
    default:
      return <div />;
  }
};

ValuesPaneContainer.propTypes = {
  valuesPaneName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const paneList = mapAgentProfileToValuesPaneList(state.agentProfile);
  return {
    valuesPaneName: paneList.length === 0 ? '' : paneList[0],
  };
};

export default connect(mapStateToProps, null)(ValuesPaneContainer);
