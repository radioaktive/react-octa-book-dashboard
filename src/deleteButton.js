import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class DeleteButton extends Component {
    constructor (props) {
        super(props);
        this.state = {
            id: props.bookId,
            isUpdating: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        console.log(this.props);
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });

        const accessToken = await this.props.auth.getAccessToken();
        console.log(accessToken);
        const response = await fetch(API_BASE_URL + "/" + this.state.id, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        console.log(response);
        const data = await response.json();
        console.log(data);

        this.setState({
            isUpdating: false
        });

        if (! data.errors) {
            this.props.onDelete(data, this.state.id);
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Button type='submit' loading={this.state.isUpdating}>Delete</Button>
            </Form>
        )
    }
});
