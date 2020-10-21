import React from 'react';
import {FilterContext} from './FilterContext';
import {Bar} from 'react-chartjs-2';
import GoogleMapReact from 'google-map-react';


const errorMsg = "Whoops! Something went wrong. Please refresh the page and try again";

export class ChartWrapper extends React.Component {

  render() {

    return (

      <FilterContext.Consumer>
        {(filters) => (
            <div className="search">
            <h3 id = "resultError"></h3>
            <Chart results= {filters.state.results} type = {filters.state.chartType}/>
            </div>
        )}
      </FilterContext.Consumer>

    );
  }

}

function ColumnResults ({contents}) {
  return (
    <React.Fragment>
      <td>{contents["LGA"]}</td>
      <td>{contents["total"]}</td>
      <td>{contents["lat"]}</td>
      <td>{contents["lng"]}</td>
    </React.Fragment>
  );
}

function RowResults( {results} ) {
  return (
    <React.Fragment>
      {results.map(result => <tr><ColumnResults contents={result} /></tr>)}
    </React.Fragment>
  );
}




class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: ""};
  }
  render() {
    if (this.props.type === "chart") {
      try {
        return (
          <FilterContext.Consumer>
            {(filters) => (
            <div className="result">
            <h3>Results</h3>
            <div className="barChart">
            <Bar
              data={filters.state.chartData}
              options={{maintainAspectRatio: false, responsive: true}}
              xAxisID="Areas"
              yAxisID = "Number of Offences"
              height = {600}
              />
            </div>
            </div>
            )}
            </FilterContext.Consumer>
        )
      }
      catch (err) {
        let errorMessage = document.getElementById("resultError");
        errorMessage.innerHTML = errorMsg;
      }


    }
    if (this.props.type === "table") {
      try {
        return (
          <div className="result">
          <FilterContext.Consumer>
            {(filters) => (
              <React.Fragment>
              <h3>Results</h3>
              <table className="Table">
              <thead>
              <tr>
                <th>Council</th>
                <th>Number of Crimes</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
              </thead>
              <tbody>
              <RowResults results = {filters.state.results}/>
              </tbody>
              </table>
              </React.Fragment>

            )}
          </FilterContext.Consumer>
          </div>
        )
      }
      catch (err) {
        let errorMessage = document.getElementById("resultError");
        errorMessage.innerHTML =  errorMsg;
      }

    }



  if (this.props.type === "map") {
    try {
      return (
        <FilterContext.Consumer>
          {(filters) => (
            <React.Fragment>
            <div className = "googleMapContainer">
            <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBwyxdcyBbFJHQ_Kfjtp8Reguxe_vV1kFY" }}
            zoom = {4}
            defaultCenter={{  lat: -23.4547974, lng: 143.9477253}}
            center = {filters.state.mapCenter}
            heatmapLibrary={true}
            heatmap={filters.state.mapData}
            >

            </GoogleMapReact>
            </div>

          </React.Fragment>
        )}
      </FilterContext.Consumer>
      )
    }
    catch (err) {
      let errorMessage = document.getElementById("resultError");
      errorMessage.innerHTML =  errorMsg;
    }

  }
    else {
      return (
        <div id = "resultMessage" className = "error">
        </div>
      );
    }
  }
}
