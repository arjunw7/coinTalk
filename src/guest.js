import React from 'react';
import { GuestHeader } from './guestHeader';
import { Footer } from './footer';

export class Guest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <GuestHeader />
                    { this.props.children }
                <Footer />
            </div>
        )
    }
}
