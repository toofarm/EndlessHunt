import React, { Component } from 'react';
import { updateWishlistItem, deleteWishlistItem, toggleUiPanel } from '../../../actions'
import { connect } from 'react-redux'
import { byPropKey } from '../../../constants/utilities'
import { controlPanelDatalayerPush } from '../../../constants/utilities'

const INITIAL_STATE = {
  link: '',
  company: '',
  title: '',
  date: undefined,
  showForm: false,
  readTitle: true,
  readCompany: true,
  readLink: true
}

class WishlistItem extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    
    this.toggleSlideDown = this.toggleSlideDown.bind(this)
    this.sendUpdate = this.sendUpdate.bind(this)
    this.delete = this.delete.bind(this)
    this.apply = this.apply.bind(this)
  }

  toggleSlideDown () {
    if (this.state.showForm === false) this.setState(byPropKey('showForm', true))
    else this.setState(byPropKey('showForm', false))
    this.setState(byPropKey('link', ''))
  }

  sendUpdate () {
    const { updateItem } = this.props
    let ref = this.props.reference
    let id = this.props.userId
    let data = {}
    data['url'] = this.state.link
    data['company'] = this.state.company
    data['title'] = this.state.title
    data['date'] = this.props.item.date
    updateItem(id, ref, data)
    controlPanelDatalayerPush(
        'Wishlist',
        'Update Wishlist item',
        this.state.link,
        data
    )
    this.setState({
        readTitle: true,
        readCompany: true,
        readLink: true
    })
  }

  apply () {
    const { togglePanels } = this.props
    let data = {}
    data['url'] = this.state.link
    data['company'] = this.state.company
    data['title'] = this.state.title
    data['ref'] = this.props.reference
    controlPanelDatalayerPush(
        'Wishlist',
        'Apply from Wishlist',
        this.state.link,
        data
    )
    togglePanels("addNew", data)
  }

  delete () {
      const { deleteItem } = this.props
      let id = this.props.userId
      let ref = this.props.reference
      deleteItem(id, ref)
      controlPanelDatalayerPush(
          'Wishlist',
          'Delete Wishlist Item',
          this.state.link
      )
  }

  componentDidMount () {
      const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      let dateCreated = new Date(this.props.item.date)
      let day = dateCreated.getDate(), month = months[dateCreated.getMonth()], year = dateCreated.getFullYear()
      this.setState({
          link: this.props.item.url,
          company: this.props.item.company,
          title: this.props.item.title,
          date: `${day} ${month}, ${year}`
      })
  }

  render() {
    return (
      <div className="wishlist-item">
        <div  className="wishlist-items-wrap">
            {this.props.item.title !== '' && <div className="wishlist-input">
                <label>Title</label>
                <input type="text" value={this.state.title} readOnly={this.state.readTitle}
                    onDoubleClick={() => this.setState(byPropKey('readTitle', false))} 
                    onChange={e => this.setState(byPropKey('title', e.target.value))}
                    onBlur={this.sendUpdate} 
                    />
                </div>}
            {this.props.item.company !== '' && <div className="wishlist-input">
                <label>Company</label>
                <input type="text" value={this.state.company} readOnly={this.state.readCompany}
                    onDoubleClick={() => this.setState(byPropKey('readCompany', false))} 
                    onChange={e => this.setState(byPropKey('company', e.target.value))}
                    onBlur={this.sendUpdate} />
                </div>}
            <div className="wishlist-input">
                <label>Link</label>
                <input type="text" value={this.state.link} readOnly={this.state.readLink}
                    onDoubleClick={() => this.setState(byPropKey('readLink', false))}
                    onChange={e => this.setState(byPropKey('link', e.target.value))}
                    onBlur={this.sendUpdate} />
            </div>
            <div className="wishlist-input">
                <label>Date added</label>
                <span className="wishlist-date">{this.state.date}</span>
            </div>
        </div>
        <div className="wishlist-item-btns">
            <button
                className="wishlist-apply"
                onClick={this.apply}>
                Apply
            </button>
            <button
                className="wishlist-delete"
                onClick={this.delete}>
                X
            </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.wishlistState.items
});

const mapDispatchToProps = (dispatch) => ({
  updateItem: (id, ref, data) => dispatch(updateWishlistItem(id, ref, data)),
  deleteItem: (id, ref) => dispatch(deleteWishlistItem(id, ref)),
  togglePanels: (order, data) => dispatch(toggleUiPanel(order, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WishlistItem);

