import React from 'react';
import './App.css';

function Banner(props) {
  return (
    <BannerBorder>
      <p className={'App-banner'}>
        {props.message}
      </p>
    </BannerBorder>
  )
}

function BannerBorder(props) {
  return (
    <div className={'App-banner-border'}>
      {props.children}
    </div>

  )
}

function TabId(props) {
  let className = (props.isActive) ? "App-tab-ids_active" : "App-tab-ids";
  return (
    <button 
      className={className}
      onClick={props.onClick}
      >
      {props.tabId}
    </button>
  )
}

// function WhiteSpace(props) {
//   return (
//     <button
//       className={"App-tab-whitespace"}
//     ></button>
//   )
// }




class Exhibit extends React.Component {
  constructor(props) {
    super(props);
    let currIds = props.tabIds.slice();
    if (React.Children.count(props.children) === 1) {
      this.state = {
        tabIds:
          currIds,
        tabContents:
          props.children.slice(1),
        currTab: 0,
        myChildren: props.children,
      }
    } else {
      this.state = {
        tabIds:
          currIds,
        tabContents:
          props.children,
        currTab: 0,
        myChildren: props.children,
      }
    }
  }

  changeTab(i) {
    this.setState({currTab: i});
  }


  render() {

    // for (let i = 0; i < this.state.tabIds.length; i++) {
    let noDataGiven = false;

    return (
      <div>
        <Banner message="SEXTANT NETWORK INFORMATION">
        </Banner>
        <div className={"App-tab-row"}>
          {this.state.tabIds.map((id, index) => {
            let isAct = (index === this.state.currTab);
            return (
              <TabId
                tabId={id}
                onClick={() => this.changeTab(index)}
                isActive={isAct}
              ></TabId>
            )
            
          })}
        </div>
        {this.state.tabContents.map((content, index) => {
          if (this.state.currTab >= this.state.tabContents.length && !noDataGiven) {
            noDataGiven = true;
            return (
              <div className={"App-tab-contents_visible"}>
                <p>No data given for this tab</p>
              </div>
            )
          } else {
            let className = (index === this.state.currTab) ? "App-tab-contents_visible" : "App-tab-contents_hidden";
            return (
              <div className={className}>
                {content}
              </div>
            )
          }
        })}
      </div>
      
    );
  }
}

// function T(props) {
//   return (
//     <div class="tab">

//     </div>
//   )
// }

function App() {
  return (
    <div>
      <Exhibit
        tabIds={["Public IP", "Latency Info", "Example3", "Example4"]}
      >
        <h2 >
          Public IP Address Info Here
        </h2>
        <h2>
          Latency information for packets emerging from Pylon
        </h2>
        <h2>
          Third data point
        </h2>
      </Exhibit>
        
      
    </div>
  );
}

export default App;
