import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class BookForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            name: '',
            authorid: 0,
            errorMessage: '',
            error: false,
            isLoading: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

        this.setState({
            [name]: value
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true,
            error: false,
            errorMessage: ''
        });

        const accessToken = await this.props.auth.getAccessToken();
        console.log(accessToken);
        const toSent = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "name": this.state.name,
                "authorid": this.state.authorid
            }
            )
        };
        console.log(toSent);
        const response = await fetch(API_BASE_URL + '/add', toSent);
        console.log(response);
        const data = await response.json();
        console.log(data);

        if (data.errors) {
            this.setState({
                isLoading: false,
                error: true,
                errorMessage: data.errors
            });
        } else {
            this.setState({
                name: '',
                authorid: 0,
                isLoading: false,
                error: false,
                errorMessage: ''
            });
            this.props.onAddition(data);
        }
    }

    render() {
        return (
            <Form error={this.state.error} onSubmit={this.onSubmit}>
                <Form.Field error={this.state.error}>
                    <label>Name</label>
                    <input name="name" placeholder='enter book name' value={this.state.name} onChange={this.handleInputChange}/>
                { this.state.error &&
                <Message
                    error
                    header='Error creating book'
                    content={this.state.errorMessage}
                />
                }
                </Form.Field>
                <Form.Field error={this.state.error}>
                    <label>Author ID</label>
                    <input name="authorid" placeholder='enter author id' value={this.state.authorid} onChange={this.handleInputChange}/>
                { this.state.error &&
                <Message
                    error
                    header='Error creating book'
                    content={this.state.errorMessage}
                />
                }
                </Form.Field>
                <Button type='submit' loading={this.state.isLoading}>Add Book</Button>
            </Form>
        )
    }
});
