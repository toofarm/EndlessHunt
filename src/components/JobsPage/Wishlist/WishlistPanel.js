import React, { Component } from "react";
import AddWishlistItem from "./AddWishlistItem";
import WishlistItem from "./WishlistItem";

import { getWishlistItems, toggleUiPanel } from "../../../actions";

import { connect } from "react-redux";

const INITIAL_STATE = {
  error: null
};

class WishlistPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel() {
    const { togglePanel } = this.props;
    togglePanel("close", null);
  }

  componentDidMount() {
    const { getItems } = this.props;
    if (!this.props.items) {
      getItems(this.props.userId);
    }
  }

  render() {
    return (
      <div className="ui-panel-wrap sort-panel">
        <h3>Wishlist</h3>
        <AddWishlistItem id={this.props.userId} />
        {!!this.props.items ? (
          Object.keys(this.props.items).map(key => (
            <WishlistItem
              reference={key}
              key={key}
              userId={this.props.userId}
              item={this.props.items[key]}
            />
          ))
        ) : (
          <div className="ui-msg">
            Use your wishlist to keep track of jobs you want to apply to later
          </div>
        )}
        <div className="btns-wrap">
          <button className="job-entry-btn" onClick={this.togglePanel}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.wishlistState.items
});

const mapDispatchToProps = dispatch => ({
  getItems: id => dispatch(getWishlistItems(id)),
  togglePanel: (order, data) => dispatch(toggleUiPanel(order, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WishlistPanel);
