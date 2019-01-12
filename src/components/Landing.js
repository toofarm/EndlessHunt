import React, { Component } from 'react';
import LoginPanel from './LoginPanel'
import welder from '../static/img/welder_700.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSuitcase, faSort, faChartPie } from '@fortawesome/free-solid-svg-icons'

const INITIAL_STATE = {
    error: null,
    slideNum: 1,
    picList: [],
    showLoginPanel: false
}

const maxMobileWidth = 1024

export class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }

        this.showSignUpPanel = this.showSignUpPanel.bind(this)
    }

    showSignUpPanel (e) {
        if (e.target.classList.value.includes("opp")) {
            if (this.state.showLoginPanel === false) {
                this.setState({
                    showLoginPanel: true
                })
            } else {
                this.setState({
                    showLoginPanel: false
                })
            }
        }
    }

    componentDidMount () {

        function importImages(r) {
            let images = {}
            let imagesList = []
            r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
            for (var key in images) {
                imagesList.push(images[key])
            }
            return imagesList
        }

        if (window.innerWidth >= maxMobileWidth) {
            this.setState({
                picList: importImages(require.context('../static/img/heroImages', false, /\.(png|jpe?g|svg)$/))
            }) 

            var self = this

            setInterval( () => {
                if (self.state.slideNum < self.state.picList.length) {
                    self.setState({
                        slideNum: self.state.slideNum + 1
                    })
                } else {
                    self.setState({
                        slideNum: 1
                    })
                }
            }, 9000)
        }
        document.title = "The Endless Hunt | An app for managing your job search"
    } 
    

    render() {
        var backgroundPic = 'url(' + this.state.picList[this.state.slideNum - 1] + ')'
        var mobStyle = {
            backgroundImage: 'url(' + welder + ')'
        }

        return (
            <div className="landing-meta-wrap">
                {
                (window.innerWidth >= maxMobileWidth) ?
                <div style={{backgroundImage : backgroundPic}}
                className="landing-hero-wrap">
                    <div className="gradient-overlay">
                        <LoginPanel />
                        <div className="landing-header">
                            A tool that helps you manage your neverending job hunt
                        </div>
                    </div>
                </div> :
                <div className="landing-wrap-mobile" 
                style={mobStyle}>
                    <div className="landing-mobile-inner">
                        <h2 className="mobile-headline">
                            Manage your neverending job hunt
                        </h2>
                        <div className="benefits-wrap">
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faSuitcase}
                                    className="benefits-icon" />
                                    <div className="benefits-inner">
                                        Keep your job applications centralized and accessible
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faSort}
                                    className="benefits-icon" />
                                    <div className="benefits-inner">
                                        Sort and compare your applications
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faChartPie}
                                    className="benefits-icon" />
                                    <div className="benefits-inner">
                                        Access statistical insights into your job hunt
                                    </div>
                                </li>
                            </ul>
                        </div>
                        {
                            this.state.showLoginPanel ?
                            <div className="login-mob-wrap opp"
                                onClick={(e) => this.showSignUpPanel(e)}>
                                <LoginPanel />
                            </div> :
                            ""
                        }
                        <div className={"sign-up-btn opp " + 
                            (this.state.showLoginPanel ? "hide" : "")}
                            onClick={(e) => this.showSignUpPanel(e)}>
                            sign up / sign in
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default Landing


