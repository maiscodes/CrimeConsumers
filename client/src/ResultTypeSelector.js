import React from "react";
import Select from "react-select"
import {FilterContext} from './FilterContext';


const options = [
  { value: 'table', label: 'Table' },
  { value: 'chart', label: 'Chart' },
  { value: 'map', label: 'Map' }
]

class ResultTypeSelector extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <FilterContext.Consumer>
      {(context) => (
      <div className= "searchBar">
        <h3>Display Type</h3>
        <Select
        options={options}
        value = {context.state.chartRaw}
        onChange={event=> {context.setChartType(event);}}/>
      </div>
      )}
      </FilterContext.Consumer>
    );
  }
}

export default ResultTypeSelector;
