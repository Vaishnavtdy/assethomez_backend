/*
 *
 * HomePage
 *
 */

import React, {memo, useEffect, useState} from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {useIntl, FormattedMessage} from 'react-intl';
import {socket} from '../../utils/socket';
import getTrad from '../../utils/getTrad';

import {
  request,
  PluginHeader,
  Row,

} from 'strapi-helper-plugin';
import {Button} from "@buffetjs/core";

const HomePage = () => {
  const {formatMessage} = useIntl();

  const [showLoader, setShowLoader] = useState(false);
  const [logData, setLogData] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  useEffect(() => {

    socket.on('build_logs', (data) => {
      console.log(data);
      setIsBtnClicked(true);
      setLogData(oldLogs => [...oldLogs, data]);

    });
    socket.on('build_finished', (data) => {
      console.log(data);
      setIsBtnClicked(false);
      if (data.success) {
      } else {
      }

      alert(data.message)

    });

    socket.on("disconnect", () => {
      console.log('disconnect=', socket.id); // undefined
    });

    return function cleanup() {
      console.log('cleanup hook');
      socket.removeAllListeners();
    };

  }, []);

  async function build() {
    setIsBtnClicked(true);
    setLogData([]);
    var result = await request('/app-builder/build', {
      method: 'GET',
    });
  }

  const title = 'Build App';


  return (
    <div className="container-fluid" style={{padding: "18px 30px"}}>
      <Row className="row">
        <div className="col-sm-6">
          <PluginHeader title="App Builder" description="Custom build and deploy app"/>
        </div>
        <div className="col-sm-6 text-right">
          <Button label={formatMessage({id: getTrad("newTemplate")})} onClick={build} isLoading={isBtnClicked}/>
        </div>
      </Row>
      <Row className="row">
        <div className="container">
          <ul>

            {
              logData.map((log, ind) => (
                <li key={ind}>{log}</li>
              ))
            }
          </ul>
        </div>
      </Row>
    </div>

  );
};

export default memo(HomePage);
