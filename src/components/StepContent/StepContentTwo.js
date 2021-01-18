import React, { useState } from 'react';
import { Input, Select, Form, Button, message, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

import { timezones } from '../../data/timezone';

const StepContentTwo = ({
  setCurrentStep,
  token,
  deviceInfo,
  setDeviceName,
  setTimezone,
  setContentURL,
  timezone,
}) => {
  const [playerRole, setPlayerRole] = useState('master');
  const { Option, OptGroup } = Select;
  const { Item } = Form;

  const handleSubmit = async (vals) => {
    try {
      const res1 = await axios.post(
        '/v1/device_name',
        { value: vals.deviceName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res2 = await axios.post(
        '/v1/time_zone',
        { value: vals.timezone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res4 = await axios.post(
        '/v1/player_role',
        { value: playerRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res3 = await axios.post(
        '/v1/content_url',
        { value: vals.contentURL },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (
        res1.data.includes('OK') &&
        res2.data.includes('Finish') &&
        res3.data.includes('OK') &&
        res4.data.includes('OK')
      ) {
        setCurrentStep(2);
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    deviceInfo && (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 13 }}
        layout="horizontal"
        size="large"
        onFinish={handleSubmit}
        initialValues={{
          deviceName:
            deviceInfo.device_name === ''
              ? deviceInfo.eth_mac
              : deviceInfo.device_name,
          timezone,
        }}
      >
        <Item
          label={
            <span>
              <FormattedMessage id="app.playerName" />
            </span>
          }
          name="deviceName"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="app.fieldRequired" />,
            },
          ]}
        >
          <Input onChange={(e) => setDeviceName(e.target.value)} />
        </Item>
        <Item
          label={
            <span>
              <FormattedMessage id="app.timeZone" />
            </span>
          }
          name="timezone"
        >
          <Select
            style={{ width: 200 }}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {timezones.map((el) => (
              <OptGroup label={el.country} key={el.country}>
                {el.timezone.map((zone) => (
                  <Option value={zone} key={zone}>
                    {zone}
                  </Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Item>
        <Item
          label={
            <span>
              <FormattedMessage id="app.deviceRole" />
            </span>
          }
        >
          <Radio.Group
            onChange={(e) => setPlayerRole(e.target.value)}
            defaultValue={playerRole}
          >
            <Radio value="master">Master</Radio>
            <Radio value="client">Client</Radio>
          </Radio.Group>
        </Item>
        {playerRole === 'client' && (
          <Item
            label={
              <span>
                <FormattedMessage id="app.contentUrl" />
              </span>
            }
            name="contentURL"
            rules={[
              {
                message: <FormattedMessage id="app.urlRule" />,
                pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/,
              },
            ]}
          >
            <Input
              placeholder="https://example.com"
              onChange={(e) => setContentURL(e.target.value)}
            />
          </Item>
        )}
        <div className="steps-action">
          <Button
            size="large"
            style={{ marginRight: 20 }}
            onClick={() => setCurrentStep(0)}
          >
            <FormattedMessage id="app.prev" />
          </Button>
          <Button type="primary" htmlType="submit" size="large">
            <FormattedMessage id="app.next" />
          </Button>
        </div>
      </Form>
    )
  );
};

export default StepContentTwo;
