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


class FetchIP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip_version: props.ip_version,
      ipv4_address: "Still Loading",
      ipv6_address: "Still loading"
    }
    this.getIP('https://api.ipify.org', 4);
    if (props.ip_version === 6) {
      this.getIP('https://api64.ipify.org', 6);
    }
  }

  getIP(url, ip_version) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();})
      .then((addy) => {
        if (ip_version === 4) 
          this.setState({ipv4_address: addy});
        else this.setState({ipv6_address: addy});
      })
    return;
  }

  render() {
    
    if (this.state.ip_version === 4) {
      return (
        <h3>
          {"User's IPv4 Network Address: " + this.state.ipv4_address}
        </h3>
      )
    } else if (this.state.ipv4_address === this.state.ipv6_address) {
      return (
        <h3>
          {"User's IPv6 Address: Unavailable (See IPv4 Address Instead)"}
        </h3>
      )
    } else {
      return (
        <h3>
          {"User's IPv6 Network Address: " + this.state.ipv6_address}
        </h3>
      )
    }
    
  }
}



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
        tabIds={["IPv4 Address", "IPv6 Address"]}
      >
        <FetchIP ip_version={4}>
        </FetchIP>
        <FetchIP ip_version={6}>
        </FetchIP>
      </Exhibit>
        
      
    </div>
  );
}

export default App;
