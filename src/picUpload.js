import React from 'react';
import axios from './axios.js';

export class PicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    uploadProfilePic(e) {
        var file = e.target.files[0];
        console.log('this is the file: ',file);
        var formData = new FormData();
        formData.append('file', file);
        axios.post('/upload', formData)
        .then((resp) => {
            console.log('Image upload: ', resp.data.image);
            this.props.setImage(resp.data.image);
            this.setState({
                showUpload: !this.showUpload
            })
        })
    }
    render() {
        return (
            <div className="pic-upload">
                <input name="file" type="file" onChange={(e) => this.uploadProfilePic(e)} />
            </div>
        );
    }
}
