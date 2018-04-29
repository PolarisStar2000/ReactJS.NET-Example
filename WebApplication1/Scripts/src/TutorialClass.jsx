﻿class Comment extends React.Component {
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }

    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}


class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map((comment) => (
            <Comment author={ comment.Author } key={ comment.Id }>
                { comment.Text }
            </Comment>
        ));
        return (
            <div className="commentList">
                { commentNodes }
            </div>
        );
    }
}

class CommentForm extends React.Component {
   state = {
        author: '',
        text: ''
    }
    

    handleAuthorChange = (e) => {
        this.setState({ author: e.target.value });
    }

    handleTextChange = (e) => {
        this.setState({ text: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ Author: author, Text: text });
        this.setState({ author: '', text: '' });
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
}

class CommentBox extends React.Component {

    state = {
        data: []
    }

    loadCommentsFromServer = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data });
        }.bind(this);
        xhr.send();
    }

    handleCommentSubmit = (comment) => {
        const data = new FormData();
        data.append('Author', comment.Author);
        data.append('Text', comment.Text);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    }

    componentDidMount() {
        this.loadCommentsFromServer();
        window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }

    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

ReactDOM.render(
    <CommentBox
        url="/comments"
        submitUrl="/comments/new"
        pollInterval={2000}
    />,
    document.getElementById('content')
);

