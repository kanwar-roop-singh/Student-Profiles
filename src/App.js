import React from "react";
import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			students: [],
			isDataLoaded: false,
            showHideButtonList: {},
            tagList:{}
		};
	}

	componentDidMount() {
		fetch("https://api.hatchways.io/assessment/students")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                students: json.students,
                studentsMainCopy: json.students,
                isDataLoaded: true
            });
        })
	}

    showHideButton(id){
        let showHideButtonList=this.state.showHideButtonList||{}
        showHideButtonList[id]=!showHideButtonList[id]
        this.setState({
            showHideButtonList
        })
    }

    onSearch(){
        let results=[];
        let nameSearchValue=document.getElementById("searchByName").value.toLowerCase();
        let tagSearchValue=document.getElementById("searchByTag").value.toLowerCase();
        this.state.studentsMainCopy.map((item)=>{
            let fullName= item.firstName + " " + item.lastName; 
            fullName=fullName.toLowerCase();
            if( fullName.match(nameSearchValue) ){
                results.push(item)
            }
        })
        if(tagSearchValue){
            results=results.filter((item)=>{
                if(this.state.tagList[item.id]  ){
                    for(let i=0; i<this.state.tagList[item.id].length;i++){
                        if(this.state.tagList[item.id][i].toLowerCase().match(tagSearchValue)){
                            return true;
                        }
                    }
                   
                }
            })
        }
        
        this.setState({
            students: results,
            showHideButtonList:{}
        })
    }

    onTagInput(e,id){
        if(e.key=="Enter"){
            let tagList= this.state.tagList || {}
            tagList[id]=tagList[id]||[]
            tagList[id].push(e.target.value);
            this.setState({ tagList })
            e.target.value=""
        }
    }


	render() {
		const { isDataLoaded, students } = this.state;
		if (!isDataLoaded) return <div>	<h1> Loading the data.... </h1> </div> ;
		return (
            <div className = "App">
                <div className="mainContainer">
                    <input type="text" id="searchByName" placeholder="Search By Name" onChange={()=>{this.onSearch()}}/>
                    <input type="text" id="searchByTag" placeholder="Search By Tag" onChange={()=>{this.onSearch()}}/>
                    {
                        students.map((item) => (
                        <ol key = {item.id} >
                            <div className="imgContainer">
                                <img src={item.pic} />
                            </div>
                            <span className="buttonContainer">
                                <button className="expandButton" onClick={()=>{this.showHideButton(item.id)}} >{this.state.showHideButtonList[item.id]?<span >&#45;</span>:<span >&#43;</span>}</button>
                            </span>
                            <div className="detailsContainer">
                                <h2 className="nameContainer">{item.firstName.toUpperCase()} {item.lastName.toUpperCase()}</h2>
                                <div>Email: { item.email }</div>
                                <div>Company: { item.company }</div>
                                <div>Skill: { item.skill }</div>
                                <div>Average: { item.grades.reduce(function sum(total,marks){return parseInt(total)+parseInt(marks)})/item.grades.length  }%</div>
                                {this.state.showHideButtonList[item.id] &&
                                    <>
                                        {item.grades.map((grade,i)=>{
                                            return (<div> Test {i + 1}: {grade}% </div>);
                                        })}
                                    </>
                                }
                                <input type="text" className="tagField" onKeyUp={(e)=>{this.onTagInput(e,item.id)}}placeholder="Add a tag" />
                                
                                {this.state.tagList[item.id] &&
                                    <div className="tagContainer">
                                        {this.state.tagList[item.id].map((tag)=>{
                                            return (<span className="tag"> {tag}</span>);
                                        })}
                                    </div>
                                }
                            </div>
                            <div className="cl"></div>
                            </ol>
                        ))
                    }
                </div>
            </div>
	    );
    }
}

export default App;
