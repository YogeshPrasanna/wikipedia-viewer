import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: [],
      searchVal: "",
    };
  }
  filterJSON(res) {
    return res.json();
  }

  filterStatus(res) {
    if (res.status >= 200 && res.status < 300) {
      return res;
    }
    const error = new Error(res.statusText);
    error.res = res;
    error.type = 'http';
    throw error;
  }

  async getData (url) {
    return await fetch(url)
    .then(this.filterStatus)
    .then(this.filterJSON);
  }

  onSearch() {
    this.setState({
      searchVal: "",
      store: []
    });

    var url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&format=json&search=${this.state.searchVal}`;
    var data = this.getData(url);
    data.then((data) => {
      let len = data[1].length;
      for (let i = 0; i < len; i++) {
        let obj = {
          title: data[1][i],
          details: data[2][i],
          links: data[3][i],
          img: "http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg",
        }
        let imgUrl =  `https://en.wikipedia.org/w/api.php?action=query&titles=${obj.title}&origin=*&prop=pageimages&format=json&pithumbsize=100`
        let imgData = this.getData(imgUrl);
        imgData.then((res) => {
          console.log(res, obj);
          if (Object.values(res.query.pages)[0].hasOwnProperty('thumbnail') && Object.values(res.query.pages)[0].thumbnail.source !== ""  ) {
            obj.img = Object.values(res.query.pages)[0].thumbnail.source;
            let store = this.state.store;
            store.push(obj);
            this.setState({store});
          }
        });

      }
    console.log(data);
    })
  }

  renderEl() {
    let store = this.state.store;
    let elements = store.map((el) => {
      return (
        <div key={_.uniqueId()} className="col-sm-4 card animate-flicker" style={{display:"inline-block"}}>
          <img className="card-img-top" src={el.img} width="200" height="100" alt="" />
          <div className="card-block">
            <h4 className="card-title">{el.title}</h4>
            <p className="card-text">{el.details}</p>
            <a href={el.links} rel="noopener noreferrer" className="btn btn-primary link-btn text-center" target="_blank" >Checkout the wikipedia page</a>
          </div>
        </div>
      );
    });
    return elements;
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <div className="form-inline text-center">
              <div className="form-group">
                <input
                  type="text"
                  id="search"
                  className="form-control"
                  onChange={(e) => this.setState({searchVal: e.target.value})}
                  placeholder="Search . . ."
                  name=""
                  value={this.state.searchVal}
                  />
                <button id="search-submit" onClick={this.onSearch.bind(this)} className="btn btn-primary">Search</button>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
          <div className="col-sm-12" id="result-section">
            {this.renderEl()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('main-section')
);
