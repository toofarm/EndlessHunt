import React, { Component } from 'react';

import { addWishlistItem } from '../../../actions'

import { connect } from 'react-redux'

import { controlPanelDatalayerPush } from '../../../constants/utilities'

import { SlideDown } from 'react-slidedown'
import "../../../../node_modules/react-slidedown/lib/slidedown.css"

import { byPropKey } from '../../../constants/utilities'

const INITIAL_STATE = {
  error: null,
  link: '',
  company: '',
  title: '',
  date: undefined,
  showForm: false
}

class AddWishlistItem extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    
    this.send = this.send.bind(this)
    this.toggleSlideDown = this.toggleSlideDown.bind(this)

  }

  send () {
    const { addItem } = this.props
    let id = this.props.id
    let data = {}
    let date = new Date(Date.now())
    date = Date.parse(date)
    data['url'] = this.state.link
    data['company'] = this.state.company
    data['title'] = this.state.title
    data['date'] = date
    addItem(id, data)
    controlPanelDatalayerPush(
      'Wishlist', 
      'Add Wishlist item', 
      data.url, 
      data
    )
    this.toggleSlideDown()
  }

  toggleSlideDown () {
    if (this.state.showForm === false) this.setState(byPropKey('showForm', true))
    else this.setState(byPropKey('showForm', false))
    this.setState(byPropKey('link', ''))
  }

  render() {

    const {
        link
      } = this.state;
  
      const isInvalid =
        link === ''

    return (
      <div>
        <h5
        className="wishlist-add-item-btn"
        onClick={this.toggleSlideDown}>Add job to wishlist {this.state.showForm === false ? "+" : "—"}</h5>
        <SlideDown className="job-app-slidedown">
            {this.state.showForm && <div className="add-wishlist-item-meat">
            {isInvalid && <div className="ui-info">Wishlist items require a link</div>}
                <div className="jobs-input-group">
                    <label htmlFor="link">Link{isInvalid && <span className="required">*</span>}</label>
                    <input type="text" id="link" name="link" className="ui-input" 
                        onChange={event => this.setState(byPropKey('link', event.target.value))} />
                </div>
                <div className="jobs-input-group">
                    <div className="jobs-input-wrapper">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" className="ui-input" 
                        onChange={event => this.setState(byPropKey('company', event.target.value))} />
                    </div>
                    <div className="jobs-input-wrapper">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" className="ui-input" 
                        onChange={event => this.setState(byPropKey('title', event.target.value))} />
                    </div>
                </div>
                <button className="wishlist-add-btn"
                    disabled={isInvalid}
                    onClick={this.send}>
                    Add to list
                </button>
            </div>}
        </SlideDown>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.wishlistState.items
});

const mapDispatchToProps = (dispatch) => ({
  addItem: (id, data) => dispatch(addWishlistItem(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddWishlistItem);

