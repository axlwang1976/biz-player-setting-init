import React, { useState } from 'react';
import { Input, Radio, Form, Button, message, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import { CheckCircleTwoTone } from '@ant-design/icons';

import { subnetMaskCalc2 } from '../../utils/subnetMaskCalc';

const StepContentThree = ({
  setCurrentStep,
  token,
  deviceInfo,
  apList,
  getApList,
}) => {
  const [showBtn, setShowBtn] = useState(false);
  const [networkType, setNetworkType] = useState('ethernet');
  const [ipAssign, setIpAssign] = useState('dhcp');
  const [allItemDisabled, setAllItemDisabled] = useState(false);
  const [testing, setTesting] = useState(false);
  const { Group } = Radio;
  const { Item } = Form;

  const handleSubmit = async ({
    ip_assignment,
    static_ip,
    gateway,
    network_prefix_length,
    dns1,
    dns2,
    SSID,
    password,
  }) => {
    setTesting(true);
    const ethernetNetworkInfo = {
      ip_assignment,
      static_ip: static_ip ? static_ip : '',
      gateway: gateway ? gateway : '',
      network_prefix_length: network_prefix_length
        ? subnetMaskCalc2(network_prefix_length)
        : 24,
      dns1: dns1 ? dns1 : '',
      dns2: dns2 ? dns2 : '',
    };
    const wifiNetworkInfo = {
      ip_assignment,
      static_ip: static_ip ? static_ip : '',
      gateway: gateway ? gateway : '',
      network_prefix_length: network_prefix_length
        ? subnetMaskCalc2(network_prefix_length)
        : 24,
      dns1: dns1 ? dns1 : '',
      dns2: dns2 ? dns2 : '',
      SSID,
      password,
    };
    if (networkType === 'ethernet') {
      try {
        const res1 = await axios.post(
          '/v1/eth/0/network',
          ethernetNetworkInfo,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res1.data.includes('Re-connect')) {
          const res2 = await axios.get('/v1/network_connected_state', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res2.data.value === 'true') {
            setTesting(false);
            setAllItemDisabled(true);
            setShowBtn(true);
          } else {
            message.error('Network test failed. Please try again.');
            setShowBtn(false);
          }
        }
      } catch (error) {
        if (error.message === 'Network Error') {
          const res = await axios.get('/v1/network_connected_state', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.value === 'true') {
            setTesting(false);
            setAllItemDisabled(true);
            setShowBtn(true);
          } else {
            message.error('Network test failed. Please try again.');
            setShowBtn(false);
          }
        } else {
          setTesting(false);
          message.error('Network setting failed. Please try again.');
          console.log(error);
        }
      }
    } else {
      try {
        const res1 = await axios.post('/v1/wifi/network', wifiNetworkInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res1.data.includes('Re-connect')) {
          const res2 = await axios.get('/v1/network_connected_state', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res2.data.value === 'true') {
            setTesting(false);
            setAllItemDisabled(true);
            setShowBtn(true);
          } else {
            message.error('Network test failed. Please try again.');
            setShowBtn(false);
          }
        }
      } catch (error) {
        if (error.message === 'Network Error') {
          const res = await axios.get('/v1/network_connected_state', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.value === 'true') {
            setTesting(false);
            setAllItemDisabled(true);
            setShowBtn(true);
          } else {
            message.error('Network test failed. Please try again.');
            setShowBtn(false);
          }
        } else {
          setTesting(false);
          message.error('Network setting failed. Please try again.');
          console.log(error);
        }
      }
    }
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 13 }}
      layout="horizontal"
      size="large"
      onFinish={handleSubmit}
      initialValues={{ networkType, ip_assignment: ipAssign, password: '' }}
    >
      <Item
        label={
          <span>
            <FormattedMessage id="app.networkType" />
          </span>
        }
        name="networkType"
      >
        <Group
          onChange={(e) => setNetworkType(e.target.value)}
          disabled={allItemDisabled}
        >
          <Radio value="ethernet">
            <FormattedMessage id="app.ethernet" />
          </Radio>
          <Radio value="wifi" disabled={deviceInfo.wifi_mac.includes('error')}>
            Wi-Fi
          </Radio>
        </Group>
      </Item>
      {networkType === 'wifi' && (
        <>
          <Item
            label={<span>SSID</span>}
            name="SSID"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.fieldRequired" />,
              },
            ]}
          >
            <Select disabled={allItemDisabled}>
              {apList.map((ap, i) => (
                <Select.Option key={i} value={ap}>
                  {ap}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              onClick={() => getApList()}
              disabled={allItemDisabled}
            >
              <FormattedMessage id="app.rescan" />
            </Button>
          </Item>
          <Item
            label={
              <span>
                <FormattedMessage id="app.password" />
              </span>
            }
            name="password"
          >
            <Input.Password disabled={allItemDisabled} />
          </Item>
        </>
      )}
      <Item
        label={
          <span>
            <FormattedMessage id="app.ipSetting" />
          </span>
        }
        name="ip_assignment"
      >
        <Group
          onChange={(e) => setIpAssign(e.target.value)}
          disabled={allItemDisabled}
        >
          <Radio value="dhcp">DHCP</Radio>
          <Radio value="static">
            <FormattedMessage id="app.staticIp" />
          </Radio>
        </Group>
      </Item>
      {ipAssign === 'static' && (
        <>
          <Item
            label={
              <span>
                <FormattedMessage id="app.ip" />
              </span>
            }
            name="static_ip"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.staticIpRule" />,
                pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
              },
            ]}
          >
            <Input placeholder="ex, 192.168.1.10" disabled={allItemDisabled} />
          </Item>
          <Item
            label={
              <span>
                <FormattedMessage id="app.gateway" />
              </span>
            }
            name="gateway"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.gatewayRule" />,
                pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
              },
            ]}
          >
            <Input placeholder="ex, 192.168.1.254" disabled={allItemDisabled} />
          </Item>
          <Item
            label={
              <span>
                <FormattedMessage id="app.mask" />
              </span>
            }
            name="network_prefix_length"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.maskRule" />,
                pattern: /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/gm,
              },
            ]}
          >
            <Input placeholder="ex, 255.255.255.0" disabled={allItemDisabled} />
          </Item>
        </>
      )}
      <Item
        label="DNS1"
        name="dns1"
        rules={[
          {
            message: <FormattedMessage id="app.dnsRule" />,
            pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
          },
        ]}
      >
        <Input placeholder="ex, 168.0.0.1" disabled={allItemDisabled} />
      </Item>
      <Item
        label="DNS2"
        name="dns2"
        rules={[
          {
            message: <FormattedMessage id="app.dns2Rule" />,
            pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
          },
        ]}
      >
        <Input placeholder="ex, 168.0.0.1" disabled={allItemDisabled} />
      </Item>
      <div className="steps-action">
        {!showBtn ? (
          <>
            <Button type="primary" htmlType="submit" disabled={testing}>
              {!testing ? (
                <>
                  <FormattedMessage id="app.networkTest" />
                </>
              ) : (
                <FormattedMessage id="app.networkTesting" />
              )}
            </Button>{' '}
            <span
              style={{
                fontSize: 14,
                margin: '10px 0 0 10px',
                color: 'blue',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => setCurrentStep(3)}
            >
              <FormattedMessage id="app.skip" />
            </span>
          </>
        ) : (
          <div>
            <p style={{ textAlign: 'center' }}>
              <CheckCircleTwoTone twoToneColor="#52c41a" />{' '}
              <FormattedMessage id="app.networkTestSuccess" />
            </p>
            <Button
              size="large"
              style={{ marginRight: 20 }}
              onClick={() => setCurrentStep(1)}
            >
              <FormattedMessage id="app.prev" />
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => setCurrentStep(3)}
            >
              <FormattedMessage id="app.next" />
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
};

export default StepContentThree;
