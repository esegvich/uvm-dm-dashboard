import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            donations: [],
            pollingCount: 0,
            delay: 2000,
            teamLeaders: [],
            oldDonations: [],
            bigDonation: null
        }

    }

    componentDidMount(){
        this.interval = setInterval(this.poll, this.state.delay);
        this.poll();
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    poll = () => {
        this.setState({pollingCount: this.state.pollingCount + 1, oldDonations: this.state.donations});
        fetch('https://events.dancemarathon.com/api/events/rallython26/donations?limit=5')
            .then(response => response.json())
            .then(data => {
                this.setState({donations: data})
                data.forEach(d => {
                    if(!this.state.oldDonations.map(o => o.donationID).includes(d.donationID) && d.amount >= 50.0){
                        this.setState({bigDonation: d});
                        document.getElementById('donationAlert').classList.remove("donationAlertHidden");
                        this.start();
                    }
                });
            });
    }

    start(){
        var popup = setInterval(function() {
            document.getElementById('donationAlert').classList.add("donationAlertHidden");
            clearInterval(popup);
        },8000);
    }

    render(){
        return <><Row className="filledRow">
            <div className="donationTable">
                <div className="donationAlert donationAlertHidden" id="donationAlert">
                    <h1><strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> is a hero and raised <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!</h1>
                </div>
                <RecentDonations donations={this.state.donations}/>
            </div>
        </Row>
        <Row style={{display: "inline-block"}}>
            <div className="countdown">
                <span>🐙</span>
                <Countdown date={new Date("March 29, 2026 00:00:00")} daysInHours={true}/>
                <span style={{padding: 0}}> until Rallython Reveal!</span>
                <span>🐙</span>
            </div>
        </Row>
        {/* <Row>
            <div className="">
                <Leaderboard title={"Test"} leaders={this.state.teamLeaders}/>
            </div>
        </Row>*/}</>
    }
}

export default Dashboard;