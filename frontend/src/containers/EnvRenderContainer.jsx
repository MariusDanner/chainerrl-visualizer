import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';

const EnvRenderContainer = ({ imagePath }) => (
  <div>
    <Card style={{ marginTop: '5px', marginBottom: '10px' }}>
      <CardBody>
        <CardTitle>Current environment</CardTitle>
        {
          imagePath ? (
            <img
              src={`/images?image_path=${imagePath}`}
              alt="env render"
              style={{
                width: '45%', margin: '0 auto', display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                height: '45%', margin: '0 auto', display: 'block',
              }}
            />
          )
        }
      </CardBody>
    </Card>
  </div>
);

EnvRenderContainer.propTypes = {
  imagePath: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  imagePath: state.log.logDataRows.length > 0 ? state.log.logDataRows[state.plotRange.focusedStep].image_path : '',
});

export default connect(mapStateToProps, null)(EnvRenderContainer);
