import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';
import {
  PieChart, Pie, Cell, Legend,
} from 'recharts';

import { AGENT_TO_VALUES_PANE, VALUES_PANE_TO_TITLE } from '../settings/agent';

/* eslint-disable prefer-destructuring */

const DiscreteStochasticActionsContainer = ({
  actionProbs, actionTaken, actionMeanings, actionColors, paneTitle,
}) => {
  const legendPayload = Object.values(actionMeanings).map((actionMeaning, actionIdx) => ({
    id: actionMeaning,
    value: actionMeaning,
    type: 'diamond',
    color: actionColors[actionIdx],
  }));

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
  }) => {
    const RADIAN = Math.PI / 180;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  renderCustomizedLabel.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    midAngle: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
    outerRadius: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  };

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle style={{ marginBottom: '0.25rem' }}>{paneTitle}</CardTitle>
          <p style={{ margin: 0 }}>
            {'( '}
            Next action is
            {' '}
            {' '}
            <strong style={{ color: actionColors[actionTaken] }}>
              {actionMeanings[actionTaken]}
            </strong>
            {' )'}
          </p>
          <PieChart
            width={400}
            height={250}
            style={{ margin: '0 auto' }}
          >
            <Pie
              data={actionProbs}
              dataKey="prob"
              isAnimationActive={false}
              outerRadius="90%"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {
                actionProbs.map((entry) => (
                  <Cell fill={entry.actionColor} key={entry.actionName} />
                ))
              }
            </Pie>
            <Legend payload={legendPayload} />
          </PieChart>
        </CardBody>
      </Card>
    </div>
  );
};

DiscreteStochasticActionsContainer.propTypes = {
  actionProbs: PropTypes.arrayOf(PropTypes.shape({
    actionName: PropTypes.string.isRequried,
    prob: PropTypes.number.isRequired,
  })).isRequired,
  actionTaken: PropTypes.number.isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  paneTitle: PropTypes.string.isRequired,
};

const mapStateToActionProbs = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.serverState.actionMeanings;
  const actionColors = state.serverState.actionColors;

  if (!logDataRow) {
    return [];
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'action_probs')) {
    return [];
  }

  return logDataRow.action_probs.map((actionProb, actionIdx) => ({
    actionName: actionMeanings[actionIdx],
    actionColor: actionColors[actionIdx],
    prob: actionProb,
  }));
};

const mapStateToActionTaken = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];

  if (!logDataRow) {
    return -1;
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'action')) {
    return -1;
  }

  return logDataRow.action;
};

const mapStateToProps = (state) => ({
  actionProbs: mapStateToActionProbs(state),
  actionTaken: mapStateToActionTaken(state),
  actionMeanings: state.serverState.actionMeanings,
  actionColors: state.serverState.actionColors,
  paneTitle: VALUES_PANE_TO_TITLE[AGENT_TO_VALUES_PANE[state.serverState.agentType]],
});

export default connect(mapStateToProps, null)(DiscreteStochasticActionsContainer);
