import React from 'react';
import axios from 'axios';
import CommentForm from './CommentForm.jsx'

class Students extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            name: '',
            parentName: '',
            parentPhone: '',
            parentEmail: '',
            renderCommentForm: false,
            currentStudent: {},
        }
        this.addStudents = this.addStudents.bind(this);
        this.changeStudentData = this.changeStudentData.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    // get student data based on class ID, load it into students array on comp mount
    getStudents() {
        return axios.get('/students', {
            params: {
                classID: this.props.classID,
            }
        })
    }

    componentDidMount() {
        this.getStudents()
        .then((data) => {
            this.setState({
                students: data.data,
            })
        })
    }

    // add students to database
    addStudents() {
        const { name, parentName, parentEmail, parentPhone } = this.state        
        axios.post('/students', {
            name,
            parentName,
            email: parentEmail,
            phone: parentPhone,
            classID: this.props.classID,
        })

    }

    // capture student data
    changeStudentData (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addComment(e) {
        // when button is clicked,
        // get student in that row and set state of current student to that student
        let studentID = parseInt(e.target.name);
        let studentObj = {};
        this.state.students.map(student => {
            if (student.id === studentID) {
                this.setState({
                    currentStudent: student,
                }, function() {
                        this.setState({
                            renderCommentForm: !this.state.renderCommentForm,
                        })
                })
            }
        })
    
    }


    render() {
        return(
            <div>
                <h1>Add Student to {this.props.className}</h1>
                <input placeholder="student name" name="name" onChange={this.changeStudentData}></input>
                <input placeholder="parent name" onChange={this.changeStudentData} name="parentName"></input>
                <input placeholder="parent phone" onChange={this.changeStudentData} name="parentPhone"></input>
                <input placeholder="parent email" onChange={this.changeStudentData} name="parentEmail"></input>
                <button onClick={this.addStudents}>Add Student</button>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Parent Name</th>
                            <th>Parent Phone</th>
                            <th>Parent Email</th>
                            <th>Comments</th>
                        </tr>
                        {
                            // map through students
                            // for each student, create a row
                            this.state.students.map(student => {
                               return (<tr>
                                   <td>{student.name || 'no name given'}</td>
                                   <td>{student.parentName || 'no parent name'}</td>
                                   <td>{student.phone || 'no phone number'}</td>
                                   <td>{student.email || 'no email'}</td>
                                   <button name={student.id} onClick={this.addComment}>add comment</button>
                                   <button>Show Comment History</button>
                               </tr>)
                            })
                        }
                    </thead>
                </table>
                {this.state.renderCommentForm ? <CommentForm student={this.state.currentStudent}/> : null}
            </div>
        );
    }
}


export default Students