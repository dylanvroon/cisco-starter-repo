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
        <div>
          <div className={'Data-Template'}>
            <button className={'IP-Address'}>
              {"IPv4 Address: " + this.state.ipv4_address}
            </button>
          </div>
        </div>
      )
    } else if (this.state.ipv4_address === this.state.ipv6_address) {
      return (
        <div>
          <div className={'Data-Template'}>
            <button className={'IP-Address'}>
              {"IPv6 Address is unavailable. See IPv4 Address instead."}
            </button>
          </div>
        </div>
      )
    } else {
      return (
        
        <div>
          <div className={'Data-Template'}>
            <button className={'IP-Address'}>
              {"IPv6 Address: " + this.state.ipv6_address}
            </button>
          </div>
        </div>
      )
    }
    
  }
}


class PylonLatency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webSocket: this.createWebSocket(),
      avgLatency: 0,
      totalReceived: 0,
      lastLatency: undefined,
      lastMsg: undefined,
      openedWS: false,
      currTime: new Date().getTime(),
      count: 0,
      mostRecent: Array(0),
      closed: false,
    };
    console.clear();

  }

  createWebSocket() {
    const webSock = new WebSocket('ws://localhost:55455');
    webSock.addEventListener('open', (event) => {
      webSock.send('Hello Server!');
    });
    webSock.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      var currTime = new Date().getTime();
      var msgNum = parseInt(msg, 10);
      var lastLat = currTime - msgNum;
      const lastMsgData = {
        timeSent: msgNum,
        timeRec: currTime,
        latency: lastLat
      };

      var newRecent = this.state.mostRecent.slice();
      if (newRecent.unshift(lastMsgData) > 5) {
        newRecent.pop();
      }
      
      
      this.setState({
        lastLatency: lastLat,
        lastMsg: msg,
        avgLatency: ((this.state.avgLatency * this.state.totalReceived + lastLat)/(this.state.totalReceived + 1)),
        totalReceived: (this.state.totalReceived + 1),
        currTime: currTime,
        count: 0,
        mostRecent: newRecent,
      });
    });
  

    return webSock;
  }

  showTime(time) {
    var d = new Date(time);
    var h = d.getHours();
    if (h < 10) {
      h = '0' + h;
    }
    var m = d.getMinutes();
    if (m < 10) {
      m = '0' + m;
    }
    var s = d.getSeconds();
    if (s < 10) {
      s = '0' + s;
    }
    var ms = d.getMilliseconds();
    if (ms < 10) {
      ms = '00' + ms;
    } else if (ms < 100) {
      ms = '0' + ms;
    }
    return h + ":" + m +  ":" + s + "." + ms;
  }

  showMostRecent(index) {
    if (this.state.mostRecent !== null && this.state.mostRecent.length > index) {
      var lat = this.state.mostRecent[index].latency;
      var color = 'none';
      if (lat < (this.state.avgLatency * 4/3 || lat < 2)) {
        color = 'green';
      } else if (lat < this.state.avgLatency * 3) {
        color = 'orange';
      } else {
        color = 'red';
      }
      return (
        <tr>
          <td>{this.showTime(this.state.mostRecent[index].timeSent)}</td>
          <td>{this.showTime(this.state.mostRecent[index].timeRec)}</td>
          <td className={color}>{lat}</td>
        </tr>
      );
      
    } else {
      return;
    }
    
  }

  closeConnection() {
    var webSock = this.state.webSocket;
    webSock.close();
    this.setState({
      webSocket: webSock,
      closed: true
    });
    return;
  }

  render() {
    var avgLatency = 0;
    if (this.state.webSocket.readyState === 0) {
      return (
        <div className={'Data-Template'}>
          <button className={'IP-Address'}>
            {"Still Attempting to Connect :/"}
          </button>
        </div>
      )
    } else if (this.state.webSocket.readyState === 1 && !this.state.closed) {
      avgLatency = (this.state.avgLatency % 1 === 0) ? this.state.avgLatency : this.state.avgLatency.toFixed(3);
      return (
        <div>
          <div className={'Data-Template'}>
            <button className={'Pylon-Total-Received'}>
              {"Total Packets Received: " + this.state.totalReceived}
            </button>
            <button className={'Pylon-Avg-Latency'}>
              {"Average Packet Latency: " + avgLatency + ' s'}
            </button>
            
          </div>
          <table id="Pylon-table">
              <tr>
                <th colSpan={3}>{'Most Recent Packets Received'}</th>
              </tr>
              <tr>
                <th>{'Time Sent:'}</th>
                <th>{'Time Received:'}</th>
                <th>{'Latency (in ms):'}</th>
              </tr>
              {this.showMostRecent(0)}
              {this.showMostRecent(1)}
              {this.showMostRecent(2)}
              {this.showMostRecent(3)}
              {this.showMostRecent(4)}

          </table>
          <div className={'Data-Template'}>
            <button
             className={'IP-Address'}
             onClick={() => this.closeConnection()}>
              {"Click here to close connection"}
            </button>
          </div>
        </div>
      )
    } else {
      avgLatency = (this.state.avgLatency % 1 === 0) ? this.state.avgLatency : this.state.avgLatency.toFixed(3);
      return (
        <div>
          <div className={'Data-Template'}>
            <button className={'Pylon-Total-Received'}>
              {"Total Packets Received: " + this.state.totalReceived}
            </button>
            <button className={'Pylon-Avg-Latency'}>
              {"Average Packet Latency: " + avgLatency + ' s'}
            </button>
            
          </div>
          <table id="Pylon-table">
              <tr>
                <th colSpan={3}>{'Most Recent Packets Received'}</th>
              </tr>
              <tr>
                <th>{'Time Sent:'}</th>
                <th>{'Time Received:'}</th>
                <th>{'Latency (in ms):'}</th>
              </tr>
              {this.showMostRecent(0)}
              {this.showMostRecent(1)}
              {this.showMostRecent(2)}
              {this.showMostRecent(3)}
              {this.showMostRecent(4)}

          </table>
          <div className={'Data-Template'}>
            <button className={'IP-Address'}>
              {"Connection Closed"}
            </button>
          </div>
        </div>
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
          <button className={'App-tab-row-whitespace'}></button>
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
                <h3>No data given for this tab</h3>
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
        tabIds={["IPv4 Address", "IPv6 Address", "Latency Info"]}
      >
        <FetchIP ip_version={4}>
        </FetchIP>
        <FetchIP ip_version={6}>
        </FetchIP>
        <PylonLatency>
        </PylonLatency>
      </Exhibit>
        
      
    </div>
  );
}

export default App;
