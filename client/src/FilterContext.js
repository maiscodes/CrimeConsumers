import React, {createContext} from 'react';

export const FilterContext = createContext();

const endpoints = ["areas", "ages", "genders", "years","months"];

export class FilterProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filters: {
      offence: [],
      area: [],
      age: [],
      year:[],
      gender:[],
      month:[]
    },
      filtersRaw: [null],
      chartRaw: [null],
      results: [],
      mapData: {positions: [], options: { radius: 20, opacity: 0.8 }},
      mapCenter: { lat: -23.4547974, lng: 143.9477253 },
      chartType: "",
      chartData: { labels: [],
         datasets: [{
           label: "Number of Crimes Committed in each Area",
           backgroundColor: 'rgb(255, 99, 132)',
           borderColor: 'rgb(255, 99, 132)',
          data: []
        }]
      }
    }
  }

  updateOffence = (offence) => {
    var newFilter = this.state.filters;
    newFilter["offence"] = offence;
    this.setState({filters: newFilter});
    //console.log(this.state.filters);
  }

  updateFilters = (selectedFilters, referenceOptions) => {
    this.setState({filtersRaw: selectedFilters});


    var newFilter = this.state.filters;
    var ages = [];
    var genders = [];
    var areas = [];
    var years = [];
    var months = [];
    selectedFilters.forEach( selectedFilter => {
      var groupJSON;
      var groupOptionArray;
      for (var e = 0; e < endpoints.length; e++) {
        groupJSON = referenceOptions[e];
        groupOptionArray = groupJSON["options"];
        if (groupOptionArray.includes(selectedFilter)){
          var label = groupJSON["label"];
          if (label === "ages") {
            ages.push(selectedFilter);
          }
          if (label === "genders") {
            genders.push(selectedFilter);
          }
          if (label === "areas") {
              areas.push(selectedFilter);
          }
          if (label === "years") {
              years.push(selectedFilter);
          }
          if (label === "months") {
              months.push(selectedFilter);
          }
        }
      }
      //console.log(`Selected: ${selectedFilter.label} ${selectedFilter.value}`);
    });
    newFilter["age"] = ages;
    newFilter["gender"] = genders;
    newFilter["year"] = years;
    newFilter["area"] = areas;
    newFilter["month"] = months;
    this.setState({filters: newFilter});
    //console.log(this.state.filters);


  }

  clearEverything = () => {
    this.setState({ filters: {
      offence: [],
      area: [],
      age: [],
      year:[],
      gender:[],
      month:[]
    },
      filtersRaw: [null],
      chartRaw: [null],
      results: [],
      mapData: {positions: [], options: { radius: 20, opacity: 0.8 }},
      mapCenter: {lat: -25.3456562, lng: 131.0196362},
      chartType: "",
      chartData: { labels: [],
         datasets: [{
           label: "Number of Crimes Committed in each Area",
           backgroundColor: 'rgb(255, 99, 132)',
           borderColor: 'rgb(255, 99, 132)',
          data: []
        }]
      }
    });
  }

  setResults = (results) => {
    // User Feedback Experience
    document.getElementById("resultError").innerHTML = "";

    //console.log("original results");
    //console.log(results);

    var chartData = {
      labels: [],
      datasets: [{
      label: "Number of Crimes commited per Area",
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [],
      }]
    }


    //console.log("start modifying chartData");
    var labels = [];
    var data = [];
    var nonZeroResults = [];
    var mapDataPositions = [];
    var minLng = 600;
    var maxLng = -600;
    var minLat = 600;
    var maxLat = -600;
    var tempMapData = {}
    var validResults = false;
    for (var r = 0; r < results.length; r++) {
      if (results[r].total > 0) {
        if (!validResults) {
          validResults = true;
        }
        labels.push(results[r].LGA);
        data.push(results[r].total);
        nonZeroResults.push(results[r]);


        // Now add the map data
        tempMapData = {lat: 0, lng: 0, weight: 0};
        tempMapData.lat = results[r].lat;
        tempMapData.lng = results[r].lng;
        tempMapData.weight = results[r].total;
        mapDataPositions.push(tempMapData);

        // calculate the center
        if (results[r].lat < minLat) {
          minLat = results[r].lat;
        }

        if (results[r].lng < minLng) {
          minLng = results[r].lng;
        }

        if (results[r].lat > maxLat) {
          maxLat = results[r].lat;
        }

        if (results[r].lng > maxLng) {
          maxLng = results[r].lng;
        }

      }
    }


    var mapCenter = {lat: 0, lng: 0};

    mapCenter.lat = (minLat + maxLat)/2;
    mapCenter.lng = (minLng + maxLng)/2;


    this.setState({results: nonZeroResults});
    //console.log("In FILTER CONTEXT NON ZERO results");
    //console.log(this.state.results);


    //console.log(labels);
    //console.log(data);

    chartData["labels"] = labels;
    chartData["datasets"][0].data = data;

    var mapData = {positions: [], options: { radius: 20, opacity: 0.6 }};
    mapData["positions"] = mapDataPositions;

    console.log(chartData);
    this.setState({chartData: chartData}, function(){
        console.log(this.state.chartData);});


    this.setState({mapData: mapData}, function(){
            console.log(this.state.mapData);});


    this.setState({mapCenter: mapCenter}, function(){
                    console.log(this.state.mapCenter);});

    // User feedback
    if (!validResults) {
      document.getElementById("resultError").innerHTML = "No results for this selection.";
    }

  }

  setChartType = (type) => {
    this.setState({chartType: type.value}, function(){
        console.log(this.state.chartType);});
    console.log("chart tpye set to ");

    this.setState({chartRaw: type});
  }


  render(){
    return(
      <FilterContext.Provider value={{state: this.state, setOffence: (offence) => {this.updateOffence(offence);}, setFilters: (selectedFilters, referenceOptions) => {this.updateFilters(selectedFilters, referenceOptions);}, clearEverything: () => {this.clearEverything();}, setResults: (results) => {this.setResults(results);}, setChartType: (type) =>  {this.setChartType(type);}}}>
        {this.props.children}
      </FilterContext.Provider>

    );
  }

}
