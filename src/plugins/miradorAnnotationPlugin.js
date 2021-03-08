import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from 'mirador/dist/es/src/state/actions';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import { SingleCanvasDialog } from '../SingleCanvasDialog';


/** */
class MiradorAnnotation extends Component {
  /** */
  constructor(props) {
    super(props);
    this.state = {
      singleCanvasDialogOpen: false,
    };
    this.openCreateAnnotationCompanionWindow = this.openCreateAnnotationCompanionWindow.bind(this);
    this.toggleSingleCanvasDialogOpen = this.toggleSingleCanvasDialogOpen.bind(this);
  }

  /** */
  openCreateAnnotationCompanionWindow(e) {
    const {
      addCompanionWindow,
    } = this.props;

    addCompanionWindow('annotationCreation', {
      position: 'right',
    });
  }

  toggleSingleCanvasDialogOpen() {
    this.setState({
      singleCanvasDialogOpen: !this.state.singleCanvasDialogOpen,
    });
  }

  /** */
  render() {
    const { TargetComponent, targetProps } = this.props;
    return (
      <div>
        <TargetComponent
          {...targetProps} // eslint-disable-line react/jsx-props-no-spreading
        />
        <MiradorMenuButton
          aria-label="Create new annotation"
          onClick={this.props.windowViewType === 'single' ? this.openCreateAnnotationCompanionWindow : this.toggleSingleCanvasDialogOpen}
          size="small"
        >
          <AddBoxIcon />
        </MiradorMenuButton>
        {
          this.state.singleCanvasDialogOpen && (
            <SingleCanvasDialog
              open={this.state.singleCanvasDialogOpen}
              handleClose={this.toggleSingleCanvasDialogOpen}
              openCreateAnnotationCompanionWindow={this.openCreateAnnotationCompanionWindow}
              switchToSingleCanvasView={this.props.switchToSingleCanvasView}
            />
          )
        }
      </div>
    );
  }
}

MiradorAnnotation.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

/** */
const mapDispatchToProps = (dispatch, props) => ({
  addCompanionWindow: (content, additionalProps) => dispatch(
    actions.addCompanionWindow(props.targetProps.windowId, { content, ...additionalProps }),
  ),
  switchToSingleCanvasView: () => dispatch(
    actions.setWindowViewType(props.targetProps.windowId, 'single')
  )
});

const mapStateToProps = (state, props) => ({
  windowViewType: getWindowViewType(state, { windowId: props.targetProps.windowId }),
});

export default {
  component: MiradorAnnotation,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  target: 'AnnotationSettings',
};
