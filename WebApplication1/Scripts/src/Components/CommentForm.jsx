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
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Your name"
                        value={this.state.author}
                        onChange={this.handleAuthorChange}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Say something..."
                        value={this.state.text}
                        onChange={this.handleTextChange}
                    />
                    <button
                        className="btn btn-primary"
                        type="submit"
                        value="Post"
                    >
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}
