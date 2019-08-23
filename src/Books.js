import React, { Component } from 'react';
import { Header, Message, Table } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'
import BookForm from './BookForm';
import DeleteButton from './deleteButton';

export default withAuth(class Books extends Component {

    constructor(props) {
        super(props);
        this.state = {
            books: null,
            isLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        this.getBooks();
    }

    async getBooks() {
        if (!this.state.books) {
            try {
                this.setState({ isLoading: true });
                const accessToken = await this.props.auth.getAccessToken();
                //console.log(accessToken);
                const response = await fetch(API_BASE_URL + '/list', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(response);
                const data = await response.json();
                console.log(data);
                this.setState({ books: data, isLoading: false});
            } catch (err) {
                this.setState({ isLoading: false });
                console.error(err);
            }
        }
    }

    onAddition(book) {
        this.setState({
            books: [...this.state.books, book]
        })
    }

    async onDelete(data, id) {
        console.log(id);
        try {
            this.setState({ isLoading: true });
            const accessToken = await this.props.auth.getAccessToken();
            //console.log(accessToken);
            const response = await fetch(API_BASE_URL + '/list', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            this.setState({ books: data, isLoading: false});
        } catch (err) {
            this.setState({ isLoading: false });
            console.error(err);
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">Books</Header>
                {this.state.isLoading && <Message info header="Loading books..." />}
                {this.state.books &&
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Author ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.books.map(
                                    book =>
                                        <tr id={book.id} key={book.id}>
                                            <td>{book.id}</td>
                                            <td>{book.name}</td>
                                            <td>{book.author}</td>
                                            <td>
                                                <DeleteButton onDelete={this.onDelete} bookId={book.id} />
                                            </td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                        <BookForm onAddition={this.onAddition} />
                    </div>
                }
            </div>
        );
    }
});
