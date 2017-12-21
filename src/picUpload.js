import React from 'react';
import axios from './axios.js';

export class PicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    uploadProfilePic(e) {
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('file', file);
        axios.post('/upload', formData)
        .then((resp) => {
            this.props.setImage(resp.data.image);
            this.setState({
                showUpload: !this.showUpload
            })
        })
    }
    render() {
        return (
            <div className="pic-upload">
                <input name="file" id="profile-pic-upload" type="file" className="file-input" onChange={(e) => this.uploadProfilePic(e)} />
                <label htmlFor="profile-pic-upload" onChange={(e) => this.uploadProfilePic(e)}>Change Picture</label>
            </div>
        );
    }
}
