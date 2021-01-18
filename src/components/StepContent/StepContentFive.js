import React from 'react';
import { Form, Button } from 'antd';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';

import MiniDp from './MiniDp/MiniDp';

const StepContentFive = ({
  deviceName,
  timezone,
  contentURL,
  deviceInfo,
  rotation,
  username,
  setCurrentStep,
  token,
}) => {
  const { Item } = Form;

  const renderNetworkStatus = () => {
    if (deviceInfo.ethernet_connect_state === 'enabled') {
      return (
        <>
          <FormattedMessage id="app.connected" />
          {', '}
          <FormattedMessage id="app.ethernet" />
        </>
      );
    }
    if (deviceInfo.wifi_connect_state === 'enabled') {
      return 'Wi-Fi';
    }
    return <FormattedMessage id="app.noConnection" />;
  };

  const renderIpAddress = () => {
    if (deviceInfo.ethernet_connect_state === 'enabled') {
      return deviceInfo.ethernet_ip;
    }
    if (deviceInfo.wifi_connect_state === 'enabled') {
      return deviceInfo.wifi_ip;
    }
  };

  const renderMiniDpText = () => {
    if (rotation === 'normal') return 'Normal';
    if (rotation === 'left') return 'Left';
    if (rotation === 'right') return 'Right';
    if (rotation === 'inverted') return 'Inverted';
  };

  const handleClose = async () => {
    try {
      const res = await axios.post(
        '/v1/close_browser',
        { value: deviceInfo.eth_mac },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data);
      window.close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 13 }}
      layout="horizontal"
      size="large"
      onFinish={handleClose}
    >
      <Item
        label={
          <span>
            <FormattedMessage id="app.playerName" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {deviceName}
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.timeZone" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {timezone}
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.contentUrl" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {contentURL}
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.rotation" />
          </span>
        }
        style={{ fontSize: 18, color: '#fff' }}
      >
        <MiniDp text={renderMiniDpText()} />
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.networkStatus" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {deviceInfo && renderNetworkStatus()}
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.ip" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {deviceInfo && renderIpAddress()}
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.userName" />
          </span>
        }
        style={{ fontSize: 18 }}
      >
        {username}
      </Item>
      <div className="steps-action">
        <Button
          size="large"
          style={{ marginRight: 20 }}
          onClick={() => setCurrentStep(3)}
        >
          <FormattedMessage id="app.prev" />
        </Button>
        <Button type="primary" htmlType="submit" size="large">
          <FormattedMessage id="app.done" />
        </Button>
      </div>
    </Form>
  );
};

export default StepContentFive;
